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
    expect(component.theme).toBe('dark');
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
});
