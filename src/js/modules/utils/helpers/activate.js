/**
 * ACTIVATE
 * @module utils/helpers/activate
 */

// Import utils
import { shortcuts } from "../state/shortcuts.js";

/**
 * ACTIVATE SHORTCUT
 * Runs the callback function for the shortcut when triggered.
 *
 * @param {string} modifier The settings object's modifier key name being accessed [cmdCtrl, cmdOnly]
 * @param {string} eventCode The non-modifier key's event.code used for the shortcut
 */
export function activateShortcut(modifier, eventCode) {
  const keyEvents = shortcuts[modifier];

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
