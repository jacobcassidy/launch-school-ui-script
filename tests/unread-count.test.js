import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("unread badges handle delayed counts, updates, clearing, and replacement count nodes", () => {
  const badges = [];
  const observers = [];
  const createCount = (initialText) => {
    const count = {
      textContent: initialText,
      nextElementSibling: null,
      after(badge) {
        count.nextElementSibling = badge;
        badges.push(badge);
      },
    };
    return count;
  };
  let counts = [createCount("")];
  const sidebar = {
    querySelectorAll(selector) {
      return selector === ".unread-count" ? [...badges] : [...counts];
    },
  };
  const context = sourceContext("../src/js/modules/utils/watch/sidebar/unread-count.js", {
    document: {
      createElement() {
        const classes = new Set();
        const badge = {
          classes,
          classList: {
            contains: (name) => classes.has(name),
            toggle(name, on) {
              if (on) classes.add(name);
              else classes.delete(name);
            },
          },
          remove() {
            const index = badges.indexOf(badge);
            if (index !== -1) badges.splice(index, 1);
            if (badge.unreadCountSource.nextElementSibling === badge)
              badge.unreadCountSource.nextElementSibling = null;
          },
          textContent: "",
        };
        return badge;
      },
    },
    MutationObserver: class {
      constructor(callback) {
        observers.push(callback);
      }
      observe() {}
      disconnect() {}
    },
  });

  context.watchUnreadCounts(sidebar);
  context.watchUnreadCounts(sidebar);
  assert.equal(observers.length, 1);
  assert.equal(badges.length, 0);

  counts[0].textContent = "(1)";
  observers[0]();
  const badge = badges[0];
  assert.equal(badge.textContent, "1");
  assert.ok(badge.classes.has("hide-single-count"));

  counts[0].textContent = "(3)";
  observers[0]();
  assert.equal(badges.length, 1);
  assert.equal(badges[0], badge);
  assert.equal(badge.textContent, "3");
  assert.ok(!badge.classes.has("hide-single-count"));

  counts[0].textContent = "";
  observers[0]();
  assert.equal(badges.length, 0);

  counts[0].textContent = "(2)";
  observers[0]();
  assert.equal(badges[0].textContent, "2");

  counts = [createCount("(7)")];
  observers[0]();
  assert.equal(badges.length, 1);
  assert.equal(badges[0].textContent, "7");
  assert.equal(badges[0].unreadCountSource, counts[0]);
});

test("unread count watcher follows sidebar replacement", () => {
  const observers = [];
  const makeSidebar = () => ({
    badges: [],
    counts: [],
    querySelectorAll(selector) {
      return selector === ".unread-count" ? this.badges : this.counts;
    },
  });
  const context = sourceContext("../src/js/modules/utils/watch/sidebar/unread-count.js", {
    document: { createElement: () => ({ classList: { contains: () => false, toggle() {} }, remove() {} }) },
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {
        this.disconnected = true;
      }
    },
  });
  const first = makeSidebar();
  const second = makeSidebar();

  context.watchUnreadCounts(first);
  context.watchUnreadCounts(second);

  assert.equal(observers.length, 2);
  assert.equal(observers[0].disconnected, true);
});
