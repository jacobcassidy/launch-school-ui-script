/**
 * WATCH TABS PANEL TOGGLE BUTTON
 * @module utils/watch/buttons/tabs-panel-toggle
 */

// Import utils
import { elements } from "../../state/dom.js";
import { toggleTabsPanel } from "../../helpers/toggle.js";

const watchedTabsPanelToggleButtons = new WeakSet();

/**
 * Toggles the Tabs Panel visibility on button click.
 */
export function watchTabsPanelToggleBtn() {
  const tabsPanelToggleBtn = elements.injected.tabsPanelToggleButton;
  if (!tabsPanelToggleBtn) {
    return;
  }

  if (watchedTabsPanelToggleButtons.has(tabsPanelToggleBtn)) return;
  watchedTabsPanelToggleButtons.add(tabsPanelToggleBtn);

  tabsPanelToggleBtn.addEventListener("click", () => toggleTabsPanel());
}
