# Theming Implementation Strategy

## Theming Architecture

### Overview
The library will support three theme modes:
- **Light Theme**: Default light color scheme
- **Dark Theme**: Dark color scheme for dark mode UIs
- **Auto Theme**: Automatically detects system preference

### Implementation Approach
1. CSS Custom Properties for dynamic theming
2. SCSS mixins for theme generation
3. Integration with Angular Material theming (optional)
4. System preference detection via `prefers-color-scheme`

---

## Theme Color Palettes

### Light Theme Palette
```scss
$light-theme: (
  // Background colors
  background-primary: #ffffff,
  background-secondary: #f5f5f5,
  background-hover: #fafafa,
  
  // Text colors
  text-primary: #212121,
  text-secondary: #757575,
  text-disabled: #bdbdbd,
  
  // Border colors
  border-default: #e0e0e0,
  border-hover: #bdbdbd,
  border-focus: #1976d2,
  
  // Cell colors
  cell-border: #e0e0e0,
  cell-hover: #1976d2,
  cell-active: #1565c0,
  cell-background: transparent,
  cell-background-hover: rgba(25, 118, 210, 0.08),
  
  // Footer colors
  footer-background: #f5f5f5,
  footer-text: #424242,
  footer-border: #e0e0e0,
  
  // Shadow
  shadow: rgba(0, 0, 0, 0.1)
);
```

### Dark Theme Palette
```scss
$dark-theme: (
  // Background colors
  background-primary: #1e1e1e,
  background-secondary: #2d2d2d,
  background-hover: #383838,
  
  // Text colors
  text-primary: #f5f5f5,
  text-secondary: #b0b0b0,
  text-disabled: #666666,
  
  // Border colors
  border-default: #424242,
  border-hover: #5a5a5a,
  border-focus: #42a5f5,
  
  // Cell colors
  cell-border: #424242,
  cell-hover: #42a5f5,
  cell-active: #64b5f6,
  cell-background: transparent,
  cell-background-hover: rgba(66, 165, 245, 0.12),
  
  // Footer colors
  footer-background: #2d2d2d,
  footer-text: #e0e0e0,
  footer-border: #424242,
  
  // Shadow
  shadow: rgba(0, 0, 0, 0.3)
);
```

---

## CSS Custom Properties

### Theme Variables Definition
```scss
// _theme-variables.scss
:root {
  // Light theme as default
  @include apply-theme($light-theme);
}

// Dark theme via class or attribute
[data-theme="dark"],
.dark-theme {
  @include apply-theme($dark-theme);
}

// Auto theme detection
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    @include apply-theme($dark-theme);
  }
}

// Mixin to apply theme
@mixin apply-theme($theme) {
  --tls-bg-primary: #{map-get($theme, 'background-primary')};
  --tls-bg-secondary: #{map-get($theme, 'background-secondary')};
  --tls-bg-hover: #{map-get($theme, 'background-hover')};
  
  --tls-text-primary: #{map-get($theme, 'text-primary')};
  --tls-text-secondary: #{map-get($theme, 'text-secondary')};
  --tls-text-disabled: #{map-get($theme, 'text-disabled')};
  
  --tls-border-default: #{map-get($theme, 'border-default')};
  --tls-border-hover: #{map-get($theme, 'border-hover')};
  --tls-border-focus: #{map-get($theme, 'border-focus')};
  
  --tls-cell-border: #{map-get($theme, 'cell-border')};
  --tls-cell-hover: #{map-get($theme, 'cell-hover')};
  --tls-cell-active: #{map-get($theme, 'cell-active')};
  --tls-cell-bg: #{map-get($theme, 'cell-background')};
  --tls-cell-bg-hover: #{map-get($theme, 'cell-background-hover')};
  
  --tls-footer-bg: #{map-get($theme, 'footer-background')};
  --tls-footer-text: #{map-get($theme, 'footer-text')};
  --tls-footer-border: #{map-get($theme, 'footer-border')};
  
  --tls-shadow: #{map-get($theme, 'shadow')};
}
```

---

## Component Theme Integration

### NgxTableLayoutPickerComponent Theming

```scss
// ngx-table-layout-picker.component.scss
:host {
  display: block;
  background: var(--tls-bg-primary);
  color: var(--tls-text-primary);
  
  // Theme-aware styling
  .tls-container {
    background: var(--tls-bg-primary);
    border: 1px solid var(--tls-border-default);
    box-shadow: 0 2px 4px var(--tls-shadow);
  }
  
  .tls-grid {
    background: var(--tls-bg-secondary);
  }
}

// Theme attribute binding
:host([data-theme="dark"]) {
  @include apply-theme($dark-theme);
}

:host([data-theme="light"]) {
  @include apply-theme($light-theme);
}

:host([data-theme="auto"]) {
  // Auto detection handled by media query
}
```

### TableCellComponent Theming

