# Responsive Design Strategy

## Responsive Breakpoints

### Breakpoint Definitions
```typescript
// responsive.constants.ts
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
```

### SCSS Breakpoint Mixins
```scss
// _responsive-mixins.scss
$breakpoint-mobile: 576px;
$breakpoint-tablet: 1024px;

@mixin mobile {
  @media (max-width: #{$breakpoint-mobile}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$breakpoint-mobile + 1}) and (max-width: #{$breakpoint-tablet}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$breakpoint-tablet + 1}) {
    @content;
  }
}

@mixin tablet-and-up {
  @media (min-width: #{$breakpoint-mobile + 1}) {
    @content;
  }
}

@mixin mobile-and-tablet {
  @media (max-width: #{$breakpoint-tablet}) {
    @content;
  }
}
```

---

## Mobile-First Approach

### Component Responsive Behavior

#### Mobile (< 576px)
**Grid Configuration**:
- Default grid: 6×6 (reduced from 10×10)
- Cell size: 32px (increased for touch)
- Gap between cells: 4px
- Touch target minimum: 44×44px (iOS guidelines)

**Layout Adjustments**:
- Full-width container with padding
- Simplified footer (larger text)
- No hover effects (touch-only)
- Swipe gestures for quick selection

#### Tablet (577px - 1024px)
**Grid Configuration**:
- Default grid: 8×8
- Cell size: 28px
- Gap between cells: 3px
- Support both touch and mouse

**Layout Adjustments**:
- Centered container with max-width
- Standard footer display
- Both hover and touch interactions

#### Desktop (> 1024px)
**Grid Configuration**:
- Default grid: 10×10
- Cell size: 24px
- Gap between cells: 2px
- Mouse-optimized interactions

**Layout Adjustments**:
- Compact layout
- Full hover capabilities
- Keyboard navigation optimized
- Grid expansion enabled

---

## Responsive Component Implementation

### NgxTableLayoutPickerComponent Responsive Code

```typescript
// ngx-table-layout-picker.component.ts
import { Component, HostListener, signal, computed, effect } from '@angular/core';
import { BREAKPOINTS } from './constants/responsive.constants';

@Component({
  selector: 'ngx-table-layout-picker',
  // ...
})
export class NgxTableLayoutPickerComponent implements OnInit {
  // Responsive state
  protected readonly containerWidth = signal<number>(0);
  protected readonly currentBreakpoint = signal<BreakpointName>('desktop');
  protected readonly isTouchDevice = signal<boolean>(false);
  
  // Computed responsive properties
  protected readonly responsiveRows = computed(() => {
    if (!this.responsive) return this.rows;
    
    const breakpoint = this.currentBreakpoint();
    switch (breakpoint) {
      case 'mobile': return Math.min(this.rows, 6);
      case 'tablet': return Math.min(this.rows, 8);
      default: return this.rows;
    }
  });
  
  protected readonly responsiveCols = computed(() => {
    if (!this.responsive) return this.cols;
    
    const breakpoint = this.currentBreakpoint();
    switch (breakpoint) {
      case 'mobile': return Math.min(this.cols, 6);
      case 'tablet': return Math.min(this.cols, 8);
      default: return this.cols;
    }
  });
  
  protected readonly responsiveCellSize = computed(() => {
    if (!this.responsive) return this.cellSize;
    
    const width = this.containerWidth();
    const cols = this.responsiveCols();
    const gap = this.getGapSize();
    
    // Calculate cell size based on container width
    const availableWidth = width - (cols + 1) * gap - 16; // 16px padding
    const calculatedSize = Math.floor(availableWidth / cols);
    
    const breakpoint = this.currentBreakpoint();
    const minSize = breakpoint === 'mobile' ? 32 : 20;
    const maxSize = breakpoint === 'mobile' ? 44 : 40;
    
    return Math.max(minSize, Math.min(maxSize, calculatedSize));
  });
  
  ngOnInit(): void {
    this.detectTouchDevice();
    this.updateContainerWidth();
    this.setupResizeObserver();
  }
  
  private detectTouchDevice(): void {
    const hasTouch = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0;
    this.isTouchDevice.set(hasTouch);
  }
  
  private setupResizeObserver(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.containerWidth.set(entry.contentRect.width);
        this.updateBreakpoint(entry.contentRect.width);
      }
    });
    
    if (this.elementRef.nativeElement) {
      resizeObserver.observe(this.elementRef.nativeElement);
    }
  }
  
  private updateBreakpoint(width: number): void {
    if (width <= BREAKPOINTS.mobile.max) {
      this.currentBreakpoint.set('mobile');
    } else if (width <= BREAKPOINTS.tablet.max) {
      this.currentBreakpoint.set('tablet');
    } else {
      this.currentBreakpoint.set('desktop');
    }
  }
  
  @HostListener('window:resize')
  private updateContainerWidth(): void {
    const width = this.elementRef.nativeElement?.offsetWidth || 0;
    this.containerWidth.set(width);
  }
  
  private getGapSize(): number {
    const breakpoint = this.currentBreakpoint();
    switch (breakpoint) {
      case 'mobile': return 4;
      case 'tablet': return 3;
      default: return 2;
    }
  }
}
```

