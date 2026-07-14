/**
 * ACTIVATE HELPERS
 */
import { colorLog } from "./log";
import { elements } from "./state";
import { handleFocus } from "./focus";
import { showTabsPanel } from "./show";
const { tabsPanel } = elements;

/**
 * ACTIVATE CODE EDITOR
 * Activate the Code Editor or Scratchpad depending on the current page
 */
export function activateCodeEditor() {
  colorLog.run("Running activateCodeEditor()");

  if (tabsPanel) {
    const scratchpad = document.querySelector(".tab-button[data-tab='code-editor']");
    if (scratchpad) activateTab(scratchpad);
  } else {
    const codeEditor = document.querySelector(".CodeMirror textarea");
    if (codeEditor) handleFocus(codeEditor);
  }
}

/**
 * ACTIVATE TAB
 * Activates the selected tab button and matching container
 *
 * @param {HTMLElement} tabBtn The selected .tab-button element
 */
export function activateTab(tabBtn) {
  colorLog.run("Running activateTab()");

  if (tabsPanel) {
    const isTabsPanelHidden = tabsPanel.classList.contains("hidden") || tabsPanel.classList.contains("panel-collapsed");

    if (isTabsPanelHidden) {
      tabBtn.click();
      showTabsPanel();
      return;
    }
  }

  tabBtn.click();
}
