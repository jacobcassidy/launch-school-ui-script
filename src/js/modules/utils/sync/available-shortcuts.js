/**
 * SYNC AVAILABLE SHORTCUTS
 * @module utils/sync/available-shortcuts
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
import { shortcuts } from "../state/shortcuts.js";
import { setAvailableShortcut } from "../state/setters/shortcuts.js";
import { syncShortcutTooltips } from "./shortcut-tooltips.js";

/**
 * Syncs the shortcuts available on the current page.
 */
export function syncAvailableShortcuts() {
  // Clear any previous shortcuts when syncing.
  shortcuts.enterOnly = {};
  shortcuts.cmdOnly = {};
  shortcuts.cmdShift = {};
  shortcuts.cmdCtrl = {};

  // Sync current shortcuts.
  syncEnterOnlyShortcut();
  syncCmdOnlyShortcuts();
  syncCmdShiftShortcuts();
  syncCmdCtrlShortcuts();
  syncShortcutTooltips();
}

/**
 * SYNC ENTER ONLY SHORTCUT
 */
function syncEnterOnlyShortcut() {
  const chatInputs = document.querySelectorAll(".lsbot-question-input, .lsbot-question-box-answer-input");
  const submitButtons = [...document.querySelectorAll(".lsbot-submit-btn, .lsbot-question-box-send-answer-button")];
  if (chatInputs.length < 1 || submitButtons.length < 1) return;
  setAvailableShortcut("enterOnly", "Enter", "Enter", "Submit focused chat prompt", null, submitButtons);
}

/**
 * SYNC CMD ONLY SHORTCUTS
 */
function syncCmdOnlyShortcuts() {
  if (elements.native.sidebar)
    setAvailableShortcut("cmdOnly", "KeyB", "B", "Toggle Sidebar Visibility", toggleSidebar, [
      elements.injected.sidebarToggleButton,
    ]);
}

/**
 * SYNC CMD + SHIFT SHORTCUTS
 */
function syncCmdShiftShortcuts() {
  if (elements.injected.header) setAvailableShortcut("cmdShift", "Digit1", 1, "Toggle Header Visibility", toggleHeader);
  if (elements.native.tabsPanel)
    setAvailableShortcut("cmdShift", "Digit2", 2, "Toggle Tabs Panel Visibility", toggleTabsPanel, [
      elements.injected.tabsPanelToggleButton,
    ]);
}

/**
 * SYNC CMD + CTRL SHORTCUTS
 */
function syncCmdCtrlShortcuts() {
  const editorExists = elements.native.editorPanel;
  const copyCodeBtnExists = document.querySelector(".btn-copy-code");
  const exerciseCompletionBtnExists = document.querySelector(
    ".instructions-panel .gray-links form button[type=submit]",
  );
  const submitReviewBtnExists = document.querySelector("#lsbot-send-review, #btn-book-lsbot-review");

  const handleCopyCodeShortcut = () => {
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

    setAvailableShortcut("cmdCtrl", "KeyC", "C", label, triggerCopyBtn, [copyCodeBtnExists]);
  };

  const handleEditorShortcut = (modifier) => {
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

    const scratchpadButton = editorExists ? null : document.querySelector(".tab-button[data-tab='code-editor']");
    setAvailableShortcut(modifier, "KeyE", "E", label, focusEl, [scratchpadButton]);
  };

  const handleNextExerciseShortcut = () => {
    showToast("Going to next exercise");
    elements.native.nextExerciseButton.click();
  };

  const handleSubmitReviewShortcut = () => {
    const reviewTabBtn = document.querySelector(".tab-button[data-tab='submit-review']");
    const pageUrl = `${location.origin}${location.pathname}${location.search}`;

    if (reviewTabBtn) activateTab(reviewTabBtn);

    setTimeout(() => {
      const reviewSubmitBtn = document.querySelector("#lsbot-send-review, #btn-book-lsbot-review");
      const currentPageUrl = `${location.origin}${location.pathname}${location.search}`;
      if (currentPageUrl !== pageUrl || !reviewSubmitBtn?.isConnected) return;
      if (reviewSubmitBtn.matches(":disabled") || reviewSubmitBtn.getAttribute("aria-disabled") === "true") {
        showToast("Review is not available yet", "alert");
        return;
      }

      reviewSubmitBtn.click();
    }, 100);
  };

  const handleTabsShortcuts = () => {
    // Set shortcuts for each tab #
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

      setAvailableShortcut("cmdCtrl", eventCode, key, btnLabel, triggerTab, [btnEl]);
    });
  };

  if (elements.native.tabNav) handleTabsShortcuts();
  if (copyCodeBtnExists) handleCopyCodeShortcut();
  if (editorExists || elements.native.scratchpad) handleEditorShortcut("cmdCtrl");
  if (exerciseCompletionBtnExists)
    setAvailableShortcut("cmdCtrl", "KeyM", "M", "Toggle Exercise Completion Status", toggleExerciseCompletionStatus, [
      exerciseCompletionBtnExists,
    ]);
  if (elements.native.nextExerciseButton)
    setAvailableShortcut("cmdCtrl", "KeyN", "N", "Go to next exercise", handleNextExerciseShortcut, [
      elements.native.nextExerciseButton,
    ]);
  if (submitReviewBtnExists)
    setAvailableShortcut("cmdCtrl", "KeyR", "R", "Submit Review", handleSubmitReviewShortcut, [submitReviewBtnExists]);
  if (elements.native.tocButton)
    setAvailableShortcut("cmdCtrl", "KeyT", "T", "Toggle Table of Content Visibility", toggleTocMenu, [
      elements.native.tocButton,
    ]);
  if (elements.injected.settingsMenu)
    setAvailableShortcut("cmdCtrl", "Comma", ",", "Toggle Settings Visibility", toggleSettings, [
      elements.injected.settingsToggleButton,
    ]);
}
