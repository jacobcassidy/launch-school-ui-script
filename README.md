# Launch School UX Kit

An unofficial UX kit that modifies the LaunchSchool.com UI with a minimal design and added shortcuts for productivity (shortcuts that toggle the header, menus, sidebar, tabs, and more).

| Index                                 |
| ------------------------------------- |
| [Demo](#demo)                         |
| [Quickstart Guide](#quickstart-guide) |
| [UX Kit Features](#ux-kit-features)   |
| [Notes](#notes)                       |
| [Issues?](#issues)                    |

## Demo

The demo transitions between the UX kit's panel states and shows the shortcut used for each action.

## Quickstart Guide

1. Install the [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) browser extension (or an equivalent extension).
2. Open the Tampermonkey extension's dashboard.
3. Click on the dashboard's `+` tab to create a new script.
4. Copy the code from [/dist/js/index.min.js](https://github.com/jacobcassidy/launch-school-ux-kit/blob/main/dist/js/index.min.js), then paste it into the Tampermonkey editor and save it (`CMD S` on macOS or `CTRL S` on Windows).
5. Go to [launchschool.com](https://launchschool.com) or refresh the page if you're already there and the script should now be active (if not, check your Tampermonkey extension settings to make sure it's active on launchschool.com).

> [!TIP]
> If you want the clean look from the screenshots (no URL bar, tabs, browser nav, etc), do the following:
>
> 1. Open launchschool.com in the Safari browser.
> 2. Select `File > Add to Dock...`
> 3. Make the title "Launch School" and click "Add".
> 4. Open the new Launch School Safari app you just created.
> 5. Open settings (in the menubar, click `Launch School > Settings` or use the `CMD ,` shortcut).
> 6. In the Setting's "General" tab, deselect "Show navigation controls".
> 7. In the Setting's "Extensions" tab, click "Browse Extensions" and install "Tampermonkey" (or an equivalent extension).
> 8. Then follow the rest of the [Quickstart Guide](#quickstart-guide) above to complete the setup.

## UX Kit Features

- Refines the UI for a more minimal style, especially when closing panels such as the sidebar or tabs panel.
- Adds a toggleable page header panel with the page's breadcrumbs/title and buttons to control the visibility of other panels (settings, sidebar, tabs, and table of contents).
- Adds shortcuts to toggle the visibility of all toggleable panels (header, menus, sidebar, and tabs), so you can display only want you need for minimizing distractions.
- Refines the sidebar UX with muted colors and reorganized link groups (with heading labels) and a more minimal sidebar when shrunken.
- Adds a Settings menu panel the includes the ability to completely hide the sidebar, show/hide the sidebar group titles, and see the current page's shortcuts.
- Adds a toaster component which displays messages for different actions, such as activating the Copy Editor Code shortcut.
- Focuses/refocuses the LSBot prompt textarea when a prompt submission completes (including from a question box in the content panel).
- Automatically focuses the textarea of a selected panel (such as the LSBot tab).
- Adds a blue background flash to an already active tab/textarea that is activated again via a shortcut so you can quickly see where the active focus is.

- Added shortcuts:

  | macOS         | Windows        | Function                                                                   |
  | ------------- | -------------- | -------------------------------------------------------------------------- |
  | `Enter`       | `Enter`        | Submit focused chat prompt                                                 |
  | `CMD B`       | `CTRL B`       | Toggles Sidebar visibility                                                 |
  | `CMD Shift 1` | `CTRL Shift 1` | Toggles Header visibility                                                  |
  | `CMD Shift 2` | `CTRL Shift 2` | Toggle Tabs Panel visibility                                               |
  | `CMD CTRL #`  | `CTRL ALT #`   | Select tab by number order (such as 1 for the "Ask LSBot" tab)             |
  | `CMD CTRL C`  | `CTRL ALT C`   | Copy Editor/Scratchpad Code                                                |
  | `CMD CTRL E`  | `CTRL ALT E`   | Focus Editor/Scratchpad                                                    |
  | `CMD CTRL M`  | `CTRL ALT M`   | Toggle the "Mark exercise complete/incomplete" _(active on exercise page)_ |
  | `CMD CTRL N`  | `CTRL ALT N`   | Go to next exercise _(active on exercise page)_                            |
  | `CMD CTRL R`  | `CTRL ALT R`   | Submit review to LSBot _(active on exercise page)_                         |
  | `CMD CTRL T`  | `CTRL ALT T`   | Toggle Table of Contents visibility _(active on book page)_                |
  | `CMD CTRL ,`  | `CTRL ALT ,`   | Toggle Settings visibility (include Current Page Shortcuts)                |

Shortcut modifiers in tooltips and settings use `⌘` (Command), `⌃` (Control), `⇧` (Shift), and `⎇` (Alt).

## Notes

- Shortcuts, the current-page shortcut list, and button tooltips automatically use macOS or Windows keys for your platform.
- This kit only works for desktop views. The UI will break on screen sizes narrower than 1025px wide.
- You can toggle the userscript off at anytime and reload the page to get the original UX back.
- This kit modifies the existing DOM of launchschool.com. If the launchschool.com DOM changes in the future, this kit may cease to function. If that happens, please [report the issue](https://github.com/jacobcassidy/launch-school-ux-kit/issues).

## Issues?

If you come across any issues, please feel free to [report them here](https://github.com/jacobcassidy/launch-school-ux-kit/issues). You are also welcome to [create a pull request](https://github.com/jacobcassidy/launch-school-ux-kit/pulls). If your PR code is AI generated, please fully review the code and mention you have done so, otherwise it may be automatically closed without being reviewed/merged.
