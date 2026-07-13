import { colorLog } from "./helpers/utility";
import {
  elements,
  // setIsHeaderPinned,
  // setIsHeaderUnpinned,
  // getIsHeaderPinned,
  // getIsHeaderUnpinned,
  // getIsHeaderTop,
  // setIsHeaderTop,
} from "./helpers/state";
import { handleFocus } from "./focus";
import { showTabsPanel, showHeader, showToast } from "./helpers/show";
// import { hideHeader } from "./helpers/hide";
import { toggleSidebar } from "./helpers/toggle.js";

const { header, instructionsPanel, tabsPanel } = elements;

/**
 * ADD HOTKEYS
 */
export function addHotkeys() {
  console.log("Running addHotkeys()");

  if (document.documentElement.dataset.hotkeysBound === "true") {
    colorLog.detail("Hotkeys already exist. Exited addHotkeys().");
    return;
  }

  document.documentElement.dataset.hotkeysBound = "true";

  /**
   * Activate the Code Editor or Scratchpad depending on the current page
   */
  const activateCodeEditor = () => {
    console.log("Running activateCodeEditor()");

    if (tabsPanel) {
      const scratchpad = document.querySelector(".tab-button[data-tab='code-editor']");
      if (scratchpad) activateTab(scratchpad);
    } else {
      const codeEditor = document.querySelector(".CodeMirror textarea");
      if (codeEditor) handleFocus(codeEditor);
    }
  };

  /**
   * Activate the selected tab button
   * @param {HTMLElement} tabBtn The selected .tab-button element
   */
  const activateTab = (tabBtn) => {
    console.log("Running activateTab()");

    if (tabsPanel) {
      const isTabsPanelHidden =
        tabsPanel.classList.contains("hidden") || tabsPanel.classList.contains("panel-collapsed");
      if (isTabsPanelHidden) {
        tabBtn.click();
        showTabsPanel();
        return;
      }
    }

    tabBtn.click();
  };

  /**
   * The `SHIFT + CMD + KEY` hotkeys
   */
  const runShiftCmdHotkeys = () => {
    console.log("Running runShiftCmdHotkeys()");

    // Hotkey: Toggle Site Header
    if (event.code == "Digit1") {
      // TODO - Refactor this section
      // if (isHeaderTop) {
      //   if (isHeaderHidden) {
      //     showHeader();
      //   } else {
      //     hideHeader();
      //   }
      //   return;
      // }

      // // Toggle Pinned State
      // isHeaderPinned = !isHeaderPinned;
      // isHeaderUnpinned = !isHeaderPinned;

      // if (isHeaderPinned) {
      //   siteHeader.classList.add("is-pinned");
      //   siteHeader.classList.remove("is-unpinned");
      //   showHeader();
      // } else {
      //   siteHeader.classList.remove("is-pinned");
      //   siteHeader.classList.add("is-unpinned");
      //   hideHeader();
      // }

      return;
    }

    // Hotkey: Toggle LSBot Panel
    if (event.code == "Digit2") {
      const lsbotTab =
        document.querySelector(".tab-button[data-tab='lsbot-help']") ||
        document.querySelector(".tab-button[data-tab='lsbot-hints']");
      if (lsbotTab) activateTab(lsbotTab);
      return;
    }

    // Hotkey: Focus CodeEditor or Toggle Scratchpad
    if (event.code == "KeyE") {
      activateCodeEditor();
      return;
    }
  };

  /**
   * The `CTRL + CMD + KEY` hotkeys
   */
  const runCtrlCmdHotkeys = () => {
    console.log("Running runCtrlCmdHotkeys");

    let nextExerciseLink,
      exerciseCompleteEl,
      exerciseCompleteUndoEl = null;

    if (instructionsPanel) {
      nextExerciseLink = [...document.querySelectorAll("a")].find((a) =>
        a.textContent.includes("Go to the next exercise"),
      );

      exerciseCompleteEl = [...document.querySelectorAll("button")].find((btn) =>
        btn.textContent.includes("Mark this exercise as complete"),
      );

      exerciseCompleteUndoEl = [...document.querySelectorAll("button")].find((btn) =>
        btn.textContent.includes("Undo mark complete"),
      );
    }

    // Hotkey: Toggle or Focus Tab Panel in numbered order
    if (event.code.startsWith("Digit")) {
      const tabsData = [];

      if (tabsPanel || instructionsPanel) {
        const allTabButtons = document.querySelectorAll(".tab-button");

        allTabButtons.forEach((btn) => {
          const isHidden = getComputedStyle(btn).display === "none";
          if (isHidden) return;

          const dataTabStr = btn?.dataset?.tab;
          if (dataTabStr) {
            tabsData.push({ tabName: dataTabStr });
          }
        });

        tabsData.forEach((tab, idx) => {
          const digitEventCode = `Digit${idx + 1}`;

          if (event.code == digitEventCode) {
            const tabButton = document.querySelector(`.tab-button[data-tab='${tab.tabName}']`);
            activateTab(tabButton);
          }
        });
      }
      return;
    }

    // Hotkey: Toggle Sidebar
    if (event.code === "KeyB") {
      const sidebar = document.querySelector(".nav-drawer");
      if (!sidebar) return;
      toggleSidebar();
      return;
    }

    // Hotkey: Activate Copy Code button
    if (event.code === "KeyC") {
      const copyBtn = document.querySelector(".btn-copy-code");
      if (!copyBtn) return;

      copyBtn.click();

      if (tabsPanel) {
        showToast("Scratchpad code copied");
      } else {
        showToast("Editor code copied");
      }
      return;
    }

    // Hotkey: Focus CodeEditor or Toggle Scratchpad
    if (event.code == "KeyE") {
      activateCodeEditor();
      return;
    }

    // Hotkey: Toggle 'Exercise Marked Complete'
    if (event.code === "KeyM") {
      if (exerciseCompleteEl) {
        showToast("Exercise marked as Completed");
        exerciseCompleteEl.click();
      } else if (exerciseCompleteUndoEl) {
        showToast("Exercise marked as Incomplete");
        exerciseCompleteUndoEl.click();
      }
      return;
    }

    // Hotkey: Click "Go to next exercise" link
    if (event.code === "KeyN") {
      if (!nextExerciseLink) return;

      showToast("Going to next exercise");
      nextExerciseLink.click();
      return;
    }

    // Hotkey: Submit code editor solution to the LSBot Review
    if (event.code === "KeyR") {
      const reviewSubmitButton = document.querySelector("#lsbot-send-review");
      if (!reviewSubmitButton) return;

      const lsbotTabButton = document.querySelector(".tab-button[data-tab='lsbot-help']");
      const reviewTabButton = document.querySelector(".tab-button[data-tab='submit-review']");

      // LSBot needs to be activated first before the Review Tab submission works.
      lsbotTabButton.click();
      reviewTabButton.click();

      setTimeout(() => {
        reviewSubmitButton.click();
      }, 100);

      showToast("Solution submitted for LSBot Review");
      return;
    }
  };

  // Hotkeys Event Listener
  document.addEventListener("keydown", (event) => {
    const keyAlt = event.altKey;
    const keyCmd = event.metaKey;
    const keyCtrl = event.ctrlKey;
    const keyShift = event.shiftKey;
    const isCmdShift = keyCmd && keyShift;
    const isCmdCtrl = keyCmd && keyCtrl;

    // Disallowed modifier key combos
    if (event.repeat || (!isCmdShift && !isCmdCtrl) || (isCmdShift && keyCtrl) || (isCmdCtrl && keyShift) || keyAlt)
      return;

    // Allowed primary key
    if (isCmdShift) {
      if (event.code !== "Digit1" && event.code !== "Digit2" && event.code !== "KeyE") return;
    } else if (isCmdCtrl) {
      if (
        event.code !== "Digit1" &&
        event.code !== "Digit2" &&
        event.code !== "Digit3" &&
        event.code !== "Digit4" &&
        event.code !== "Digit5" &&
        event.code !== "KeyB" &&
        event.code !== "KeyC" &&
        event.code !== "KeyE" &&
        event.code !== "KeyM" &&
        event.code !== "KeyN" &&
        event.code !== "KeyR"
      )
        return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    if (isCmdShift) runShiftCmdHotkeys();
    if (isCmdCtrl) runCtrlCmdHotkeys();
  });
}
