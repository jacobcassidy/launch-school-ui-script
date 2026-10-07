import assert from "node:assert/strict";
import test from "node:test";
import { headerFixture as fixture } from "./header-fixture.js";

test("same-body navigation replaces native header elements and updates TOC state", () => {
  const f = fixture({
    loggedOut: false,
    pathname: "/books/first",
    breadcrumbs: true,
    sidebar: true,
    tabs: true,
    toc: true,
  });
  const menu = f.header.querySelector(".settings-container");
  const settingsToggle = f.header.querySelector(".btn--toggle-settings");
  menu.classList.add("active");
  menu.querySelector(".fixture-option").checked = true;
  f.header.classList.add("is-hidden");
  let settingsClicks = 0;
  settingsToggle.addEventListener("click", () => settingsClicks++);
  const native = f.render({
    loggedOut: false,
    pathname: "/books/second",
    breadcrumbs: true,
    sidebar: true,
    tabs: true,
    toc: true,
  });
  let tocClicks = 0;
  native.toc.addEventListener("click", () => tocClicks++);
  assert.equal(f.refresh(), f.header);
  assert.equal(f.header.querySelector(".gretel-breadcrumbs"), native.breadcrumbs);
  assert.equal(f.elements.native.tocButton, native.toc);
  assert.equal(f.header.querySelector(".toc-toggle-button"), native.toc);
  assert.ok(native.toc.classList.contains("btn--toggle-toc"));
  assert.ok(!native.toc.classList.contains(".btn--toggle-toc"));
  assert.equal(f.native.toc.isConnected, false);
  assert.equal(f.native.breadcrumbs.isConnected, false);
  assert.equal(f.header.querySelector(".settings-container"), menu);
  assert.ok(menu.classList.contains("active"));
  assert.ok(menu.querySelector(".fixture-option").checked);
  assert.ok(f.header.classList.contains("is-hidden"));
  assert.equal(f.header.querySelector(".btn--toggle-settings"), settingsToggle);
  settingsToggle.click();
  native.toc.click();
  assert.equal(settingsClicks, 1);
  assert.equal(tocClicks, 1);
});

test("leaving a book removes page controls and falls back to a plain title", () => {
  const f = fixture({
    loggedOut: false,
    pathname: "/books/first",
    breadcrumbs: true,
    sidebar: true,
    tabs: true,
    toc: true,
  });
  f.render({ loggedOut: false, pathname: "/public-page", documentTitle: "<b>Plain title</b>" });
  f.refresh();
  for (const selector of [
    ".gretel-breadcrumbs",
    ".toc-toggle-button",
    ".btn--toggle-tabs-panel",
    ".btn--toggle-sidebar",
  ]) {
    assert.equal(f.header.querySelector(selector), null);
  }
  assert.equal(f.elements.native.tocButton, null);
  const title = f.header.querySelector(".title-text");
  assert.equal(title.textContent, "<b>Plain title</b>");
  assert.equal(title.children.length, 0);
  f.render({
    loggedOut: false,
    pathname: "/public-page",
    documentTitle: "Launch School - an online school for Software Engineers",
  });
  f.refresh();
  assert.equal(f.header.querySelector(".title-text"), null);
});

test("retained pages reuse native controls and do not duplicate icons on refresh", () => {
  const f = fixture({
    loggedOut: false,
    pathname: "/books/first",
    breadcrumbs: true,
    sidebar: true,
    tabs: true,
    toc: true,
  });
  const before = f.header.querySelectorAll("*");
  f.refresh();
  f.refresh();
  assert.deepEqual(f.header.querySelectorAll("*"), before);
  assert.equal(f.document.querySelectorAll(".site-header").length, 1);
  assert.equal(f.native.toc.querySelectorAll("svg").length, 1);
});

test("same-URL native rendering discards moved elements whose source was removed", () => {
  const f = fixture({ loggedOut: false, pathname: "/books/first", breadcrumbs: true, toc: true });
  f.render({ loggedOut: false, pathname: "/books/first", documentTitle: "Updated page" });
  f.refresh();
  assert.equal(f.header.querySelector(".gretel-breadcrumbs"), null);
  assert.equal(f.header.querySelector(".toc-toggle-button"), null);
  assert.equal(f.elements.native.tocButton, null);
  assert.equal(f.header.querySelector(".title-text").textContent, "Updated page");
});

test("logged-out navigation persists across URL changes and is removed when a sidebar appears", () => {
  const f = fixture();
  f.window.location.pathname = "/another-public-page";
  f.refresh();
  assert.equal(f.header.querySelector(".logged-out-nav"), f.native.nav);
  assert.equal(f.header.querySelector(".title-text"), null);
  f.render({ loggedOut: false, sidebar: true, title: "Course" });
  f.refresh();
  assert.equal(f.header.querySelector(".logged-out-nav"), null);
  assert.equal(f.header.querySelectorAll(".btn--toggle-sidebar").length, 1);
  assert.equal(f.header.querySelector(".title-text").textContent, "Course");
});

test("course and document titles refresh without replacing their header element", () => {
  const f = fixture({ loggedOut: false, title: "Course" });
  const title = f.header.querySelector(".title-text");
  f.native.courseTitle.textContent = "Another course";
  f.refresh();
  assert.equal(f.header.querySelector(".title-text"), title);
  assert.equal(title.textContent, "Another course");
  f.render({ loggedOut: false, pathname: "/public-page", documentTitle: "Page title" });
  f.refresh();
  assert.equal(title.textContent, "Page title");
});

test("entering a book adds page controls in order and replaces the plain title", () => {
  const f = fixture({ loggedOut: false, pathname: "/public-page" });
  assert.ok(f.header.querySelector(".title-text"));
  const native = f.render({
    loggedOut: false,
    pathname: "/books/first",
    breadcrumbs: true,
    sidebar: true,
    tabs: true,
    toc: true,
  });
  f.refresh();
  assert.equal(f.header.querySelector(".title-text"), null);
  assert.equal(f.header.querySelector(".gretel-breadcrumbs"), native.breadcrumbs);
  assert.equal(f.header.querySelectorAll(".btn--toggle-sidebar").length, 1);
  const right = f.header.querySelector(".container-3");
  assert.deepEqual(right.children, [
    right.querySelector(".btn--toggle-tabs-panel"),
    native.toc,
    right.querySelector(".btn--toggle-settings"),
    right.querySelector(".settings-container"),
  ]);
});

test("a URL change invalidates page-specific elements even when their source remains connected", () => {
  const f = fixture({ loggedOut: false, pathname: "/books/first", breadcrumbs: true, toc: true });
  f.window.location.pathname = "/books/second";
  f.refresh();
  assert.equal(f.header.querySelector(".gretel-breadcrumbs"), null);
  assert.equal(f.header.querySelector(".toc-toggle-button"), null);
  assert.equal(f.elements.native.tocButton, null);
});
