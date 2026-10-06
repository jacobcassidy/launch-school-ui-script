import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("missing completion form does not abort initialization and can appear later", () => {
  let callback;
  let styled = 0;
  let hotkeysSynced = 0;
  let settingsRefreshed = 0;
  const context = sourceContext("../src/js/modules/components/buttons/panels/exercise-completion.js", {
    document: { querySelector: () => ({ querySelector: () => null }) },
    watchExerciseCompletionToggleBtn(fn) {
      callback = fn;
    },
    setButtonProperties() {
      styled++;
    },
    syncAvailableHotkeys() {
      hotkeysSynced++;
    },
    injectHotkeysSection() {
      settingsRefreshed++;
    },
  });
  context.updateExerciseCompletionButton();
  assert.equal(styled, 0);
  callback({ querySelectorAll: () => [{}], querySelector: () => null });
  assert.equal(styled, 1);
  assert.equal(hotkeysSynced, 1);
  assert.equal(settingsRefreshed, 1);
});

test("completion watcher binds once per panel and handles replacement forms", () => {
  let buttons = [{}];
  let form = { querySelectorAll: () => buttons };
  const panel = {
    querySelector(selector) {
      assert.equal(selector, ".gray-links form");
      return form;
    },
  };
  let currentPanel = panel;
  const observers = [];
  let updates = 0;
  const context = sourceContext("../src/js/modules/utils/watch/buttons/exercise-completion-toggle.js", {
    document: { querySelector: () => currentPanel },
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
    },
  });
  const update = () => {
    updates++;
  };
  context.watchExerciseCompletionToggleBtn(update);
  context.watchExerciseCompletionToggleBtn(update);
  assert.equal(observers.length, 1);
  observers[0].callback();
  assert.equal(updates, 0);
  form = {};
  form.querySelectorAll = () => buttons;
  observers[0].callback();
  assert.equal(updates, 1);
  form = null;
  observers[0].callback();
  assert.equal(updates, 2);
  form = { querySelectorAll: () => buttons };
  observers[0].callback();
  assert.equal(updates, 3);

  buttons = [{}];
  observers[0].callback();
  assert.equal(updates, 4);
  currentPanel = { querySelector: () => null };
  context.watchExerciseCompletionToggleBtn(update);
  assert.equal(observers.length, 2);
});
