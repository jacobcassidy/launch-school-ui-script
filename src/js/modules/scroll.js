/**
 * WATCH PAGE SCROLL ELEMENT
 */
function watchScrollEl() {
  console.log("Running watchScrollEl");

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
    siteHeader.classList.add("is-top");
    isHeaderTop = true;
  }

  scrollEl.addEventListener("scroll", updateHeaderVisibility);
}
