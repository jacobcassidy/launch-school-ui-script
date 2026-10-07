import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function fixture() {
  const frames = [];
  const ui = { load: { isReloadScheduled: false, lastUrl: "/old", previousBody: {} } };
  let loads = 0;
  const context = sourceContext("../src/js/modules/utils/helpers/reload.js", {
    ui,
    location: { origin: "https://launchschool.com", pathname: "/new", search: "?track=python" },
    document: { body: ui.load.previousBody },
    requestAnimationFrame(callback) {
      frames.push(callback);
    },
    setIsReloadScheduled(value) {
      ui.load.isReloadScheduled = value;
    },
    setLastUrl(value) {
      ui.load.lastUrl = value;
    },
  });
  context.setLoadUIHandler(() => {
    loads++;
  });
  return { context, frames, ui, loads: () => loads };
}

test("same-body navigation reloads on the next frame and coalesces pending calls", () => {
  const { context, frames, ui, loads } = fixture();
  context.scheduleReload();
  context.scheduleReload();
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(loads(), 1);
  assert.equal(ui.load.lastUrl, "https://launchschool.com/new?track=python");
  assert.equal(ui.load.isReloadScheduled, false);
});

test("a failed reload does not block future navigation", () => {
  const { context, frames, ui } = fixture();
  context.setLoadUIHandler(() => {
    throw new Error("render failed");
  });
  context.scheduleReload();
  assert.throws(() => frames.shift()(), /render failed/);
  assert.equal(ui.load.isReloadScheduled, false);
  context.scheduleReload();
  assert.equal(frames.length, 1);
});

test("Turbo rendering after a history reload schedules a fresh pass at the same URL", () => {
  const { context, frames, ui, loads } = fixture();
  const listeners = {};
  const watcher = sourceContext("../src/js/modules/utils/watch/events/url-change.js", {
    ui,
    location: context.location,
    scheduleReload: context.scheduleReload,
    history: { pushState() {}, replaceState() {} },
    window: { addEventListener() {} },
    document: {
      documentElement: { dataset: {} },
      addEventListener(event, callback) {
        listeners[event] = callback;
      },
    },
  });
  watcher.watchForUrlChange();
  watcher.history.pushState();
  frames.shift()();
  assert.equal(loads(), 1);
  watcher.history.replaceState();
  assert.equal(frames.length, 0);
  listeners["turbo:render"]();
  listeners["turbo:load"]();
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(loads(), 2);
});

test("query-only history navigation reloads page-specific UI state", () => {
  const { context, frames, ui, loads } = fixture();
  ui.load.lastUrl = "https://launchschool.com/new?track=python";
  const history = {
    pushState(_state, _title, nextSearch) {
      context.location.search = nextSearch;
    },
    replaceState(_state, _title, nextSearch) {
      context.location.search = nextSearch;
    },
  };
  const watcher = sourceContext("../src/js/modules/utils/watch/events/url-change.js", {
    ui,
    location: context.location,
    scheduleReload: context.scheduleReload,
    history,
    window: { addEventListener() {} },
    document: { documentElement: { dataset: {} }, addEventListener() {} },
  });

  watcher.watchForUrlChange();
  watcher.history.replaceState({}, "", "?track=javascript");

  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(loads(), 1);
  assert.equal(ui.load.lastUrl, "https://launchschool.com/new?track=javascript");
});
