import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert } from '@mui/material';
import { electronService } from '../../../../shared/services/electronService';

interface ApiDisabledDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  apiUrl: string;
}

const ApiDisabledDialog: React.FC<ApiDisabledDialogProps> = ({ open, onClose, projectId, apiUrl }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'warning.main' }}>Cloud Firestore API Not Enabled</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          The Cloud Firestore API has not been enabled for project <strong>{projectId}</strong>.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          To use Firestore with this project, you need to enable the Cloud Firestore API in the Google Cloud Console.
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Click the button below to open the Google Cloud Console and enable the API. After enabling, wait a few minutes
          and try again.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            electronService.openExternal(apiUrl);
          }}
        >
          Enable Firestore API
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiDisabledDialog;
