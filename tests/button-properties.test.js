import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("button properties add one icon even when no extra classes are requested", () => {
  const classes = new Set();
  const children = [];
  const button = {
    classList: {
      add(...names) {
        names.forEach((name) => classes.add(name));
      },
      contains: (name) => classes.has(name),
    },
    prepend(icon) {
      children.unshift(icon);
    },
  };
  const helper = sourceContext("../src/js/modules/utils/dom/buttons.js");
  let createdIcons = 0;
  const iconFactory = () => {
    createdIcons++;
    return { classList: { add() {} } };
  };

  helper.setButtonProperties([button], [iconFactory]);
  helper.setButtonProperties([button], [iconFactory]);

  assert.equal(createdIcons, 1);
  assert.equal(children.length, 1);
  assert.ok(classes.has("has-new-icon"));
});
