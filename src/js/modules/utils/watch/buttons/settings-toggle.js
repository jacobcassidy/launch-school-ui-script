/**
 * WATCH SETTINGS TOGGLE BUTTON
 * @module utils/watch/buttons/settings-toggle
 */

// Import utils
import { elements } from "../../state/dom.js";
import { toggleSettings } from "../../helpers/toggle.js";

/**
 * Toggles the Settings Menu visibility when the settings toggle button is clicked.
 */
export function watchSettingsToggleBtn() {
  const settingsToggleBtn = elements.injected.settingsToggleButton;
  if (!settingsToggleBtn) {
    return;
  }

  if (settingsToggleBtn.dataset.settingsToggleBtnEventBound) {
    return;
  }
  settingsToggleBtn.dataset.settingsToggleBtnEventBound = "true";

  settingsToggleBtn.addEventListener("click", () => toggleSettings());
}
