import { createTheme, PaletteOptions } from '@mui/material';
import { MONOSPACE_FONT_FAMILY } from '../../shared/utils/constants';
import {
  darkPalette,
  lightPalette,
  getSyntaxColors,
  getTableColors,
  getSidebarColors,
  getEditorColors,
} from './palette';
import { getComponentOverrides, ThemePalette, TableColors } from './components';

// Type definitions for custom theme extensions
export interface SyntaxColors {
  string: string;
  number: string;
  boolean: string;
  null: string;
  key: string;
  bracket: string;
  comment: string;
  keyword: string;
  function: string;
  operator: string;
  variable: string;
  property: string;
  builtin: string;
  params: string;
  literal: string;
  attr: string;
}

export interface TableThemeColors {
  headerBg: string;
  headerText: string;
  rowBg: string;
  rowAltBg: string;
  rowHover: string;
  rowSelected: string;
  border: string;
  cellText: string;
}

export interface SidebarColors {
  bg: string;
  hover: string;
  selected: string;
  border: string;
}

export interface EditorColors {
  bg: string;
  gutter: string;
  lineNumber: string;
  selection: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      syntax: SyntaxColors;
      table: TableThemeColors;
      sidebar: SidebarColors;
      editor: EditorColors;
    };
  }
  interface ThemeOptions {
    custom?: {
      syntax?: SyntaxColors;
      table?: TableThemeColors;
      sidebar?: SidebarColors;
      editor?: EditorColors;
    };
  }
  interface TypographyVariants {
    mono: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    mono?: React.CSSProperties;
  }
}

export const createAppTheme = (mode: 'light' | 'dark', fontSize: 'small' | 'medium' | 'large') => {
  const isDark = mode === 'dark';
  const palette = isDark ? darkPalette : lightPalette;

  // Derived colors
  const syntaxColors = getSyntaxColors(isDark);
  const tableColors = getTableColors(isDark);
  const sidebarColors = getSidebarColors(isDark);
  const editorColors = getEditorColors(isDark);

  // Cast palette for component overrides
  const themePalette: ThemePalette = {
    background: palette.background,
    divider: palette.divider,
    action: palette.action,
  };

  const tableColorsForComponents: TableColors = {
    border: tableColors.border,
    headerBg: tableColors.headerBg,
  };

  return createTheme({
    palette: palette as PaletteOptions,
    custom: {
      syntax: syntaxColors,
      table: tableColors,
      sidebar: sidebarColors,
      editor: editorColors,
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: fontSize === 'small' ? 12 : fontSize === 'large' ? 14 : 13,
      mono: {
        fontFamily: MONOSPACE_FONT_FAMILY,
      },
    },
    shape: { borderRadius: 6 },
    components: getComponentOverrides(themePalette, tableColorsForComponents, isDark),
  });
};
