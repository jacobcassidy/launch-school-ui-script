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
  elements.injected.sidebarHiddenHeaderToggler = el;
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

/**
 * SET BUTTON PROPERTIES
 *
 * @param {Array} btnEls An array of all nodes of this button type.
 * @param {Array} newIcons An array of icons that will be added to the button.
 * @param {Array} btnClasses An array of classes that will be added to this button.
 * @param {Boolean} append If set to true, icon will be appended to the button instead of prepended.
 */
export function setButtonProperties(btnEls, newIcons, btnClasses = [], append = false) {
  if (btnEls.length < 1 || newIcons.length < 1) return;

  btnEls.forEach((btn) => {
    if (!btn || btn.classList.contains("has-new-icon")) return;

    if (btnClasses.length > 0) {
      btn.classList.add(...btnClasses, "has-new-icon");
    }

    newIcons.forEach((icon) => {
      const iconEl = icon();
      iconEl.classList.add("is-new-icon");
      if (append) {
        btn.append(iconEl);
      } else {
        btn.prepend(iconEl);
      }
    });
  });
}