---

## Touch Event Handling

### Touch Interaction Implementation

```typescript
// touch-handler.ts
export class TouchHandler {
  private touchStartTime: number = 0;
  private lastTouchCell: TableCell | null = null;
  
  handleTouchStart(event: TouchEvent, row: number, col: number): void {
    event.preventDefault();
    this.touchStartTime = Date.now();
    this.lastTouchCell = { row, col };
    
    // Provide haptic feedback if available
    this.triggerHapticFeedback();
    
    // Emit hover event for touch
    this.onCellHover({ row, col });
  }
  
  handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element?.hasAttribute('data-row')) {
      const row = parseInt(element.getAttribute('data-row') || '0');
      const col = parseInt(element.getAttribute('data-col') || '0');
      
      if (!this.lastTouchCell || 
          this.lastTouchCell.row !== row || 
          this.lastTouchCell.col !== col) {
        this.lastTouchCell = { row, col };
        this.onCellHover({ row, col });
        this.triggerHapticFeedback('light');
      }
    }
  }
  
  handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    
    const touchDuration = Date.now() - this.touchStartTime;
    
    // Only register as click if quick tap (< 300ms)
    if (touchDuration < 300 && this.lastTouchCell) {
      this.onCellClick(this.lastTouchCell);
    }
    
    this.lastTouchCell = null;
  }
  
  private triggerHapticFeedback(style: 'light' | 'medium' = 'medium'): void {
    // Check if Haptic Feedback API is available (iOS)
    if ('vibrate' in navigator) {
      const duration = style === 'light' ? 10 : 20;
      navigator.vibrate(duration);
    }
  }
}
```

### Component Touch Integration

```typescript
// ngx-table-cell.component.ts
@Component({
  selector: 'ngx-table-cell',
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchmove)': 'onTouchMove($event)',
    '(touchend)': 'onTouchEnd($event)',
    '[style.min-width.px]': 'touchTargetSize',
    '[style.min-height.px]': 'touchTargetSize'
  }
})
export class TableCellComponent {
  @Input() touchTargetSize = 44; // iOS minimum
  
  private touchHandler = new TouchHandler();
  
  onTouchStart(event: TouchEvent): void {
    this.touchHandler.handleTouchStart(event, this.row, this.col);
  }
  
  onTouchMove(event: TouchEvent): void {
    this.touchHandler.handleTouchMove(event);
  }
  
  onTouchEnd(event: TouchEvent): void {
    this.touchHandler.handleTouchEnd(event);
  }
}
```

---

## Responsive Styling

### Mobile-First SCSS

