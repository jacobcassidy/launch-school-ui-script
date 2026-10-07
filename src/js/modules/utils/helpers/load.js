/**
 * LOAD
 * @module utils/helpers/load
 */

// Import components
import { injectHeader } from "../../components/header.js";
import { injectHotkeysSection } from "../../components/hotkeys-menu.js";
import { injectToaster } from "../../components/toaster.js";
import {
  updateConversationHistoryButton,
  updateConversationNewButton,
} from "../../components/buttons/panels/conversation.js";
import { updateCopyCodeButton } from "../../components/buttons/panels/copy-code.js";
import { updateCopyMarkupButton } from "../../components/buttons/panels/copy-markup.js";
import { updateExerciseCompletionButton } from "../../components/buttons/panels/exercise-completion.js";
import { updateNextExerciseButton } from "../../components/buttons/panels/next-exercise.js";
import { updatePaginationButton } from "../../components/buttons/panels/pagination.js";
import { updateRunCodeButton } from "../../components/buttons/panels/run-code.js";
import { updateSidebar } from "../../components/sidebar.js";
import { injectContentSolutionButtons, updateSolutionButton } from "../../components/buttons/panels/solution.js";
import { updateTabButtons } from "../../components/buttons/panels/tab.js";
import { updateWorkInEditorButton } from "../../components/buttons/panels/work-in-editor.js";

// Import utils
import { setLoadUIHandler } from "./reload.js";
import { injectStyles } from "./style.js";
import { syncAvailableHotkeys } from "../sync/available-hotkeys.js";
import { syncLoadedElementsState } from "../sync/loaded-elements-state.js";
import { syncInjectedElementsState } from "../sync/injected-elements-state.js";
import { syncNativeElementsState } from "../sync/native-elements-state.js";
import { watchForMissingHeader } from "../watch/events/missing-header.js";
import { watchForUrlChange } from "../watch/events/url-change.js";
import { watchHotkeys } from "../watch/events/hotkeys.js";
import { watchForNewCopyMarkupBtns } from "../watch/buttons/new-copy-markup.js";
import { watchNextExerciseBtn } from "../watch/buttons/next-exercise.js";
import { watchPromptFocus } from "../watch/events/prompt-focus.js";
import { watchPromptSubmission } from "../watch/events/prompt-submission.js";
import { watchQuestionBoxes } from "../watch/events/question-boxes.js";
import { watchSettingSidebarHiddenHeadersToggler } from "../watch/settings/toggler-sidebar-hidden-headers.js";
import { watchSettingSidebarShrinkToggler } from "../watch/settings/toggler-sidebar-shrink.js";
import { watchSettingsToggleBtn } from "../watch/buttons/settings-toggle.js";
import { watchSidebarLinks } from "../watch/events/sidebar-links.js";
import { watchSidebarToggleBtn } from "../watch/buttons/sidebar-toggle.js";
import { watchTabBtns } from "../watch/buttons/tab.js";
import { watchTabsPanelToggleBtn } from "../watch/buttons/tabs-panel-toggle.js";

/**
 * LOAD UI
 * Inserts the UI modifications into the DOM.
 */
export function loadUI() {
  injectStyles();
  syncNativeElementsState();
  injectHeader();
  injectToaster();
  syncInjectedElementsState();
  updateSidebar();
  injectContentSolutionButtons();
  updateConversationHistoryButton();
  updateConversationNewButton();
  updateCopyCodeButton();
  updateCopyMarkupButton();
  updateExerciseCompletionButton();
  updateNextExerciseButton();
  updatePaginationButton();
  updateRunCodeButton();
  updateSolutionButton();
  updateTabButtons();
  updateWorkInEditorButton();
  syncAvailableHotkeys();
  injectHotkeysSection();
  syncLoadedElementsState();

  watchForMissingHeader();
  watchForUrlChange();
  watchHotkeys();
  watchPromptFocus();
  watchPromptSubmission();
  watchQuestionBoxes();
  watchSettingSidebarHiddenHeadersToggler();
  watchSettingSidebarShrinkToggler();
  watchSettingsToggleBtn();
  watchSidebarLinks();
  watchSidebarToggleBtn();
  watchForNewCopyMarkupBtns();
  watchTabBtns();
  watchTabsPanelToggleBtn();
  watchNextExerciseBtn();
}

/**
 * RELOAD UI
 * Reloads loadUI() after a DOM refresh from a page/url change.
 */
setLoadUIHandler(loadUI);
