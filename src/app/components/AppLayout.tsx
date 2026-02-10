import React from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUiState,
  toggleFavoritesPanel,
  toggleConsolePanel,
  toggleSavedQueriesPanel,
  DialogState,
} from '../../app/store/slices/uiSlice';
import { clearLogs, selectLogs } from '../../app/store/slices/logsSlice';
import { Favorite } from '../../app/store/slices/favoritesSlice';
import { AppDispatch } from '../store';

import ProjectSidebar, { ProjectSidebarProps } from '../../features/projects/components/ProjectSidebar';
import LogsPanel from './LogsPanel';
import FavoritesPanel from './FavoritesPanel';
import ConsolePanel from '../../features/console/components/ConsolePanel';
import SavedQueriesPanel from '../../features/console/components/SavedQueriesPanel';
import { SavedQuery } from '../../features/console/store/savedQueriesSlice';

type AppSidebarProps = Omit<
  ProjectSidebarProps,
  'onOpenSettings' | 'onOpenFavorites' | 'onOpenConsole' | 'onOpenSavedQueries'
> & {
  onOpenFavorite: (favorite: Favorite) => void;
  onOpenDialog: (payload: DialogState) => void;
};

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarProps: AppSidebarProps;
  onOpenQuery?: (query: SavedQuery) => void;
}

export default function AppLayout({ children, sidebarProps, onOpenQuery }: AppLayoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { favoritesPanelOpen, consolePanelOpen, savedQueriesPanelOpen } = useSelector(selectUiState);

  // We retrieve logs from Redux now
  const logs = useSelector(selectLogs);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Main Row: Sidebar + Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <ProjectSidebar
          {...sidebarProps}
          onOpenSettings={() => sidebarProps.onOpenDialog({ type: 'SETTINGS' })}
          onOpenFavorites={() => dispatch(toggleFavoritesPanel())}
          onOpenConsole={() => dispatch(toggleConsolePanel())}
          onOpenSavedQueries={() => dispatch(toggleSavedQueriesPanel())}
        />

        {/* Side Drawers (Overlay) */}
        <FavoritesPanel
          open={favoritesPanelOpen}
          onClose={() => dispatch(toggleFavoritesPanel())}
          onOpenFavorite={sidebarProps.onOpenFavorite}
        />

        <SavedQueriesPanel
          open={savedQueriesPanelOpen}
          onClose={() => dispatch(toggleSavedQueriesPanel())}
          onOpenQuery={onOpenQuery}
        />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Tab Content & Navbar (Children) */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>

      {/* Logs Panel - Full width at bottom of screen */}
      <Box
        sx={{
          flexShrink: 0,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <LogsPanel logs={logs} onClear={() => dispatch(clearLogs())} />
      </Box>

      {/* Console Panel - Overlays from bottom */}
      {consolePanelOpen && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 500,
            zIndex: 1200,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          }}
        >
          <ConsolePanel
            open={consolePanelOpen}
            onClose={() => dispatch(toggleConsolePanel())}
            projects={sidebarProps.projects}
          />
        </Box>
      )}
    </Box>
  );
}
