import { colorLog } from "./log.js";
import { elements, setIsHeaderPinned, setIsHeaderUnpinned } from "./state.js";

const { header, tabsPanel, contentPanel, tabsPanelToggleButton } = elements;

/**
 * HIDE HEADER
 */
export function hideHeader() {
  colorLog.run("Running hideHeader()");
  header.classList.remove("is-pinned");
  header.classList.add("is-unpinned");
  setIsHeaderUnpinned(true);
  setIsHeaderPinned(false);
}

/**
 * HIDE SIDEBAR
 */
export function hideSidebar() {
  colorLog.run("Running hideSidebar();");
  const hideSidebarBtn = document.querySelector("#navbar-collapsor");
  const isSidebarOpen = hideSidebarBtn && !hideSidebarBtn.checked;
  if (isSidebarOpen) hideSidebarBtn.click();
}

/**
 * HIDE TABS PANEL
 */
export function hideTabsPanel() {
  colorLog.run("Running hideTabsPanel()");
  tabsPanel.classList.add("hidden", "panel-collapsed");
  contentPanel.classList.remove("halfWidth");
  tabsPanel.classList.remove("halfWidth");
  tabsPanelToggleButton.classList.remove("active");
}
