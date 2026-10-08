import { injectHeader } from "../src/js/modules/components/header.js";
import { updateSidebar } from "../src/js/modules/components/sidebar.js";
import { updateTabButtons } from "../src/js/modules/components/buttons/panels/tab.js";
import { elements } from "../src/js/modules/utils/state/dom.js";
import { syncAvailableHotkeys } from "../src/js/modules/utils/sync/available-hotkeys.js";
import { syncNativeElementsState } from "../src/js/modules/utils/sync/native-elements-state.js";
import { syncInjectedElementsState } from "../src/js/modules/utils/sync/injected-elements-state.js";
import { setLoadUIHandler } from "../src/js/modules/utils/helpers/reload.js";
import { watchForUrlChange } from "../src/js/modules/utils/watch/events/url-change.js";
import { hotkeys } from "../src/js/modules/utils/state/hotkeys.js";
import { injectHotkeysSection } from "../src/js/modules/components/hotkeys-menu.js";
import { watchHotkeys } from "../src/js/modules/utils/watch/events/hotkeys.js";
import { watchHotkeyElements } from "../src/js/modules/utils/watch/events/hotkey-elements.js";
import { watchPromptFocus } from "../src/js/modules/utils/watch/events/prompt-focus.js";
import { watchSettingsToggleBtn } from "../src/js/modules/utils/watch/buttons/settings-toggle.js";
import { watchSidebarLinks } from "../src/js/modules/utils/watch/events/sidebar-links.js";
import { watchSidebarToggleBtn } from "../src/js/modules/utils/watch/buttons/sidebar-toggle.js";
import { watchTabBtns } from "../src/js/modules/utils/watch/buttons/tab.js";
import { watchUnreadCounts } from "../src/js/modules/utils/watch/sidebar/unread-count.js";

globalThis.integration = {
  elements,
  injectHeader,
  updateSidebar,
  updateTabButtons,
  syncAvailableHotkeys,
  syncNativeElementsState,
  syncInjectedElementsState,
  setLoadUIHandler,
  watchForUrlChange,
  hotkeys,
  injectHotkeysSection,
  watchPromptFocus,
  watchSettingsToggleBtn,
  watchSidebarLinks,
  watchSidebarToggleBtn,
  watchTabBtns,
  watchUnreadCounts,
  watchHotkeys,
  watchHotkeyElements,
};
