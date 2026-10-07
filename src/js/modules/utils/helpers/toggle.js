/**
 * TOGGLE
 * @module utils/helpers/toggle
 */

// Import utils
import { hideHeader, hideSettings, hideSidebar, hideTabsPanel, hideTocMenu } from "./hide.js";
import { showHeader, showSettings, showSidebar, showTabsPanel, showTocMenu, showToast } from "./show.js";
import { elements } from "../state/dom.js";
import { ui } from "../state/ui.js";

/**
 * TOGGLE EXERCISE COMPLETION STATUS
 */
export function toggleExerciseCompletionStatus() {
  const statusToggleButton = document.querySelector(".edit_exercise_submission .button");

  if (statusToggleButton.disabled) {
    showToast("Exercise status change is still in progress", "alert");
    return;
  }

  const markIncomplete = document.querySelector(".edit_exercise_submission input[value='delete']");

  let toastMsg, toastStyle;

  if (markIncomplete) {
    toastMsg = "Exercise marked incomplete";
    toastStyle = "notice";
  } else {
    toastMsg = "Exercise marked complete";
    toastStyle = "success";
  }

  statusToggleButton.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );

  statusToggleButton.click();

  showToast(toastMsg, toastStyle);
}

/**
 * TOGGLE HEADER
 */
export function toggleHeader() {
  if (ui.header.isHidden) {
    showHeader();
  } else {
    hideHeader();
  }
}

/**
 * TOGGLE SETTINGS
 */
export function toggleSettings() {
  if (elements.injected.settingsMenu.classList.contains("active")) {
    hideSettings();
  } else {
    showSettings();
  }
}

/**
 * TOGGLE SIDEBAR
 */
export function toggleSidebar() {
  const sidebarCheckbox = document.querySelector("#navbar-collapsor");
  if (!sidebarCheckbox) return;

  if (sidebarCheckbox.checked) {
    showSidebar();
  } else {
    hideSidebar();
  }
}

/**
 * TOGGLE TABS PANEL
 */
export function toggleTabsPanel() {
  const isTabsPanelHidden = ui.tabsPanel.isHidden;

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
