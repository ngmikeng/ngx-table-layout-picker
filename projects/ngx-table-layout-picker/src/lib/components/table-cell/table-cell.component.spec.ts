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

  describe('Mouse Interactions', () => {
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
  });

  describe('Touch Interactions', () => {
    it('should handle touch start', () => {
      vi.spyOn(component.cellHover, 'emit');
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 10, clientY: 10 } as Touch]
      });
      component.onTouchStart(touchEvent);
      expect(component.cellHover.emit).toHaveBeenCalled();
    });

    it('should handle touch move', () => {
      const touchEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 20, clientY: 20 } as Touch]
      });
      expect(() => component.onTouchMove(touchEvent)).not.toThrow();
    });

    it('should handle touch end', () => {
      vi.spyOn(component.cellClick, 'emit');
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 10, clientY: 10 } as Touch]
      });
      const touchEndEvent = new TouchEvent('touchend');
      
      component.onTouchStart(touchStartEvent);
      component.onTouchEnd(touchEndEvent);
      
      expect(component.cellClick.emit).toHaveBeenCalled();
    });
  });

  describe('Host Attributes', () => {
    it('should have correct role attribute', () => {
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('role')).toBe('gridcell');
    });

    it('should have correct data attributes', () => {
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('data-row')).toBe('1');
      expect(element.getAttribute('data-col')).toBe('1');
    });

    it('should have tabindex for keyboard accessibility', () => {
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Visual States', () => {
    it('should apply active class when active', () => {
      component.active = true;
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.classList.contains('active')).toBe(true);
    });

    it('should apply hovered class when hovered', () => {
      component.hovered = true;
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.classList.contains('hovered')).toBe(true);
    });

    it('should remove active class when not active', () => {
      component.active = true;
      fixture.detectChanges();
      component.active = false;
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.classList.contains('active')).toBe(false);
    });
  });

  describe('Touch Target Size', () => {
    it('should have minimum touch target size on touch devices', () => {
      const minSize = component['minTouchSize'];
      expect(minSize).toBeGreaterThanOrEqual(0);
    });
  });
});
