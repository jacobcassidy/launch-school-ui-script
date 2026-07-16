/**
 * HIDE HELPERS
 */
import { colorLog } from "./log.js";
import { setIsHeaderPinned, setIsHeaderHidden, setIsSidebarHidden, setIsTabsPanelHidden } from "./set.js";

/**
 * HIDE HEADER
 */
export function hideHeader() {
  colorLog.run("Running hideHeader()");
  setIsHeaderPinned(false);
  setIsHeaderHidden(true);
}

/**
 * HIDE SIDEBAR
 */
export function hideSidebar() {
  colorLog.run("Running hideSidebar();");
  setIsSidebarHidden(true);
}

/**
 * HIDE TABS PANEL
 */
export function hideTabsPanel() {
  colorLog.run("Running hideTabsPanel()");
  setIsTabsPanelHidden(true);
}
