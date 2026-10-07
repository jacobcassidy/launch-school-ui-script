import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("sidebar link watcher tolerates missing Pages controls and binds them when they appear", () => {
  let pagesLink = null;
  let pagesDropdown = null;
  let pagesClicks = 0;
  let headerClicks = 0;
  const sidebar = { dataset: {} };
  const headerButton = {
    dataset: {},
    addEventListener(event) {
      assert.equal(event, "click");
      headerClicks++;
    },
    classList: { toggle() {} },
  };
  const context = sourceContext("../src/js/modules/utils/watch/events/sidebar-links.js", {
    document: {
      querySelector(selector) {
        if (selector === ".sidebar.nav-drawer") return sidebar;
        if (selector === ".sidebar-list__item .pages") return pagesLink;
        if (selector === ".sidebar-list__item .pages + .dropdown") return pagesDropdown;
        return null;
      },
      querySelectorAll(selector) {
        if (selector === ".sidebar-list-toggle-btn") return [headerButton];
        return [];
      },
    },
  });

  assert.doesNotThrow(() => context.watchSidebarLinks());
  context.watchSidebarLinks();
  assert.equal(headerClicks, 1);

  pagesDropdown = { classList: { toggle() {} } };
  pagesLink = {
    dataset: {},
    addEventListener(event, callback) {
      assert.equal(event, "click");
      this.callback = callback;
      pagesClicks++;
    },
  };
  context.watchSidebarLinks();
  context.watchSidebarLinks();
  assert.equal(pagesClicks, 1);
  assert.equal(pagesLink.dataset.pagesDropdownEventBound, undefined);
  assert.equal(typeof pagesLink.callback, "function");

  pagesLink = {
    dataset: { pagesDropdownEventBound: "true" },
    addEventListener() {
      pagesClicks++;
    },
  };
  context.watchSidebarLinks();
  context.watchSidebarLinks();
  assert.equal(pagesClicks, 2);
});
