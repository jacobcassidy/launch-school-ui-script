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

function createPage(markup = "", platform = "MacIntel") {
  const window = new Window({ url: "https://launchschool.com/courses/test" });
  Object.defineProperty(window.navigator, "platform", { configurable: true, value: platform });
  window.document.body.innerHTML = markup;
  window.eval(integrationScript);
  return { window, document: window.document, api: window.integration };
}

for (const { name, platform, primary, actions, modifiers } of [
  {
    name: "macOS",
    platform: "MacIntel",
    primary: "⌘",
    actions: "⌘+⌃",
    modifiers: { metaKey: true, ctrlKey: true },
  },
  {
    name: "Windows",
    platform: "Win32",
    primary: "⌃",
    actions: "⌃+⎇",
    modifiers: { ctrlKey: true, altKey: true },
  },
]) {
  test(`button shortcut tooltips and settings keys match working actions on ${name}`, () => {
    const { window, document, api } = createPage(
      `
    <header class="site-header"></header>
    <nav class="nav-drawer"></nav>
    <button class="btn--toggle-sidebar" title="Toggle Sidebar Visibility"></button>
    <button class="btn--toggle-tabs-panel" title="Toggle Tabs Panel Visibility"></button>
    <button class="toc-toggle-button" title="Toggle Table of Contents Visibility"></button>
    <button class="btn--toggle-settings" title="Toggle Settings Visibility"></button>
    <div class="settings-container"></div><div class="tabs-panel"></div>
    <button class="btn-copy-code" title="Copy Editor Code"></button>
    <div class="instructions-panel"><div class="gray-links"><form><button type="submit">Mark complete</button></form></div></div>
    <a class="next-exercise">Go to the next exercise</a>
    <button id="lsbot-send-review">Submit Review</button>
    <div class="lsbot-input-area"><textarea class="lsbot-question-input"></textarea><button class="lsbot-submit-btn">Ask LSBot</button></div>
  `,
      platform,
    );
    const settingsButton = document.querySelector(".btn--toggle-settings");
    api.elements.native.sidebar = document.querySelector(".nav-drawer");
    api.elements.native.tabsPanel = document.querySelector(".tabs-panel");
    api.elements.native.tocButton = document.querySelector(".toc-toggle-button");
    api.elements.native.nextExerciseButton = document.querySelector(".next-exercise");
    api.elements.injected.sidebarToggleButton = document.querySelector(".btn--toggle-sidebar");
    api.elements.injected.tabsPanelToggleButton = document.querySelector(".btn--toggle-tabs-panel");
    api.elements.injected.settingsToggleButton = settingsButton;
    api.elements.injected.settingsMenu = document.querySelector(".settings-container");
    api.elements.injected.header = document.querySelector(".site-header");
    api.syncAvailableHotkeys();
    api.syncAvailableHotkeys();

    const expectedTitles = {
      ".btn--toggle-sidebar": `Toggle Sidebar Visibility (${primary}+B)`,
      ".btn--toggle-tabs-panel": `Toggle Tabs Panel Visibility (${primary}+⇧+2)`,
      ".toc-toggle-button": `Toggle Table of Contents Visibility (${actions}+T)`,
      ".btn--toggle-settings": `Toggle Settings Visibility (${actions}+,)`,
      ".btn-copy-code": `Copy Editor Code (${actions}+C)`,
      ".gray-links button": `Mark complete (${actions}+M)`,
      ".next-exercise": `Go to the next exercise (${actions}+N)`,
      "#lsbot-send-review": `Submit Review (${actions}+R)`,
      ".lsbot-submit-btn": "Ask LSBot (Enter)",
    };
    Object.entries(expectedTitles).forEach(([selector, title]) => {
      assert.equal(document.querySelector(selector).title, title);
    });

    api.injectHotkeysSection();
    const menuRows = [...document.querySelectorAll(".current-page-added-hotkeys-section .settings-list__item")];
    const menuKeys = (label) => {
      const row = menuRows.find((item) => item.querySelector(".hotkey-label").textContent === label);
      return [...row.querySelectorAll(".key")].map((key) => key.textContent).join("+");
    };
    assert.equal(menuKeys("Toggle Settings Visibility").toUpperCase(), `${actions}+,`);
    assert.equal(menuKeys("Toggle Header Visibility").toUpperCase(), `${primary}+⇧+1`);
    assert.equal(menuKeys("Toggle Sidebar Visibility").toUpperCase(), `${primary}+B`);
    assert.equal(menuKeys("Submit focused chat prompt"), "Enter");

    const settingsRow = menuRows.find(
      (item) => item.querySelector(".hotkey-label").textContent === "Toggle Settings Visibility",
    );
    assert.equal(settingsRow.querySelector(".hotkey-shortcut").getAttribute("role"), "img");
    assert.equal(
      settingsRow.querySelector(".hotkey-shortcut").getAttribute("aria-label"),
      platform === "MacIntel" ? "Cmd + Ctrl + ," : "Ctrl + Alt + ,",
    );

    const clone = settingsButton.cloneNode(true);
    settingsButton.replaceWith(clone);
    api.elements.injected.settingsToggleButton = clone;
    api.syncAvailableHotkeys();
    assert.equal(clone.title, expectedTitles[".btn--toggle-settings"]);
    clone.title = `Toggle Settings Visibility (${platform === "MacIntel" ? "CMD+CTRL" : "CTRL+ALT"}+,)`;
    api.syncAvailableHotkeys();
    assert.equal(clone.title, expectedTitles[".btn--toggle-settings"]);
    api.watchHotkeys();
    document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "Comma", ...modifiers }));
    assert.equal(api.elements.injected.settingsMenu.classList.contains("active"), true);

    clone.title = "Open settings";
    api.syncAvailableHotkeys();
    assert.equal(clone.title, `Open settings (${actions}+,)`);

    const panelModifiers = { [platform === "MacIntel" ? "metaKey" : "ctrlKey"]: true, shiftKey: true };
    document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "Digit2", ...panelModifiers }));
    assert.equal(api.elements.native.tabsPanel.classList.contains("panel-collapsed"), true);
    document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "Digit2", ...panelModifiers }));
    assert.equal(api.elements.native.tabsPanel.classList.contains("panel-collapsed"), false);

    const prompt = document.querySelector("textarea");
    let nativeKeydowns = 0;
    prompt.addEventListener("keydown", () => nativeKeydowns++);
    const sidebarKey = new window.KeyboardEvent("keydown", {
      code: "KeyB",
      [platform === "MacIntel" ? "metaKey" : "ctrlKey"]: true,
      bubbles: true,
      cancelable: true,
    });
    prompt.dispatchEvent(sidebarKey);
    assert.equal(sidebarKey.defaultPrevented, true);
    assert.equal(nativeKeydowns, 0);
    const copyKey = new window.KeyboardEvent("keydown", {
      code: "KeyC",
      [platform === "MacIntel" ? "metaKey" : "ctrlKey"]: true,
      bubbles: true,
      cancelable: true,
    });
    prompt.dispatchEvent(copyKey);
    assert.equal(copyKey.defaultPrevented, false);
    assert.equal(nativeKeydowns, 1);
    window.close();
  });

  test(`tab tooltips and keyboard targets follow tab visibility and order on ${name}`, async () => {
    const { window, document, api } = createPage(
      `
    <nav class="tab-nav">
      <button class="tab-button" data-tab="instructions">Instructions</button>
      <button class="tab-button" data-tab="code-editor">Scratchpad</button>
      <button class="tab-button" data-tab="feedback" style="display: none">Give Feedback</button>
    </nav><div id="tab-code-editor"></div>
  `,
      platform,
    );
    const navigation = document.querySelector(".tab-nav");
    const instructions = navigation.querySelector('[data-tab="instructions"]');
    const scratchpad = navigation.querySelector('[data-tab="code-editor"]');
    const feedback = navigation.querySelector('[data-tab="feedback"]');
    api.elements.native.tabNav = navigation;
    api.elements.native.scratchpad = document.querySelector("#tab-code-editor");
    api.updateTabButtons();
    api.syncAvailableHotkeys();
    api.watchTabBtns();
    api.watchHotkeys();
    assert.equal(document.querySelector(".tab-tooltip-instructions").textContent, `Instructions (${actions}+1)`);
    assert.equal(
      document.querySelector(".tab-tooltip-code-editor").textContent,
      `Scratchpad (${actions}+2 / ${actions}+E)`,
    );

    instructions.style.display = "none";
    feedback.style.display = "flex";
    await window.happyDOM.whenAsyncComplete();
    assert.equal(
      document.querySelector(".tab-tooltip-code-editor").textContent,
      `Scratchpad (${actions}+1 / ${actions}+E)`,
    );
    assert.equal(document.querySelector(".tab-tooltip-feedback").textContent, `Give Feedback (${actions}+2)`);
    assert.equal(document.querySelector(".tab-tooltip-instructions").textContent, "Instructions");

    navigation.prepend(feedback);
    await window.happyDOM.whenAsyncComplete();
    assert.equal(document.querySelector(".tab-tooltip-feedback").textContent, `Give Feedback (${actions}+1)`);
    assert.equal(
      document.querySelector(".tab-tooltip-code-editor").textContent,
      `Scratchpad (${actions}+2 / ${actions}+E)`,
    );
    assert.equal(scratchpad.getAttribute("aria-label"), "Scratchpad");
    assert.equal(feedback.getAttribute("aria-label"), "Give Feedback");

    let selectedTab = null;
    feedback.addEventListener("click", () => {
      selectedTab = feedback;
    });
    document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "Digit1", ...modifiers }));
    assert.equal(selectedTab, feedback);
    window.close();
  });
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

