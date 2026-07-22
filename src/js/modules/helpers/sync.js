/**
 * SYNC
 * @module helpers/sync
 */

import { activateTab } from "./activate.js";
import {
  elements,
  setAvailableHotkey,
  setElementContentPanel,
  setElementEditorPanel,
  setElementHeader,
  setElementInstructionsPanel,
  setElementScratchpad,
  setElementSettingsMenu,
  setElementSettingsToggleBtn,
  setElementSidebar,
  setElementSidebarShowButton,
  setElementTabNav,
  setElementTabsPanel,
  setElementTabsPanelToggleButton,
  setElementTocButton,
  states,
} from "./state.js";
import { toggleExerciseStatus, toggleHeader, toggleSettingsMenu, toggleSidebar, toggleTabsPanel } from "./toggle.js";
import { handleFocus } from "./focus.js";
import { showToast } from "./show.js";

/**
 * SYNC AVAILABLE HOTKEYS
 * Syncs the hotkeys available on the current page
 */
export function syncAvailableHotkeys() {
  // Clear any previous hotkeys when syncing.
  states.hotkeys.cmdShift = {};
  states.hotkeys.cmdCtrl = {};
  states.hotkeys.native = {};

  // Injected elements
  const headerExists = elements.injected.header;
  const settingsMenuExists = elements.injected.settingsMenu;

  // Native elements
  const copyCodeBtnExists = document.querySelector(".btn-copy-code");
  const editorExists = elements.native.editorPanel;
  const instructionsPanelExists = elements.native.instructionsPanel;
  const markExerciseBtnExists = document.querySelector(".edit_exercise_submission .button");
  const scratchpadExists = elements.native.scratchpad;
  const sidebarExists = elements.native.sidebar;
  const submitReviewBtnExists = document.querySelector("#lsbot-send-review");
  const tabNavExists = elements.native.tabNav;
  const tabsPanelExists = elements.native.tabsPanel;
  const tocButtonExists = elements.native.tocButton;
  let nextExerciseLinkExists, nextExerciseLink;

  if (instructionsPanelExists) {
    nextExerciseLink = [...document.querySelectorAll("a")].find((a) =>
      a.textContent.includes("Go to the next exercise"),
    );
    if (nextExerciseLink) nextExerciseLinkExists = true;
  }

  const handleEditorHotkey = (modifier) => {
    const editorPanel = elements.native.editorPanel;
    let focusEl;
    let label;

    const focusEditorPanel = () => {
      const codeEditor = editorPanel.querySelector(".CodeMirror textarea");
      if (codeEditor) handleFocus(codeEditor);
    };

    const focusScratchpad = () => {
      const scratchpadTab = document.querySelector(".tab-button[data-tab='code-editor']");
      if (scratchpadTab) activateTab(scratchpadTab);
    };

    if (editorExists) {
      focusEl = focusEditorPanel;
      label = "Focus Editor";
    } else {
      focusEl = focusScratchpad;
      label = "Focus Scratchpad Editor";
    }

    setAvailableHotkey(modifier, "KeyE", "E", label, focusEl);
  };

  /**
   * SYNC CMD + SHIFT HOTKEYS
   */
  const syncCmdShiftHotkeys = () => {
    if (headerExists) setAvailableHotkey("cmdShift", "Digit1", 1, "Toggle Header", toggleHeader);
    if (tabsPanelExists) setAvailableHotkey("cmdShift", "Digit2", 2, "Toggle Tabs Panel", toggleTabsPanel);
    if (editorExists || scratchpadExists) handleEditorHotkey("cmdShift");
  };

  /**
   * SYNC CMD + CTRL HOTKEYS
   */
  const syncCmdCtrlHotkeys = () => {
    const handleCopyCodeHotkey = () => {
      const triggerCopyBtn = () => {
        const copyBtn = document.querySelector(".btn-copy-code");

        copyBtn.dispatchEvent(
          new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            button: 0,
          }),
        );

        copyBtn.click();

        if (elements.native.scratchpad) showToast("Scratchpad code copied");
        else if (elements.native.editorPanel) showToast("Editor code copied");
        else showToast("Code copied");
      };

      let label;
      if (elements.native.scratchpad) label = "Copy Scratchpad Code";
      else label = "Copy Editor Code";

      setAvailableHotkey("cmdCtrl", "KeyC", "C", label, triggerCopyBtn);
    };

    const handleNextExerciseHotkey = () => {
      showToast("Going to next exercise");
      nextExerciseLink.click();
    };

    const handleSubmitReviewHotkey = () => {
      const reviewSubmitBtn = document.querySelector("#lsbot-send-review");
      const reviewTabBtn = document.querySelector(".tab-button[data-tab='submit-review']");

      activateTab(reviewTabBtn);

      setTimeout(() => {
        reviewSubmitBtn.click();
      }, 100);

      showToast("Solution submitted for LSBot Review");
    };

    const handleTabsHotkeys = () => {
      // Set hotkeys for each tab #
      const allTabBtns = document.querySelectorAll(".tab-button");
      const tabs = [];

      allTabBtns.forEach((btn) => {
        const isHidden = getComputedStyle(btn).display === "none";
        if (isHidden) return;

        const label = btn.getAttribute("aria-label") || btn.textContent.trim();
        const fullLabel = `Focus ${label} Tab`;
        tabs.push([btn, fullLabel]);
      });

      tabs.forEach((tab, index) => {
        const btnEl = tab[0];
        const btnLabel = tab[1];
        const key = index + 1;
        const eventCode = `Digit${key}`;
        const triggerTab = () => activateTab(btnEl);

        setAvailableHotkey("cmdCtrl", eventCode, key, btnLabel, triggerTab);
      });
    };

    const handleTocHotkey = () => document.querySelector(".toc-toggle-button").click();

    if (tabNavExists) handleTabsHotkeys();
    if (sidebarExists) setAvailableHotkey("cmdCtrl", "KeyB", "B", "Toggle Sidebar Menu", toggleSidebar);
    if (copyCodeBtnExists) handleCopyCodeHotkey();
    if (editorExists || scratchpadExists) handleEditorHotkey("cmdCtrl");
    if (markExerciseBtnExists)
      setAvailableHotkey("cmdCtrl", "KeyM", "M", "Toggle Exercise Status", toggleExerciseStatus);
    if (nextExerciseLinkExists)
      setAvailableHotkey("cmdCtrl", "KeyN", "N", "Go to next exercise", handleNextExerciseHotkey);
    if (submitReviewBtnExists) setAvailableHotkey("cmdCtrl", "KeyR", "R", "Submit Review", handleSubmitReviewHotkey);
    if (tocButtonExists) setAvailableHotkey("cmdCtrl", "KeyT", "T", "Toggle Table of Content", handleTocHotkey);
    if (settingsMenuExists) setAvailableHotkey("cmdCtrl", "Comma", ",", "Toggle Hotkeys Menu", toggleSettingsMenu);
  };

  // const syncNativeHotkeys = () => {};

  syncCmdShiftHotkeys();
  syncCmdCtrlHotkeys();
  // syncNativeHotkeys();  // DISPLAY NATIVE HOTKEYS IN MENU
}

