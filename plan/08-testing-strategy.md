# Testing Strategy

## Testing Philosophy

### Goals
- **80%+ code coverage** for library code
- **Unit tests** for all components, services, and utilities
- **Integration tests** for user workflows
- **Accessibility tests** for WCAG compliance
- **Cross-browser testing** via CI/CD

### Testing Pyramid
1. **Unit Tests (80%)**: Components, services, directives, utilities
2. **Integration Tests (15%)**: Component interactions, workflows
3. **E2E Tests (5%)**: Critical user journeys (future phase)

---

## Testing Framework

### Tools & Libraries

```json
{
  "devDependencies": {
    "@angular/core": "^20.0.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "@testing-library/angular": "^14.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

### Karma Configuration

```javascript
// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: false,
        seed: 42,
        stopSpecOnExpectationFailure: false
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/ngx-table-layout-picker'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage'
        ]
      }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};
```

---

## Component Testing

### NgxTableLayoutPickerComponent Tests

```typescript
// ngx-table-layout-picker.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxTableLayoutPickerComponent } from './ngx-table-layout-picker.component';
import { TableLayoutService } from '../../services/table-layout.service';
import { ThemeService } from '../../services/theme.service';
import { signal } from '@angular/core';

describe('NgxTableLayoutPickerComponent', () => {
  let component: NgxTableLayoutPickerComponent;
  let fixture: ComponentFixture<NgxTableLayoutPickerComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTableLayoutPickerComponent],
      providers: [TableLayoutService, ThemeService]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTableLayoutPickerComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render with default configuration', () => {
      expect(component.rows).toBe(10);
      expect(component.cols).toBe(10);
      expect(component.showFooter).toBe(true);
      expect(component.theme).toBe('auto');
    });

    it('should apply custom configuration', () => {
      component.rows = 8;
      component.cols = 12;
      component.showFooter = false;
      component.theme = 'dark';
      fixture.detectChanges();

      expect(component.rows).toBe(8);
      expect(component.cols).toBe(12);
      expect(component.showFooter).toBe(false);
      expect(component.theme).toBe('dark');
    });

    it('should render correct number of cells', () => {
      const cells = compiled.querySelectorAll('ngx-table-cell');
      expect(cells.length).toBe(100); // 10x10
    });
  });

  describe('Hover Interactions', () => {
    it('should highlight cells on hover', () => {
      component.onCellHover(3, 4);
      fixture.detectChanges();

      expect(component.hoveredCell()).toEqual({ row: 3, col: 4 });
    });

    it('should calculate active cells correctly', () => {
      component.onCellHover(2, 3);
      fixture.detectChanges();

      const activeCells = component.activeCells();
      expect(activeCells.length).toBe(6); // 2x3
    });

    it('should clear hover state on mouse leave', () => {
      component.onCellHover(3, 4);
      fixture.detectChanges();

      component.onContainerLeave();
      fixture.detectChanges();

      expect(component.hoveredCell()).toBeNull();
    });

    it('should update footer text on hover', () => {
      component.onCellHover(5, 7);
      fixture.detectChanges();

      expect(component.selectionText()).toBe('5 × 7');
    });
  });

  describe('Selection', () => {
    it('should emit selectionChange on cell click', (done) => {
      component.selectionChange.subscribe((selection) => {
        expect(selection.rows).toBe(4);
        expect(selection.cols).toBe(6);
        done();
      });

      component.onCellClick(4, 6);
    });

    it('should not emit if no cell is hovered', () => {
      spyOn(component.selectionChange, 'emit');
      component.onCellClick(0, 0);
      expect(component.selectionChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('Theming', () => {
    it('should apply light theme', () => {
      component.theme = 'light';
      fixture.detectChanges();

      expect(compiled.getAttribute('data-theme')).toBe('light');
    });

    it('should apply dark theme', () => {
      component.theme = 'dark';
      fixture.detectChanges();

      expect(compiled.getAttribute('data-theme')).toBe('dark');
    });

    it('should detect system theme preference', () => {
      const mockMediaQuery = {
        matches: true,
        addEventListener: jasmine.createSpy()
      };
      spyOn(window, 'matchMedia').and.returnValue(mockMediaQuery as any);

      component.theme = 'auto';
      fixture.detectChanges();

      // Should resolve to dark based on system preference
      expect(component.currentTheme).toBe('dark');
    });
  });

  describe('Responsive Behavior', () => {
    it('should adjust grid size for mobile', () => {
      component.responsive = true;
      component['currentBreakpoint'].set('mobile');
      fixture.detectChanges();

      const responsiveRows = component['responsiveRows']();
      const responsiveCols = component['responsiveCols']();

      expect(responsiveRows).toBeLessThanOrEqual(6);
      expect(responsiveCols).toBeLessThanOrEqual(6);
    });

    it('should calculate responsive cell size', () => {
      component.responsive = true;
      component['containerWidth'].set(400);
      component['currentBreakpoint'].set('mobile');
      fixture.detectChanges();

      const cellSize = component['responsiveCellSize']();
      expect(cellSize).toBeGreaterThanOrEqual(20);
      expect(cellSize).toBeLessThanOrEqual(44);
    });
  });

  describe('Accessibility', () => {
    it('should have grid role', () => {
      expect(compiled.getAttribute('role')).toBe('grid');
    });

    it('should have aria-label', () => {
      expect(compiled.getAttribute('aria-label')).toBeTruthy();
    });

    it('should mark active cells with aria-selected', () => {
      component.onCellHover(2, 2);
      fixture.detectChanges();

      const cells = compiled.querySelectorAll('[aria-selected="true"]');
      expect(cells.length).toBe(4); // 2x2
    });

    it('should announce selection changes', () => {
      const liveRegion = compiled.querySelector('[role="status"]');
      expect(liveRegion).toBeTruthy();

      component.onCellHover(3, 5);
      fixture.detectChanges();

      expect(liveRegion?.textContent).toContain('3 × 5');
    });
  });

  describe('Edge Cases', () => {
    it('should handle min grid size', () => {
      component.rows = 1;
      component.cols = 1;
      fixture.detectChanges();

      // Should enforce minimum
      expect(component.rows).toBeGreaterThanOrEqual(3);
    });

    it('should handle max grid size', () => {
      component.rows = 100;
      component.cols = 100;
      fixture.detectChanges();

      // Should enforce maximum
      expect(component.rows).toBeLessThanOrEqual(20);
      expect(component.cols).toBeLessThanOrEqual(20);
    });

    it('should handle rapid hover changes', (done) => {
      for (let i = 1; i <= 10; i++) {
        component.onCellHover(i, i);
      }
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.hoveredCell()).toEqual({ row: 10, col: 10 });
        done();
      }, 100);
    });
  });
});
```

---

### TableCellComponent Tests

```typescript
// table-cell.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCellComponent } from './table-cell.component';

