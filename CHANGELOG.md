# Changelog for Launch School UI Script

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-23-07

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
    - Button to toggle the Current Page Hotkeys/Settings menu visibility.
    - Breadcrumbs placed center in the header.
    - If the page has no breadcrumbs, the page title is place center in the header instead.
    - Moved the logged-out nav to the header for logged-out users.
  - Added a blue background flash to an already active tab/textarea that is activated again via a hotkey so you can quickly see where the active focus is.
  - Added an automatic textbox focus when a tab or editor is selected via button click or hotkey.
  - Added the ability to completely hide the sidebar from view.
  - Added a toaster that will display messages for different actions, such as activating the Copy Editor Code via hotkey.
  - Added automatic LSBot tab focus when a question box answer is submitted in the content panel.
  - Added automatic refocus of the LSBot prompt textarea after a prompt submission completes.
  - Added a container that displays the current page's hotkeys in the Settings Menu.
  - Added hotkeys:

    | Hotkey            | Function                                                                   |
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
    | `CMD + CTRL + ,`  | Toggle Current Page Hotkeys/Settings Menu visibility                       |
