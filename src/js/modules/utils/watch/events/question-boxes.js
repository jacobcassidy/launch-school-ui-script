/**
 * WATCH QUESTION BOXES
 * @module utils/watch/events/question-boxes
 */

// Import utils
import { elements } from "../../state";
import { handleFocus } from "../../helpers";

/**
 * Opens the Tabs Panel with the LSBOT tab active when a content panel question box submission is made.
 */
export function watchQuestionBoxes() {
  // colorLog.run("Running watchQuestionBoxes()");

  const questionBoxes = document.querySelectorAll(".lsbot-question-box");
  if (questionBoxes.length < 1 || !elements.native.tabsPanel) {
    // colorLog.detail("No question boxes found on this page.");
    return;
  }

  const lsbotTabBtn = document.querySelector(".tab-button[data-tab='lsbot-help']");
  if (!lsbotTabBtn) return;

  const handleSubmitClick = () => {
    // colorLog.run("Running handleSubmitClick()");
    handleFocus(lsbotTabBtn);
  };

  const handleSubmitHotkey = (event) => {
    if (event.isComposing || event.keyCode === 229) return;
    // colorLog.run("Running handleSubmitHotkey()");
    const keyAlt = event.altKey;
    const keyCmd = event.metaKey;
    const keyCtrl = event.ctrlKey;
    const keyEnter = event.key === "Enter";
    const keyShift = event.shiftKey;
    const isEnterOnlySubmit = keyEnter && !keyAlt && !keyCmd && !keyCtrl && !keyShift;
    const isCmdEnterSubmit = keyCmd && keyEnter && !keyAlt && !keyCtrl && !keyShift;
    const isCtrlEnterSubmit = keyCtrl && keyEnter && !keyAlt && !keyCmd && !keyShift;
    const shouldSubmit = isEnterOnlySubmit || isCmdEnterSubmit || isCtrlEnterSubmit;
    if (!shouldSubmit) return;
    handleFocus(lsbotTabBtn);
  };

  questionBoxes.forEach((box) => {
    const boxSendLink = box.querySelector(".lsbot-question-link");
    const boxSubmitButton = box.querySelector(".lsbot-question-box-send-answer-button");
    if (!box.dataset.questionLinkEventBound && boxSendLink?.addEventListener) {
      boxSendLink.addEventListener("click", handleSubmitClick);
      box.dataset.questionLinkEventBound = "true";
    }
    if (!box.dataset.questionButtonEventBound && boxSubmitButton?.addEventListener) {
      boxSubmitButton.addEventListener("click", handleSubmitClick);
      box.dataset.questionButtonEventBound = "true";
    }

    const boxTextarea = box.querySelector(".lsbot-question-box-answer-input");
    if (!box.dataset.questionInputEventBound && boxTextarea?.addEventListener) {
      boxTextarea.addEventListener("focus", () => boxTextarea.addEventListener("keydown", handleSubmitHotkey));
      boxTextarea.addEventListener("blur", () => boxTextarea.removeEventListener("keydown", handleSubmitHotkey));
      box.dataset.questionInputEventBound = "true";
    }
  });
}
