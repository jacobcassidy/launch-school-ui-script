/**
 * SIDEBAR
 * @module components/sidebar
 */

// Import components
import { icons } from "./icons.js";

// Import utils
import { syncActiveSidebarItem } from "../utils/sync/active-sidebar-item.js";
import { injectSidebarHeader } from "./sidebar/header.js";
import { reorderSidebarLists } from "./sidebar/lists.js";
import { watchUnreadCounts } from "../utils/watch/index.js";

let activeSidebar = null;
let sidebarTooltips = [];

/**
 * UPDATE SIDEBAR
 */
export function updateSidebar() {
  const nativeSidebar = document.querySelector(".nav-drawer");
  if (nativeSidebar !== activeSidebar) {
    sidebarTooltips.forEach((tooltip) => tooltip.remove());
    sidebarTooltips = [];
    activeSidebar = nativeSidebar;
  }
  if (!nativeSidebar) {
    watchUnreadCounts(null);
    return;
  }

  watchUnreadCounts(nativeSidebar);

  // If sidebar already exists, sync active item and exit early.
  if (nativeSidebar.classList.contains("sidebar")) {
    sidebarTooltips = [...document.querySelectorAll(".sidebar-tooltip")];
    syncActiveSidebarItem();
    return;
  }

  addSidebarLinkClasses();

  const sidebarItemLinks = nativeSidebar.querySelectorAll(":scope > ul > li > a");
  const sidebarItems = new Map();

  sidebarItemLinks.forEach((link) => {
    if (!link) return;

    const linkParentElement = link.parentElement;
    const linkClassStr = link.getAttribute("class");
    let linkIconEl;
    let linkLabel;
    let dropdownItemIconEl;
    let tooltipFallback;

    const createSidebarLinkTooltip = (linkEl, tooltipText) => {
      const tooltipDataStr = tooltipText.replace(/\s+/g, "-").toLowerCase();
      const tooltipEl = document.createElement("div");
      const tooltipSpanEl = document.createElement("span");
      tooltipEl.classList.add("tooltip", "sidebar-tooltip", `sidebar-tooltip-${tooltipDataStr}`);
      tooltipSpanEl.textContent = tooltipText;
      tooltipEl.append(tooltipSpanEl);
      document.body.appendChild(tooltipEl);
      sidebarTooltips.push(tooltipEl);

      linkEl.setAttribute("aria-label", tooltipText);
      linkEl.setAttribute("data-tooltip", tooltipDataStr);
      linkEl.removeAttribute("title");
    };

    if (linkClassStr) {
      switch (true) {
        case linkClassStr.includes("courses"):
          linkLabel = "courses";
          linkIconEl = icons.sidebarIcons.courses();
          tooltipFallback = "Courses";
          break;
        case linkClassStr.includes("forum"):
          linkLabel = "forum";
          linkIconEl = icons.sidebarIcons.forum();
          tooltipFallback = "Forum";
          break;
        case linkClassStr.includes("events"):
          linkLabel = "events";
          linkIconEl = icons.sidebarIcons.events();
          tooltipFallback = "Events";
          break;
        case linkClassStr.includes("social"):
          linkLabel = "social";
          linkIconEl = icons.sidebarIcons.sharing();
          tooltipFallback = "Sharing";
          break;
        case linkClassStr.includes("videos"):
          linkLabel = "videos";
          linkIconEl = icons.sidebarIcons.videos();
          tooltipFallback = "Videos";
          break;
        case linkClassStr.includes("resources"):
          linkLabel = "resources";
          linkIconEl = icons.sidebarIcons.resources();
          tooltipFallback = "Resources";
          break;
        case linkClassStr.includes("my-exercises"):
          linkLabel = "my-exercises";
          linkIconEl = icons.sidebarIcons.myExercises();
          tooltipFallback = "My Exercises";
          break;
        case linkClassStr.includes("exercises"):
          linkLabel = "exercises";
          linkIconEl = icons.sidebarIcons.exercises();
          tooltipFallback = "Exercises";
          break;
        case linkClassStr.includes("bookshelf"):
          linkLabel = "bookshelf";
          linkIconEl = icons.sidebarIcons.bookshelf();
          tooltipFallback = "Bookshelf";
          break;
        case linkClassStr.includes("pages"):
          linkLabel = "pages";
          linkIconEl = icons.sidebarIcons.pages();
          dropdownItemIconEl = () => icons.sidebarIcons.page();
          tooltipFallback = "Pages";
          break;
        case linkClassStr.includes("archives"):
          linkLabel = "archives";
          linkIconEl = icons.sidebarIcons.archives();
          tooltipFallback = "Archives";
          break;
        case linkClassStr.includes("chat"):
          linkLabel = "chat";
          linkIconEl = icons.sidebarIcons.chat();
          tooltipFallback = "Chat Room";
          break;
        case linkClassStr.includes("my-account"):
          linkLabel = "my-account";
          linkIconEl = icons.sidebarIcons.myAccount();
          tooltipFallback = "My Account";
          break;
        case linkClassStr.includes("my-assessments"):
          linkLabel = "my-assessments";
          linkIconEl = icons.sidebarIcons.myAssessments();
          tooltipFallback = "My Assessments";
          break;
        case linkClassStr.includes("exit"):
          linkLabel = "sign-out";
          linkIconEl = icons.sidebarIcons.signOut();
          tooltipFallback = "Sign Out";
          break;
        default:
          linkLabel = null;
          linkIconEl = null;
          tooltipFallback = null;
          break;
      }

      // Regex removes any (#) text from the tooltipText
      const tooltipText = link.innerText.replace(/\([^)]*\)/g, "").trim() || tooltipFallback;
      createSidebarLinkTooltip(link, tooltipText);

      // Keep DOM references local to this sidebar build.
      if (linkLabel && linkParentElement) sidebarItems.set(linkLabel, linkParentElement);

      // Replace link icon with custom icon if it exists
      if (linkIconEl) link.prepend(linkIconEl);

      // Add icon to dropdown items if they exists
      if (dropdownItemIconEl) {
        const sidebarDropdownLinks = document.querySelectorAll(".nav-drawer li.has-dropdown ul.dropdown li a");

        if (sidebarDropdownLinks.length > 0) {
          sidebarDropdownLinks.forEach((dropdownLink) => {
            dropdownLink.prepend(dropdownItemIconEl());
          });
        }
      }

      // Replace `a` element with `button` element for pages dropdown
      if (linkLabel === "pages") {
        const btnEl = document.createElement("button");
        btnEl.innerHTML = link.innerHTML;
        btnEl.className = link.className;

        // Transfer all data-* attributes
        for (const attr of link.attributes) {
          if (attr.name.startsWith("data-")) {
            btnEl.setAttribute(attr.name, attr.value);
          }
        }

        // Transfer aria-label
        if (link.hasAttribute("aria-label")) {
          btnEl.setAttribute("aria-label", link.getAttribute("aria-label"));
        }

        link.replaceWith(btnEl);
      }
    }
  });

  reorderSidebarLists(nativeSidebar, sidebarItems);
  injectSidebarHeader();
  syncActiveSidebarItem();
}

/**
 * ADD SIDEBAR LINK CLASSES
 */
function addSidebarLinkClasses() {
  const sidebar = document.querySelector(".nav-drawer");
  const assessmentLink = sidebar.querySelector(".assessments");
  const exercisesLinks = sidebar.querySelectorAll(".exercises");

  if (!assessmentLink || exercisesLinks.length < 1) return;

  assessmentLink ? assessmentLink.classList.add("my-assessments") : null;

  exercisesLinks.forEach((link) => {
    const linkTitleStr = link.getAttribute("title");

    if (linkTitleStr?.includes("My Exercises")) {
      link.classList.add("my-exercises");
    }
  });
}