test("review shortcut submits without a review tab and uses the current enabled control", async () => {
  const { window, document, api } = createPage(`
    <button id="btn-book-lsbot-review">Review</button>
  `);
  api.syncAvailableHotkeys();
  let originalClicks = 0;
  document.querySelector("#btn-book-lsbot-review").addEventListener("click", () => originalClicks++);

  assert.doesNotThrow(() => api.hotkeys.cmdCtrl.KeyR.callback());
  const replacement = document.createElement("button");
  replacement.id = "btn-book-lsbot-review";
  let replacementClicks = 0;
  replacement.addEventListener("click", () => replacementClicks++);
  document.querySelector("#btn-book-lsbot-review").replaceWith(replacement);
  await new Promise((resolve) => window.setTimeout(resolve, 120));

  assert.equal(originalClicks, 0);
  assert.equal(replacementClicks, 1);

  api.hotkeys.cmdCtrl.KeyR.callback();
  window.history.replaceState({}, "", "/course_catalog");
  await new Promise((resolve) => window.setTimeout(resolve, 120));
  assert.equal(replacementClicks, 1);
  window.close();
});

test("dynamically added chat controls receive Enter shortcut registration and labels", async () => {
  const { window, document, api } = createPage(`
    <nav class="tab-nav"><button class="tab-button" data-tab="lsbot-help">LSBot</button></nav>
    <div class="settings-container"></div><div class="tab-content"></div>
  `);
  api.elements.native.tabNav = document.querySelector(".tab-nav");
  api.updateTabButtons();
  api.syncAvailableHotkeys();
  api.watchHotkeyElements();
  assert.equal(api.hotkeys.enterOnly.Enter, undefined);

  document.querySelector(".tab-content").innerHTML = `
    <div class="lsbot-input-area"><textarea class="lsbot-question-input"></textarea><button class="lsbot-submit-btn">Ask LSBot</button></div>
  `;
  await window.happyDOM.whenAsyncComplete();

  const submit = document.querySelector(".lsbot-submit-btn");
  assert.ok(api.hotkeys.enterOnly.Enter);
  assert.equal(submit.title, "Ask LSBot (Enter)");
  assert.ok(document.querySelector(".current-page-added-hotkeys-section"));

  submit.remove();
  await window.happyDOM.whenAsyncComplete();
  assert.equal(api.hotkeys.enterOnly.Enter, undefined);
  assert.equal(submit.hasAttribute("title"), false);
  window.close();
});

