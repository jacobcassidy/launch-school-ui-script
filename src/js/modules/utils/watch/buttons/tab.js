/**
 * WATCH TAB BUTTONS
 * @module utils/watch/buttons/tab
 */

// Import utils
import { handleFocus } from "../../helpers/focus.js";
import { updateTabButtons } from "../../../components/buttons/panels/tab.js";

const watchedTabButtons = new WeakSet();
const watchedTabNavigations = new WeakSet();

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
    if (watchedTabButtons.has(tabBtn)) return;
    watchedTabButtons.add(tabBtn);

    tabBtn.addEventListener("click", () => {
      handleFocus(tabBtn);
    });

    tabBtn.addEventListener("mouseenter", () => {
      handleTooltip(tabBtn);
    });
  });

  const tabNav = tabButtons[0].closest(".tab-nav");
  if (!tabNav || watchedTabNavigations.has(tabNav)) return;
  watchedTabNavigations.add(tabNav);

  const observer = new MutationObserver(() => {
    const hasVisibleUnstyledTab = [...tabNav.querySelectorAll(".tab-button")].some(
      (tabBtn) => tabBtn.classList.contains("is-hidden") && getComputedStyle(tabBtn).display !== "none",
    );
    if (hasVisibleUnstyledTab) updateTabButtons();
  });

  observer.observe(tabNav, { attributes: true, subtree: true, attributeFilter: ["class", "style"] });
}
