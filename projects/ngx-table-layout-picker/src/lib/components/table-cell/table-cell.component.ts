import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject } from '@angular/core';
import { TouchHandler } from '../../utils/touch-handler';
import { ResponsiveService } from '../../services/responsive.service';

/**
 * Internal component representing a single cell in the table grid
 * Not exported in public API
 */
@Component({
  selector: 'lib-table-cell',
  standalone: true,
  template: '<div class="tls-cell"></div>',
  styleUrls: ['./table-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.active]': 'active',
    '[class.hovered]': 'hovered',
    '[attr.data-row]': 'row',
    '[attr.data-col]': 'col',
    '(mouseenter)': 'onMouseEnter()',
    '(click)': 'onClick()',
    '(touchstart)': 'onTouchStart($event)',
    '(touchmove)': 'onTouchMove($event)',
    '(touchend)': 'onTouchEnd($event)',
    'role': 'gridcell',
    '[attr.tabindex]': '0',
    '[style.min-width.px]': 'minTouchSize',
    '[style.min-height.px]': 'minTouchSize'
  }
})
export class TableCellComponent {
  private readonly responsiveService = inject(ResponsiveService);
  private touchHandler: TouchHandler;
  
  /** Row number (1-indexed) */
  @Input() row!: number;
  
  /** Column number (1-indexed) */
  @Input() col!: number;
  
  /** Whether this cell is in the active selection */
  @Input() active = false;
  
  /** Whether this cell is currently hovered */
  @Input() hovered = false;

  /** Emitted when mouse enters the cell */
  @Output() cellHover = new EventEmitter<void>();
  
  /** Emitted when cell is clicked */
  @Output() cellClick = new EventEmitter<void>();
  
  /** Minimum touch target size */
  protected get minTouchSize(): number {
    return this.responsiveService.isTouchDevice() ? 44 : 0;
  }
  
  constructor() {
    this.touchHandler = new TouchHandler();
    this.touchHandler.onCellHover = () => this.cellHover.emit();
    this.touchHandler.onCellSelect = () => this.cellClick.emit();
  }

  onMouseEnter(): void {
    this.cellHover.emit();
  }

  onClick(): void {
    this.cellClick.emit();
  }

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
