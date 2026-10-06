import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { sourceContext } from "./source-context.js";

class Element {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.attributes = {};
  }

  append(...elements) {
    this.children.push(...elements);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }
}

test("settings switch is a named, keyboard-focusable checkbox with a visible label", () => {
  const context = sourceContext("../src/js/modules/components/settings-menu.js", {
    document: {
      createElement: (tagName) => new Element(tagName),
    },
  });

  const setting = context.createNewSetting("Shrink sidebar when collapsed", "sidebar-shrink");
  const [toggler, description] = setting.children;
  const [input, label] = toggler.children;

  assert.equal(input.type, "checkbox");
  assert.equal(input.attributes["aria-labelledby"], description.id);
  assert.equal(description.id, "sidebar-shrink--description");
  assert.equal(description.innerText, "Shrink sidebar when collapsed");
  assert.equal(label.htmlFor, input.id);

  const togglerStyles = readFileSync(new URL("../src/css/components/toggler.css", import.meta.url), "utf8");
  assert.match(togglerStyles, /&:focus-visible\s*\+ label/);
  assert.doesNotMatch(togglerStyles, /input\s*\{\s*display:\s*none/);
});
