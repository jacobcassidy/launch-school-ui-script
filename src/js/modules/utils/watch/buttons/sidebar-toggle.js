/**
 * WATCH SIDEBAR TOGGLE BUTTON
 * @module utils/watch/buttons/sidebar-toggle
 */

// Import utils
import { elements } from "../../state/dom.js";
import { toggleSidebar } from "../../helpers/toggle.js";

const watchedSidebarToggleButtons = new WeakSet();

/**
 * Toggles the sidebar when the sidebar toggle button is clicked.
 */
export function watchSidebarToggleBtn() {
  const sidebarToggleBtn = elements.injected.sidebarToggleButton;
  if (!sidebarToggleBtn) {
    return;
  }

  if (watchedSidebarToggleButtons.has(sidebarToggleBtn)) return;
  watchedSidebarToggleButtons.add(sidebarToggleBtn);

  sidebarToggleBtn.addEventListener("click", () => toggleSidebar());
}
