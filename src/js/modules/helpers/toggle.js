/**
 * @module helpers/toggle
 */
// import { colorLog } from "./log.js";
import { showHeader, showSidebar, showTabsPanel } from "./show.js";
import { hideHeader, hideSidebar, hideTabsPanel } from "./hide.js";
import { states } from "./state.js";

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
