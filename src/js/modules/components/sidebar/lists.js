/**
 * SIDEBAR LIST RENDERING
 * @module components/sidebar/lists
 */

import { icons } from "../icons.js";
import { sidebarLists } from "../../utils/configs/sidebar-lists.js";

/**
 * REORDER SIDEBAR LISTS
 */
export function reorderSidebarLists(sidebar, sidebarItems) {
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
