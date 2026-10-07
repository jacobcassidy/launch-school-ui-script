/**
 * COPY MARKUP BUTTON
 * @module components/buttons/panels/copy-markup
 */

// Import components
import { icons } from "../../icons.js";

// Import utils
import { setButtonProperties } from "../../../utils/dom/buttons.js";

/**
 * Updates the copy markup button styles and icon.
 */
export function updateCopyMarkupButton(btns = document.querySelectorAll(".markup-copy-block button")) {
  if (btns.length < 1) return;

  const newIcons = [() => icons.panelIcons.copy(), () => icons.panelIcons.checkmark()];
  const btnClasses = ["btn--plain", "btn--copy-markup"];

  setButtonProperties(btns, newIcons, btnClasses);
}
