import { Injectable } from '@angular/core';
import { TableCell } from '../models/table-cell.model';
import { GridDimensions } from '../models/grid-dimensions.model';
import { TableLayoutConfig } from '../models/table-layout-config.model';

/**
 * Service for table layout selection logic and utilities
 */
@Injectable({ providedIn: 'root' })
export class TableLayoutService {
  /**
   * Calculate all active cells based on hover position
   * Active cells are all cells from (1,1) to (hoverRow, hoverCol)
   */
  calculateActiveCells(hoverRow: number, hoverCol: number): TableCell[] {
    const cells: TableCell[] = [];
    for (let r = 1; r <= hoverRow; r++) {
      for (let c = 1; c <= hoverCol; c++) {
        cells.push({ row: r, col: c });
      }
    }
    return cells;
  }

  /**
   * Check if a specific cell should be marked as active
   * A cell is active if it's within the hover selection rectangle
   */
  isCellActive(
    cell: TableCell,
    hoveredCell: TableCell | null
  ): boolean {
    if (!hoveredCell) return false;
    return cell.row <= hoveredCell.row && cell.col <= hoveredCell.col;
  }

  /**
   * Determine if grid should expand based on hover position
   * Grid expands when hovering at or beyond current edges (up to max limits)
   */
  shouldExpandGrid(
    currentDimensions: GridDimensions,
    hoverPosition: TableCell,
    maxDimensions: GridDimensions
  ): { expandRows: boolean; expandCols: boolean } {
    const expandRows =
      hoverPosition.row >= currentDimensions.rows &&
      currentDimensions.rows < maxDimensions.rows;

    const expandCols =
      hoverPosition.col >= currentDimensions.cols &&
      currentDimensions.cols < maxDimensions.cols;

    return { expandRows, expandCols };
  }

  /**
   * Calculate responsive cell size based on container dimensions
   * Ensures cell size stays within min/max bounds
   */
  calculateResponsiveCellSize(
    containerWidth: number,
    columns: number,
    minSize: number,
    maxSize: number,
    gap: number = 2
  ): number {
    const totalGap = (columns + 1) * gap;
    const availableWidth = containerWidth - totalGap;
    const calculatedSize = availableWidth / columns;
    return Math.max(minSize, Math.min(maxSize, calculatedSize));
  }

  /**
   * Format selection as text (e.g., "5 × 7")
   */
  formatSelectionText(rows: number, cols: number): string {
    return `${rows} × ${cols}`;
  }

  /**
   * Validate and normalize configuration values
   * Ensures all values are within acceptable ranges
   */
  validateConfig(config: Partial<TableLayoutConfig>): TableLayoutConfig {
    const rows = Math.max(3, Math.min(20, config.rows ?? 10));
    const cols = Math.max(3, Math.min(20, config.cols ?? 10));
    const maxRows = Math.max(rows, Math.min(20, config.maxRows ?? 20));
    const maxCols = Math.max(cols, Math.min(20, config.maxCols ?? 20));

    return {
      rows,
      cols,
      maxRows,
      maxCols,
      showFooter: config.showFooter ?? true,
      theme: config.theme ?? 'auto',
      cellSize: Math.max(20, Math.min(40, config.cellSize ?? 24)),
      expandable: config.expandable ?? true,
      responsive: config.responsive ?? true,
      minCellSize: Math.max(16, config.minCellSize ?? 20),
      ariaLabel: config.ariaLabel ?? 'Table layout selector'
    };
  }

  /**
   * Generate array of numbers from 1 to n (for template iteration)
   */
  generateRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  /**
   * Get ARIA label for a specific cell
   */
  getCellAriaLabel(row: number, col: number): string {
    return `${row} row${row > 1 ? 's' : ''} by ${col} column${col > 1 ? 's' : ''}`;
  }
}