/**
 * SYNC INJECTED ELEMENTS STATE
 * Sets the states properties for the script's injected DOM elements
 */
export function syncInjectedElementsState() {
  const header = document.querySelector(".site-header");
  const settingsMenu = document.querySelector(".settings-menu");
  const settingsToggleBtn = document.querySelector(".btn--toggle-settings");
  const sidebarShowBtn = document.querySelector(".btn--show-sidebar");
  const tabsPanelToggleBtn = document.querySelector(".btn--toggle-tabs-panel");

  setElementHeader(header);
  setElementSettingsMenu(settingsMenu);
  setElementSettingsToggleBtn(settingsToggleBtn);
  setElementSidebarShowButton(sidebarShowBtn);
  setElementTabsPanelToggleButton(tabsPanelToggleBtn);
}

/**
 * SYNC NATIVE ELEMENTS STATE
 * Sets the states properties for the page's native app DOM elements
 */
export function syncNativeElementsState() {
  const contentPanel =
    document.querySelector(".assignment-content-panel") || document.querySelector(".book-content-panel");
  const editorPanel = document.querySelector(".editor-panel");
  const scratchpad = document.querySelector("#tab-code-editor");
  const instructionsPanel = document.querySelector(".instructions-panel");
  const sidebar = document.querySelector(".nav-drawer");
  const tabNav = document.querySelector(".tab-nav");
  const tabsPanel = document.querySelector(".tabs-panel");
  const tocButton = document.querySelector(".toc-toggle-button");

  setElementContentPanel(contentPanel);
  setElementEditorPanel(editorPanel);
  setElementInstructionsPanel(instructionsPanel);
  setElementScratchpad(scratchpad);
  setElementSidebar(sidebar);
  setElementTabNav(tabNav);
  setElementTabsPanel(tabsPanel);
  setElementTocButton(tocButton);
}
