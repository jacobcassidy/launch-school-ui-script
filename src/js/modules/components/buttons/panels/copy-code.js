/**
 * COPY CODE BUTTON
 * @module components/buttons/panels/copy-code
 */

// Import components
import { icons } from "../../icons.js";

// Import utils
import { setButtonProperties } from "../../../utils/state/setters/dom.js";

/**
 * Updates the copy code button styles and icon.
 */
export function updateCopyCodeButton() {
  const btns = document.querySelectorAll(".btn-copy-code");
  if (btns.length < 1) return;

  const newIcons = [() => icons.panelIcons.copy()];
  const btnClasses = ["btn--plain"];

  setButtonProperties(btns, newIcons, btnClasses);
}
