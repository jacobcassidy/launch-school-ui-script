/**
 * WATCH SHORTCUTS
 * @module utils/watch/events/shortcuts
 */

// Import utils
import { activateShortcut } from "../../helpers/activate.js";
import { showToast } from "../../helpers/show.js";
import { shortcuts } from "../../state/shortcuts.js";
import { getShortcutModifier } from "../../helpers/shortcuts.js";

/**
 * Activates the triggered shortcut.
 */
export function watchShortcuts() {
  if (document.documentElement.dataset.shortcutsBound) {
    return;
  }
  document.documentElement.dataset.shortcutsBound = "true";

  // AltGr may report Ctrl+Alt; track the right Alt key so text entry stays intact.
  let altGraphPressed = false;
  window.addEventListener("blur", () => {
    altGraphPressed = false;
  });
  document.addEventListener(
    "keyup",
    (event) => {
      if (event.code === "AltRight") altGraphPressed = false;
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.code === "AltRight" && event.getModifierState?.("AltGraph")) altGraphPressed = true;
      if (event.repeat || event.isComposing || event.keyCode === 229 || altGraphPressed) return;
      const modifier = getShortcutModifier(event);
      if (!modifier) return;

      if (modifier === "cmdOnly") {
        if (event.code !== "KeyB" || !shortcuts.cmdOnly.KeyB) return;
      } else if (modifier === "cmdShift") {
        if (event.code !== "Digit1" && event.code !== "Digit2") return;

        if (event.code === "Digit2" && !shortcuts.cmdShift.Digit2) {
          showToast("No tabs panel available to toggle on this page");
        }
      } else if (modifier === "cmdCtrl") {
        if (
          !shortcuts.cmdCtrl[event.code] &&
          event.code !== "KeyC" &&
          event.code !== "KeyE" &&
          event.code !== "KeyM" &&
          event.code !== "KeyN" &&
          event.code !== "KeyR" &&
          event.code !== "KeyT" &&
          event.code !== "Comma"
        )
          return;

        if (event.code === "KeyC" && !shortcuts.cmdCtrl.KeyC) {
          showToast("No editor code available to copy on this page");
        }
        if (event.code === "KeyE" && !shortcuts.cmdCtrl.KeyE) {
          showToast("No editor available to focus on this page");
        }
        if (event.code === "KeyM" && !shortcuts.cmdCtrl.KeyM) {
          showToast("No exercise to mark status of on this page");
        }
        if (event.code === "KeyN" && !shortcuts.cmdCtrl.KeyN) {
          showToast("No next exercise available to go to from this page");
        }
        if (event.code === "KeyR" && !shortcuts.cmdCtrl.KeyR) {
          showToast("No reviewer available to focus on this page");
        }
        if (event.code === "KeyT" && !shortcuts.cmdCtrl.KeyT) {
          showToast("No table of contents available to toggle on this page");
        }
      }

      if (shortcuts[modifier][event.code]) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      activateShortcut(modifier, event.code);
    },
    true,
  );
}
