/**
 * HIDE
 * @module utils/helpers/hide
 */

// Import components
// Import utils
import { elements } from "../state/dom.js";
import { setIsHeaderHidden, setIsSidebarCollapsed, setIsTabsPanelHidden } from "../state/setters/ui.js";

/**
 * HIDE HEADER
 */
export function hideHeader() {
  setIsHeaderHidden(true);
}

/**
 * HIDE SETTINGS
 */
export function hideSettings() {
  const settingsMenu = elements.injected.settingsMenu;
  const settingsToggleBtn = elements.injected.settingsToggleButton;
  if (!settingsMenu || !settingsToggleBtn) return;
  settingsMenu.classList.remove("active");
  settingsMenu.inert = true;
  settingsMenu.setAttribute("aria-hidden", "true");
  settingsToggleBtn.classList.remove("active");
  settingsToggleBtn.setAttribute("aria-expanded", "false");

  document.removeEventListener("pointerdown", handleOutsideSettingsMenuClick);
  document.removeEventListener("keydown", handleSettingsEsc);
}

/**
 * HANDLE OUTSIDE SETTINGS MENU CLICK
 */
export function handleOutsideSettingsMenuClick(e) {
  const settingsMenu = elements.injected.settingsMenu;
  const settingsMenuToggleBtn = elements.injected.settingsToggleButton;

  if (settingsMenu.contains(e.target) || settingsMenuToggleBtn.contains(e.target)) return;
  hideSettings();
}

/**
 * HANDLE ESCAPE KEY TO CLOSE SETTINGS
 */
export function handleSettingsEsc(e) {
  if (e.key === "Escape") hideSettings();
}

/**
 * HIDE SIDEBAR
 */
export function hideSidebar() {
  setIsSidebarCollapsed(true);
}

/**
 * HIDE TABS PANEL
 */
export function hideTabsPanel() {
  setIsTabsPanelHidden(true);
}

/**
 * HIDE TABLE OF CONTENTS CONTAINER
 */
export function hideTocMenu() {
  const tocBtn = elements.native.tocButton;
  if (tocBtn) tocBtn.click();
}
