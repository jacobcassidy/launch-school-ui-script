/**
 * WATCH TABS PANEL TOGGLE BUTTON
 * @module utils/watch/buttons/tabs-panel-toggle
 */

// Import utils
import { elements } from "../../state/dom.js";
import { toggleTabsPanel } from "../../helpers/toggle.js";

/**
 * Toggles the Tabs Panel visibility on button click.
 */
export function watchTabsPanelToggleBtn() {
  const tabsPanelToggleBtn = elements.injected.tabsPanelToggleButton;
  if (!tabsPanelToggleBtn) {
    return;
  }

  if (tabsPanelToggleBtn.dataset.tabsPanelToggleBtnEventBound) {
    return;
  }
  tabsPanelToggleBtn.dataset.tabsPanelToggleBtnEventBound = "true";

  tabsPanelToggleBtn.addEventListener("click", () => toggleTabsPanel());
}
