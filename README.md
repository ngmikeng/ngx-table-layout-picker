# NGX Table Layout Picker Workspace

[![CI](https://github.com/ngmikeng/ngx-table-layout-picker/workflows/CI/badge.svg)](https://github.com/ngmikeng/ngx-table-layout-picker/actions)
[![Deploy](https://github.com/ngmikeng/ngx-table-layout-picker/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/ngmikeng/ngx-table-layout-picker/actions)
[![CodeQL](https://github.com/ngmikeng/ngx-table-layout-picker/workflows/CodeQL/badge.svg)](https://github.com/ngmikeng/ngx-table-layout-picker/actions)

Angular library workspace for the NGX Table Layout Picker - an intuitive grid-based table dimension selector component.

## 📁 Project Structure

This workspace contains:

- **`projects/ngx-table-layout-picker/`** - The main library package
- **`projects/demo/`** - Demo application showcasing the library features
- **`plan/`** - Architecture and implementation documentation

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install
```

### Development

#### Run Demo Application

```bash
npm start
```

Open your browser and navigate to `http://localhost:4200/` to see the demo application.

#### Build Library

```bash
npm run build
```

The built library will be in `dist/ngx-table-layout-picker/`.

#### Run Tests

```bash
npm test
```

## 📚 Library Features

The NGX Table Layout Picker library provides:

- ✅ Interactive grid-based table dimension selection
- ✅ Inline and dropdown usage modes
- ✅ Light, dark, and auto theme detection
- ✅ Responsive design for all devices
- ✅ Full accessibility support (ARIA, keyboard navigation)
- ✅ Angular 20+ standalone components
- ✅ Signal-based state management
- ✅ Material Design integration

## 🔌 Quick API Overview

### Components

- **`NgxTableLayoutPickerComponent`** - Main inline table dimension selector
  - Interactive grid interface with hover and click selection
  - Configurable dimensions, themes, and responsive behavior
  - Events: `selectionChange`, `cellHover`, `gridExpanded`, `gridShrank`

- **`NgxTableLayoutPickerDropdownComponent`** - Material Design dropdown wrapper
  - Button trigger with customizable appearance
  - Material Menu integration
  - Pass-through configuration to picker component

### Services

- **`TableLayoutService`** - Core business logic for grid calculations
- **`ResponsiveService`** - Breakpoint detection and responsive recommendations
- **`ThemeService`** - Theme management and system preference detection

### Models

- **`TableSelection`** - Selected table dimensions with rows, cols, cells, and timestamp
- **`TableLayoutConfig`** - Configuration options for the picker
- **`GridDimensions`** - Simple row/col dimensions
- **`ThemeMode`** - Theme type: 'light' | 'dark' | 'auto'

For complete API details, see the [API Reference](docs/api-reference.md).

## 🚀 Quick Start Examples

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
      [theme]="'auto'"
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

### Dropdown with Material Design

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
      [selectorConfig]="{ rows: 10, cols: 10, theme: 'auto' }"
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

For more examples and patterns, see the [Usage Guide](docs/usage-guide.md).

## 🔧 Development Workflow

### 1. Library Development

Make changes to files in `projects/ngx-table-layout-picker/src/`.

### 2. Build Library

```bash
ng build ngx-table-layout-picker
```

### 3. Test in Demo App

The demo app imports from `ngx-table-layout-picker` which resolves to:
- `dist/ngx-table-layout-picker` (after building)
- Or the source files during development with path mapping

### 4. Run Tests

```bash
ng test
```

## 📦 Publishing

After building the library:

```bash
cd dist/ngx-table-layout-picker
npm publish
```

## CI/CD & Automation

This project includes a comprehensive CI/CD pipeline using GitHub Actions for automated testing, deployment, and releases.

### Workflows

- **CI** - Continuous integration testing on Node.js 20.x+
- **Deploy** - Automatic deployment to GitHub Pages on push to `main`
- **Release** - Semantic versioning and NPM publishing
- **PR Checks** - Automated validation for pull requests
- **CodeQL** - Weekly security scanning

### Demo Application

The demo app is automatically deployed to GitHub Pages:
- **URL**: `https://ngmikeng.github.io/ngx-table-layout-picker/`
- **Trigger**: Automatic on push to `main` branch
- **Manual**: Use workflow dispatch in Actions tab

### Semantic Versioning

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning:

```bash
# Patch release (1.0.0 → 1.0.1)
fix(selector): correct cell selection bug

# Minor release (1.0.0 → 1.1.0)
feat(dropdown): add keyboard navigation

# Major release (1.0.0 → 2.0.0)
feat(api): redesign component interface

BREAKING CHANGE: removed deprecated cellBorderColor option
```

### Setup & Configuration

For detailed setup instructions including:
- Enabling GitHub Pages
- Configuring NPM publishing
- Setting up secrets
- Troubleshooting

See the [CI/CD documentation](.github/README.md).

## Documentation

### Library Documentation

- 📖 **[API Reference](docs/api-reference.md)** - Complete API documentation for all components, services, and models
- 📘 **[Usage Guide](docs/usage-guide.md)** - Comprehensive examples and integration patterns
- 🎨 **[Theming Guide](docs/theming.md)** - Customization and styling documentation
- 📦 **[Library README](projects/ngx-table-layout-picker/README.md)** - Quick start and overview

### Demo & Live Examples

- 🚀 **[Live Demo](https://ngmikeng.github.io/ngx-table-layout-picker/)** - Interactive demo application
- 💻 **[Demo Source Code](projects/demo/src)** - Demo application implementation

### Project Documentation

- 🏗️ **[Architecture Documentation](plan/02-architecture.md)** - System architecture and design
- ✅ **[Feature Requirements](plan/03-feature-requirements.md)** - Feature specifications
- 🎯 **[Component Design](plan/04-component-design.md)** - Component structure and patterns
- 🔄 **[CI/CD Setup & Documentation](.github/README.md)** - Automated workflows and deployment
- 📊 **[CI/CD Deployment Plan](plan/09-cicd-deployment.md)** - Deployment strategy
- 📈 **[Implementation Progress](plan/process/implementation-progress.md)** - Development timeline

### Components

#### NgxTableLayoutPickerComponent
Main table layout selector with grid interface.

#### NgxTableLayoutPickerDropdownComponent  
Dropdown wrapper with Angular Material integration.

#### Supporting Components
- TableCellComponent (internal)
- TableFooterComponent (internal)

### Services

#### TableLayoutService
Business logic for cell calculations, validation, and utilities.

## 🎨 Demo Application

The demo app (`projects/demo/`) showcases:

1. **Inline Mode** - Direct component usage
2. **Dropdown Mode** - Material Menu integration  
3. **Feature Highlights** - Key capabilities list
4. **Theme Switching** - Light/dark mode toggle
5. **Selection Tracking** - Real-time selection display

## 📝 Scripts

```bash
# Start development server
npm start

# Build library
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 🏗️ Workspace Configuration

- **Angular**: 20+ (tested with 21.1.x)
- **TypeScript**: 5.9.x
- **Material**: 20+ (tested with 21.1.x)
- **Testing**: Vitest
- **Build**: ng-packagr

## 🤝 Contributing

1. Create a feature branch from `develop` or `main`
2. Make your changes following [Conventional Commits](https://www.conventionalcommits.org/)
3. Write/update tests
4. Build and test locally
5. Submit a pull request
   - PR checks workflow will automatically validate your changes
   - All tests must pass before merging

### Commit Message Format

```
<type>(<scope>): <subject>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

See [CI/CD documentation](.github/README.md) for more details.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

Built with [Angular CLI](https://github.com/angular/angular-cli) and inspired by table insertion tools in popular office applications.

---

**Made with ❤️ using Angular**

For more information on Angular CLI commands, visit the [Angular CLI Documentation](https://angular.dev/tools/cli).

