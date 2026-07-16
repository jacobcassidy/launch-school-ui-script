/**
 * INIT
 */
// import { colorLog } from "./log.js";
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
 * INITIALIZE SCRIPT
 * Initializes the script to modify the LaunchSchool.com UI
 */
export function initScript() {
  loadUI();

  // TODO - Remove this if not needed
  // Watch elements:
  // initWatchHotkeys();

  // Watch elements:
  // watchForPageChange();
  // watchHotkeys();
  // watchPromptSubmission();
  // watchQuestionBoxes();
  // watchScrollContainer();
  // watchShowSidebarBtn();
  // watchTabBtnClick();
}

// TODO - Remove this if not needed
/**
 * INITIALIZE HOTKEYS
 */
// export function initWatchHotkeys() {
//   colorLog.run("Running initWatchHotkeys()");

//   if (document.documentElement.dataset.hotkeysBound === "true") {
//     colorLog.detail("Hotkeys already exist. Exited initWatchHotkeys().");
//     return;
//   }

//   document.documentElement.dataset.hotkeysBound = "true";
//   watchHotkeys();
// }
