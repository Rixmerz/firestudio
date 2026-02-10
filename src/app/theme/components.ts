import { Components, Theme } from '@mui/material/styles';

export interface ThemePalette {
  background: {
    default: string;
    paper: string;
    elevated: string;
  };
  divider: string;
  action: {
    selected: string;
    hover: string;
  };
}

export interface TableColors {
  border: string;
  headerBg: string;
}

export const getComponentOverrides = (
  palette: ThemePalette,
  tableColors: TableColors,
  isDark: boolean,
): Components<Omit<Theme, 'components'>> => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: { margin: 0, padding: 0, overflow: 'hidden' },
      '*::-webkit-scrollbar': { width: '8px', height: '8px' },
      '*::-webkit-scrollbar-track': { background: 'transparent' },
      '*::-webkit-scrollbar-thumb': {
        background: isDark ? '#30363d' : '#d0d7de',
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        background: isDark ? '#484f58' : '#afb8c1',
      },
      '::selection': {
        background: isDark ? '#1f6feb66' : '#0969da33',
        color: isDark ? '#e6edf3' : '#1f2328',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 500 },
      contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
    },
  },
  MuiToggleButton: {
    styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } },
  },
  MuiIconButton: {
    styleOverrides: { root: { borderRadius: 6 } },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { backgroundColor: palette.background.elevated, backgroundImage: 'none' },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundColor: palette.background.elevated,
        backgroundImage: 'none',
        border: `1px solid ${palette.divider}`,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: isDark ? '#484f58' : '#1f2328',
        fontSize: '0.75rem',
      },
    },
  },
  MuiPaper: {
    styleOverrides: { root: { backgroundImage: 'none' } },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: { backgroundColor: palette.background.paper, backgroundImage: 'none' },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: { borderColor: tableColors.border },
      head: { backgroundColor: tableColors.headerBg, fontWeight: 600 },
    },
  },
  MuiChip: {
    styleOverrides: { root: { fontWeight: 500 } },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root fieldset': { borderColor: palette.divider },
      },
    },
  },
  MuiDivider: {
    styleOverrides: { root: { borderColor: palette.divider } },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        '&.Mui-selected': { backgroundColor: palette.action.selected },
        '&:hover': { backgroundColor: palette.action.hover },
      },
    },
  },
});
