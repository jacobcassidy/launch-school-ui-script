# Project review — 2026-10-08

Reviewed after the tabs-panel, shortcut-tooltip, book-history, Windows-shortcut, and modifier-symbol changes. All six findings below have since been fixed in separate commits.

## Scope and checks

Reviewed runtime initialization, navigation and cache restoration, components, shortcut registration and handling, DOM observers, CSS, accessibility, tests, build configuration, CI, documentation, and dependency status.

- All 117 tests pass, including shortcut updates for dynamic controls, book Back/Forward restoration, accessible header and settings state, contrast ratios, cached sidebar tooltips, and toast cleanup.
- ESLint, Stylelint, Markdownlint, and Prettier pass.
- The rebuilt installable bundle matches the committed bundle. CI already checks this, along with tests, formatting, and linting.
- Focused Happy DOM regression tests cover all six findings. The contrast test calculates ratios from the declared neutral OKLCH tokens.
- The panel animation was checked in a rendered Chrome preview. Native Windows browsers, Safari shortcut interception, and screen-reader behavior were not exercised during this review.

## Findings

### 1. P2 — Review shortcut assumes a review tab always exists

**Location:** [available-hotkeys.js](../../src/js/modules/utils/sync/available-hotkeys.js), `handleSubmitReviewHotkey`, and [activate.js](../../src/js/modules/utils/helpers/activate.js), `activateTab`.

Registration requires a review submit button, but execution unconditionally passes `.tab-button[data-tab='submit-review']` to `activateTab`. If that tab is missing, the action throws before submitting. Both `#lsbot-send-review` and `#btn-book-lsbot-review` are registered through this path.

**Reproduction:** Supply a `#btn-book-lsbot-review` button without a `submit-review` tab, sync the hotkeys, and call the registered review action. It throws `Cannot read properties of null (reading 'dispatchEvent')`.

The action also retains its submit button across a 100 ms delay and announces success before the click. Replacement, navigation, or a disabled button during that interval can produce a misleading success message.

**Resolution:** The action submits directly when the tab is absent, resolves the current connected and enabled control after the delay, and cancels after navigation. It no longer announces success before the native action completes.

### 2. P2 — Asynchronously added controls do not refresh shortcut labels

**Location:** [available-hotkeys.js](../../src/js/modules/utils/sync/available-hotkeys.js), [prompt-focus.js](../../src/js/modules/utils/watch/events/prompt-focus.js), and [tab.js](../../src/js/modules/utils/watch/buttons/tab.js).

Shortcut listings and button tooltips are rebuilt during UI loading and selected mutations. The tab observer refreshes only when visible tab identities or their order change. Adding chat controls inside existing tab content does not refresh the registry. Delegated prompt focus still enables Enter submission, so the working shortcut and its displayed documentation diverge.

**Reproduction:** Load a page with an LSBot tab and empty tab content. Insert a textarea and submit button into the existing tab. After mutations settle, Enter successfully submits, but `hotkeys.enterOnly.Enter` is absent, the button has no shortcut tooltip, and settings omit the shortcut.

**Resolution:** A filtered mutation observer coalesces registration and settings updates when relevant page controls are added, removed, or replaced. It ignores its own tooltip and settings updates. Integration tests cover asynchronous addition and removal.

### 3. P2 — Hidden header controls remain focusable

**Location:** [ui.js](../../src/js/modules/utils/state/setters/ui.js), `setIsHeaderHidden`, and [header.css](../../src/css/parts/header.css), `.site-header.is-hidden`.

Header hiding only changes a class and translates the header offscreen. Toolbar buttons remain in the focus order and accessibility tree. The reproduction could focus the settings button while its header was hidden; the header was not inert.

**Resolution:** A hidden header is inert and marked `aria-hidden`; focus leaves it before hiding. The settings control exposes its expanded state and controls relationship, the settings region becomes inert while closed, and Escape returns focus to its toggle. Hiding the header closes settings first.

