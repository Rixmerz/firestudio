import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SavedQuery {
  id: string;
  name: string;
  code: string;
  projectId?: string;
  collectionPath?: string;
  createdAt: string;
}

export interface SavedQueriesState {
  items: SavedQuery[];
  pendingSave: {
    code: string;
    projectId?: string;
    collectionPath?: string;
  } | null;
}

export const savedQueriesInitialState: SavedQueriesState = {
  items: [],
  pendingSave: null,
};

const savedQueriesSlice = createSlice({
  name: 'savedQueries',
  initialState: savedQueriesInitialState,
  reducers: {
    requestSaveQuery: (state, action: PayloadAction<{ code: string; projectId?: string; collectionPath?: string }>) => {
      state.pendingSave = action.payload;
    },
    clearPendingSave: (state) => {
      state.pendingSave = null;
    },
    addSavedQuery: (
      state,
      action: PayloadAction<{
        name?: string;
        code: string;
        projectId?: string;
        collectionPath?: string;
      }>,
    ) => {
      const nextIndex = state.items.length + 1;
      const newQuery: SavedQuery = {
        id: `query-${Date.now()}`,
        name: action.payload.name?.trim() || `Query ${nextIndex}`,
        code: action.payload.code,
        projectId: action.payload.projectId,
        collectionPath: action.payload.collectionPath,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newQuery);
      state.pendingSave = null;
    },
    removeSavedQuery: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((query) => query.id !== action.payload);
    },
  },
});

export const { requestSaveQuery, clearPendingSave, addSavedQuery, removeSavedQuery } = savedQueriesSlice.actions;

export const selectSavedQueries = (state: { savedQueries: SavedQueriesState }) => state.savedQueries.items;
export const selectPendingSaveQuery = (state: { savedQueries: SavedQueriesState }) => state.savedQueries.pendingSave;

export default savedQueriesSlice.reducer;
