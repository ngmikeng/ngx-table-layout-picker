# Theming Guide

Complete guide for customizing the appearance of NGX Table Layout Picker.

## Table of Contents

- [Overview](#overview)
- [Built-in Themes](#built-in-themes)
- [CSS Custom Properties](#css-custom-properties)
- [Custom Themes](#custom-themes)
- [Angular Material Integration](#angular-material-integration)
- [Responsive Theming](#responsive-theming)
- [Advanced Customization](#advanced-customization)
- [Theme Examples](#theme-examples)

---

## Overview

NGX Table Layout Picker provides flexible theming options through:

- **Built-in themes** - Light, dark, and auto-detection
- **CSS custom properties** - Easy customization without SCSS
- **SCSS mixins** - Advanced theme creation
- **Material Design integration** - Seamless integration with Angular Material

The library uses a CSS custom properties approach for runtime theming and SCSS for build-time customization.

---

## Built-in Themes

### Light Theme

The default light theme optimized for light backgrounds:

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerComponent } from 'ngx-table-layout-picker';

@Component({
  template: `
    <ngx-table-layout-picker
      [theme]="'light'"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class LightThemeComponent {
  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

**Light Theme Colors:**
- Background: `#ffffff`
- Text: `#212121`
- Border: `#e0e0e0`
- Border Hover: `#1976d2` (Material Blue)
- Cell Active: `#1565c0` (Material Blue 800)
- Focus: `#1976d2`

### Dark Theme

Dark theme optimized for dark mode interfaces:

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      [theme]="'dark'"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class DarkThemeComponent {
  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

**Dark Theme Colors:**
- Background: `#1e1e1e`
- Text: `#f5f5f5`
- Border: `#424242`
- Border Hover: `#42a5f5` (Material Light Blue)
- Cell Active: `#64b5f6` (Material Light Blue 300)
- Focus: `#42a5f5`

### Auto Theme

Automatically detects and applies system theme preference:

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      [theme]="'auto'"
      (themeChange)="onThemeChange($event)">
    </ngx-table-layout-picker>
  `
})
export class AutoThemeComponent {
  onThemeChange(theme: string): void {
    console.log('System theme detected:', theme);
  }
}
```

The `auto` theme:
- Detects `prefers-color-scheme` media query
- Automatically switches between light and dark
- Updates when system preference changes
- Emits `themeChange` event when theme changes

---

## CSS Custom Properties

### Available Properties

Customize appearance using CSS custom properties (CSS variables):

```scss
ngx-table-layout-picker {
  /* Grid Layout */
  --tls-cell-size: 24px;           // Size of each cell
  --tls-gap: 2px;                  // Gap between cells
  --tls-padding: 8px;              // Container padding
  --tls-border-width: 1px;         // Border width
  --tls-border-radius: 4px;        // Border radius
  
  /* Colors */
  --tls-background: #ffffff;       // Background color
  --tls-text: #212121;            // Text color
  --tls-border: #e0e0e0;          // Cell border color
  --tls-border-hover: #1976d2;    // Border color on hover
  --tls-cell-active: #1565c0;     // Active cell background
  --tls-focus-color: #1976d2;     // Focus indicator color
  
  /* Typography */
  --tls-font-family: inherit;      // Font family
  --tls-font-size: 14px;          // Font size
  --tls-font-weight: 400;         // Font weight
  
  /* Transitions */
  --tls-transition-duration: 0.2s; // Animation duration
  --tls-transition-timing: ease;   // Animation timing function
}
```

### Basic Customization

Override default colors inline:

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      style="
        --tls-cell-active: #ff5252;
        --tls-border-hover: #ff6b6b;
        --tls-cell-size: 28px;
      "
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class CustomColorComponent {
  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

### Component-Scoped Styling

Apply custom styles to specific components:

```scss
// In your component's SCSS file
.custom-picker {
  --tls-cell-size: 32px;
  --tls-gap: 4px;
  --tls-border-radius: 8px;
  --tls-cell-active: #9c27b0;
  --tls-border-hover: #ba68c8;
}
```

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      class="custom-picker"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `,
  styleUrls: ['./component.scss']
})
```

### Global Theme Customization

Apply styles globally in `styles.scss`:

```scss
// styles.scss
ngx-table-layout-picker {
  --tls-background: #f5f5f5;
  --tls-border: #bdbdbd;
  --tls-cell-active: #673ab7;
  --tls-border-hover: #7e57c2;
}
```

---

## Custom Themes

### Using SCSS Mixins

Create custom themes using the provided SCSS mixins:

```scss
// Import the theme base
@use 'ngx-table-layout-picker/themes/theme-base' as picker;

// Define your custom theme
$my-theme: (
  background: #fafafa,
  text: #333333,
  border: #cccccc,
  borderHover: #ff6b6b,
  cellActive: #ff5252,
  focus: #ff6b6b
);

// Apply the theme
.my-custom-theme {
  @include picker.ngx-table-layout-picker-theme($my-theme);
}
```

Apply the theme:

```typescript
@Component({
  template: `
    <div class="my-custom-theme">
      <ngx-table-layout-picker
        (selectionChange)="onSelect($event)">
      </ngx-table-layout-picker>
    </div>
  `
})
```

### Multiple Themes

Support multiple themes in your application:

```scss
// Define multiple themes
$theme-red: (
  background: #ffffff,
  text: #212121,
  border: #e0e0e0,
  borderHover: #f44336,
  cellActive: #d32f2f,
  focus: #f44336
);

$theme-green: (
  background: #ffffff,
  text: #212121,
  border: #e0e0e0,
  borderHover: #4caf50,
  cellActive: #388e3c,
  focus: #4caf50
);

$theme-purple: (
  background: #ffffff,
  text: #212121,
  border: #e0e0e0,
  borderHover: #9c27b0,
  cellActive: #7b1fa2,
  focus: #9c27b0
);

// Apply themes
.red-theme {
  @include picker.ngx-table-layout-picker-theme($theme-red);
}

.green-theme {
  @include picker.ngx-table-layout-picker-theme($theme-green);
}

.purple-theme {
  @include picker.ngx-table-layout-picker-theme($theme-purple);
}
```

Dynamic theme switching:

```typescript
@Component({
  template: `
    <div class="theme-selector">
      <button (click)="setTheme('red')">Red</button>
      <button (click)="setTheme('green')">Green</button>
      <button (click)="setTheme('purple')">Purple</button>
    </div>
    
    <div [class]="currentThemeClass()">
      <ngx-table-layout-picker
        (selectionChange)="onSelect($event)">
      </ngx-table-layout-picker>
    </div>
  `
})
export class MultiThemeComponent {
  currentThemeClass = signal('red-theme');

  setTheme(color: string): void {
    this.currentThemeClass.set(`${color}-theme`);
  }

  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

---

## Angular Material Integration

### Material Theme Integration

Integrate with your Material theme:

```scss
@use '@angular/material' as mat;
@use 'ngx-table-layout-picker/themes/theme-base' as picker;

// Your Material theme
$my-primary: mat.define-palette(mat.$indigo-palette);
$my-accent: mat.define-palette(mat.$pink-palette);
$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
  )
));

// Apply Material theme
@include mat.all-component-themes($my-theme);

// Create matching picker theme
$picker-theme: (
  background: #ffffff,
  text: mat.get-color-from-palette($my-primary, default-contrast),
  border: #e0e0e0,
  borderHover: mat.get-color-from-palette($my-primary, 500),
  cellActive: mat.get-color-from-palette($my-primary, 700),
  focus: mat.get-color-from-palette($my-accent, 500)
);

@include picker.ngx-table-layout-picker-theme($picker-theme);
```

### Using Material Helper Mixin

Use the built-in Material integration mixin:

```scss
@use '@angular/material' as mat;
@use 'ngx-table-layout-picker/themes/theme-base' as picker;

// Your Material palettes
$my-primary: mat.define-palette(mat.$blue-palette);
$my-accent: mat.define-palette(mat.$orange-palette);

// Apply Material-integrated theme
.light-theme {
  @include picker.ngx-table-layout-picker-material-theme(
    $my-primary,
    $my-accent,
    $is-dark: false
  );
}

.dark-theme {
  @include picker.ngx-table-layout-picker-material-theme(
    $my-primary,
    $my-accent,
    $is-dark: true
  );
}
```

---

## Responsive Theming

### Breakpoint-Specific Styles

Apply different styles at different breakpoints:

```scss
@use 'ngx-table-layout-picker/themes/responsive-mixins' as responsive;

ngx-table-layout-picker {
  // Mobile styles
  @include responsive.mobile {
    --tls-cell-size: 32px;
    --tls-gap: 4px;
    --tls-padding: 12px;
  }
  
  // Tablet styles
  @include responsive.tablet {
    --tls-cell-size: 28px;
    --tls-gap: 3px;
    --tls-padding: 10px;
  }
  
  // Desktop styles
  @include responsive.desktop {
    --tls-cell-size: 24px;
    --tls-gap: 2px;
    --tls-padding: 8px;
  }
}
```

### Touch Device Optimization

Optimize for touch devices:

```scss
@use 'ngx-table-layout-picker/themes/responsive-mixins' as responsive;

ngx-table-layout-picker {
  // Touch device specific
  @include responsive.touch-device {
    --tls-cell-size: 36px;
    --tls-gap: 4px;
    
    // Larger touch targets
    .tls-cell {
      min-width: 44px;
      min-height: 44px;
    }
  }
}
```

### Orientation-Based Styles

Adjust for device orientation:

```scss
@use 'ngx-table-layout-picker/themes/responsive-mixins' as responsive;

ngx-table-layout-picker {
  @include responsive.landscape {
    --tls-cell-size: 24px;
  }
  
  @include responsive.portrait {
    --tls-cell-size: 28px;
  }
}
```

---

## Advanced Customization

### Custom Cell Styling

Customize individual cell appearance:

```scss
ngx-table-layout-picker {
  ::ng-deep {
    .tls-cell {
      // Custom cell shape
      border-radius: 50%; // Circular cells
      
      // Custom transitions
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      // Custom hover effect
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      
      // Custom active state
      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    }
  }
}
```

### Custom Footer Styling

Customize the footer appearance:

```scss
ngx-table-layout-picker {
  ::ng-deep {
    .tls-footer {
      background: #f5f5f5;
      border-top: 2px solid #e0e0e0;
      padding: 12px;
      font-weight: 600;
      text-align: center;
      
      .tls-selection-text {
        color: #1976d2;
        font-size: 16px;
      }
    }
  }
}
```

### Animation Customization

Customize animations and transitions:

```scss
ngx-table-layout-picker {
  // Faster animations
  --tls-transition-duration: 0.1s;
  
  // Different timing function
  --tls-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  
  // Or disable animations completely
  @media (prefers-reduced-motion: reduce) {
    --tls-transition-duration: 0s;
  }
}
```

### High Contrast Mode

Support high contrast mode:

```scss
@use 'ngx-table-layout-picker/themes/responsive-mixins' as responsive;

ngx-table-layout-picker {
  @include responsive.high-contrast {
    --tls-border-width: 2px;
    --tls-border: #000000;
    --tls-background: #ffffff;
    --tls-text: #000000;
    --tls-cell-active: #0000ff;
    --tls-border-hover: #0000ff;
  }
}
```

---

## Theme Examples

### Example 1: Minimalist Theme

Clean, minimalist design:

```scss
.minimalist-theme {
  --tls-cell-size: 20px;
  --tls-gap: 1px;
  --tls-padding: 4px;
  --tls-border-width: 0.5px;
  --tls-border-radius: 0;
  --tls-background: #ffffff;
  --tls-text: #333333;
  --tls-border: #dddddd;
  --tls-border-hover: #333333;
  --tls-cell-active: #333333;
  --tls-transition-duration: 0.15s;
}
```

### Example 2: Vibrant Theme

Bold, colorful design:

```scss
.vibrant-theme {
  --tls-cell-size: 30px;
  --tls-gap: 4px;
  --tls-padding: 16px;
  --tls-border-width: 2px;
  --tls-border-radius: 8px;
  --tls-background: #ffd54f;
  --tls-text: #263238;
  --tls-border: #ffa726;
  --tls-border-hover: #ff6f00;
  --tls-cell-active: #ff6f00;
  --tls-focus-color: #ff6f00;
}
```

### Example 3: Glass Morphism Theme

Modern glass effect:

```scss
.glass-theme {
  --tls-cell-size: 28px;
  --tls-gap: 3px;
  --tls-padding: 12px;
  --tls-border-radius: 12px;
  
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  
  --tls-background: transparent;
  --tls-text: #ffffff;
  --tls-border: rgba(255, 255, 255, 0.2);
  --tls-border-hover: rgba(255, 255, 255, 0.6);
  --tls-cell-active: rgba(255, 255, 255, 0.3);
}
```

### Example 4: Corporate Theme

Professional corporate design:

```scss
.corporate-theme {
  --tls-cell-size: 24px;
  --tls-gap: 2px;
  --tls-padding: 8px;
  --tls-border-radius: 2px;
  --tls-background: #263238;
  --tls-text: #eceff1;
  --tls-border: #37474f;
  --tls-border-hover: #00acc1;
  --tls-cell-active: #00897b;
  --tls-focus-color: #00acc1;
  --tls-font-family: 'Roboto', sans-serif;
}
```

### Example 5: Pastel Theme

Soft pastel colors:

```scss
$pastel-theme: (
  background: #fce4ec,
  text: #880e4f,
  border: #f8bbd0,
  borderHover: #ec407a,
  cellActive: #f06292,
  focus: #ec407a
);

.pastel-theme {
  @include picker.ngx-table-layout-picker-theme($pastel-theme);
  
  --tls-cell-size: 26px;
  --tls-gap: 3px;
  --tls-border-radius: 6px;
}
```

---

## Theme Utilities

### Theme Switching Service

Create a service for theme management:

```typescript
import { Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'vibrant' | 'minimalist';

@Injectable({ providedIn: 'root' })
export class ThemeManagerService {
  private readonly _currentTheme = signal<AppTheme>('light');
  public readonly currentTheme = this._currentTheme.asReadonly();

  setTheme(theme: AppTheme): void {
    this._currentTheme.set(theme);
    // Apply theme class to document
    document.body.className = `${theme}-theme`;
    // Store preference
    localStorage.setItem('app-theme', theme);
  }

  loadTheme(): void {
    const saved = localStorage.getItem('app-theme') as AppTheme;
    if (saved) {
      this.setTheme(saved);
    }
  }
}
```

### Theme Selector Component

Create a theme selector component:

```typescript
@Component({
  selector: 'app-theme-selector',
  standalone: true,
  template: `
    <div class="theme-selector">
      <button 
        *ngFor="let theme of themes"
        [class.active]="themeManger.currentTheme() === theme"
        (click)="selectTheme(theme)">
        {{ theme }}
      </button>
    </div>
  `,
  styles: [`
    .theme-selector {
      display: flex;
      gap: 0.5rem;
    }
    
    button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      
      &.active {
        background: #1976d2;
        color: white;
      }
    }
  `]
})
export class ThemeSelectorComponent {
  themeManager = inject(ThemeManagerService);
  
  themes: AppTheme[] = ['light', 'dark', 'vibrant', 'minimalist'];

  selectTheme(theme: AppTheme): void {
    this.themeManager.setTheme(theme);
  }
}
```

---

## Best Practices

### 1. Use CSS Custom Properties for Runtime Theming

Prefer CSS custom properties over SCSS variables for dynamic theming:

```scss
// Good: Can be changed at runtime
ngx-table-layout-picker {
  --tls-cell-active: var(--app-primary-color);
}

// Less flexible: Fixed at build time
ngx-table-layout-picker {
  .tls-cell.active {
    background: $primary-color;
  }
}
```

### 2. Maintain Sufficient Contrast

Ensure color combinations meet WCAG accessibility standards:

```scss
// Check contrast ratio is at least 4.5:1 for normal text
// Use tools like https://contrast-ratio.com
ngx-table-layout-picker {
  --tls-background: #ffffff;
  --tls-text: #212121; // Contrast ratio: 15.8:1 ✓
}
```

### 3. Test in All Theme Modes

Always test your customizations in light, dark, and auto modes:

```typescript
// Test component
themes: ThemeMode[] = ['light', 'dark', 'auto'];
```

### 4. Use Semantic Color Names

Define semantic variables for better maintainability:

```scss
:root {
  --app-primary: #1976d2;
  --app-accent: #ff5252;
  --app-background: #ffffff;
  --app-text: #212121;
}

ngx-table-layout-picker {
  --tls-background: var(--app-background);
  --tls-text: var(--app-text);
  --tls-cell-active: var(--app-primary);
  --tls-border-hover: var(--app-accent);
}
```

### 5. Consider Reduced Motion

Respect user's motion preferences:

```scss
@media (prefers-reduced-motion: reduce) {
  ngx-table-layout-picker {
    --tls-transition-duration: 0s;
  }
}
```

---

## Troubleshooting

### Theme Not Applying

If your theme isn't applying:

1. **Check CSS specificity**: Ensure your styles have sufficient specificity
2. **Verify import order**: Import theme files in correct order
3. **Check ViewEncapsulation**: Use `::ng-deep` for deeply nested elements
4. **Verify theme input**: Ensure `[theme]` input is set correctly

### Colors Look Wrong

If colors don't look right:

1. **Check color format**: Use hex, rgb, or named colors
2. **Verify CSS variable names**: Ensure variable names match exactly
3. **Check theme definition**: Verify theme object has all required properties
4. **Test in different browsers**: Some features may need fallbacks

---

## Additional Resources

- [API Reference](./api-reference.md) - Complete API documentation
- [Usage Guide](./usage-guide.md) - Implementation examples
- [Material Design Colors](https://material.io/design/color) - Color system guide
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) - Accessibility standards

---

For questions or issues, visit the [GitHub repository](https://github.com/your-username/ngx-table-layout-picker).
