/**
 * WATCH SETTING SIDEBAR SHRINK TOGGLER
 * @module utils/watch/settings/toggler-sidebar-shrink
 */

// Import utils
import { setSettingSidebarShrink } from "../../state";

/**
 * Toggles the Sidebar's collapsed sizing (hidden or shrunken).
 */
export function watchSettingSidebarShrinkToggler() {
  const settingSidebarShrinkToggler = document.querySelector("#setting--sidebar-shrink");
  if (!settingSidebarShrinkToggler) {
    return;
  }

  if (settingSidebarShrinkToggler.dataset.sidebarShrinkTogglerEventBound) {
    return;
  }
  settingSidebarShrinkToggler.dataset.sidebarShrinkTogglerEventBound = "true";

  settingSidebarShrinkToggler.addEventListener("change", () => {
    if (settingSidebarShrinkToggler.checked) {
      setSettingSidebarShrink(true);
    } else {
      setSettingSidebarShrink(false);
    }
  });
}
