import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCellComponent } from './table-cell.component';
import { vi } from 'vitest';

describe('TableCellComponent', () => {
  let component: TableCellComponent;
  let fixture: ComponentFixture<TableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCellComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableCellComponent);
    component = fixture.componentInstance;
    component.row = 1;
    component.col = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cellHover on mouse enter', () => {
    vi.spyOn(component.cellHover, 'emit');
    component.onMouseEnter();
    expect(component.cellHover.emit).toHaveBeenCalled();
  });

  it('should emit cellClick on click', () => {
    vi.spyOn(component.cellClick, 'emit');
    component.onClick();
    expect(component.cellClick.emit).toHaveBeenCalled();
  });

  it('should have correct host attributes', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.getAttribute('role')).toBe('gridcell');
    expect(element.getAttribute('data-row')).toBe('1');
    expect(element.getAttribute('data-col')).toBe('1');
  });

  it('should apply active class when active', () => {
    component.active = true;
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.classList.contains('active')).toBe(true);
  });
});