describe('TableCellComponent', () => {
  let component: TableCellComponent;
  let fixture: ComponentFixture<TableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCellComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableCellComponent);
    component = fixture.componentInstance;
    component.row = 1;
    component.col = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply active class', () => {
    component.active = true;
    fixture.detectChanges();

    const host = fixture.nativeElement;
    expect(host.classList.contains('active')).toBe(true);
  });

  it('should emit hover event', (done) => {
    component.cellHover.subscribe(() => {
      done();
    });

    component.onMouseEnter();
  });

  it('should emit click event', (done) => {
    component.cellClick.subscribe(() => {
      done();
    });

    component.onClick();
  });

  it('should handle touch events', () => {
    spyOn(component.cellHover, 'emit');

    const touchEvent = new TouchEvent('touchstart');
    component.onTouchStart(touchEvent);

    expect(component.cellHover.emit).toHaveBeenCalled();
  });

  it('should set data attributes', () => {
    const host = fixture.nativeElement;
    expect(host.getAttribute('data-row')).toBe('1');
    expect(host.getAttribute('data-col')).toBe('1');
  });
});
```

---

### NgxTableLayoutPickerDropdownComponent Tests

```typescript
// ngx-table-layout-picker-dropdown.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxTableLayoutPickerDropdownComponent } from './ngx-table-layout-picker-dropdown.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';

