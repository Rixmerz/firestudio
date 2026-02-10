import React from 'react';
import { Box, Typography, Popover, TextField, Button } from '@mui/material';
import { FirestoreValue } from '../../../../shared/utils/firestoreUtils';

interface DatePopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelect: (value: string) => void;
  initialValue: string;
  originalValue?: FirestoreValue; // The original raw value (for type reference if needed)
}

/**
 * DatePopover Component
 * A popover for editing date/time values
 */
const DatePopover: React.FC<DatePopoverProps> = ({
  anchorEl,
  onClose,
  onSelect,
  initialValue,
  originalValue: _originalValue, // The original raw value (for type reference if needed)
}) => {
  const [dateValue, setDateValue] = React.useState(initialValue);

  React.useEffect(() => {
    setDateValue(initialValue);
  }, [initialValue]);

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => onClose()}
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
            p: 2,
            width: 300,
            bgcolor: 'background.paper',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Edit Date
        </Typography>

        <TextField
          type="datetime-local"
          fullWidth
          size="small"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button size="small" onClick={() => onClose()} color="inherit">
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={() => onSelect(dateValue)}>
            Save
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default DatePopover;
