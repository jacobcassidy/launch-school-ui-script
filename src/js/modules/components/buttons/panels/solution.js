/**
 * SOLUTION BUTTON
 * @module components/buttons/panels/solution
 */

// Import components
import { icons } from "../../icons.js";

// Import utils
import { setButtonProperties } from "../../../utils/state/setters/dom.js";
import { watchViewSolutionBtn } from "../../../utils/watch/buttons/solution.js";

/**
 * Updates the view solution button styles and icons.
 */
export function updateSolutionButton() {
  const btns = document.querySelectorAll("button[data-target='#solution-analysis-collapse']");
  if (btns.length < 1) return;

  const newIcons = [() => icons.panelIcons.viewOpen(), () => icons.panelIcons.viewClose()];
  const btnClasses = ["btn--toggle-solution"];

  setButtonProperties(btns, newIcons, btnClasses);

  btns.forEach((btn) => {
    watchViewSolutionBtn(btn, newIcons);
  });
}

export function injectContentSolutionButtons() {
  const solutionBtnSpans = document.querySelectorAll(".solution-header span");
  if (!solutionBtnSpans.length > 0) return;

  solutionBtnSpans.forEach((span) => {
    if (!span) return;

    const solutionBtnEl = document.createElement("button");

    const btns = [solutionBtnEl];
    const newIcons = [() => icons.panelIcons.viewOpen(), () => icons.panelIcons.viewClose()];
    const btnClasses = ["btn--outline", "btn--content-toggle-solution"];

    solutionBtnEl.textContent = span.textContent;
    setButtonProperties(btns, newIcons, btnClasses);
    span.parentNode.prepend(solutionBtnEl);
    span.remove();
  });
}
