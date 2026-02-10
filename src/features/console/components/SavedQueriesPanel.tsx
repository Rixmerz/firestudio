import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  useTheme,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { MONOSPACE_FONT_FAMILY } from '../../../shared/utils/constants';
import { AppDispatch } from '../../../app/store';
import {
  addSavedQuery,
  clearPendingSave,
  removeSavedQuery,
  selectPendingSaveQuery,
  selectSavedQueries,
  SavedQuery,
} from '../store/savedQueriesSlice';

interface PendingQuery {
  query: string;
  projectId?: string;
  collectionPath?: string;
}

interface SavedQueriesPanelProps {
  open: boolean;
  onClose: () => void;
  onOpenQuery?: (query: SavedQuery) => void;
}

const SavedQueriesPanel: React.FC<SavedQueriesPanelProps> = ({ open, onClose, onOpenQuery }) => {
  const theme = useTheme();
  const editorColors = theme.custom.editor;
  const dispatch = useDispatch<AppDispatch>();
  const savedQueries = useSelector(selectSavedQueries);
  const pendingSave = useSelector(selectPendingSaveQuery);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newQueryName, setNewQueryName] = useState('');

  // Add a new query
  const handleSaveQuery = (queryData: PendingQuery, name: string) => {
    dispatch(
      addSavedQuery({
        name,
        code: queryData.query,
        projectId: queryData.projectId,
        collectionPath: queryData.collectionPath,
      }),
    );
  };

  // Delete a query
  const handleDeleteQuery = (queryId: string) => {
    dispatch(removeSavedQuery(queryId));
  };

  // Copy to clipboard
  const handleCopyQuery = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Open dialog when a save request comes in
  useEffect(() => {
    if (pendingSave?.code?.trim()) {
      setNewQueryName('');
      setSaveDialogOpen(true);
    }
  }, [pendingSave]);

  const confirmSave = () => {
    if (pendingSave) {
      handleSaveQuery(
        {
          query: pendingSave.code,
          projectId: pendingSave.projectId,
          collectionPath: pendingSave.collectionPath,
        },
        newQueryName,
      );
      setSaveDialogOpen(false);
      setNewQueryName('');
      dispatch(clearPendingSave());
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CodeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>Saved Queries</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>({savedQueries.length})</Typography>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Queries List */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {savedQueries.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                <CodeIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                <Typography sx={{ fontSize: '0.85rem' }}>No saved queries yet</Typography>
                <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>
                  Click the save icon in the JS Query Editor to save queries
                </Typography>
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {savedQueries.map((query) => (
                  <ListItem
                    key={query.id}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{query.name}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>
                        {new Date(query.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {/* Project/Collection info */}
                    {(query.projectId || query.collectionPath) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <FolderIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
                          {query.projectId}
                          {query.collectionPath ? ` / ${query.collectionPath}` : ''}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        bgcolor: editorColors.bg || 'background.default',
                        p: 1,
                        borderRadius: 1,
                        fontFamily: MONOSPACE_FONT_FAMILY,
                        fontSize: '0.7rem',
                        lineHeight: 1.5,
                        color: 'text.primary',
                        overflow: 'auto',
                        whiteSpace: 'pre',
                        maxHeight: 120,
                        mb: 1,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    >
                      {query.code}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyQuery(query.code)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <CopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open collection & load query">
                        <IconButton
                          size="small"
                          onClick={() => {
                            onOpenQuery?.(query);
                            onClose();
                          }}
                          sx={{ color: 'primary.main' }}
                        >
                          <OpenIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteQuery(query.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Save Query Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => {
          setSaveDialogOpen(false);
          dispatch(clearPendingSave());
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Query</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Query Name"
            value={newQueryName}
            onChange={(e) => setNewQueryName(e.target.value)}
            placeholder="My Query"
            sx={{ mt: 1 }}
          />
          {pendingSave?.projectId && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FolderIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                {pendingSave.projectId}
                {pendingSave.collectionPath ? ` / ${pendingSave.collectionPath}` : ''}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: editorColors.bg || 'background.default',
              borderRadius: 1,
              fontFamily: MONOSPACE_FONT_FAMILY,
              fontSize: '0.75rem',
              maxHeight: 200,
              overflow: 'auto',
              whiteSpace: 'pre',
              color: 'text.primary',
              border: 1,
              borderColor: 'divider',
            }}
          >
            {pendingSave?.code}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSaveDialogOpen(false);
              dispatch(clearPendingSave());
            }}
          >
            Cancel
          </Button>
          <Button onClick={confirmSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SavedQueriesPanel;