test("hidden headers leave the tab order and settings expose expanded state", () => {
  const { window, document, api } = createPage('<nav class="nav-drawer"></nav>');
  api.injectHeader();
  api.syncInjectedElementsState();
  api.watchSettingsToggleBtn();
  const header = document.querySelector(".site-header");
  const settingsButton = header.querySelector(".btn--toggle-settings");
  const settingsMenu = header.querySelector(".settings-container");

  assert.equal(settingsButton.getAttribute("aria-controls"), settingsMenu.id);
  assert.equal(settingsButton.getAttribute("aria-expanded"), "false");
  assert.equal(settingsMenu.inert, true);
  settingsButton.click();
  assert.equal(settingsButton.getAttribute("aria-expanded"), "true");
  assert.equal(settingsMenu.inert, false);
  assert.equal(settingsMenu.getAttribute("aria-hidden"), "false");
  settingsButton.click();
  assert.equal(settingsButton.getAttribute("aria-expanded"), "false");
  assert.equal(settingsMenu.inert, true);

  header.querySelector(".btn--toggle-sidebar").focus();
  api.elements.injected.header = header;
  api.syncAvailableHotkeys();
  api.watchHotkeys();
  document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "Digit1", metaKey: true, shiftKey: true }));
  assert.equal(header.inert, true);
  assert.equal(header.getAttribute("aria-hidden"), "true");
  assert.notEqual(document.activeElement, header.querySelector(".btn--toggle-sidebar"));
  document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "Digit1", metaKey: true, shiftKey: true }));
  assert.equal(header.inert, false);
  assert.equal(header.getAttribute("aria-hidden"), "false");
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

