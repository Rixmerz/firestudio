import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Project } from '../../../projects/store/projectsSlice';

interface AddCollectionDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  onSubmit: (name: string, docId: string, docData: string) => Promise<void>;
}

const AddCollectionDialog: React.FC<AddCollectionDialogProps> = ({ open, onClose, project, onSubmit }) => {
  const [name, setName] = useState('');
  const [docId, setDocId] = useState('');
  const [docData, setDocData] = useState('{}');
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName('');
      setDocId('');
      setDocData('{}');
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSubmit(name, docId, docData);
      onClose();
    } catch (error) {
      // Error handling should be done by parent or passed down
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add Collection
        {project && (
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            Project: {project.projectId}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Collection Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          placeholder="e.g., users, products, orders"
          helperText="Collection names cannot contain '/' or start with '_'"
          sx={{ mt: 1 }}
        />
        <TextField
          fullWidth
          label="First Document ID (optional)"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          disabled={loading}
          placeholder="Leave empty for auto-generated ID"
          helperText="Optional: Specify a custom document ID"
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="First Document Data"
          value={docData}
          onChange={(e) => setDocData(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey && name.trim() && !loading) {
              handleSubmit();
            }
          }}
          disabled={loading}
          placeholder='{"field": "value"}'
          helperText="JSON object for the first document (Ctrl+Enter to submit)"
          sx={{ mt: 2, '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || loading}
          startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCollectionDialog;
