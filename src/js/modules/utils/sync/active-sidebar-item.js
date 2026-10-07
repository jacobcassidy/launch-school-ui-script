/**
 * SYNC ACTIVE SIDEBAR ITEM
 * @module utils/sync/active-sidebar-item
 */

/**
 * Applies the .current-page class to the active sidebar item.
 */
export function syncActiveSidebarItem() {
  const currentUrl = window.location.pathname;

  document.querySelectorAll(".sidebar-list__item a").forEach((link) => {
    const linkClasses = link.classList;
    const linkUrl = new URL(link.href).pathname;

    if ((currentUrl.startsWith("/course_catalog/") && linkClasses.contains("courses")) || linkUrl === currentUrl) {
      link.classList.add("current-page");
    } else {
      link.classList.remove("current-page");
    }
  });
}
