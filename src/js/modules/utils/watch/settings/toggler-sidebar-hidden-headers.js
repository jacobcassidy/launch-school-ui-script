/**
 * WATCH SETTING SIDEBAR HIDDEN HEADERS TOGGLER
 * @module utils/watch/settings/toggler-sidebar-hidden-header
 */

// Import utils
import { setSettingSidebarHiddenHeaders } from "../../state";

/**
 * Toggles the Sidebar's Hidden Section Headers setting.
 */
export function watchSettingSidebarHiddenHeadersToggler() {
  const settingSidebarHiddenHeadersToggler = document.querySelector("#setting--sidebar-hidden-headers");
  if (!settingSidebarHiddenHeadersToggler) {
    return;
  }

  if (settingSidebarHiddenHeadersToggler.dataset.sidebarHiddenHeadersTogglerEventBound) {
    return;
  }
  settingSidebarHiddenHeadersToggler.dataset.sidebarHiddenHeadersTogglerEventBound = "true";

  settingSidebarHiddenHeadersToggler.addEventListener("change", () => {
    if (settingSidebarHiddenHeadersToggler.checked) {
      setSettingSidebarHiddenHeaders(true);
    } else {
      setSettingSidebarHiddenHeaders(false);
    }
  });
}
