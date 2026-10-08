/**
 * SETTINGS TOGGLE BUTTON
 * @module components/buttons/header/settings-toggle
 */

// Import components
import { icons } from "../../icons.js";

/**
 * INJECT SETTINGS TOGGLE BUTTON
 * Injects a button.btn--toggle-settings element in the .site-header to toggle the Settings visibility when clicked.
 *
 * @param {HTMLElement} containerEl The container to which the button will be appended.
 */
export function injectSettingsToggleButton(containerEl) {
  containerEl.appendChild(createSettingsToggleButton());
}

function createSettingsToggleButton() {
  const settingsToggleButtonEl = document.createElement("button");
  settingsToggleButtonEl.classList.add("site-header__button", "btn--toggle-settings", "has-dropdown");
  settingsToggleButtonEl.title = "Toggle Settings Visibility";
  settingsToggleButtonEl.setAttribute("aria-label", "Toggle Settings Visibility");
  settingsToggleButtonEl.setAttribute("aria-controls", "ls-ux-settings-menu");
  settingsToggleButtonEl.setAttribute("aria-expanded", "false");
  settingsToggleButtonEl.appendChild(icons.headerIcons.settings());

  return settingsToggleButtonEl;
}
