/**
 * DETECTION HELPER
 */
import { colorLog } from "./log.js";
import { getLastUrl, getIsReloadScheduled, getObserverTimeoutId, setObserverTimeoutId } from "./state.js";
import { scheduleReload } from "../load.js";
import { showSidebar } from "./show.js";

export function watchForPageChange() {
  console.log("Running watchForPageChange()");

  /**
   * Observe document for URL changes
   */
  const observer = new MutationObserver(() => {
    colorLog.detail("Running observer()");

    const currentTimeoutId = getObserverTimeoutId();
    clearTimeout(currentTimeoutId);
    const newTimeoutId = setTimeout(() => {
      scheduleReloadOnPageChange("observer");
    }, 100);

    setObserverTimeoutId(newTimeoutId);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Triggered with browsers back/forward navigation
  window.addEventListener("popstate", () => {
    colorLog.notice("popstate: Browser back/forward nav");
    scheduleReloadOnPageChange("popstate");
  });

  // Triggered with url hashchange such as /page to /page#section2
  window.addEventListener("hashchange", () => {
    colorLog.notice("hashchange in URL");
    scheduleReloadOnPageChange("hashchange");
  });

  // REMOVE IF NOT USED
  document.addEventListener("turbo:load", () => {
    colorLog.alert("EVENT UPDATE! turbo:load");
    scheduleReloadOnPageChange("turbo:load");
  });

  // REMOVE IF NOT USED
  document.addEventListener("turbo:render", () => {
    colorLog.alert("EVENT UPDATE! turbo:render");
    scheduleReloadOnPageChange("turbo:render");
  });

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    colorLog.notice("history.pushState");
    originalPushState.apply(this, args);
    scheduleReloadOnPageChange("pushState");
  };

  history.replaceState = function (...args) {
    colorLog.notice("history.replaceState");
    originalReplaceState.apply(this, args);
    scheduleReloadOnPageChange("replaceState");
  };
}

/**
 * Check for URL Change
 * @param {string} from Where this function was called from.
 */
function scheduleReloadOnPageChange(from) {
  colorLog.detail(`Running scheduleReloadOnPageChange() from ${from}`);

  const isReloadScheduled = getIsReloadScheduled();
  if (isReloadScheduled) return;

  const currentUrl = `${location.origin}${location.pathname}`;
  if (currentUrl === getLastUrl()) return;

  scheduleReload();
}

/**
 * WATCH SHOW SIDEBAR BUTTON
 * Shows the sidebar when the button is clicked
 */
export function watchShowSidebarBtn() {
  const showSidebarBtn = document.querySelector(".btn--show-sidebar");
  showSidebarBtn?.addEventListener("click", () => showSidebar());
}

// import { colorLog } from "./helpers/utility";
import { setIsHeaderTop } from "./helpers/state";
// import { updateHeaderVisibility } from "./header.js";

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

  // scrollEl.addEventListener("scroll", updateHeaderVisibility);
}
