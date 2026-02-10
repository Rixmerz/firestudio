import { FavoritesState, favoritesInitialState } from './slices/favoritesSlice';

const STORAGE_KEY = 'firefoo-favorites';

export const loadFavorites = (): FavoritesState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const items = saved ? JSON.parse(saved) : [];
    return {
      ...favoritesInitialState,
      items: Array.isArray(items) ? items : favoritesInitialState.items,
    };
  } catch (e) {
    console.error('Failed to load favorites', e);
    return favoritesInitialState;
  }
};

export const saveFavorites = (state: FavoritesState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
};
