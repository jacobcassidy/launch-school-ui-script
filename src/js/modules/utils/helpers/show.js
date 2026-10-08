/**
 * SHOW
 * @module utils/helpers/show
 */

// Import components
// Import utils
import { handleOutsideSettingsMenuClick, handleSettingsEsc, hideSettings } from "./hide.js";
import { elements } from "../state/dom.js";
import { setIsHeaderHidden, setIsSidebarCollapsed, setIsTabsPanelHidden } from "../state/setters/ui.js";

/**
 * SHOW HEADER
 */
export function showHeader() {
  setIsHeaderHidden(false);
}

/**
 * SHOW SETTINGS
 */
export function showSettings() {
  const settingsMenu = elements.injected.settingsMenu;
  const settingsToggleBtn = elements.injected.settingsToggleButton;
  if (!settingsMenu || !settingsToggleBtn) return;
  settingsMenu.classList.add("active");
  settingsMenu.inert = false;
  settingsMenu.setAttribute("aria-hidden", "false");
  settingsToggleBtn.classList.add("active");
  settingsToggleBtn.setAttribute("aria-expanded", "true");

  // If TOC menu is open,  close it.
  const openedTocMenu = document.querySelector(".toc-toggle-button.open");
  if (openedTocMenu) openedTocMenu.click();

  document.addEventListener("pointerdown", handleOutsideSettingsMenuClick);
  document.addEventListener("keydown", handleSettingsEsc);
}

/**
 * SHOW SIDEBAR
 */
export function showSidebar() {
  setIsSidebarCollapsed(false);
}

/**
 * SHOW TABS PANEL
 */
export function showTabsPanel() {
  setIsTabsPanelHidden(false);
}

/**
 * SHOW TOAST
 *
 * @param {string} message The text to display in the toast
 * @param {string|null} styleClass Optional style class for the toast
 * @param {number} duration How long the toast should display
 */
export function showToast(message, styleClass = null, duration = 2500) {
  const toastContainer = document.querySelector(".toast-container");
  toastContainer.setAttribute("role", "status");
  toastContainer.setAttribute("aria-live", "polite");
  toastContainer.setAttribute("aria-atomic", "true");

  const createToastEl = () => {
    const toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.textContent = message;
    if (styleClass) toastEl.classList.add(styleClass);
    toastContainer.appendChild(toastEl);
    return toastEl;
  };

  const toast = createToastEl();

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Remove after duration
  setTimeout(() => {
    toast.classList.remove("show");
    const transitions = toast.getAnimations?.().filter((animation) => animation.transitionProperty) || [];
    let removed = false;
    let removalFallback;
    const removeToast = () => {
      if (removed) return;
      removed = true;
      clearTimeout(removalFallback);
      toast.remove();
    };
    const transitionDuration = getMaxTransitionDuration(toast);
    if (transitions.length === 0) {
      if (transitionDuration === 0) removeToast();
      else removalFallback = setTimeout(removeToast, transitionDuration + 100);
      return;
    }

    removalFallback = setTimeout(removeToast, transitionDuration + 100);
    Promise.allSettled(transitions.map((animation) => animation.finished)).then(removeToast);
  }, duration);
}

function getMaxTransitionDuration(element) {
  const durations = window.getComputedStyle(element).transitionDuration || "0s";
  return Math.max(
    ...durations.split(",").map((duration) => {
      const value = Number.parseFloat(duration);
      return duration.trim().endsWith("ms") ? value : value * 1000;
    }),
    0,
  );
}

/**
 * SHOW TABLE OF CONTENTS MENU
 * Shows the book's table of contents menu on book pages.
 */
export function showTocMenu() {
  const tocBtn = elements.native.tocButton;
  if (tocBtn) {
    tocBtn.click();

    // If Settings Menu is open, close it.
    const settingsMenu = elements.injected.settingsMenu;
    if (settingsMenu && settingsMenu.classList.contains("active")) hideSettings();
  }
}
