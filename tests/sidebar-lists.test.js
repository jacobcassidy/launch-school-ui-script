import assert from "node:assert/strict";
import test from "node:test";
import { sidebarLists } from "../src/js/modules/utils/configs/sidebar-lists.js";
import { sourceContext } from "./source-context.js";

function node(tagName) {
  let classes = new Set();
  let text = "";
  const attributes = new Map();
  const el = {
    tagName,
    parentElement: null,
    children: [],
    get className() {
      return [...classes].join(" ");
    },
    set className(value) {
      classes = new Set(value.split(/\s+/).filter(Boolean));
    },
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
      toggle(name, force) {
        if (force ?? !classes.has(name)) classes.add(name);
        else classes.delete(name);
      },
    },
    get innerText() {
      return this.textContent;
    },
    set innerText(value) {
      text = value;
    },
    get textContent() {
      return text + this.children.map((child) => child.textContent).join("");
    },
    set textContent(value) {
      text = value;
    },
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    getAttribute(name) {
      return name === "class" ? this.className : attributes.get(name) || null;
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
    remove() {
      if (!this.parentElement) return;
      const siblings = this.parentElement.children;
      siblings.splice(siblings.indexOf(this), 1);
      this.parentElement = null;
    },
    appendChild(child) {
      child.remove();
      child.parentElement = this;
      this.children.push(child);
    },
    prepend(child) {
      child.remove();
      child.parentElement = this;
      this.children.unshift(child);
    },
    querySelectorAll(selector) {
      if (selector === ":scope > ul > li > a") {
        return this.children
          .filter((child) => child.tagName === "ul")
          .flatMap((list) => list.children.filter((child) => child.tagName === "li"))
          .flatMap((item) => item.children.filter((child) => child.tagName === "a"));
      }
      const descendants = this.children.flatMap((child) => [child, ...child.querySelectorAll("*")]);
      return descendants.filter((child) => {
        if (selector === "*") return true;
        if (selector.startsWith(".")) {
          return selector
            .slice(1)
            .split(".")
            .every((name) => child.classList.contains(name));
        }
        return child.tagName === selector;
      });
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
  };
  el.append = el.appendChild;
  return el;
}

function fixture() {
  const body = node("body");
  const config = structuredClone(sidebarLists);
  const initialConfig = structuredClone(config);
  let sidebar = null;
  let activeSyncs = 0;
  const watchedSidebars = [];
  const document = {
    body,
    createElement: node,
    querySelector(selector) {
      assert.ok([".nav-drawer", ".sidebar.nav-drawer"].includes(selector));
      if (selector === ".nav-drawer") return sidebar;
      return sidebar?.classList.contains("sidebar") ? sidebar : null;
    },
    querySelectorAll(selector) {
      if (selector === ".nav-drawer > ul > li > a") return sidebar.querySelectorAll(":scope > ul > li > a");
      if (selector === ".sidebar-tooltip") {
        return body.children.filter((child) => child.classList.contains("sidebar-tooltip"));
      }
      return [];
    },
  };
  const icons = { sidebarIcons: new Proxy({}, { get: () => () => node("svg") }) };
  const listRenderer = sourceContext("../src/js/modules/components/sidebar/lists.js", {
    document,
    sidebarLists: config,
    icons,
  });
  const headerRenderer = sourceContext("../src/js/modules/components/sidebar/header.js", { document, icons });
  const unreadCountWatcher = sourceContext("../src/js/modules/utils/watch/sidebar/unread-count.js", {
    document,
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
  });
  const context = sourceContext("../src/js/modules/components/sidebar.js", {
    document,
    icons,
    syncActiveSidebarItem: () => activeSyncs++,
    reorderSidebarLists: listRenderer.reorderSidebarLists,
    injectSidebarHeader: headerRenderer.injectSidebarHeader,
    watchUnreadCounts(sidebar) {
      watchedSidebars.push(sidebar);
      unreadCountWatcher.watchUnreadCounts(sidebar);
    },
  });
  const replaceSidebar = (names) => {
    sidebar?.remove();
    sidebar = node("nav");
    sidebar.className = "nav-drawer";
    const nativeList = node("ul");
    const items = new Map();
    for (const name of names) {
      const item = node("li");
      item.name = name;
      const link = node("a");
      link.className = name === "sign-out" ? "exit" : name;
      link.innerText = name;
      item.appendChild(link);
      nativeList.appendChild(item);
      items.set(name, item);
    }
    sidebar.appendChild(nativeList);
    body.appendChild(sidebar);
    return { sidebar, items };
  };
  const restoreSidebar = (restoredSidebar, ...tooltips) => {
    sidebar = restoredSidebar;
    body.appendChild(restoredSidebar);
    tooltips.forEach((tooltip) => body.appendChild(tooltip));
  };
  return {
    context,
    replaceSidebar,
    restoreSidebar,
    body,
    config,
    initialConfig,
    activeSyncs: () => activeSyncs,
    watchedSidebars,
  };
}

test("replacement sidebar uses only current items and retains configured ordering", () => {
  const f = fixture();
  const first = f.replaceSidebar(["my-account", "forum", "bookshelf", "exercises", "courses", "events", "chat"]);
  f.context.updateSidebar();
  const study = first.sidebar.querySelector(".sidebar-list.main-list");
  assert.deepEqual(
    study.children.map((item) => item.name),
    ["courses", "bookshelf", "exercises"],
  );
  assert.deepEqual(
    first.sidebar.querySelector(".sidebar-list.community-list").children.map((item) => item.name),
    ["chat", "events", "forum"],
  );
  const oldStudyItems = [...study.children];
  const oldAccount = first.items.get("my-account");
  const oldAccountList = oldAccount.parentElement;

  const second = f.replaceSidebar(["forum", "courses"]);
  f.context.updateSidebar();
  assert.deepEqual(second.sidebar.querySelectorAll(".sidebar-list__item"), [
    second.items.get("courses"),
    second.items.get("forum"),
  ]);
  assert.deepEqual(second.sidebar.querySelector(".sidebar-list.account-list").children, []);
  assert.deepEqual(study.children, oldStudyItems);
  assert.equal(oldAccount.parentElement, oldAccountList);
  assert.deepEqual(f.config, f.initialConfig);

  const empty = f.replaceSidebar([]);
  f.context.updateSidebar();
  assert.deepEqual(empty.sidebar.querySelectorAll(".sidebar-list__item"), []);
  assert.deepEqual(f.config, f.initialConfig);
});

test("repeated sidebar updates preserve existing groups, icons, and tooltips", () => {
  const f = fixture();
  const current = f.replaceSidebar(["courses", "bookshelf", "sign-out"]);
  f.context.updateSidebar();
  const originalNodes = current.sidebar.querySelectorAll("*");
  const originalBodyNodes = [...f.body.children];
  const toggle = current.sidebar.querySelector(".sidebar-list-toggle-btn");
  toggle.classList.add("is-closed");

  f.context.updateSidebar();
  f.context.updateSidebar();
  assert.deepEqual(current.sidebar.querySelectorAll("*"), originalNodes);
  assert.deepEqual(f.body.children, originalBodyNodes);
  assert.ok(toggle.classList.contains("is-closed"));
  assert.equal(f.activeSyncs(), 3);
  assert.deepEqual(f.config, f.initialConfig);
});

test("replacing the sidebar removes tooltips from the old sidebar", () => {
  const f = fixture();
  const first = f.replaceSidebar(["courses", "forum"]);
  f.context.updateSidebar();
  const oldTooltips = f.body.children.filter((el) => el.classList.contains("sidebar-tooltip"));
  assert.equal(oldTooltips.length, 2);

  f.replaceSidebar(["courses"]);
  f.context.updateSidebar();
  const currentTooltips = f.body.children.filter((el) => el.classList.contains("sidebar-tooltip"));

  assert.equal(currentTooltips.length, 1);
  assert.ok(!currentTooltips.some((tooltip) => oldTooltips.includes(tooltip)));
  assert.ok(first.sidebar.classList.contains("sidebar"));
});

test("reused sidebar refreshes its unread count observer and tooltip ownership", () => {
  const f = fixture();
  const first = f.replaceSidebar(["courses"]);
  f.context.updateSidebar();
  const firstTooltip = f.body.children.find((el) => el.classList.contains("sidebar-tooltip"));

  f.replaceSidebar(["forum"]);
  f.context.updateSidebar();
  const secondTooltip = f.body.children.find((el) => el.classList.contains("sidebar-tooltip"));
  assert.ok(!f.body.children.includes(firstTooltip));

  f.restoreSidebar(first.sidebar, firstTooltip);
  f.context.updateSidebar();

  assert.equal(f.watchedSidebars.at(-1), first.sidebar);
  assert.ok(f.body.children.includes(firstTooltip));
  assert.ok(!f.body.children.includes(secondTooltip));
  assert.ok(first.sidebar.classList.contains("sidebar"));
});

test("sidebar grouping preserves Pages buttons and dropdown links", () => {
  const f = fixture();
  const current = f.replaceSidebar([]);
  const item = node("li");
  const button = node("button");
  const dropdown = node("ul");
  const link = node("a");
  dropdown.appendChild(link);
  item.appendChild(button);
  item.appendChild(dropdown);
  current.sidebar.children[0].appendChild(item);

  f.context.reorderSidebarLists(current.sidebar, new Map([["pages", item]]));
  assert.equal(current.sidebar.querySelector(".sidebar-list.extras-list").children[0], item);
  assert.deepEqual(item.children, [button, dropdown]);
  assert.ok(button.classList.contains("item-btn"));
  assert.ok(link.classList.contains("item-link"));
  assert.equal(link.parentElement, dropdown);
  assert.deepEqual(f.config, f.initialConfig);
});

test("icon-only sidebar links without a known type retain their native content", () => {
  const f = fixture();
  const current = f.replaceSidebar(["new-feature"]);
  const link = current.sidebar.querySelector("a");
  const icon = node("svg");
  link.textContent = "";
  link.appendChild(icon);

  assert.doesNotThrow(() => f.context.updateSidebar());
  assert.equal(link.parentElement, current.items.get("new-feature"));
  assert.equal(link.querySelector("svg"), icon);
});
