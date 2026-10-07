/**
 * SIDEBAR TOGGLE BUTTON
 * @module components/buttons/header/sidebar-toggle
 */

// Import components
import { icons } from "../../icons.js";

/**
 * INJECT SIDEBAR TOGGLE BUTTON
 * Injects a button.btn--toggle-sidebar element in the .site-header__container to toggle the Sidebar visibility when clicked.
 *
 * @param {HTMLDivElement} containerEl The container to which the button will be appended.
 */
export function injectSidebarToggleButton(containerEl) {
  const hasNativeSidebar = !!document.querySelector(".nav-drawer");
  if (!hasNativeSidebar) return;

  containerEl.appendChild(createSidebarToggleButton());
}

function createSidebarToggleButton() {
  const sidebarToggleButtonEl = document.createElement("button");
  sidebarToggleButtonEl.classList.add("site-header__button", "btn--toggle-sidebar");
  sidebarToggleButtonEl.title = "Toggle Sidebar Visibility";

  const sidebarOpenIconEl = icons.headerIcons.sidebarOpen();
  sidebarOpenIconEl.classList.add("icon--sidebar-open");

  const sidebarCloseIconEl = icons.headerIcons.sidebarClose();
  sidebarCloseIconEl.classList.add("icon--sidebar-close");

  sidebarToggleButtonEl.appendChild(sidebarOpenIconEl);
  sidebarToggleButtonEl.appendChild(sidebarCloseIconEl);

  return sidebarToggleButtonEl;
}
