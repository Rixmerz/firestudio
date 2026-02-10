import { UiState, uiInitialState } from './slices/uiSlice';

const STORAGE_KEY = 'firefoo-ui';

const isRecord = (value: unknown): value is Record<string, boolean> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

export const loadUiState = (): UiState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return uiInitialState;

    const parsed = JSON.parse(saved) as Partial<UiState>;
    return {
      ...uiInitialState,
      openTabs: Array.isArray(parsed.openTabs) ? parsed.openTabs : uiInitialState.openTabs,
      activeTabId: typeof parsed.activeTabId === 'string' ? parsed.activeTabId : uiInitialState.activeTabId,
      expandedSidebarItems: isRecord(parsed.expandedSidebarItems)
        ? parsed.expandedSidebarItems
        : uiInitialState.expandedSidebarItems,
      sidebarOpen: typeof parsed.sidebarOpen === 'boolean' ? parsed.sidebarOpen : uiInitialState.sidebarOpen,
    };
  } catch (e) {
    console.error('Failed to load UI state', e);
    return uiInitialState;
  }
};

export const saveUiState = (state: UiState) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        openTabs: state.openTabs,
        activeTabId: state.activeTabId,
        expandedSidebarItems: state.expandedSidebarItems,
        sidebarOpen: state.sidebarOpen,
      }),
    );
  } catch (e) {
    console.error('Failed to save UI state', e);
  }
};
