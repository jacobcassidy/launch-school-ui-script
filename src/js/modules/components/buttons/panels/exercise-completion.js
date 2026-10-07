/**
 * EXERCISE COMPLETION BUTTON
 * @module components/buttons/panels/exercise-completion
 */

// Import components
import { icons } from "../../icons.js";
import { injectHotkeysSection } from "../../hotkeys-menu.js";

// Import utils
import { setButtonProperties } from "../../../utils/dom/buttons.js";
import { watchExerciseCompletionToggleBtn } from "../../../utils/watch/buttons/exercise-completion-toggle.js";
import { syncAvailableHotkeys } from "../../../utils/sync/available-hotkeys.js";

/**
 * Updates the exercise completion button styles and icons.
 */
export function updateExerciseCompletionButton() {
  const instructionsPanel = document.querySelector(".instructions-panel");
  if (!instructionsPanel) return;

  const exerciseCompletionForm = instructionsPanel.querySelector(".gray-links form");
  handleNewExerciseCompletionForm(exerciseCompletionForm);

  watchExerciseCompletionToggleBtn((form) => {
    handleNewExerciseCompletionForm(form);
    syncAvailableHotkeys();
    injectHotkeysSection();
  });
}

/**
 * Handle New Exercise Completion Form
 * @param {HTMLFormElement} exerciseCompletionForm
 */
function handleNewExerciseCompletionForm(exerciseCompletionForm) {
  if (!exerciseCompletionForm) return;
  const btns = exerciseCompletionForm.querySelectorAll("button[type=submit]");
  if (btns.length < 1) return;

  const btnClasses = ["btn--outline", "btn--exercise-completion"];
  const completeIcon = () => icons.panelIcons.exerciseComplete();
  const incompleteIcon = () => icons.panelIcons.exerciseIncomplete();
  let newIcons = [];

  const hasDeleteInput = exerciseCompletionForm.querySelector("input[value=delete]");
  hasDeleteInput ? newIcons.push(incompleteIcon) : newIcons.push(completeIcon);

  setButtonProperties(btns, newIcons, btnClasses);
}