```scss
// ngx-table-layout-picker.component.scss

// Base styles (mobile-first)
:host {
  display: block;
  width: 100%;
  max-width: 100%;
  
  --cell-size: 32px;
  --cell-gap: 4px;
  --padding: 12px;
}

.tls-container {
  padding: var(--padding);
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
}

.tls-grid {
  display: inline-grid;
  gap: var(--cell-gap);
  
  // Prevent layout shift during loading
  min-width: 0;
}

.tls-cell {
  width: var(--cell-size);
  height: var(--cell-size);
  min-width: 44px; // Touch target minimum
  min-height: 44px;
  
  // Touch-friendly tap highlight
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  
  // Prevent text selection during touch
  user-select: none;
  -webkit-user-select: none;
}

// Tablet styles
@include tablet {
  :host {
    --cell-size: 28px;
    --cell-gap: 3px;
    --padding: 10px;
  }
  
  .tls-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .tls-cell {
    min-width: 40px;
    min-height: 40px;
  }
}

// Desktop styles
@include desktop {
  :host {
    --cell-size: 24px;
    --cell-gap: 2px;
    --padding: 8px;
  }
  
  .tls-container {
    max-width: 500px;
    overflow: visible;
  }
  
  .tls-cell {
    min-width: 20px;
    min-height: 20px;
    
    // Desktop hover effects
    &:hover {
      transform: scale(1.05);
      z-index: 1;
    }
  }
}

// Landscape orientation adjustments
@media (orientation: landscape) and (max-height: 600px) {
  .tls-container {
    max-height: 80vh;
    overflow-y: auto;
  }
}

// High DPI displays
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .tls-cell {
    border-width: 1.5px; // Thinner borders on retina
  }
}
```

---

## Dropdown Responsive Behavior

### Material Menu Responsive Positioning

```typescript
// ngx-table-layout-picker-dropdown.component.ts
@Component({
  selector: 'ngx-table-layout-picker-dropdown',
  // ...
})
export class NgxTableLayoutPickerDropdownComponent {
  protected readonly isMobile = signal<boolean>(false);
  
  // Adjust menu config for mobile
  protected readonly menuConfig = computed(() => {
    const mobile = this.isMobile();
    
    return {
      xPosition: mobile ? 'center' : 'after',
      yPosition: mobile ? 'center' : 'below',
      overlayPanelClass: mobile ? 'tls-mobile-menu' : 'tls-desktop-menu',
      hasBackdrop: mobile,
      backdropClass: mobile ? 'tls-mobile-backdrop' : ''
    };
  });
  
  ngOnInit(): void {
    this.checkMobile();
  }
  
  @HostListener('window:resize')
  private checkMobile(): void {
    this.isMobile.set(window.innerWidth <= BREAKPOINTS.mobile.max);
  }
}
```

### Mobile Dropdown Styles

```scss
// ngx-table-layout-picker-dropdown.component.scss

// Desktop menu
.tls-desktop-menu {
  &.mat-mdc-menu-panel {
    max-width: none;
  }
}

// Mobile fullscreen menu
.tls-mobile-menu {
  &.mat-mdc-menu-panel {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    max-width: 90vw;
    max-height: 90vh;
    
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
}

.tls-mobile-backdrop {
  background: rgba(0, 0, 0, 0.5);
}

// Button responsive styles
.tls-trigger-button {
  @include mobile {
    width: 100%;
    justify-content: center;
    
    mat-icon {
      margin-right: 8px;
    }
  }
  
  @include desktop {
    width: auto;
    min-width: 120px;
  }
}
```

---

## Responsive Utilities

### Responsive Service

```typescript
// responsive.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { BREAKPOINTS, BreakpointName } from '../constants/responsive.constants';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private readonly windowWidth = signal<number>(window.innerWidth);
  
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
  
  public readonly isMobile = computed(() => 
    this.currentBreakpoint() === 'mobile'
  );
  
  public readonly isTablet = computed(() => 
    this.currentBreakpoint() === 'tablet'
  );
  
  public readonly isDesktop = computed(() => 
    this.currentBreakpoint() === 'desktop'
  );
  
  public readonly isTouchDevice = signal<boolean>(
    'ontouchstart' in window || navigator.maxTouchPoints > 0
  );
  
  constructor() {
    this.setupResizeListener();
  }
  
  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      this.windowWidth.set(window.innerWidth);
    });
  }
  
  /**
   * Get recommended grid size for current breakpoint
   */
  getRecommendedGridSize(): { rows: number; cols: number } {
    const breakpoint = this.currentBreakpoint();
    
    switch (breakpoint) {
      case 'mobile':
        return { rows: 6, cols: 6 };
      case 'tablet':
        return { rows: 8, cols: 8 };
      case 'desktop':
        return { rows: 10, cols: 10 };
    }
  }
  
  /**
   * Get recommended cell size for current breakpoint
   */
  getRecommendedCellSize(): number {
    const breakpoint = this.currentBreakpoint();
    
    switch (breakpoint) {
      case 'mobile':
        return 32;
      case 'tablet':
        return 28;
      case 'desktop':
        return 24;
    }
  }
}
```

