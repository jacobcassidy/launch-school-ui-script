# Changelog for Launch School UX Kit

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.2] - 2026-10-08

### Fixed

- Fixed custom button icons disappearing when the page resets their contents.
- Fixed unread count badges becoming stale when the sidebar is replaced.
- Fixed question-box controls inserted after initialization not handling submissions.
- Preserved native labels and content for unrecognized tab types.
- Kept userscript watch mode current after atomic metadata file replacements.
- Refreshed the UI after query-only navigation.
- Removed stale sidebar tooltips after sidebar replacement.
- Fixed the next pagination selector.

### Removed

- Removed unused sidebar and native DOM state and an unused sidebar icon.

## [1.8.1] - 2026-09-22 (Codex Fixes Edition)

### Fixed

- Fixed logged-out header navigation being moved before the header was attached to the document.
- Fixed initialization when the userscript runs after the document has already loaded.
- Fixed page navigation waiting for the body element to be replaced before reloading the UI.
- Fixed missing exercise completion forms aborting UI initialization.
- Fixed duplicate completion observers, shortcut sections, and tab tooltips during repeated UI loads.
- Fixed sidebar settings throwing errors when no sidebar exists.
- Fixed stale next-exercise state after navigating away from an exercise.
- Fixed sidebar toggling using stale collapsed state after navigation.
- Fixed tab shortcuts beyond the fifth tab and prevented Cmd+B from being intercepted without a sidebar.
- Fixed the Enter shortcut listing for question-box answer inputs.
- Fixed unread sidebar badges becoming stale or disappearing when counts load later.
- Fixed LSBot response handling stealing focus from another control.
- Fixed question-box Enter handling interrupting IME text composition.
- Fixed header titles being interpreted as HTML.
- Fixed button border colors using undefined CSS variables.

### Removed

- Removed chat-input keystroke debug logging.

### Updated

- Updated development package versions.

## [1.8.0] - 2026-09-22

### Added

- Added back function to move logged-out nav to `.site-header`.
- Added `Enter` shortcut note to README.md.

### Fixed

- Fixed broken script when not logged-in (for non-existent sidebar).

### Removed

- Removed unused `ui` import.

### Updated

- Updated node module package versions in `package.json`.
- Updated deprecated eslint.config.js import.

## [1.7.0] - 2026-09-14

### Added

- Added `#btn-book-lsbot-review` to "Submit Review" shortcut selectors.
- Added `enterOnly` shortcut for chat prompt submissions.
- Added a Lucide SVG icon to replace the search icon on the forum page.
- Added an SVG loader to the esbuild script so it can be inline CSS SVG assets.
- Added pagination button styles to match the LS UX Kit theme.

### Changed

- Changed breadcrumbs style so the current page is darker, not lighter, than the other parts of the breadcrumbs.
- Updated the active/focus button styles.

### Fixed

- Fixed the left offset position for standalone book exercises.

## [1.6.0] - 2026-09-04

### Added

- Added `watchForNewCopyMarkupBtns()` to add style classes to copy markup buttons in .tab-content when new buttons are added during chats.

### Changed

- Changed `init()` to fire on `load` instead of `DOMContentLoaded`.
- Fine-tuned README content and fixed typos.
- Fixed "Give Feedback" button styles.
- Updated .resize-handle from 2px to 3px.
- Updated bookshelf and book cover pages to improve layout.
- Updated global side padding sizes
- Updated transitions for less UI movement during init load.

## [1.5.0] - 2026-08-25

### Added

- Added `text` component stylesheet
- Added header to search.css file.
- Added v1.5.0 reference screenshots.

### Changed

- Fixed minimal-ui top border not showing correctly on some panel views.
- Fixed sidebar curren link padding offset to account for the active left 3px border
- Fixed unread count for sidebar items with counts greater than 2 characters.
- Refactored table and code CSS styles.
- Updated README.md content for version 1.5.0.

### Removed

- Removed deprecated `injectContainerStyleOffsets()` and `moveLoggedOutNavToHeader()` functions.

## [1.4.0] - 2026-08-22

### Added

- Added `.button` to the button style group for style consistency.
- Added the `CONTRIBUTIONS.md` file.
- Added top border to page in minimal-ui (such as Safari PWA) since those browsers have no border between the title bar and page.

### Changed

- Changed the project name from "Launch School UI Script" to "Launch School UX Kit".
- Fixed the LSBot content colors for consistency between all elements.
- Fixed the default `p` and `li` styles.
- Fixed the forum search input icon by giving its padding back that was overridden by the default input padding.
- Hid the sidebar events count if the count is "1" since it never seems to go away (counts now only show at 2 or more).
- Updated the .alert-box color and padding.
- Updated the hover color of assessment links in courses page tables to use the brand color.

## [1.3.0] - 2026-08-15

### Added

- Added `.active` table style for "In Progress" course.
- Added `.completed` table style for completed courses.
- Added additional button styles for matching theme.
- Added a top border to the header and sidebar when using a minimal-ui app such as a Safari PWA.
- Added course page title to header.
- Added new icons for additional buttons.

