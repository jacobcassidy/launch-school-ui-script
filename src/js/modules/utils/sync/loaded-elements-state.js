/**
 * SYNC LOADED ELEMENTS STATE
 * @module utils/sync/loaded-elements-state
 */

// Import utils
import { elements } from "../state/dom.js";
import { ui } from "../state/ui.js";
import { hideHeader } from "../helpers/hide.js";
import { setIsTabsPanelHidden } from "../state/setters/ui.js";

/**
 * Gets and sets the last active states when loading the UI.
 */
export function syncLoadedElementsState() {
  const header = elements.injected.header;
  const sidebar = elements.native.sidebar;
  const tabsPanel = elements.native.tabsPanel;
  const isHeaderHidden = ui.header.isHidden;
  const isSettingSidebarHiddenHeadersOn = ui.sidebar.isSettingSidebarHiddenHeadersOn;
  const isSettingSidebarShrinkOn = ui.sidebar.isSettingSidebarShrinkOn;
  const isTabsPanelHidden = ui.tabsPanel.isHidden;

  // Set header load state.
  if (header && isHeaderHidden) hideHeader();

  // Set tabs panel load state.
  if (tabsPanel) setIsTabsPanelHidden(isTabsPanelHidden);

  // Set Sidebar Hidden Headers setting load state
  if (sidebar && isSettingSidebarHiddenHeadersOn) {
    elements.native.sidebar.classList.add("hide-section-headers");
  }

  // Set Sidebar Shrink setting load state
  if (sidebar && isSettingSidebarShrinkOn) {
    elements.native.sidebar.classList.add("shrink");
  }
}
