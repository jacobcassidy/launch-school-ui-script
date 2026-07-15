/**
 * LOAD HELPERS
 */
import { colorLog } from "./log.js";
import { getIsReloadScheduled, getPreviousBody } from "./get.js";
import { initHotkeys } from "../hotkeys.js";
import { injectHeader } from "../header.js";
import { injectStyles } from "./style.js";
import { injectToaster } from "../toaster.js";
import { setIsReloadScheduled, setLastUrl, setPreviousBody } from "./set.js";
import { syncNativeElementsState } from "./native.js";
import { watchForPageChange, watchScrollContainer, watchShowSidebarBtn, watchTabBtnClick } from "./watch.js";

/**
 * LOAD UI
 * Inserts the UI modifications into the DOM.
 */
export function loadUI() {
  colorLog.run("Running loadUI()");

  const currentUrl = `${location.origin}${location.pathname}`;
  setLastUrl(currentUrl);
  setPreviousBody(document.body);
  setIsReloadScheduled(false);
  syncNativeElementsState();

  injectStyles();
  injectHeader();
  injectToaster();
  initHotkeys();
}

/**
 * SCHEDULE RELOAD
 * Schedules an UI reload for after a DOM refresh from a page change.
 */
export function scheduleReload() {
  colorLog.run("Running scheduleReloadOnPageChange()");
  if (getIsReloadScheduled()) return;
  setIsReloadScheduled(true);

  colorLog.info("Waiting for new DOM to be ready...");
  const startWait = performance.now();

  const waitForDom = () => {
    colorLog.run("Running waitForDom()");

    const isNewBody = document.body !== getPreviousBody();
    const isWaitMaxReached = performance.now() - startWait > 3000;

    if (isNewBody || isWaitMaxReached) {
      if (isWaitMaxReached) colorLog.alert("Max wait time reached. Reloading UI layout.");
      if (isNewBody) colorLog.notice("New DOM is ready. Reloading UI layout.");
      loadUI();
      return;
    }
    requestAnimationFrame(waitForDom);
  };

  requestAnimationFrame(waitForDom);
}
