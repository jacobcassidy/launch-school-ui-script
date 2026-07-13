/**
 * SETTER HELPER FUNCTIONS
 */

export const domElements = {
  panels: {
    content: null,
    instructions: null,
    tabs: null,
  },
  scrollContainer: null,
  siteHeader: null,
  tabsPanelToggleButton: null,
};

export const states = {
  header: {
    isHiddenDefault: sessionStorage.getItem("isHeaderHiddenDefault") === "true",
    isPinned: false,
    isTop: false,
    isUnpinned: false,
  },

  load: {
    isReloadScheduled: false,
    lastUrl: null,
    previousBody: null,
  },

  timeout: {
    observerId: null,
  },
};

// Set Elements
export function setContentPanelElement(el) {
  domElements.panels.content = el;
}

export function setInstructionsPanelElement(el) {
  domElements.panels.instructions = el;
}

export function setTabsPanelElement(el) {
  domElements.panels.tabs = el;
}

export function setScrollContainerElement(el) {
  domElements.scrollContainer = el;
}

export function setSiteHeaderElement(el) {
  domElements.siteHeader = el;
}

export function setTabsPanelToggleButtonElement(el) {
  domElements.tabsPanelToggleButton = el;
}

// Set Header States
export function setHeaderIsHiddenDefault(value) {
  states.header.isHiddenDefault = value;
}

export function setHeaderIsPinned(value) {
  states.header.isPinned = value;
}

export function setHeaderIsTop(value) {
  states.header.isTop = value;
}

export function setHeaderIsUnpinned(value) {
  states.header.isUnpinned = value;
}

// Set Load States
export function setIsReloadScheduled(value) {
  states.load.isReloadScheduled = value;
}

export function setLastUrl(value) {
  states.load.lastUrl = value;
}

export function setPreviousBody(value) {
  states.load.previousBody = value;
}

// Set Timer States
export function setObserverIdTimer(value) {
  states.timer.observerId = value;
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
