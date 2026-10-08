import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function fixture(hotkeys = { cmdOnly: {}, cmdShift: {}, cmdCtrl: {} }, platform = "MacIntel") {
  const listeners = {};
  const windowListeners = {};
  const activated = [];
  const toasts = [];
  const platformHelpers = sourceContext("../src/js/modules/utils/helpers/hotkeys.js", {
    navigator: { platform },
  });
  const context = sourceContext("../src/js/modules/utils/watch/events/hotkeys.js", {
    hotkeys,
    getHotkeyModifier: platformHelpers.getHotkeyModifier,
    window: {
      addEventListener: (event, callback) => {
        windowListeners[event] = callback;
      },
    },
    document: {
      documentElement: { dataset: {} },
      addEventListener(event, callback) {
        listeners[event] = callback;
      },
    },
    activateHotkey: (modifier, code) => activated.push([modifier, code]),
    showToast: (text) => toasts.push(text),
  });
  context.watchHotkeys();
  return {
    send: (event) =>
      listeners.keydown({ preventDefault() {}, stopPropagation() {}, stopImmediatePropagation() {}, ...event }),
    release: (event) => listeners.keyup(event),
    blur: () => windowListeners.blur(),
    activated,
    toasts,
  };
}

test("Windows uses Ctrl for the sidebar, Ctrl+Shift for panels, and Ctrl+Alt for actions", () => {
  const actionCodes = ["Digit1", "Digit9", "KeyC", "KeyE", "KeyM", "KeyN", "KeyR", "KeyT", "Comma"];
  const { send, activated } = fixture(
    {
      cmdOnly: { KeyB: {} },
      cmdShift: { Digit1: {}, Digit2: {} },
      cmdCtrl: Object.fromEntries(actionCodes.map((code) => [code, {}])),
    },
    "Win32",
  );
  const prevented = [];
  const trigger = (code, modifiers) => send({ code, ...modifiers, preventDefault: () => prevented.push(code) });
  trigger("KeyB", { ctrlKey: true });
  trigger("Digit1", { ctrlKey: true, shiftKey: true });
  trigger("Digit2", { ctrlKey: true, shiftKey: true });
  actionCodes.forEach((code) => trigger(code, { ctrlKey: true, altKey: true }));
  assert.deepEqual(activated, [
    ["cmdOnly", "KeyB"],
    ["cmdShift", "Digit1"],
    ["cmdShift", "Digit2"],
    ...actionCodes.map((code) => ["cmdCtrl", code]),
  ]);
  assert.equal(prevented.length, activated.length);
});

test("Windows leaves ordinary browser shortcuts and unmatched modifiers alone", () => {
  const { send, activated } = fixture(
    { cmdOnly: { KeyB: {} }, cmdShift: { Digit1: {} }, cmdCtrl: { KeyT: {} } },
    "Win32",
  );
  const events = [
    { code: "KeyC", ctrlKey: true },
    { code: "KeyS", ctrlKey: true },
    { code: "Digit1", ctrlKey: true },
    { code: "KeyT", ctrlKey: true },
    { code: "KeyT", ctrlKey: true, altKey: true, shiftKey: true },
    { code: "KeyT", metaKey: true, ctrlKey: true },
    { code: "KeyB", altKey: true },
    { code: "KeyB" },
  ];
  events.forEach((event) =>
    send({
      ...event,
      preventDefault() {
        assert.fail("ordinary shortcut was intercepted");
      },
    }),
  );
  assert.deepEqual(activated, []);
});

test("Windows AltGr typing is ignored, while explicit Ctrl+Alt remains usable after release or blur", () => {
  const { send, release, blur, activated } = fixture({ cmdOnly: {}, cmdShift: {}, cmdCtrl: { KeyE: {} } }, "Win32");
  const modifiers = { ctrlKey: true, altKey: true, getModifierState: (key) => key === "AltGraph" };
  send({ code: "AltRight", ...modifiers });
  send({ code: "KeyE", key: "€", ...modifiers });
  assert.deepEqual(activated, []);
  release({ code: "AltRight" });
  // Firefox may report AltGraph for an intentional Ctrl+Alt combination too.
  send({ code: "KeyE", ...modifiers });
  assert.deepEqual(activated, [["cmdCtrl", "KeyE"]]);
  send({ code: "AltRight", ...modifiers });
  blur();
  send({ code: "KeyE", ctrlKey: true, altKey: true });
  assert.equal(activated.length, 2);
});

for (const [platform, modifiers] of [
  ["MacIntel", { metaKey: true, ctrlKey: true }],
  ["Win32", { ctrlKey: true, altKey: true }],
]) {
  test(`composition and repeat events do not activate shortcuts on ${platform}`, () => {
    const { send, activated } = fixture({ cmdOnly: {}, cmdShift: {}, cmdCtrl: { KeyE: {} } }, platform);
    for (const extra of [{ repeat: true }, { isComposing: true }, { keyCode: 229 }]) {
      send({ code: "KeyE", ...modifiers, ...extra });
    }
    assert.deepEqual(activated, []);
  });
}

test("registered tab shortcuts beyond five are dispatched", () => {
  const { send, activated } = fixture({ cmdOnly: {}, cmdShift: {}, cmdCtrl: { Digit6: {}, Digit9: {} } });
  for (const code of ["Digit6", "Digit9"]) send({ metaKey: true, ctrlKey: true, code });
  assert.deepEqual(activated, [
    ["cmdCtrl", "Digit6"],
    ["cmdCtrl", "Digit9"],
  ]);
});

test("unregistered tab shortcuts and repeated key presses are ignored", () => {
  const { send, activated } = fixture();
  send({ metaKey: true, ctrlKey: true, code: "Digit6" });
  send({ metaKey: true, ctrlKey: true, code: "KeyC", repeat: true });
  assert.equal(activated.length, 0);
});

test("unavailable action shortcuts retain their explanatory toast", () => {
  const { send, toasts } = fixture();
  send({ metaKey: true, ctrlKey: true, code: "KeyC" });
  assert.deepEqual(toasts, ["No editor code available to copy on this page"]);
});

for (const available of [true, false]) {
  test(`Cmd+B is intercepted only when the sidebar shortcut exists (${available})`, () => {
    const { send, activated } = fixture({ cmdOnly: available ? { KeyB: {} } : {}, cmdShift: {}, cmdCtrl: {} });
    const calls = [];
    send({
      metaKey: true,
      code: "KeyB",
      preventDefault: () => calls.push("prevent"),
      stopPropagation: () => calls.push("stop"),
      stopImmediatePropagation: () => calls.push("stopImmediate"),
    });
    assert.deepEqual(calls, available ? ["prevent", "stop", "stopImmediate"] : []);
    assert.deepEqual(activated, available ? [["cmdOnly", "KeyB"]] : []);
  });
}
