/**
 * NEXT EXERCISE BUTTON
 * @module components/buttons/panels/next-exercise
 */

// Import component
import { icons } from "../../icons.js";

// Import utils
import { setElementNextExerciseButton } from "../../../utils/state/setters/dom.js";
import { setButtonProperties } from "../../../utils/dom/buttons.js";

/**
 * Updates the "Go to next exercise" button styles and icon.
 */
export function updateNextExerciseButton() {
  setElementNextExerciseButton(null);
  const instructionsPanel = document.querySelector(".instructions-panel");
  if (!instructionsPanel) return;

  const nextExerciseButton = [...document.querySelectorAll("a")].find((a) =>
    a.textContent.includes("Go to the next exercise"),
  );

  if (!nextExerciseButton) return;
  const btns = [nextExerciseButton];

  setElementNextExerciseButton(nextExerciseButton);

  const newIcons = [() => icons.panelIcons.arrowNext()];
  const btnClasses = ["btn", "btn--outline", "btn--next-exercise"];

  setButtonProperties(btns, newIcons, btnClasses);
}
