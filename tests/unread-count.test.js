import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("unread badge handles delayed counts, updates, clearing, and single-count styling", () => {
  const badges = [];
  const observers = [];
  const count = { textContent: "", after: (badge) => badges.push(badge) };
  const context = sourceContext("../src/js/modules/utils/watch/sidebar/unread-count.js", {
    document: {
      querySelectorAll: () => [count],
      createElement() {
        const classes = new Set();
        const badge = {
          classes,
          classList: {
            toggle(name, on) {
              if (on) classes.add(name);
              else classes.delete(name);
            },
          },
          remove() {
            badges.splice(badges.indexOf(badge), 1);
          },
        };
        return badge;
      },
    },
    MutationObserver: class {
      constructor(callback) {
        observers.push(callback);
      }
      observe() {}
    },
    setTimeout() {
      assert.fail("Unread counts must not expire on a timer");
    },
  });
  context.watchUnreadCounts();
  context.watchUnreadCounts();
  assert.equal(observers.length, 1);
  assert.equal(badges.length, 0);
  count.textContent = "(1)";
  observers[0]();
  const badge = badges[0];
  assert.equal(badge.textContent, "1");
  assert.ok(badge.classes.has("hide-single-count"));
  count.textContent = "(3)";
  observers[0]();
  assert.equal(badges.length, 1);
  assert.equal(badges[0], badge);
  assert.equal(badge.textContent, "3");
  assert.ok(!badge.classes.has("hide-single-count"));
  count.textContent = "";
  observers[0]();
  assert.equal(badges.length, 0);
  count.textContent = "(2)";
  observers[0]();
  assert.equal(badges[0].textContent, "2");
});
