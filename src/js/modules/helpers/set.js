/**
 * SETTERS
 */
import { elements, states } from "./state";

// INJECTED ELEMENTS SETTERS
export function setElementHeader(el) {
  elements.injected.header = el;
}

export function setElementSettingsMenu(el) {
  elements.injected.settingsMenu = el;
}

export function setElementSettingsToggleBtn(el) {
  elements.injected.settingsToggleBtn = el;
}

export function setElementSidebarShowButton(el) {
  elements.injected.sidebarShowButton = el;
}

export function setElementTabsPanelToggleButton(el) {
  elements.injected.tabsPanelToggleButton = el;
}

// NATIVE ELEMENTS SETTERS
export function setElementContentPanel(el) {
  elements.native.contentPanel = el;
}

export function setElementInstructionsPanel(el) {
  elements.native.instructionsPanel = el;
}

export function setElementScrollContainer(el) {
  elements.native.scrollContainer = el;
}

export function setElementSidebar(el) {
  elements.native.sidebar = el;
}

export function setElementTabsPanel(el) {
  elements.native.tabsPanel = el;
}

// STATE SETTERS
export function setIsHeaderPinned(value) {
  if (value === true) {
    elements.injected.header.classList.add("is-pinned");
  } else {
    elements.injected.header.classList.remove("is-pinned");
  }

  states.isHeaderPinned = value;
  sessionStorage.setItem("isHeaderPinned", value);
}

export function setIsHeaderTop(value) {
  if (value === true) {
    elements.injected.header.classList.add("is-top");
  } else {
    elements.injected.header.classList.remove("is-top");
  }

  states.isHeaderTop = value;
}

export function setIsHeaderHidden(value) {
  if (value === true) {
    elements.injected.header.classList.add("is-hidden");
  } else {
    elements.injected.header.classList.remove("is-hidden");
  }

  states.isHeaderHidden = value;
  sessionStorage.setItem("isHeaderHidden", value);
}

export function setIsReloadScheduled(value) {
  states.isReloadScheduled = value;
}

// TODO - Refactor this so that it changes the native state as well so that on page change or reload, the sidebar is not open by default if it has been closed.
export function setIsSidebarHidden(value) {
  const sidebarHideCheckbox = document.querySelector("#navbar-collapsor");

  // If no sidebar found, set value to null.
  if (!sidebarHideCheckbox) {
    states.isSidebarHidden = null;
    return;
  }

  const isSidebarOpen = !sidebarHideCheckbox.checked;

  if (value === true) {
    if (isSidebarOpen) sidebarHideCheckbox.click();
  } else {
    const sidebarShowBtn = document.querySelector("#navbar-expand");
    if (!isSidebarOpen) sidebarShowBtn.click();
  }

  states.isSidebarHidden = value;
  sessionStorage.setItem("isSidebarHidden", value);
}

export function setIsTabsPanelHidden(value) {
  const tabsPanel = elements.native.tabsPanel;
  const contentPanel = elements.native.contentPanel;
  const tabsPanelToggleButton = elements.injected.tabsPanelToggleButton;

  if (value === true) {
    tabsPanel.classList.add("hidden", "panel-collapsed");
    contentPanel.classList.remove("half-width");
    tabsPanel.classList.remove("half-width");
    tabsPanelToggleButton.classList.remove("active");
  } else {
    tabsPanel.classList.remove("hidden", "panel-collapsed");
    contentPanel.classList.add("half-width");
    tabsPanel.classList.add("half-width");
    tabsPanelToggleButton.classList.add("active");
  }

  states.isTabsPanelHidden = value;
  sessionStorage.setItem("iisTabsPanelHidden", value);
}

export function setLastUrl(value) {
  states.lastUrl = value;
}

export function setPreviousBody(value) {
  states.previousBody = value;
}
