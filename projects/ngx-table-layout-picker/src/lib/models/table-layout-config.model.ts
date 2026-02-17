import { ThemeMode } from './theme.model';

/**
 * Configuration options for the table layout picker
 */
export interface TableLayoutConfig {
  /** Initial number of rows (default: 10) */
  rows?: number;
  /** Initial number of columns (default: 10) */
  cols?: number;
  /** Maximum number of rows (default: 20) */
  maxRows?: number;
  /** Maximum number of columns (default: 20) */
  maxCols?: number;
  /** Whether to show the footer with selection info (default: true) */
  showFooter?: boolean;
  /** Theme mode: 'light', 'dark', or 'auto' (default: 'auto') */
  theme?: ThemeMode;
  /** Size of each cell in pixels (default: 24) */
  cellSize?: number;
  /** Enable dynamic grid expansion when hovering edges (default: true) */
  expandable?: boolean;
  /** Enable responsive behavior for mobile devices (default: true) */
  responsive?: boolean;
  /** Minimum cell size for responsive scaling (default: 20) */
  minCellSize?: number;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}
