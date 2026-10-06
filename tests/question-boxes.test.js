import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function fixture() {
  const listeners = {};
  let focusCalls = 0;
  const input = {
    addEventListener(event, callback) {
      listeners[event] = callback;
    },
    removeEventListener(event) {
      delete listeners[event];
    },
  };
  const button = { addEventListener() {} };
  const box = {
    dataset: {},
    querySelector: (selector) => (selector === ".lsbot-question-box-answer-input" ? input : button),
  };
  const context = sourceContext("../src/js/modules/utils/watch/events/question-boxes.js", {
    document: { querySelectorAll: () => [box], querySelector: () => ({}) },
    elements: { native: { tabsPanel: {} } },
    handleFocus() {
      focusCalls++;
    },
  });
  context.watchQuestionBoxes();
  listeners.focus();
  return { send: (event) => listeners.keydown(event), calls: () => focusCalls };
}

test("composition confirmation leaves focus alone for modern and legacy IME events", () => {
  const f = fixture();
  f.send({ key: "Enter", isComposing: true });
  f.send({ key: "Enter", keyCode: 229 });
  assert.equal(f.calls(), 0);
});

test("normal Enter submission shortcuts still focus LSBot", () => {
  const f = fixture();
  for (const modifiers of [{}, { metaKey: true }, { ctrlKey: true }]) f.send({ key: "Enter", ...modifiers });
  assert.equal(f.calls(), 3);
  f.send({ key: "Enter", shiftKey: true });
  assert.equal(f.calls(), 3);
});

test("missing question-box controls stay unbound and can be picked up on a later pass", () => {
  const inputListeners = {};
  let sendLink = null;
  const input = {
    addEventListener(event, callback) {
      inputListeners[event] = callback;
    },
    removeEventListener(event) {
      delete inputListeners[event];
    },
  };
  const box = {
    dataset: {},
    querySelector(selector) {
      if (selector === ".lsbot-question-box-answer-input") return input;
      if (selector === ".lsbot-question-link") return sendLink;
      return null;
    },
  };
  const context = sourceContext("../src/js/modules/utils/watch/events/question-boxes.js", {
    document: {
      querySelectorAll: () => [box],
      querySelector: () => ({}),
    },
    elements: { native: { tabsPanel: {} } },
    handleFocus() {},
  });

  assert.doesNotThrow(() => context.watchQuestionBoxes());
  assert.equal(box.dataset.questionInputEventBound, "true");
  assert.equal(box.dataset.questionLinkEventBound, undefined);

  let linkListeners = 0;
  sendLink = { addEventListener: () => linkListeners++ };
  context.watchQuestionBoxes();
  context.watchQuestionBoxes();
  assert.equal(box.dataset.questionLinkEventBound, "true");
  assert.equal(linkListeners, 1);
});
