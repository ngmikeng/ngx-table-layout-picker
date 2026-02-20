import { TestBed } from '@angular/core/testing';
import { ResponsiveService } from './responsive.service';

describe('ResponsiveService', () => {
  let service: ResponsiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect current breakpoint based on window width', () => {
    const breakpoint = service.currentBreakpoint();
    expect(['mobile', 'tablet', 'desktop']).toContain(breakpoint);
  });

  it('should provide convenience breakpoint checks', () => {
    const isMobile = service.isMobile();
    const isTablet = service.isTablet();
    const isDesktop = service.isDesktop();
    
    // One and only one should be true
    const trueCount = [isMobile, isTablet, isDesktop].filter(v => v).length;
    expect(trueCount).toBe(1);
  });

  it('should detect touch device', () => {
    const isTouchDevice = service.isTouchDevice();
    expect(typeof isTouchDevice).toBe('boolean');
  });

  it('should get recommended grid size', () => {
    const gridSize = service.getRecommendedGridSize();
    expect(gridSize).toBeDefined();
    expect(gridSize.rows).toBeGreaterThan(0);
    expect(gridSize.cols).toBeGreaterThan(0);
  });

  it('should get recommended cell size', () => {
    const cellSize = service.getRecommendedCellSize();
    expect(cellSize).toBeGreaterThan(0);
  });

  it('should get recommended gap size', () => {
    const gapSize = service.getRecommendedGapSize();
    expect(gapSize).toBeGreaterThan(0);
  });

  it('should calculate responsive cell size', () => {
    const cellSize = service.calculateCellSize(600, 10, 20, 40);
    expect(cellSize).toBeGreaterThanOrEqual(20);
    expect(cellSize).toBeLessThanOrEqual(40);
  });

  it('should get min touch target size based on device', () => {
    const minSize = service.getMinTouchTargetSize();
    expect(minSize).toBeGreaterThan(0);
  });

  it('should detect narrow viewport', () => {
    const isNarrow = service.isNarrowViewport();
    expect(typeof isNarrow).toBe('boolean');
  });

  it('should get viewport dimensions', () => {
    const dimensions = service.getViewportDimensions();
    expect(dimensions.width).toBeGreaterThan(0);
    expect(dimensions.height).toBeGreaterThan(0);
  });

  it('should create debounced function', (done: any) => {
    let callCount = 0;
    const debouncedFn = service.debounce(() => {
      callCount++;
    }, 100);
    
    debouncedFn();
    debouncedFn();
    debouncedFn();
    
    expect(callCount).toBe(0);
    
    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 150);
  });
});
