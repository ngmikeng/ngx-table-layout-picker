import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxTableLayoutPickerDropdownComponent } from './ngx-table-layout-picker-dropdown.component';
import { vi } from 'vitest';

describe('NgxTableLayoutPickerDropdownComponent', () => {
  let component: NgxTableLayoutPickerDropdownComponent;
  let fixture: ComponentFixture<NgxTableLayoutPickerDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxTableLayoutPickerDropdownComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTableLayoutPickerDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default button label', () => {
      expect(component.buttonLabel).toBe('Insert Table');
    });

    it('should have default button icon', () => {
      expect(component.buttonIcon).toBe('table_chart');
    });

    it('should apply default selector config', () => {
      expect(component.selectorConfig).toEqual({});
    });

    it('should be enabled by default', () => {
      expect(component.disabled).toBe(false);
    });

    it('should close on select by default', () => {
      expect(component.closeOnSelect).toBe(true);
    });
  });

  describe('Button Rendering', () => {
    it('should render button with custom label', () => {
      component.buttonLabel = 'Create Table';
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button?.textContent).toContain('Create Table');
    });

    it('should render button with icon', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });

    it('should disable button when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button?.disabled).toBe(true);
    });
  });

  describe('Menu Events', () => {
    it('should emit opened event when menu opens', () => {
      vi.spyOn(component.opened, 'emit');
      component['onMenuOpened']();
      expect(component.opened.emit).toHaveBeenCalled();
    });

    it('should emit closed event when menu closes', () => {
      vi.spyOn(component.closed, 'emit');
      component['onMenuClosed']();
      expect(component.closed.emit).toHaveBeenCalled();
    });
  });

  describe('Selection Handling', () => {
    it('should emit tableSelected on selection', () => {
      vi.spyOn(component.tableSelected, 'emit');
      const selection = { rows: 3, cols: 4 };
      component['onSelectionChange'](selection);
      expect(component.tableSelected.emit).toHaveBeenCalledWith(selection);
    });

    it('should emit selection with timestamp', () => {
      vi.spyOn(component.tableSelected, 'emit');
      const selection = { rows: 5, cols: 7, cells: [], timestamp: new Date() };
      component['onSelectionChange'](selection);
      expect(component.tableSelected.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: 5,
          cols: 7
        })
      );
    });
  });

  describe('Selector Configuration', () => {
    it('should pass config to selector', () => {
      component.selectorConfig = {
        rows: 8,
        cols: 12,
        theme: 'dark'
      };
      fixture.detectChanges();
      expect(component.selectorConfig.rows).toBe(8);
      expect(component.selectorConfig.cols).toBe(12);
      expect(component.selectorConfig.theme).toBe('dark');
    });

    it('should handle max dimensions', () => {
      component.selectorConfig = {
        maxRows: 15,
        maxCols: 15
      };
      fixture.detectChanges();
      expect(component.selectorConfig).toEqual(
        expect.objectContaining({
          maxRows: 15,
          maxCols: 15
        })
      );
    });
  });
});
