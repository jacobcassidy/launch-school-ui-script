import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("shortcut display and event matching agree across current and fallback browser platform metadata", () => {
  const browsers = [
    [{ userAgentData: { platform: "Windows" }, platform: "MacIntel" }, false],
    [{ userAgentData: { platform: "macOS" }, platform: "Win32" }, true],
    [{ platform: "Win32" }, false],
    [{ platform: "MacIntel" }, true],
    [{ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }, false],
    [{ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)" }, true],
    [undefined, false],
  ];
  browsers.forEach(([navigator, isMac]) => {
    const helpers = sourceContext("../src/js/modules/utils/helpers/shortcuts.js", { navigator });
    const modifiers = isMac ? { metaKey: true, ctrlKey: true } : { ctrlKey: true, altKey: true };
    const keys = Array.from(helpers.getShortcutKeys("cmdCtrl", ","));
    assert.deepEqual(keys, isMac ? ["⌘", "⌃", ","] : ["⌃", "⎇", ","]);
    assert.deepEqual(
      Array.from(helpers.getShortcutKeys("cmdCtrl", ",", { symbols: false })),
      isMac ? ["Cmd", "Ctrl", ","] : ["Ctrl", "Alt", ","],
    );
    assert.deepEqual(Array.from(helpers.getShortcutKeys("cmdShift", 2)), isMac ? ["⌘", "⇧", "2"] : ["⌃", "⇧", "2"]);
    assert.equal(helpers.getShortcutModifier(modifiers), "cmdCtrl");
    assert.equal(helpers.getShortcutModifier({ ...modifiers, shiftKey: true }), null);
    assert.deepEqual(Array.from(helpers.getShortcutKeys("enterOnly", "Enter")), ["Enter"]);
  });
});
