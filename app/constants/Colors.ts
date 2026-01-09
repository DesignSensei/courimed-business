// constants/Colors.ts

const palette = {
  shades: {
    white: "#ffffff",
    black: "#000000",
  },

  primary: {
    50: "#fcf9f7",
    75: "#fff4ec",
    100: "#ffe0c0",
    200: "#ffcc99",
    300: "#ffb866",
    400: "#ffa433",
    500: "#dd5d05",
    600: "#c55104",
    700: "#ad4503",
    800: "#933902",
    900: "#792d01",
    999: "#FF6F1E",
  },

  secondary: {
    100: "#f7e4db",
    200: "#f2d1c1",
    300: "#ecbfa7",
    400: "#e6ac8d",
    500: "#d88b6e",
    600: "#c97b60",
    700: "#b96b52",
    800: "#935038",
    900: "#7a4230",
  },

  neutral: {
    100: "#f5f5f5",
    200: "#e0e0e0",
    300: "#cccccc",
    400: "#b3b3b3",
    500: "#999999",
    600: "#808080",
    700: "#666666",
    800: "#4d4d4d",
    900: "#333333",
  },

  success: {
    100: "#e6f9f0",
    200: "#bff2d9",
    300: "#8debc1",
    400: "#57e1a7",
    500: "#2dcc91",
    600: "#1fa176",
    700: "#167b5c",
    800: "#0f5542",
    900: "#093329",
  },

  warning: {
    100: "#fff8e6",
    200: "#ffeabf",
    300: "#ffdc99",
    400: "#ffcd66",
    500: "#ffbb33",
    600: "#e6a800",
    700: "#b38700",
    800: "#806600",
    900: "#4d4400",
  },

  error: {
    100: "#ffebee",
    200: "#ffcdd2",
    300: "#ef9a9a",
    400: "#e57373",
    500: "#d32f2f",
    600: "#c62828",
    700: "#b71c1c",
    800: "#9a0000",
    900: "#750000",
  },
};

export const Colors = {
  // Complete palette for direct access when needed
  palette,

  // Light mode semantic colors
  light: {
    background: palette.shades.white,
    surface: palette.neutral[100],
    card: palette.shades.white,
    
    text: palette.neutral[900],
    textSecondary: palette.neutral[600],
    textTertiary: palette.neutral[500],
    
    primary: palette.primary[500],
    primaryLight: palette.primary[100],
    primaryDark: palette.primary[700],
    
    secondary: palette.secondary[500],
    secondaryLight: palette.secondary[100],
    
    border: palette.neutral[200],
    borderLight: palette.neutral[100],
    borderDark: palette.neutral[300],
    
    success: palette.success[500],
    successLight: palette.success[100],
    successText: palette.success[700],
    
    warning: palette.warning[500],
    warningLight: palette.warning[100],
    warningText: palette.warning[800],
    
    error: palette.error[500],
    errorLight: palette.error[100],
    errorText: palette.error[700],
    
    // Status colors
    active: palette.success[500],
    inactive: palette.neutral[400],
    pending: palette.warning[500],
    
    // Medical-specific
    tempSensitive: "#4A90E2", // Cool blue for temperature-sensitive items
    urgent: palette.error[500],
  },

  // Dark mode semantic colors
  dark: {
    background: "#121212",
    surface: "#1e1e1e",
    card: "#2d2d2d",
    
    text: palette.neutral[100],
    textSecondary: palette.neutral[400],
    textTertiary: palette.neutral[500],
    
    primary: palette.primary[400], // Lighter orange for visibility
    primaryLight: palette.primary[200],
    primaryDark: palette.primary[600],
    
    secondary: palette.secondary[400],
    secondaryLight: palette.secondary[200],
    
    border: palette.neutral[700],
    borderLight: palette.neutral[800],
    borderDark: palette.neutral[600],
    
    success: palette.success[400],
    successLight: palette.success[800],
    successText: palette.success[300],
    
    warning: palette.warning[400],
    warningLight: palette.warning[800],
    warningText: palette.warning[300],
    
    error: palette.error[400],
    errorLight: palette.error[800],
    errorText: palette.error[300],
    
    // Status colors
    active: palette.success[400],
    inactive: palette.neutral[600],
    pending: palette.warning[400],
    
    // Medical-specific
    tempSensitive: "#64B5F6", // Lighter blue for dark mode
    urgent: palette.error[400],
  },
};

// Type definitions for autocomplete
export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;

// Helper function to get themed colors
export const getThemedColors = (scheme: ColorScheme): ThemeColors => {
  return Colors[scheme];
};

export default Colors;