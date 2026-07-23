# Launch School UI Script

An unofficial script for modifying the LaunchSchool.com UI for a cleaner, minimal design with added hotkeys for toggling tabs, panels, menus, and the sidebar.

| Index                                 |
| ------------------------------------- |
| [Features](#features)                 |
| [Screenshots](#screenshots)           |
| [Quickstart Guide](#quickstart-guide) |
| [Notes](#notes)                       |
| [Issues?](#issues)                    |

## Features

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

## Screenshots

**With all panels showing on a book page - Header, Sidebar, Content, and Tabs Panel:**
![All Panels Open](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/01-sidebar-header-sidepanel.png)

**With Sidebar closed:**
![Sidebar Closed](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/02-header-sidepanel.png)

**With Header and Sidebar closed:**
![Header and Sidebar Closed](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/03-sidepanel.png)

**Scratchpad Tab open:**
![Scratchpad Tab Open](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/04-sidepanel-scratchpad.png)

**With Header, Sidebar, and Tabs Panel closed (only content visible):**
![Header, Sidebar, and Tabs Panel Closed](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/05-content.png)

**Header open:**
![Header Open](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/06-header-content.png)

**Table of Contents Menu:**
![Table of Contents Menu](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/07-header-tocmenu.png)

**Hotkeys Menu:**
![Hotkeys Menu](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/08-header-hotkeysmenu.png)

## Quickstart Guide

1. Install the [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) extension (or an equivalent extension).
2. Open the Tampermonkey extension dashboard.
3. Click on the dashboard's `+` tab to create a new script.
4. Copy the code from [/dist/js/index.min.js](https://github.com/jacobcassidy/launch-school-ui-script/blob/main/dist/js/index.min.js) then paste it into the Tampermonkey editor and save it (`CMD + S`).
5. Go to [launchschool.com](https://launchschoo.com) or refresh the page if you're already there and the script should now be active (if not, check your Tampermonkey extension settings to make sure it's active on launchschool.com).

## Notes

- If you want the clean look from the screenshots (no URL bar, tabs, browser nav, etc), do the following:
  1. Open launchschool.com in the Safari browser.
  2. Select `File > Add to Dock...`
  3. Make the title "Launch School" and click "Add".
  4. Open the new Launch School app you just created.
  5. In the menubar, click `Launch School > Settings` or use the `CMD + ,` settings hotkey.
  6. In the Settings "General" tab, deselect "Show navigation controls".
  7. In the Settings "Extensions" tab, click "Browse Extensions" and install "Tampermonkey" (or an equivalent extension).
  8. Then follow the [Quickstart Guide](#quickstart-guide) above to complete the setup.

- This script was developed for macOS. Windows/Linux have not been tested, though you may fork and modify the script however you'd like for your OS.
- This script is only for desktop views. It will break the UI on screen sizes narrower than 1025px wide.
- You can toggle the userscript off at anytime and reload the page to get the original official UI back.
- This script modifies the existing DOM of launchschool.com. If the launchschool.com DOM changes in the future, this script may cease to function. If that happens, please [report the issue](https://github.com/jacobcassidy/launch-school-ui-script/issues).

## Issues?

If you come across any issues, please feel free to [report them here](https://github.com/jacobcassidy/launch-school-ui-script/issues). You are also welcome to [create a pull request](https://github.com/jacobcassidy/launch-school-ui-script/pulls). If your PR code is AI generated, please fully review the code and mention you have done so, otherwise it may be automatically closed without being reviewed/merged.
