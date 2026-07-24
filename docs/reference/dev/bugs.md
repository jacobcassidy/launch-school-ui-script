# BUGS

## Fix Planned

- [] If you're on the last exercise and use the hotkey to go to the next non-existing exercise, the toast will still show up (Fix this by changing the toast to say "No next exercise to go to. You're on the last exercise for this series.")
- [] When going to the next exercise via button or hotkey, the button icons get duplicated temporary while the new page is loading. (Fix this by adding a check that doesn't add a new icon if it already exists in the button.)

## No Fix Planned

- When loading an exercise page from another page, such as this[exercise page](https://launchschool.com/exercises/d8c345a1?track=python), with the sidebar open, the code will be pushed outside the editor box and be partially or fully hidden. [temp solution: close the sidebar and reload the page.]
- When the screen size is too narrow, such as when the sidebar is open on 1280px window, the tabs can get hidden if there are more than 3 [temp solution: v1.1.0 will use icon-only tabs so they won't get pushed off screen.]
