import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Favorite {
  id: string;
  projectId: string;
  projectName: string;
  collectionPath: string;
  createdAt: number;
}

export interface FavoritesState {
  items: Favorite[];
}
export const favoritesInitialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: favoritesInitialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Omit<Favorite, 'id' | 'createdAt'>>) => {
      const newFavorite: Favorite = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: Date.now(),
      };
      state.items.push(newFavorite);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter((f) => f.id !== id);
    },
    toggleFavorite: (
      state,
      action: PayloadAction<{ projectId: string; projectName: string; collectionPath: string }>,
    ) => {
      const { projectId, projectName, collectionPath } = action.payload;
      const existingIndex = state.items.findIndex(
        (f) => f.projectId === projectId && f.collectionPath === collectionPath,
      );

      if (existingIndex >= 0) {
        // Remove
        state.items.splice(existingIndex, 1);
      } else {
        // Add
        const newFavorite: Favorite = {
          id: Date.now().toString(),
          projectId,
          projectName,
          collectionPath,
          createdAt: Date.now(),
        };
        state.items.push(newFavorite);
      }
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;

export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.items;
export const selectIsFavorite = (state: { favorites: FavoritesState }, projectId: string, collectionPath: string) =>
  state.favorites.items.some((f) => f.projectId === projectId && f.collectionPath === collectionPath);

export default favoritesSlice.reducer;