### 4. P2 — Some small text has insufficient contrast

**Location:** [variables.css](../../src/css/base/variables.css), [sidebar.css](../../src/css/parts/sidebar.css), [settings.css](../../src/css/components/settings.css), and [header.css](../../src/css/parts/header.css).

Calculated from the neutral OKLCH tokens:

| Text                      | Foreground/background tokens   | Contrast |
| ------------------------- | ------------------------------ | -------- |
| Sidebar section labels    | grayscale-300 / background-300 | 1.74:1   |
| Settings section headings | grayscale-400 / background-400 | 2.40:1   |
| Header breadcrumbs        | grayscale-400 / background-300 | 2.49:1   |

These labels use small text. WCAG's normal-text minimum is 4.5:1. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

**Resolution:** Sidebar section labels, sidebar logo and links, settings section headings, header breadcrumbs, and breadcrumb hover links now use darker tokens. Their text contrast is at least 4.5:1 against the named neutral surfaces; a test guards the key token combinations. Active/completed table text and timestamps still need a separate computed-style check against Launch School's live styles.

### 5. P3 — Active sidebar tooltips survive cached navigation

**Location:** [header.js](../../src/js/modules/components/header.js), `watchHeaderBeforeCache`, and [sidebar.js](../../src/js/modules/components/sidebar.js).

Cache cleanup removes tab tooltips but leaves sidebar tooltips, including their `active` class. The restored sidebar already has the `sidebar` class, so its refresh adopts the cached tooltips without clearing their visibility.

**Reproduction:** Hover a collapsed sidebar link, dispatch `turbo:before-cache`, clone and restore the body, and update the sidebar. The cached tooltip remains active without a new hover.

**Resolution:** Active sidebar tooltip state resets before caching and again when adopting a restored sidebar. Tooltip elements remain available, so restored links can show them on hover.

### 6. P3 — Toast cleanup depends entirely on a transition event

**Location:** [show.js](../../src/js/modules/utils/helpers/show.js), `showToast`.

After the display duration, removal is registered only on `transitionend`. With transitions disabled or canceled, no completion event may arrive and the toast remains in the DOM. A reproduction with no CSS transition retained the toast after its display duration.

**Resolution:** Toasts use a polite status region. They remove immediately when no transition runs, after the transition settles, or after a bounded fallback if transitions are canceled, unavailable, or never finish.

## Additional improvements

- **Respect reduced motion.** No `prefers-reduced-motion` rule is present. Provide instant or minimal-motion alternatives for slides, flashes, switches, and toasts.
- **Add real-browser coverage.** Existing tests model DOM behavior and keyboard events; they cannot prove whether a browser or OS intercepts a shortcut. Prioritize Safari on macOS and Chrome/Edge/Firefox on Windows, including AltGr layouts, history navigation, and rapid panel reversal. Keep the current shortcut scheme until any remapping is explicitly selected.
- **Review unsupported narrow layouts.** README explicitly limits support to desktop widths above 1024px. A responsive fallback or an option to retain the native layout at smaller widths would improve usability under browser zoom and narrow windows.

## Dependencies and delivery status

A fresh `npm audit` reports 20 affected development entries: 17 high and 3 low. These originate from the already documented [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [KaTeX advisory](https://github.com/advisories/GHSA-238p-pmpm-9mq7). The braces advisory lists no patched version. The KaTeX fix is outside the current math parser's accepted range. See [DEPENDENCIES.md](DEPENDENCIES.md) for the dependency paths and constraints. `npm audit --omit=dev` reports zero affected entries; these tools are not bundled into the userscript.

The live animated demo remains unfinished. The uncommitted README demo changes and screenshot-based GIF were excluded from the feature commits because they do not fulfill the requested live-site recording.

## Remaining review suggestions

Add reduced-motion behavior, verify platform shortcuts in native browsers, check computed contrast for native page text, and evaluate responsive behavior below the documented desktop width.
