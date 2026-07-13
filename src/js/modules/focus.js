/**
 * HANDLE ELEMENT FOCUS
 *
 * @param {HTMLElement} focusEl The element that will be focused or contains the element to focus
 */
function handleFocus(focusEl) {
  console.log("Running handleFocus()");

  const isTextarea = focusEl instanceof HTMLTextAreaElement;

  if (isTextarea) {
    const codeMirror = focusEl.closest(".CodeMirror");
    const isCodeMirrorFocused = codeMirror?.classList.contains("CodeMirror-focused");

    if (isCodeMirrorFocused) {
      highlightActiveElement(codeMirror);
      return;
    }

    focusEl.focus();
    return;
  }

  const isTabButton = focusEl.classList.contains("tab-button");

  if (isTabButton) {
    const activeTab = document.querySelector(".tab-button.active, .tab-button[aria-selected='true']");
    const isTabActive = activeTab?.dataset?.tab === focusEl.dataset?.tab;
    const tabTextarea = getTabBtnTextarea(focusEl);

    if (!tabTextarea) {
      if (isTabActive) highlightActiveElement(focusEl);
      return;
    }

    const isTextareaFocused = document.activeElement === tabTextarea;

    if (isTabActive && isTextareaFocused) {
      if (tabsPanel) {
        hideTabsPanel();
      } else {
        highlightActiveElement(focusEl, tabTextarea);
      }
      return;
    } else {
      setTimeout(() => {
        tabTextarea.focus();
      }, 100);
    }
    return;
  }
}

/**
 * FOCUS TAB CONTAINER'S TEXTAREA ON TAB BUTTON CLICK
 */
function focusOnTabClick() {
  console.log("Running focusOnTabClick()");

  const tabButtons = document.querySelectorAll(".tab-button");
  if (tabButtons.length < 1) return;

  tabButtons.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => handleFocus(tabBtn));
  });
}

/**
 * REFOCUS LSBOT PROMPT AFTER PROMPT SUBMISSION
 */
function refocusPromptAfterSubmission() {
  console.log("Running refocusPromptAfterSubmission()");

  const lsbotPromptInputs = document.querySelectorAll(".lsbot-question-input");
  if (lsbotPromptInputs.length < 1) return;

  let promptObserver = null;

  lsbotPromptInputs.forEach((prompt) => {
    prompt.addEventListener("focus", () => {
      promptObserver?.disconnect();

      promptObserver = new MutationObserver(() => {
        console.log("Running promptObserver()");

        if (!prompt.disabled) {
          promptObserver.disconnect();
          prompt.focus();
        }
      });

      promptObserver.observe(prompt, {
        attributes: true,
        attributeFilter: ["disabled"],
      });
    });
  });
}
