import { SavedQueriesState, savedQueriesInitialState } from './savedQueriesSlice';

const STORAGE_KEY = 'firestudio-saved-queries';

export const loadSavedQueriesState = (): SavedQueriesState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const items = saved ? JSON.parse(saved) : [];
    return {
      ...savedQueriesInitialState,
      items: Array.isArray(items) ? items : savedQueriesInitialState.items,
      pendingSave: null,
    };
  } catch (e) {
    console.error('Failed to load saved queries', e);
    return savedQueriesInitialState;
  }
};

export const saveSavedQueriesState = (state: SavedQueriesState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch (e) {
    console.error('Failed to save saved queries', e);
  }
};
