/**
 * @module helpers/watch
 */

import { colorLog } from "./log.js";
import { elements, states } from "./state.js";
import { handleFocus } from "./focus.js";
import { runCmdCtrlHotkeys, runCmdShiftHotkeys } from "../hotkeys";
import { scheduleReload } from "./load.js";
import { showSidebar } from "./show.js";
import { toggleSettingsMenu, toggleTabsPanel } from "./toggle.js";

/**
 * WATCH FOR CONTENT CHANGE
 */
export function watchForMissingHeader() {
  // colorLog.run("Running watchForMissingHeader()");
  if (document.documentElement.dataset.headerObserverBound) {
    // colorLog.detail("Header watch already exist. Exited watchForMissingHeader().");
    return;
  }
  document.documentElement.dataset.headerObserverBound = "true";

  let headerMissingTimeoutId;

  // Observe .site-header for mutations
  const observer = new MutationObserver(() => {
    // colorLog.detail("Running contentChange observer");

    if (document.querySelector(".site-header")) {
      clearTimeout(headerMissingTimeoutId);
      headerMissingTimeoutId = undefined;
      return;
    }

    if (headerMissingTimeoutId) return;

    headerMissingTimeoutId = setTimeout(() => {
      headerMissingTimeoutId = undefined;
      const siteHeader = document.querySelector(".site-header");
      if (siteHeader) {
        // colorLog.detail("header exists again.");
      } else {
        colorLog.detail(".site-header has been missing for over 300ms. Scheduling reload.");
        scheduleReload();
      }
    }, 300);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

/**
 * WATCH FOR URL CHANGE
 */
export function watchForUrlChange() {
  // colorLog.run("Running watchForUrlChange()");

  if (document.documentElement.dataset.watchPageBound) {
    // colorLog.detail("URL watch already exist. Exited watchForUrlChange().");
    return;
  }
  document.documentElement.dataset.watchPageBound = "true";

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  /**
   * CHECK FOR URL CHANGE
   * Schedules a UI reload if the page URL has changed.
   *
   * @param {string} from Where this function was called from.
   */
  const checkForUrlChange = (from) => {
    colorLog.detail(`checkForUrlChange() called from ${from}`);

    if (states.isReloadScheduled) {
      // colorLog.detail("Reload already scheduled. Exited checkForUrlChange().");
      return;
    }

    const currentUrl = `${location.origin}${location.pathname}`;
    const isChangedUrl = currentUrl !== states.lastUrl;

    if (!isChangedUrl) {
      // colorLog.detail("No URL change detected. Exiting checkForUrlChange().");
      return;
    }

    colorLog.detail("URL has changed.");
    scheduleReload();
  };

  // Triggered by browsers back/forward navigation
  window.addEventListener("popstate", () => {
    // colorLog.notice("popstate: Browser back/forward nav");
    checkForUrlChange("popstate");
  });

  // Triggered by url hashchange such as /page to /page#section2
  window.addEventListener("hashchange", () => {
    // colorLog.notice("hashchange in URL");
    checkForUrlChange("hashchange");
  });

  // Triggered by turbo:load
  document.addEventListener("turbo:load", () => {
    // colorLog.alert("EVENT UPDATE! turbo:load");
    checkForUrlChange("turbo:load");
  });

  // Triggered by turbo:render
  document.addEventListener("turbo:render", () => {
    // colorLog.alert("EVENT UPDATE! turbo:render");
    checkForUrlChange("turbo:render");
  });

  // Triggered by pushState
  history.pushState = function (...args) {
    // colorLog.notice("history.pushState");
    originalPushState.apply(this, args);
    checkForUrlChange("pushState");
  };

  // Triggered by replaceState
  history.replaceState = function (...args) {
    // colorLog.notice("history.replaceState");
    originalReplaceState.apply(this, args);
    checkForUrlChange("replaceState");
  };
}

/**
 * WATCH HOTKEYS
 * Runs the activated hotkey
 */
export function watchHotkeys() {
  // colorLog.run("Running watchHotkeys()");

  if (document.documentElement.dataset.hotkeysBound) {
    // colorLog.detail("Hotkeys already exist. Exited watchHotkeys().");
    return;
  }
  document.documentElement.dataset.hotkeysBound = "true";

  document.addEventListener("keydown", (event) => {
    const keyAlt = event.altKey;
    const keyCmd = event.metaKey;
    const keyCtrl = event.ctrlKey;
    const keyShift = event.shiftKey;
    const isCmdShift = keyCmd && keyShift;
    const isCmdCtrl = keyCmd && keyCtrl;

    // Disallowed key combos
    if (event.repeat || (!isCmdShift && !isCmdCtrl) || (isCmdShift && keyCtrl) || (isCmdCtrl && keyShift) || keyAlt)
      return;

    // Allowed hotkey modifier
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
        event.code !== "KeyR" &&
        event.code !== "KeyS" &&
        event.code !== "KeyT"
      )
        return;
    }

    if (isCmdShift) runCmdShiftHotkeys();
    if (isCmdCtrl) runCmdCtrlHotkeys();
  });
}

/**
 * WATCH PROMPT SUBMISSION
 * Refocuses the LSBOT prompt after the prompt is submitted.
 */
export function watchPromptSubmission() {
  // colorLog.run("Running watchPromptSubmission()");

  const lsbotPromptInputs = document.querySelectorAll(".lsbot-question-input");
  if (lsbotPromptInputs.length < 1) return;

  lsbotPromptInputs.forEach((prompt) => {
    if (prompt.dataset.focusObserverBound) {
      // colorLog.detail("Prompt watch already exist. Exited watchPromptSubmission() for this prompt.");
      return;
    }
    prompt.dataset.focusObserverBound = "true";

    let observer = null;

    prompt.addEventListener("focus", () => {
      console.log("Watching prompt focus.");

      observer?.disconnect();

      observer = new MutationObserver(() => {
        // colorLog.run("Running prompt observer()");

        if (prompt.disabled) {
          console.log("Prompt is disabled.");
        }

        if (!prompt.disabled) {
          observer.disconnect();
          console.log("Prompt focused.");
          prompt.focus();
        }
      });

      observer.observe(prompt, {
        attributes: true,
        attributeFilter: ["disabled"],
      });
    });
  });
}

/**
 * WATCH QUESTION BOXES
 * Opens the Tabs Panel with the LSBOT tab active when a question box submission is made.
 */
export function watchQuestionBoxes() {
  // colorLog.run("Running watchQuestionBoxes()");
  const questionBoxes = document.querySelectorAll(".lsbot-question-box");
  if (questionBoxes.length < 1 || !elements.native.tabsPanel) return;

  const lsbotTabBtn = document.querySelector(".tab-button[data-tab='lsbot-help']");

  const handleSubmitClick = () => {
    // colorLog.run("Running handleSubmitClick()");
    handleFocus(lsbotTabBtn);
  };

  const handleSubmitHotkey = () => {
    // colorLog.run("Running handleSubmitHotkey()");
    const isCmdEnter = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && event.key === "Enter";
    if (!isCmdEnter) return;
    handleFocus(lsbotTabBtn);
  };

  questionBoxes.forEach((box) => {
    if (box.dataset.questionEventBound) {
      // colorLog.detail("Question box watch already exist. Exited watchQuestionBoxes() for this box.");
      return;
    }
    box.dataset.questionEventBound = "true";

    const boxSendLink = box.querySelector(".lsbot-question-link");
    const boxSubmitButton = box.querySelector(".lsbot-question-box-send-answer-button");
    boxSendLink.addEventListener("click", handleSubmitClick);
    boxSubmitButton.addEventListener("click", handleSubmitClick);

    const boxTextarea = box.querySelector(".lsbot-question-box-answer-input");
    boxTextarea.addEventListener("focus", () => boxTextarea.addEventListener("keydown", handleSubmitHotkey));
    boxTextarea.addEventListener("blur", () => boxTextarea.removeEventListener("keydown", handleSubmitHotkey));
  });
}

/**
 * WATCH SETTINGS MENU TOGGLE BUTTON
 * Toggles the settings menu when clicked.
 */
export function watchSettingMenuToggleBtn() {
  // colorLog.run("Running watchSettingMenuToggleBtn()");
  const settingsMenuToggleBtn = elements.injected.settingsToggleButton;
  if (!settingsMenuToggleBtn) return;

  if (settingsMenuToggleBtn.dataset.settingsMenuToggleBtnEventBound) {
    // colorLog.detail("Settings Menu Toggle Button watch already exist. Exited watchSettingMenuToggleBtn().");
    return;
  }
  settingsMenuToggleBtn.dataset.settingsMenuToggleBtnEventBound = "true";

  settingsMenuToggleBtn.addEventListener("click", () => toggleSettingsMenu());
}

/**
 * WATCH SHOW SIDEBAR BUTTON
 * Shows the sidebar when the button is clicked
 */
export function watchShowSidebarBtn() {
  // colorLog.run("Running watchShowSidebarBtn()");
  const sidebarShowBtn = elements.injected.sidebarShowButton;
  if (!sidebarShowBtn) return;

  if (sidebarShowBtn.dataset.sidebarBtnEventBound) {
    // colorLog.detail("Show Sidebar Button watch already exist. Exited watchShowSidebarBtn().");
    return;
  }
  sidebarShowBtn.dataset.sidebarBtnEventBound = "true";

  sidebarShowBtn.addEventListener("click", () => showSidebar());
}

/**
 * WATCH TAB BUTTON CLICK
 * Run handleFocus() on each tab button click
 */
export function watchTabBtnClick() {
  // colorLog.run("Running watchTabBtnClick()");
  const tabButtons = document.querySelectorAll(".tab-button");
  if (tabButtons.length < 1) return;

  tabButtons.forEach((tabBtn) => {
    if (tabBtn.dataset.tabBtnEventBound) {
      // colorLog.detail("Tab Button watch already exist. Exited watchTabBtnClick() for this tab button.");
      return;
    }
    tabBtn.dataset.tabBtnEventBound = "true";

    tabBtn.addEventListener("click", () => {
      handleFocus(tabBtn);
    });
  });
}

/**
 * WATCH TABS PANEL TOGGLE BUTTON
 */
export function watchTabsPanelToggleBtn() {
  // colorLog.run("Running watchTabsPanelToggleBtn()");
  const tabsPanelToggleBtn = elements.injected.tabsPanelToggleButton;
  if (!tabsPanelToggleBtn) return;

  if (tabsPanelToggleBtn.dataset.tabsPanelToggleBtnEventBound) {
    // colorLog.detail("Tabs Panel Toggle Button watch already exist. Exited watchTabsPanelToggleBtn().");
    return;
  }
  tabsPanelToggleBtn.dataset.tabsPanelToggleBtnEventBound = "true";

  tabsPanelToggleBtn.addEventListener("click", () => toggleTabsPanel());
}
