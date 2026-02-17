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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default button label', () => {
    expect(component.buttonLabel).toBe('Insert Table');
  });

  it('should have default button icon', () => {
    expect(component.buttonIcon).toBe('table_chart');
  });

  it('should emit tableSelected on selection', () => {
    vi.spyOn(component.tableSelected, 'emit');
    const selection = { rows: 3, cols: 4 };
    component['onSelectionChange'](selection);
    expect(component.tableSelected.emit).toHaveBeenCalledWith(selection);
  });

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

  it('should apply default selector config', () => {
    expect(component.selectorConfig).toEqual({});
  });

  it('should be enabled by default', () => {
    expect(component.disabled).toBe(false);
  });
});
