/**
 * GETTERS
 */
import { elements, states } from "./state";

/**
 * GET ACTIVE TAB BUTTON TEXTAREA ELEMENT
 *
 * @param {HTMLElement} tabBtn The active .tab-button element to get the matching textarea for
 * @returns The textarea element for the active .tab-button
 */
export function getActiveTabTextareaElement(tabBtn) {
  const isTabButton = tabBtn.classList.contains("tab-button");
  if (!isTabButton) return;

  const isActiveTabButton = tabBtn.classList.contains("active");
  if (!isActiveTabButton) return;

  const tabButtonData = tabBtn?.dataset?.tab;
  if (!tabButtonData) return;

  const tabContainerId = `tab-${tabButtonData}`;
  const tabContainer = document.getElementById(tabContainerId);
  if (!tabContainer) return;

  const tabContainerTextarea =
    tabContainer.querySelector(".CodeMirror textarea") || tabContainer.querySelector("textarea") || null;

  elements.activeTabTextarea = tabContainerTextarea;

  return tabContainerTextarea;
}

// ELEMENT GETTERS
export function getElements() {
  return elements;
}

export function getElementContentPanel() {
  return elements.contentPanel;
}

export function getElementHeader() {
  return elements.header;
}

export function getElementInstructionsPanel() {
  return elements.instructionsPanel;
}

export function getElementScrollContainer() {
  return elements.scrollContainer;
}

export function getElementSidebar() {
  return elements.sidebar;
}

export function getElementSidebarShowButton() {
  return elements.sidebarShowButton;
}

export function getElementTabsPanel() {
  return elements.tabsPanel;
}

export function getElementTabsPanelToggleButton() {
  return elements.tabsPanelToggleButton;
}

// STATE GETTERS
export function getStates() {
  return states;
}

export function getIsHeaderPinned() {
  return states.isHeaderPinned;
}

export function getIsHeaderTop() {
  return states.isHeaderTop;
}

export function getIsHeaderUnpinned() {
  return states.isHeaderUnpinned;
}

export function getIsHiddenDefaultHeader() {
  return states.isHiddenDefaultHeader;
}

export function getIsHiddenDefaultSidebar() {
  return states.isHiddenDefaultSidebar;
}

export function getIsHiddenDefaultTabsPanel() {
  return states.isHiddenDefaultTabsPanel;
}

export function getIsReloadScheduled() {
  return states.isReloadScheduled;
}

export function getIsSidebarOpen() {
  return states.isSidebarOpen;
}

export function getIsTabsPanelOpen() {
  return states.isTabsPanelOpen;
}

export function getLastUrl() {
  return states.lastUrl;
}

export function getPreviousBody() {
  return states.previousBody;
}
