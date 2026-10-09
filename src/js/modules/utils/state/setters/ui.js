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
  const header = elements.injected.header;
  if (value && header?.contains(document.activeElement)) document.activeElement.blur();
  header?.classList.toggle("is-hidden", value);
  if (header) {
    header.inert = value;
    header.setAttribute("aria-hidden", String(value));
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

  const isSidebarCollapsed = sidebarCollapseCheckbox.checked;
  if (isSidebarCollapsed !== value) {
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

  ui.tabsPanel.isHidden = value;
  sessionStorage.setItem("isTabsPanelHidden", value);
  if (value) tabsPanelToggleButton?.classList.remove("active");
  else tabsPanelToggleButton?.classList.add("active");

  if (!tabsPanel) {
    contentPanel?.classList.remove("half-width");
    return;
  }

  tabsPanel.inert = value;
  tabsPanel.setAttribute("aria-hidden", String(value));

  if (value) {
    tabsPanel.classList.add("hidden", "panel-collapsed");
    tabsPanel.classList.remove("is-active", "half-width");
    contentPanel?.classList.remove("half-width");
  } else {
    contentPanel?.classList.add("half-width");
    tabsPanel.classList.remove("hidden", "panel-collapsed");
    tabsPanel.classList.add("is-active", "half-width");
  }
}

/**
 * SET LAST URL
 */
export function setLastUrl(value) {
  ui.load.lastUrl = value;
}
