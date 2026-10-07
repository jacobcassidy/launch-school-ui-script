import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function createTooltip() {
  const classes = new Set();
  return {
    classes,
    dataset: {},
    classList: { add: (...names) => names.forEach((name) => classes.add(name)) },
    remove() {
      const index = this.ownerTooltips.indexOf(this);
      if (index !== -1) this.ownerTooltips.splice(index, 1);
    },
  };
}

test("reloading hotkeys replaces the section with current entries", () => {
  const sections = [];
  const menu = {
    querySelectorAll: () => [...sections],
    appendChild(section) {
      sections.push(section);
    },
  };
  const hotkeys = {};
  const context = sourceContext("../src/js/modules/components/hotkeys-menu.js", {
    document: { querySelector: () => menu },
    hotkeys,
    createNewSettingsSection() {
      const section = {
        querySelector: () => ({}),
        remove() {
          sections.splice(sections.indexOf(section), 1);
        },
      };
      return section;
    },
  });
  context.injectHotkeysSection();
  const first = sections[0];
  context.injectHotkeysSection();
  assert.equal(sections.length, 1);
  assert.notEqual(sections[0], first);
});

test("repeated tab updates reuse tooltips and preserve the original label", () => {
  const tooltips = [];
  let buttons = [];
  const attributes = { "data-tab": "instructions" };
  const btn = {
    dataset: {},
    classList: { add() {}, remove() {} },
    innerText: "Custom Instructions",
    removeAttribute() {},
    getAttribute: (key) => attributes[key],
    setAttribute(key, value) {
      attributes[key] = value;
    },
    replaceChildren() {
      this.innerText = "";
    },
  };
  const document = {
    querySelectorAll(selector) {
      return selector === ".tab-tooltip" ? [...tooltips] : [...buttons];
    },
    querySelector(selector) {
      return tooltips.find((tooltip) => tooltip.classes.has(selector.slice(1))) || null;
    },
    createElement() {
      const tooltip = createTooltip();
      tooltip.ownerTooltips = tooltips;
      return tooltip;
    },
    body: {
      appendChild(el) {
        if (!tooltips.includes(el)) tooltips.push(el);
      },
    },
  };
  buttons = [btn];
  const context = sourceContext("../src/js/modules/components/buttons/panels/tab.js", {
    icons: { tabIcons: { instructions: () => ({}) } },
    getComputedStyle: () => ({ display: "block" }),
    document,
  });
  context.updateTabButtons();
  context.updateTabButtons();
  assert.equal(tooltips.length, 1);
  assert.equal(tooltips[0].textContent, "Custom Instructions");
  assert.equal(attributes["aria-label"], "Custom Instructions");
  assert.equal(tooltips[0].dataset.tabTooltipId, "instructions");

  const reviewAttributes = { "data-tab": "submit-review" };
  const reviewButton = {
    dataset: {},
    classList: { add() {}, remove() {} },
    innerText: "Submit Review",
    removeAttribute() {},
    getAttribute: (key) => reviewAttributes[key],
    setAttribute: (key, value) => {
      reviewAttributes[key] = value;
    },
    replaceChildren() {
      this.innerText = "";
    },
  };
  buttons = [reviewButton];
  context.icons.tabIcons.review = () => ({});
  context.updateTabButtons();
  assert.equal(tooltips.length, 1);
  assert.equal(tooltips[0].textContent, "Submit Review");
  assert.equal(tooltips[0].dataset.tabTooltipId, "submit-review");
});

test("unknown tab types keep their native label and content", () => {
  const attributes = { "data-tab": "new-feature" };
  let replaceChildrenCalls = 0;
  const btn = {
    classList: { add() {}, remove() {} },
    innerText: "New Feature",
    removeAttribute() {},
    getAttribute: (key) => attributes[key],
    setAttribute(key, value) {
      attributes[key] = value;
    },
    replaceChildren() {
      replaceChildrenCalls++;
    },
  };
  const tooltips = [];
  const document = {
    querySelectorAll(selector) {
      return selector === ".tab-tooltip" ? [...tooltips] : [btn];
    },
    querySelector: () => null,
    createElement: () => {
      const tooltip = createTooltip();
      tooltip.ownerTooltips = tooltips;
      return tooltip;
    },
    body: { appendChild: (el) => tooltips.push(el) },
  };
  const context = sourceContext("../src/js/modules/components/buttons/panels/tab.js", {
    icons: { tabIcons: {} },
    getComputedStyle: () => ({ display: "block" }),
    document,
  });

  context.updateTabButtons();

  assert.equal(replaceChildrenCalls, 0);
  assert.equal(btn.innerText, "New Feature");
  assert.equal(attributes["aria-label"], "New Feature");
  assert.equal(tooltips.length, 1);
});
