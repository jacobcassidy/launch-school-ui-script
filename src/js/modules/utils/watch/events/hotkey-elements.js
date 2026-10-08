/**
 * WATCH DYNAMIC HOTKEY ELEMENTS
 * @module utils/watch/events/hotkey-elements
 */

import { injectHotkeysSection } from "../../../components/hotkeys-menu.js";
import { syncAvailableHotkeys } from "../../sync/available-hotkeys.js";

const hotkeyElementSelector = [
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
export function watchHotkeyElements() {
  if (document.documentElement.dataset.hotkeyElementsBound) return;
  document.documentElement.dataset.hotkeyElementsBound = "true";

  let refreshScheduled = false;
  const observer = new MutationObserver((mutations) => {
    const hasRelevantChange = mutations.some((mutation) =>
      [...mutation.addedNodes, ...mutation.removedNodes].some(
        (node) =>
          node instanceof Element && (node.matches(hotkeyElementSelector) || node.querySelector(hotkeyElementSelector)),
      ),
    );
    if (!hasRelevantChange || refreshScheduled) return;

    refreshScheduled = true;
    queueMicrotask(() => {
      refreshScheduled = false;
      syncAvailableHotkeys();
      injectHotkeysSection();
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
