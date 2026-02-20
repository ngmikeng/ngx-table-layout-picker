# NGX Table Layout Picker - Documentation

Welcome to the comprehensive documentation for NGX Table Layout Picker, an intuitive Angular library for selecting table dimensions through an interactive grid interface.

## 📚 Documentation Index

### Getting Started

- **[Main README](../README.md)** - Project overview and quick start
- **[Library README](../projects/ngx-table-layout-picker/README.md)** - Library installation and basic usage

### Core Documentation

1. **[API Reference](./api-reference.md)** - Complete API documentation
   - Components (NgxTableLayoutPickerComponent, NgxTableLayoutPickerDropdownComponent)
   - Services (TableLayoutService, ResponsiveService, ThemeService)
   - Models (TableSelection, TableCell, GridDimensions, TableLayoutConfig, ThemeMode)
   - Constants and utilities

2. **[Usage Guide](./usage-guide.md)** - Comprehensive implementation guide
   - Installation and setup
   - Basic and advanced usage patterns
   - Event handling
   - Integration patterns (Rich Text Editor, Form Builder, etc.)
   - Best practices and common scenarios

3. **[Theming Guide](./theming.md)** - Customization and styling
   - Built-in themes (light, dark, auto)
   - CSS custom properties
   - Custom theme creation
   - Angular Material integration
   - Responsive theming
   - Advanced customization examples

### Live Resources

- **[Live Demo](https://ngmikeng.github.io/ngx-table-layout-picker/)** - Interactive demo application
- **[Demo Source Code](../projects/demo/src)** - Demo implementation reference

## 🎯 Quick Navigation

### I want to...

**...get started quickly**
→ Read the [Library README](../projects/ngx-table-layout-picker/README.md) for installation and basic usage

**...understand the full API**
→ Check the [API Reference](./api-reference.md) for complete component and service documentation

**...see real-world examples**
→ Browse the [Usage Guide](./usage-guide.md) for integration patterns and examples

**...customize the appearance**
→ Follow the [Theming Guide](./theming.md) for styling and customization

**...integrate with my editor**
→ See the [Rich Text Editor Integration](./usage-guide.md#rich-text-editor-integration) example

**...use with Angular Material**
→ Check [Angular Material Integration](./theming.md#angular-material-integration)

**...make it responsive**
→ Read about [Responsive Design](./usage-guide.md#responsive-design)

**...handle events**
→ See [Event Handling](./usage-guide.md#event-handling) section

## 🔑 Key Features

### Components

- **Inline Picker** - Direct component usage for always-visible table selector
- **Dropdown Picker** - Material Design dropdown integration for toolbars
- **Responsive** - Automatic adaptation to mobile, tablet, and desktop
- **Themeable** - Light, dark, and auto themes with full customization

### Capabilities

- ✅ Interactive grid-based selection
- ✅ Dynamic grid expansion and shrinking
- ✅ Full keyboard navigation
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Touch-optimized for mobile devices
- ✅ Signal-based reactive state management
- ✅ OnPush change detection strategy
- ✅ Tree-shakeable exports

## 📖 Documentation Structure

```
docs/
├── README.md              # This file - Documentation index
├── api-reference.md       # Complete API documentation
├── usage-guide.md         # Implementation guide and examples
└── theming.md            # Styling and customization guide
```

## 🚀 Quick Example

### Basic Usage

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
    console.log(`Creating ${selection.rows} × ${selection.cols} table`);
    // Insert table into your editor
  }
}
```

## 🎨 Customization Preview

### CSS Custom Properties

```scss
ngx-table-layout-picker {
  --tls-cell-size: 28px;
  --tls-gap: 3px;
  --tls-cell-active: #ff5252;
  --tls-border-hover: #ff6b6b;
  --tls-background: #fafafa;
}
```

### SCSS Theme

```scss
@use 'ngx-table-layout-picker/themes/theme-base' as picker;

$my-theme: (
  background: #ffffff,
  text: #212121,
  border: #e0e0e0,
  borderHover: #1976d2,
  cellActive: #1565c0,
  focus: #1976d2
);

@include picker.ngx-table-layout-picker-theme($my-theme);
```

## 🔧 Technical Details

### Requirements

- **Angular:** 20+ (tested with 21.x)
- **TypeScript:** 5.2+
- **Angular Material:** 20+ (optional, for dropdown component)

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Architecture

- **Standalone Components** - Modern Angular architecture
- **Signal-Based State** - Reactive state management
- **OnPush Change Detection** - Optimized performance
- **Injectable Services** - Modular business logic
- **Strong Typing** - Full TypeScript support

## 📚 Additional Resources

### Project Documentation

- [Architecture Documentation](../plan/02-architecture.md)
- [Feature Requirements](../plan/03-feature-requirements.md)
- [Component Design](../plan/04-component-design.md)
- [CI/CD Setup](.github/README.md)

### External Links

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)

## 🤝 Contributing

Contributions are welcome! Please:

1. Check the [GitHub Issues](https://github.com/ngmikeng/ngx-table-layout-picker/issues)
2. Follow [Conventional Commits](https://www.conventionalcommits.org/)
3. Write or update tests
4. Update documentation as needed

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 💬 Support

- 🐛 [Report Issues](https://github.com/ngmikeng/ngx-table-layout-picker/issues)
- 💬 [Discussions](https://github.com/ngmikeng/ngx-table-layout-picker/discussions)
- 📖 [Full Documentation](https://github.com/ngmikeng/ngx-table-layout-picker)

---

**Made with ❤️ using Angular**

Last Updated: February 2026