```scss
// table-cell.component.scss
:host {
  display: block;
  
  .tls-cell {
    background: var(--tls-cell-bg);
    border: 2px solid var(--tls-cell-border);
    transition: all 150ms ease-in-out;
  }
  
  // Hover state
  &.hovered .tls-cell,
  &:hover .tls-cell {
    border-color: var(--tls-cell-hover);
    background: var(--tls-cell-bg-hover);
  }
  
  // Active state
  &.active .tls-cell {
    border-color: var(--tls-cell-active);
    background: var(--tls-cell-bg-hover);
  }
  
  // Focus state (keyboard navigation)
  &:focus .tls-cell {
    border-color: var(--tls-border-focus);
    outline: 2px solid var(--tls-border-focus);
    outline-offset: 2px;
  }
}
```

### TableFooterComponent Theming

```scss
// table-footer.component.scss
.tls-footer {
  background: var(--tls-footer-bg);
  color: var(--tls-footer-text);
  border: 1px solid var(--tls-footer-border);
  
  span {
    color: var(--tls-footer-text);
    font-weight: 500;
  }
}
```

---

## TypeScript Theme Service

### ThemeService Implementation

```typescript
// theme.service.ts
import { Injectable, signal, effect } from '@angular/core';
import { ThemeMode } from '../models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Current theme mode
  private readonly _themeMode = signal<ThemeMode>('auto');
  public readonly themeMode = this._themeMode.asReadonly();
  
  // Resolved theme (light or dark, never auto)
  private readonly _resolvedTheme = signal<'light' | 'dark'>('light');
  public readonly resolvedTheme = this._resolvedTheme.asReadonly();
  
  // System preference
  private readonly _systemPreference = signal<'light' | 'dark'>('light');
  public readonly systemPreference = this._systemPreference.asReadonly();
  
  private mediaQuery: MediaQueryList;
  
  constructor() {
    // Initialize media query listener
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.updateSystemPreference();
    
    // Listen for system preference changes
    this.mediaQuery.addEventListener('change', () => {
      this.updateSystemPreference();
    });
    
    // Effect to update resolved theme
    effect(() => {
      const mode = this._themeMode();
      const system = this._systemPreference();
      
      if (mode === 'auto') {
        this._resolvedTheme.set(system);
      } else {
        this._resolvedTheme.set(mode);
      }
    });
  }
  
  /**
   * Set theme mode
   */
  setTheme(mode: ThemeMode): void {
    this._themeMode.set(mode);
    this.applyThemeToDocument();
  }
  
  /**
   * Toggle between light and dark
   */
  toggleTheme(): void {
    const current = this._resolvedTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }
  
  /**
   * Update system preference from media query
   */
  private updateSystemPreference(): void {
    const isDark = this.mediaQuery.matches;
    this._systemPreference.set(isDark ? 'dark' : 'light');
    
    if (this._themeMode() === 'auto') {
      this.applyThemeToDocument();
    }
  }
  
  /**
   * Apply theme to document root
   */
  private applyThemeToDocument(): void {
    const theme = this._resolvedTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  /**
   * Get theme colors for current theme
   */
  getThemeColors(): Record<string, string> {
    const style = getComputedStyle(document.documentElement);
    
    return {
      bgPrimary: style.getPropertyValue('--tls-bg-primary').trim(),
      bgSecondary: style.getPropertyValue('--tls-bg-secondary').trim(),
      textPrimary: style.getPropertyValue('--tls-text-primary').trim(),
      cellBorder: style.getPropertyValue('--tls-cell-border').trim(),
      cellHover: style.getPropertyValue('--tls-cell-hover').trim(),
      cellActive: style.getPropertyValue('--tls-cell-active').trim(),
    };
  }
}
```

---

## Component Theme Binding

### Theme Detection in Component

```typescript
// ngx-table-layout-picker.component.ts
import { Component, Input, HostBinding, effect } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { ThemeMode } from '../../models/theme.model';

@Component({
  selector: 'ngx-table-layout-picker',
  // ...
})
export class NgxTableLayoutPickerComponent {
  private _explicitTheme: ThemeMode | null = null;
  
  @Input() 
  set theme(value: ThemeMode) {
    this._explicitTheme = value;
    this.updateTheme();
  }
  get theme(): ThemeMode {
    return this._explicitTheme || 'auto';
  }
  
  @HostBinding('attr.data-theme')
  currentTheme: 'light' | 'dark' = 'light';
  
  constructor(private themeService: ThemeService) {
    // React to theme changes
    effect(() => {
      this.updateTheme();
    });
  }
  
  private updateTheme(): void {
    if (this._explicitTheme && this._explicitTheme !== 'auto') {
      this.currentTheme = this._explicitTheme;
    } else {
      this.currentTheme = this.themeService.resolvedTheme();
    }
  }
}
```

---

## Material Theme Integration

### Material Palette Integration (Optional)

