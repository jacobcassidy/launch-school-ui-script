import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function fixture() {
  const classes = new Set();
  const attributes = new Map();
  const header = {
    inert: false,
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
      contains(name) {
        return classes.has(name);
      },
    },
    contains(element) {
      return element === focusedElement;
    },
    setAttribute(name, value) {
      attributes.set(name, value);
    },
  };
  let blurred = false;
  const focusedElement = {
    blur() {
      blurred = true;
    },
  };
  const ui = { header: {} };
  const saved = new Map();
  const context = sourceContext("../src/js/modules/utils/state/setters/ui.js", {
    document: { activeElement: focusedElement },
    elements: { injected: { header }, native: {} },
    ui,
    sessionStorage: { setItem: (key, value) => saved.set(key, value) },
  });

  return { attributes, blurred: () => blurred, context, header, ui, saved };
}

test("hiding the header removes its controls from focus and the accessibility tree", () => {
  const { attributes, blurred, context, header, ui, saved } = fixture();
  context.setIsHeaderHidden(true);

  assert.equal(blurred(), true);
  assert.equal(header.classList.contains("is-hidden"), true);
  assert.equal(header.inert, true);
  assert.equal(attributes.get("aria-hidden"), "true");
  assert.equal(ui.header.isHidden, true);
  assert.equal(saved.get("isHeaderHidden"), true);
});

test("showing the header restores its controls to focus and the accessibility tree", () => {
  const { attributes, context, header, ui } = fixture();
  context.setIsHeaderHidden(true);
  context.setIsHeaderHidden(false);

  assert.equal(header.classList.contains("is-hidden"), false);
  assert.equal(header.inert, false);
  assert.equal(attributes.get("aria-hidden"), "false");
  assert.equal(ui.header.isHidden, false);
});
