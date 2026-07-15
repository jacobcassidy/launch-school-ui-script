/**
 * FOCUS HELPERS
 */
import { colorLog } from "./log.js";
import { flashActiveElement } from "./flash.js";
import { getActiveTabTextareaElement } from "./get.js";

/**
 * HANDLE FOCUS
 *
 * @param {HTMLElement} focusEl The element that will be focused or contains the element to focus
 */
export function handleFocus(focusEl) {
  colorLog.run("Running handleFocus()");
  const isTextarea = focusEl instanceof HTMLTextAreaElement;
  const isTabButton = focusEl.classList.contains("tab-button");

  if (isTextarea) {
    const codeMirror = focusEl.closest(".CodeMirror");
    const isCodeMirrorFocused = codeMirror?.classList.contains("CodeMirror-focused");

    if (isCodeMirrorFocused) {
      flashActiveElement(codeMirror);
      return;
    }

    focusEl.focus();
    return;
  }

  if (isTabButton) {
    const activeTab = document.querySelector(".tab-button.active, .tab-button[aria-selected='true']");
    const isTabActive = activeTab?.dataset?.tab === focusEl.dataset?.tab;
    const tabTextarea = getActiveTabTextareaElement(focusEl);
    const isTextareaFocused = document.activeElement === tabTextarea;

    const focusTextarea = () => {
      setTimeout(() => {
        tabTextarea.focus();
      }, 100);
    };

    if (isTabActive && tabTextarea && isTextareaFocused) {
      flashActiveElement(focusEl, tabTextarea);
      return;
    }

    if (isTabActive && !tabTextarea) {
      flashActiveElement(focusEl);
      return;
    }

    if (tabTextarea && !isTextareaFocused) {
      focusTextarea();
      return;
    }

    // TODO - See if you can remove this after figuring out how to trigger the network sync (maybe mousedown).
    // const isReviewTabBtn = tabBtn.dataset?.tab === "submit-review";
    // if (isReviewTabBtn) {
    //   const lsbotTabBtn = document.querySelector(".tab-button[data-tab='lsbot-help']");
    //   const reviewTabBtn = document.querySelector(".tab-button[data-tab='submit-review']");

    //   // LSBot needs to be activated first before the Review Tab submission works.
    //   lsbotTabBtn.click();
    //   reviewTabBtn.click();
    // }

    // if (isTabActive && isTextareaFocused) {
    //   hideTabsPanel();
    //   return;
    // } else {
    //   focusTextarea();
    //   return;
    // }
  }
}
