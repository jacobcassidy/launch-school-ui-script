/**
 * LOAD
 * @module utils/helpers/load
 */

// Import components
import {
  injectHeader,
  injectContentSolutionButtons,
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
} from "../../components";

// Import utils
import { setIsReloadScheduled, setLastUrl, ui } from "../state";
import { injectStyles } from "../helpers";
import {
  syncAvailableHotkeys,
  syncLoadedElementsState,
  syncInjectedElementsState,
  syncNativeElementsState,
} from "../sync";
import {
  watchForMissingHeader,
  watchForUrlChange,
  watchHotkeys,
  watchForNewCopyMarkupBtns,
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
} from "../watch";

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
export function scheduleReload() {
  if (ui.load.isReloadScheduled) {
    return;
  }
  setIsReloadScheduled(true);

  // History changes may keep the same body. Run after the current DOM updates,
  // and let Turbo render events request another pass if rendering finishes later.
  requestAnimationFrame(() => {
    try {
      loadUI();
      setLastUrl(`${location.origin}${location.pathname}`);
    } finally {
      setIsReloadScheduled(false);
    }
  });
}
