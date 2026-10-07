/**
 * HOTKEYS SETTERS
 * @module utils/state/setters/hotkeys
 */

// Import States
import { hotkeys } from "../hotkeys.js";

/**
 * SET AVAILABLE HOTKEY
 *
 * @param {string} modifier The settings object's modifier key name being accessed [cmdCtrl, cmdOnly].
 * @param {string} key The event.code name for the key being pressed with the modifier keys.
 * @param {string|number} symbol The key symbol to displayed in the settings menu.
 * @param {string} label The hotkey label to displayed in the settings menu.
 * @param {() => void|null} callbackFunc The function that will run when the hotkey is triggered.
 */
export function setAvailableHotkey(modifier, key, symbol, label, callbackFunc = null) {
  let callback;
  if (!callbackFunc) {
    callback = null;
  } else {
    callback = () => callbackFunc();
  }

  hotkeys[modifier][key] = { callback: callback, label: label, symbol: symbol };
}
