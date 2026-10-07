/**
 * WORK IN EDITOR BUTTON
 * @module components/buttons/panels/work-in-editor
 */

// Import components
import { icons } from "../../icons.js";

// Import utils
import { setButtonProperties } from "../../../utils/state/setters/dom.js";

/**
 * Updates the work-in-editor button styles and icon.
 */
export function updateWorkInEditorButton() {
  const btns = document.querySelectorAll(".btn-work-in-editor");
  if (btns.length < 1) return;

  const newIcons = [() => icons.panelIcons.code()];
  const btnClasses = ["btn", "btn--outline", "btn--work-in-editor"];

  setButtonProperties(btns, newIcons, btnClasses);
}