### Changed

- Adjusted courses table td widths to keep all cells using a single line of content.
- Refactored functions to use modules for better organization.
- Refactored styles to make theme more streamlined.

## [1.2.0] - 2026-08-08

### Added

- Added back styling to sidebar's current page item with `syncActiveSidebarItem()`.

### Changed

- Fixed missing copy code icons.
- Fixed missing sidebar page icons.
- Refactored CSS variables for a more consistent design system.
- Refactored the `createNewSettingsSection()` function to remove unneeded elements.
- Replaced sidebar "Pages" link with a button element.
- Fixed typos in README.md.

## [1.1.0] - 2026-08-05

### Added

- Added setting toggler component
- Added settings menu with two new settings: Sidebar Shrink (instead of hide), and Sidebar Hidden Headers.
- Completely redesigned the sidebar layout, including item orders.

### Changed

- Replaced font icons with [Lucide](https://lucide.dev) SVG icons throughout the UI (including the sidebar, header, tabs, and panels)
- Refactored the CSS variables
- Updated the tabs to now be icon only (using Lucide icons) with an instant tooltip displaying the tab title.
- Changed resize-handle border from 4px to 2px
- Reduced the header button size from 32px to 28px
- Fixed an issue with the header.txt causing a watch build loop
- Reorganized all files
- Updated the colorLog styles with oklch colors
- Replaced the Shortcuts menu and toggle button with a Settings menu and toggle button. The shortcuts menu remains inside the settings menu.
- Updated the shortcuts with new bindings
- Refactored icons element creation functions

## [1.0.0] - 2026-07-23

### Added

- Added modified UI design styles in `src/css/**`.
- Added svg image files for the new header buttons in `src/svg/*`.
- Added `.gitignore` to ignore `node_modules`.
- Added the following formatting and linting config files:
  - `.editorconfig`
  - `.markdownlint-cli2.jsonc`
  - `eslint.config.js`
  - `lefthook.yml`
  - `prettier.config.js`
  - `stylelint.config.js`
  - `vscode/extensions.json`
  - `vscode/settings.json`
- Added the following script build/watch files:
  - `esbuild.config.js`
  - `package-lock.json`
  - `package.json`
- Added `docs/references/dev/bugs.md` with known bugs.
- Added `docs/references/dev/color-lightness-levels.md` as a reference for CSS variable color creation.
- Added distribution userscript at `dist/js/index.min.js`.
- Added `README.md` with an description, index, features list, screenshots, quickstart guide, notes, and issues section.
- Added `CHANGELOG.md` with v1.0.0 notes.
- Added the following features (from files in `src/js/**`):
  - A new page header with the following:
    - Button to show the Sidebar.
    - Button to toggle a book's Table of Contents menu visibility.
    - Button to toggle the Tabs Panel visibility,
    - Button to toggle the Current Page Shortcuts/Settings menu visibility.
    - Breadcrumbs placed center in the header.
    - If the page has no breadcrumbs, the page title is place center in the header instead.
    - Moved the logged-out nav to the header for logged-out users.
  - Added a blue background flash to an already active tab/textarea that is activated again via a shortcut so you can quickly see where the active focus is.
  - Added an automatic textbox focus when a tab or editor is selected via button click or shortcut.
  - Added the ability to completely hide the sidebar from view.
  - Added a toaster that will display messages for different actions, such as activating the Copy Editor Code via shortcut.
  - Added automatic LSBot tab focus when a question box answer is submitted in the content panel.
  - Added automatic refocus of the LSBot prompt textarea after a prompt submission completes.
  - Added a container that displays the current page's shortcuts in the Settings Menu.
  - Added shortcuts:

    | Shortcut          | Function                                                                   |
    | ----------------- | -------------------------------------------------------------------------- |
    | `CMD + SHIFT + 1` | Toggle Header visibility                                                   |
    | `CMD + SHIFT + 2` | Toggle Tabs Panel visibility _(only active on pages with a Tabs Panel)_    |
    | `CMD + SHIFT + E` | Focus Editor/Scratchpad                                                    |
    | `CMD + CTRL + #`  | Select tab by number order (such as 1 for the "Ask LSBot" tab)             |
    | `CMD + CTRL + B`  | Toggle Sidebar visibility                                                  |
    | `CMD + CTRL + C`  | Copy Editor/Scratchpad Code                                                |
    | `CMD + CTRL + E`  | Focus Editor/Scratchpad                                                    |
    | `CMD + CTRL + M`  | Toggle the "Mark exercise complete/incomplete" _(active on exercise page)_ |
    | `CMD + CTRL + N`  | Go to next exercise _(active on exercise page)_                            |
    | `CMD + CTRL + R`  | Submit review to LSBot _(active on exercise page)_                         |
    | `CMD + CTRL + T`  | Toggle Table of Contents Menu visibility _(active on book page)_           |
    | `CMD + CTRL + ,`  | Toggle Current Page Shortcuts/Settings Menu visibility                     |
