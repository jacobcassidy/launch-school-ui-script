import { colorLog } from "./utility.js";
import { showHeader, showSidebar, showTabsPanel } from "./show.js";
import { hideHeader, hideSidebar, hideTabsPanel } from "./hide.js";
import { getIsHeaderUnpinned } from "./state";
/**
 * TOGGLE
 */

export function toggleHeader() {
  colorLog.run("Running toggleHeader()");
  const isHeaderClosed = getIsHeaderUnpinned();

  if (isHeaderClosed) {
    showHeader();
  } else {
    hideHeader();
  }
}

export function toggleSidebar() {
  colorLog.run("Running toggleSidebar()");

  const isSidebarClosed = document.querySelector("#navbar-collapsor").checked;

  if (isSidebarClosed) {
    showSidebar();
  } else {
    hideSidebar();
  }
}

export function toggleTabsPanel() {
  colorLog.run("Running toggleTabsPanel()");

  const isTabsPanelOpen = document.querySelector(".tabs-panel.half-width");

  if (isTabsPanelOpen) {
    hideTabsPanel();
  } else {
    showTabsPanel();
  }
}
