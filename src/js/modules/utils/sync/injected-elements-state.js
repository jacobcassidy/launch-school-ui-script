/**
 * SYNC INJECTED ELEMENTS STATE
 * @module utils/sync/injected-elements-state
 */

// Import utils
import {
  setElementHeader,
  setElementSettingsMenu,
  setElementSettingsToggleBtn,
  setElementSidebarHiddenHeadersToggler,
  setElementSidebarShrinkToggler,
  setElementSidebarToggleButton,
  setElementTabsPanelToggleButton,
} from "../state/setters/dom.js";
import { ui } from "../state/ui.js";

/**
 * Sets the states properties for the script's injected DOM elements.
 */
export function syncInjectedElementsState() {
  const header = document.querySelector(".site-header");
  const settingsMenu = document.querySelector(".settings-container");
  const settingsToggleBtn = document.querySelector(".btn--toggle-settings");
  const sidebarHiddenHeadersToggler = document.querySelector("#setting--sidebar-hidden-headers");
  const sidebarShrinkToggler = document.querySelector("#setting--sidebar-shrink");
  const sidebarToggleBtn = document.querySelector(".btn--toggle-sidebar");
  const tabsPanelToggleBtn = document.querySelector(".btn--toggle-tabs-panel");

  setElementHeader(header);
  setElementSettingsMenu(settingsMenu);
  setElementSettingsToggleBtn(settingsToggleBtn);
  setElementSidebarHiddenHeadersToggler(sidebarHiddenHeadersToggler);
  setElementSidebarShrinkToggler(sidebarShrinkToggler);
  setElementSidebarToggleButton(sidebarToggleBtn);
  setElementTabsPanelToggleButton(tabsPanelToggleBtn);

  // Sync setting togglers
  const isSettingSidebarShrinkOn = ui.sidebar.isSettingSidebarShrinkOn;
  if (isSettingSidebarShrinkOn) sidebarShrinkToggler.checked = true;

  const isSettingSidebarHiddenHeadersOn = ui.sidebar.isSettingSidebarHiddenHeadersOn;
  if (isSettingSidebarHiddenHeadersOn) sidebarHiddenHeadersToggler.checked = true;
}
