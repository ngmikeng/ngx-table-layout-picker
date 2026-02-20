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

- Node.js 18.x or higher
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
- ✅ Angular 17+ standalone components
- ✅ Signal-based state management
- ✅ Material Design integration

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

## � CI/CD & Automation

This project includes a comprehensive CI/CD pipeline using GitHub Actions for automated testing, deployment, and releases.

### Workflows

- **CI** - Continuous integration testing on Node.js 18.x and 20.x
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

## �📖 Documentation

### Quick Links

- [Library README](projects/ngx-table-layout-picker/README.md)
- [Architecture Documentation](plan/02-architecture.md)
- [Feature Requirements](plan/03-feature-requirements.md)
- [Component Design](plan/04-component-design.md)
- [CI/CD Setup & Documentation](.github/README.md)
- [CI/CD Deployment Plan](plan/09-cicd-deployment.md)
- [Implementation Progress](plan/process/implementation-progress.md)

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

- **Angular**: 21.1.x
- **TypeScript**: 5.9.x
- **Material**: 21.1.x
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

