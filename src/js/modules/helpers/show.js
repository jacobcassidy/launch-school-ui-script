import { colorLog } from "./log.js";
import { handleFocus } from "../focus.js";
import { elements, setIsHeaderPinned, setIsHeaderUnpinned } from "./state.js";

const { header, tabsPanel, contentPanel, tabsPanelToggleButton } = elements;
/**
 * SHOW SIDEBAR
 */
export function showSidebar() {
  colorLog.run("Running showSidebar()");
  const showSidebarBtn = document.querySelector("#navbar-expand");
  const isSidebarClosed = document.querySelector("#navbar-collapsor").checked;
  if (isSidebarClosed) showSidebarBtn.click();
}

/**
 * SHOW SITE-HEADER
 */
export function showHeader() {
  colorLog.run("Running showHeader()");
  header.classList.remove("is-unpinned");
  header.classList.add("is-pinned");
  setIsHeaderPinned(true);
  setIsHeaderUnpinned(false);
}

/**
 * SHOW TABS PANEL
 */
export function showTabsPanel() {
  colorLog.run("Running showTabsPanel()");
  tabsPanel.classList.remove("hidden", "panel-collapsed");
  contentPanel.classList.add("halfWidth");
  tabsPanel.classList.add("halfWidth");
  tabsPanelToggleButton.classList.add("active");
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

/**
 * SHOW LSBOT PANEL WHEN SUBMITTING ANSWERS IN THE LSBOT QUESTION BOX
 */
export function showLSBotPanelOnQbSubmission() {
  colorLog.run("Running showLSBotPanelOnQbSubmission()");

  const qbTextareas = document.querySelectorAll(".lsbot-question-box-answer-input");
  const qbSubmitBtns = document.querySelectorAll(".lsbot-question-box-send-answer-button");
  if (!qbTextareas.length || !qbSubmitBtns.length || !tabsPanel) return;

  const lsbotPanel = document.querySelector("#tab-lsbot-help");

  // Show LSBot Tabs Panel on submission button click
  qbSubmitBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      handleFocus(lsbotPanel);
      showTabsPanel();
    });
  });

  // Show LSBot Tabs Panel on hotkey submission `CMD + Enter`
  qbTextareas.forEach((qbTextarea) => {
    const handleHotkeySubmission = () => {
      colorLog.run("Running handleHotkeySubmission()");

      const isCmdEnter = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && event.key === "Enter";
      if (!isCmdEnter) return;
      handleFocus(lsbotPanel);
      showTabsPanel();
    };

    qbTextarea.addEventListener("focus", () => qbTextarea.addEventListener("keydown", handleHotkeySubmission));
    qbTextarea.addEventListener("blur", () => qbTextarea.removeEventListener("keydown", handleHotkeySubmission));
  });
}
