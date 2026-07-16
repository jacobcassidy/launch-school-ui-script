/**
 * LOAD HELPERS
 */
import { colorLog } from "./log.js";
import { injectHeader } from "../header.js";
import { injectStyles } from "./style.js";
import { injectToaster } from "../toaster.js";
import { setIsReloadScheduled, setLastUrl, setPreviousBody } from "./set.js";
import { elements, states } from "./state.js";
import { syncInjectedElementsState, syncNativeElementsState } from "./sync.js";
import {
  watchForPageChange,
  watchHotkeys,
  watchPromptSubmission,
  watchQuestionBoxes,
  watchScrollContainer,
  watchShowSidebarBtn,
  watchTabBtnClick,
  watchTabsPanelToggleBtn,
} from "./watch.js";
import { showTabsPanel } from "./show.js";

/**
 * LOAD UI
 * Inserts the UI modifications into the DOM.
 */
export function loadUI() {
  colorLog.run("Running loadUI()");
  injectStyles();
  syncNativeElementsState();
  injectHeader();
  injectToaster();
  syncInjectedElementsState();

  // Apply active state on load
  if (elements.native.tabsPanel && !states.isTabsPanelHidden) showTabsPanel();

  // Set states
  setLastUrl(`${location.origin}${location.pathname}`);
  setPreviousBody(document.body);
  setIsReloadScheduled(false);

  // Watch elements:
  watchForPageChange();
  watchHotkeys();
  watchPromptSubmission();
  watchQuestionBoxes();
  watchScrollContainer();
  watchShowSidebarBtn();
  watchTabBtnClick();
  watchTabsPanelToggleBtn();
}

/**
 * SCHEDULE RELOAD
 * Schedules an UI reload for after a DOM refresh from a page change.
 */
export function scheduleReload() {
  colorLog.run("Running scheduleReload()");
  const isReloadScheduled = states.isReloadScheduled;
  if (isReloadScheduled) return;
  setIsReloadScheduled(true);

  colorLog.info("Waiting for new DOM to be ready...");
  const startWait = performance.now();

  const waitForDom = () => {
    colorLog.run("Running waitForDom()");
    const isNewBody = document.body !== states.previousBody;
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
