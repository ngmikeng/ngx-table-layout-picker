# NGX Table Layout Picker

[![Angular](https://img.shields.io/badge/Angular-17+-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An intuitive Angular library for selecting table dimensions through an interactive grid interface, similar to the table insertion tools in popular office applications.

![NGX Table Layout Picker Demo](https://via.placeholder.com/800x400?text=NGX+Table+Layout+Picker+Demo)

## ✨ Features

- 🎯 **Intuitive Grid Interface** - Hover and click to select table dimensions
- 🎨 **Theme Support** - Light, dark, and auto-detection themes
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ♿ **Accessible** - Full keyboard navigation and ARIA support
- 🔌 **Standalone Components** - Modern Angular 17+ standalone components
- ⚡ **Signal-Based** - Reactive state management with Angular signals
- 🎭 **Material Design** - Optional integration with Angular Material
- 🎨 **Customizable** - Extensive styling options via CSS custom properties
- 📦 **Tree-Shakeable** - Optimal bundle size
- 🧪 **Well Tested** - Comprehensive unit test coverage

## 📦 Installation

```bash
npm install ngx-table-layout-picker
```

## 🚀 Quick Start

### Basic Inline Usage

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerComponent, TableSelection } from 'ngx-table-layout-picker';

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

### Dropdown Mode with Material

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerDropdownComponent, TableSelection } from 'ngx-table-layout-picker';

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

## 📚 Documentation

### NgxTableLayoutPickerComponent

The main table layout picker component.

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `rows` | `number` | `10` | Initial number of rows (3-20) |
| `cols` | `number` | `10` | Initial number of columns (3-20) |
| `maxRows` | `number` | `20` | Maximum number of rows |
| `maxCols` | `number` | `20` | Maximum number of columns |
| `showFooter` | `boolean` | `true` | Show footer with selection info |
| `theme` | `ThemeMode` | `'auto'` | Theme: 'light', 'dark', or 'auto' |
| `cellSize` | `number` | `24` | Size of each cell in pixels (20-40) |
| `expandable` | `boolean` | `true` | Enable dynamic grid expansion |
| `responsive` | `boolean` | `true` | Enable responsive behavior |
| `minCellSize` | `number` | `20` | Minimum cell size for responsive scaling |
| `ariaLabel` | `string` | `'Table layout selector'` | ARIA label for accessibility |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `selectionChange` | `EventEmitter<TableSelection>` | Emitted when user selects a layout |
| `cellHover` | `EventEmitter<TableCell>` | Emitted when user hovers over a cell |
| `gridExpanded` | `EventEmitter<GridDimensions>` | Emitted when grid expands |
| `themeChange` | `EventEmitter<ThemeMode>` | Emitted when theme changes |

#### Public Methods

```typescript
// Reset the grid to initial dimensions
reset(): void

// Set the hovered cell programmatically
setHoveredCell(row: number, col: number): void

// Get current grid dimensions
getDimensions(): GridDimensions

// Force theme update
setTheme(theme: ThemeMode): void
```

### NgxTableLayoutPickerDropdownComponent

Dropdown wrapper component with Angular Material Menu integration.

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `buttonLabel` | `string` | `'Insert Table'` | Label text for trigger button |
| `buttonIcon` | `string` | `'table_chart'` | Material icon name |
| `buttonAppearance` | `MatButtonAppearance` | `'stroked'` | Button style |
| `selectorConfig` | `Partial<TableLayoutConfig>` | `{}` | Configuration for the selector |
| `menuPosition` | `'above' \| 'below'` | `'below'` | Menu position |
| `closeOnSelect` | `boolean` | `true` | Close menu after selection |
| `menuClass` | `string` | `'tls-dropdown-menu'` | CSS class for menu panel |
| `disabled` | `boolean` | `false` | Whether button is disabled |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `tableSelected` | `EventEmitter<TableSelection>` | Emitted when table layout is selected |
| `opened` | `EventEmitter<void>` | Emitted when dropdown opens |
| `closed` | `EventEmitter<void>` | Emitted when dropdown closes |

## 🎨 Theming

### Basic Theme Usage

```typescript
<ngx-table-layout-picker
  [theme]="'light'"  // or 'dark' or 'auto'
  (selectionChange)="onSelect($event)">
</ngx-table-layout-picker>
```

### Custom Styling with CSS Variables

```scss
ngx-table-layout-picker {
  --tls-cell-size: 28px;
  --tls-gap: 3px;
  --tls-border: #ccc;
  --tls-border-hover: #ff6b6b;
  --tls-cell-active: #ff5252;
  --tls-background: #fafafa;
  --tls-text: #333;
}
```

### Available CSS Custom Properties

- `--tls-cell-size` - Cell size in pixels
- `--tls-gap` - Gap between cells
- `--tls-border-width` - Border width
- `--tls-padding` - Component padding
- `--tls-background` - Background color
- `--tls-text` - Text color
- `--tls-border` - Cell border color
- `--tls-border-hover` - Cell border color on hover
- `--tls-cell-active` - Active cell background
- `--tls-focus-color` - Keyboard focus indicator color

## ♿ Accessibility

The library is fully accessible and includes:

- **ARIA Attributes** - Proper roles and labels for screen readers
- **Keyboard Navigation** - Full keyboard support
  - `Arrow Keys` - Navigate between cells
  - `Enter/Space` - Select current cell
  - `Escape` - Close dropdown
  - `Tab` - Standard focus flow
- **Screen Reader Announcements** - Live region updates
- **Focus Management** - Visual focus indicators
- **WCAG 2.1 AA Compliant** - Meets accessibility standards

## 📱 Responsive Design

The component automatically adapts to different screen sizes:

- **Desktop (>1024px)** - Full grid, 24px cells
- **Tablet (576-1024px)** - Optimized spacing
- **Mobile (<576px)** - Larger touch targets (32px), reduced grid

## 🔧 Configuration Examples

### Responsive Configuration

```typescript
@Component({
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
export class ResponsiveComponent {
  isMobile = window.innerWidth < 576;
  
  get gridSize() {
    return this.isMobile 
      ? { rows: 6, cols: 6 }
      : { rows: 10, cols: 10 };
  }
}
```

### Themed Configuration

```typescript
<ngx-table-layout-picker-dropdown
  buttonLabel="Insert Table"
  buttonIcon="table_chart"
  [selectorConfig]="{
    rows: 12,
    cols: 12,
    theme: currentTheme,
    showFooter: true,
    expandable: true
  }"
  (tableSelected)="onTableSelected($event)">
</ngx-table-layout-picker-dropdown>
```

## 🧪 Testing

The library includes comprehensive test coverage:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Building

To build the library:

```bash
npm run build
```

Build output is in `dist/ngx-table-layout-picker`.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/your-username/ngx-table-layout-picker/issues).

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/ngx-table-layout-picker/discussions)
- 📖 Documentation: [Full Documentation](https://your-docs-site.com)

## 🙏 Acknowledgments

Inspired by table insertion tools in popular office applications like Microsoft Word and Google Docs.

---

Made with ❤️ using [Angular](https://angular.dev)

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
