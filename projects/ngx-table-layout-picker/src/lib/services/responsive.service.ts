import { Injectable, signal, computed } from '@angular/core';
import { BREAKPOINTS, GRID_DIMENSIONS, CELL_SIZES, GAP_SIZES, BreakpointName } from '../constants/responsive.constants';

/**
 * Service for responsive behavior and breakpoint management
 * Provides reactive breakpoint detection and responsive recommendations
 */
@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private readonly windowWidth = signal<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  
  /**
   * Current breakpoint based on window width
   */
  public readonly currentBreakpoint = computed<BreakpointName>(() => {
    const width = this.windowWidth();
    if (width <= BREAKPOINTS.mobile.max) {
      return 'mobile';
    } else if (width <= BREAKPOINTS.tablet.max) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  });
  
  /**
   * Convenience computed properties for each breakpoint
   */
  public readonly isMobile = computed(() => this.currentBreakpoint() === 'mobile');
  public readonly isTablet = computed(() => this.currentBreakpoint() === 'tablet');
  public readonly isDesktop = computed(() => this.currentBreakpoint() === 'desktop');
  
  /**
   * Detect if device supports touch
   */
  public readonly isTouchDevice = signal<boolean>(
    typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
  
  /**
   * Detect if device is in landscape orientation
   */
  public readonly isLandscape = signal<boolean>(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight
  );
  
  constructor() {
    this.setupResizeListener();
    this.setupOrientationListener();
  }
  
  /**
   * Set up window resize listener
   */
  private setupResizeListener(): void {
    if (typeof window === 'undefined') return;
    
    const updateWidth = () => {
      this.windowWidth.set(window.innerWidth);
    };
    
    window.addEventListener('resize', updateWidth);
  }
  
  /**
   * Set up orientation change listener
   */
  private setupOrientationListener(): void {
    if (typeof window === 'undefined') return;
    
    const updateOrientation = () => {
      this.isLandscape.set(window.innerWidth > window.innerHeight);
    };
    
    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);
  }
  
  /**
   * Get recommended grid size for current breakpoint
   */
  getRecommendedGridSize(): { rows: number; cols: number } {
    const breakpoint = this.currentBreakpoint();
    return { ...GRID_DIMENSIONS[breakpoint] };
  }
  
  /**
   * Get recommended cell size for current breakpoint
   */
  getRecommendedCellSize(): number {
    const breakpoint = this.currentBreakpoint();
    return CELL_SIZES[breakpoint];
  }
  
  /**
   * Get recommended gap size for current breakpoint
   */
  getRecommendedGapSize(): number {
    const breakpoint = this.currentBreakpoint();
    return GAP_SIZES[breakpoint];
  }
  
  /**
   * Calculate responsive cell size based on container width
   */
  calculateCellSize(
    containerWidth: number,
    columns: number,
    minSize: number,
    maxSize: number
  ): number {
    const gap = this.getRecommendedGapSize();
    const totalGap = (columns + 1) * gap;
    const availableWidth = containerWidth - totalGap;
    const calculatedSize = Math.floor(availableWidth / columns);
    return Math.max(minSize, Math.min(maxSize, calculatedSize));
  }
  
  /**
   * Get minimum touch target size (iOS guidelines: 44px)
   */
  getMinTouchTargetSize(): number {
    return this.isTouchDevice() ? 44 : 20;
  }
  
  /**
   * Check if viewport is in narrow mode (mobile portrait)
   */
  isNarrowViewport(): boolean {
    return this.isMobile() && !this.isLandscape();
  }
  
  /**
   * Get viewport dimensions
   */
  getViewportDimensions(): { width: number; height: number } {
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  
  /**
   * Debounce helper for resize handlers
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}
