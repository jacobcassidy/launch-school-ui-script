/**
 * HIDE HELPERS
 */
import { colorLog } from "./log.js";
import { setIsHeaderPinned, setIsHeaderUnpinned, setIsSidebarOpen, setIsTabsPanelOpen } from "./set.js";

/**
 * HIDE HEADER
 */
export function hideHeader() {
  colorLog.run("Running hideHeader()");
  setIsHeaderPinned(false);
  setIsHeaderUnpinned(true);
}

/**
 * HIDE SIDEBAR
 */
export function hideSidebar() {
  colorLog.run("Running hideSidebar();");
  setIsSidebarOpen(false);
}

/**
 * HIDE TABS PANEL
 */
export function hideTabsPanel() {
  colorLog.run("Running hideTabsPanel()");
  setIsTabsPanelOpen(false);
}
