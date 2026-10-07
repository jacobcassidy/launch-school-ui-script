/**
 * FOCUS
 * @module utils/helpers/focus
 */

// Import utils
import { flashActiveElement } from "./flash.js";
import { showTabsPanel } from "./show.js";
import { ui } from "../state/ui.js";

/**
 * HANDLE FOCUS
 *
 * @param {HTMLElement} focusEl The element that will be focused or contains the element to focus
 */
export function handleFocus(focusEl) {
  const isTextarea = focusEl instanceof HTMLTextAreaElement;
  const isTabButton = focusEl.classList.contains("tab-button");

  const getTabTextareaElement = () => {
    const tabButtonData = focusEl?.dataset?.tab;
    if (!tabButtonData) return;

    const tabContainerId = `tab-${tabButtonData}`;
    const tabContainer = document.getElementById(tabContainerId);
    if (!tabContainer) return;

    const tabContainerTextarea =
      tabContainer.querySelector(".CodeMirror textarea") || tabContainer.querySelector("textarea") || null;

    return tabContainerTextarea;
  };

  if (isTabButton) {
    const activeTab = document.querySelector(".tab-button.active, .tab-button[aria-selected='true']");
    const isActiveTab = activeTab?.dataset?.tab === focusEl.dataset?.tab;
    const tabTextarea = getTabTextareaElement();
    const isTextareaFocused = document.activeElement === tabTextarea;
    const isTabsPanelHidden = ui.tabsPanel.isHidden;
    const codeMirror = tabTextarea?.closest(".CodeMirror");
    const isCodeMirrorFocused = codeMirror?.classList.contains("CodeMirror-focused");

    const focusTabTextarea = () => {
      setTimeout(() => {
        tabTextarea.focus();
      }, 100);
    };

    if (isTabsPanelHidden) showTabsPanel();

    if (isActiveTab) {
      // Flash the Scratchpad tab button and  active editor line.
      if (isCodeMirrorFocused) {
        flashActiveElement(focusEl, codeMirror);
        return;
      }

      // Flash the active tab button and textarea.
      if (isTextareaFocused) {
        flashActiveElement(focusEl, tabTextarea);
        return;
      }

      // Flash the active tab textarea only (no flash for the tab button).
      if (tabTextarea && !isTextareaFocused) {
        focusTabTextarea();
        flashActiveElement(tabTextarea);
        return;
      }

      // Flash the tab button only since there is not textarea to flash.
      if (!tabTextarea) {
        flashActiveElement(focusEl);
        return;
      }
    } else {
      // Focus the tab's textarea without flashing it.
      if (tabTextarea && !isTextareaFocused) {
        focusTabTextarea();
        return;
      }
    }
  }

  if (isTextarea) {
    const codeMirror = focusEl.closest(".CodeMirror");
    const isCodeMirrorFocused = codeMirror?.classList.contains("CodeMirror-focused");
    if (isCodeMirrorFocused) {
      flashActiveElement(codeMirror);
    } else {
      focusEl.focus();
    }
    return;
  }
}
