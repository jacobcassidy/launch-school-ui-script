/**
 * FOCUS
 * @module helpers/focus
 */

// import { colorLog } from "./log.js";
import { flashActiveElement } from "./flash.js";
import { states } from "./state.js";
import { showTabsPanel } from "./show.js";

/**
 * HANDLE FOCUS
 *
 * @param {HTMLElement} focusEl The element that will be focused or contains the element to focus
 */
export function handleFocus(focusEl) {
  // colorLog.run("Running handleFocus()");
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
    const isTabsPanelHidden = states.hidden.isTabsPanelHidden;
    const codeMirror = tabTextarea?.closest(".CodeMirror");
    const isCodeMirrorFocused = codeMirror?.classList.contains("CodeMirror-focused");

    if (isTabsPanelHidden) showTabsPanel();

    if (isActiveTab && isCodeMirrorFocused) {
      flashActiveElement(focusEl, codeMirror);
      return;
    }

    if (isActiveTab && isTextareaFocused) {
      flashActiveElement(focusEl, tabTextarea);
      return;
    }

    if (isActiveTab && !tabTextarea) {
      flashActiveElement(focusEl);
      return;
    }

    if (tabTextarea && !isTextareaFocused) {
      setTimeout(() => {
        tabTextarea.focus();
      }, 100);
      return;
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
