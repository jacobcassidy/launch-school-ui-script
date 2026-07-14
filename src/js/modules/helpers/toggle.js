import { colorLog } from "./log.js";
import { showHeader, showSidebar, showTabsPanel } from "./show.js";
import { hideHeader, hideSidebar, hideTabsPanel } from "./hide.js";
import { getIsHeaderUnpinned } from "./state";
/**
 * TOGGLE
 */

/**
 * UPDATE SITE HEADER VISIBILITY
 */
// TODO - Update this
// export function updateHeaderVisibility() {
//   colorLog.run("Running updateHeaderVisibility()");

//   if (scrollContainer?.scrollTop <= 2) {
//     setIsHeaderTop(true);
//     setIsHeaderPinned(false);
//     setIsHeaderUnpinned(false);
//     showHeader();
//   } else {
//     if (isHeaderPinned || isHeaderUnpinned || !isHeaderTop) return;
//     setIsHeaderTop(false);
//     hideHeader();
//   }
// }

// TODO - Update this
// if (isHeaderHidden) {
//   header.classList.add("is-unpinned");
//   isHeaderPinned = false;
//   isHeaderUnpinned = true;
//   hideHeader();
// }

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

// TODO - Update this and include in injectHeader()
// Toggle Tabs Panel on button click
// tabsPanelToggleButton?.addEventListener("click", function () {
//   if (tabsPanel.classList.contains("hidden")) {
//     showTabsPanel();
//   } else {
//     hideTabsPanel();
//   }
// });
