import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("button properties add one icon even when no extra classes are requested", () => {
  const classes = new Set();
  const children = [];
  const button = {
    children,
    classList: {
      add(...names) {
        names.forEach((name) => classes.add(name));
      },
      contains: (name) => classes.has(name),
    },
    prepend(icon) {
      icon.remove = () => {
        const index = children.indexOf(icon);
        if (index !== -1) children.splice(index, 1);
      };
      children.unshift(icon);
    },
    querySelectorAll(selector) {
      assert.equal(selector, ":scope > .is-new-icon");
      return children.filter((child) => child.classes?.has("is-new-icon"));
    },
  };
  const helper = sourceContext("../src/js/modules/utils/dom/buttons.js");
  let createdIcons = 0;
  const iconFactory = () => {
    createdIcons++;
    const classes = new Set();
    return { classes, classList: { add: (...names) => names.forEach((name) => classes.add(name)) } };
  };

  helper.setButtonProperties([button], [iconFactory]);
  helper.setButtonProperties([button], [iconFactory]);

  assert.equal(createdIcons, 1);
  assert.equal(children.length, 1);
  assert.ok(classes.has("has-new-icon"));
});

test("button properties restore icons after native content replacement", () => {
  const children = [];
  const classes = new Set();
  const button = {
    classList: {
      add(...names) {
        names.forEach((name) => classes.add(name));
      },
      contains: (name) => classes.has(name),
    },
    prepend(icon) {
      icon.remove = () => {
        const index = children.indexOf(icon);
        if (index !== -1) children.splice(index, 1);
      };
      children.unshift(icon);
    },
    querySelectorAll(selector) {
      assert.equal(selector, ":scope > .is-new-icon");
      return children.filter((child) => child.classes.has("is-new-icon"));
    },
  };
  const helper = sourceContext("../src/js/modules/utils/dom/buttons.js");
  let createdIcons = 0;
  const iconFactory = () => {
    createdIcons++;
    const iconClasses = new Set();
    return { classes: iconClasses, classList: { add: (...names) => names.forEach((name) => iconClasses.add(name)) } };
  };

  helper.setButtonProperties([button], [iconFactory]);
  children.length = 0;
  helper.setButtonProperties([button], [iconFactory]);

  assert.equal(createdIcons, 2);
  assert.equal(children.length, 1);
  assert.ok(classes.has("has-new-icon"));
});
