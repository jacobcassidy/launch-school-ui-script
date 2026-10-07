/**
 * UI SETTERS
 * @module utils/state/setters/ui
 */

// Import States
import { elements } from "../dom.js";
import { ui } from "../ui.js";

/**
 * SET IS HEADER HIDDEN
 */
export function setIsHeaderHidden(value) {
  if (value === true) {
    elements.injected.header.classList.add("is-hidden");
  } else {
    elements.injected.header.classList.remove("is-hidden");
  }

  ui.header.isHidden = value;
  sessionStorage.setItem("isHeaderHidden", value);
}

/**
 * SET IS RELOAD SCHEDULED
 */
export function setIsReloadScheduled(value) {
  ui.load.isReloadScheduled = value;
}

/**
 * SET IS SIDEBAR COLLAPSED
 */
export function setIsSidebarCollapsed(value) {
  const sidebarCollapseCheckbox = document.querySelector("#navbar-collapsor");

  // This page does not include the native sidebar control.
  if (!sidebarCollapseCheckbox) {
    return;
  }

  const isActiveSidebar = !sidebarCollapseCheckbox.checked;
  if (isActiveSidebar !== value) {
    const sidebarButton = document.querySelector(value ? "#navbar-collapse" : "#navbar-expand");
    if (!sidebarButton) return;

    sidebarButton.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        button: 0,
      }),
    );
    sidebarButton.click();
  }
}

/**
 * SET SETTING SIDEBAR HIDDEN HEADERS
 */
export function setSettingSidebarHiddenHeaders(value) {
  if (value === true) {
    elements.native.sidebar?.classList.add("hide-section-headers");
  } else {
    elements.native.sidebar?.classList.remove("hide-section-headers");
  }

  ui.sidebar.isSettingSidebarHiddenHeadersOn = value;
  sessionStorage.setItem("isSettingSidebarHiddenHeadersOn", value);
}

/**
 * SET SETTING SIDEBAR SHRINK WHEN COLLAPSED
 */
export function setSettingSidebarShrink(value) {
  if (value === true) {
    elements.native.sidebar?.classList.add("shrink");
  } else {
    elements.native.sidebar?.classList.remove("shrink");
  }

  ui.sidebar.isSettingSidebarShrinkOn = value;
  sessionStorage.setItem("isSettingSidebarShrinkOn", value);
}

/**
 * SET IS TABS PANEL HIDDEN
 */
export function setIsTabsPanelHidden(value) {
  const tabsPanel = elements.native.tabsPanel;
  const contentPanel = elements.native.contentPanel;
  const tabsPanelToggleButton = elements.injected.tabsPanelToggleButton;

  if (value === true) {
    tabsPanel?.classList.add("hidden", "panel-collapsed");
    contentPanel?.classList.remove("half-width");
    tabsPanel?.classList.remove("is-active", "half-width");
    tabsPanelToggleButton?.classList.remove("active");
  } else {
    tabsPanel?.classList.remove("hidden", "panel-collapsed");
    contentPanel?.classList.add("half-width");
    tabsPanel?.classList.add("is-active", "half-width");
    tabsPanelToggleButton?.classList.add("active");
  }

  ui.tabsPanel.isHidden = value;
  sessionStorage.setItem("isTabsPanelHidden", value);
}

/**
 * SET LAST URL
 */
export function setLastUrl(value) {
  ui.load.lastUrl = value;
}
