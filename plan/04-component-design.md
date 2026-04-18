# Component Design Specification

## Component Public APIs

### 1. NgxTableLayoutPickerComponent

#### Component Metadata
```typescript
@Component({
  selector: 'ngx-table-layout-picker',
  standalone: true,
  templateUrl: './table-layout-selector.component.html',
  styleUrls: ['./table-layout-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TableCellComponent, TableFooterComponent],
  host: {
    '[attr.data-theme]': 'theme()',
    '[class.tls-responsive]': 'responsive()',
    'role': 'grid',
    '[attr.aria-label]': 'ariaLabel()'
  }
})
export class NgxTableLayoutPickerComponent { }
```

#### Input Properties
```typescript
/**
 * Number of rows to display initially
 * @default 10
 * @minimum 3
 * @maximum 20
 */
@Input() rows = 10;

/**
 * Number of columns to display initially
 * @default 10
 * @minimum 3
 * @maximum 20
 */
@Input() cols = 10;

/**
 * Maximum number of rows the grid can expand to
 * @default 20
 */
@Input() maxRows = 20;

/**
 * Maximum number of columns the grid can expand to
 * @default 20
 */
@Input() maxCols = 20;

/**
 * Whether to show the footer with selection info
 * @default true
 */
@Input() showFooter = true;

/**
 * Theme mode: 'light', 'dark', or 'auto'
 * @default 'auto'
 */
@Input() theme: ThemeMode = 'auto';

/**
 * Size of each cell in pixels
 * @default 24
 * @minimum 20
 * @maximum 40
 */
@Input() cellSize = 24;

/**
 * Enable dynamic grid expansion when hovering edges
 * @default true
 */
@Input() expandable = true;

/**
 * Enable responsive behavior for mobile devices
 * @default true
 */
@Input() responsive = true;

/**
 * ARIA label for accessibility
 * @default 'Table layout selector'
 */
@Input() ariaLabel = 'Table layout selector';

/**
 * Minimum cell size for responsive scaling
 * @default 20
 */
@Input() minCellSize = 20;
```

#### Output Events
```typescript
/**
 * Emitted when user selects a table layout by clicking
 */
@Output() selectionChange = new EventEmitter<TableSelection>();

/**
 * Emitted when user hovers over a cell
 */
@Output() cellHover = new EventEmitter<TableCell>();

/**
 * Emitted when grid expands (adds row/column)
 */
@Output() gridExpanded = new EventEmitter<GridDimensions>();

/**
 * Emitted when theme changes
 */
@Output() themeChange = new EventEmitter<ThemeMode>();
```

#### Public Methods
```typescript
/**
 * Reset the grid to initial dimensions
 */
public reset(): void;

/**
 * Set the hovered cell programmatically
 */
public setHoveredCell(row: number, col: number): void;

/**
 * Get current grid dimensions
 */
public getDimensions(): GridDimensions;

/**
 * Force theme update
 */
public setTheme(theme: ThemeMode): void;
```

#### Component Template Structure
```html
<div class="tls-container" 
     [style.--cell-size.px]="cellSize"
     (mouseenter)="onContainerEnter()"
     (mouseleave)="onContainerLeave()">
  
  <!-- Grid -->
  <div class="tls-grid">
    @for (row of rows(); track row) {
      <div class="tls-row" [attr.data-row]="row">
        @for (col of cols(); track col) {
          <lib-table-cell
            [row]="row"
            [col]="col"
            [active]="isCellActive(row, col)"
            [hovered]="isCellHovered(row, col)"
            (cellHover)="onCellHover(row, col)"
            (cellClick)="onCellClick(row, col)"
            [attr.aria-label]="getCellAriaLabel(row, col)"
            [attr.aria-selected]="isCellActive(row, col)">
          </lib-table-cell>
        }
      </div>
    }
  </div>

  <!-- Footer -->
  @if (showFooter) {
    <lib-table-footer
      [selectionText]="selectionText()"
      [visible]="hasHoveredCell()">
    </lib-table-footer>
  }

  <!-- Screen reader announcements -->
  <div class="sr-only" role="status" aria-live="polite">
    {{ screenReaderText() }}
  </div>
</div>
```

