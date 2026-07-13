import { colorLog } from "./utility.js";
import { setActiveTabTextareaElement } from "./state.js";

/**
 * FLASH ACTIVE ELEMENT
 * @param {HTMLElement} activeEl The already active element to flash
 * @param {HTMLElement} secondaryActiveEl The optional already active secondary element to flash
 */
export function flashActiveElement(activeEl, secondaryActiveEl) {
  console.log("Running flashActiveElement()");
  /**
   * Flashes the active element with a quick add and removal of the .flash-active class
   */
  const flashWithClass = (flashEl, secondaryFlashEl) => {
    colorLog.run("Running flashWithClass();");

    clearTimeout(flashEl.flashTimeout);
    flashEl.classList.remove("flash-active");
    requestAnimationFrame(() => {
      flashEl.classList.add("flash-active");
      flashEl.flashTimeout = setTimeout(() => {
        flashEl.classList.remove("flash-active");
      }, 300);
    });

    if (secondaryFlashEl) {
      clearTimeout(secondaryFlashEl.flashTimeout);
      secondaryFlashEl.classList.remove("flash-active");
      requestAnimationFrame(() => {
        secondaryFlashEl.classList.add("flash-active");
        secondaryFlashEl.flashTimeout = setTimeout(() => {
          secondaryFlashEl.classList.remove("flash-active");
        }, 300);
      });
    }
  };

  const isTabButton = activeEl.classList.contains("tab-button");

  if (isTabButton) {
    const tabTextarea = setActiveTabTextareaElement(activeEl);
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
