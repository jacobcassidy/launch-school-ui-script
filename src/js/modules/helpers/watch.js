/**
 * WATCH HELPERS
 */
import { colorLog } from "./log.js";
import { elements, states } from "./state.js";
import { handleFocus } from "./focus.js";
import { runCmdCtrlHotkeys, runCmdShiftHotkeys } from "../hotkeys";
import { scheduleReload } from "./load.js";
import { setIsHeaderTop } from "./set.js";
import { showSidebar } from "./show.js";
import { toggleTabsPanel } from "./toggle.js";
const { tabsPanel } = elements;

/**
 * WATCH FOR PAGE CHANGE
 */
export function watchForPageChange() {
  colorLog.run("Running watchForPageChange()");
  let observerTimeoutId;

  // Observe document for page changes
  const observer = new MutationObserver(() => {
    const currentTimeoutId = observerTimeoutId;
    clearTimeout(currentTimeoutId);
    const newTimeoutId = setTimeout(() => {
      scheduleReloadOnPageChange("observer");
    }, 100);

    observerTimeoutId = newTimeoutId;
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Triggered with browsers back/forward navigation
  window.addEventListener("popstate", () => {
    colorLog.notice("popstate: Browser back/forward nav");
    scheduleReloadOnPageChange("popstate");
  });

  // Triggered with url hashchange such as /page to /page#section2
  window.addEventListener("hashchange", () => {
    colorLog.notice("hashchange in URL");
    scheduleReloadOnPageChange("hashchange");
  });

  // REMOVE IF NOT USED
  document.addEventListener("turbo:load", () => {
    colorLog.alert("EVENT UPDATE! turbo:load");
    scheduleReloadOnPageChange("turbo:load");
  });

  // REMOVE IF NOT USED
  document.addEventListener("turbo:render", () => {
    colorLog.alert("EVENT UPDATE! turbo:render");
    scheduleReloadOnPageChange("turbo:render");
  });

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    colorLog.notice("history.pushState");
    originalPushState.apply(this, args);
    scheduleReloadOnPageChange("pushState");
  };

  history.replaceState = function (...args) {
    colorLog.notice("history.replaceState");
    originalReplaceState.apply(this, args);
    scheduleReloadOnPageChange("replaceState");
  };
}

/**
 * SCHEDULE RELOAD ON PAGE CHANGE
 * @param {string} from Where this function was called from.
 */
function scheduleReloadOnPageChange(from) {
  colorLog.detail(`Running scheduleReloadOnPageChange() from ${from}`);

  const isReloadScheduled = states.isReloadScheduled;
  if (isReloadScheduled) {
    colorLog.detail("Reload already scheduled. Exiting scheduleReloadOnPageChange().");
    return;
  }

  const currentUrl = `${location.origin}${location.pathname}`;
  const lastUrl = states.lastUrl;
  if (currentUrl === lastUrl) {
    colorLog.detail("URL did not change. Exiting scheduleReloadOnPageChange().");
    return;
  }

  scheduleReload();
}

/**
 * WATCH TABS PANEL TOGGLE BUTTON
 */
export function watchTabsPanelToggleBtn() {
  colorLog.run("Running watchTabsPanelToggleBtn()");
  const tabsPanelToggleBtn = elements.injected.tabsPanelToggleButton;
  tabsPanelToggleBtn?.addEventListener("click", () => toggleTabsPanel());
}

/**
 * WATCH SHOW SIDEBAR BUTTON
 * Shows the sidebar when the button is clicked
 */
export function watchShowSidebarBtn() {
  colorLog.run("Running watchShowSidebarBtn()");
  const sidebarShowBtn = elements.injected.sidebarShowButton;
  sidebarShowBtn?.addEventListener("click", () => showSidebar());
}

/**
 * WATCH PAGE SCROLL CONTAINER
 */
export function watchScrollContainer() {
  colorLog.run("Running watchScrollContainer");
  const scrollContainer = elements.native.scrollContainer;

  if (!scrollContainer) {
    colorLog.info("There is no scrollContainer on this page to watch.");
    return;
  }

  const isWindowScroll = scrollContainer === "window";

  const handleScroll = () => {
    colorLog.run("Running handleScroll()");
    const isHeaderTop = states.isHeaderTop;

    if (isWindowScroll) {
      if (window.scrollY <= 2 && !isHeaderTop) {
        setIsHeaderTop(true);
      } else if (window.scrollY > 2 && isHeaderTop) {
        setIsHeaderTop(false);
      }
    } else {
      if (scrollContainer.scrollTop <= 2 && !isHeaderTop) {
        setIsHeaderTop(true);
      } else if (scrollContainer.scrollTop > 2 && isHeaderTop) {
        setIsHeaderTop(false);
      }
    }
  };

  if (isWindowScroll) {
    if (window.scrollY <= 2) setIsHeaderTop(true);
    window.addEventListener("scroll", handleScroll);
  } else {
    if (scrollContainer.scrollTop <= 2) setIsHeaderTop(true);
    scrollContainer.addEventListener("scroll", handleScroll);
  }
}

/**
 * WATCH HOTKEYS
 * Runs the activated hotkey
 */
export function watchHotkeys() {
  colorLog.run("Running watchHotkeys()");
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
        event.code !== "KeyR"
      )
        return;
    }

    // TODO - Check if this is needed, otherwise remove it.
    // event.preventDefault();
    // event.stopImmediatePropagation();

    if (isCmdShift) runCmdShiftHotkeys();
    if (isCmdCtrl) runCmdCtrlHotkeys();
  });
}

