/**
 * SETTINGS MENU
 * @module settings-menu
 */
import { hideSettingsMenu } from "./helpers/hide";
import { elements } from "./helpers/state";

/**
 * INJECT SETTINGS MENU
 * Injects the settings menu element into the .site-header
 *
 * @param {HTMLElement} containerEl The container (.site-header) to which the menu will be appended.
 */
export function injectSettingsMenu(containerEl) {
  const createSettingsMenu = () => {
    const settingsMenuEl = document.createElement("div");
    settingsMenuEl.classList.add("settings-menu", "dropdown-menu");
    const settingsMenuHeaderEl = document.createElement("h2");
    settingsMenuHeaderEl.classList.add("setting-menu__title");
    settingsMenuHeaderEl.innerText = "Settings";
    settingsMenuEl.append(settingsMenuHeaderEl);
    return settingsMenuEl;
  };

  containerEl.append(createSettingsMenu());
}

/**
 * HANDLE OUTSIDE SETTINGS MENU CLICK
 */
export function handleOutsideSettingsMenuClick(e) {
  const settingsMenu = elements.injected.settingsMenu;
  const settingsMenuToggleBtn = elements.injected.settingsToggleButton;

  if (settingsMenu.contains(e.target) || settingsMenuToggleBtn.contains(e.target)) return;
  hideSettingsMenu();
}
