/**
 * NATIVE HELPERS
 */
import { colorLog } from "./log";
import {
  setElementContentPanel,
  setElementInstructionsPanel,
  setElementScrollContainer,
  setElementSidebar,
  setElementTabsPanel,
} from "./set";

/**
 * SYNC NATIVE STATE
 * Sets the state properties for the page's native app DOM elements
 */
export function syncNativeElementsState() {
  colorLog.run("Running syncNativeElementsState()");
  const contentPanel =
    document.querySelector(".assignment-content-panel") || document.querySelector(".book-content-panel");
  const instructionsPanel = document.querySelector(".instructions-panel");
  const scrollContainer =
    document.querySelector(".assignment-content-wrapper") ||
    document.querySelector(".book-content-wrapper") ||
    document.querySelector(".wrapper");
  const sidebar = document.querySelector(".nav-drawer");
  const tabsPanel = document.querySelector(".tabs-panel");

  setElementContentPanel(contentPanel);
  setElementInstructionsPanel(instructionsPanel);
  setElementScrollContainer(scrollContainer);
  setElementSidebar(sidebar);
  setElementTabsPanel(tabsPanel);
}
