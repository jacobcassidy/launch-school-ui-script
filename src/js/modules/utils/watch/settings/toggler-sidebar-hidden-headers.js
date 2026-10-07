/**
 * WATCH SETTING SIDEBAR HIDDEN HEADERS TOGGLER
 * @module utils/watch/settings/toggler-sidebar-hidden-header
 */

// Import utils
import { setSettingSidebarHiddenHeaders } from "../../state/setters/ui.js";

const watchedHiddenHeadersTogglers = new WeakSet();

/**
 * Toggles the Sidebar's Hidden Section Headers setting.
 */
export function watchSettingSidebarHiddenHeadersToggler() {
  const settingSidebarHiddenHeadersToggler = document.querySelector("#setting--sidebar-hidden-headers");
  if (!settingSidebarHiddenHeadersToggler) {
    return;
  }

  if (watchedHiddenHeadersTogglers.has(settingSidebarHiddenHeadersToggler)) return;
  watchedHiddenHeadersTogglers.add(settingSidebarHiddenHeadersToggler);

  settingSidebarHiddenHeadersToggler.addEventListener("change", () => {
    if (settingSidebarHiddenHeadersToggler.checked) {
      setSettingSidebarHiddenHeaders(true);
    } else {
      setSettingSidebarHiddenHeaders(false);
    }
  });
}
