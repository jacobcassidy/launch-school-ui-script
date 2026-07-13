/**
 * HIGHLIGHT ACTIVE ELEMENT
 * @param {HTMLElement} activeEl The already active element to highlight
 * @param {HTMLElement} secondaryActiveEl The optional already active secondary element to highlight
 */
function highlightActiveElement(activeEl, secondaryActiveEl) {
  console.log("Running highlightActiveElement()");
  /**
   * Flashes the active element with a quick add and removal of the .highlight-active class
   */
  const flashWithClass = (flashEl, secondaryFlashEl) => {
    colorLog.run("Running flashWithClass();");

    clearTimeout(flashEl.highlightTimeout);
    flashEl.classList.remove("highlight-active");
    requestAnimationFrame(() => {
      flashEl.classList.add("highlight-active");
      flashEl.highlightTimeout = setTimeout(() => {
        flashEl.classList.remove("highlight-active");
      }, 300);
    });

    if (secondaryFlashEl) {
      clearTimeout(secondaryFlashEl.highlightTimeout);
      secondaryFlashEl.classList.remove("highlight-active");
      requestAnimationFrame(() => {
        secondaryFlashEl.classList.add("highlight-active");
        secondaryFlashEl.highlightTimeout = setTimeout(() => {
          secondaryFlashEl.classList.remove("highlight-active");
        }, 300);
      });
    }
  };

  const isTabButton = activeEl.classList.contains("tab-button");

  if (isTabButton) {
    const tabTextarea = getTabBtnTextarea(activeEl);
    const isActiveTextarea = document.activeElement === tabTextarea;

    colorLog.notice("tabTextarea:", tabTextarea);
    colorLog.info("isTabTextareaFocused:", isActiveTextarea);

    flashWithClass(activeEl, secondaryActiveEl);
  } else {
    const isActiveTextarea = document.activeElement === activeEl;
    colorLog.info("isActiveTextarea:", isActiveTextarea);

    flashWithClass(activeEl);
  }
}
