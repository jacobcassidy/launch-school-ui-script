/**
 * WATCH QUESTION BOXES
 * @module utils/watch/events/question-boxes
 */

// Import utils
import { elements } from "../../state/dom.js";
import { handleFocus } from "../../helpers/focus.js";

const watchedQuestionBoxes = new WeakSet();

/**
 * Opens the Tabs Panel with the LSBOT tab active when a content panel question box submission is made.
 */
export function watchQuestionBoxes() {
  const questionBoxes = document.querySelectorAll(".lsbot-question-box");
  if (questionBoxes.length < 1 || !elements.native.tabsPanel) {
    return;
  }

  const handleSubmitClick = () => {
    const lsbotTabBtn = document.querySelector(".tab-button[data-tab='lsbot-help']");
    if (lsbotTabBtn) handleFocus(lsbotTabBtn);
  };

  const handleSubmitShortcut = (event) => {
    const boxTextarea = event.target;
    if (!boxTextarea.matches?.(".lsbot-question-box-answer-input") || document.activeElement !== boxTextarea) return;
    if (event.isComposing || event.keyCode === 229) return;
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
    handleSubmitClick();
  };

  questionBoxes.forEach((box) => {
    if (watchedQuestionBoxes.has(box)) return;
    watchedQuestionBoxes.add(box);

    box.addEventListener("click", (event) => {
      const submitter = event.target.closest?.(".lsbot-question-link, .lsbot-question-box-send-answer-button");
      if (!submitter || !box.contains(submitter)) return;
      handleSubmitClick();
    });

    box.addEventListener("keydown", handleSubmitShortcut);
  });
}
