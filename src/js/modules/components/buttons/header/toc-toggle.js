/**
 * TABLE OF CONTENTS TOGGLE BUTTON
 * @module components/buttons/header/toc-toggle
 */

// Import components
import { icons } from "../../icons.js";

// Import utils
import { setButtonProperties } from "../../../utils/dom/buttons.js";

/**
 * MOVE TOC BUTTON TO HEADER
 * Moves the book Table of Contents toggle button to the header
 *
 * @param {HTMLElement} containerEl The container to which the TOC button will be appended.
 * @param {HTMLElement} bookTocBtn The current native TOC button, defaulting to the first match in the document.
 */
export function moveTocBtnToHeader(containerEl, bookTocBtn = document.querySelector(".toc-toggle-button")) {
  if (!bookTocBtn) return;

  bookTocBtn.classList.add("site-header__button", "btn--toggle-toc", "has-dropdown");
  bookTocBtn.title = "Toggle Table of Contents Visibility";

  updateTocButton(bookTocBtn);

  containerEl.appendChild(bookTocBtn);
}

/**
 * Updates the toc button styles and icon.
 */
function updateTocButton(tocBtn) {
  if (!tocBtn) return;

  const btns = [tocBtn];
  const newIcons = [() => icons.headerIcons.toc()];

  setButtonProperties(btns, newIcons);
}
