import assert from "node:assert/strict";
import test from "node:test";
import { setImmediate } from "node:timers/promises";
import { Window } from "happy-dom";
import { sourceContext } from "./source-context.js";

function deferredTransition() {
  let finish;
  let cancel;
  const finished = new Promise((resolve, reject) => {
    finish = resolve;
    cancel = reject;
  });
  return { transitionProperty: "transform", finished, finish, cancel };
}

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
  const handle = window.document.querySelector(".resize-handle");
  const elements = {
    native: { tabsPanel: panel, contentPanel: content },
    injected: { tabsPanelToggleButton: window.document.querySelector("button") },
  };
  const ui = { tabsPanel: { isHidden: false }, header: {}, sidebar: {} };
  const context = sourceContext("../src/js/modules/utils/state/setters/ui.js", {
    elements,
    ui,
    sessionStorage: window.sessionStorage,
  });
  panel.getBoundingClientRect = () => ({ width: 600 });
  let slides = [];
  panel.getAnimations = () => (slides.length ? [slides[0]] : []);
  handle.getAnimations = () => (slides.length ? [slides[1]] : []);
  return {
    window,
    content,
    panel,
    handle,
    elements,
    ui,
    setHidden: context.setIsTabsPanelHidden,
    beginSlide() {
      slides = [deferredTransition(), deferredTransition()];
      return slides;
    },
  };
}

test("closing keeps text at half width and both panels rendered until the panel and divider finish", async () => {
  const f = fixture();
  const [panelSlide, dividerSlide] = f.beginSlide();
  f.setHidden(true);
  assert.equal(f.ui.tabsPanel.isHidden, true);
  assert.equal(f.window.sessionStorage.getItem("isTabsPanelHidden"), "true");
  assert.ok(f.content.classList.contains("half-width"));
  assert.ok(f.panel.classList.contains("is-active"));
  assert.ok(f.panel.classList.contains("is-closing"));
  assert.equal(f.panel.classList.contains("hidden"), false);
  assert.equal(f.panel.classList.contains("panel-collapsed"), false);
  assert.equal(f.panel.inert, true);
  assert.equal(f.handle.style.getPropertyValue("--tabs-panel-slide-offset"), "600px");

  panelSlide.finish();
  await setImmediate();
  assert.ok(f.content.classList.contains("half-width"));
  assert.equal(f.panel.classList.contains("panel-collapsed"), false);
  dividerSlide.finish();
  await setImmediate();
  assert.equal(f.content.classList.contains("half-width"), false);
  assert.ok(f.panel.classList.contains("hidden"));
  assert.ok(f.panel.classList.contains("panel-collapsed"));
  assert.equal(f.panel.classList.contains("is-closing"), false);
  assert.equal(f.panel.classList.contains("is-active"), false);
  f.window.close();
});

test("rapid reopening and a subsequent close cannot be overwritten by an earlier completion", async () => {
  const f = fixture();
  const first = f.beginSlide();
  f.setHidden(true);
  f.setHidden(false);
  assert.equal(f.panel.inert, false);
  assert.equal(f.panel.getAttribute("aria-hidden"), "false");
  assert.ok(f.content.classList.contains("half-width"));
  first.forEach((slide) => slide.finish());
  await setImmediate();
  assert.ok(f.panel.classList.contains("is-active"));
  assert.equal(f.panel.classList.contains("panel-collapsed"), false);

  const second = f.beginSlide();
  f.setHidden(true);
  const third = f.beginSlide();
  f.setHidden(false);
  f.setHidden(true);
  second.forEach((slide) => slide.finish());
  await setImmediate();
  assert.ok(f.content.classList.contains("half-width"));
  assert.ok(f.panel.classList.contains("is-closing"));
  third.forEach((slide) => slide.finish());
  await setImmediate();
  assert.equal(f.content.classList.contains("half-width"), false);
  assert.ok(f.panel.classList.contains("panel-collapsed"));
  f.window.close();
});

test("a canceled animation still waits for the other moving element before completing", async () => {
  const f = fixture();
  const [panelSlide, dividerSlide] = f.beginSlide();
  f.setHidden(true);
  panelSlide.cancel(new Error("transition canceled"));
  await setImmediate();
  assert.ok(f.content.classList.contains("half-width"));
  assert.equal(f.panel.classList.contains("panel-collapsed"), false);
  dividerSlide.finish();
  await setImmediate();
  assert.equal(f.content.classList.contains("half-width"), false);
  assert.ok(f.panel.classList.contains("panel-collapsed"));
  f.window.close();
});

test("zero-duration slides and restored page preferences settle immediately", () => {
  const f = fixture();
  f.setHidden(true);
  assert.ok(f.panel.classList.contains("panel-collapsed"));
  f.setHidden(false);
  assert.ok(f.content.classList.contains("half-width"));
  assert.ok(f.panel.classList.contains("is-active"));
  f.ui.tabsPanel.isHidden = true;
  f.beginSlide();
  const loaded = sourceContext("../src/js/modules/utils/sync/loaded-elements-state.js", {
    elements: f.elements,
    ui: f.ui,
    setIsTabsPanelHidden: f.setHidden,
    hideHeader() {},
  });
  loaded.syncLoadedElementsState();
  assert.ok(f.panel.classList.contains("panel-collapsed"));
  assert.equal(f.content.classList.contains("half-width"), false);
  f.window.close();
});

test("an outgoing page's animation cannot resize panels on a newly rendered page", async () => {
  const f = fixture();
  const oldSlides = f.beginSlide();
  f.setHidden(true);
  f.window.document.body.innerHTML =
    '<article class="book-content-panel half-width"></article><aside class="tabs-panel is-active half-width"></aside>';
  f.elements.native.contentPanel = f.window.document.querySelector("article");
  f.elements.native.tabsPanel = f.window.document.querySelector("aside");
  f.setHidden(false, { animate: false });
  oldSlides.forEach((slide) => slide.finish());
  await setImmediate();
  assert.ok(f.elements.native.contentPanel.classList.contains("half-width"));
  assert.ok(f.elements.native.tabsPanel.classList.contains("is-active"));
  f.window.close();
});
