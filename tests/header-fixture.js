import assert from "node:assert/strict";
import { sourceContext } from "./source-context.js";

function node(tagName) {
  let text = "";
  let classes = new Set();
  const listeners = new Map();
  return {
    tagName,
    dataset: {},
    children: [],
    parentElement: null,
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
    },
    get textContent() {
      return text + this.children.map((child) => child.textContent).join("");
    },
    set textContent(value) {
      text = value;
    },
    get innerText() {
      return this.textContent;
    },
    set innerText(value) {
      text = value;
    },
    get firstChild() {
      return this.children[0] || null;
    },
    get nextSibling() {
      const siblings = this.parentElement?.children || [];
      return siblings[siblings.indexOf(this) + 1] || null;
    },
    get isConnected() {
      return this.tagName === "html" || !!this.parentElement?.isConnected;
    },
    matches(selector) {
      if (selector === ".columns:has(> #logo + .nav)") {
        return (
          classes.has("columns") &&
          this.children.some((child) => child.id === "logo" && child.nextSibling?.classList.contains("nav"))
        );
      }
      if (selector === ".courses-tabs li.active a") {
        return (
          this.tagName === "a" &&
          this.parentElement?.classList.contains("active") &&
          this.parentElement.parentElement?.classList.contains("courses-tabs")
        );
      }
      if (selector.startsWith("."))
        return selector
          .slice(1)
          .split(".")
          .every((name) => classes.has(name));
      return this.tagName === selector;
    },
    querySelectorAll(selector) {
      const descendants = this.children.flatMap((child) => [child, ...child.querySelectorAll("*")]);
      return descendants.filter((child) => selector === "*" || child.matches(selector));
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
    closest(selector) {
      if (this.matches(selector)) return this;
      return this.parentElement?.closest(selector) || null;
    },
    contains(child) {
      return child === this || this.children.some((descendant) => descendant.contains(child));
    },
    remove() {
      if (!this.parentElement) return;
      const siblings = this.parentElement.children;
      siblings.splice(siblings.indexOf(this), 1);
      this.parentElement = null;
    },
    insertBefore(child, before) {
      if (child === before) return;
      child.remove();
      const index = before ? this.children.indexOf(before) : this.children.length;
      assert.ok(index >= 0);
      this.children.splice(index, 0, child);
      child.parentElement = this;
    },
    appendChild(child) {
      this.insertBefore(child, null);
    },
    prepend(child) {
      this.insertBefore(child, this.firstChild);
    },
    before(child) {
      this.parentElement.insertBefore(child, this);
    },
    addEventListener(event, callback) {
      listeners.set(event, callback);
    },
    click() {
      listeners.get("click")?.();
    },
  };
}

export function headerFixture(options = {}) {
  const html = node("html");
  const head = node("head");
  const body = node("body");
  const pageTitle = node("title");
  html.appendChild(head);
  html.appendChild(body);
  head.appendChild(pageTitle);
  const document = {
    body,
    createElement: node,
    createComment: () => node("comment"),
    querySelector: (selector) => html.querySelector(selector),
    querySelectorAll: (selector) => html.querySelectorAll(selector),
  };
  const window = { location: { pathname: "/course_catalog/example", search: "" } };
  const elements = { native: {} };
  const setters = sourceContext("../src/js/modules/utils/state/setters/dom.js", { elements });
  const buttonHelpers = sourceContext("../src/js/modules/utils/dom/buttons.js");
  const sync = sourceContext("../src/js/modules/utils/sync/native-elements-state.js", { document, ...setters });
  const icons = { headerIcons: new Proxy({}, { get: () => () => node("svg") }) };
  const component = (name) =>
    sourceContext(`../src/js/modules/components/buttons/header/${name}.js`, {
      document,
      elements,
      icons,
      setButtonProperties: buttonHelpers.setButtonProperties,
    });
  const context = sourceContext("../src/js/modules/components/header.js", {
    document,
    window,
    elements,
    setElementTocButton: setters.setElementTocButton,
    ...component("sidebar-toggle"),
    ...component("tabs-panel-toggle"),
    ...component("toc-toggle"),
    ...component("settings-toggle"),
    injectSettingsMenu(container) {
      const menu = node("div");
      menu.className = "settings-container";
      const option = node("input");
      option.className = "fixture-option";
      option.checked = false;
      menu.appendChild(option);
      container.appendChild(menu);
    },
  });
  let page;
  const render = ({
    loggedOut = true,
    pathname = "/course_catalog/example",
    title = null,
    breadcrumbs = false,
    sidebar = false,
    tabs = false,
    toc = false,
    documentTitle = "Public page",
  } = {}) => {
    page?.remove();
    page = node("main");
    body.appendChild(page);
    window.location.pathname = pathname;
    pageTitle.textContent = documentTitle;
    const native = {};
    if (loggedOut) {
      native.nav = node("div");
      native.nav.className = "columns clearfix";
      const logo = node("a");
      logo.id = "logo";
      const links = node("ul");
      links.className = "nav";
      native.nav.appendChild(logo);
      native.nav.appendChild(links);
      page.appendChild(native.nav);
    }
    if (title !== null) {
      const courses = node("ul");
      courses.className = "courses-tabs";
      const active = node("li");
      active.className = "active";
      native.courseTitle = node("a");
      native.courseTitle.textContent = title;
      active.appendChild(native.courseTitle);
      courses.appendChild(active);
      page.appendChild(courses);
    }
    for (const [key, present, className] of [
      ["breadcrumbs", breadcrumbs, "gretel-breadcrumbs"],
      ["sidebar", sidebar, "nav-drawer"],
      ["tabs", tabs, "tabs-panel"],
      ["toc", toc, "toc-toggle-button"],
    ]) {
      if (!present) continue;
      native[key] = node("div");
      native[key].className = className;
      page.appendChild(native[key]);
    }
    return native;
  };
  const refresh = () => {
    sync.syncNativeElementsState();
    context.injectHeader();
    return document.querySelector(".site-header");
  };
  const native = render(options);
  const header = refresh();
  return { header, native, render, refresh, document, body, elements, window };
}
