import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  SettingsBrightness as AutoModeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSettings,
  updateSetting,
  resetSettings,
  SettingValue,
  SettingsState,
} from '../../app/store/slices/settingsSlice';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontSize: '0.75rem',
      fontWeight: 600,
      color: 'text.secondary',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      mb: 1.5,
    }}
  >
    {children}
  </Typography>
);

const ThemeButton = ({
  value,
  icon: Icon,
  label,
  selected,
  isDark,
  onSelect,
}: {
  value: SettingsState['theme'];
  icon: React.ElementType;
  label: string;
  selected: boolean;
  isDark: boolean;
  onSelect: (value: SettingsState['theme']) => void;
}) => (
  <Paper
    elevation={0}
    onClick={() => onSelect(value)}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      flex: 1,
      border: '2px solid',
      borderColor: selected ? 'primary.main' : 'divider',
      borderRadius: 2,
      cursor: 'pointer',
      bgcolor: selected ? (isDark ? 'rgba(88, 166, 255, 0.15)' : 'rgba(9, 105, 218, 0.08)') : 'transparent',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: selected ? 'primary.main' : 'primary.light',
        bgcolor: selected ? (isDark ? 'rgba(88, 166, 255, 0.2)' : 'rgba(9, 105, 218, 0.12)') : 'action.hover',
      },
    }}
  >
    <Icon
      sx={{
        fontSize: 32,
        mb: 1,
        color: selected ? 'primary.main' : 'text.secondary',
      }}
    />
    <Typography
      sx={{
        fontSize: '0.85rem',
        color: selected ? 'primary.main' : 'text.primary',
        fontWeight: selected ? 600 : 500,
      }}
    >
      {label}
    </Typography>
  </Paper>
);

function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const isDark = theme.palette.mode === 'dark';

  const handleUpdate = (key: string, value: SettingValue) => {
    dispatch(updateSetting({ key, value }));
  };

  const handleReset = () => {
    dispatch(resetSettings());
  };

  const isSelected = (value: SettingsState['theme']) => settings.theme === value;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          py: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>Settings</Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Theme Section */}
        <Box sx={{ p: 2.5 }}>
          <SectionTitle>Appearance</SectionTitle>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <ThemeButton
              value="light"
              icon={LightModeIcon}
              label="Light"
              selected={isSelected('light')}
              isDark={isDark}
              onSelect={(value) => handleUpdate('theme', value)}
            />
            <ThemeButton
              value="dark"
              icon={DarkModeIcon}
              label="Dark"
              selected={isSelected('dark')}
              isDark={isDark}
              onSelect={(value) => handleUpdate('theme', value)}
            />
            <ThemeButton
              value="auto"
              icon={AutoModeIcon}
              label="System"
              selected={isSelected('auto')}
              isDark={isDark}
              onSelect={(value) => handleUpdate('theme', value)}
            />
          </Box>
        </Box>

        <Divider />

        {/* Default Settings Section */}
        <Box sx={{ p: 2.5 }}>
          <SectionTitle>Default Settings</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Document Limit"
              type="number"
              value={settings.defaultDocLimit}
              onChange={(e) => handleUpdate('defaultDocLimit', parseInt(e.target.value) || 50)}
              size="small"
              inputProps={{ min: 1, max: 1000 }}
              helperText="Documents to fetch per query (1-1000)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default',
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel>Default View</InputLabel>
                <Select
                  value={settings.defaultViewType}
                  label="Default View"
                  onChange={(e) => handleUpdate('defaultViewType', e.target.value)}
                  sx={{ bgcolor: 'background.default' }}
                >
                  <MenuItem value="table">Table</MenuItem>
                  <MenuItem value="tree">Tree</MenuItem>
                  <MenuItem value="json">JSON</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel>Font Size</InputLabel>
                <Select
                  value={settings.fontSize}
                  label="Font Size"
                  onChange={(e) => handleUpdate('fontSize', e.target.value)}
                  sx={{ bgcolor: 'background.default' }}
                >
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Data Type Display Section */}
        <Box sx={{ p: 2.5 }}>
          <SectionTitle>Data Formatting</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl size="small">
              <InputLabel>Timestamp Format</InputLabel>
              <Select
                value={settings.timestampFormat}
                label="Timestamp Format"
                onChange={(e) => handleUpdate('timestampFormat', e.target.value)}
                sx={{ bgcolor: 'background.default' }}
              >
                <MenuItem value="iso">ISO 8601 (2024-01-15T10:30:00Z)</MenuItem>
                <MenuItem value="local">Local (Jan 15, 2024 10:30 AM)</MenuItem>
                <MenuItem value="utc">UTC (Mon, 15 Jan 2024 10:30:00 GMT)</MenuItem>
                <MenuItem value="unix">Unix Timestamp (1705315800)</MenuItem>
                <MenuItem value="relative">Relative (2 hours ago)</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel>Number Format</InputLabel>
                <Select
                  value={settings.numberFormat}
                  label="Number Format"
                  onChange={(e) => handleUpdate('numberFormat', e.target.value)}
                  sx={{ bgcolor: 'background.default' }}
                >
                  <MenuItem value="auto">Auto (as-is)</MenuItem>
                  <MenuItem value="fixed">Fixed Decimal</MenuItem>
                  <MenuItem value="thousands">Separators (1,234.56)</MenuItem>
                  <MenuItem value="scientific">Scientific (1.23e+4)</MenuItem>
                </Select>
              </FormControl>
              {settings.numberFormat === 'fixed' && (
                <TextField
                  label="Decimals"
                  type="number"
                  value={settings.numberDecimalPlaces}
                  onChange={(e) =>
                    handleUpdate('numberDecimalPlaces', Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                  size="small"
                  inputProps={{ min: 0, max: 10 }}
                  sx={{
                    width: 100,
                    '& .MuiOutlinedInput-root': { bgcolor: 'background.default' },
                  }}
                />
              )}
            </Box>

            <FormControl size="small">
              <InputLabel>GeoPoint Format</InputLabel>
              <Select
                value={settings.geopointFormat}
                label="GeoPoint Format"
                onChange={(e) => handleUpdate('geopointFormat', e.target.value)}
                sx={{ bgcolor: 'background.default' }}
              >
                <MenuItem value="decimal">Decimal (37.7749, -122.4194)</MenuItem>
                <MenuItem value="dms">DMS (37&deg;46&apos;29.6&quot;N 122&deg;25&apos;9.8&quot;W)</MenuItem>
                <MenuItem value="compact">Compact (37.77,-122.42)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider />

        {/* Behavior Section */}
        <Box sx={{ p: 2.5 }}>
          <SectionTitle>Behavior</SectionTitle>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              bgcolor: 'background.default',
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoExpandDocuments}
                  onChange={(e) => handleUpdate('autoExpandDocuments', e.target.checked)}
                  size="small"
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem' }}>Auto-expand documents in tree view</Typography>}
              sx={{ px: 2, py: 1, m: 0 }}
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showTypeColumn}
                  onChange={(e) => handleUpdate('showTypeColumn', e.target.checked)}
                  size="small"
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem' }}>Show Type column in tree view</Typography>}
              sx={{ px: 2, py: 1, m: 0 }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Button
          onClick={handleReset}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          Reset to Defaults
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose} variant="contained" size="small" disableElevation>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog;
