import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { MONOSPACE_FONT_FAMILY } from '../../../../shared/utils/constants';

interface EditDialogData {
  docId: string;
  field: string;
  value: string;
  originalType?: string;
}

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  data: EditDialogData;
  setData: React.Dispatch<React.SetStateAction<EditDialogData>>;
}

/**
 * EditDialog Component
 * A dialog for editing long strings or complex objects/arrays
 */
const EditDialog: React.FC<EditDialogProps> = ({ open, onClose, onSave, data, setData }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to save
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        Edit Field
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {data.docId} → {data.field}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {data.originalType && (
          <Typography
            variant="caption"
            sx={{
              display: 'inline-block',
              bgcolor: 'action.hover',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              color: 'text.secondary',
              mb: 1,
            }}
          >
            Type: {data.originalType}
            {data.originalType === 'timestamp' && ' (ISO 8601 format)'}
          </Typography>
        )}
        <TextField
          autoFocus
          multiline
          fullWidth
          minRows={6}
          maxRows={20}
          value={data.value}
          onChange={(e) => setData((prev) => ({ ...prev, value: e.target.value }))}
          onKeyDown={handleKeyDown}
          sx={{
            mt: 1,
            '& .MuiInputBase-input': {
              fontFamily: MONOSPACE_FONT_FAMILY,
              fontSize: '0.9rem',
              lineHeight: 1.5,
            },
          }}
          placeholder={
            data.originalType === 'timestamp'
              ? '2024-01-15T10:30:00.000Z'
              : data.originalType === 'array'
                ? '["item1", "item2"]'
                : data.originalType === 'object'
                  ? '{"key": "value"}'
                  : 'Enter value...'
          }
        />
        <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1, display: 'block' }}>
          Press Ctrl+Enter to save, Escape to cancel
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
