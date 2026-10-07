/**
 * RELOAD
 * @module utils/helpers/reload
 */

import { ui } from "../state/ui.js";
import { setIsReloadScheduled, setLastUrl } from "../state/setters/ui.js";

let loadUI = () => {};

/**
 * Sets the UI loader used after native page navigation.
 * @param {Function} handler
 */
export function setLoadUIHandler(handler) {
  loadUI = handler;
}

/**
 * Schedules a UI reload after the current page render completes.
 */
export function scheduleReload() {
  if (ui.load.isReloadScheduled) return;
  setIsReloadScheduled(true);

  requestAnimationFrame(() => {
    try {
      loadUI();
      setLastUrl(`${location.origin}${location.pathname}`);
    } finally {
      setIsReloadScheduled(false);
    }
  });
}
