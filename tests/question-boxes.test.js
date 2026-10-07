import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function fixture() {
  const listeners = {};
  const focusedTabs = [];
  let button = {};
  let tab = null;
  const input = {
    matches: (selector) => selector === ".lsbot-question-box-answer-input",
  };
  const box = {
    dataset: {},
    addEventListener(event, callback) {
      listeners[event] = callback;
    },
    contains: (target) => target === button,
    querySelector: (selector) => (selector === ".lsbot-question-box-answer-input" ? input : button),
  };
  const context = sourceContext("../src/js/modules/utils/watch/events/question-boxes.js", {
    document: {
      activeElement: input,
      querySelectorAll: () => [box],
      querySelector: () => tab,
    },
    elements: { native: { tabsPanel: {} } },
    handleFocus: (target) => focusedTabs.push(target),
  });
  context.watchQuestionBoxes();

  return {
    send(event) {
      listeners.keydown({ target: input, ...event });
    },
    click() {
      listeners.click({ target: { closest: () => button } });
    },
    replaceButton() {
      button = {};
    },
    replaceTab(nextTab) {
      tab = nextTab;
    },
    focusedTabs,
  };
}

test("composition confirmation leaves focus alone for modern and legacy IME events", () => {
  const f = fixture();
  f.send({ key: "Enter", isComposing: true });
  f.send({ key: "Enter", keyCode: 229 });
  assert.equal(f.focusedTabs.length, 0);
});

test("normal Enter submission shortcuts still focus LSBot", () => {
  const f = fixture();
  f.replaceTab({ id: "current-tab" });
  for (const modifiers of [{}, { metaKey: true }, { ctrlKey: true }]) f.send({ key: "Enter", ...modifiers });
  assert.equal(f.focusedTabs.length, 3);
  f.send({ key: "Enter", shiftKey: true });
  assert.equal(f.focusedTabs.length, 3);
});

test("delegated events handle replaced question controls and find the current LSBot tab", () => {
  const f = fixture();
  f.replaceTab({ id: "current-tab" });
  f.replaceButton();
  f.click();

  assert.deepEqual(f.focusedTabs, [{ id: "current-tab" }]);
});

test("delegated question controls can be added after setup", () => {
  const f = fixture();
  f.replaceButton();
  f.send({ key: "Enter" });
  f.click();
  assert.equal(f.focusedTabs.length, 0);

  f.replaceTab({ id: "late-tab" });
  f.send({ key: "Enter" });
  f.click();

  assert.deepEqual(f.focusedTabs, [{ id: "late-tab" }, { id: "late-tab" }]);
});
