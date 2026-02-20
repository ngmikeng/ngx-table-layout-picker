# API Reference

Complete API documentation for NGX Table Layout Picker library.

## Table of Contents

- [Components](#components)
  - [NgxTableLayoutPickerComponent](#ngxtablelayoutpickercomponent)
  - [NgxTableLayoutPickerDropdownComponent](#ngxtablelayoutpickerdropdowncomponent)
  - [TableCellComponent](#tablecellcomponent)
  - [TableFooterComponent](#tablefootercomponent)
- [Services](#services)
  - [TableLayoutService](#tablelayoutservice)
  - [ResponsiveService](#responsiveservice)
  - [ThemeService](#themeservice)
- [Models](#models)
  - [TableSelection](#tableselection)
  - [TableCell](#tablecell)
  - [GridDimensions](#griddimensions)
  - [TableLayoutConfig](#tablelayoutconfig)
  - [ThemeMode](#thememode)
- [Constants](#constants)

---

## Components

### NgxTableLayoutPickerComponent

Main table layout picker component that renders an interactive grid for selecting table dimensions.

**Selector:** `ngx-table-layout-picker`

**Standalone:** `true`

**Change Detection:** `OnPush`

#### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rows` | `number` | `10` | Initial number of rows (3-20) |
| `cols` | `number` | `10` | Initial number of columns (3-20) |
| `maxRows` | `number` | `20` | Maximum number of rows when expanding |
| `maxCols` | `number` | `20` | Maximum number of columns when expanding |
| `showFooter` | `boolean` | `true` | Show footer with selection text |
| `theme` | `ThemeMode` | `'auto'` | Theme mode: 'light', 'dark', or 'auto' |
| `cellSize` | `number` | `24` | Size of each cell in pixels (20-40) |
| `expandable` | `boolean` | `true` | Enable dynamic grid expansion/shrinking |
| `responsive` | `boolean` | `true` | Enable responsive behavior for mobile devices |
| `minCellSize` | `number` | `20` | Minimum cell size for responsive scaling |
| `shrinkThreshold` | `number` | `2` | Number of cells away from edge before shrinking |
| `ariaLabel` | `string` | `'Table layout selector'` | ARIA label for accessibility |

#### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `selectionChange` | `EventEmitter<TableSelection>` | Emitted when user clicks to select a table layout |
| `cellHover` | `EventEmitter<TableCell>` | Emitted when user hovers over a cell |
| `gridExpanded` | `EventEmitter<GridDimensions>` | Emitted when grid expands to show more cells |
| `gridShrank` | `EventEmitter<GridDimensions>` | Emitted when grid shrinks to show fewer cells |
| `gridResized` | `EventEmitter<GridDimensions>` | Emitted when grid size changes (expand or shrink) |
| `themeChange` | `EventEmitter<ThemeMode>` | Emitted when effective theme changes |

#### Public Methods

##### `reset(): void`

Resets the grid to initial dimensions and clears any hover state.

```typescript
@ViewChild(NgxTableLayoutPickerComponent) picker!: NgxTableLayoutPickerComponent;

resetPicker() {
  this.picker.reset();
}
```

##### `setHoveredCell(row: number, col: number): void`

Programmatically sets the hovered cell, which highlights cells and triggers hover-related behavior.

**Parameters:**
- `row` - Row number (1-based)
- `col` - Column number (1-based)

```typescript
// Programmatically hover over 3×3 grid
this.picker.setHoveredCell(3, 3);
```

##### `getDimensions(): GridDimensions`

Returns the current grid dimensions.

**Returns:** `GridDimensions` object with `rows` and `cols` properties

```typescript
const dims = this.picker.getDimensions();
console.log(`Current grid: ${dims.rows} × ${dims.cols}`);
```

##### `setTheme(theme: ThemeMode): void`

Forces a theme update, overriding the input binding.

**Parameters:**
- `theme` - Theme mode: 'light', 'dark', or 'auto'

```typescript
// Switch to dark theme
this.picker.setTheme('dark');
```

#### Host Bindings

The component applies the following host bindings:

- `[attr.data-theme]` - Current effective theme ('light' or 'dark')
- `[class.tls-responsive]` - Applied when responsive mode is enabled
- `[class.tls-mobile]` - Applied on mobile devices
- `[class.tls-tablet]` - Applied on tablet devices
- `[class.tls-desktop]` - Applied on desktop devices
- `role="grid"` - ARIA role for accessibility
- `[attr.aria-label]` - ARIA label from input

#### Usage Example

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerComponent } from 'ngx-table-layout-picker';
import type { TableSelection, GridDimensions, TableCell } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-table-editor',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <ngx-table-layout-picker
      [rows]="10"
      [cols]="10"
      [maxRows]="20"
      [maxCols]="20"
      [theme]="'auto'"
      [expandable]="true"
      [responsive]="true"
      [showFooter]="true"
      (selectionChange)="onTableSelected($event)"
      (cellHover)="onCellHover($event)"
      (gridExpanded)="onGridExpanded($event)"
      (themeChange)="onThemeChange($event)">
    </ngx-table-layout-picker>
  `
})
export class TableEditorComponent {
  onTableSelected(selection: TableSelection): void {
    console.log(`Selected: ${selection.rows} × ${selection.cols}`);
    // Create table with these dimensions
  }

  onCellHover(cell: TableCell): void {
    console.log(`Hovering: ${cell.row} × ${cell.col}`);
  }

  onGridExpanded(dimensions: GridDimensions): void {
    console.log(`Grid expanded to: ${dimensions.rows} × ${dimensions.cols}`);
  }

  onThemeChange(theme: string): void {
    console.log(`Theme changed to: ${theme}`);
  }
}
```

---

### NgxTableLayoutPickerDropdownComponent

Dropdown wrapper component that integrates the table layout picker with Angular Material Menu.

**Selector:** `ngx-table-layout-picker-dropdown`

**Standalone:** `true`

**Change Detection:** `OnPush`

#### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `buttonLabel` | `string` | `'Insert Table'` | Label text for the trigger button |
| `buttonIcon` | `string` | `'table_chart'` | Material icon name for the button |
| `buttonAppearance` | `'basic' \| 'raised' \| 'stroked' \| 'flat'` | `'stroked'` | Material button appearance style |
| `selectorConfig` | `Partial<TableLayoutConfig>` | `{}` | Configuration object for the table layout selector |
| `menuPosition` | `'above' \| 'below'` | `'below'` | Position of menu relative to trigger button |
| `closeOnSelect` | `boolean` | `true` | Whether to close menu after table selection |
| `menuClass` | `string` | `'tls-dropdown-menu'` | CSS class for menu panel styling |
| `disabled` | `boolean` | `false` | Whether the button is disabled |

#### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `tableSelected` | `EventEmitter<TableSelection>` | Emitted when user selects a table layout |
| `opened` | `EventEmitter<void>` | Emitted when dropdown menu opens |
| `closed` | `EventEmitter<void>` | Emitted when dropdown menu closes |

#### Public Methods

##### `openMenu(): void`

Programmatically opens the dropdown menu.

```typescript
@ViewChild(NgxTableLayoutPickerDropdownComponent) dropdown!: NgxTableLayoutPickerDropdownComponent;

showTablePicker() {
  this.dropdown.openMenu();
}
```

##### `closeMenu(): void`

Programmatically closes the dropdown menu.

```typescript
this.dropdown.closeMenu();
```

#### Usage Example

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerDropdownComponent } from 'ngx-table-layout-picker';
import type { TableSelection } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [NgxTableLayoutPickerDropdownComponent],
  template: `
    <ngx-table-layout-picker-dropdown
      buttonLabel="Insert Table"
      buttonIcon="table_chart"
      buttonAppearance="raised"
      [selectorConfig]="{
        rows: 8,
        cols: 8,
        maxRows: 15,
        maxCols: 15,
        theme: 'dark',
        expandable: true,
        showFooter: true
      }"
      [closeOnSelect]="true"
      [disabled]="isReadOnly"
      (tableSelected)="insertTable($event)"
      (opened)="onDropdownOpened()"
      (closed)="onDropdownClosed()">
    </ngx-table-layout-picker-dropdown>
  `
})
export class ToolbarComponent {
  isReadOnly = false;

  insertTable(selection: TableSelection): void {
    console.log(`Inserting ${selection.rows} × ${selection.cols} table`);
    // Insert table into document
  }

  onDropdownOpened(): void {
    console.log('Dropdown opened');
  }

  onDropdownClosed(): void {
    console.log('Dropdown closed');
  }
}
```

---

### TableCellComponent

Internal component representing a single cell in the grid. Not exported in public API.

**Selector:** `lib-table-cell`

**Features:**
- Handles hover and click events
- Applies active/hovered states
- Provides accessibility attributes
- Supports touch interactions

---

### TableFooterComponent

Internal component displaying selection information below the grid. Not exported in public API.

**Selector:** `lib-table-footer`

**Features:**
- Shows formatted selection text (e.g., "5 × 3 Table")
- Visibility controlled by hover state
- Smooth transitions

---

## Services

### TableLayoutService

Core business logic service for table layout calculations and utilities.

**Provided in:** `'root'`

#### Methods

##### `calculateActiveCells(hoverRow: number, hoverCol: number): TableCell[]`

Calculates all active cells based on hover position. Active cells form a rectangle from (1,1) to (hoverRow, hoverCol).

**Parameters:**
- `hoverRow` - Row number being hovered
- `hoverCol` - Column number being hovered

**Returns:** Array of `TableCell` objects

```typescript
const cells = layoutService.calculateActiveCells(3, 4);
// Returns: [{row: 1, col: 1}, {row: 1, col: 2}, ..., {row: 3, col: 4}]
```

##### `isCellActive(cell: TableCell, hoveredCell: TableCell | null): boolean`

Determines if a specific cell should be marked as active based on the hovered cell.

**Parameters:**
- `cell` - Cell to check
- `hoveredCell` - Currently hovered cell (or null)

**Returns:** `true` if cell is within the active selection rectangle

##### `calculateOptimalDimensions(...): GridDimensions`

Calculates optimal grid dimensions considering expansion and shrinking behavior.

**Parameters:**
- `currentDimensions` - Current grid dimensions
- `hoverPosition` - Current hover position
- `minDimensions` - Minimum allowed dimensions
- `maxDimensions` - Maximum allowed dimensions
- `shrinkThreshold` - Distance from edge before shrinking (default: 2)

**Returns:** Optimal `GridDimensions`

##### `generateRange(max: number): number[]`

Generates an array of numbers from 1 to max (inclusive).

**Parameters:**
- `max` - Maximum value

**Returns:** Array `[1, 2, 3, ..., max]`

##### `formatSelectionText(rows: number, cols: number): string`

Formats selection dimensions as display text.

**Parameters:**
- `rows` - Number of rows
- `cols` - Number of columns

**Returns:** Formatted string (e.g., "5 × 3 Table")

##### `getCellAriaLabel(row: number, col: number): string`

Generates ARIA label for a cell.

**Parameters:**
- `row` - Row number
- `col` - Column number

**Returns:** ARIA label string (e.g., "5 rows by 3 columns")

##### `validateConfig(config: Partial<TableLayoutConfig>): TableLayoutConfig`

Validates and normalizes configuration object with default values.

**Parameters:**
- `config` - Partial configuration object

**Returns:** Complete validated `TableLayoutConfig`

---

### ResponsiveService

Service managing responsive behavior and breakpoint detection.

**Provided in:** `'root'`

#### Signals

##### `currentBreakpoint: Signal<BreakpointName>`

Reactive signal containing current breakpoint: 'mobile', 'tablet', or 'desktop'.

```typescript
const breakpoint = responsiveService.currentBreakpoint();
if (breakpoint === 'mobile') {
  // Mobile-specific logic
}
```

##### `isMobile: Signal<boolean>`

Computed signal indicating if current breakpoint is mobile.

##### `isTablet: Signal<boolean>`

Computed signal indicating if current breakpoint is tablet.

##### `isDesktop: Signal<boolean>`

Computed signal indicating if current breakpoint is desktop.

##### `isTouchDevice: Signal<boolean>`

Signal indicating if device supports touch input.

##### `isLandscape: Signal<boolean>`

Signal indicating if device is in landscape orientation.

#### Methods

##### `getRecommendedGridSize(): { rows: number; cols: number }`

Gets recommended grid dimensions for current breakpoint.

**Returns:** Object with `rows` and `cols` properties

```typescript
const size = responsiveService.getRecommendedGridSize();
// Mobile: { rows: 6, cols: 6 }
// Tablet: { rows: 8, cols: 8 }
// Desktop: { rows: 10, cols: 10 }
```

##### `getRecommendedCellSize(): number`

Gets recommended cell size in pixels for current breakpoint.

**Returns:** Cell size in pixels

```typescript
const cellSize = responsiveService.getRecommendedCellSize();
// Mobile: 32px, Tablet: 28px, Desktop: 24px
```

##### `getMinTouchTargetSize(): number`

Gets minimum touch target size for accessibility (48px per WCAG guidelines).

**Returns:** Minimum size in pixels

##### `calculateCellSize(containerWidth: number, cols: number, minSize: number, defaultSize: number): number`

Calculates optimal cell size based on container width and grid columns.

**Parameters:**
- `containerWidth` - Width of container in pixels
- `cols` - Number of columns
- `minSize` - Minimum cell size
- `defaultSize` - Default cell size

**Returns:** Calculated cell size

##### `debounce<T>(fn: T, delay: number): T`

Utility function to debounce rapid calls.

**Parameters:**
- `fn` - Function to debounce
- `delay` - Delay in milliseconds

**Returns:** Debounced function

---

### ThemeService

Service for centralized theme management and system preference detection.

**Provided in:** `'root'`

#### Signals

##### `themeMode: Signal<ThemeMode>`

Current theme mode setting ('light', 'dark', or 'auto').

##### `resolvedTheme: Signal<'light' | 'dark'>`

Resolved theme (never 'auto'). When mode is 'auto', this reflects the system preference.

##### `systemPreference: Signal<'light' | 'dark'>`

Current system theme preference from media query.

#### Methods

##### `setTheme(mode: ThemeMode): void`

Sets the theme mode.

**Parameters:**
- `mode` - Theme mode: 'light', 'dark', or 'auto'

```typescript
themeService.setTheme('dark');
```

##### `toggleTheme(): void`

Toggles between light and dark themes.

```typescript
themeService.toggleTheme();
```

---

## Models

### TableSelection

Represents a selected table layout.

```typescript
interface TableSelection {
  /** Number of rows selected */
  rows: number;
  
  /** Number of columns selected */
  cols: number;
  
  /** Optional array of all selected cells */
  cells?: TableCell[];
  
  /** Timestamp of selection */
  timestamp?: Date;
}
```

**Example:**
```typescript
const selection: TableSelection = {
  rows: 5,
  cols: 3,
  cells: [...],  // Optional
  timestamp: new Date()
};
```

---

### TableCell

Represents a single cell position in the grid.

```typescript
interface TableCell {
  /** Row number (1-based) */
  row: number;
  
  /** Column number (1-based) */
  col: number;
}
```

**Example:**
```typescript
const cell: TableCell = { row: 3, col: 5 };
```

---

### GridDimensions

Represents grid dimensions (rows and columns).

```typescript
interface GridDimensions {
  /** Number of rows */
  rows: number;
  
  /** Number of columns */
  cols: number;
}
```

**Example:**
```typescript
const dimensions: GridDimensions = { rows: 10, cols: 10 };
```

---

### TableLayoutConfig

Configuration options for the table layout picker.

```typescript
interface TableLayoutConfig {
  /** Initial number of rows (default: 10) */
  rows?: number;
  
  /** Initial number of columns (default: 10) */
  cols?: number;
  
  /** Maximum number of rows (default: 20) */
  maxRows?: number;
  
  /** Maximum number of columns (default: 20) */
  maxCols?: number;
  
  /** Whether to show the footer with selection info (default: true) */
  showFooter?: boolean;
  
  /** Theme mode: 'light', 'dark', or 'auto' (default: 'auto') */
  theme?: ThemeMode;
  
  /** Size of each cell in pixels (default: 24) */
  cellSize?: number;
  
  /** Enable dynamic grid expansion when hovering edges (default: true) */
  expandable?: boolean;
  
  /** Enable responsive behavior for mobile devices (default: true) */
  responsive?: boolean;
  
  /** Minimum cell size for responsive scaling (default: 20) */
  minCellSize?: number;
  
  /** ARIA label for accessibility */
  ariaLabel?: string;
}
```

**Example:**
```typescript
const config: TableLayoutConfig = {
  rows: 8,
  cols: 8,
  maxRows: 15,
  maxCols: 15,
  theme: 'dark',
  expandable: true,
  responsive: true,
  showFooter: true
};
```

---

### ThemeMode

Type representing theme mode options.

```typescript
type ThemeMode = 'light' | 'dark' | 'auto';
```

**Values:**
- `'light'` - Force light theme
- `'dark'` - Force dark theme
- `'auto'` - Use system preference

---

## Constants

### Responsive Constants

**File:** `responsive.constants.ts`

#### BREAKPOINTS

Breakpoint definitions for responsive behavior.

```typescript
const BREAKPOINTS = {
  mobile: { min: 0, max: 575 },
  tablet: { min: 576, max: 1023 },
  desktop: { min: 1024, max: Infinity }
};
```

#### GRID_DIMENSIONS

Recommended grid dimensions per breakpoint.

```typescript
const GRID_DIMENSIONS = {
  mobile: { rows: 6, cols: 6 },
  tablet: { rows: 8, cols: 8 },
  desktop: { rows: 10, cols: 10 }
};
```

#### CELL_SIZES

Recommended cell sizes per breakpoint.

```typescript
const CELL_SIZES = {
  mobile: 32,   // Larger for touch
  tablet: 28,
  desktop: 24
};
```

#### MIN_TOUCH_TARGET

Minimum touch target size for accessibility (WCAG 2.1 Level AAA).

```typescript
const MIN_TOUCH_TARGET = 48; // pixels
```

---

## Type Exports

All public types and interfaces are exported from the main entry point:

```typescript
import {
  // Components
  NgxTableLayoutPickerComponent,
  NgxTableLayoutPickerDropdownComponent,
  
  // Models
  TableSelection,
  TableCell,
  GridDimensions,
  TableLayoutConfig,
  ThemeMode,
  
  // Services
  TableLayoutService,
  ResponsiveService,
  ThemeService,
  
  // Constants
  BREAKPOINTS,
  GRID_DIMENSIONS,
  CELL_SIZES,
  MIN_TOUCH_TARGET
} from 'ngx-table-layout-picker';
```

---

## Version Compatibility

- **Angular:** 20+ (tested with 21.x)
- **TypeScript:** 5.2+
- **Angular Material:** 20+ (optional, required only for dropdown component)

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Additional Notes

### Signal-Based Architecture

The library uses Angular signals for reactive state management:

- All internal state is managed via signals
- Computed signals for derived values
- Effects for side effects
- Fully compatible with OnPush change detection

### Accessibility Features

- ARIA roles and labels
- Keyboard navigation support
- Screen reader announcements
- Focus management
- High contrast mode support
- WCAG 2.1 Level AA compliant

### Performance Considerations

- OnPush change detection strategy
- Efficient reactivity with signals
- Debounced resize handling
- Minimal DOM manipulation
- Tree-shakeable exports

---

For usage examples and guides, see the [Usage Guide](./usage-guide.md).

For theming customization, see the [Theming Guide](./theming.md).
