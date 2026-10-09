/**
 * SHORTCUTS SETTERS
 * @module utils/state/setters/shortcuts
 */

// Import States
import { shortcuts } from "../shortcuts.js";

/**
 * SET AVAILABLE SHORTCUT
 *
 * @param {string} modifier The settings object's modifier key name being accessed [cmdCtrl, cmdOnly].
 * @param {string} key The event.code name for the key being pressed with the modifier keys.
 * @param {string|number} symbol The key symbol to displayed in the settings menu.
 * @param {string} label The shortcut label to displayed in the settings menu.
 * @param {() => void|null} callbackFunc The function that will run when the shortcut is triggered.
 * @param {Array<HTMLElement>} buttons Buttons whose tooltips should show this shortcut.
 */
export function setAvailableShortcut(modifier, key, symbol, label, callbackFunc = null, buttons = []) {
  let callback;
  if (!callbackFunc) {
    callback = null;
  } else {
    callback = () => callbackFunc();
  }

  shortcuts[modifier][key] = { callback: callback, label: label, symbol: symbol, buttons: buttons };
}
