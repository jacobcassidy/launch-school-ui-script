# Launch School UI Script

An unofficial script for modifying the launchschool.com UI for a cleaner, minimal design with added hotkeys for toggling tabs and panels.

## Screenshots

**With all panels showing - Header, Sidebar, Content, and Tabs Panel:**
![All Panels Open](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/01-sidebar-header-sidepanel.png)

**With Sidebar closed:**
![Sidebar Closed](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/02-header-sidepanel.png)

**With Header and Sidebar closed:**
![Header and Sidebar Closed](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/03-sidepanel.png)

**Scratchpad Tab open:**
![Scratchpad Tab Open](https://raw.githubusercontent.com/jacobcassidy/launch-school-ui-script/refs/heads/main/docs/reference/screenshots/04-sidepanel-scratchpad.png)

**With Header, Sidebar, and Tabs Panel closed:**
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
5. Go to launchschool.com or refresh the page if you are already there and the script should now be active (if not, check your Tampermonkey extension settings to make sure it's active on launchschool.com).

## Notes

- This script was developed for macOS. Windows/Linux have not been tested, though you may fork and modify the script however you'd like if you have a different OS than macOS.
- This script modifies the existing DOM of launchschool.com. If the launchschool.com DOM changes in the future, this script may cease to function. If that happens, please [report the issue](https://github.com/jacobcassidy/launch-school-ui-script/issues).

## Issues?

If you come across any issues, please feel free to [report them here](https://github.com/jacobcassidy/launch-school-ui-script/issues). You are also welcome to [create a pull request](https://github.com/jacobcassidy/launch-school-ui-script/pulls). If your PR is AI generated, please fully review the code first and mention you have done so, otherwise it may be automatically closed without being reviewed/merged.
