# Launch School UX Kit

An unofficial UX kit that modifies the LaunchSchool.com UI with a minimal design and added hotkeys for productivity (hotkeys that toggle the header, menus, sidebar, tabs, and more).

| Index                                 |
| ------------------------------------- |
| [Screenshots](#screenshots)           |
| [Quickstart Guide](#quickstart-guide) |
| [UX Kit Features](#ux-kit-features)   |
| [Notes](#notes)                       |
| [Issues?](#issues)                    |

## Screenshots

**With all panels showing on a book page:**
![All Panels Open](https://raw.githubusercontent.com/jacobcassidy/launch-school-ux-kit/refs/heads/main/docs/reference/screenshots/v1.5.0/01-full-ui.png)

**With the Sidebar panel shrunk:**
![Sidebar Shrunk](https://raw.githubusercontent.com/jacobcassidy/launch-school-ux-kit/refs/heads/main/docs/reference/screenshots/v1.5.0/02-sidebar-shrunk.png)

**With the Sidebar panel hidden:**
![Sidebar Hidden](https://raw.githubusercontent.com/jacobcassidy/launch-school-ux-kit/refs/heads/main/docs/reference/screenshots/v1.5.0/03-sidebar-hidden.png)

**With the Header panel hidden:**
![Header Hidden](https://raw.githubusercontent.com/jacobcassidy/launch-school-ux-kit/refs/heads/main/docs/reference/screenshots/v1.5.0/04-header-hidden.png)

**With the Header, Sidebar, and Tabs panels hidden (only content visible for no distractions):**
![Content Only](https://raw.githubusercontent.com/jacobcassidy/launch-school-ux-kit/refs/heads/main/docs/reference/screenshots/v1.5.0/05-content-only.png)

**With Table of Contents menu open:**
![Table of Contents Menu](https://raw.githubusercontent.com/jacobcassidy/launch-school-ux-kit/refs/heads/main/docs/reference/screenshots/v1.5.0/06-toc-menu.png)

**With Settings menu open:**
![Settings Menu](https://raw.githubusercontent.com/jacobcassidy/launch-school-ux-kit/refs/heads/main/docs/reference/screenshots/v1.5.0/07-settings-menu.png)

## Quickstart Guide

1. Install the [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) browser extension (or an equivalent extension).
2. Open the Tampermonkey extension's dashboard.
3. Click on the dashboard's `+` tab to create a new script.
4. Copy the code from [/dist/js/index.min.js](https://github.com/jacobcassidy/launch-school-ux-kit/blob/main/dist/js/index.min.js), then paste it into the Tampermonkey editor and save it (`CMD + S`).
5. Go to [launchschool.com](https://launchschool.com) or refresh the page if you're already there and the script should now be active (if not, check your Tampermonkey extension settings to make sure it's active on launchschool.com).

> [!TIP]
> If you want the clean look from the screenshots (no URL bar, tabs, browser nav, etc), do the following:
>
> 1. Open launchschool.com in the Safari browser.
> 2. Select `File > Add to Dock...`
> 3. Make the title "Launch School" and click "Add".
> 4. Open the new Launch School Safari app you just created.
> 5. Open settings (in the menubar, click `Launch School > Settings` or use the `CMD + ,` hotkey).
> 6. In the Setting's "General" tab, deselect "Show navigation controls".
> 7. In the Setting's "Extensions" tab, click "Browse Extensions" and install "Tampermonkey" (or an equivalent extension).
> 8. Then follow the rest of the [Quickstart Guide](#quickstart-guide) above to complete the setup.

## UX Kit Features

- Refines the UI for a more minimal style, especially when closing panels such as the sidebar or tabs panel.
- Adds a toggleable page header panel with the page's breadcrumbs/title and buttons to control the visibility of other panels (settings, sidebar, tabs, and table of contents).
- Adds hotkeys to toggle the visibility of all toggleable panels (header, menus, sidebar, and tabs), so you can display only want you need for minimizing distractions.
- Refines the sidebar UX with muted colors and reorganized link groups (with heading labels) and a more minimal sidebar when shrunken.
- Adds a Settings menu panel the includes the ability to completely hide the sidebar, show/hide the sidebar group titles, and see the current page's hotkeys.
- Adds a toaster component which displays messages for different actions, such as activating the Copy Editor Code hotkey.
- Focuses/refocuses the LSBot prompt textarea when a prompt submission completes (including from a question box in the content panel).
- Automatically focuses the textarea of a selected panel (such as the LSBot tab).
- Adds a blue background flash to an already active tab/textarea that is activated again via a hotkey so you can quickly see where the active focus is.

- Added hotkeys:

  | Hotkey            | Function                                                                   |
  | ----------------- | -------------------------------------------------------------------------- |
  | `Enter`           | Submit focused chat prompt                                                 |
  | `CMD + B`         | Toggles Sidebar visibility                                                 |
  | `CMD + Shift + 1` | Toggles Header visibility                                                  |
  | `CMD + Shift + 2` | Toggle Tabs Panel visibility                                               |
  | `CMD + CTRL + #`  | Select tab by number order (such as 1 for the "Ask LSBot" tab)             |
  | `CMD + CTRL + C`  | Copy Editor/Scratchpad Code                                                |
  | `CMD + CTRL + E`  | Focus Editor/Scratchpad                                                    |
  | `CMD + CTRL + M`  | Toggle the "Mark exercise complete/incomplete" _(active on exercise page)_ |
  | `CMD + CTRL + N`  | Go to next exercise _(active on exercise page)_                            |
  | `CMD + CTRL + R`  | Submit review to LSBot _(active on exercise page)_                         |
  | `CMD + CTRL + T`  | Toggle Table of Contents visibility _(active on book page)_                |
  | `CMD + CTRL + ,`  | Toggle Settings visibility (include Current Page Hotkeys)                  |

## Notes

- This kit was developed for macOS. Windows/Linux have not been tested. You may fork and modify this kit however you'd like for your OS.
- This kit only works for desktop views. The UI will break on screen sizes narrower than 1025px wide.
- You can toggle the userscript off at anytime and reload the page to get the original UX back.
- This kit modifies the existing DOM of launchschool.com. If the launchschool.com DOM changes in the future, this kit may cease to function. If that happens, please [report the issue](https://github.com/jacobcassidy/launch-school-ux-kit/issues).

## Issues?

If you come across any issues, please feel free to [report them here](https://github.com/jacobcassidy/launch-school-ux-kit/issues). You are also welcome to [create a pull request](https://github.com/jacobcassidy/launch-school-ux-kit/pulls). If your PR code is AI generated, please fully review the code and mention you have done so, otherwise it may be automatically closed without being reviewed/merged.
