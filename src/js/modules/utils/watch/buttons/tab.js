/**
 * WATCH TAB BUTTONS
 * @module utils/watch/buttons/tab
 */

// Import utils
import { handleFocus } from "../../helpers";

/**
 * Run handleFocus() on each tab button click.
 */
export function watchTabBtns() {
  const tabButtons = document.querySelectorAll(".tab-button");
  if (tabButtons.length < 1) {
    return;
  }

  const handleTooltip = (tabBtn) => {
    const btnDataTabStr = tabBtn.getAttribute("data-tab");
    const tabTooltip = document.querySelector(`.tab-tooltip-${btnDataTabStr}`);

    const handleTooltipRemoval = () => {
      tabTooltip.classList.remove("active");
    };

    const tabBtnWidth = tabBtn.offsetWidth;
    const tabTooltipWidth = tabTooltip.offsetWidth;
    const tabRect = tabBtn.getBoundingClientRect();

    tabTooltip.classList.add("active");
    tabTooltip.style.left = `${tabRect.left + tabBtnWidth / 2 - tabTooltipWidth / 2}px`;
    tabTooltip.style.top = `${tabRect.bottom + 6}px`;

    tabBtn.addEventListener("mouseleave", handleTooltipRemoval, { once: true });
  };

  tabButtons.forEach((tabBtn) => {
    if (tabBtn.dataset.tabBtnEventBound) {
      return;
    }
    tabBtn.dataset.tabBtnEventBound = "true";

    tabBtn.addEventListener("click", () => {
      handleFocus(tabBtn);
    });

    tabBtn.addEventListener("mouseenter", () => {
      handleTooltip(tabBtn);
    });
  });
}