describe('NgxTableLayoutPickerDropdownComponent', () => {
  let component: NgxTableLayoutPickerDropdownComponent;
  let fixture: ComponentFixture<NgxTableLayoutPickerDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxTableLayoutPickerDropdownComponent,
        NoopAnimationsModule,
        MatMenuModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTableLayoutPickerDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button with label', () => {
    component.buttonLabel = 'Insert Table';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button?.textContent).toContain('Insert Table');
  });

  it('should emit opened event when menu opens', (done) => {
    component.opened.subscribe(() => {
      done();
    });

    component.onMenuOpened();
  });

  it('should emit closed event when menu closes', (done) => {
    component.closed.subscribe(() => {
      done();
    });

    component.onMenuClosed();
  });

  it('should emit tableSelected and close menu on selection', (done) => {
    component.closeOnSelect = true;
    component.tableSelected.subscribe((selection) => {
      expect(selection.rows).toBe(5);
      expect(selection.cols).toBe(7);
      done();
    });

    component.onSelectionChange({ rows: 5, cols: 7 });
  });

  it('should not close menu if closeOnSelect is false', () => {
    component.closeOnSelect = false;
    const menuTrigger = component['menuTrigger'];
    spyOn(menuTrigger, 'closeMenu');

    component.onSelectionChange({ rows: 3, cols: 4 });

    expect(menuTrigger.closeMenu).not.toHaveBeenCalled();
  });
});
```

---

## Service Testing

### TableLayoutService Tests

```typescript
// table-layout.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { TableLayoutService } from './table-layout.service';

describe('TableLayoutService', () => {
  let service: TableLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateActiveCells', () => {
    it('should calculate correct number of cells', () => {
      const cells = service.calculateActiveCells(3, 4);
      expect(cells.length).toBe(12); // 3x4
    });

    it('should return cells in correct order', () => {
      const cells = service.calculateActiveCells(2, 2);
      expect(cells).toEqual([
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: 2 }
      ]);
    });

    it('should handle 1x1 selection', () => {
      const cells = service.calculateActiveCells(1, 1);
      expect(cells.length).toBe(1);
      expect(cells[0]).toEqual({ row: 1, col: 1 });
    });
  });

  describe('isCellActive', () => {
    it('should return true for cells within selection', () => {
      const hoveredCell = { row: 3, col: 4 };
      expect(service.isCellActive({ row: 2, col: 3 }, hoveredCell)).toBe(true);
    });

    it('should return false for cells outside selection', () => {
      const hoveredCell = { row: 3, col: 4 };
      expect(service.isCellActive({ row: 4, col: 5 }, hoveredCell)).toBe(false);
    });

    it('should return false when no cell is hovered', () => {
      expect(service.isCellActive({ row: 1, col: 1 }, null)).toBe(false);
    });
  });

  describe('shouldExpandGrid', () => {
    it('should expand when hovering at edge', () => {
      const result = service.shouldExpandGrid(
        { rows: 8, cols: 8 },
        { row: 8, col: 8 },
        { rows: 10, cols: 10 }
      );

      expect(result.expandRows).toBe(true);
      expect(result.expandCols).toBe(true);
    });

    it('should not expand beyond maximum', () => {
      const result = service.shouldExpandGrid(
        { rows: 10, cols: 10 },
        { row: 10, col: 10 },
        { rows: 10, cols: 10 }
      );

      expect(result.expandRows).toBe(false);
      expect(result.expandCols).toBe(false);
    });
  });

  describe('calculateResponsiveCellSize', () => {
    it('should calculate size within bounds', () => {
      const size = service.calculateResponsiveCellSize(600, 10, 20, 40, 2);
      expect(size).toBeGreaterThanOrEqual(20);
      expect(size).toBeLessThanOrEqual(40);
    });

    it('should enforce minimum size', () => {
      const size = service.calculateResponsiveCellSize(100, 20, 20, 40, 2);
      expect(size).toBe(20);
    });

    it('should enforce maximum size', () => {
      const size = service.calculateResponsiveCellSize(1000, 5, 20, 40, 2);
      expect(size).toBe(40);
    });
  });

  describe('formatSelectionText', () => {
    it('should format selection correctly', () => {
      expect(service.formatSelectionText(5, 7)).toBe('5 × 7');
    });

    it('should handle single cell', () => {
      expect(service.formatSelectionText(1, 1)).toBe('1 × 1');
    });
  });

  describe('validateConfig', () => {
    it('should enforce minimum values', () => {
      const config = service.validateConfig({ rows: 1, cols: 1 });
      expect(config.rows).toBeGreaterThanOrEqual(3);
      expect(config.cols).toBeGreaterThanOrEqual(3);
    });

    it('should enforce maximum values', () => {
      const config = service.validateConfig({ rows: 100, cols: 100 });
      expect(config.rows).toBeLessThanOrEqual(20);
      expect(config.cols).toBeLessThanOrEqual(20);
    });

    it('should preserve valid values', () => {
      const config = service.validateConfig({ rows: 8, cols: 10 });
      expect(config.rows).toBe(8);
      expect(config.cols).toBe(10);
    });
  });
});
```

---

### ThemeService Tests

```typescript
// theme.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to auto theme', () => {
    expect(service.themeMode()).toBe('auto');
  });

  it('should set theme explicitly', () => {
    service.setTheme('dark');
    expect(service.themeMode()).toBe('dark');
    expect(service.resolvedTheme()).toBe('dark');
  });

  it('should toggle theme', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(service.themeMode()).toBe('dark');
  });

  it('should detect system preference', () => {
    const mockMediaQuery = {
      matches: true,
      addEventListener: jasmine.createSpy()
    };
    spyOn(window, 'matchMedia').and.returnValue(mockMediaQuery as any);

    const newService = new ThemeService();
    expect(newService.systemPreference()).toBe('dark');
  });

  it('should get theme colors', () => {
    const colors = service.getThemeColors();
    expect(colors).toBeTruthy();
    expect(colors.bgPrimary).toBeDefined();
    expect(colors.cellHover).toBeDefined();
  });
});
```

---

## Integration Testing

### User Workflow Tests

```typescript
// table-selection-workflow.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxTableLayoutPickerComponent } from '../components/ngx-table-layout-picker/ngx-table-layout-picker.component';

