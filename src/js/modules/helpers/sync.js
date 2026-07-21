/**
 * SYNC
 * @module helpers/sync
 */

// import { colorLog } from "./log";
import {
  elements,
  setElementContentPanel,
  setElementHeader,
  setElementInstructionsPanel,
  setElementScrollContainer,
  setElementSettingsMenu,
  setElementSettingsToggleBtn,
  setElementSidebar,
  setElementSidebarShowButton,
  setElementTabsPanel,
  setElementTabsPanelToggleButton,
} from "./state.js";

/**
 * SYNC NATIVE ELEMENTS STATE
 * Sets the states properties for the page's native app DOM elements
 */
export function syncNativeElementsState() {
  // colorLog.run("Running syncNativeElementsState()");
  const contentPanel =
    document.querySelector(".assignment-content-panel") || document.querySelector(".book-content-panel");
  const instructionsPanel = document.querySelector(".instructions-panel");
  const scrollContainer =
    document.querySelector(".assignment-content-wrapper") ||
    document.querySelector(".book-content-wrapper") ||
    "window";
  const sidebar = document.querySelector(".nav-drawer");
  const tabsPanel = document.querySelector(".tabs-panel");

  setElementContentPanel(contentPanel);
  setElementInstructionsPanel(instructionsPanel);
  setElementScrollContainer(scrollContainer);
  setElementSidebar(sidebar);
  setElementTabsPanel(tabsPanel);
}

/**
 * SYNC INJECTED ELEMENTS STATE
 * Sets the states properties for the script's injected DOM elements
 */
export function syncInjectedElementsState() {
  const header = document.querySelector(".site-header");
  const settingsMenu = document.querySelector(".settings-menu");
  const settingsToggleBtn = document.querySelector(".btn--toggle-settings");
  const sidebarShowBtn = document.querySelector(".btn--show-sidebar");
  const tabsPanelToggleBtn = document.querySelector(".btn--toggle-tabs-panel");

  setElementHeader(header);
  setElementSettingsMenu(settingsMenu);
  setElementSettingsToggleBtn(settingsToggleBtn);
  setElementSidebarShowButton(sidebarShowBtn);
  setElementTabsPanelToggleButton(tabsPanelToggleBtn);

  console.log(elements.injected.settingsToggleButton);
}
