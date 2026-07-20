/**
 * @module helpers/hide
 */

// import { colorLog } from "./log.js";
import { setIsHeaderHidden, setIsSidebarHidden, setIsTabsPanelHidden } from "./state.js";

/**
 * HIDE HEADER
 */
export function hideHeader() {
  // colorLog.run("Running hideHeader()");
  setIsHeaderHidden(true);
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
