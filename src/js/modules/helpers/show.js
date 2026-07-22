/**
 * SHOW
 * @module helpers/show
 */

import { handleOutsideSettingsMenuClick } from "../settings-menu.js";
import { hideSettingsMenu } from "./hide.js";
import { elements, setIsHeaderHidden, setIsSidebarHidden, setIsTabsPanelHidden } from "./state.js";

/**
 * SHOW HEADER
 */
export function showHeader() {
  setIsHeaderHidden(false);
}

/**
 * SHOW SETTINGS MENU
 */
export function showSettingsMenu() {
  const settingsMenu = elements.injected.settingsMenu;
  const settingsMenuToggleBtn = elements.injected.settingsToggleButton;
  settingsMenu.classList.add("active");
  settingsMenuToggleBtn.classList.add("active");

  // If TOC menu is open, click to close it.
  const openedTocMenu = document.querySelector(".toc-toggle-button.open");
  if (openedTocMenu) openedTocMenu.click();

  document.addEventListener("pointerdown", handleOutsideSettingsMenuClick);
}

/**
 * SHOW SIDEBAR
 */
export function showSidebar() {
  setIsSidebarHidden(false);
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
 * @param {number} duration How long the toast should display
 */
export function showToast(message, duration = 2500) {
  const toastContainer = document.querySelector(".toast-container");
  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Remove after duration
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, duration);
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
    if (settingsMenu && settingsMenu.classList.contains("active")) hideSettingsMenu();
  }
}
