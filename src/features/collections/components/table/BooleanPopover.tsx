import React from 'react';
import { Box, Typography, Popover } from '@mui/material';
import { MONOSPACE_FONT_FAMILY } from '../../../../shared/utils/constants';

interface BooleanPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelect: (value: boolean) => void;
  currentValue: string | boolean | null | undefined;
}

/**
 * BooleanPopover Component
 * A popover menu for selecting true/false values
 */
const BooleanPopover: React.FC<BooleanPopoverProps> = ({ anchorEl, onClose, onSelect, currentValue }) => {
  const editValue = String(currentValue);

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            boxShadow: 3,
            borderRadius: 1,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 0.5 }}>
        <Box
          onClick={() => onSelect(true)}
          sx={{
            px: 2,
            py: 0.75,
            cursor: 'pointer',
            borderRadius: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: editValue === 'true' ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#4caf50',
            }}
          />
          <Typography
            sx={{
              fontFamily: MONOSPACE_FONT_FAMILY,
              fontSize: '0.85rem',
              color: '#4caf50',
              fontWeight: editValue === 'true' ? 600 : 400,
            }}
          >
            true
          </Typography>
        </Box>
        <Box
          onClick={() => onSelect(false)}
          sx={{
            px: 2,
            py: 0.75,
            cursor: 'pointer',
            borderRadius: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: editValue === 'false' ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#f44336',
            }}
          />
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: '#f44336',
              fontWeight: editValue === 'false' ? 600 : 400,
            }}
          >
            false
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
};

export default BooleanPopover;
