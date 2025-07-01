import dayjs from 'dayjs';

export const INTEREST_RATE = 0.05;
export const DAYS_IN_YEAR = 365;
// Set a fixed date for 'TODAY' to ensure calculations are consistent regardless of when the app is viewed.
// This is set to the date we agreed upon for projecting loan balances. 
export const TODAY = dayjs("2025-07-01");

export const DATE_FORMATS = {
  DISPLAY: "MMMM D, YYYY",
  ISO: "YYYY-MM-DD",
  INPUT: "MM/DD/YYYY",
} as const;

export const BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px',
  WIDE: '1200px',
} as const;

export const COLORS = {
  SUCCESS: 'hsl(120, 70%, 45%)',
  ERROR: 'hsl(0, 70%, 45%)',
  WARNING: 'hsl(40, 70%, 45%)',
  INFO: 'hsl(200, 70%, 45%)',
} as const;
