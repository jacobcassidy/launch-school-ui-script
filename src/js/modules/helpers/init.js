/**
 * INIT
 */
import { loadUI } from "./load.js";
import {
  watchPromptSubmission,
  watchForPageChange,
  watchHotkeys,
  watchQuestionBoxes,
  watchScrollContainer,
  watchShowSidebarBtn,
  watchTabBtnClick,
} from "./watch.js";

/**
 * INIT SCRIPT
 * Initializes the script to modify the LaunchSchool.com UI
 */
export function initScript() {
  loadUI();

  // Watch elements:
  watchForPageChange();
  watchPromptSubmission();
  watchHotkeys();
  watchQuestionBoxes();
  watchScrollContainer();
  watchShowSidebarBtn();
  watchTabBtnClick();
}