describe('Table Selection Workflow', () => {
  let fixture: ComponentFixture<NgxTableLayoutPickerComponent>;
  let component: NgxTableLayoutPickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTableLayoutPickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTableLayoutPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should complete hover-to-select workflow', (done) => {
    // Step 1: Hover over cell
    component.onCellHover(4, 6);
    fixture.detectChanges();

    expect(component.hoveredCell()).toEqual({ row: 4, col: 6 });
    expect(component.selectionText()).toBe('4 × 6');

    // Step 2: Click to select
    component.selectionChange.subscribe((selection) => {
      expect(selection.rows).toBe(4);
      expect(selection.cols).toBe(6);
      done();
    });

    component.onCellClick(4, 6);
  });

  it('should handle mouse enter-hover-click-leave workflow', () => {
    // Enter container
    component.onContainerEnter();
    fixture.detectChanges();

    // Hover over cells
    component.onCellHover(3, 5);
    fixture.detectChanges();
    expect(component.hoveredCell()).toEqual({ row: 3, col: 5 });

    // Click
    let selectedValues: any;
    component.selectionChange.subscribe((selection) => {
      selectedValues = selection;
    });
    component.onCellClick(3, 5);

    expect(selectedValues.rows).toBe(3);
    expect(selectedValues.cols).toBe(5);

    // Leave container
    component.onContainerLeave();
    fixture.detectChanges();
    expect(component.hoveredCell()).toBeNull();
  });
});
```

---

## Test Utilities

### Test Helpers

```typescript
// test-helpers.ts
import { ComponentFixture } from '@angular/core/testing';

export class TestHelpers {
  static getCellElement(
    fixture: ComponentFixture<any>,
    row: number,
    col: number
  ): HTMLElement | null {
    return fixture.nativeElement.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
  }

  static triggerMouseEvent(
    element: HTMLElement,
    eventType: string
  ): void {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }

  static triggerTouchEvent(
    element: HTMLElement,
    eventType: string,
    touches: Touch[]
  ): void {
    const event = new TouchEvent(eventType, {
      bubbles: true,
      cancelable: true,
      touches: touches as any,
      view: window
    });
    element.dispatchEvent(event);
  }

  static expectCellActive(
    fixture: ComponentFixture<any>,
    row: number,
    col: number
  ): void {
    const cell = TestHelpers.getCellElement(fixture, row, col);
    expect(cell?.classList.contains('active')).toBe(true);
  }
}
```

---

## Coverage Reports

### Coverage Configuration

```json
// coverage thresholds in package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 75,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/ngx-table-layout-picker/index.html

# CI coverage check
npm run test:ci
```

---

## Continuous Testing

### Watch Mode Testing

```bash
# Run tests in watch mode during development
npm test

# Run specific test file
npm test -- --include="**/table-layout-selector.component.spec.ts"
```

### Pre-commit Testing

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci && npm run lint"
    }
  }
}
```

---

## Test Documentation

### Writing Good Tests Checklist

- ✅ Test one thing per test
- ✅ Use descriptive test names
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Test both happy and error paths
- ✅ Mock external dependencies
- ✅ Test accessibility features
- ✅ Test responsive behavior
- ✅ Clean up after tests (avoid leaks)
- ✅ Keep tests fast (< 100ms per test)
- ✅ Use test utilities for common operations
