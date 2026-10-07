import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

for (const checked of [true, false]) {
  test(`sidebar toggle follows the checkbox (${checked}) despite stale state`, () => {
    const actions = [];
    const context = sourceContext("../src/js/modules/utils/helpers/toggle.js", {
      document: { querySelector: () => ({ checked }) },
      showSidebar: () => actions.push("show"),
      hideSidebar: () => actions.push("hide"),
    });
    context.toggleSidebar();
    assert.deepEqual(actions, [checked ? "show" : "hide"]);
  });
}

test("sidebar toggle is harmless without a sidebar checkbox", () => {
  const context = sourceContext("../src/js/modules/utils/helpers/toggle.js", {
    document: { querySelector: () => null },
  });
  context.toggleSidebar();
});
