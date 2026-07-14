/**
 * STATES HELPER
 */
import { colorLog } from "./log.js";

export const elements = {
  activeTabTextarea: null,
  contentPanel: null,
  header: null,
  instructionsPanel: null,
  scrollContainer: null,
  sidebarButton: null,
  tabsPanel: null,
  tabsPanelToggleButton: null,
};

export const states = {
  activeTab: null,
  isDefaultHeaderHidden: sessionStorage.getItem("isDefaultHeaderHidden") === "true",
  isDefaultSidebarHidden: sessionStorage.getItem("isDefaultSidebarHidden") === "true",
  isDefaultTabsPanelHidden: sessionStorage.getItem("isDefaultTabsPanelHidden") === "true",
  isHeaderPinned: sessionStorage.getItem("isHeaderPinned") === "true",
  isHeaderTop: false,
  isHeaderUnpinned: sessionStorage.getItem("isHeaderUnpinned") === "true",
  isReloadScheduled: false,
  lastUrl: null,
  observerTimeoutId: null,
  previousBody: null,
};

/**
 * Setter Functions
 */

// Set Elements State

/**
 * SET ACTIVE TAB BUTTON TEXTAREA ELEMENT
 *
 * @param {HTMLElement} tabBtn The active .tab-button element to get the matching textarea for
 * @returns The textarea element for the active .tab-button
 */
export function setActiveTabTextareaElement(tabBtn) {
  colorLog.info("Setting active tab textarea element with setActiveTabTextareaElement().");

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

export function setContentPanelElement(el) {
  elements.contentPanel = el;
}

export function setInstructionsPanelElement(el) {
  elements.instructionsPanel = el;
}

export function setTabsPanelElement(el) {
  elements.tabsPanel = el;
}

export function setScrollContainerElement(el) {
  elements.scrollContainer = el;
}

export function setHeaderElement(el) {
  elements.header = el;
}

export function setSidebarButtonElement(el) {
  elements.sidebarButton = el;
}

export function setTabsPanelToggleButtonElement(el) {
  elements.tabsPanelToggleButton = el;
}

// Set Header State
export function setIsDefaultHeaderHidden(value) {
  states.isDefaultHeaderHidden = value;
  sessionStorage.setItem("isDefaultHeaderHidden", value);
}

export function setIsDefaultSidebarHidden(value) {
  states.isDefaultSidebarHidden = value;
  sessionStorage.setItem("isDefaultSidebarHidden", value);
}

export function setIsDefaultTabsPanelHidden(value) {
  states.isDefaultTabsPanelHidden = value;
  sessionStorage.setItem("isDefaultTabsPanelHidden", value);
}

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

// Set Load States
export function setIsReloadScheduled(value) {
  states.isReloadScheduled = value;
}

export function setLastUrl(value) {
  states.lastUrl = value;
}

export function setPreviousBody(value) {
  states.previousBody = value;
}

// Set ID States
export function setObserverTimeoutId(value) {
  states.observerTimeoutId = value;
}

/**
 * Getter Functions
 */
export function getElements() {
  return elements;
}

export function getStates() {
  return states;
}

// Get Elements State
export function getActiveTabTextareaElement() {
  return elements.activeTabTextarea;
}

export function getContentPanelElement() {
  return elements.contentPanel;
}

export function getInstructionsPanelElement() {
  return elements.instructionsPanel;
}

export function getTabsPanelElement() {
  return elements.tabsPanel;
}

export function getScrollContainerElement() {
  return elements.scrollContainer;
}

export function getHeaderElement() {
  return elements.header;
}

export function getSidebarButtonElement() {
  return elements.sidebarButton;
}

export function getTabsPanelToggleButtonElement() {
  return elements.tabsPanelToggleButton;
}

// Get Header State
export function getIsDefaultHeaderHidden() {
  return states.isDefaultHeaderHidden;
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

// Get Load States
export function getIsReloadScheduled() {
  return states.isReloadScheduled;
}

export function getLastUrl() {
  return states.lastUrl;
}

export function getPreviousBody() {
  return states.previousBody;
}

// Get ID States
export function getObserverTimeoutId() {
  return states.observerTimeoutId;
}

// Header states
// .is-top
// .is-top .is-pinned
// .is-top .is-unpinned

// NEEDED STATES
// Override state/class: .is-hidden (header is always hidden by default, but can be toggle on with .is-pinned - set via settings)

// Top state/class:
// - .is-top or .is-top.is-pinned (show)
// - .is-top.is-hidden-default or .is-top.is-unpinned (hide) [don't add .is-unpinned if .is-hidden-default exists]

// Scroll state/class:
// - .is-hidden-default or .is-unpinned {hide} [don't add .is-unpinned if .is-hidden-default exists]
// - .is-pinned or .is-hidden-default.is-pinned (show)

// Scroll to Top State/class:
// - Remove .is-unpinned if it exists
// - Add .is-top

// Top to Scroll state/class:
// - Remove .is-top if it exists

// HEADER VISIBILITY (add setting to always hide)
// - Exercise Page
// - Book Page
// - Assignment Page
// - Other Pages
