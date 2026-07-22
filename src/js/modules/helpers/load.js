/**
 * LOAD
 * @module helpers/load
 */

import { colorLog } from "./log.js";
import { injectHeader } from "../header.js";
import { injectStyles } from "./style.js";
import { injectToaster } from "../toaster.js";
import { setIsReloadScheduled, setLastUrl, elements, states } from "./state.js";
import { syncAvailableHotkeys, syncInjectedElementsState, syncNativeElementsState } from "./sync.js";
import {
  watchForMissingHeader,
  watchForUrlChange,
  watchHotkeys,
  watchPromptSubmission,
  watchQuestionBoxes,
  watchSettingMenuToggleBtn,
  watchShowSidebarBtn,
  watchTabBtnClick,
  watchTabsPanelToggleBtn,
} from "./watch.js";
import { hideHeader, hideTabsPanel } from "./hide.js";
import { showTabsPanel } from "./show.js";
import { injectHotkeysMenu } from "../hotkeys.js";

/**
 * LOAD UI
 * Inserts the UI modifications into the DOM.
 */
export function loadUI() {
  // colorLog.run("Running loadUI()");
  injectStyles();
  syncNativeElementsState();
  injectHeader();
  injectToaster();
  syncInjectedElementsState();
  syncAvailableHotkeys();
  injectHotkeysMenu();

  // Apply hidden state on load
  if (elements.native.tabsPanel) {
    if (states.hidden.isTabsPanelHidden) {
      hideTabsPanel();
    } else {
      showTabsPanel();
    }
  }

  if (elements.injected.header && states.hidden.isHeaderHidden) hideHeader();

  // Watch elements:
  watchForUrlChange();
  watchForMissingHeader();
  watchHotkeys();
  watchPromptSubmission();
  watchQuestionBoxes();
  watchShowSidebarBtn();
  watchTabBtnClick();
  watchTabsPanelToggleBtn();
  watchSettingMenuToggleBtn();
}

/**
 * RELOAD UI
 * Reloads loadUI() after a DOM refresh from a page/url change.
 */
export function scheduleReload() {
  // colorLog.run("Running scheduleReload()");
  if (states.load.isReloadScheduled) {
    // colorLog.detail("Reload is already scheduled. Exited scheduleReload().");
    return;
  }
  setIsReloadScheduled(true);

  const reloadUI = () => {
    loadUI();
    setLastUrl();
    setIsReloadScheduled(false);
  };

  colorLog.detail("Waiting for new DOM to be ready...");
  const startWait = performance.now();

  const waitForDom = () => {
    // colorLog.run("Running waitForDom()");
    const isNewBody = document.body !== states.load.previousBody;
    const isWaitMaxReached = performance.now() - startWait > 3000;

    if (isNewBody) {
      colorLog.info("New DOM is ready, calling reloadUI().");
      requestAnimationFrame(reloadUI);
      return;
    } else if (isWaitMaxReached) {
      colorLog.alert("Max wait time reached, calling reloadUI().");
      requestAnimationFrame(reloadUI);
      return;
    } else {
      requestAnimationFrame(waitForDom);
    }
  };

  requestAnimationFrame(waitForDom);
}