---

## Safe Area Handling (iOS)

### Safe Area Support

```scss
// _safe-area.scss
:host {
  // Support for iPhone notch and home indicator
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

.tls-container {
  // Ensure content doesn't overlap safe areas
  @supports (padding: max(0px)) {
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
  }
}
```

---

## Accessibility on Mobile

### Touch Accessibility

```typescript
// Announce selection changes for screen readers on mobile
private announceSelection(selection: TableSelection): void {
  const message = `Selected table layout: ${selection.rows} rows by ${selection.cols} columns`;
  
  // Create or update live region
  let liveRegion = document.getElementById('tls-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'tls-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  
  liveRegion.textContent = message;
}
```

---

## Performance Optimization for Mobile

### Virtual Scrolling (Large Grids)

```typescript
// For very large grids on mobile, implement virtual scrolling
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

// Only render visible cells
protected readonly visibleCells = computed(() => {
  const allCells = this.generateAllCells();
  const viewport = this.getViewportBounds();
  
  return allCells.filter(cell => 
    this.isCellInViewport(cell, viewport)
  );
});
```

### Debounced Resize Handler

```typescript
private resizeHandler = debounce(() => {
  this.updateContainerWidth();
}, 150);

@HostListener('window:resize')
private onResize(): void {
  this.resizeHandler();
}
```

---

## Testing Responsive Behavior

### Responsive Testing Strategy

```typescript
// responsive.service.spec.ts
describe('ResponsiveService', () => {
  let service: ResponsiveService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiveService);
  });
  
  it('should detect mobile breakpoint', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(400);
    service['windowWidth'].set(400);
    
    expect(service.currentBreakpoint()).toBe('mobile');
    expect(service.isMobile()).toBe(true);
  });
  
  it('should detect tablet breakpoint', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(768);
    service['windowWidth'].set(768);
    
    expect(service.currentBreakpoint()).toBe('tablet');
    expect(service.isTablet()).toBe(true);
  });
  
  it('should detect desktop breakpoint', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1200);
    service['windowWidth'].set(1200);
    
    expect(service.currentBreakpoint()).toBe('desktop');
    expect(service.isDesktop()).toBe(true);
  });
  
  it('should return recommended grid size for mobile', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(400);
    service['windowWidth'].set(400);
    
    const size = service.getRecommendedGridSize();
    expect(size).toEqual({ rows: 6, cols: 6 });
  });
});
```

---

## Responsive Demo Examples

### Responsive Demo Component

```typescript
@Component({
  selector: 'app-responsive-demo',
  template: `
    <div class="demo-container">
      <h2>Responsive Table Selector</h2>
      
      <div class="info-panel">
        <p>Current breakpoint: {{ responsiveService.currentBreakpoint() }}</p>
        <p>Is Touch Device: {{ responsiveService.isTouchDevice() }}</p>
        <p>Window Width: {{ windowWidth }}px</p>
      </div>
      
      <ngx-table-layout-picker
        [responsive]="true"
        [rows]="gridSize.rows"
        [cols]="gridSize.cols"
        (selectionChange)="onSelect($event)">
      </ngx-table-layout-picker>
    </div>
  `
})
export class ResponsiveDemoComponent {
  constructor(public responsiveService: ResponsiveService) {}
  
  get windowWidth(): number {
    return window.innerWidth;
  }
  
  get gridSize() {
    return this.responsiveService.getRecommendedGridSize();
  }
}
```
