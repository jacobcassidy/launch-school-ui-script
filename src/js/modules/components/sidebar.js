/**
 * SIDEBAR
 * @module components/sidebar
 */

// Import components
import { icons } from "../components";

// Import utils
import { sidebarLists } from "../utils/configs";
import { syncActiveSidebarItem } from "../utils/sync";

const observedUnreadCounts = new WeakSet();

/**
 * UPDATE SIDEBAR
 */
export function updateSidebar() {
  const nativeSidebar = document.querySelector(".nav-drawer");
  if (!nativeSidebar) return;

  // If sidebar already exists, sync active item and exit early.
  if (nativeSidebar.classList.contains("sidebar")) {
    syncActiveSidebarItem();
    return;
  }

  addSidebarLinkClasses();
  removeCountParentheses();

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

/**
 * INJECT SIDEBAR HEADER
 */
function injectSidebarHeader() {
  const sidebar = document.querySelector(".nav-drawer");
  const createSidebarHeader = () => {
    const sidebarHeaderEl = document.createElement("header");
    sidebarHeaderEl.className = "sidebar-header";
    const sidebarHeaderLogoEl = document.createElement("a");
    sidebarHeaderLogoEl.setAttribute("href", "/course_catalog");
    sidebarHeaderLogoEl.className = "sidebar-header__logo";
    const sidebarLogoTextEl = document.createElement("span");
    sidebarLogoTextEl.className = "logo-title hidden-on-collapse";
    sidebarLogoTextEl.textContent = "LaunchSchool";
    const modifiedLogoIconEl = icons.sidebarIcons.modifiedLogo();
    modifiedLogoIconEl.classList.add("logo-icon");
    sidebarHeaderLogoEl.appendChild(modifiedLogoIconEl);
    sidebarHeaderLogoEl.appendChild(sidebarLogoTextEl);
    sidebarHeaderEl.appendChild(sidebarHeaderLogoEl);
    return sidebarHeaderEl;
  };

  if (sidebar) sidebar.prepend(createSidebarHeader());
}

/**
 * ADD COUNT WITHOUT PARENTHESES
 */
function removeCountParentheses() {
  // colorLog.run("Running removeCountParentheses()");

  const counts = document.querySelectorAll('.nav-drawer [class*="_unread_count"]');
  if (counts.length < 1) return;

  counts.forEach((count) => {
    if (observedUnreadCounts.has(count)) return;
    observedUnreadCounts.add(count);

    let badge = null;
    const syncCount = () => {
      const countText = count.textContent.replace(/[()]/g, "").trim();
      if (!countText) {
        badge?.remove();
        badge = null;
        return;
      }

      if (!badge) {
        badge = document.createElement("span");
        badge.className = "unread-count";
        count.after(badge);
      }
      badge.textContent = countText;
      badge.classList.toggle("hide-single-count", countText === "1");
    };

    const observer = new MutationObserver(syncCount);
    observer.observe(count, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    syncCount();
  });
}

/**
 * REORDER SIDEBAR LISTS
 */
function reorderSidebarLists(sidebar, sidebarItems) {
  sidebar.classList.add("sidebar");
  const updatedListsWrapperEl = document.createElement("div");
  updatedListsWrapperEl.className = "sidebar-lists";
  Object.entries(sidebarLists).forEach(([listName, { listOrder, listTitle }]) => {
    const listClassName = listName.replace(/([A-Z])/g, "-$1").toLowerCase();
    const listWrapperEl = document.createElement("div");
    listWrapperEl.className = `sidebar-list-wrapper ${listClassName}-wrapper`;
    const listEl = document.createElement("ul");
    listEl.className = `sidebar-list ${listClassName}`;

    const listHeaderEl = document.createElement("button");
    listHeaderEl.className = "sidebar-list-toggle-btn btn--plain";
    const listHeaderTitleEl = document.createElement("span");
    listHeaderTitleEl.className = "list-title";
    listHeaderTitleEl.innerText = listTitle;
    listHeaderEl.appendChild(listHeaderTitleEl);
    listHeaderEl.appendChild(icons.sidebarIcons.toggle());
    listWrapperEl.appendChild(listHeaderEl);

    Object.entries(listOrder)
      .sort(([, firstOrder], [, secondOrder]) => firstOrder - secondOrder)
      .forEach(([linkLabel]) => {
        const item = sidebarItems.get(linkLabel);
        if (!item) return;

        item.querySelectorAll("a").forEach((link) => link.classList.add("item-link"));
        item.querySelectorAll("button").forEach((btn) => btn.classList.add("item-btn"));
        item.className = "sidebar-list__item";
        listEl.appendChild(item);
      });
    listWrapperEl.appendChild(listEl);
    updatedListsWrapperEl.appendChild(listWrapperEl);
  });

  sidebar.appendChild(updatedListsWrapperEl);
}
