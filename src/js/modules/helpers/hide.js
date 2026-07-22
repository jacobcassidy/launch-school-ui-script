/**
 * HIDE
 * @module helpers/hide
 */

import { handleOutsideSettingsMenuClick } from "../settings-menu.js";
import { elements, setIsHeaderHidden, setIsSidebarHidden, setIsTabsPanelHidden } from "./state.js";

/**
 * HIDE HEADER
 */
export function hideHeader() {
  setIsHeaderHidden(true);
}

/**
 * HIDE SETTINGS MENU
 */
export function hideSettingsMenu() {
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
  setIsSidebarHidden(true);
}

/**
 * HIDE TABS PANEL
 */
export function hideTabsPanel() {
  setIsTabsPanelHidden(true);
}

/**
 * HIDE TABLE OF CONTENTS MENU
 */
export function hideTocMenu() {
  const tocBtn = elements.native.tocButton;
  if (tocBtn) tocBtn.click();
}
