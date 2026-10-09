import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function setup() {
  let observerCallback;
  let observeCount = 0;
  let currentButton = null;
  let links = [];
  let shortcutSyncCount = 0;
  let settingsRefreshCount = 0;
  const instructionsTab = {};
  const elements = { native: { nextExerciseButton: null } };

  const context = sourceContext("../src/js/modules/utils/watch/buttons/next-exercise.js", {
    document: {
      querySelector: () => instructionsTab,
      querySelectorAll: () => links,
    },
    MutationObserver: class {
      constructor(callback) {
        observerCallback = callback;
      }
      observe(target, options) {
        assert.equal(target, instructionsTab);
        assert.equal(options.childList, true);
        assert.equal(options.subtree, true);
        observeCount++;
      }
    },
    elements,
    updateNextExerciseButton() {
      currentButton = links.find((link) => link.textContent.includes("Go to the next exercise")) || null;
      elements.native.nextExerciseButton = currentButton;
    },
    syncAvailableShortcuts() {
      shortcutSyncCount++;
    },
    injectShortcutsSection() {
      settingsRefreshCount++;
    },
  });

  return {
    context,
    elements,
    setLinks(value) {
      links = value;
    },
    triggerMutation() {
      observerCallback();
    },
    get counts() {
      return { observeCount, shortcutSyncCount, settingsRefreshCount };
    },
  };
}

test("watcher observes before a next-exercise link exists and updates shortcut state on insertion and removal", () => {
  const fixture = setup();
  fixture.context.watchNextExerciseBtn();
  assert.equal(fixture.counts.observeCount, 1);
  assert.equal(fixture.elements.native.nextExerciseButton, null);

  const firstLink = { textContent: "Go to the next exercise" };
  fixture.setLinks([firstLink]);
  fixture.triggerMutation();
  assert.equal(fixture.elements.native.nextExerciseButton, firstLink);
  assert.equal(fixture.counts.shortcutSyncCount, 1);
  assert.equal(fixture.counts.settingsRefreshCount, 1);

  fixture.setLinks([]);
  fixture.triggerMutation();
  assert.equal(fixture.elements.native.nextExerciseButton, null);
  assert.equal(fixture.counts.shortcutSyncCount, 2);
  assert.equal(fixture.counts.settingsRefreshCount, 2);
});

test("watcher refreshes replacements once and repeated setup does not add observers", () => {
  const fixture = setup();
  fixture.context.watchNextExerciseBtn();
  fixture.context.watchNextExerciseBtn();
  assert.equal(fixture.counts.observeCount, 1);

  const firstLink = { textContent: "Go to the next exercise" };
  fixture.setLinks([firstLink]);
  fixture.triggerMutation();
  const replacementLink = { textContent: "Go to the next exercise" };
  fixture.setLinks([replacementLink]);
  fixture.triggerMutation();
  assert.equal(fixture.elements.native.nextExerciseButton, replacementLink);
  assert.equal(fixture.counts.shortcutSyncCount, 2);
  assert.equal(fixture.counts.settingsRefreshCount, 2);

  fixture.triggerMutation();
  assert.equal(fixture.counts.shortcutSyncCount, 2);
});
