/**
 * SHOW
 * @module helpers/show
 */

// import { colorLog } from "./log.js";
import { handleOutsideSettingsMenuClick } from "./settings.js";
import { elements, setIsHeaderHidden, setIsSidebarHidden, setIsTabsPanelHidden } from "./state.js";

/**
 * SHOW HEADER
 */
export function showHeader() {
  // colorLog.run("Running showHeader()");
  setIsHeaderHidden(false);
}

/**
 * SHOW SETTINGS MENU
 */
export function showSettingsMenu() {
  // colorLog.run("Running showSettingsMenu()");
  const settingsMenu = elements.injected.settingsMenu;
  const settingsMenuToggleBtn = elements.injected.settingsToggleButton;
  settingsMenu.classList.add("active");
  settingsMenuToggleBtn.classList.add("active");

  document.addEventListener("pointerdown", handleOutsideSettingsMenuClick);
}

/**
 * SHOW SIDEBAR
 */
export function showSidebar() {
  // colorLog.run("Running showSidebar()");
  setIsSidebarHidden(false);
}

/**
 * SHOW TABS PANEL
 */
export function showTabsPanel() {
  // colorLog.run("Running showTabsPanel()");
  setIsTabsPanelHidden(false);
}

/**
 * SHOW TOAST
 *
 * @param {string} message The text to display in the toast
 * @param {number} duration How long the toast should display
 */
export function showToast(message, duration = 2500) {
  // colorLog.run("Running showToast()");

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
