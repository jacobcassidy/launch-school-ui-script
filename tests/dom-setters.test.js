import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("DOM state setters expose only elements that the runtime stores", () => {
  const elements = { injected: {} };
  const setters = sourceContext("../src/js/modules/utils/state/setters/dom.js", { elements });
  assert.equal("setElementInstructionsPanel" in setters, false);
  assert.equal("setElementSidebarHiddenHeadersToggler" in setters, false);
});
