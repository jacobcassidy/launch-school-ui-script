/**
 * ACTIVATE HELPERS
 */
// import { colorLog } from "./log";
import { elements } from "./state";
import { handleFocus } from "./focus";

/**
 * ACTIVATE CODE EDITOR
 * Activates the Code Editor or Scratchpad depending on the current page
 */
export function activateCodeEditor() {
  // colorLog.run("Running activateCodeEditor()");
  const tabsPanel = elements.native.tabsPanel;

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
 * Activates the selected tab button and matching tab content container
 *
 * @param {HTMLElement} tabBtn The selected .tab-button element
 */
export function activateTab(tabBtn) {
  // colorLog.run("Running activateTab()");

  tabBtn.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );

  tabBtn.click();
}
