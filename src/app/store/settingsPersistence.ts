import { SettingsState, settingsDefaults } from './slices/settingsSlice';

const STORAGE_KEY = 'firefoo-settings';

export const loadSettings = (): SettingsState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...settingsDefaults, ...JSON.parse(saved) } : settingsDefaults;
  } catch (e) {
    console.error('Failed to load settings', e);
    return settingsDefaults;
  }
};

export const saveSettings = (state: SettingsState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};
