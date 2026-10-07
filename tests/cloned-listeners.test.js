import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

for (const [file, property, flag, setter] of [
  ["settings-toggle.js", "settingsToggleButton", "settingsToggleBtnEventBound", "watchSettingsToggleBtn"],
  ["sidebar-toggle.js", "sidebarToggleButton", "sidebarToggleBtnEventBound", "watchSidebarToggleBtn"],
  ["tabs-panel-toggle.js", "tabsPanelToggleButton", "tabsPanelToggleBtnEventBound", "watchTabsPanelToggleBtn"],
]) {
  test(`${property} cloned with its old data flag receives a fresh listener`, () => {
    const createButton = () => ({
      dataset: { [flag]: "true" },
      listeners: [],
      addEventListener(type, callback) {
        this.listeners.push([type, callback]);
      },
    });
    const elements = { injected: { [property]: createButton() } };
    const context = sourceContext(`../src/js/modules/utils/watch/buttons/${file}`, {
      elements,
      toggleSettings() {},
      toggleSidebar() {},
      toggleTabsPanel() {},
    });
    const restoredClone = createButton();
    elements.injected[property] = restoredClone;

    const watch = context[setter];
    watch();
    watch();

    assert.equal(restoredClone.listeners.length, 1);
    assert.equal(restoredClone.dataset[flag], "true");
  });
}
