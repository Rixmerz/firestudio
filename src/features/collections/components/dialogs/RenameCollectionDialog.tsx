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
  Box,
  Alert,
} from '@mui/material';
import { Project } from '../../../projects/store/projectsSlice';

interface RenameCollectionDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  collection: string;
  onSubmit: (targetPath: string) => Promise<void>;
}

const RenameCollectionDialog: React.FC<RenameCollectionDialogProps> = ({
  open,
  onClose,
  project,
  collection,
  onSubmit,
}) => {
  const [targetPath, setTargetPath] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && collection) {
      setTargetPath(collection);
      setLoading(false);
    }
  }, [open, collection]);

  const handleSubmit = async () => {
    if (!targetPath.trim() || targetPath === collection) return;

    setLoading(true);
    try {
      await onSubmit(targetPath);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>Rename Collection</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 1 }}>
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            Source Project:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {project?.projectId}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            Source Path:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            /{collection}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Target Path"
          value={targetPath}
          onChange={(e) => setTargetPath(e.target.value)}
          disabled={loading}
          error={targetPath === collection}
          helperText={targetPath === collection ? 'Target path must differ from current path' : ''}
          sx={{ mb: 2 }}
        />
        <Alert severity="warning" sx={{ mt: 2 }}>
          This will copy all documents to the new collection and delete the original documents. Nested subcollections
          are copied recursively. Existing documents with the same ID at the target path will be overwritten.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || targetPath === collection || !targetPath.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Renaming...' : 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameCollectionDialog;
