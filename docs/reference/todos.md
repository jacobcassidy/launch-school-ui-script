# TODOS

- [x] Set native elements
  - contentPanel
  - instructionsPanel
  - scrollContainer
  - sidebar
  - tabsPanel

- [] Check if opening the Tabs Panel LSBot or Submit Review tab activates the sync? in devTool Network from my hotkeys or activateTab() function.

- [] Set isSidebarOpen and isTabsPanelOpen when changed

- [x] Set header element (done after header appended in header.js)
- [] Set sidebarShowButton element ?
- [] Set tabsPanelToggleButton element ?

- [] Finish ESM refactor

## HELPERS

- [x] activate.js
- [x] flash.js
- [x] focus.js
- [x] get.js
- [x] hide.js
- [] load.js
- [x] log.js
- [x] native.js
- [x] set.js
- [x] show.js
- [x] state.js
- [x] style.js
- [] toggle.js
- [] watch.js

## MAIN

- [] header.js
- [x] hotkeys.js
- [] settings.js
- [x] toaster.js

## Header states

// .is-top
// .is-top .is-pinned
// .is-top .is-unpinned

// NEEDED STATES
// Override state/class: .is-hidden (header is always hidden by default, but can be toggle on with .is-pinned - set via settings)

// Top state/class:
// - .is-top or .is-top.is-pinned (show)
// - .is-top.is-hidden-default or .is-top.is-unpinned (hide) [don't add .is-unpinned if .is-hidden-default exists]

// Scroll state/class:
// - .is-hidden-default or .is-unpinned {hide} [don't add .is-unpinned if .is-hidden-default exists]
// - .is-pinned or .is-hidden-default.is-pinned (show)

// Scroll to Top State/class:
// - Remove .is-unpinned if it exists
// - Add .is-top

// Top to Scroll state/class:
// - Remove .is-top if it exists

// HEADER VISIBILITY (add setting to always hide)
// - Exercise Page
// - Book Page
// - Assignment Page
// - Other Pages

## Header Status

.is-top .hidden-default (hide)
.is-top .hidden-default .is-pinned (show)
.is-top .hidden-default .is-unpinned (hide)

.is-top (show)
.is-top .is-pinned (show)
.is-top .is-unpinned (hide)

empty (hide)
.is-pinned (show)
.is-unpinned (hide)
