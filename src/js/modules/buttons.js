/**
 * BUTTONS
 * @module buttons
 */

import checkIcon from "../../svg/lucide/check.svg";
import showViewIcon from "../../svg/lucide/eye.svg";
import hideViewIcon from "../../svg/lucide/eye-off.svg";
import nextExerciseIcon from "../../svg/lucide/arrow-big-right.svg";
import markCompleteIcon from "../../svg/lucide/square-check-big.svg";
import markIncompleteIcon from "../../svg/lucide/rotate-ccw.svg";
import menuIcon from "../../svg/lucide/menu.svg";
import commandIcon from "../../svg/lucide/command.svg";
import communityIcon from "../../svg/lucide/users-round.svg";
import copyIcon from "../../svg/lucide/copy.svg";
import feedbackIcon from "../../svg/lucide/send.svg";
import instructionsIcon from "../../svg/lucide/scroll.svg";
import lsbotIcon from "../../svg/lucide/bot-message-square.svg";
import newConversationIcon from "../../svg/lucide/circle-plus.svg";
import panelsIcon from "../../svg/lucide/tabs-panel.svg";
import scratchpadIcon from "../../svg/lucide/code-xml.svg";
import showConversationHistoryIcon from "../../svg/lucide/gallery-vertical-end.svg";
import submitReviewIcon from "../../svg/lucide/check-check.svg";
import tocIcon from "../../svg/lucide/book-text.svg";
import { elements } from "./helpers/state";
import { watchMarkToggleBtn, watchViewSolutionBtn } from "./helpers/watch";
/**
 * INJECT SETTINGS MENU TOGGLE BUTTON
 * Injects a .btn-toggle-settings-menu button in the .site-header to toggle the Settings Menu when clicked.
 *
 * @param {HTMLElement} containerEl The container to which the button will be appended.
 */
export function injectSettingsMenuToggleButton(containerEl) {
  const createSettingsMenuToggleButton = () => {
    const settingsMenuToggleButtonEl = document.createElement("button");
    settingsMenuToggleButtonEl.classList.add("site-header__button", "btn--toggle-settings", "has-dropdown");
    settingsMenuToggleButtonEl.title = "Toggle Hotkeys Menu";
    settingsMenuToggleButtonEl.innerHTML = commandIcon;
    return settingsMenuToggleButtonEl;
  };

  containerEl.append(createSettingsMenuToggleButton());
}

/**
 * INJECT SIDEBAR SHOW BUTTON
 * Injects a .btn--show-sidebar button in the .site-header__container to open the sidebar when clicked.
 *
 * @param {HTMLDivElement} containerEl The container to which the button will be appended.
 */
export function injectSidebarShowButton(containerEl) {
  const createSidebarShowButton = () => {
    const sidebarShowButtonEl = document.createElement("button");
    sidebarShowButtonEl.classList.add("site-header__button", "btn--show-sidebar");
    sidebarShowButtonEl.title = "Open Menu";

    const menuSvg = new DOMParser().parseFromString(menuIcon.trim(), "image/svg+xml").documentElement;
    sidebarShowButtonEl.appendChild(menuSvg);

    return sidebarShowButtonEl;
  };

  containerEl.appendChild(createSidebarShowButton());
}

/**
 * INJECT TABS PANEL TOGGLE BUTTON
 * Injects a .btn--toggle-tabs-panel button in the .site-header to toggle the Tabs Panel when clicked.
 *
 * @param {HTMLDivElement} containerEl The container to which the button will be appended.
 */
export function injectTabsPanelToggleButton(containerEl) {
  const tabsPanel = elements.native.tabsPanel;
  if (!tabsPanel) return;

  const createTabsPanelToggleButton = () => {
    const tabsPanelToggleButtonEl = document.createElement("button");
    tabsPanelToggleButtonEl.classList.add("site-header__button", "btn--toggle-tabs-panel");
    tabsPanelToggleButtonEl.title = "Toggle Tabs Panel";
    tabsPanelToggleButtonEl.innerHTML = panelsIcon;
    return tabsPanelToggleButtonEl;
  };

  containerEl.appendChild(createTabsPanelToggleButton());
}

/**
 * MOVE TOC BUTTON TO HEADER
 * Moves the book's Table of Contents toggle button to the header
 *
 * @param {HTMLElement} containerEl The container to which the TOC button will be appended.
 */
export function moveTocBtnToHeader(containerEl) {
  const bookTocBtn = document.querySelector(".toc-toggle-button");
  if (bookTocBtn) {
    bookTocBtn.classList.add("site-header__button", "has-dropdown", ".btn--toggle-toc");
    bookTocBtn.title = "Toggle Table of Contents";

    containerEl.append(bookTocBtn);
  }
}

