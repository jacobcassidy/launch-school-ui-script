/**
 * DOM SETTERS
 * @module utils/state/setters/dom
 */

// Import utils
import { elements } from "../dom.js";

// SET INJECTED ELEMENTS
export function setElementHeader(el) {
  elements.injected.header = el;
}

export function setElementSettingsMenu(el) {
  elements.injected.settingsMenu = el;
}

export function setElementSettingsToggleBtn(el) {
  elements.injected.settingsToggleButton = el;
}

export function setElementSidebarHiddenHeadersToggler(el) {
  elements.injected.sidebarHiddenHeadersToggler = el;
}

export function setElementSidebarShrinkToggler(el) {
  elements.injected.sidebarShrinkToggler = el;
}

export function setElementSidebarToggleButton(el) {
  elements.injected.sidebarToggleButton = el;
}

export function setElementTabsPanelToggleButton(el) {
  elements.injected.tabsPanelToggleButton = el;
}

// SET NATIVE ELEMENTS
export function setElementContentPanel(el) {
  elements.native.contentPanel = el;
}

export function setElementEditorPanel(el) {
  elements.native.editorPanel = el;
}

export function setElementInstructionsPanel(el) {
  elements.native.instructionsPanel = el;
}

export function setElementNextExerciseButton(el) {
  elements.native.nextExerciseButton = el;
}

export function setElementScratchpad(el) {
  elements.native.scratchpad = el;
}

export function setElementSidebar(el) {
  elements.native.sidebar = el;
}

export function setElementTabsPanel(el) {
  elements.native.tabsPanel = el;
}

export function setElementTabNav(el) {
  elements.native.tabNav = el;
}

export function setElementTocButton(el) {
  elements.native.tocButton = el;
}
