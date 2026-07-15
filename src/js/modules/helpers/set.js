/**
 * SETTERS
 */
import { elements, states } from "./state";
const { contentPanel, tabsPanel, tabsPanelToggleButton } = elements;

// ELEMENT SETTERS
export function setElementContentPanel(el) {
  elements.contentPanel = el;
}

export function setElementInstructionsPanel(el) {
  elements.instructionsPanel = el;
}

export function setElementHeader(el) {
  elements.header = el;
}

export function setElementScrollContainer(el) {
  elements.scrollContainer = el;
}

export function setElementSidebar(el) {
  elements.sidebar = el;
}

export function setElementSidebarShowButton(el) {
  elements.sidebarShowButton = el;
}

export function setElementTabsPanel(el) {
  elements.tabsPanel = el;
}

export function setElementTabsPanelToggleButton(el) {
  elements.tabsPanelToggleButton = el;
}

// STATE SETTERS
export function setIsHeaderPinned(value) {
  if (value === true) {
    elements.header.classList.add("is-pinned");
  } else {
    elements.header.classList.remove("is-pinned");
  }

  states.isHeaderPinned = value;
  sessionStorage.setItem("isHeaderPinned", value);
}

export function setIsHeaderTop(value) {
  if (value === true) {
    elements.header.classList.add("is-top");
  } else {
    elements.header.classList.remove("is-top");
  }

  states.isHeaderTop = value;
}

export function setIsHeaderUnpinned(value) {
  if (value === true) {
    elements.header.classList.add("is-unpinned");
  } else {
    elements.header.classList.remove("is-unpinned");
  }

  states.isHeaderUnpinned = value;
  sessionStorage.setItem("isHeaderUnpinned", value);
}

export function setIsHiddenDefaultHeader(value) {
  states.isHiddenDefaultHeader = value;
  sessionStorage.setItem("isHiddenDefaultHeader", value);
}

export function setIsHiddenDefaultSidebar(value) {
  states.isHiddenDefaultSidebar = value;
  sessionStorage.setItem("isHiddenDefaultSidebar", value);
}

export function setIsHiddenDefaultTabsPanel(value) {
  states.isHiddenDefaultTabsPanel = value;
  sessionStorage.setItem("isHiddenDefaultTabsPanel", value);
}

export function setIsReloadScheduled(value) {
  states.isReloadScheduled = value;
}

// TODO - Refactor this so that it changes the native state as well so that on page change or reload, the sidebar is not open by default if it has been closed.
export function setIsSidebarOpen(value) {
  const sidebarHideCheckbox = document.querySelector("#navbar-collapsor");
  if (!sidebarHideCheckbox) {
    states.isSidebarOpen = value;
    return;
  }

  const isSidebarClosed = sidebarHideCheckbox.checked;
  if (value === true) {
    const sidebarShowBtn = document.querySelector("#navbar-expand");
    if (isSidebarClosed) sidebarShowBtn.click();
  } else {
    if (!isSidebarClosed) sidebarHideCheckbox.click();
  }
}

export function setIsTabsPanelOpen(value) {
  if (value === true) {
    tabsPanel.classList.remove("hidden", "panel-collapsed");
    contentPanel.classList.add("halfWidth");
    tabsPanel.classList.add("halfWidth");
    tabsPanelToggleButton.classList.add("active");
  } else {
    tabsPanel.classList.add("hidden", "panel-collapsed");
    contentPanel.classList.remove("halfWidth");
    tabsPanel.classList.remove("halfWidth");
    tabsPanelToggleButton.classList.remove("active");
  }

  states.isTabsPanelOpen = value;
}

export function setLastUrl(value) {
  states.lastUrl = value;
}

export function setPreviousBody(value) {
  states.previousBody = value;
}
