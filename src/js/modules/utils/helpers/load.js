/**
 * LOAD
 * @module utils/helpers/load
 */

// Import components
import {
  injectContentSolutionButtons,
  injectHeader,
  injectHotkeysSection,
  injectToaster,
  updateConversationHistoryButton,
  updateConversationNewButton,
  updateCopyCodeButton,
  updateCopyMarkupButton,
  updateExerciseCompletionButton,
  updateNextExerciseButton,
  updatePaginationButton,
  updateRunCodeButton,
  updateSidebar,
  updateSolutionButton,
  updateTabButtons,
  updateWorkInEditorButton,
} from "../../components/index.js";

// Import utils
import { setLoadUIHandler } from "./reload.js";
import { injectStyles } from "./style.js";
import {
  syncAvailableHotkeys,
  syncInjectedElementsState,
  syncLoadedElementsState,
  syncNativeElementsState,
} from "../sync/index.js";
import {
  watchForMissingHeader,
  watchForNewCopyMarkupBtns,
  watchForUrlChange,
  watchHotkeys,
  watchNextExerciseBtn,
  watchPromptFocus,
  watchPromptSubmission,
  watchQuestionBoxes,
  watchSettingSidebarHiddenHeadersToggler,
  watchSettingSidebarShrinkToggler,
  watchSettingsToggleBtn,
  watchSidebarLinks,
  watchSidebarToggleBtn,
  watchTabBtns,
  watchTabsPanelToggleBtn,
} from "../watch/index.js";

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
