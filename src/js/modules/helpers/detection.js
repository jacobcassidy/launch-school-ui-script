/**
 * DETECTION HELPER
 */
import { colorLog } from "./utility.js";
import { getLastUrl, getIsReloadScheduled, getObserverTimeoutId, setObserverTimeoutId } from "./state.js";
import { scheduleReload } from "../load.js";

export function detectNavChange() {
  console.log("Running detectNavChange()");

  /**
   * Observe document for URL changes
   */
  const observer = new MutationObserver(() => {
    colorLog.detail("Running observer()");

    const currentTimeoutId = getObserverTimeoutId();
    clearTimeout(currentTimeoutId);
    const newTimeoutId = setTimeout(() => {
      scheduleReloadOnUrlChange("observer");
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
    scheduleReloadOnUrlChange("popstate");
  });

  // Triggered with url hashchange such as /page to /page#section2
  window.addEventListener("hashchange", () => {
    colorLog.notice("hashchange in URL");
    scheduleReloadOnUrlChange("hashchange");
  });

  // REMOVE IF NOT USED
  document.addEventListener("turbo:load", () => {
    colorLog.alert("EVENT UPDATE! turbo:load");
    scheduleReloadOnUrlChange("turbo:load");
  });

  // REMOVE IF NOT USED
  document.addEventListener("turbo:render", () => {
    colorLog.alert("EVENT UPDATE! turbo:render");
    scheduleReloadOnUrlChange("turbo:render");
  });

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    colorLog.notice("history.pushState");
    originalPushState.apply(this, args);
    scheduleReloadOnUrlChange("pushState");
  };

  history.replaceState = function (...args) {
    colorLog.notice("history.replaceState");
    originalReplaceState.apply(this, args);
    scheduleReloadOnUrlChange("replaceState");
  };
}

/**
 * Check for URL Change
 * @param {string} from Where this function was called from.
 */
function scheduleReloadOnUrlChange(from) {
  colorLog.detail(`Running scheduleReloadOnUrlChange() from ${from}`);

  const isReloadScheduled = getIsReloadScheduled();
  if (isReloadScheduled()) return;

  const currentUrl = `${location.origin}${location.pathname}`;
  if (currentUrl === getLastUrl()) return;

  scheduleReload();
}
