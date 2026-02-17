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
    expect(cells).toContain({ row: 1, col: 1 });
    expect(cells).toContain({ row: 2, col: 3 });
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
});