---

### 2. NgxTableLayoutPickerDropdownComponent

#### Component Metadata
```typescript
@Component({
  selector: 'ngx-table-layout-picker-dropdown',
  standalone: true,
  templateUrl: './table-layout-dropdown.component.html',
  styleUrls: ['./table-layout-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgxTableLayoutPickerComponent
  ]
})
export class NgxTableLayoutPickerDropdownComponent { }
```

#### Input Properties
```typescript
/**
 * Label text for the trigger button
 * @default 'Insert Table'
 */
@Input() buttonLabel = 'Insert Table';

/**
 * Material icon name for the button
 * @default 'table_chart'
 */
@Input() buttonIcon = 'table_chart';

/**
 * Button appearance: 'basic', 'raised', 'stroked', 'flat'
 * @default 'stroked'
 */
@Input() buttonAppearance: MatButtonAppearance = 'stroked';

/**
 * Configuration for the table layout selector
 */
@Input() selectorConfig: Partial<TableLayoutConfig> = {};

/**
 * Menu position relative to trigger
 * @default 'below'
 */
@Input() menuPosition: 'above' | 'below' = 'below';

/**
 * Close menu after selection
 * @default true
 */
@Input() closeOnSelect = true;

/**
 * Menu panel class for custom styling
 */
@Input() menuClass = 'tls-dropdown-menu';

/**
 * Whether the button is disabled
 * @default false
 */
@Input() disabled = false;
```

#### Output Events
```typescript
/**
 * Emitted when table layout is selected
 */
@Output() tableSelected = new EventEmitter<TableSelection>();

/**
 * Emitted when dropdown opens
 */
@Output() opened = new EventEmitter<void>();

/**
 * Emitted when dropdown closes
 */
@Output() closed = new EventEmitter<void>();
```

#### Component Template
```html
<button mat-stroked-button
        [matMenuTriggerFor]="menu"
        [disabled]="disabled"
        (menuOpened)="onMenuOpened()"
        (menuClosed)="onMenuClosed()"
        aria-label="Open table layout selector">
  @if (buttonIcon) {
    <mat-icon>{{ buttonIcon }}</mat-icon>
  }
  <span>{{ buttonLabel }}</span>
</button>

<mat-menu #menu="matMenu" 
          [class]="menuClass"
          [yPosition]="menuPosition === 'above' ? 'above' : 'below'">
  <div (click)="$event.stopPropagation()">
    <ngx-table-layout-picker
      [rows]="selectorConfig.rows || 10"
      [cols]="selectorConfig.cols || 10"
      [maxRows]="selectorConfig.maxRows || 20"
      [maxCols]="selectorConfig.maxCols || 20"
      [showFooter]="selectorConfig.showFooter ?? true"
      [theme]="selectorConfig.theme || 'auto'"
      [expandable]="selectorConfig.expandable ?? true"
      (selectionChange)="onSelectionChange($event)">
    </ngx-table-layout-picker>
  </div>
</mat-menu>
```

---

### 3. TableCellComponent (Internal)

#### Component Metadata
```typescript
@Component({
  selector: 'ngx-table-cell',
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
export class TableCellComponent { }
```

#### Input Properties
```typescript
@Input() row!: number;
@Input() col!: number;
@Input() active = false;
@Input() hovered = false;
```

#### Output Events
```typescript
@Output() cellHover = new EventEmitter<void>();
@Output() cellClick = new EventEmitter<void>();
```

---

### 4. TableFooterComponent (Internal)

#### Component Metadata
```typescript
@Component({
  selector: 'ngx-table-footer',
  standalone: true,
  template: `
    <div class="tls-footer" [class.visible]="visible">
      <span>{{ selectionText || '0 × 0' }}</span>
    </div>
  `,
  styleUrls: ['./table-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFooterComponent { }
```

