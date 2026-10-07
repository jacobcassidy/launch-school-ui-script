/**
 * SYNC NATIVE ELEMENTS STATE
 * @module utils/sync/native-elements-state
 */

// Import utils
import {
  setElementContentPanel,
  setElementEditorPanel,
  setElementScratchpad,
  setElementSidebar,
  setElementTabNav,
  setElementTabsPanel,
  setElementTocButton,
} from "../state/setters/dom.js";

/**
 * SYNC NATIVE ELEMENTS STATE
 * Sets the states properties for the page's native app DOM elements
 */
export function syncNativeElementsState() {
  const contentPanel =
    document.querySelector(".assignment-content-panel") || document.querySelector(".book-content-panel");
  const editorPanel = document.querySelector(".editor-panel");
  const scratchpad = document.querySelector("#tab-code-editor");
  const sidebar = document.querySelector(".nav-drawer");
  const tabNav = document.querySelector(".tab-nav");
  const tabsPanel = document.querySelector(".tabs-panel");
  const tocButton = document.querySelector(".toc-toggle-button");

  setElementContentPanel(contentPanel);
  setElementEditorPanel(editorPanel);
  setElementScratchpad(scratchpad);
  setElementSidebar(sidebar);
  setElementTabNav(tabNav);
  setElementTabsPanel(tabsPanel);
  setElementTocButton(tocButton);
}
