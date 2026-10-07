/**
 * WATCH SETTINGS TOGGLE BUTTON
 * @module utils/watch/buttons/settings-toggle
 */

// Import utils
import { elements } from "../../state/dom.js";
import { toggleSettings } from "../../helpers/toggle.js";

const watchedSettingsToggleButtons = new WeakSet();

/**
 * Toggles the Settings Menu visibility when the settings toggle button is clicked.
 */
export function watchSettingsToggleBtn() {
  const settingsToggleBtn = elements.injected.settingsToggleButton;
  if (!settingsToggleBtn) {
    return;
  }

  if (watchedSettingsToggleButtons.has(settingsToggleBtn)) return;
  watchedSettingsToggleButtons.add(settingsToggleBtn);

  settingsToggleBtn.addEventListener("click", () => toggleSettings());
}
