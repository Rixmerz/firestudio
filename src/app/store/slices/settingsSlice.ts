import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingValue = string | number | boolean;

export interface SettingsState {
  theme: 'light' | 'dark' | 'auto';
  defaultDocLimit: number;
  defaultViewType: 'table' | 'tree' | 'json';
  autoExpandDocuments: boolean;
  showTypeColumn: boolean;
  fontSize: 'small' | 'medium' | 'large';
  timestampFormat: 'iso' | 'unix' | 'local' | 'relative' | 'utc';
  numberFormat: 'auto' | 'fixed' | 'scientific' | 'thousands';
  numberDecimalPlaces: number;
  geopointFormat: 'decimal' | 'dms' | 'compact';
  [key: string]: SettingValue; // Allow index access for updateSetting
}

export const settingsDefaults: SettingsState = {
  theme: 'light', // 'light', 'dark', 'auto'
  defaultDocLimit: 50,
  defaultViewType: 'tree', // 'table', 'tree', 'json'
  autoExpandDocuments: true,
  showTypeColumn: true,
  fontSize: 'medium', // 'small', 'medium', 'large'
  // Data Type Display Settings
  timestampFormat: 'iso', // 'iso', 'unix', 'local', 'relative', 'utc'
  numberFormat: 'auto', // 'auto', 'fixed', 'scientific', 'thousands'
  numberDecimalPlaces: 2, // 0-10
  geopointFormat: 'decimal', // 'decimal', 'dms', 'compact'
};

export const settingsInitialState: SettingsState = settingsDefaults;

const settingsSlice = createSlice({
  name: 'settings',
  initialState: settingsInitialState,
  reducers: {
    updateSetting: (state, action: PayloadAction<{ key: string; value: SettingValue }>) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetSettings: (state) => {
      Object.assign(state, settingsDefaults);
    },
  },
});

export const { updateSetting, resetSettings } = settingsSlice.actions;

export const selectSettings = (state: { settings: SettingsState }) => state.settings;

export default settingsSlice.reducer;
