import assert from "node:assert/strict";
import test from "node:test";
import * as esbuild from "esbuild";
import { Window } from "happy-dom";

const bundle = await esbuild.build({
  entryPoints: ["tests/dom-integration-entry.js"],
  bundle: true,
  write: false,
  format: "iife",
  loader: { ".svg": "text" },
});
const integrationScript = bundle.outputFiles[0].text;

function createPage(markup = "") {
  const window = new Window({ url: "https://launchschool.com/courses/test" });
  window.document.body.innerHTML = markup;
  window.eval(integrationScript);
  return { window, document: window.document, api: window.integration };
}

test("cloned settings controls bind even when the clone retains old data flags", () => {
  const { window, document, api } = createPage(`
    <button class="settings-toggle" data-settings-toggle-bound="true"></button>
    <div class="settings-menu"></div>
  `);
  const original = document.querySelector(".settings-toggle");
  const menu = document.querySelector(".settings-menu");
  api.elements.injected.settingsToggleButton = original;
  api.elements.injected.settingsMenu = menu;
  api.watchSettingsToggleBtn();

  const clone = original.cloneNode(true);
  original.replaceWith(clone);
  api.elements.injected.settingsToggleButton = clone;
  api.watchSettingsToggleBtn();
  clone.click();

  assert.equal(menu.classList.contains("active"), true);
  window.close();
});

test("cloned sidebar links retain working tooltips despite legacy binding flags", () => {
  const { window, document, api } = createPage(`
    <input id="navbar-collapsor" type="checkbox" checked>
    <nav class="sidebar nav-drawer"><ul class="sidebar-lists">
      <li><a class="courses" data-tooltip="courses" data-sidebar-link-bound="true" href="/courses">Courses</a></li>
    </ul></nav><div class="sidebar-tooltip-courses">Courses</div>
  `);
  const original = document.querySelector(".sidebar-lists a");
  const clone = original.cloneNode(true);
  original.replaceWith(clone);
  api.watchSidebarLinks();
  clone.dispatchEvent(new window.MouseEvent("mouseenter"));

  const tooltip = document.querySelector(".sidebar-tooltip-courses");
  assert.ok(tooltip);
  assert.equal(tooltip.classList.contains("active"), true);
  window.close();
});

test("initially focused prompts submit on Enter and refocus after re-enable", async () => {
  const { window, document, api } = createPage(`
    <div class="lsbot-input-area"><textarea class="lsbot-question-input"></textarea><button class="lsbot-submit-btn"></button></div>
  `);
  const prompt = document.querySelector("textarea");
  const submit = document.querySelector("button");
  let submissions = 0;
  submit.addEventListener("click", () => submissions++);
  prompt.focus();
  api.watchPromptFocus();
  prompt.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  assert.equal(submissions, 1);

  prompt.disabled = true;
  await window.happyDOM.whenAsyncComplete();
  prompt.disabled = false;
  await window.happyDOM.whenAsyncComplete();
  assert.equal(document.activeElement, prompt);
  window.close();
});

test("unread-count sync preserves adjacent native nodes through DOM mutations", async () => {
  const { window, document, api } = createPage(`
    <nav class="nav-drawer"><a><span class="messages_unread_count">(3)</span><strong class="native-sibling">Inbox</strong></a></nav>
  `);
  const sidebar = document.querySelector(".nav-drawer");
  api.watchUnreadCounts(sidebar);
  const source = document.querySelector('[class*="_unread_count"]');
  assert.equal(source.nextElementSibling.className, "unread-count");
  assert.equal(source.nextElementSibling.nextElementSibling.className, "native-sibling");

  const restoredSidebar = sidebar.cloneNode(true);
  sidebar.replaceWith(restoredSidebar);
  api.watchUnreadCounts(restoredSidebar);
  const restoredBadge = restoredSidebar.querySelector(".unread-count");
  assert.ok(restoredBadge);
  assert.equal(restoredBadge.textContent, "3");

  const restoredSource = restoredSidebar.querySelector('[class*="_unread_count"]');
  restoredSource.textContent = "(9)";
  await window.happyDOM.whenAsyncComplete();
  assert.equal(restoredSidebar.querySelector(".unread-count").textContent, "9");

  restoredSource.textContent = "";
  await window.happyDOM.whenAsyncComplete();
  assert.equal(restoredSidebar.querySelector(".native-sibling").textContent, "Inbox");
  assert.equal(restoredSidebar.querySelector(".unread-count"), null);
  window.close();
});

test("tab visibility updates rebind clones and remove tooltips for deleted tabs", async () => {
  const { window, document, api } = createPage(`
    <nav class="tab-nav"><button class="tab-button" data-tab="instructions" title="Instructions">Instructions</button></nav>
  `);
  const tab = document.querySelector(".tab-button");
  api.updateTabButtons();
  api.watchTabBtns();
  tab.dispatchEvent(new window.MouseEvent("mouseenter"));
  assert.equal(document.querySelector(".tab-tooltip").classList.contains("active"), true);

  const clone = tab.cloneNode(true);
  tab.replaceWith(clone);
  clone.classList.add("is-hidden");
  api.watchTabBtns();
  clone.style.display = "block";
  await window.happyDOM.whenAsyncComplete();
  assert.equal(clone.classList.contains("is-hidden"), false);
  clone.dispatchEvent(new window.MouseEvent("mouseenter"));
  assert.equal(document.querySelector(".tab-tooltip").classList.contains("active"), true);

  clone.remove();
  api.updateTabButtons();
  assert.equal(document.querySelector(".tab-tooltip"), null);
  window.close();
});

test("Turbo cache event restores native controls and removes injected header", async () => {
  const { window, document, api } = createPage(`
    <nav class="nav-drawer"></nav>
    <div class="gretel-breadcrumbs">Native breadcrumbs</div>
    <button class="toc-toggle-button">Contents</button>
  `);
  api.injectHeader();
  assert.ok(document.querySelector(".site-header .gretel-breadcrumbs"));
  document.dispatchEvent(new window.Event("turbo:before-cache"));
  await window.happyDOM.whenAsyncComplete();

  assert.equal(document.querySelector(".site-header"), null);
  assert.equal(document.querySelector("body > .gretel-breadcrumbs")?.textContent, "Native breadcrumbs");
  assert.equal(document.querySelector("body > .toc-toggle-button")?.textContent.trim(), "Contents");
  window.close();
});