test("active sidebar tooltips reset in cached pages and work again after restore", () => {
  const { window, document, api } = createPage(`
    <input id="navbar-collapsor" type="checkbox" checked>
    <nav class="sidebar nav-drawer"><ul class="sidebar-lists">
      <li><a class="courses" data-tooltip="courses" aria-label="Courses" href="/courses">Courses</a></li>
    </ul></nav>
    <div class="sidebar-tooltip sidebar-tooltip-courses active"><span>Courses</span></div>
  `);
  api.injectHeader();
  document.dispatchEvent(new window.Event("turbo:before-cache"));
  assert.equal(document.querySelector(".sidebar-tooltip").classList.contains("active"), false);

  const cachedBody = document.body.cloneNode(true);
  document.body.replaceChildren(...cachedBody.childNodes);
  api.updateSidebar();
  api.watchSidebarLinks();
  const restoredTooltip = document.querySelector(".sidebar-tooltip-courses");
  assert.equal(restoredTooltip.classList.contains("active"), false);
  document.querySelector(".sidebar-lists a").dispatchEvent(new window.MouseEvent("mouseenter"));
  assert.equal(restoredTooltip.classList.contains("active"), true);
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

test("Back before a book snapshot preserves its TOC button and restores its shortcut on Forward", async () => {
  const { window, document, api } = createPage(`
    <main class="book-page">
      <div class="gretel-breadcrumbs">Python Introduction</div>
      <div class="toc-dropdown-container"><button class="toc-toggle-button">Contents</button></div>
    </main>
  `);
  const bookUrl = "/books/python/read/introduction";
  window.history.replaceState({}, "", bookUrl);
  const refresh = () => {
    api.syncNativeElementsState();
    api.injectHeader();
    api.syncInjectedElementsState();
    api.syncAvailableHotkeys();
  };
  api.setLoadUIHandler(refresh);
  api.watchForUrlChange();
  api.watchHotkeys();
  refresh();
  const originalButton = document.querySelector(".site-header .toc-toggle-button");
  assert.ok(originalButton);
  assert.ok(api.hotkeys.cmdCtrl.KeyT);

  // History changes before the native renderer snapshots the outgoing book.
  window.history.replaceState({}, "", "/course_catalog");
  window.dispatchEvent(new window.PopStateEvent("popstate"));
  await window.happyDOM.whenAsyncComplete();
  assert.equal(document.querySelector(".site-header .toc-toggle-button"), null);
  assert.equal(api.hotkeys.cmdCtrl.KeyT, undefined);
  document.dispatchEvent(new window.Event("turbo:before-cache"));
  const cachedBook = document.body.cloneNode(true);
  assert.ok(cachedBook.querySelector(".toc-dropdown-container .toc-toggle-button"));
  assert.ok(cachedBook.querySelector(".book-page .gretel-breadcrumbs"));
  assert.ok(originalButton.isConnected);

  document.body.innerHTML = "<main>Course catalog</main>";
  document.dispatchEvent(new window.Event("turbo:render"));
  await window.happyDOM.whenAsyncComplete();
  assert.equal(document.querySelector(".toc-toggle-button"), null);
  assert.equal(api.hotkeys.cmdCtrl.KeyT, undefined);

  // Forward restores cloned native markup; its native click handler is rebound.
  document.body.replaceWith(cachedBook);
  const restoredButton = document.querySelector(".toc-toggle-button");
  let tocClicks = 0;
  restoredButton.addEventListener("click", () => {
    tocClicks++;
    restoredButton.classList.toggle("open");
  });
  window.history.replaceState({}, "", bookUrl);
  window.dispatchEvent(new window.PopStateEvent("popstate"));
  document.dispatchEvent(new window.Event("turbo:render"));
  document.dispatchEvent(new window.Event("turbo:load"));
  await window.happyDOM.whenAsyncComplete();

  assert.equal(document.querySelector(".site-header .toc-toggle-button"), restoredButton);
  assert.equal(api.elements.native.tocButton, restoredButton);
  assert.equal(document.querySelectorAll(".toc-toggle-button").length, 1);
  assert.equal(restoredButton.title, "Toggle Table of Contents Visibility (⌘+⌃+T)");
  assert.ok(api.hotkeys.cmdCtrl.KeyT);
  document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyT", metaKey: true, ctrlKey: true }));
  assert.equal(tocClicks, 1);
  assert.equal(restoredButton.classList.contains("open"), true);
  restoredButton.click();
  assert.equal(tocClicks, 2);
  assert.equal(restoredButton.classList.contains("open"), false);
  window.close();
});

test("Command+B and the sidebar button both toggle the native sidebar", () => {
  const { window, document, api } = createPage(`
    <input id="navbar-collapsor" type="checkbox" checked>
    <nav class="nav-drawer"></nav>
    <button id="navbar-expand"></button>
    <button id="navbar-collapse"></button>
    <button class="btn--toggle-sidebar"></button>
  `);
  const sidebarCheckbox = document.querySelector("#navbar-collapsor");
  document.querySelector("#navbar-expand").addEventListener("click", () => {
    sidebarCheckbox.checked = false;
  });
  document.querySelector("#navbar-collapse").addEventListener("click", () => {
    sidebarCheckbox.checked = true;
  });
  api.elements.native.sidebar = document.querySelector(".nav-drawer");
  api.elements.injected.sidebarToggleButton = document.querySelector(".btn--toggle-sidebar");
  api.syncAvailableHotkeys();
  api.watchHotkeys();
  api.watchSidebarToggleBtn();

  const event = new window.KeyboardEvent("keydown", {
    key: "b",
    code: "KeyB",
    metaKey: true,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);

  assert.equal(sidebarCheckbox.checked, false);
  assert.equal(event.defaultPrevented, true);

  document.querySelector(".btn--toggle-sidebar").click();
  assert.equal(sidebarCheckbox.checked, true);
  window.close();
});
