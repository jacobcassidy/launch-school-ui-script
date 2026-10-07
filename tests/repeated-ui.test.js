import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

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
  const attributes = { "data-tab": "instructions" };
  const btn = {
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
  const context = sourceContext("../src/js/modules/components/buttons/panels/tab.js", {
    icons: { tabIcons: { instructions: () => ({}) } },
    getComputedStyle: () => ({ display: "block" }),
    document: {
      querySelectorAll: () => [btn],
      querySelector: () => tooltips[0] || null,
      createElement: () => ({ classList: { add() {} } }),
      body: {
        appendChild(el) {
          if (!tooltips.includes(el)) tooltips.push(el);
        },
      },
    },
  });
  context.updateTabButtons();
  context.updateTabButtons();
  assert.equal(tooltips.length, 1);
  assert.equal(tooltips[0].textContent, "Custom Instructions");
  assert.equal(attributes["aria-label"], "Custom Instructions");
});

test("unknown tab types keep their native label and content", () => {
  const attributes = { "data-tab": "new-feature" };
  let replaceChildrenCalls = 0;
  const btn = {
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
  const context = sourceContext("../src/js/modules/components/buttons/panels/tab.js", {
    icons: { tabIcons: {} },
    getComputedStyle: () => ({ display: "block" }),
    document: {
      querySelectorAll: () => [btn],
      querySelector: () => null,
      createElement: () => ({ classList: { add() {} } }),
      body: { appendChild: (el) => tooltips.push(el) },
    },
  });

  context.updateTabButtons();

  assert.equal(replaceChildrenCalls, 0);
  assert.equal(btn.innerText, "New Feature");
  assert.equal(attributes["aria-label"], "New Feature");
  assert.equal(tooltips.length, 1);
});
