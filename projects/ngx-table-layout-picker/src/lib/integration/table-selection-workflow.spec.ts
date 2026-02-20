import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxTableLayoutPickerComponent } from '../components/ngx-table-layout-picker.component';
import { vi } from 'vitest';

/**
 * Integration tests for complete user workflows
 * These tests verify that multiple components and services work together correctly
 */
describe('Table Selection Workflow (Integration)', () => {
  let fixture: ComponentFixture<NgxTableLayoutPickerComponent>;
  let component: NgxTableLayoutPickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTableLayoutPickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTableLayoutPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Complete Selection Workflow', () => {
    it('should complete hover-to-select workflow', () => {
      return new Promise<void>((resolve) => {
        // Step 1: Hover over cell
        component['onCellHover'](4, 6);
        fixture.detectChanges();

        expect(component['hoveredCell']()).toEqual({ row: 4, col: 6 });
        expect(component['selectionText']()).toBe('4 × 6');

        // Step 2: Click to select
        component.selectionChange.subscribe((selection) => {
          expect(selection.rows).toBe(4);
          expect(selection.cols).toBe(6);
          expect(selection.cells?.length).toBe(24); // 4 × 6
          expect(selection.timestamp).toBeDefined();
          resolve();
        });

        component['onCellClick'](4, 6);
      });
    });

    it('should handle complete mouse interaction workflow', () => {
      // Hover over multiple cells
      component['onCellHover'](2, 3);
      fixture.detectChanges();
      expect(component['hoveredCell']()).toEqual({ row: 2, col: 3 });

      component['onCellHover'](3, 5);
      fixture.detectChanges();
      expect(component['hoveredCell']()).toEqual({ row: 3, col: 5 });

      // Click to select
      let selectedValues: any;
      component.selectionChange.subscribe((selection) => {
        selectedValues = selection;
      });
      component['onCellClick'](3, 5);

      expect(selectedValues.rows).toBe(3);
      expect(selectedValues.cols).toBe(5);
      expect(selectedValues.cells.length).toBe(15);

      // Leave container
      component['onContainerLeave']();
      fixture.detectChanges();
      expect(component['hoveredCell']()).toBeNull();
    });

    it('should handle multiple selections in sequence', () => {
      const selections: any[] = [];
      component.selectionChange.subscribe((selection) => {
        selections.push(selection);
      });

      // First selection
      component['onCellHover'](2, 2);
      component['onCellClick'](2, 2);

      // Second selection
      component['onCellHover'](5, 7);
      component['onCellClick'](5, 7);

      // Third selection
      component['onCellHover'](3, 4);
      component['onCellClick'](3, 4);

      expect(selections.length).toBe(3);
      expect(selections[0]).toEqual(expect.objectContaining({ rows: 2, cols: 2 }));
      expect(selections[1]).toEqual(expect.objectContaining({ rows: 5, cols: 7 }));
      expect(selections[2]).toEqual(expect.objectContaining({ rows: 3, cols: 4 }));
    });
  });

  describe('Expandable Grid Workflow', () => {
    beforeEach(() => {
      component.expandable = true;
      fixture.detectChanges();
    });

    it('should expand and then select', () => {
      return new Promise<void>((resolve) => {
        // Expand grid by hovering at edge
        component['onCellHover'](10, 10);
        fixture.detectChanges();

        expect(component['currentDimensions']().rows).toBe(11);
        expect(component['currentDimensions']().cols).toBe(11);

        // Select the expanded area
        component.selectionChange.subscribe((selection) => {
          expect(selection.rows).toBe(11);
          expect(selection.cols).toBe(11);
          resolve();
        });

        component['onCellHover'](11, 11);
        component['onCellClick'](11, 11);
      });
    });

    it('should expand, shrink, and select workflow', () => {
      // Expand
      component['onCellHover'](10, 10);
      expect(component['currentDimensions']().rows).toBe(11);

      component['onCellHover'](12, 12);
      expect(component['currentDimensions']().rows).toBe(13);

      // Shrink
      component['onCellHover'](8, 8);
      expect(component['currentDimensions']().rows).toBe(10);

      // Select
      let selectedValues: any;
      component.selectionChange.subscribe((selection) => {
        selectedValues = selection;
      });
      component['onCellClick'](8, 8);

      expect(selectedValues).toEqual(
        expect.objectContaining({
          rows: 8,
          cols: 8,
        })
      );
    });
  });

  describe('Theme Change Workflow', () => {
    it('should change theme and maintain selection', () => {
      // Select a cell
      component['onCellHover'](3, 4);
      component['onCellClick'](3, 4);

      // Change theme
      component.theme = 'dark';
      fixture.detectChanges();

      expect(component['effectiveTheme']()).toBe('dark');

      // Verify state is maintained
      component['onCellHover'](5, 6);
      expect(component['hoveredCell']()).toEqual({ row: 5, col: 6 });
    });

    it('should emit theme change events during workflow', () => {
      return new Promise<void>((resolve) => {
        const themes: any[] = [];
        component.themeChange.subscribe((theme) => {
          themes.push(theme);
          if (themes.length === 2) {
            expect(themes).toContain('light');
            expect(themes).toContain('dark');
            resolve();
          }
        });

        component.theme = 'light';
        fixture.detectChanges();

        setTimeout(() => {
          component.theme = 'dark';
          fixture.detectChanges();
        }, 10);
      });
    });
  });

  describe('Reset Workflow', () => {
    it('should reset after expansion and selection', () => {
      // Expand grid
      component['onCellHover'](12, 12);
      expect(component['currentDimensions']().rows).toBe(13);

      // Select
      component['onCellClick'](12, 12);

      // Reset
      component.reset();

      expect(component['currentDimensions']()).toEqual({ rows: 10, cols: 10 });
      expect(component['hoveredCell']()).toBeNull();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle rapid sequential hovers', () => {
      for (let i = 1; i <= 10; i++) {
        component['onCellHover'](i, i);
      }
      fixture.detectChanges();

      const hovered = component['hoveredCell']();
      expect(hovered?.row).toBe(10);
      expect(hovered?.col).toBe(10);
    });

    it('should handle hover, leave, hover sequence', () => {
      component['onCellHover'](3, 3);
      expect(component['hoveredCell']()).toBeTruthy();

      component['onContainerLeave']();
      expect(component['hoveredCell']()).toBeNull();

      component['onCellHover'](5, 5);
      expect(component['hoveredCell']()).toEqual({ row: 5, col: 5 });
    });

    it('should handle selection at boundaries', () => {
      const selections: any[] = [];
      component.selectionChange.subscribe((selection) => {
        selections.push(selection);
      });

      // Select at minimum (1,1)
      component['onCellHover'](1, 1);
      component['onCellClick'](1, 1);

      // Select at maximum allowed
      component['onCellHover'](10, 10);
      component['onCellClick'](10, 10);

      expect(selections[0]).toEqual(
        expect.objectContaining({ rows: 1, cols: 1, cells: expect.any(Array) })
      );
      expect(selections[1]).toEqual(
        expect.objectContaining({ rows: 10, cols: 10, cells: expect.any(Array) })
      );
    });
  });

  describe('Accessibility Workflow', () => {
    it('should maintain ARIA labels throughout interaction', () => {
      const element = fixture.nativeElement as HTMLElement;

      // Initial state
      expect(element.getAttribute('role')).toBe('grid');

      // After hover
      component['onCellHover'](3, 5);
      fixture.detectChanges();

      const ariaLabel = component['getCellAriaLabel'](3, 5);
      expect(ariaLabel).toContain('3');
      expect(ariaLabel).toContain('5');

      // Screen reader announcement
      const announcement = component['screenReaderText']();
      expect(announcement).toBeTruthy();
    });

    it('should update screen reader text during workflow', () => {
      // Hover
      component['onCellHover'](4, 6);
      let announcement = component['screenReaderText']();
      expect(announcement).toContain('4');
      expect(announcement).toContain('6');

      // Change hover
      component['onCellHover'](2, 3);
      announcement = component['screenReaderText']();
      expect(announcement).toContain('2');
      expect(announcement).toContain('3');

      // Leave
      component['onContainerLeave']();
      announcement = component['screenReaderText']();
      expect(announcement).toBe('');
    });
  });

  describe('Responsive Behavior Workflow', () => {
    beforeEach(() => {
      component.responsive = true;
      fixture.detectChanges();
    });

    it('should maintain selection context in responsive mode', () => {
      component['onCellHover'](3, 4);
      fixture.detectChanges();

      const rowsArray = component['rowsArray']();
      const colsArray = component['colsArray']();

      expect(rowsArray).toBeDefined();
      expect(colsArray).toBeDefined();
      expect(component['hoveredCell']()).toEqual({ row: 3, col: 4 });
    });

    it('should calculate cell size responsively during interaction', () => {
      const initialSize = component['responsiveCellSize']();
      expect(initialSize).toBeGreaterThan(0);

      component['onCellHover'](5, 7);
      fixture.detectChanges();

      const newSize = component['responsiveCellSize']();
      expect(newSize).toBeGreaterThan(0);
    });
  });
});
