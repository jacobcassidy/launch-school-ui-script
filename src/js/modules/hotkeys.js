/**
 * HOTKEYS
 */
import { activateCodeEditor, activateTab } from "./helpers/activate.js";
import { colorLog } from "./helpers/log.js";
import { elements } from "./helpers/state.js";
import { showToast } from "./helpers/show.js";
import { toggleHeader, toggleSidebar, toggleTabsPanel } from "./helpers/toggle.js";
import { watchHotkeys } from "./helpers/watch.js";
const { instructionsPanel, tabsPanel, sidebar } = elements;

/**
 * INITIALIZE HOTKEYS
 */
export function initHotkeys() {
  colorLog.run("Running initHotkeys()");

  if (document.documentElement.dataset.hotkeysBound === "true") {
    colorLog.detail("Hotkeys already exist. Exited initHotkeys().");
    return;
  }

  document.documentElement.dataset.hotkeysBound = "true";
  watchHotkeys();
}

/**
 * RUN `CMD + SHIFT` HOTKEYS
 */
export function runCmdShiftHotkeys() {
  colorLog.run("Running runCmdShiftHotkeys()");

  // Hotkey: Toggle Header
  if (event.code == "Digit1") {
    toggleHeader();
    return;
  }

  // Hotkey: Toggle Tabs Panel
  if (event.code == "Digit2") {
    toggleTabsPanel();
    return;
  }

  // Hotkey: Focus CodeEditor or Toggle Scratchpad
  if (event.code == "KeyE") {
    activateCodeEditor();
    return;
  }
}

/**
 * RUN `CMD + CTRL` HOTKEYS
 */
export function runCmdCtrlHotkeys() {
  console.log("Running runCmdCtrlHotkeys");

  let nextExerciseLink,
    exerciseCompleteBtn,
    exerciseCompleteUndoBtn = null;

  if (instructionsPanel) {
    nextExerciseLink = [...document.querySelectorAll("a")].find((a) =>
      a.textContent.includes("Go to the next exercise"),
    );

    exerciseCompleteBtn = [...document.querySelectorAll("button")].find((btn) =>
      btn.textContent.includes("Mark this exercise as complete"),
    );

    exerciseCompleteUndoBtn = [...document.querySelectorAll("button")].find((btn) =>
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
    if (sidebar) toggleSidebar();
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
    if (exerciseCompleteBtn) {
      showToast("Exercise marked as Completed");
      exerciseCompleteBtn.click();
    } else if (exerciseCompleteUndoBtn) {
      showToast("Exercise marked as Incomplete");
      exerciseCompleteUndoBtn.click();
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
}
