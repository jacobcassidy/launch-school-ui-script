/**
 * ACTIVATE
 * @module helpers/activate
 */

// import { colorLog } from "./log";
import { states } from "./state";

/**
 * ACTIVATES HOTKEY
 * Runs the callback function for the hotkey.
 *
 * @param {string} modifier The settings object's modifier key name being accessed [cmdShift, cmdCtrl]
 * @param {string} eventCode The non-modifier key's event.code used for the hotkey
 */
export function activateHotkey(modifier, eventCode) {
  const keyEvents = states.hotkeys[modifier];

  for (const [key, keyObj] of Object.entries(keyEvents)) {
    if (key === eventCode) {
      keyObj.callback;
    }
  }
}

/**
 * ACTIVATE TAB
 * Activates the selected tab button and matching tab content container
 *
 * @param {HTMLElement} tabBtn The selected .tab-button element
 */
export function activateTab(tabBtn) {
  // colorLog.run("Running activateTab()");

  tabBtn.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );

  tabBtn.click();
}
