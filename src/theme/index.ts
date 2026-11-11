import '@/global.css';
import { Platform } from 'react-native';

/**
 * GatedPlus Design Tokens & Theme System
 * Structured following the reference pattern with complete type-safety.
 */

export const colors = {
  financial: { background: '#131E30', surface: '#303B4D', border: '#536073', accent: '#FF4E58', primary: '#DF1926', badge: '#392330', badgeBorder: '#702333', muted: '#9AADC2' },
  legal: {
    background: '#081824',
    surface: '#0B1E30',
    featured: '#102D47',
    border: '#173952',
    accent: '#0DB98B',
    accentSoft: '#0B343A',
    muted: '#99AABC',
    secondary: '#152532',
    secondaryBorder: '#344553',
  },
  serviceTones: {
    green: { foreground: '#07845B', background: '#F0FDF4', border: '#D1FAE0', iconBackground: '#DCFCE7' },
    blue: { foreground: '#008ACB', background: '#F0F9FF', border: '#DCEFFF', iconBackground: '#E0F2FE' },
    orange: { foreground: '#F05A0A', background: '#FFF8EF', border: '#FFEDD5', iconBackground: '#FFEDD5' },
  },
  // Brand Greens
  primary: '#07845B',
  primaryDark: '#006747',
  primaryLight: '#DDF5EA',
  primarySoft: '#F0FBF6',
  green: '#07845B',
  darkGreen: '#006747',
  paleGreen: '#E8F7F0',
  lightGreen: '#EAF7F1',

  // Brand Blues & Navies
  navy: '#102B46',
  navyDark: '#0B1F33',
  navyLight: '#E8ECF8',
  blue: '#2369E8',
  blueLight: '#EAF3FF',

  // Accents & Feedback
  accent: '#07845B',
  success: '#07845B',
  successLight: '#DDF5EA',
  warning: '#B7791F',
  warningLight: '#FFF5D6',
  error: '#C53030',
  errorLight: '#FDE8E8',

  // Surfaces & Backgrounds
  background: '#F0F6FC',
  backgroundAlt: '#F7F9FC',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Text
  textPrimary: '#142B43',
  textSecondary: '#667085',
  textMuted: '#74849A',
  muted: '#74849A',

  // Borders
  border: '#DCE5EF',
  borderStrong: '#D0D5DD',

  // Primitives
  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
  // Numeric aliases for compatibility
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const typography = {
  hero: { fontSize: 30, fontWeight: '700' as const, lineHeight: 36 },
  h1: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 18 },
};

export const shadows = {
  card: {
    shadowColor: colors.navyDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: colors.navyDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  primary: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 6,
  },
};

// Backwards-compatible constants for existing Expo template components
export const Colors = {
  light: {
    text: '#142B43',
    background: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#FFFFFF',
    background: '#102B46',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = spacing;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export default {
  colors,
  spacing,
  radii,
  typography,
  shadows,
  Colors,
  Fonts,
  Spacing,
  BottomTabInset,
  MaxContentWidth,
};

