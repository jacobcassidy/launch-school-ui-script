/**
 * WATCH NEXT EXERCISE BUTTON
 * @module utils/watch/buttons/next-exercise
 */

// Import components
import { injectHotkeysSection, updateNextExerciseButton } from "../../../components";
import { syncAvailableHotkeys } from "../../sync/available-hotkeys";

// Import utils
import { elements } from "../../state";

const observedInstructionsTabs = new WeakSet();

/**
 * Updates the "Go to next exercise" button when the dom element changes.
 */
export function watchNextExerciseBtn() {
  const instructionsTab = document.querySelector("#tab-instructions");
  if (!instructionsTab) return;
  if (observedInstructionsTabs.has(instructionsTab)) return;

  const observer = new MutationObserver(() => {
    const previousButton = elements.native.nextExerciseButton;
    updateNextExerciseButton();
    const nextButton = elements.native.nextExerciseButton;
    if (previousButton === nextButton) return;

    syncAvailableHotkeys();
    injectHotkeysSection();
  });

  observer.observe(instructionsTab, {
    childList: true,
    subtree: true,
  });
  observedInstructionsTabs.add(instructionsTab);
}
