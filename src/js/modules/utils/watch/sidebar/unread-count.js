/**
 * WATCH SIDEBAR UNREAD COUNTS
 * @module utils/watch/sidebar/unread-count
 */

let watchedSidebar = null;
let sidebarObserver = null;

/**
 * WATCH SIDEBAR UNREAD COUNTS
 */
export function watchUnreadCounts(sidebar = document.querySelector(".nav-drawer")) {
  if (!sidebar) return;

  if (sidebar !== watchedSidebar) {
    sidebarObserver?.disconnect();
    watchedSidebar?.querySelectorAll(".unread-count").forEach((badge) => badge.remove());
    watchedSidebar = sidebar;
    sidebarObserver = new MutationObserver(() => syncUnreadCounts(sidebar));
    sidebarObserver.observe(sidebar, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  syncUnreadCounts(sidebar);
}

function syncUnreadCounts(sidebar) {
  const counts = sidebar.querySelectorAll('[class*="_unread_count"]');
  const currentCounts = new Set(counts);

  sidebar.querySelectorAll(".unread-count").forEach((badge) => {
    if (!currentCounts.has(badge.unreadCountSource)) badge.remove();
  });

  counts.forEach((count) => {
    const countText = count.textContent.replace(/[()]/g, "").trim();
    let badge = count.nextElementSibling;
    if (badge?.classList.contains("unread-count") && badge.unreadCountSource !== count) badge = null;

    if (!countText) {
      badge?.remove();
      return;
    }

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "unread-count";
      badge.unreadCountSource = count;
      count.after(badge);
    }

    if (badge.textContent !== countText) badge.textContent = countText;
    badge.classList.toggle("hide-single-count", countText === "1");
  });
}
