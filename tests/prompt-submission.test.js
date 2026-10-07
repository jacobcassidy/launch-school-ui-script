import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function fixture({ promptInitiallyFocused = false } = {}) {
  let onFocus;
  let observer;
  let refocuses = 0;
  const listeners = new Set();
  const prompt = {
    dataset: {},
    disabled: false,
    isConnected: true,
    addEventListener(event, fn) {
      onFocus = fn;
    },
    focus() {
      refocuses++;
    },
  };
  const body = {};
  const document = {
    body,
    activeElement: promptInitiallyFocused ? prompt : body,
    querySelectorAll: () => [prompt],
    addEventListener(event, fn) {
      listeners.add(fn);
    },
    removeEventListener(event, fn) {
      listeners.delete(fn);
    },
  };
  const context = sourceContext("../src/js/modules/utils/watch/events/prompt-submission.js", {
    document,
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        observer = this;
      }
      observe() {
        this.active = true;
      }
      disconnect() {
        this.active = false;
      }
    },
  });
  context.watchPromptSubmission();
  if (!promptInitiallyFocused) onFocus();
  return {
    prompt,
    document,
    listeners,
    mutate() {
      if (observer.active) observer.callback();
    },
    focusElsewhere(target) {
      document.activeElement = target;
      for (const fn of [...listeners]) fn({ target });
    },
    refocuses: () => refocuses,
  };
}

test("refocuses a re-enabled prompt when disabling it left focus on the body", () => {
  const f = fixture();
  f.prompt.disabled = true;
  f.mutate();
  f.prompt.disabled = false;
  f.mutate();
  assert.equal(f.refocuses(), 1);
  assert.equal(f.listeners.size, 0);
});

test("a prompt already focused during setup is observed for submission", () => {
  const f = fixture({ promptInitiallyFocused: true });
  f.prompt.disabled = true;
  f.mutate();
  f.prompt.disabled = false;
  f.mutate();
  assert.equal(f.refocuses(), 1);
});

test("switching controls cancels refocus even if that control later blurs", () => {
  const f = fixture();
  f.prompt.disabled = true;
  f.mutate();
  f.focusElsewhere({});
  f.document.activeElement = f.document.body;
  f.prompt.disabled = false;
  f.mutate();
  assert.equal(f.refocuses(), 0);
  assert.equal(f.listeners.size, 0);
});

test("another active control is protected even before the disabled mutation is delivered", () => {
  const f = fixture();
  f.document.activeElement = {};
  f.mutate();
  assert.equal(f.refocuses(), 0);
});

test("detached prompts are not refocused", () => {
  const f = fixture();
  f.prompt.isConnected = false;
  f.mutate();
  assert.equal(f.refocuses(), 0);
});
