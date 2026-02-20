import { TestBed } from '@angular/core/testing';
import { TableLayoutService } from './table-layout.service';

describe('TableLayoutService', () => {
  let service: TableLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate active cells correctly', () => {
    const cells = service.calculateActiveCells(2, 3);
    expect(cells.length).toBe(6); // 2 rows × 3 cols = 6 cells
    expect(cells).toContainEqual({ row: 1, col: 1 });
    expect(cells).toContainEqual({ row: 2, col: 3 });
  });

  it('should determine if cell is active', () => {
    const hoveredCell = { row: 3, col: 4 };
    
    expect(service.isCellActive({ row: 2, col: 3 }, hoveredCell)).toBe(true);
    expect(service.isCellActive({ row: 4, col: 3 }, hoveredCell)).toBe(false);
    expect(service.isCellActive({ row: 2, col: 5 }, hoveredCell)).toBe(false);
    expect(service.isCellActive({ row: 3, col: 4 }, hoveredCell)).toBe(true);
  });

  it('should format selection text correctly', () => {
    expect(service.formatSelectionText(5, 7)).toBe('5 × 7');
    expect(service.formatSelectionText(1, 1)).toBe('1 × 1');
  });

  it('should validate config with defaults', () => {
    const config = service.validateConfig({});
    expect(config.rows).toBe(10);
    expect(config.cols).toBe(10);
    expect(config.maxRows).toBe(20);
    expect(config.maxCols).toBe(20);
    expect(config.showFooter).toBe(true);
    expect(config.theme).toBe('auto');
  });

  it('should validate config with bounds', () => {
    const config = service.validateConfig({
      rows: 1,      // too small, should be 3
      cols: 25,     // too large, should be 20
      cellSize: 50  // too large, should be 40
    });
    expect(config.rows).toBe(3);
    expect(config.cols).toBe(20);
    expect(config.cellSize).toBe(40);
  });

  it('should generate range correctly', () => {
    const range = service.generateRange(5);
    expect(range).toEqual([1, 2, 3, 4, 5]);
  });

  it('should calculate responsive cell size', () => {
    const cellSize = service.calculateResponsiveCellSize(300, 10, 20, 40, 2);
    expect(cellSize).toBeGreaterThanOrEqual(20);
    expect(cellSize).toBeLessThanOrEqual(40);
  });

  it('should get cell aria label', () => {
    expect(service.getCellAriaLabel(1, 1)).toBe('1 row by 1 column');
    expect(service.getCellAriaLabel(5, 7)).toBe('5 rows by 7 columns');
  });

  describe('calculateOptimalDimensions', () => {
    it('should expand when hovering at edges', () => {
      const result = service.calculateOptimalDimensions(
        { rows: 10, cols: 10 },
        { row: 10, col: 10 },
        { rows: 10, cols: 10 },
        { rows: 20, cols: 20 },
        2
      );
      expect(result.rows).toBe(11);
      expect(result.cols).toBe(11);
    });

    it('should expand to maxDimensions but not beyond', () => {
      const result = service.calculateOptimalDimensions(
        { rows: 19, cols: 19 },
        { row: 20, col: 20 },
        { rows: 10, cols: 10 },
        { rows: 20, cols: 20 },
        2
      );
      expect(result.rows).toBe(20);
      expect(result.cols).toBe(20);
    });

    it('should shrink when hovering far from edges', () => {
      const result = service.calculateOptimalDimensions(
        { rows: 15, cols: 15 },
        { row: 8, col: 8 },
        { rows: 10, cols: 10 },
        { rows: 20, cols: 20 },
        2
      );
      expect(result.rows).toBe(10); // shrinks to max of (minRows=10, hover+1=9)
      expect(result.cols).toBe(10);
    });

    it('should not shrink below minDimensions', () => {
      const result = service.calculateOptimalDimensions(
        { rows: 10, cols: 10 },
        { row: 3, col: 3 },
        { rows: 10, cols: 10 },
        { rows: 20, cols: 20 },
        2
      );
      expect(result.rows).toBe(10); // should not go below minRows
      expect(result.cols).toBe(10); // should not go below minCols
    });

    it('should respect shrinkThreshold', () => {
      // With threshold=2, hovering at row 13 in a 15-row grid
      // maxNeeded = 13 + 2 = 15, so no shrink
      const result1 = service.calculateOptimalDimensions(
        { rows: 15, cols: 15 },
        { row: 13, col: 13 },
        { rows: 10, cols: 10 },
        { rows: 20, cols: 20 },
        2
      );
      expect(result1.rows).toBe(15); // no shrink
      expect(result1.cols).toBe(15); // no shrink

      // With threshold=2, hovering at row 12 in a 15-row grid
      // maxNeeded = 12 + 2 = 14, so shrink to 13
      const result2 = service.calculateOptimalDimensions(
        { rows: 15, cols: 15 },
        { row: 12, col: 12 },
        { rows: 10, cols: 10 },
        { rows: 20, cols: 20 },
        2
      );
      expect(result2.rows).toBe(13); // shrink to hover + 1
      expect(result2.cols).toBe(13);
    });

    it('should handle expansion and shrinking independently for rows and cols', () => {
      const result = service.calculateOptimalDimensions(
        { rows: 15, cols: 10 },
        { row: 8, col: 10 },
        { rows: 10, cols: 10 },
        { rows: 20, cols: 20 },
        2
      );
      expect(result.rows).toBe(10); // shrink rows
      expect(result.cols).toBe(11); // expand cols
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero or negative cell counts', () => {
      const cells = service.calculateActiveCells(0, 0);
      expect(cells.length).toBe(0);
    });

    it('should handle large grid calculations efficiently', () => {
      const startTime = Date.now();
      const cells = service.calculateActiveCells(20, 20);
      const endTime = Date.now();
      
      expect(cells.length).toBe(400);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    it('should handle null or undefined in isCellActive', () => {
      expect(service.isCellActive({ row: 1, col: 1 }, null)).toBe(false);
    });

    it('should validate minimum cell size', () => {
      const config = service.validateConfig({ cellSize: 10 });
      expect(config.cellSize).toBeGreaterThanOrEqual(20);
    });

    it('should validate maximum cell size', () => {
      const config = service.validateConfig({ cellSize: 100 });
      expect(config.cellSize).toBeLessThanOrEqual(40);
    });

    it('should handle responsive cell size with very narrow container', () => {
      const size = service.calculateResponsiveCellSize(100, 10, 20, 40, 2);
      expect(size).toBe(20); // Should enforce minimum
    });

    it('should handle responsive cell size with very wide container', () => {
      const size = service.calculateResponsiveCellSize(2000, 5, 20, 40, 2);
      expect(size).toBe(40); // Should enforce maximum
    });
  });

  describe('Utility Methods', () => {
    it('should generate correct range', () => {
      const range = service.generateRange(5);
      expect(range).toEqual([1, 2, 3, 4, 5]);
      expect(range.length).toBe(5);
    });

    it('should generate empty range for zero', () => {
      const range = service.generateRange(0);
      expect(range).toEqual([]);
    });

    it('should format selection text with multiplication symbol', () => {
      const text = service.formatSelectionText(5, 7);
      expect(text).toBe('5 × 7');
      expect(text).toContain('×');
    });

    it('should get cell ARIA label with correct pluralization', () => {
      expect(service.getCellAriaLabel(1, 1)).toBe('1 row by 1 column');
      expect(service.getCellAriaLabel(1, 2)).toBe('1 row by 2 columns');
      expect(service.getCellAriaLabel(2, 1)).toBe('2 rows by 1 column');
      expect(service.getCellAriaLabel(5, 7)).toBe('5 rows by 7 columns');
    });
  });

  describe('Configuration Validation', () => {
    it('should provide all default values', () => {
      const config = service.validateConfig({});
      expect(config.rows).toBe(10);
      expect(config.cols).toBe(10);
      expect(config.maxRows).toBe(20);
      expect(config.maxCols).toBe(20);
      expect(config.showFooter).toBe(true);
      expect(config.theme).toBe('auto');
      expect(config.cellSize).toBe(24);
      expect(config.expandable).toBe(true);
      expect(config.responsive).toBe(true);
      expect(config.minCellSize).toBe(20);
      expect(config.ariaLabel).toBe('Table layout selector');
    });

    it('should ensure maxRows is at least as large as rows', () => {
      const config = service.validateConfig({ rows: 15, maxRows: 10 });
      expect(config.maxRows).toBeGreaterThanOrEqual(config.rows!);
    });

    it('should ensure maxCols is at least as large as cols', () => {
      const config = service.validateConfig({ cols: 15, maxCols: 10 });
      expect(config.maxCols).toBeGreaterThanOrEqual(config.cols!);
    });

    it('should preserve valid custom values', () => {
      const config = service.validateConfig({
        rows: 8,
        cols: 12,
        cellSize: 30,
        showFooter: false,
        theme: 'dark'
      });
      expect(config.rows).toBe(8);
      expect(config.cols).toBe(12);
      expect(config.cellSize).toBe(30);
      expect(config.showFooter).toBe(false);
      expect(config.theme).toBe('dark');
    });
  });
});
