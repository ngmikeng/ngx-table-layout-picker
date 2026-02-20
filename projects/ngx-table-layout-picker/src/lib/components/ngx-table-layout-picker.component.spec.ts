import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxTableLayoutPickerComponent } from './ngx-table-layout-picker.component';
import { vi } from 'vitest';

describe('NgxTableLayoutPickerComponent', () => {
  let component: NgxTableLayoutPickerComponent;
  let fixture: ComponentFixture<NgxTableLayoutPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTableLayoutPickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTableLayoutPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.rows).toBe(10);
    expect(component.cols).toBe(10);
    expect(component.maxRows).toBe(20);
    expect(component.maxCols).toBe(20);
    expect(component.showFooter).toBe(true);
  });

  it('should emit selectionChange on cell click', () => {
    vi.spyOn(component.selectionChange, 'emit');
    component['onCellClick'](3, 4);
    expect(component.selectionChange.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: 3,
        cols: 4
      })
    );
  });

  it('should update hoveredCell on cell hover', () => {
    component['onCellHover'](2, 3);
    expect(component['hoveredCell']()).toEqual({ row: 2, col: 3 });
  });

  it('should emit cellHover event on hover', () => {
    vi.spyOn(component.cellHover, 'emit');
    component['onCellHover'](2, 3);
    expect(component.cellHover.emit).toHaveBeenCalledWith({ row: 2, col: 3 });
  });

  it('should clear hoveredCell on container leave', () => {
    component['onCellHover'](2, 3);
    component['onContainerLeave']();
    expect(component['hoveredCell']()).toBeNull();
  });

  it('should determine if cell is active', () => {
    component['hoveredCell'].set({ row: 3, col: 4 });
    expect(component['isCellActive'](2, 3)).toBe(true);
    expect(component['isCellActive'](4, 3)).toBe(false);
  });

  it('should reset to initial dimensions', () => {
    component['currentDimensions'].set({ rows: 15, cols: 15 });
    component.reset();
    expect(component['currentDimensions']()).toEqual({ rows: 10, cols: 10 });
    expect(component['hoveredCell']()).toBeNull();
  });

  it('should get current dimensions', () => {
    const dimensions = component.getDimensions();
    expect(dimensions).toEqual({ rows: 10, cols: 10 });
  });

  it('should set theme', () => {
    component.setTheme('dark');
    expect(component['effectiveTheme']()).toBe('dark');
  });

  it('should format selection text correctly', () => {
    component['hoveredCell'].set({ row: 5, col: 7 });
    expect(component['selectionText']()).toBe('5 × 7');
  });

  it('should have ARIA attributes', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.getAttribute('role')).toBe('grid');
    expect(element.getAttribute('aria-label')).toBe('Table layout selector');
  });

  describe('expandable grid behavior', () => {
    beforeEach(() => {
      component.expandable = true;
      fixture.detectChanges();
    });

    it('should expand grid when hovering at edges', () => {
      vi.spyOn(component.gridExpanded, 'emit');
      vi.spyOn(component.gridResized, 'emit');
      
      component['onCellHover'](10, 10);
      
      expect(component['currentDimensions']().rows).toBe(11);
      expect(component['currentDimensions']().cols).toBe(11);
      expect(component.gridExpanded.emit).toHaveBeenCalledWith({ rows: 11, cols: 11 });
      expect(component.gridResized.emit).toHaveBeenCalledWith({ rows: 11, cols: 11 });
    });

    it('should shrink grid when hovering away from edges', () => {
      // First expand the grid
      component['currentDimensions'].set({ rows: 15, cols: 15 });
      
      vi.spyOn(component.gridShrank, 'emit');
      vi.spyOn(component.gridResized, 'emit');
      
      // Hover far from edge (with shrinkThreshold=2, hovering at 8 should shrink)
      component['onCellHover'](8, 8);
      
      expect(component['currentDimensions']().rows).toBe(10); // shrink to min
      expect(component['currentDimensions']().cols).toBe(10);
      expect(component.gridShrank.emit).toHaveBeenCalledWith({ rows: 10, cols: 10 });
      expect(component.gridResized.emit).toHaveBeenCalledWith({ rows: 10, cols: 10 });
    });

    it('should not shrink below initial dimensions', () => {
      component['onCellHover'](3, 3);
      
      expect(component['currentDimensions']().rows).toBe(10);
      expect(component['currentDimensions']().cols).toBe(10);
    });

    it('should not expand beyond maxRows and maxCols', () => {
      component.maxRows = 12;
      component.maxCols = 12;
      component['currentDimensions'].set({ rows: 12, cols: 12 });
      
      component['onCellHover'](13, 13);
      
      expect(component['currentDimensions']().rows).toBe(12);
      expect(component['currentDimensions']().cols).toBe(12);
    });

    it('should respect shrinkThreshold', () => {
      component.shrinkThreshold = 3;
      component['currentDimensions'].set({ rows: 15, cols: 15 });
      
      // With threshold=3, hovering at 12, maxNeeded = 12+3 = 15, no shrink
      component['onCellHover'](12, 12);
      expect(component['currentDimensions']().rows).toBe(15);
      
      // With threshold=3, hovering at 11, maxNeeded = 11+3 = 14, should shrink to 12
      component['onCellHover'](11, 11);
      expect(component['currentDimensions']().rows).toBe(12);
    });

    it('should not affect grid when expandable is false', () => {
      component.expandable = false;
      component['currentDimensions'].set({ rows: 10, cols: 10 });
      
      vi.spyOn(component.gridExpanded, 'emit');
      vi.spyOn(component.gridShrank, 'emit');
      
      component['onCellHover'](10, 10);
      
      expect(component['currentDimensions']().rows).toBe(10);
      expect(component['currentDimensions']().cols).toBe(10);
      expect(component.gridExpanded.emit).not.toHaveBeenCalled();
      expect(component.gridShrank.emit).not.toHaveBeenCalled();
    });

    it('should handle rows and cols independently', () => {
      component['currentDimensions'].set({ rows: 15, cols: 10 });
      
      // Hover should shrink rows and expand cols
      component['onCellHover'](8, 10);
      
      expect(component['currentDimensions']().rows).toBe(10); // shrunk
      expect(component['currentDimensions']().cols).toBe(11); // expanded
    });
  });

  describe('Theming', () => {
    it('should apply light theme', () => {
      fixture.componentRef.setInput('theme', 'light');
      fixture.detectChanges();
      expect(component['effectiveTheme']()).toBe('light');
    });

    it('should apply dark theme', () => {
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();
      expect(component['effectiveTheme']()).toBe('dark');
    });

    it('should handle auto theme mode', () => {
      fixture.componentRef.setInput('theme', 'auto');
      fixture.detectChanges();
      const resolved = component['effectiveTheme']();
      expect(['light', 'dark']).toContain(resolved);
    });

    it('should emit themeChange event', () => {
      return new Promise<void>((resolve) => {
        component.themeChange.subscribe((theme) => {
          expect(theme).toBe('dark');
          resolve();
        });
        fixture.componentRef.setInput('theme', 'dark');
        fixture.detectChanges();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should use responsive dimensions when responsive is true', () => {
      fixture.componentRef.setInput('responsive', true);
      fixture.detectChanges();
      const rowsArray = component['rowsArray']();
      const colsArray = component['colsArray']();
      expect(rowsArray).toBeDefined();
      expect(colsArray).toBeDefined();
      expect(Array.isArray(rowsArray)).toBe(true);
      expect(Array.isArray(colsArray)).toBe(true);
    });

    it('should use standard dimensions when responsive is false', () => {
      fixture.componentRef.setInput('responsive', false);
      fixture.detectChanges();
      const rowsArray = component['rowsArray']();
      const colsArray = component['colsArray']();
      const currentDims = component['currentDimensions']();
      expect(rowsArray.length).toBe(currentDims.rows);
      expect(colsArray.length).toBe(currentDims.cols);
    });

    it('should calculate responsive cell size', () => {
      fixture.componentRef.setInput('responsive', true);
      fixture.detectChanges();
      const cellSize = component['responsiveCellSize']();
      expect(cellSize).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('role')).toBe('grid');
      expect(element.hasAttribute('aria-label')).toBe(true);
    });

    it('should generate cell ARIA labels', () => {
      const ariaLabel = component['getCellAriaLabel'](3, 5);
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('3');
      expect(ariaLabel).toContain('5');
    });

    it('should update screen reader text on hover', () => {
      component['onCellHover'](4, 6);
      const screenReader = component['screenReaderText']();
      expect(screenReader).toBeTruthy();
      expect(screenReader).toContain('4');
      expect(screenReader).toContain('6');
    });

    it('should clear screen reader text on leave', () => {
      component['onCellHover'](4, 6);
      component['onContainerLeave']();
      const screenReader = component['screenReaderText']();
      expect(screenReader).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle min grid size', () => {
      component.rows = 1;
      component.cols = 1;
      component.ngOnInit();
      expect(component.rows).toBeGreaterThanOrEqual(3);
      expect(component.cols).toBeGreaterThanOrEqual(3);
    });

    it('should handle max grid size', () => {
      component.rows = 100;
      component.cols = 100;
      component.ngOnInit();
      expect(component.rows).toBeLessThanOrEqual(20);
      expect(component.cols).toBeLessThanOrEqual(20);
    });

    it('should handle rapid hover changes', () => {
      return new Promise<void>((resolve) => {
        for (let i = 1; i <= 5; i++) {
          component['onCellHover'](i, i);
        }
        
        setTimeout(() => {
          const hovered = component['hoveredCell']();
          expect(hovered).toBeTruthy();
          expect(hovered?.row).toBe(5);
          expect(hovered?.col).toBe(5);
          resolve();
        }, 50);
      });
    });

    it('should handle clicking without prior hover', () => {
      vi.spyOn(component.selectionChange, 'emit');
      component['onCellClick'](3, 4);
      expect(component.selectionChange.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: 3,
          cols: 4
        })
      );
    });
  });

  describe('Public API Methods', () => {
    it('should reset grid to initial dimensions', () => {
      component['currentDimensions'].set({ rows: 15, cols: 15 });
      component['hoveredCell'].set({ row: 5, col: 5 });
      
      component.reset();
      
      expect(component['currentDimensions']()).toEqual({ rows: 10, cols: 10 });
      expect(component['hoveredCell']()).toBeNull();
    });

    it('should set hovered cell programmatically', () => {
      vi.spyOn(component.cellHover, 'emit');
      component.setHoveredCell(3, 4);
      
      expect(component['hoveredCell']()).toEqual({ row: 3, col: 4 });
      expect(component.cellHover.emit).toHaveBeenCalledWith({ row: 3, col: 4 });
    });

    it('should get current dimensions', () => {
      component['currentDimensions'].set({ rows: 12, cols: 15 });
      const dims = component.getDimensions();
      expect(dims).toEqual({ rows: 12, cols: 15 });
    });

    it('should set theme programmatically', () => {
      component.setTheme('dark');
      expect(component['effectiveTheme']()).toBe('dark');
    });
  });
});
