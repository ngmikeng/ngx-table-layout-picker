import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NgxTableLayoutPickerComponent } from './ngx-table-layout-picker.component';
import { TableSelection } from '../models/table-selection.model';
import { TableLayoutConfig } from '../models/table-layout-config.model';

/**
 * Dropdown wrapper component for table layout picker
 * Integrates with Angular Material Menu
 */
@Component({
  selector: 'ngx-table-layout-picker-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgxTableLayoutPickerComponent
  ],
  templateUrl: './ngx-table-layout-picker-dropdown.component.html',
  styleUrls: ['./ngx-table-layout-picker-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxTableLayoutPickerDropdownComponent {
  @ViewChild(MatMenuTrigger) menuTrigger?: MatMenuTrigger;

  /** Label text for the trigger button */
  @Input() buttonLabel = 'Insert Table';

  /** Material icon name for the button */
  @Input() buttonIcon = 'table_chart';

  /** Button appearance style */
  @Input() buttonAppearance: 'basic' | 'raised' | 'stroked' | 'flat' = 'stroked';

  /** Configuration for the table layout selector */
  @Input() selectorConfig: Partial<TableLayoutConfig> = {};

  /** Menu position relative to trigger */
  @Input() menuPosition: 'above' | 'below' = 'below';

  /** Close menu after selection */
  @Input() closeOnSelect = true;

  /** Menu panel class for custom styling */
  @Input() menuClass = 'tls-dropdown-menu';

  /** Whether the button is disabled */
  @Input() disabled = false;

  /** Emitted when table layout is selected */
  @Output() tableSelected = new EventEmitter<TableSelection>();

  /** Emitted when dropdown opens */
  @Output() opened = new EventEmitter<void>();

  /** Emitted when dropdown closes */
  @Output() closed = new EventEmitter<void>();

  protected onMenuOpened(): void {
    this.opened.emit();
  }

  protected onMenuClosed(): void {
    this.closed.emit();
  }

  protected onSelectionChange(selection: TableSelection): void {
    this.tableSelected.emit(selection);
    if (this.closeOnSelect && this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
  }

  /**
   * Programmatically open the menu
   */
  public openMenu(): void {
    this.menuTrigger?.openMenu();
  }

  /**
   * Programmatically close the menu
   */
  public closeMenu(): void {
    this.menuTrigger?.closeMenu();
  }
}