export function replaceButtonTextAndIcons() {
  const updateTabBtns = () => {
    const createTabTooltip = (tooltipText, btnDataTab) => {
      const tooltipEl = document.createElement("div");
      tooltipEl.classList.add("tooltip", `tooltip-${btnDataTab}`);
      tooltipEl.textContent = tooltipText;
      document.body.appendChild(tooltipEl);
    };

    const allTabBtns = document.querySelectorAll(".tab-button");

    allTabBtns.forEach((btn) => {
      const isHidden = getComputedStyle(btn).display === "none";
      if (isHidden) {
        btn.classList.add("is-hidden");
        return;
      }

      // Remove the title and use an aria-label and tooltip instead.
      btn.removeAttribute("title");

      const btnDataTab = btn.getAttribute("data-tab");
      let tabIcon;
      let tooltipFallback;

      switch (btnDataTab) {
        case "instructions":
          tabIcon = instructionsIcon;
          tooltipFallback = "Instructions";
          break;
        case "lsbot-help":
          tabIcon = lsbotIcon;
          tooltipFallback = "LSBot";
          break;
        case "submit-review":
          tabIcon = submitReviewIcon;
          tooltipFallback = "Submit Review";
          break;
        case "code-editor":
          tabIcon = scratchpadIcon;
          tooltipFallback = "Scratchpad";
          break;
        case "community":
          tabIcon = communityIcon;
          tooltipFallback = "Community Solutions";
          break;
        case "feedback":
          tabIcon = feedbackIcon;
          tooltipFallback = "Give Feedback";
          break;
        default:
          break;
      }

      const tabSvg = new DOMParser().parseFromString(tabIcon.trim(), "image/svg+xml").documentElement;
      const tabTooltipText = btn.innerText.trim() || tooltipFallback;
      btn.setAttribute("aria-label", tabTooltipText);
      btn.replaceChildren(tabSvg);
      createTabTooltip(tabTooltipText, btnDataTab);
    });
  };

  const updatePanelBtns = () => {
    const allPanelButtons = {
      copyCodeMarkup: {
        elements: document.querySelectorAll(".markup-copy-block button"),
        icons: [copyIcon, checkIcon],
      },
      copyCode: {
        elements: document.querySelectorAll(".btn-copy-code"),
        icons: [copyIcon],
      },
      exerciseMarkToggle: {
        elements: document.querySelectorAll(".edit_exercise_submission button"),
        icons: [markCompleteIcon, markIncompleteIcon],
      },
      newConversations: {
        elements: document.querySelectorAll(".new-conversation-button"),
        icons: [newConversationIcon],
      },
      nextExercise: {
        elements: [elements.native.nextExerciseButton],
        icons: [nextExerciseIcon],
      },
      showConversationHistory: {
        elements: document.querySelectorAll(".conversation-history-button"),
        icons: [showConversationHistoryIcon],
      },
      tableOfContents: {
        elements: document.querySelectorAll(".toc-toggle-button"),
        icons: [tocIcon],
      },
      viewSolution: {
        elements: document.querySelectorAll("button[data-target='#solution-analysis-collapse']"),
        icons: [showViewIcon, hideViewIcon],
      },
    };

    for (const [btnKey, btnObj] of Object.entries(allPanelButtons)) {
      const btnElements = btnObj.elements;
      if (btnElements.length < 1 || btnElements[0] === null) continue;

      const btnIcons = btnObj.icons;

      btnElements.forEach((btn) => {
        const isExerciseMarkToggle = btnKey === "exerciseMarkToggle";
        const isCopyCodeMarkup = btnKey === "copyCodeMarkup";
        const isViewSolution = btnKey === "viewSolution";
        let newSvgs = [];

        btnIcons.forEach((icon) => {
          const newSvg = new DOMParser().parseFromString(icon.trim(), "image/svg+xml").documentElement;
          newSvg.classList.add("new-icon");
          newSvgs.push(newSvg);
        });

        if (isExerciseMarkToggle) {
          const markForm = document.querySelector(".edit_exercise_submission");
          const hasDeleteInput = markForm.querySelector("input[value=delete]");
          hasDeleteInput ? btn.prepend(newSvgs[1]) : btn.prepend(newSvgs[0]);
          watchMarkToggleBtn(newSvgs[0], newSvgs[1]);
        } else if (isCopyCodeMarkup) {
          newSvgs.forEach((svg) => {
            btn.prepend(svg);
          });
        } else if (isViewSolution) {
          newSvgs.forEach((svg) => {
            btn.prepend(svg);
          });
          watchViewSolutionBtn(btn, newSvgs);
        } else {
          btn.prepend(newSvgs[0]);
        }

        btn.classList.add("has-new-icon");
      });
    }
  };

  updateTabBtns();
  updatePanelBtns();
}
