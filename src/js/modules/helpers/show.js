/**
 * SHOW HELPERS
 */
import { colorLog } from "./log.js";
import { setIsHeaderPinned, setIsHeaderHidden, setIsSidebarHidden, setIsTabsPanelHidden } from "./set.js";

/**
 * SHOW HEADER
 */
export function showHeader() {
  colorLog.run("Running showHeader()");
  setIsHeaderPinned(true);
  setIsHeaderHidden(false);
}

/**
 * SHOW SIDEBAR
 */
export function showSidebar() {
  colorLog.run("Running showSidebar()");
  setIsSidebarHidden(false);
}

/**
 * SHOW TABS PANEL
 */
export function showTabsPanel() {
  colorLog.run("Running showTabsPanel()");
  setIsTabsPanelHidden(false);
}

/**
 * SHOW TOAST
 *
 * @param {string} message The text to display in the toast
 * @param {number} duration How long the toast should display
 */
export function showToast(message, duration = 2500) {
  colorLog.run("Running showToast()");

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
