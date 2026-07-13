import { colorLog } from "./helpers/utility.js";

import {
  elements,
  setContentPanelElement,
  setInstructionsPanelElement,
  setIsReloadScheduled,
  setLastUrl,
  setPreviousBody,
  setTabsPanelElement,
  getIsReloadScheduled,
} from "./helpers/state.js";

import injectStyles from "./styles.js";
import { addHeader } from "./header.js";
import { addToaster } from "./toasts.js";
import { watchScrollEl } from "./scroll.js";
import { addHotkeys } from "./hotkeys.js";
import { focusOnTabClick, refocusPromptAfterSubmission } from "./focus.js";
import { showLSBotPanelOnQbSubmission } from "./helpers/show.js";
import { hideTabsPanel } from "./helpers/hide.js";

const { previousBody } = elements;

/**
 * LOAD THE UI LAYOUT MODIFICATIONS
 */
export function loadUI() {
  colorLog.run("Running loadUI()");

  const currentUrl = `${location.origin}${location.pathname}`;
  const contentPanel =
    document.querySelector(".assignment-content-panel") || document.querySelector(".book-content-panel");
  const instructionsPanel = document.querySelector(".instructions-panel");
  const tabsPanel = document.querySelector(".tabs-panel");

  setPreviousBody(document.body);
  setIsReloadScheduled(false);
  setLastUrl(currentUrl);
  setContentPanelElement(contentPanel);
  setInstructionsPanelElement(instructionsPanel);
  setTabsPanelElement(tabsPanel);

  injectStyles();
  addHeader();
  addToaster();
  watchScrollEl();
  addHotkeys();
  focusOnTabClick();
  refocusPromptAfterSubmission();
  showLSBotPanelOnQbSubmission();
  if (tabsPanel) hideTabsPanel();
  // if ( tabsPanel || instructionsPanel ) addTabButtonLabelClass();
}

/**
 * Schedule UI reload for after DOM refresh.
 */
export function scheduleReload() {
  console.log("Running scheduleReload()");
  if (getIsReloadScheduled()) return;
  setIsReloadScheduled(true);

  colorLog.info("Waiting for new DOM to be ready...");
  const startWait = performance.now();

  const waitForDom = () => {
    console.log("Running waitForDom()");

    const isNewBody = document.body !== previousBody;
    const isWaitMaxReached = performance.now() - startWait > 3000;

    if (isNewBody || isWaitMaxReached) {
      if (isWaitMaxReached) colorLog.alert("Max wait time reached.");

      colorLog.notice("New DOM is ready. Reloading UI layout.");
      loadUI();
      return;
    }
    requestAnimationFrame(waitForDom);
  };

  requestAnimationFrame(waitForDom);
}
