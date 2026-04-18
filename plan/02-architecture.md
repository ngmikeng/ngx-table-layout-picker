# Architecture & Project Structure

## Angular Workspace Structure

### Monorepo Layout
```
ngx-table-layout-picker/
├── projects/
│   ├── ngx-table-layout-picker/          # Library
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/
│   │   │   │   │   ├── table-layout-selector/
│   │   │   │   │   │   ├── table-layout-selector.component.ts
│   │   │   │   │   │   ├── table-layout-selector.component.html
│   │   │   │   │   │   ├── table-layout-selector.component.scss
│   │   │   │   │   │   └── table-layout-selector.component.spec.ts
│   │   │   │   │   └── table-layout-dropdown/
│   │   │   │   │       ├── table-layout-dropdown.component.ts
│   │   │   │   │       ├── table-layout-dropdown.component.html
│   │   │   │   │       ├── table-layout-dropdown.component.scss
│   │   │   │   │       └── table-layout-dropdown.component.spec.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── table-cell.model.ts
│   │   │   │   │   └── table-layout-config.model.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── table-layout.service.ts
│   │   │   │   │   └── table-layout.service.spec.ts
│   │   │   │   ├── directives/
│   │   │   │   │   ├── table-cell-hover.directive.ts
│   │   │   │   │   └── table-cell-hover.directive.spec.ts
│   │   │   │   ├── themes/
│   │   │   │   │   ├── _light-theme.scss
│   │   │   │   │   ├── _dark-theme.scss
│   │   │   │   │   └── _theme-base.scss
│   │   │   │   └── utils/
│   │   │   │       └── responsive.utils.ts
│   │   │   ├── public-api.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── ng-package.json
│   │   ├── tsconfig.lib.json
│   │   └── README.md
│   │
│   └── demo/                             # Demo Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── pages/
│       │   │   │   ├── home/
│       │   │   │   ├── inline-demo/
│       │   │   │   ├── dropdown-demo/
│       │   │   │   └── theming-demo/
│       │   │   ├── app.component.ts
│       │   │   ├── app.component.html
│       │   │   ├── app.config.ts
│       │   │   └── app.routes.ts
│       │   ├── styles.scss
│       │   ├── index.html
│       │   └── main.ts
│       ├── angular.json
│       └── tsconfig.app.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── release.yml
│
├── docs/                                 # Generated documentation
├── dist/                                 # Build output
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Component Architecture

### Core Components

#### 1. NgxTableLayoutPickerComponent (Standalone)
**Responsibility**: Main table grid selector component
- Renders grid of cells
- Handles hover interactions
- Emits selection events
- Supports theming
- Responsive layout

**Inputs**:
```typescript
@Input() rows: number = 10;
@Input() cols: number = 10;
@Input() maxRows: number = 20;
@Input() maxCols: number = 20;
@Input() showFooter: boolean = true;
@Input() theme: 'light' | 'dark' | 'auto' = 'auto';
@Input() cellSize: number = 24; // px
@Input() expandable: boolean = true;
```

**Outputs**:
```typescript
@Output() selectionChange = new EventEmitter<TableSelection>();
@Output() cellHover = new EventEmitter<TableCell>();
@Output() gridExpanded = new EventEmitter<GridDimensions>();
```

#### 2. NgxTableLayoutPickerDropdownComponent (Material Integration)
**Responsibility**: Wraps selector in Material Menu
- Material menu trigger button
- Dropdown positioning
- Theme integration
- Responsive behavior

**Inputs**:
```typescript
@Input() buttonLabel: string = 'Insert Table';
@Input() buttonIcon: string = 'table_chart';
@Input() selectorConfig: TableLayoutConfig;
@Input() position: MenuPosition = 'below';
```

**Outputs**:
```typescript
@Output() tableSelected = new EventEmitter<TableSelection>();
```

### Supporting Components

#### 3. TableCellComponent
**Responsibility**: Individual cell rendering
- Cell visualization
- Hover state
- Active state
- Touch support

#### 4. TableFooterComponent
**Responsibility**: Footer display
- Shows current selection (e.g., "5 × 7")
- Responsive layout
- Theme support

## Service Architecture

### TableLayoutService
**Responsibility**: Business logic and state management

```typescript
@Injectable({ providedIn: 'root' })
export class TableLayoutService {
  // Calculate selected cells based on hover position
  calculateSelection(hoverRow: number, hoverCol: number): TableCell[]
  
