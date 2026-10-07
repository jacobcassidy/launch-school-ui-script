/**
 * WATCH SIDEBAR UNREAD COUNTS
 * @module utils/watch/sidebar/unread-count
 */

const observedUnreadCounts = new WeakSet();

/**
 * WATCH SIDEBAR UNREAD COUNTS
 */
export function watchUnreadCounts() {
  const counts = document.querySelectorAll('.nav-drawer [class*="_unread_count"]');
  if (counts.length < 1) return;

  counts.forEach((count) => {
    if (observedUnreadCounts.has(count)) return;
    observedUnreadCounts.add(count);

    let badge = null;
    const syncCount = () => {
      const countText = count.textContent.replace(/[()]/g, "").trim();
      if (!countText) {
        badge?.remove();
        badge = null;
        return;
      }

      if (!badge) {
        badge = document.createElement("span");
        badge.className = "unread-count";
        count.after(badge);
      }
      badge.textContent = countText;
      badge.classList.toggle("hide-single-count", countText === "1");
    };

    const observer = new MutationObserver(syncCount);
    observer.observe(count, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    syncCount();
  });
}
