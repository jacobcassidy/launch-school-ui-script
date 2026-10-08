import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

for (const inputSelector of [".lsbot-question-input", ".lsbot-question-box-answer-input", null]) {
  test(`Enter shortcut listing with input: ${inputSelector}`, () => {
    const registered = [];
    const context = sourceContext("../src/js/modules/utils/sync/available-hotkeys.js", {
      hotkeys: {},
      elements: { native: {}, injected: {} },
      document: {
        querySelector: () => null,
        querySelectorAll(selector) {
          return inputSelector &&
            selector
              .split(",")
              .map((s) => s.trim())
              .includes(inputSelector)
            ? [{}]
            : [];
        },
      },
      setAvailableHotkey: (...args) => registered.push(args),
      syncHotkeyTooltips() {},
    });
    context.syncAvailableHotkeys();
    assert.equal(registered.length, inputSelector ? 1 : 0);
    if (inputSelector) assert.deepEqual(registered[0].slice(0, 3), ["enterOnly", "Enter", "Enter"]);
  });
}