  // Determine if cell should be highlighted
  isCellActive(cell: TableCell, selection: TableSelection): boolean
  
  // Handle grid expansion
  shouldExpandGrid(
    currentDimensions: GridDimensions,
    hoverPosition: CellPosition
  ): boolean
  
  // Calculate responsive cell size
  calculateCellSize(
    containerWidth: number,
    columns: number,
    minCellSize: number
  ): number
}
```

## Data Models

### Core Interfaces

```typescript
export interface TableCell {
  row: number;
  col: number;
}

export interface TableSelection {
  rows: number;
  cols: number;
  cells?: TableCell[];
}

export interface GridDimensions {
  rows: number;
  cols: number;
}

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
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: ThemeMode;
  cellBorderColor?: string;
  cellHoverColor?: string;
  cellActiveColor?: string;
  backgroundColor?: string;
  textColor?: string;
}
```

## State Management

### Component State
- Use signals (Angular 20+) for reactive state
- Local component state (no global state needed)

```typescript
export class NgxTableLayoutPickerComponent {
  // Signals for reactive state
  protected readonly hoveredCell = signal<TableCell | null>(null);
  protected readonly selectedCell = signal<TableCell | null>(null);
  protected readonly currentDimensions = signal<GridDimensions>({
    rows: this.rows,
    cols: this.cols
  });
  
  // Computed values
  protected readonly activeCells = computed(() => {
    const hovered = this.hoveredCell();
    if (!hovered) return [];
    return this.calculateActiveCells(hovered);
  });
  
  protected readonly selectionText = computed(() => {
    const hovered = this.hoveredCell();
    return hovered ? `${hovered.row} × ${hovered.col}` : '';
  });
}
```

## Theming Architecture

### Theme System
- SCSS-based theming
- CSS custom properties
- Material Design integration
- System preference detection

### Theme Structure
```scss
// _theme-base.scss
@mixin table-layout-theme($theme) {
  --tls-cell-border: #{map-get($theme, 'border')};
  --tls-cell-hover: #{map-get($theme, 'hover')};
  --tls-cell-active: #{map-get($theme, 'active')};
  --tls-background: #{map-get($theme, 'background')};
  --tls-text: #{map-get($theme, 'text')};
}
```

## Accessibility Architecture

### ARIA Implementation
- Proper ARIA roles and labels
- Keyboard navigation support
- Screen reader announcements
- Focus management

### Keyboard Navigation
- Arrow keys: Navigate cells
- Enter/Space: Select table
- Escape: Close dropdown
- Tab: Standard focus flow

## Responsive Strategy

### Breakpoints
```typescript
export const BREAKPOINTS = {
  mobile: 576,
  tablet: 768,
  desktop: 1024
} as const;
```

### Responsive Behavior
- **Mobile (<576px)**: Reduce grid size, larger touch targets
- **Tablet (576-1024px)**: Standard grid, optimized spacing
- **Desktop (>1024px)**: Full grid, finest control

## Module Organization

### Public API Exports
```typescript
// public-api.ts
export * from './lib/components/ngx-table-layout-picker/ngx-table-layout-picker.component';
export * from './lib/components/ngx-table-layout-picker-dropdown/ngx-table-layout-picker-dropdown.component';
export * from './lib/models/table-cell.model';
export * from './lib/models/table-layout-config.model';
export * from './lib/services/table-layout.service';
```

### Import Strategy
```typescript
// Consumers import the library like this:
import { 
  NgxTableLayoutPickerComponent,
  NgxTableLayoutPickerDropdownComponent,
  TableSelection 
} from '@your-org/ngx-table-layout-picker';
```

## Build & Distribution

### Library Build
- **ng-packagr**: Angular library packaging
- **Output**: UMD, ESM, FESM bundles
- **Peer Dependencies**: Angular, Material
- **Bundle Size Target**: < 50KB gzipped

### Demo Build
- **Angular Build**: Production optimization
- **Output**: Static files for GitHub Pages
- **Base Href**: Configured for subdirectory deployment
