/**
 * LOAD THE UI LAYOUT MODIFICATIONS
 */
function loadUI() {
  colorLog.run("Running loadUI()");
  previousBody = document.body;
  isReloadScheduled = false;
  lastUrl = `${location.origin}${location.pathname}`;
  contentPanel = document.querySelector(".assignment-content-panel") || document.querySelector(".book-content-panel");
  instructionsPanel = document.querySelector(".instructions-panel");
  tabsPanel = document.querySelector(".tabs-panel");

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
