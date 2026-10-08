import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function fixture(transitions, transitionDuration = "0s") {
  const timers = new Map();
  const attributes = new Map();
  const classes = new Set();
  let nextTimer = 1;
  let removed = false;
  const toast = {
    textContent: "",
    classList: {
      add: (value) => classes.add(value),
      remove: (value) => classes.delete(value),
    },
    getAnimations: () => transitions,
    remove: () => {
      removed = true;
    },
  };
  const container = {
    children: [],
    setAttribute: (name, value) => attributes.set(name, value),
    appendChild(element) {
      this.children.push(element);
    },
  };
  const context = sourceContext("../src/js/modules/utils/helpers/show.js", {
    document: {
      querySelector: () => container,
      createElement: () => toast,
    },
    elements: { injected: {} },
    window: { getComputedStyle: () => ({ transitionDuration }) },
    requestAnimationFrame: (callback) => callback(),
    setTimeout(callback, delay) {
      const id = nextTimer++;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  });

  context.showToast("Saved", null, 10);
  return {
    attributes,
    container,
    fireTimer(id) {
      const timer = timers.get(id);
      timers.delete(id);
      timer.callback();
      return timer.delay;
    },
    isRemoved: () => removed,
    timers,
  };
}

test("toasts announce politely and are removed when no transition runs", () => {
  const state = fixture([]);
  assert.equal(state.attributes.get("role"), "status");
  assert.equal(state.attributes.get("aria-live"), "polite");
  assert.equal(state.attributes.get("aria-atomic"), "true");
  assert.equal(state.container.children.length, 1);
  state.fireTimer(1);
  assert.equal(state.isRemoved(), true);
});

test("toast cleanup uses the computed transition duration if transition events are unavailable", () => {
  const state = fixture([], "500ms");
  state.fireTimer(1);
  assert.equal(state.isRemoved(), false);
  assert.equal(state.timers.get(2).delay, 600);
  state.fireTimer(2);
  assert.equal(state.isRemoved(), true);
});

test("toast cleanup follows transition completion and keeps a bounded fallback", async () => {
  let finish;
  const finished = new Promise((resolve) => {
    finish = resolve;
  });
  const state = fixture([{ transitionProperty: "opacity", finished }], "0.5s, 200ms");
  state.fireTimer(1);
  assert.equal(state.isRemoved(), false);
  assert.equal(state.timers.get(2).delay, 600);
  finish();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(state.isRemoved(), true);
  assert.equal(state.timers.has(2), false);
});

test("canceled toast transitions still remove the toast", async () => {
  const state = fixture([{ transitionProperty: "opacity", finished: Promise.reject(new Error("canceled")) }], "500ms");
  state.fireTimer(1);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(state.isRemoved(), true);
  assert.equal(state.timers.has(2), false);
});

test("toast fallback removes elements when a transition never completes", () => {
  const state = fixture([{ transitionProperty: "opacity", finished: new Promise(() => {}) }], "250ms");
  state.fireTimer(1);
  assert.equal(state.fireTimer(2), 350);
  assert.equal(state.isRemoved(), true);
});
