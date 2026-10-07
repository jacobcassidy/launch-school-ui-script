/**
 * SYNC AVAILABLE HOTKEYS
 * @module utils/sync/available-hotkeys
 */

// Import utils
import { activateTab } from "../helpers/activate.js";
import { handleFocus } from "../helpers/focus.js";
import { showToast } from "../helpers/show.js";
import {
  toggleExerciseCompletionStatus,
  toggleHeader,
  toggleSettings,
  toggleSidebar,
  toggleTabsPanel,
  toggleTocMenu,
} from "../helpers/toggle.js";
import { elements } from "../state/dom.js";
import { hotkeys } from "../state/hotkeys.js";
import { setAvailableHotkey } from "../state/setters/hotkeys.js";

/**
 * Syncs the hotkeys available on the current page.
 */
export function syncAvailableHotkeys() {
  // Clear any previous hotkeys when syncing.
  hotkeys.enterOnly = {};
  hotkeys.cmdOnly = {};
  hotkeys.cmdShift = {};
  hotkeys.cmdCtrl = {};

  // Sync current hotkeys.
  syncEnterOnlyHotkey();
  syncCmdOnlyHotkeys();
  syncCmdShiftHotkeys();
  syncCmdCtrlHotkeys();
}

/**
 * SYNC ENTER ONLY HOTKEY
 */
function syncEnterOnlyHotkey() {
  const chatInputs = document.querySelectorAll(".lsbot-question-input, .lsbot-question-box-answer-input");
  if (chatInputs.length < 1) return;
  setAvailableHotkey("enterOnly", "Enter", "Enter", "Submit focused chat prompt", null);
}

/**
 * SYNC CMD ONLY HOTKEYS
 */
function syncCmdOnlyHotkeys() {
  if (elements.native.sidebar) setAvailableHotkey("cmdOnly", "KeyB", "B", "Toggle Sidebar Visibility", toggleSidebar);
}

/**
 * SYNC CMD + SHIFT HOTKEYS
 */
function syncCmdShiftHotkeys() {
  if (elements.injected.header) setAvailableHotkey("cmdShift", "Digit1", 1, "Toggle Header Visibility", toggleHeader);
  if (elements.native.tabsPanel)
    setAvailableHotkey("cmdShift", "Digit2", 2, "Toggle Tabs Panel Visibility", toggleTabsPanel);
}

/**
 * SYNC CMD + CTRL HOTKEYS
 */
function syncCmdCtrlHotkeys() {
  const editorExists = elements.native.editorPanel;
  const copyCodeBtnExists = document.querySelector(".btn-copy-code");
  const exerciseCompletionBtnExists = document.querySelector(
    ".instructions-panel .gray-links form button[type=submit]",
  );
  const submitReviewBtnExists = document.querySelector("#lsbot-send-review, #btn-book-lsbot-review");

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

  const handleNextExerciseHotkey = () => {
    showToast("Going to next exercise");
    elements.native.nextExerciseButton.click();
  };

  const handleSubmitReviewHotkey = () => {
    const reviewSubmitBtn = document.querySelector("#lsbot-send-review, #btn-book-lsbot-review");
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

  if (elements.native.tabNav) handleTabsHotkeys();
  if (copyCodeBtnExists) handleCopyCodeHotkey();
  if (editorExists || elements.native.scratchpad) handleEditorHotkey("cmdCtrl");
  if (exerciseCompletionBtnExists)
    setAvailableHotkey("cmdCtrl", "KeyM", "M", "Toggle Exercise Completion Status", toggleExerciseCompletionStatus);
  if (elements.native.nextExerciseButton)
    setAvailableHotkey("cmdCtrl", "KeyN", "N", "Go to next exercise", handleNextExerciseHotkey);
  if (submitReviewBtnExists) setAvailableHotkey("cmdCtrl", "KeyR", "R", "Submit Review", handleSubmitReviewHotkey);
  if (elements.native.tocButton)
    setAvailableHotkey("cmdCtrl", "KeyT", "T", "Toggle Table of Content Visibility", toggleTocMenu);
  if (elements.injected.settingsMenu)
    setAvailableHotkey("cmdCtrl", "Comma", ",", "Toggle Settings Visibility", toggleSettings);
}
