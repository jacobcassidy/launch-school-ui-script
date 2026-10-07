/**
 * SIDEBAR HEADER RENDERING
 * @module components/sidebar/header
 */

import { icons } from "../icons.js";

/**
 * INJECT SIDEBAR HEADER
 */
export function injectSidebarHeader() {
  const sidebar = document.querySelector(".nav-drawer");
  const createSidebarHeader = () => {
    const sidebarHeaderEl = document.createElement("header");
    sidebarHeaderEl.className = "sidebar-header";
    const sidebarHeaderLogoEl = document.createElement("a");
    sidebarHeaderLogoEl.setAttribute("href", "/course_catalog");
    sidebarHeaderLogoEl.className = "sidebar-header__logo";
    const sidebarLogoTextEl = document.createElement("span");
    sidebarLogoTextEl.className = "logo-title hidden-on-collapse";
    sidebarLogoTextEl.textContent = "LaunchSchool";
    const modifiedLogoIconEl = icons.sidebarIcons.modifiedLogo();
    modifiedLogoIconEl.classList.add("logo-icon");
    sidebarHeaderLogoEl.appendChild(modifiedLogoIconEl);
    sidebarHeaderLogoEl.appendChild(sidebarLogoTextEl);
    sidebarHeaderEl.appendChild(sidebarHeaderLogoEl);
    return sidebarHeaderEl;
  };

  if (sidebar) sidebar.prepend(createSidebarHeader());
}