```scss
// _material-theme-integration.scss
@use '@angular/material' as mat;

// Function to extract Material theme colors
@function get-material-theme-colors($theme) {
  $primary: mat.get-color-from-palette(mat.define-palette(mat.$indigo-palette));
  $accent: mat.get-color-from-palette(mat.define-palette(mat.$pink-palette));
  $warn: mat.get-color-from-palette(mat.define-palette(mat.$red-palette));
  
  @return (
    primary: $primary,
    accent: $accent,
    warn: $warn
  );
}

// Mixin to use Material theme colors
@mixin material-theme-integration($theme) {
  $colors: get-material-theme-colors($theme);
  
  --tls-cell-hover: #{map-get($colors, 'primary')};
  --tls-cell-active: #{map-get($colors, 'primary')};
  --tls-border-focus: #{map-get($colors, 'primary')};
}
```

---

## Dropdown Theme Integration

### Material Menu Theming

```scss
// ngx-table-layout-picker-dropdown.component.scss
.tls-dropdown-menu {
  // Apply theme to Material menu
  &.mat-mdc-menu-panel {
    background: var(--tls-bg-primary);
    border: 1px solid var(--tls-border-default);
    box-shadow: 0 4px 8px var(--tls-shadow);
  }
  
  // Theme button
  .mat-mdc-button {
    color: var(--tls-text-primary);
    
    &:hover {
      background: var(--tls-bg-hover);
    }
  }
}

// Dark theme specific styles
[data-theme="dark"] {
  .tls-dropdown-menu {
    .mat-mdc-menu-content {
      background: var(--tls-bg-primary);
    }
  }
}
```

---

## Theme Transitions

### Smooth Theme Switching

```scss
// _transitions.scss
:root {
  // Transition properties for theme changes
  --tls-transition-duration: 200ms;
  --tls-transition-timing: ease-in-out;
}

// Apply transitions to theme-aware properties
* {
  transition: 
    background-color var(--tls-transition-duration) var(--tls-transition-timing),
    color var(--tls-transition-duration) var(--tls-transition-timing),
    border-color var(--tls-transition-duration) var(--tls-transition-timing);
}

// Disable transitions for explicit preference or reduced motion
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

---

## User Customization

### Custom Theme Properties

Users can override theme colors by providing CSS custom properties:

```scss
// Example: Custom theme in consumer application
:root {
  // Override specific colors
  --tls-cell-hover: #ff6b6b;
  --tls-cell-active: #ee5a52;
  --tls-cell-border: #ffd93d;
}

// Or create custom theme attribute
[data-theme="custom"] {
  --tls-bg-primary: #2c3e50;
  --tls-bg-secondary: #34495e;
  --tls-text-primary: #ecf0f1;
  --tls-cell-hover: #e74c3c;
  --tls-cell-active: #c0392b;
}
```

### Theme Configuration Interface

```typescript
// theme-config.model.ts
export interface CustomThemeConfig {
  name: string;
  colors: {
    background?: string;
    text?: string;
    border?: string;
    cellHover?: string;
    cellActive?: string;
    // ... other colors
  };
}

// Usage in component
@Component({
  template: `
    <ngx-table-layout-picker
      [theme]="'dark'"
      [customTheme]="myCustomTheme">
    </ngx-table-layout-picker>
  `
})
export class MyComponent {
  myCustomTheme: CustomThemeConfig = {
    name: 'ocean',
    colors: {
      cellHover: '#00bcd4',
      cellActive: '#0097a7'
    }
  };
}
```

---

## Testing Themes

### Theme Testing Strategy

```typescript
// theme.service.spec.ts
describe('ThemeService', () => {
  let service: ThemeService;
  
  it('should default to auto theme', () => {
    expect(service.themeMode()).toBe('auto');
  });
  
  it('should set theme explicitly', () => {
    service.setTheme('dark');
    expect(service.themeMode()).toBe('dark');
    expect(service.resolvedTheme()).toBe('dark');
  });
  
  it('should detect system preference', () => {
    // Mock media query
    const mockMediaQuery = {
      matches: true,
      addEventListener: jasmine.createSpy()
    };
    
    spyOn(window, 'matchMedia').and.returnValue(mockMediaQuery as any);
    
    service = new ThemeService();
    expect(service.systemPreference()).toBe('dark');
  });
  
  it('should toggle theme', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(service.themeMode()).toBe('dark');
  });
});
```

---

## Documentation

### Theme Usage Documentation

```markdown
## Theming

### Basic Usage

```typescript
// Light theme
<ngx-table-layout-picker theme="light">
</ngx-table-layout-picker>

// Dark theme
<ngx-table-layout-picker theme="dark">
</ngx-table-layout-picker>

// Auto (follows system preference)
<ngx-table-layout-picker theme="auto">
</ngx-table-layout-picker>
```

### Custom Colors

Override CSS custom properties to customize colors:

```css
:root {
  --tls-cell-hover: #your-color;
  --tls-cell-active: #your-color;
}
```

### Material Integration

The component automatically inherits Material theme colors when available.
```
