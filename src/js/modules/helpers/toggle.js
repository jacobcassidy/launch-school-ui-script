/**
 * TOGGLE
 * @module helpers/toggle
 */

import { showHeader, showSettingsMenu, showSidebar, showTabsPanel, showToast, showTocMenu } from "./show.js";
import { hideHeader, hideSettingsMenu, hideSidebar, hideTabsPanel, hideTocMenu } from "./hide.js";
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

  if (statusToggleButton.disabled) {
    showToast("Warning: exercise status change is still in progress.");
    return;
  }

  const markIncomplete = document.querySelector(".edit_exercise_submission input[value='delete']");
  console.log(markIncomplete);

  let toastMsg;

  if (markIncomplete) toastMsg = "Exercise marked incomplete.";
  else toastMsg = "Exercise marked complete.";

  statusToggleButton.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );

  statusToggleButton.click();

  showToast(toastMsg);
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

/**
 * TOGGLE TABLE OF CONTENTS
 */
export function toggleTocMenu() {
  const tocBtn = elements.native.tocButton;

  if (tocBtn && tocBtn.classList.contains("open")) {
    hideTocMenu();
  } else if (tocBtn) {
    showTocMenu();
  }
}
