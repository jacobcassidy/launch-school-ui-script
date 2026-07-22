/**
 * TOGGLE
 * @module helpers/toggle
 */

import { showHeader, showSettingsMenu, showSidebar, showTabsPanel } from "./show.js";
import { hideHeader, hideSettingsMenu, hideSidebar, hideTabsPanel } from "./hide.js";
import { elements, states } from "./state.js";

/**
 * TOGGLE HEADER
 */
export function toggleHeader() {
  const isHeaderHidden = states.hidden.isHeaderHidden;

  if (isHeaderHidden) {
    showHeader();
  } else {
    hideHeader();
  }
}

/**
 * TOGGLE EXERCISE STATUS
 */
export function toggleExerciseStatus() {
  const statusToggleButton = document.querySelector(".edit_exercise_submission .button");

  statusToggleButton.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );

  statusToggleButton.click();
}

/**
 * TOGGLE SETTINGS MENU
 */
export function toggleSettingsMenu() {
  if (elements.injected.settingsMenu.classList.contains("active")) {
    hideSettingsMenu();
  } else {
    showSettingsMenu();
  }
}

/**
 * TOGGLE SIDEBAR
 */
export function toggleSidebar() {
  const isSidebarHidden = states.hidden.isSidebarHidden;

  if (isSidebarHidden) {
    showSidebar();
  } else {
    hideSidebar();
  }
}

/**
 * TOGGLE TABS PANEL
 */
export function toggleTabsPanel() {
  const isTabsPanelHidden = states.hidden.isTabsPanelHidden;

  if (isTabsPanelHidden) {
    showTabsPanel();
  } else {
    hideTabsPanel();
  }
}
