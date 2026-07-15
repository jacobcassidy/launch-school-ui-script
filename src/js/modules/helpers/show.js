/**
 * SHOW HELPERS
 */
import { colorLog } from "./log.js";
import { setIsHeaderPinned, setIsHeaderUnpinned, setIsSidebarOpen, setIsTabsPanelOpen } from "./set.js";

/**
 * SHOW HEADER
 */
export function showHeader() {
  colorLog.run("Running showHeader()");
  setIsHeaderPinned(true);
  setIsHeaderUnpinned(false);
}

/**
 * SHOW SIDEBAR
 */
export function showSidebar() {
  colorLog.run("Running showSidebar()");
  setIsSidebarOpen(true);
}

/**
 * SHOW TABS PANEL
 */
export function showTabsPanel() {
  colorLog.run("Running showTabsPanel()");
  setIsTabsPanelOpen(true);
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
