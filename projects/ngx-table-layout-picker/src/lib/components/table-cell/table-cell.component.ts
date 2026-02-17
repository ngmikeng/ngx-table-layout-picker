import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

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
    'role': 'gridcell',
    '[attr.tabindex]': '0'
  }
})
export class TableCellComponent {
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

  onMouseEnter(): void {
    this.cellHover.emit();
  }

  onClick(): void {
    this.cellClick.emit();
  }

  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    this.cellHover.emit();
  }
}
