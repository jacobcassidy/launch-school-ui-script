import assert from "node:assert/strict";
import test from "node:test";
import { Window } from "happy-dom";
import { sourceContext } from "./source-context.js";

function fixture() {
  const window = new Window();
  window.document.body.innerHTML = `
    <div class="book-repl-layout">
      <article class="book-content-panel half-width"></article>
      <div class="resize-handle" style="left: 0px"></div>
      <aside class="tabs-panel is-active half-width"></aside>
    </div><button class="active"></button>
  `;
  const content = window.document.querySelector("article");
  const panel = window.document.querySelector("aside");
  const button = window.document.querySelector("button");
  const elements = {
    native: { tabsPanel: panel, contentPanel: content },
    injected: { tabsPanelToggleButton: button },
  };
  const ui = { tabsPanel: { isHidden: false }, header: {}, sidebar: {} };
  const context = sourceContext("../src/js/modules/utils/state/setters/ui.js", {
    elements,
    ui,
    sessionStorage: window.sessionStorage,
  });
  return { window, content, panel, button, elements, ui, setHidden: context.setIsTabsPanelHidden };
}

function assertVisibility(f, hidden) {
  assert.equal(f.ui.tabsPanel.isHidden, hidden);
  assert.equal(f.window.sessionStorage.getItem("isTabsPanelHidden"), String(hidden));
  assert.equal(f.content.classList.contains("half-width"), !hidden);
  assert.equal(f.panel.classList.contains("half-width"), !hidden);
  assert.equal(f.panel.classList.contains("is-active"), !hidden);
  assert.equal(f.panel.classList.contains("hidden"), hidden);
  assert.equal(f.panel.classList.contains("panel-collapsed"), hidden);
  assert.equal(f.panel.inert, hidden);
  assert.equal(f.panel.getAttribute("aria-hidden"), String(hidden));
  assert.equal(f.button.classList.contains("active"), !hidden);
}

test("tabs panel and content width update immediately when hidden and shown", () => {
  const f = fixture();
  f.setHidden(true);
  assertVisibility(f, true);
  f.setHidden(false);
  assertVisibility(f, false);
  f.window.close();
});

test("repeated tabs panel toggles immediately leave the final requested state", () => {
  const f = fixture();
  for (const hidden of [true, true, false, true, false, false]) {
    f.setHidden(hidden);
    assertVisibility(f, hidden);
  }
  f.window.close();
});

for (const hidden of [true, false]) {
  test(`loaded tabs panel visibility restores ${hidden ? "hidden" : "shown"} preferences immediately`, () => {
    const f = fixture();
    f.setHidden(!hidden);
    f.ui.tabsPanel.isHidden = hidden;
    const loaded = sourceContext("../src/js/modules/utils/sync/loaded-elements-state.js", {
      elements: f.elements,
      ui: f.ui,
      setIsTabsPanelHidden: f.setHidden,
      hideHeader() {},
    });
    loaded.syncLoadedElementsState();
    assertVisibility(f, hidden);
    f.window.close();
  });
}
