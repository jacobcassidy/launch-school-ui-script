/**
 * ACTIVATE
 * @module helpers/activate
 */

import { states } from "./state";

/**
 * ACTIVATE HOTKEY
 * Runs the callback function for the hotkey when triggered.
 *
 * @param {string} modifier The settings object's modifier key name being accessed [cmdShift, cmdCtrl]
 * @param {string} eventCode The non-modifier key's event.code used for the hotkey
 */
export function activateHotkey(modifier, eventCode) {
  const keyEvents = states.hotkeys[modifier];

  for (const [key, keyObj] of Object.entries(keyEvents)) {
    if (key === eventCode) {
      keyObj.callback();
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
  tabBtn.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );

  tabBtn.click();
}
