/**
 * INJECT CSS STYLES INTO LS APP
 */
function injectStyles() {
  console.log("Running injectStyles()");

  const existingStyles = document.getElementById("tampermonkey-ui-styles");
  if (existingStyles) return;

  const style = document.createElement("style");
  style.setAttribute("id", "tampermonkey-ui-styles");

  style.textContent = `
:root {
  --background-color-001: var(--color-grayscale-098);
  --background-color-002: var(--color-grayscale-097);
  --background-color-003: var(--color-grayscale-095);
  --background-highlight-001: var(--color-brand-001-alpha);
  --border-color-001: var(--color-grayscale-095);
  --color-brand-001-alpha: #f2585833;
  --color-brand-001: #f25858;
  --color-brand-002: #d41010;
  --color-grayscale-035: oklch(35% 0 0deg);
  --color-grayscale-050: oklch(50% 0 0deg);
  --color-grayscale-071: oklch(71% 0 0deg);
  --color-grayscale-074: oklch(74% 0 0deg);
  --color-grayscale-095: oklch(95% 0 0deg);
  --color-grayscale-097: oklch(97% 0 0deg);
  --color-grayscale-098: oklch(98% 0 0deg);
  --color-grayscale-100: oklch(100% 0 0deg);
  --color-blue-092: oklch(92% 0.01 230deg);
  --color-blue-095: oklch(95% 0.01 230deg);
  --header-height: 2.5rem;
  --nav-drawer-width: 12.1875rem;
  --duration-long: 500ms;
  --duration-short: 200ms;
  --transition-long: all var(--duration-long) ease;
  --transition-short: all var(--duration-short) ease;
  --border-radius-001: 6px;
  --padding-inline-w900: calc(50% - 450px); /* Gives it a max-width of 900px) */
  --inline-spacing: 24px;

  @media (width < calc(1800px + 24px + 24px + 4px + 24px + 24px)) {
    --padding-inline-w900: var(--inline-spacing);
  }
}

/**
 * DEFAULTS
 */
body,
table {
  background: var(--background-color-001);
}

a,
button {
  transition: var(--transition-short);
}

input:where(:not([type="submit"])),
select,
textarea {
  background-color: var(--color-grayscale-100);
  border: 1px solid var(--border-color-001) !important;
  border-radius: var(--border-radius-001) !important;
  box-shadow: none !important;
  color: var(--color-grayscale-050) !important;
  min-block-size: 40px;
  padding: 12px 16px !important;
  font-size: 0.9375rem !important;

  &.highlight-active {
    animation: highlight-flash var(--duration-short);
  }

  &:focus {
    border-color: transparent !important;
    box-shadow: 0 0 0 3px var(--color-blue-092) !important;
  }
}

/**
 * SIDEBAR
 */
#navbar-collapsor:checked ~ .nav-drawer {
  inline-size: 0 !important;
}

#navbar-expand {
  display: none;
}

/**
 * HEADER
 */

/* Native App Header */
body:not(:has(.nav-drawer)) {
  #header {
    .show-for-large-up {
      block-size: 0;
    }
  }

  #landing-page-header {
    background-position: initial !important;
  }
}

/* Added Site Header */
.site-header {
  position: fixed;
  z-index: 200;
  inset-block-start: 0;
  inset-inline: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--inline-spacing);
  background: var(--background-color-002);
  border-block-end: 1px solid var(--border-color-001);
  block-size: var(--header-height);
  padding: 4px 12px;
  transition: var(--transition-long);

  body:has(.nav-drawer) & {
    padding-inline-start: var(--nav-drawer-width);
  }

  /* Logged out elements when no sidebar */
  body:not(:has(.nav-drawer)) & {
    .columns:has(#logo + .nav) {
      float: initial;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 !important;

      #logo {
        margin: 0 !important;

        .ir {
          margin: 0 !important;
        }
      }

      .nav {
        > ul {
          display: flex;
          align-items: center;
          gap: 24px;

          li {
            margin: 0 !important;

            &.has-dropdown {
              ul {
                margin: 0 !important;
              }

              &:hover ul,
              ul:hover {
                inset-block-start: var(--header-height) !important;
              }
            }
          }
        }
      }
    }
  }

  &.is-hidden {
    transform: translateY(-100%);
  }

  .container {
    display: flex;
    align-items: center;
    gap: 6px;
    max-inline-size: 100%;
    text-transform: capitalize;

    &.container-1,
    &.container-3 {
      min-inline-size: fit-content;
    }

    &.container-1 {
      justify-content: flex-start;

      &:has(.logged-out-nav) {
        flex-grow: 1;
      }

      .logged-out-nav {
        gap: var(--inline-spacing);
      }
    }

    &.container-2 {
      position: absolute;
      inset-inline-start: var(--header-container2-left-offset);
      justify-content: center;
      inline-size: calc(100% - var(--header-container2-left-offset) - var(--header-container2-right-offset));
      transition: var(--transition-long);

      body:has(#navbar-collapsor):not(:has(#navbar-collapsor:checked)) & {
        inset-inline-start: var(--header-container2-sidebar-left-offset);
        inline-size: calc(100% - var(--header-container2-sidebar-left-offset) - var(--header-container2-right-offset));
      }
    }

    &.container-3 {
      justify-content: flex-end;
    }
  }

  .gretel-breadcrumbs,
  .title-text {
    display: flex !important;
    align-items: center !important;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-grayscale-074);
    block-size: var(--header-height) !important;
    margin: 0 !important;
    padding: 2px 0 0 !important;
    font-family: AvenirNext, Avenir, myriad-pro, "myriad pro", "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .gretel-breadcrumbs {
    position: static !important;
    border-block-end: 1px solid var(--border-color-001) !important;

    :is(li, li a) {
      color: var(--color-grayscale-071) !important;
      white-space: nowrap;
    }

    li {
      a {
        &:hover {
          color: var(--color-brand-001) !important;
        }
      }

      &:last-child {
        padding-inline-end: 0;
      }
    }

    li.current {
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--color-grayscale-074) !important;
    }
  }

  body:has(#navbar-collapsor:checked) &,
  body:not(:has(.nav-drawer)) & {
    padding-inline-start: 12px !important;
  }

  body:not(:has(#navbar-collapsor:checked)) & {
    .btn--show-sidebar {
      display: none;
    }
  }
}

.site-header__button {
  cursor: pointer;
  position: static !important;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color-003) !important;
  border-radius: var(--border-radius-001) !important;
  color: var(--color-grayscale-050);
  block-size: 32px !important;
  inline-size: 32px !important;
  margin: 0;
  padding: 6px;

  &:hover {
    background-color: var(--color-brand-001) !important;
    color: var(--color-grayscale-100);
  }

  &.active {
    background-color: var(--color-brand-001-alpha) !important;
    color: var(--color-brand-002);
  }

  &.btn--show-sidebar {
    flex-direction: column;
    gap: 3px;

    .hamburger-line {
      background-color: var(--color-grayscale-050);
      block-size: 2px;
      inline-size: 16px;
      transition: var(--transition-short);
    }

    &:hover {
      .hamburger-line {
        background-color: var(--color-grayscale-100);
      }
    }
  }

  &.toc-toggle-button {
    &.open {
      background-color: var(--color-brand-001-alpha) !important;
      color: var(--color-brand-002) !important;
    }
  }
}

/**
 * EDITOR
 */
:is(.editor-panel, #tab-code-editor) {
  .editor-mode-bar {
    background-color: var(--background-color-001) !important;
    border-block-end: 1px solid var(--border-color-001) !important;
    block-size: var(--header-height) !important;
    inline-size: 100% !important;
    max-inline-size: 100% !important;
    margin: 0 !important;
    padding-inline: var(--padding-inline-w900) !important;
  }

  .tab-pane .CodeMirror {
    margin-inline-end: 16px;
  }

  :is(.code-editor-section, .editor-content-wrapper) {
    max-inline-size: 100% !important;
    padding-inline: var(--padding-inline-w900) !important;

    .code-editor-wrapper,
    .code-editor-wrapper .CodeMirror,
    .code-editor-wrapper .CodeMirror .CodeMirror-scroll,
    .CodeMirror-gutters {
      background-color: var(--background-color-002) !important;
    }

    .code-editor-wrapper {
      border: 1px solid var(--border-color-001);
      border-radius: var(--border-radius-001);
      margin-block-start: 24px;
      padding: 12px !important;

      .CodeMirror-activeline-background {
        background-color: var(--background-color-003) !important;

        .CodeMirror-focused & {
          background-color: var(--color-blue-095) !important;
        }
      }

      .CodeMirror-activeline {
        .highlight-active & {
          .CodeMirror-line {
            animation: highlight-flash 300ms;
          }
        }
      }

      .CodeMirror-lines,
      .CodeMirror-linenumber {
        padding: 0 !important;
      }

      .CodeMirror-gutters {
        border-color: var(--border-color-001);
        padding: 0;
      }
    }

    #btn-run-code {
      margin: 16px 0 24px auto !important;
    }
  }

  .output-section-fixed {
    align-self: center;
    border: none !important;
    inline-size: calc(100% - (var(--inline-spacing) * 2));
    max-inline-size: 900px;
    margin: 0 0 24px !important;

    #code-output-content {
      background-color: var(--background-color-001) !important;
    }
  }
}

/**
 * KEYFRAMES
 */
@keyframes highlight-flash {
  from {
    background-color: var(--background-highlight-001);
  }

  to {
    background-color: transparent;
  }
}

/**
 * LAYOUTS
 */
body:has(#assignment-repl-layout, #book-repl-layout, #book-exercise-repl-layout, #exercise-repl-layout) {
  :is(.assignment-repl-layout, .book-repl-layout, .book-exercise-repl-layout, .exercise-repl-layout) {
    inset-block-start: var(--header-height) !important;
    inset-inline-start: 0 !important;
    padding: 0 0 0 var(--nav-drawer-width) !important;
    transition: var(--transition-long);

    body:has(.nav-drawer) & {
      inset-block-start: var(--header-height) !important;
    }

    body:has(.site-header.is-hidden) & {
      inset-block-start: 0 !important;
    }

    body:has(#navbar-collapsor:checked) &,
    body:not(:has(.nav-drawer)) & {
      inset-inline-start: 0 !important;
      padding: 0 !important;
    }
  }

  /* Feedback textarea override */
  .wrapper #tab-feedback.tab-pane .feedback-form-inline form {
    textarea {
      border: 1px solid var(--border-color-001) !important;
      padding: 12px 16px !important;
      font-size: 0.9375rem !important;

      &:focus {
        border-color: transparent !important;
        box-shadow: 0 0 0 3px var(--color-blue-092) !important;
      }
    }
  }
}

/**
 * LSBOT
 */

:is(.conversation-area, .lsbot-input-area) {
  padding-inline: var(--padding-inline-w900) !important;
}

.conversation-area {
  body:has(#assignment-repl-layout, #book-repl-layout, #book-exercise-repl-layout, #exercise-repl-layout) & {
    :is(.assignment-repl-layout, .book-repl-layout, .book-exercise-repl-layout, .exercise-repl-layout) & {
      background: var(--background-color-001) !important;
      padding-block: 24px !important;
    }
  }

  /* Chat Bubbles */
  .message-content {
    .lsbot-message & {
      background: var(--color-blue-095) !important;
      border: none !important;
      padding: 12px 16px !important;
    }

    .lsbot-feedback-bar {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
    }

    .lsbot-feedback-context,
    .lsbot-feedback-btn,
    .timestamp {
      color: var(--color-grayscale-074) !important;
    }
  }

  /* Solution Box */
  .detected-solution-box {
    .detected-solution-code {
      pre {
        padding: 16px !important;

        code {
          margin-inline-start: 32px !important;
          padding: 0 !important;

          .line-numbers-rows {
            inset-inline-start: -48px !important;
            border-color: var(--border-color-001) !important;

            > span::before {
              color: var(--color-grayscale-074) !important;
            }
          }
        }
      }
    }
  }
}

.lsbot-input-area,
.lsbot-question-input {
  border-color: var(--border-color-001) !important;
}

.lsbot-input-area {
  margin: 0 !important;
  padding-block: 16px !important;
}

.lsbot-input-wrapper {
  .book-exercise-completion-status,
  .exercise-completion-status {
    position: static !important;
    color: var(--color-grayscale-074) !important;
    margin: -8px 0 8px !important;
    padding: 0 var(--padding-inline-w900) !important;

    i {
      color: var(--color-grayscale-074) !important;
    }
  }
}

/**
 * PANELS
 */

/* Resize handle between panels */
.resize-handle {
  pointer-events: none;
  display: block;
  background-color: var(--border-color-001) !important;
  inline-size: 4px !important;

  body:has(.tabs-panel.panel-collapsed) & {
    display: none;
  }
}

/* All Panels */
:is(.assignment-content-panel, .book-content-panel, .editor-panel, .instructions-panel, .tabs-panel) {
  background-color: var(--background-color-001) !important;
  padding: 0 !important;
}

/* Toggleable Panels */
:is(.assignment-content-panel, .book-content-panel, .tabs-panel) {
  &.halfWidth {
    flex-basis: calc(50% - 2px) !important;
  }
}

/* Non-toggleable Panels */
:is(.editor-panel, .instructions-panel) {
  flex-basis: calc(50% - 2px) !important;
}

/* Content Panels */
:is(.assignment-content-panel, .book-content-panel) {
  flex-basis: 100% !important;
  background: var(--background-color-001);
  border: none !important;
  padding: 0 !important;

  :is(.assignment-content-wrapper, .book-content-wrapper) {
    max-inline-size: 100% !important;
    margin: 0 !important;
    padding: 40px !important;

    > * {
      inline-size: 100% !important;
      max-inline-size: 780px !important;
      margin: 0 auto !important;
    }
  }
}

/* Panels with Tabs */
:is(.assignment-repl-tabs, .book-exercise-repl-tabs, .book-repl-tabs, .repl-tabs) {
  border: none !important;
  max-inline-size: initial !important;
}

/* Tabs Panel */
.tabs-panel {
  border: none !important;

  /* Toggleable Panel */
  &.panel-collapsed {
    flex-basis: 0 !important;
  }

  body:not(:has(.nav-drawer)) & {
    padding: 0 !important;
  }
}

/**
 * TAB NAV
 */
.tab-nav {
  align-items: center;
  gap: 0 !important;
  overflow: initial !important;
  background-color: var(--background-color-001) !important;
  border-color: var(--border-color-001) !important;
  border-block-end: 1px solid var(--border-color-001) !important;
  block-size: var(--header-height);
  margin: 0 !important;
  padding: 0 var(--padding-inline-w900) !important;

  @media (width < calc(1800px + 24px + 24px + 4px + 24px + 24px)) {
    padding-inline-start: 0 !important;
  }
}

/* Tab Button */
.tab-button {
  align-items: center !important;
  gap: 12px;
  transform: none !important;
  border: 1px solid transparent !important;
  border-radius: 0 !important;
  border-inline-end-color: var(--border-color-001) !important;
  color: var(--color-grayscale-074) !important;
  block-size: calc(100% + 1px) !important;
  margin: 0 0 -1px !important;
  padding: 2px var(--inline-spacing) 0 !important;
  font-weight: 700 !important;

  &:first-child {
    border-inline-start: 1px solid var(--border-color-001) !important;

    body:has(#assignment-repl-layout, #book-repl-layout, #book-exercise-repl-layout, #exercise-repl-layout) & {
      margin: 0 !important;
    }

    @media (width < calc(1800px + 24px + 24px + 4px + 24px + 24px)) {
      border-inline-start: none !important;
    }
  }

  i {
    padding-block-end: 2px;
    font-weight: 700 !important;
  }

  svg {
    path {
      transition: var(--transition-short);
    }
  }

  &:where(:not(.active)) {
    svg {
      path {
        fill: var(--color-grayscale-074) !important;
      }
    }

    &:hover {
      color: var(--color-brand-001) !important;

      svg {
        path {
          fill: var(--color-brand-001) !important;
        }
      }
    }
  }

  &.active {
    border-block-end-color: var(--background-color-001) !important;
    color: var(--color-grayscale-050) !important;
  }

  &:active {
    color: var(--color-brand-002) !important;

    svg {
      path {
        fill: var(--color-brand-002) !important;
      }
    }
  }

  &.highlight-active {
    animation: highlight-flash 300ms;
  }
}

/**
 * TAB CONTENT
 */
.tab-content {
  margin: 0 !important;
  padding: 0 !important;

  .tab-header {
    align-items: center;
    background-color: var(--background-color-001) !important;
    border-block-end: 1px solid var(--border-color-001) !important;
    block-size: var(--header-height);
    margin: 0 !important;
    padding-inline: var(--padding-inline-w900) !important;

    .tab-header-actions {
      gap: 8px !important;

      .lsbot-tab-button {
        padding: 0 !important;
      }
    }

    /* Overrides */
    body:has(#assignment-repl-layout) & {
      padding-inline-end: var(--padding-inline-w900) !important;
    }
  }

  /* Override */
  body:has(#book-repl-layout) & {
    margin-inline-end: 0 !important;
  }

  /* Tab content without a header */
  .tab-pane:not(:has(.tab-header), :has(.editor-mode-bar)) {
    padding: 24px var(--padding-inline-w900) !important;
  }

  /* Instructions Tab Action Buttons */
  #actions.gray-links {
    button,
    a {
      border: 1px solid var(--border-color-001);
    }
  }

  /* Community Tab */
  .community-solutions-section {
    background-color: var(--background-color-001) !important;
    border: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

/**
 * TOAST
 */
.toast-container {
  pointer-events: none; /* Doesn't block clicks */
  position: fixed;
  z-index: 99999;
  inset-block-start: 12px;
  inset-inline-end: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  transform: translateY(-10px);
  background: var(--color-grayscale-035);
  border-radius: var(--border-radius-001);
  color: #fff;
  opacity: 0;
  padding: 16px 20px;
  transition:
    opacity 500ms ease,
    transform 500ms ease;
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

/**
 * WRAPPER
 */
.wrapper {
  margin: 0 !important;
  padding: calc(var(--header-height) * 2) 0 0 var(--nav-drawer-width) !important;

  body:has(#navbar-collapsor:checked) &,
  body:not(:has(.nav-drawer)) & {
    padding-inline-start: 0 !important;
  }
}

body:not(:has(.assignment-repl-layout, .book-repl-layout)) {
  .wrapper {
    body:has(.site-header.is-hidden) & {
      inset-block-start: calc(var(--header-height) * -1) !important;
    }
  }
}

/**
 * BOOK PAGES
 */

/* Book cover page */
.books.show-page .large-11 {
  display: flex;
  align-items: center;
}

/* Book page header buttons */
.navigate-back,
.toc-button-text,
.toc-chevron {
  display: none;
}

/* Normal book page */
.books.read-page {
  #book-repl-layout {
    /* Table of Content */
    .toc-dropdown-container {
      inset-block-start: var(--header-height) !important;
      inset-inline: auto 356px !important;
    }
  }
}

/**
 * COURSES PAGE
 */
.nav-tabs.secondary-nav {
  margin: calc(var(--header-height) * -1) 0 var(--header-height) 0;
  padding-block-start: var(--header-height);
}
  `;

  document.head.appendChild(style);
}