#### Input Properties
```typescript
@Input() selectionText = '';
@Input() visible = false;
```

---

## Service APIs

### TableLayoutService

```typescript
@Injectable({ providedIn: 'root' })
export class TableLayoutService {
  /**
   * Calculate all active cells based on hover position
   */
  calculateActiveCells(hoverRow: number, hoverCol: number): TableCell[] {
    const cells: TableCell[] = [];
    for (let r = 1; r <= hoverRow; r++) {
      for (let c = 1; c <= hoverCol; c++) {
        cells.push({ row: r, col: c });
      }
    }
    return cells;
  }

  /**
   * Check if a specific cell should be marked as active
   */
  isCellActive(
    cell: TableCell,
    hoveredCell: TableCell | null
  ): boolean {
    if (!hoveredCell) return false;
    return cell.row <= hoveredCell.row && cell.col <= hoveredCell.col;
  }

  /**
   * Determine if grid should expand based on hover position
   */
  shouldExpandGrid(
    currentDimensions: GridDimensions,
    hoverPosition: TableCell,
    maxDimensions: GridDimensions
  ): { expandRows: boolean; expandCols: boolean } {
    const expandRows = 
      hoverPosition.row >= currentDimensions.rows &&
      currentDimensions.rows < maxDimensions.rows;
    
    const expandCols = 
      hoverPosition.col >= currentDimensions.cols &&
      currentDimensions.cols < maxDimensions.cols;

    return { expandRows, expandCols };
  }

  /**
   * Calculate responsive cell size based on container
   */
  calculateResponsiveCellSize(
    containerWidth: number,
    columns: number,
    minSize: number,
    maxSize: number,
    gap: number = 2
  ): number {
    const availableWidth = containerWidth - (columns + 1) * gap;
    const calculatedSize = availableWidth / columns;
    return Math.max(minSize, Math.min(maxSize, calculatedSize));
  }

  /**
   * Format selection as text (e.g., "5 × 7")
   */
  formatSelectionText(rows: number, cols: number): string {
    return `${rows} × ${cols}`;
  }

  /**
   * Validate configuration
   */
  validateConfig(config: TableLayoutConfig): TableLayoutConfig {
    return {
      rows: Math.max(3, Math.min(20, config.rows || 10)),
      cols: Math.max(3, Math.min(20, config.cols || 10)),
      maxRows: Math.max(3, Math.min(20, config.maxRows || 20)),
      maxCols: Math.max(3, Math.min(20, config.maxCols || 20)),
      ...config
    };
  }
}
```

---

## Directives

### TableCellHoverDirective (Optional Enhancement)

```typescript
@Directive({
  selector: '[tlsCellHover]',
  standalone: true
})
export class TableCellHoverDirective {
  @Input() row!: number;
  @Input() col!: number;
  @Output() cellHovered = new EventEmitter<TableCell>();

  @HostListener('mouseenter')
  @HostListener('touchstart', ['$event'])
  onHover(event?: TouchEvent): void {
    if (event) {
      event.preventDefault();
    }
    this.cellHovered.emit({ row: this.row, col: this.col });
  }
}
```

---

## Type Definitions

### Complete Type System

```typescript
// table-cell.model.ts
export interface TableCell {
  row: number;
  col: number;
}

// table-selection.model.ts
export interface TableSelection {
  rows: number;
  cols: number;
  cells?: TableCell[];
  timestamp?: Date;
}

// grid-dimensions.model.ts
export interface GridDimensions {
  rows: number;
  cols: number;
}

// table-layout-config.model.ts
export interface TableLayoutConfig {
  rows?: number;
  cols?: number;
  maxRows?: number;
  maxCols?: number;
  showFooter?: boolean;
  theme?: ThemeMode;
  cellSize?: number;
  expandable?: boolean;
  responsive?: boolean;
  minCellSize?: number;
  ariaLabel?: string;
}

// theme.model.ts
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  background: string;
  text: string;
  border: string;
  borderHover: string;
  cellHover: string;
  cellActive: string;
}

// material.types.ts
export type MatButtonAppearance = 'basic' | 'raised' | 'stroked' | 'flat';
export type MenuPosition = 'above' | 'below';
```

