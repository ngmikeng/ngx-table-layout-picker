/**
 * Responsive breakpoint definitions
 */
export const BREAKPOINTS = {
  mobile: {
    max: 576,
    label: 'Mobile'
  },
  tablet: {
    min: 577,
    max: 1024,
    label: 'Tablet'
  },
  desktop: {
    min: 1025,
    label: 'Desktop'
  }
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

/**
 * Recommended grid dimensions per breakpoint
 */
export const GRID_DIMENSIONS: Record<BreakpointName, { rows: number; cols: number }> = {
  mobile: { rows: 6, cols: 6 },
  tablet: { rows: 8, cols: 8 },
  desktop: { rows: 10, cols: 10 }
};

/**
 * Recommended cell sizes per breakpoint
 */
export const CELL_SIZES: Record<BreakpointName, number> = {
  mobile: 32,
  tablet: 28,
  desktop: 24
};

/**
 * Gap sizes per breakpoint
 */
export const GAP_SIZES: Record<BreakpointName, number> = {
  mobile: 4,
  tablet: 3,
  desktop: 2
};
