import { TableCell } from './table-cell.model';

/**
 * Represents a selected table layout
 */
export interface TableSelection {
  /** Number of rows selected */
  rows: number;
  /** Number of columns selected */
  cols: number;
  /** Optional array of all selected cells */
  cells?: TableCell[];
  /** Timestamp of selection */
  timestamp?: Date;
}
