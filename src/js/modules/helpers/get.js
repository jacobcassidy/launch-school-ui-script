/**
 * GETTERS
 */
import { elements } from "./state";

/**
 * GET ACTIVE TAB BUTTON TEXTAREA ELEMENT
 *
 * @param {HTMLElement} tabBtn The active .tab-button element to get the matching textarea for
 * @returns The textarea element for the active .tab-button
 */
export function getActiveTabTextareaElement(tabBtn) {
  const isTabButton = tabBtn.classList.contains("tab-button");
  if (!isTabButton) return;

  const isActiveTabButton = tabBtn.classList.contains("active");
  if (!isActiveTabButton) return;

  const tabButtonData = tabBtn?.dataset?.tab;
  if (!tabButtonData) return;

  const tabContainerId = `tab-${tabButtonData}`;
  const tabContainer = document.getElementById(tabContainerId);
  if (!tabContainer) return;

  const tabContainerTextarea =
    tabContainer.querySelector(".CodeMirror textarea") || tabContainer.querySelector("textarea") || null;

  elements.activeTabTextarea = tabContainerTextarea;

  return tabContainerTextarea;
}
