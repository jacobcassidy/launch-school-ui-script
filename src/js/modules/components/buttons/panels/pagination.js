/**
 * PAGINATION BUTTON
 * @module components/buttons/panels/pagination
 */

// Import components
import { icons } from "../../icons.js";

// Import utils
import { setButtonProperties } from "../../../utils/dom/buttons.js";

/**
 * Updates the pagination button styles and icons.
 */
export function updatePaginationButton() {
  const nextPageBtns = paginationNextBtns();
  const prevPageBtns = paginationPrevBtns();
  const paginationBtnClasses = ["btn", "btn--outline", "btn--pagination"];

  if (nextPageBtns.length > 0) {
    const btns = nextPageBtns;
    const newIcons = [() => icons.panelIcons.arrowRight()];
    const btnClasses = [...paginationBtnClasses, "btn--pagination-next"];
    setButtonProperties(btns, newIcons, btnClasses, true);
  }

  if (prevPageBtns.length > 0) {
    const btns = prevPageBtns;
    const newIcons = [() => icons.panelIcons.arrowLeft()];
    const btnClasses = [...paginationBtnClasses, "btn--pagination-prev"];
    setButtonProperties(btns, newIcons, btnClasses);
  }
}

function paginationNextBtns() {
  const assignmentSelector = ".footer-nav a:has(.fa-chevron-right";
  const chapterSelector = ".next-chapter a";
  return paginationBtns(assignmentSelector, chapterSelector);
}

function paginationPrevBtns() {
  const assignmentSelector = ".footer-nav a:has(.fa-chevron-left)";
  const chapterSelector = ".previous-chapter a";
  return paginationBtns(assignmentSelector, chapterSelector);
}

function paginationBtns(assignmentSelector, chapterSelector) {
  const assignmentBtns = document.querySelectorAll(assignmentSelector);
  const chapterBtns = document.querySelectorAll(chapterSelector);
  let btns = [];

  if (assignmentBtns.length > 0) assignmentBtns.forEach((btn) => btns.push(btn));
  if (chapterBtns.length > 0) chapterBtns.forEach((btn) => btns.push(btn));

  return btns;
}
