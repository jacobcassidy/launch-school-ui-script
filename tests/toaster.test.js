import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("repeated toaster setup reuses the existing container", () => {
  const containers = [];
  const body = {
    appendChild(element) {
      containers.push(element);
      return element;
    },
  };
  const context = sourceContext("../src/js/modules/components/toaster.js", {
    document: {
      body,
      createElement(tagName) {
        assert.equal(tagName, "div");
        return {
          classList: {
            add(className) {
              this.value = className;
            },
          },
        };
      },
      querySelector(selector) {
        assert.equal(selector, ".toast-container");
        return containers[0] || null;
      },
    },
  });

  const firstContainer = context.injectToaster();
  const reusedContainer = context.injectToaster();
  assert.equal(containers.length, 1);
  assert.equal(reusedContainer, firstContainer);
});
