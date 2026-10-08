/**
 * WATCH HOTKEYS
 * @module utils/watch/events/hotkeys
 */

// Import utils
import { activateHotkey } from "../../helpers/activate.js";
import { showToast } from "../../helpers/show.js";
import { hotkeys } from "../../state/hotkeys.js";
import { getHotkeyModifier } from "../../helpers/hotkeys.js";

/**
 * Activates the triggered hotkey.
 */
export function watchHotkeys() {
  if (document.documentElement.dataset.hotkeysBound) {
    return;
  }
  document.documentElement.dataset.hotkeysBound = "true";

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
      const modifier = getHotkeyModifier(event);
      if (!modifier) return;

      if (modifier === "cmdOnly") {
        if (event.code !== "KeyB" || !hotkeys.cmdOnly.KeyB) return;
      } else if (modifier === "cmdShift") {
        if (event.code !== "Digit1" && event.code !== "Digit2") return;

        if (event.code === "Digit2" && !hotkeys.cmdShift.Digit2) {
          showToast("No tabs panel available to toggle on this page");
        }
      } else if (modifier === "cmdCtrl") {
        if (
          !hotkeys.cmdCtrl[event.code] &&
          event.code !== "KeyC" &&
          event.code !== "KeyE" &&
          event.code !== "KeyM" &&
          event.code !== "KeyN" &&
          event.code !== "KeyR" &&
          event.code !== "KeyT" &&
          event.code !== "Comma"
        )
          return;

        if (event.code === "KeyC" && !hotkeys.cmdCtrl.KeyC) {
          showToast("No editor code available to copy on this page");
        }
        if (event.code === "KeyE" && !hotkeys.cmdCtrl.KeyE) {
          showToast("No editor available to focus on this page");
        }
        if (event.code === "KeyM" && !hotkeys.cmdCtrl.KeyM) {
          showToast("No exercise to mark status of on this page");
        }
        if (event.code === "KeyN" && !hotkeys.cmdCtrl.KeyN) {
          showToast("No next exercise available to go to from this page");
        }
        if (event.code === "KeyR" && !hotkeys.cmdCtrl.KeyR) {
          showToast("No reviewer available to focus on this page");
        }
        if (event.code === "KeyT" && !hotkeys.cmdCtrl.KeyT) {
          showToast("No table of contents available to toggle on this page");
        }
      }

      if (hotkeys[modifier][event.code]) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      activateHotkey(modifier, event.code);
    },
    true,
  );
}
