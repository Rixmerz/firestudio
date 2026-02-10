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

interface AddDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  collection: string;
  onSubmit: (docId: string, docData: string) => Promise<void>;
}

const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({ open, onClose, project, collection, onSubmit }) => {
  const [docId, setDocId] = useState('');
  const [docData, setDocData] = useState('{}');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDocId('');
      setDocData('{}');
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(docId, docData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add Document
        {collection && (
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            Collection: {collection}
          </Typography>
        )}
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
          label="Document ID (optional)"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          disabled={loading}
          placeholder="Leave empty for auto-generated ID"
          helperText="Optional: Specify a custom document ID"
          sx={{ mt: 1 }}
        />
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Document Data"
          value={docData}
          onChange={(e) => setDocData(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey && !loading) {
              handleSubmit();
            }
          }}
          disabled={loading}
          placeholder='{"field": "value"}'
          helperText="JSON object for the document (Ctrl+Enter to submit)"
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
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDocumentDialog;
