/**
 * TABS PANEL TOGGLE BUTTON
 * @module components/buttons/header/tabs-panel-toggle
 */

// Import components
import { icons } from "../../icons.js";

// Import utils
import { elements } from "../../../utils/state/dom.js";

/**
 * INJECT TABS PANEL TOGGLE BUTTON
 * Injects a button.btn--toggle-tabs-panel in the .site-header to toggle the Tabs Panel visibility when clicked.
 *
 * @param {HTMLDivElement} containerEl The container to which the button will be appended.
 */
export function injectTabsPanelToggleButton(containerEl) {
  if (!elements.native.tabsPanel) return;
  containerEl.appendChild(createTabsPanelToggleButton());
}

function createTabsPanelToggleButton() {
  const tabsPanelToggleButtonEl = document.createElement("button");
  tabsPanelToggleButtonEl.classList.add("site-header__button", "btn--toggle-tabs-panel");
  tabsPanelToggleButtonEl.title = "Toggle Tabs Panel Visibility";
  tabsPanelToggleButtonEl.appendChild(icons.headerIcons.tabsPanel());

  return tabsPanelToggleButtonEl;
}
