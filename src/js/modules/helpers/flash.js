import { colorLog } from "./log.js";
// import { setActiveTabTextareaElement } from "./state.js";

/**
 * FLASH ACTIVE ELEMENT
 * Flashes the background of an already active item when it is reactivated.
 *
 * @param {HTMLElement} activeEl The active element to flash.
 * @param {HTMLElement} secondaryActiveEl The optional secondary active element to flash.
 */
export function flashActiveElement(activeEl, secondaryActiveEl) {
  colorLog.run("Running flashActiveElement()");
  const isTabButton = activeEl.classList.contains("tab-button");

  if (isTabButton) {
    // const tabTextarea = setActiveTabTextareaElement(activeEl);
    // const isActiveTextarea = document.activeElement === tabTextarea;
    // colorLog.notice("tabTextarea:", tabTextarea);
    // colorLog.info("isTabTextareaFocused:", isActiveTextarea);
    flashWithClass(activeEl, secondaryActiveEl);
  } else {
    // const isActiveTextarea = document.activeElement === activeEl;
    // colorLog.info("isActiveTextarea:", isActiveTextarea);
    flashWithClass(activeEl);
  }
}

/**
 * FLASH WITH CLASS
 * Flashes the active element with a quick add and removal of the .flash-active class.
 *
 * @param {HTMLElement} activeEl The active element to flash.
 * @param {HTMLElement} secondaryActiveEl The optional secondary active element to flash.
 */
function flashWithClass(flashEl, secondaryFlashEl) {
  colorLog.run("Running flashWithClass();");

  const elementsToFlash = [flashEl];
  const flashDuration = 300;

  if (secondaryFlashEl) elementsToFlash.push(secondaryFlashEl);

  elementsToFlash.forEach((el) => {
    clearTimeout(el.flashTimeout);
    cancelAnimationFrame(el.flashFrame);

    el.classList.remove("flash-active");

    el.flashFrame = requestAnimationFrame(() => {
      el.classList.add("flash-active");

      el.flashTimeout = setTimeout(() => {
        el.classList.remove("flash-active");
        el.flashTimeout = null;
      }, flashDuration);
    });
  });
}
