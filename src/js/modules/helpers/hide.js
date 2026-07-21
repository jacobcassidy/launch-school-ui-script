/**
 * HIDE
 * @module helpers/hide
 */

// import { colorLog } from "./log.js";
import { handleOutsideSettingsMenuClick } from "./settings.js";
import { elements, setIsHeaderHidden, setIsSidebarHidden, setIsTabsPanelHidden } from "./state.js";

/**
 * HIDE HEADER
 */
export function hideHeader() {
  // colorLog.run("Running hideHeader()");
  setIsHeaderHidden(true);
}

/**
 * HIDE SETTINGS MENU
 */
export function hideSettingsMenu() {
  // colorLog.run("Running hideSettingsMenu()");
  const settingsMenu = elements.injected.settingsMenu;
  const settingsMenuToggleBtn = elements.injected.settingsToggleButton;
  settingsMenu.classList.remove("active");
  settingsMenuToggleBtn.classList.remove("active");

  document.removeEventListener("pointerdown", handleOutsideSettingsMenuClick);
}

/**
 * HIDE SIDEBAR
 */
export function hideSidebar() {
  // colorLog.run("Running hideSidebar();");
  setIsSidebarHidden(true);
}

/**
 * HIDE TABS PANEL
 */
export function hideTabsPanel() {
  // colorLog.run("Running hideTabsPanel()");
  setIsTabsPanelHidden(true);
}
