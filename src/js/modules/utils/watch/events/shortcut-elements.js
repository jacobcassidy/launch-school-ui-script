/**
 * WATCH DYNAMIC SHORTCUT ELEMENTS
 * @module utils/watch/events/shortcut-elements
 */

import { injectShortcutsSection } from "../../../components/shortcuts-menu.js";
import { syncAvailableShortcuts } from "../../sync/available-shortcuts.js";

const shortcutElementSelector = [
  ".tab-button",
  ".lsbot-question-input",
  ".lsbot-question-box-answer-input",
  ".lsbot-submit-btn",
  ".lsbot-question-box-send-answer-button",
  ".btn-copy-code",
  ".instructions-panel .gray-links form button[type=submit]",
  ".next-exercise",
  "#lsbot-send-review",
  "#btn-book-lsbot-review",
  ".toc-toggle-button",
].join(",");

/**
 * Refreshes shortcut registration when native controls are added, removed, or replaced.
 */
export function watchShortcutElements() {
  if (document.documentElement.dataset.shortcutElementsBound) return;
  document.documentElement.dataset.shortcutElementsBound = "true";

  let refreshScheduled = false;
  const observer = new MutationObserver((mutations) => {
    const hasRelevantChange = mutations.some((mutation) =>
      [...mutation.addedNodes, ...mutation.removedNodes].some(
        (node) =>
          node instanceof Element &&
          (node.matches(shortcutElementSelector) || node.querySelector(shortcutElementSelector)),
      ),
    );
    if (!hasRelevantChange || refreshScheduled) return;

    refreshScheduled = true;
    queueMicrotask(() => {
      refreshScheduled = false;
      syncAvailableShortcuts();
      injectShortcutsSection();
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
