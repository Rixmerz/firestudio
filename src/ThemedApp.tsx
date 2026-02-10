import { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSettings } from './app/store/slices/settingsSlice';
import App from './App';
import { createAppTheme } from './app/theme';
import { RootState } from './app/store';

function ThemedApp() {
  const settings = useSelector((state: RootState) => selectSettings(state));

  const theme = useMemo(() => {
    let mode: 'light' | 'dark' | 'auto' = settings.theme;
    if (mode === 'auto') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return createAppTheme(mode as 'light' | 'dark', settings.fontSize);
  }, [settings.theme, settings.fontSize]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

export default ThemedApp;
