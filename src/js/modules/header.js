/**
 * HEADER
 * @module header
 */
// import { colorLog } from "./helpers/log.js";
import { injectSettingsMenu } from "./settings-menu.js";
import {
  injectSettingsMenuToggleButton,
  injectSidebarShowButton,
  injectTabsPanelToggleButton,
  moveTocBtnToHeader,
} from "./buttons.js";

/**
 * INJECT SITE HEADER
 * Injects a new .site-header element in the DOM
 */
export function injectHeader() {
  // colorLog.run("Running injectHeader()");
  const currentDomHeader = document.querySelector(".site-header");
  if (currentDomHeader) {
    // colorLog.detail(".site-header already exists. Exited injectHeader().");
    return;
  }

  const createHeader = () => {
    // colorLog.run("Running createHeader()");
    const siteHeaderEl = document.createElement("header");
    siteHeaderEl.className = "site-header";

    injectHeaderContainers(siteHeaderEl);

    return siteHeaderEl;
  };

  // Inject the site header as the first child of the body element.
  document.body.insertBefore(createHeader(), document.body.firstChild);
  // colorLog.detail(".site-header has been injected.");

  // Inject the container offset styles after the header has been injected since it uses measurements based on the injected header
  injectContainerStyleOffsets();
}

/**
 * INJECT HEADER CONTAINERS
 * Injects three .site-header__container elements to the .site-header
 *
 * @param {HTMLElement} headerEl The header element to which the containers will be appended.
 */
function injectHeaderContainers(headerEl) {
  for (let i = 0; i < 3; i += 1) {
    const createHeaderContainer = () => {
      const containerEl = document.createElement("div");
      const containerNum = i + 1;
      containerEl.classList.add("site-header__container", `container-${containerNum}`);

      injectContainerElements(containerEl, containerNum);

      return containerEl;
    };

    headerEl.appendChild(createHeaderContainer());
  }
}

/**
 * INJECT CONTAINER ELEMENTS
 * Injects elements to each .site-header__container
 *
 * @param {HTMLDivElement} containerEl The container to which the elements will be appended..
 * @param {number} containerNum The number of the container to which the elements will be appended.
 */
function injectContainerElements(containerEl, containerNum) {
  if (containerNum === 1) {
    injectSidebarShowButton(containerEl);
    moveLoggedOutNavToHeader(containerEl);
  }

  if (containerNum === 2) {
    // If breadcrumbs exist, move them inside the container, otherwise add the title there.
    const breadcrumbs = document.querySelector(".gretel-breadcrumbs");

    if (breadcrumbs) {
      containerEl.append(breadcrumbs);
    } else {
      injectTitleToHeaderWithNoBreadcrumbs(containerEl);
    }
  }

  if (containerNum === 3) {
    moveTocBtnToHeader(containerEl);
    injectTabsPanelToggleButton(containerEl);
    injectSettingsMenuToggleButton(containerEl);
    injectSettingsMenu(containerEl);
  }
}

/**
 * INJECT TITLE TO HEADER WITH NO BREADCRUMBS
 * If breadcrumbs don't exist, injects the non-default HTML title to the .site-header__container
 *
 * @param {HTMLDivElement} containerEl The container to which the title will be appended.
 */
function injectTitleToHeaderWithNoBreadcrumbs(containerEl) {
  // Don't add title when the logged-out nav exists.
  const loggedOutNav = document.querySelector(".columns:has(> #logo + .nav)");
  if (loggedOutNav) return;

  const titleEl = document.querySelector("title");
  const titleText = titleEl.innerText;
  const defaultTitle = "Launch School - an online school for Software Engineers";

  // Don't add the title if it's the default one.
  if (titleText === defaultTitle) return;

  const createHeaderTitle = () => {
    const headerTitleEl = document.createElement("div");
    headerTitleEl.classList.add("title-text");
    headerTitleEl.innerHTML = titleText;

    return headerTitleEl;
  };

  containerEl.append(createHeaderTitle());
}

/**
 * INJECT CONTAINER STYLE OFFSETS
 * Adds the offset style variables for the .site-header__container elements
 */
function injectContainerStyleOffsets() {
  // colorLog.run("Running injectContainerStyleOffsets()");
  const container1 = document.querySelector(".site-header__container.container-1");
  const container3 = document.querySelector(".site-header__container.container-3");
  const container1Width = container1?.offsetWidth || 0;
  const container3Width = container3?.offsetWidth || 0;
  const siteHeaderInlinePadding = 12;
  const gapBetweenContainers = 24;
  const sidebarWidth = 195;
  const navExpandBtnWidth = 30;
  const container2LeftOffset = container1Width + siteHeaderInlinePadding + gapBetweenContainers;
  const container2RightOffset = container3Width + siteHeaderInlinePadding + gapBetweenContainers;
  const container2SidebarLeftOffset = sidebarWidth + navExpandBtnWidth + gapBetweenContainers;
  const root = document.documentElement;

  root.style.setProperty("--header-container2-left-offset", `${container2LeftOffset}px`);
  root.style.setProperty("--header-container2-right-offset", `${container2RightOffset}px`);
  root.style.setProperty("--header-container2-sidebar-left-offset", `${container2SidebarLeftOffset}px`);
}

/**
 * ADD LOGGED-OUT NAV TO HEADER
 * Moves the logged out nav to the .site-header when the user is logged out
 *
 * @param {HTMLDivElement} containerEl The container to which the logged-out nav will be appended.
 */
function moveLoggedOutNavToHeader(containerEl) {
  const loggedOutNav = document.querySelector(".columns:has(> #logo + .nav)");
  if (loggedOutNav) {
    loggedOutNav.classList.remove("clearfix");
    loggedOutNav.classList.add("logged-out-nav");

    containerEl.appendChild(loggedOutNav);
  }
}
