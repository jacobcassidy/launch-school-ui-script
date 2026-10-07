/**
 * WATCH SIDEBAR TOGGLE BUTTON
 * @module utils/watch/buttons/sidebar-toggle
 */

// Import utils
import { elements } from "../../state";
import { toggleSidebar } from "../../helpers";

/**
 * Toggles the sidebar when the sidebar toggle button is clicked.
 */
export function watchSidebarToggleBtn() {
  const sidebarToggleBtn = elements.injected.sidebarToggleButton;
  if (!sidebarToggleBtn) {
    return;
  }

  if (sidebarToggleBtn.dataset.sidebarToggleBtnEventBound) {
    return;
  }
  sidebarToggleBtn.dataset.sidebarToggleBtnEventBound = "true";

  sidebarToggleBtn.addEventListener("click", () => toggleSidebar());
}
