/**
 * WATCH FOR URL CHANGE
 * @module utils/watch/events/url-change
 */

// Import utils
import { scheduleReload } from "../../helpers/reload.js";
import { ui } from "../../state/ui.js";

/**
 * Reloads the custom UI when the URL changes.
 */
export function watchForUrlChange() {
  if (document.documentElement.dataset.watchPageBound) {
    return;
  }
  document.documentElement.dataset.watchPageBound = "true";

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  /**
   * CHECK FOR URL CHANGE
   * Schedules a UI reload if the page URL has changed.
   */
  const checkForUrlChange = () => {
    if (ui.load.isReloadScheduled) {
      return;
    }

    const currentUrl = `${location.origin}${location.pathname}${location.search}`;
    const isChangedUrl = currentUrl !== ui.load.lastUrl;

    if (!isChangedUrl) {
      return;
    }

    scheduleReload();
  };

  window.addEventListener("popstate", checkForUrlChange);
  window.addEventListener("hashchange", checkForUrlChange);
  // A render can complete after the history change, including at the same URL.
  for (const eventType of ["turbo:load", "turbo:render", "turbolinks:load", "turbolinks:render"]) {
    document.addEventListener(eventType, scheduleReload);
  }

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    checkForUrlChange();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    checkForUrlChange();
  };
}