---

## Usage Examples

### Example 1: Basic Inline Usage
```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerComponent, TableSelection } from '@your-org/ngx-table-layout-picker';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <ngx-table-layout-picker
      [rows]="10"
      [cols]="10"
      (selectionChange)="onTableSelected($event)">
    </ngx-table-layout-picker>
  `
})
export class EditorComponent {
  onTableSelected(selection: TableSelection): void {
    console.log(`Selected: ${selection.rows} × ${selection.cols}`);
    // Insert table with these dimensions
  }
}
```

### Example 2: Dropdown with Material
```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerDropdownComponent, TableSelection } from '@your-org/ngx-table-layout-picker';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [NgxTableLayoutPickerDropdownComponent],
  template: `
    <ngx-table-layout-picker-dropdown
      buttonLabel="Insert Table"
      buttonIcon="table_chart"
      [selectorConfig]="{ rows: 8, cols: 8, theme: 'dark' }"
      (tableSelected)="insertTable($event)">
    </ngx-table-layout-picker-dropdown>
  `
})
export class ToolbarComponent {
  insertTable(selection: TableSelection): void {
    // Handle table insertion
  }
}
```

### Example 3: Custom Theming
```typescript
@Component({
  selector: 'app-themed-selector',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <ngx-table-layout-picker
      [theme]="currentTheme"
      [rows]="12"
      [cols]="12"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `,
  styles: [`
    ::ng-deep {
      --tls-cell-hover-color: #ff6b6b;
      --tls-cell-active-color: #ee5a52;
      --tls-cell-border-color: #ddd;
    }
  `]
})
export class ThemedSelectorComponent {
  currentTheme: ThemeMode = 'auto';
}
```

### Example 4: Responsive Configuration
```typescript
@Component({
  selector: 'app-responsive-selector',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <ngx-table-layout-picker
      [rows]="gridSize.rows"
      [cols]="gridSize.cols"
      [responsive]="true"
      [minCellSize]="20"
      [cellSize]="isMobile ? 32 : 24"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class ResponsiveSelectorComponent {
  isMobile = window.innerWidth < 576;
  
  get gridSize() {
    return this.isMobile 
      ? { rows: 6, cols: 6 }
      : { rows: 10, cols: 10 };
  }
}
```

---

## Component Styling Structure

### CSS Architecture
```scss
// ngx-table-layout-picker.component.scss
:host {
  display: block;
  
  // CSS Custom Properties
  --tls-cell-size: 24px;
  --tls-gap: 2px;
  --tls-border-width: 2px;
  
  // Theme variables (set by parent)
  --tls-background: var(--tls-theme-background, #fff);
  --tls-text: var(--tls-theme-text, #212121);
  --tls-border: var(--tls-theme-border, #e0e0e0);
  --tls-hover: var(--tls-theme-hover, #1976d2);
  --tls-active: var(--tls-theme-active, #1565c0);
}

.tls-container {
  background: var(--tls-background);
  color: var(--tls-text);
  padding: 8px;
  border-radius: 4px;
}

.tls-grid {
  display: grid;
  gap: var(--tls-gap);
  width: fit-content;
}

.tls-row {
  display: flex;
  gap: var(--tls-gap);
}

// Responsive
:host(.tls-responsive) {
  @media (max-width: 576px) {
    --tls-cell-size: 32px;
  }
}

// Theme variants
:host([data-theme="dark"]) {
  --tls-background: #1e1e1e;
  --tls-text: #f5f5f5;
  --tls-border: #424242;
  --tls-hover: #42a5f5;
  --tls-active: #64b5f6;
}

:host([data-theme="light"]) {
  --tls-background: #ffffff;
  --tls-text: #212121;
  --tls-border: #e0e0e0;
  --tls-hover: #1976d2;
  --tls-active: #1565c0;
}
```
