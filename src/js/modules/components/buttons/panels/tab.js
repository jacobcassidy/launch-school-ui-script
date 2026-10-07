/**
 * TAB BUTTON
 * @module components/buttons/panels/tab
 */

// Import components
import { icons } from "../../icons.js";

/**
 * Replaces tab buttons native text and icons with new icons and tooltips.
 */
export function updateTabButtons() {
  const tabBtns = document.querySelectorAll(".tab-button");

  tabBtns.forEach((btn) => {
    const isHidden = getComputedStyle(btn).display === "none";
    if (isHidden) {
      btn.classList.add("is-hidden");
      return;
    }

    // Remove the title and use an aria-label and tooltip instead.
    btn.removeAttribute("title");

    const btnDataTab = btn.getAttribute("data-tab");
    let tabIconEl;
    let tooltipFallback;

    switch (btnDataTab) {
      case "instructions":
        tabIconEl = icons.tabIcons.instructions();
        tooltipFallback = "Instructions";
        break;
      case "lsbot-help":
      case "lsbot-hints":
        tabIconEl = icons.tabIcons.lsbot();
        tooltipFallback = "LSBot";
        break;
      case "submit-review":
        tabIconEl = icons.tabIcons.review();
        tooltipFallback = "Submit Review";
        break;
      case "code-editor":
        tabIconEl = icons.tabIcons.scratchpad();
        tooltipFallback = "Scratchpad";
        break;
      case "community":
        tabIconEl = icons.tabIcons.community();
        tooltipFallback = "Community Solutions";
        break;
      case "feedback":
        tabIconEl = icons.tabIcons.feedback();
        tooltipFallback = "Give Feedback";
        break;
      default:
        break;
    }

    const tabTooltipText =
      btn.innerText.trim() || btn.getAttribute("aria-label") || tooltipFallback || btnDataTab || "Tab";
    btn.setAttribute("aria-label", tabTooltipText);
    if (tabIconEl) btn.replaceChildren(tabIconEl);

    createTabTooltip(tabTooltipText, btnDataTab);
  });
}

function createTabTooltip(tooltipText, btnDataTab) {
  const tooltipEl = document.querySelector(`.tab-tooltip-${btnDataTab}`) || document.createElement("div");
  tooltipEl.classList.add("tooltip", "tab-tooltip", `tab-tooltip-${btnDataTab}`);
  tooltipEl.textContent = tooltipText;
  document.body.appendChild(tooltipEl);
}
