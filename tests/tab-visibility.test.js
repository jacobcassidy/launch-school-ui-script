import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("a revealed tab gets its tooltip and no longer has the hidden marker", () => {
  const classes = new Set();
  const attributes = new Map([["data-tab", "instructions"]]);
  const listeners = new Map();
  const tooltips = [];
  const observers = [];
  let isHidden = true;
  const tooltip = {
    dataset: {},
    classes,
    classList: { add: (...names) => names.forEach((name) => classes.add(name)) },
    offsetWidth: 40,
    style: {},
    textContent: "",
  };
  const tabNav = {
    querySelectorAll: () => [tabButton],
  };
  const tabButton = {
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
    },
    closest: () => tabNav,
    dataset: { tab: "instructions" },
    innerText: "Instructions",
    offsetWidth: 100,
    getAttribute: (name) => attributes.get(name) || null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
    replaceChildren() {},
    addEventListener: (type, callback) => listeners.set(type, callback),
    getBoundingClientRect: () => ({ left: 0, bottom: 20 }),
  };
  const document = {
    body: {
      appendChild(element) {
        if (!tooltips.includes(element)) tooltips.push(element);
      },
    },
    createElement: () => tooltip,
    querySelector: (selector) => tooltips.find((item) => item.classes.has(selector.slice(1))) || null,
    querySelectorAll: (selector) => (selector === ".tab-tooltip" ? [...tooltips] : [tabButton]),
  };
  const getComputedStyle = () => ({ display: isHidden ? "none" : "flex" });
  const tabContext = sourceContext("../src/js/modules/components/buttons/panels/tab.js", {
    document,
    getComputedStyle,
    icons: { tabIcons: { instructions: () => ({ classList: { add() {} } }) } },
  });
  const watcherContext = sourceContext("../src/js/modules/utils/watch/buttons/tab.js", {
    document,
    getComputedStyle,
    handleFocus() {},
    updateTabButtons: tabContext.updateTabButtons,
    syncAvailableShortcuts() {},
    injectShortcutsSection() {},
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
    },
  });

  tabContext.updateTabButtons();
  watcherContext.watchTabBtns();
  assert.ok(classes.has("is-hidden"));
  assert.equal(tooltips.length, 0);

  isHidden = false;
  observers[0].callback();

  assert.ok(!classes.has("is-hidden"));
  assert.equal(tooltips.length, 1);
  assert.doesNotThrow(() => listeners.get("mouseenter")());
});
