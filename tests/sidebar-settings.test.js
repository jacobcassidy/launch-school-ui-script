import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

for (const [setter, stateKey, className] of [
  ["setSettingSidebarHiddenHeaders", "isSettingSidebarHiddenHeadersOn", "hide-section-headers"],
  ["setSettingSidebarShrink", "isSettingSidebarShrinkOn", "shrink"],
]) {
  test(`${setter} saves preferences without a sidebar and applies them when present`, () => {
    const elements = { native: { sidebar: null } };
    const ui = { sidebar: {} };
    const saved = {};
    const context = sourceContext("../src/js/modules/utils/state/setters/ui.js", {
      elements,
      ui,
      sessionStorage: {
        setItem(key, value) {
          saved[key] = value;
        },
      },
    });
    context[setter](true);
    assert.equal(ui.sidebar[stateKey], true);
    assert.equal(saved[stateKey], true);
    const classes = new Set();
    elements.native.sidebar = { classList: { add: (x) => classes.add(x), remove: (x) => classes.delete(x) } };
    context[setter](true);
    assert.ok(classes.has(className));
    context[setter](false);
    assert.ok(!classes.has(className));
    assert.equal(saved[stateKey], false);
  });
}

test("tabs panel visibility setter tolerates missing native and injected panels", () => {
  const ui = { tabsPanel: {} };
  const saved = {};
  const context = sourceContext("../src/js/modules/utils/state/setters/ui.js", {
    elements: { native: { tabsPanel: null, contentPanel: null }, injected: { tabsPanelToggleButton: null } },
    ui,
    sessionStorage: {
      setItem(key, value) {
        saved[key] = value;
      },
    },
  });

  assert.doesNotThrow(() => context.setIsTabsPanelHidden(true));
  assert.equal(ui.tabsPanel.isHidden, true);
  assert.equal(saved.isTabsPanelHidden, true);
  assert.doesNotThrow(() => context.setIsTabsPanelHidden(false));
  assert.equal(ui.tabsPanel.isHidden, false);
  assert.equal(saved.isTabsPanelHidden, false);
});

test("sidebar collapse setter keeps the active state when the matching native control is missing", () => {
  const ui = { sidebar: {} };
  const context = sourceContext("../src/js/modules/utils/state/setters/ui.js", {
    document: {
      querySelector(selector) {
        if (selector === "#navbar-collapsor") return { checked: false };
        return null;
      },
    },
    elements: { native: {}, injected: {} },
    ui,
  });

  assert.doesNotThrow(() => context.setIsSidebarCollapsed(true));
  assert.equal(ui.sidebar.isCollapsed, true);
});