/**
 * WATCH TAB BUTTON CLICK
 * Run handleFocus() on each tab button click
 */
export function watchTabBtnClick() {
  colorLog.run("Running watchTabBtnClick()");
  const tabButtons = document.querySelectorAll(".tab-button");
  if (tabButtons.length < 1) return;

  tabButtons.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => handleFocus(tabBtn));
  });
}

/**
 * WATCH PROMPT SUBMISSION
 * Refocuses the LSBOT prompt after the prompt is submitted.
 */
export function watchPromptSubmission() {
  colorLog.run("Running watchPromptSubmission()");

  const lsbotPromptInputs = document.querySelectorAll(".lsbot-question-input");
  if (lsbotPromptInputs.length < 1) return;

  let promptObserver = null;

  lsbotPromptInputs.forEach((prompt) => {
    prompt.addEventListener("focus", () => {
      promptObserver?.disconnect();

      promptObserver = new MutationObserver(() => {
        colorLog.run("Running promptObserver()");

        if (!prompt.disabled) {
          promptObserver.disconnect();
          prompt.focus();
        }
      });

      promptObserver.observe(prompt, {
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
  colorLog.run("Running watchQuestionBoxes()");
  const questionBoxes = document.querySelectorAll(".lsbot-question-box");
  if (questionBoxes.length < 1 || !tabsPanel) return;

  const lsbotTabBtn = document.querySelector(".tab-button[data-tab='lsbot-help']");

  const handleSubmitClick = () => {
    colorLog.run("Running handleSubmitClick()");
    handleFocus(lsbotTabBtn);
    // showTabsPanel();
  };

  const handleSubmitHotkey = () => {
    colorLog.run("Running handleSubmitHotkey()");
    const isCmdEnter = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && event.key === "Enter";
    if (!isCmdEnter) return;
    handleFocus(lsbotTabBtn);
    // showTabsPanel();
  };

  questionBoxes.forEach((box) => {
    const boxSubmitButton = box.querySelector(".lsbot-question-box-send-answer-button");
    boxSubmitButton.addEventListener("click", handleSubmitClick);

    const boxTextarea = box.querySelector(".lsbot-question-box-answer-input");
    boxTextarea.addEventListener("focus", () => boxTextarea.addEventListener("keydown", handleSubmitHotkey));
    boxTextarea.addEventListener("blur", () => boxTextarea.removeEventListener("keydown", handleSubmitHotkey));
  });
}
