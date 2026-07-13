import { colorLog } from "./helpers/utility";
import { setIsHeaderTop } from "./helpers/state";
import { updateHeaderVisibility } from "./header.js";

/**
 * WATCH PAGE SCROLL ELEMENT
 */
export function watchScrollEl() {
  console.log("Running watchScrollEl");

  let scrollEl;

  const assignmentWrapper = document.querySelector(".assignment-content-wrapper");
  const bookWrapper = document.querySelector(".book-content-wrapper");

  if (bookWrapper || assignmentWrapper) {
    scrollEl = bookWrapper || assignmentWrapper;
  } else {
    const defaultWrapper = document.querySelector(".wrapper");
    if (defaultWrapper) scrollEl = defaultWrapper;
  }

  colorLog.notice("scrollEl:", scrollEl);

  if (!scrollEl) {
    colorLog.alert("There is no scrollEl to check.");
    return;
  }

  if (scrollEl.scrollTop <= 2) {
    setIsHeaderTop(true);
  }

  scrollEl.addEventListener("scroll", updateHeaderVisibility);
}
