/**
 * TOGGLE
 * @module helpers/toggle
 */

import { colorLog } from "./log.js";
import { showHeader, showSettingsMenu, showSidebar, showTabsPanel } from "./show.js";
import { hideHeader, hideSettingsMenu, hideSidebar, hideTabsPanel } from "./hide.js";
import { elements, states } from "./state.js";

/**
 * TOGGLE HEADER
 */
export function toggleHeader() {
  // colorLog.run("Running toggleHeader()");
  const isHeaderHidden = states.isHeaderHidden;

  if (isHeaderHidden) {
    showHeader();
  } else {
    hideHeader();
  }
}

/**
 * TOGGLE SETTINGS MENU
 */
export function toggleSettingsMenu() {
  colorLog.run("Running toggleSettingsMenu()");
  if (elements.injected.settingsMenu.classList.contains("active")) {
    hideSettingsMenu();
  } else {
    showSettingsMenu();
  }
}

/**
 * TOGGLE SIDEBAR
 */
export function toggleSidebar() {
  // colorLog.run("Running toggleSidebar()");
  const isSidebarHidden = states.isSidebarHidden;

  if (isSidebarHidden) {
    showSidebar();
  } else {
    hideSidebar();
  }
}

/**
 * TOGGLE TABS PANEL
 */
export function toggleTabsPanel() {
  // colorLog.run("Running toggleTabsPanel()");
  const isTabsPanelHidden = states.isTabsPanelHidden;

  if (isTabsPanelHidden) {
    showTabsPanel();
  } else {
    hideTabsPanel();
  }
}
