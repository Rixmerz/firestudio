import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemedApp from './ThemedApp';
import { initElectronMock } from './shared/utils/electronMock';

// Initialize mock electronAPI if not running in Electron
initElectronMock();

import { Provider } from 'react-redux';
import { store } from './app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>,
);
