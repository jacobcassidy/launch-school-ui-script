import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("sidebar hidden headers setter stores the element under its declared state key", () => {
  const elements = { injected: {} };
  const setters = sourceContext("../src/js/modules/utils/state/setters/dom.js", { elements });
  const toggler = {};

  setters.setElementSidebarHiddenHeadersToggler(toggler);

  assert.equal(elements.injected.sidebarHiddenHeadersToggler, toggler);
  assert.equal("sidebarHiddenHeaderToggler" in elements.injected, false);
});
