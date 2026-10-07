import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

class ClassList {
  constructor(element) {
    this.element = element;
    this.values = new Set();
  }
  add(...values) {
    values.forEach((value) => this.values.add(value));
    this.element.className = [...this.values].join(" ");
  }
  remove(...values) {
    values.forEach((value) => this.values.delete(value));
    this.element.className = [...this.values].join(" ");
  }
  contains(value) {
    return this.values.has(value);
  }
  toggle(value) {
    if (this.contains(value)) this.remove(value);
    else this.add(value);
    return this.contains(value);
  }
}

class Element {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.dataset = {};
    this.attributes = {};
    this.style = {};
    this._className = "";
    this.classList = new ClassList(this);
    this.textContent = "";
    this.listeners = {};
  }
  get firstChild() {
    return this.children[0] || null;
  }
  get className() {
    return this._className;
  }
  set className(value) {
    this._className = String(value);
    if (this.classList) this.classList.values = new Set(this._className.split(/\s+/).filter(Boolean));
  }
  get nextSibling() {
    if (!this.parentElement) return null;
    return this.parentElement.children[this.parentElement.children.indexOf(this) + 1] || null;
  }
  get isConnected() {
    return Boolean(this.parentElement);
  }
  appendChild(child) {
    child.remove?.();
    this.children.push(child);
    child.parentElement = this;
    return child;
  }
  append(...children) {
    children.forEach((child) => this.appendChild(child));
  }
  insertBefore(child, reference) {
    child.remove?.();
    const index = this.children.indexOf(reference);
    this.children.splice(index < 0 ? this.children.length : index, 0, child);
    child.parentElement = this;
    return child;
  }
  before(sibling) {
    this.parentElement?.insertBefore(sibling, this);
  }
  remove() {
    if (!this.parentElement) return;
    this.parentElement.children.splice(this.parentElement.children.indexOf(this), 1);
    this.parentElement = null;
  }
  replaceChildren(...children) {
    this.children.forEach((child) => (child.parentElement = null));
    this.children = [];
    this.append(...children.filter(Boolean));
  }
  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === "id") this.id = String(value);
    if (name === "class") {
      this.className = String(value);
      this.classList.values = new Set(this.className.split(/\s+/).filter(Boolean));
    }
  }
  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
  removeAttribute(name) {
    delete this.attributes[name];
  }
  addEventListener(type, callback) {
    this.listeners[type] = callback;
  }
  removeEventListener(type) {
    delete this.listeners[type];
  }
  contains(element) {
    return this === element || this.children.some((child) => child.contains?.(element));
  }
  matches(selector) {
    if (selector.startsWith(".")) return this.classList.contains(selector.slice(1));
    if (selector.startsWith("#")) return this.id === selector.slice(1);
    return this.tagName.toLowerCase() === selector.toLowerCase();
  }
  querySelectorAll(selector) {
    const simpleSelector = selector.trim();
    if (!simpleSelector.startsWith(".") && !simpleSelector.startsWith("#") && !/^[a-z]+$/i.test(simpleSelector))
      return [];
    return this.children.flatMap((child) => [
      ...(child.matches?.(simpleSelector) ? [child] : []),
      ...(child.querySelectorAll?.(simpleSelector) || []),
    ]);
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches?.(selector)) return current;
      current = current.parentElement;
    }
    return null;
  }
  focus() {}
  click() {}
  dispatchEvent() {}
}

class Comment {
  constructor(data) {
    this.data = data;
    this.parentElement = null;
  }
  remove() {
    if (!this.parentElement) return;
    this.parentElement.children.splice(this.parentElement.children.indexOf(this), 1);
    this.parentElement = null;
  }
}

test("built userscript initializes against a sparse page and registers its UI", () => {
  const source = readFileSync(new URL("../dist/js/index.min.js", import.meta.url), "utf8");
  const listeners = {};
  const document = {
    readyState: "loading",
    documentElement: new Element("html"),
    head: new Element("head"),
    body: new Element("body"),
    activeElement: null,
    createElement: (tagName) => new Element(tagName),
    createComment: (data) => new Comment(data),
    querySelector(selector) {
      const matches = this.querySelectorAll(selector);
      return matches[0] || null;
    },
    querySelectorAll(selector) {
      if (selector.includes(",") || /[ >+:[\]]/.test(selector)) return [];
      return [
        ...this.documentElement.querySelectorAll(selector),
        ...this.head.querySelectorAll(selector),
        ...this.body.querySelectorAll(selector),
      ];
    },
    getElementById(id) {
      return this.querySelector(`#${id}`);
    },
    addEventListener(type, callback) {
      listeners[type] = callback;
    },
    removeEventListener(type) {
      delete listeners[type];
    },
  };
  const window = {
    location: { origin: "https://launchschool.com", pathname: "/courses", search: "" },
    addEventListener() {},
    removeEventListener() {},
  };
  const storage = new Map();
  const context = vm.createContext({
    document,
    window,
    history: { pushState() {}, replaceState() {} },
    location: window.location,
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
    },
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    DOMParser: class {
      parseFromString() {
        return { documentElement: new Element("svg") };
      }
    },
    requestAnimationFrame: (callback) => callback(),
    getComputedStyle: () => ({ display: "block" }),
    URL,
    setTimeout,
    clearTimeout,
    console,
  });

  vm.runInContext(source, context);
  assert.equal(typeof listeners.DOMContentLoaded, "function");
  assert.doesNotThrow(() => listeners.DOMContentLoaded());
  assert.ok(document.querySelector(".site-header"));
  assert.ok(document.querySelector(".settings-container"));
  assert.ok(document.querySelector(".toast-container"));
  assert.ok(document.getElementById("ls-ui-script-styles"));
});
