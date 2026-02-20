# Usage Guide

Comprehensive guide for using NGX Table Layout Picker in your Angular applications.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Dropdown Integration](#dropdown-integration)
- [Responsive Design](#responsive-design)
- [Theme Configuration](#theme-configuration)
- [Dynamic Grid Behavior](#dynamic-grid-behavior)
- [Event Handling](#event-handling)
- [Integration Patterns](#integration-patterns)
- [Best Practices](#best-practices)
- [Common Scenarios](#common-scenarios)

---

## Installation

### Step 1: Install the package

```bash
npm install ngx-table-layout-picker
```

### Step 2: Install peer dependencies (if using dropdown)

```bash
npm install @angular/material @angular/cdk
```

### Step 3: Import styles (optional, for default themes)

Add to your `styles.scss`:

```scss
@import 'ngx-table-layout-picker/themes';
```

Or import individual theme files:

```scss
@import 'ngx-table-layout-picker/themes/light-theme';
@import 'ngx-table-layout-picker/themes/dark-theme';
```

---

## Basic Usage

### Minimal Setup

The simplest way to use the table layout picker:

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerComponent, TableSelection } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <div class="editor-toolbar">
      <ngx-table-layout-picker
        (selectionChange)="onTableSelected($event)">
      </ngx-table-layout-picker>
    </div>
  `,
  styles: [`
    .editor-toolbar {
      padding: 1rem;
      border: 1px solid #ccc;
    }
  `]
})
export class EditorComponent {
  onTableSelected(selection: TableSelection): void {
    console.log(`Creating table: ${selection.rows} × ${selection.cols}`);
    // Insert table into your editor
    this.insertTable(selection.rows, selection.cols);
  }

  private insertTable(rows: number, cols: number): void {
    // Your table insertion logic here
  }
}
```

### Customized Configuration

Configure the component with your preferred settings:

```typescript
@Component({
  selector: 'app-custom-editor',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <ngx-table-layout-picker
      [rows]="8"
      [cols]="8"
      [maxRows]="15"
      [maxCols]="15"
      [cellSize]="28"
      [theme]="'light'"
      [showFooter]="true"
      [expandable]="true"
      [responsive]="true"
      (selectionChange)="onSelect($event)"
      (cellHover)="onHover($event)">
    </ngx-table-layout-picker>
  `
})
export class CustomEditorComponent {
  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }

  onHover(cell: TableCell): void {
    console.log(`Hovering: ${cell.row} × ${cell.col}`);
  }
}
```

---

## Dropdown Integration

### Material Design Integration

Use the dropdown component for a toolbar button integration:

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerDropdownComponent, TableSelection } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [NgxTableLayoutPickerDropdownComponent],
  template: `
    <mat-toolbar>
      <ngx-table-layout-picker-dropdown
        buttonLabel="Insert Table"
        buttonIcon="table_chart"
        buttonAppearance="raised"
        [selectorConfig]="{
          rows: 10,
          cols: 10,
          maxRows: 20,
          maxCols: 20,
          theme: 'auto'
        }"
        (tableSelected)="insertTable($event)">
      </ngx-table-layout-picker-dropdown>
    </mat-toolbar>
  `
})
export class ToolbarComponent {
  insertTable(selection: TableSelection): void {
    console.log(`Inserting ${selection.rows} × ${selection.cols} table`);
    // Your insertion logic
  }
}
```

### Programmatic Control

Control the dropdown programmatically:

```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxTableLayoutPickerDropdownComponent } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-advanced-toolbar',
  template: `
    <button (click)="showTablePicker()">Show Table Picker</button>
    
    <ngx-table-layout-picker-dropdown
      #tablePicker
      buttonLabel="Insert Table"
      (tableSelected)="insertTable($event)"
      (opened)="onOpened()"
      (closed)="onClosed()">
    </ngx-table-layout-picker-dropdown>
  `
})
export class AdvancedToolbarComponent {
  @ViewChild('tablePicker') tablePicker!: NgxTableLayoutPickerDropdownComponent;

  showTablePicker(): void {
    this.tablePicker.openMenu();
  }

  insertTable(selection: TableSelection): void {
    console.log('Inserting table');
    // Close menu programmatically if needed
    // this.tablePicker.closeMenu();
  }

  onOpened(): void {
    console.log('Dropdown opened');
  }

  onClosed(): void {
    console.log('Dropdown closed');
  }
}
```

---

## Responsive Design

### Automatic Responsive Behavior

The component automatically adapts to different screen sizes when `responsive` is enabled (default):

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      [responsive]="true"
      [minCellSize]="20"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class ResponsiveEditorComponent {
  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

### Custom Responsive Configuration

Customize responsive behavior based on device type:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { NgxTableLayoutPickerComponent, ResponsiveService } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-adaptive-editor',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <ngx-table-layout-picker
      [rows]="gridConfig().rows"
      [cols]="gridConfig().cols"
      [cellSize]="gridConfig().cellSize"
      [responsive]="true"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class AdaptiveEditorComponent implements OnInit {
  private responsiveService = inject(ResponsiveService);
  
  gridConfig = computed(() => {
    const isMobile = this.responsiveService.isMobile();
    const isTablet = this.responsiveService.isTablet();
    
    if (isMobile) {
      return { rows: 6, cols: 6, cellSize: 32 };
    } else if (isTablet) {
      return { rows: 8, cols: 8, cellSize: 28 };
    } else {
      return { rows: 10, cols: 10, cellSize: 24 };
    }
  });

  ngOnInit(): void {
    console.log('Current breakpoint:', this.responsiveService.currentBreakpoint());
  }

  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

### Touch Device Optimization

Optimize for touch devices:

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      [cellSize]="isTouchDevice() ? 36 : 24"
      [minCellSize]="isTouchDevice() ? 32 : 20"
      [responsive]="true"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class TouchOptimizedComponent {
  private responsiveService = inject(ResponsiveService);
  
  isTouchDevice = this.responsiveService.isTouchDevice;

  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

---

## Theme Configuration

### Static Theme

Use a fixed theme:

```typescript
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

### Dynamic Theme Switching

Allow users to switch themes:

```typescript
import { Component, signal } from '@angular/core';
import { NgxTableLayoutPickerComponent, ThemeMode } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-themed-editor',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <div class="theme-controls">
      <button (click)="setTheme('light')">Light</button>
      <button (click)="setTheme('dark')">Dark</button>
      <button (click)="setTheme('auto')">Auto</button>
    </div>
    
    <ngx-table-layout-picker
      [theme]="currentTheme()"
      (selectionChange)="onSelect($event)"
      (themeChange)="onThemeChange($event)">
    </ngx-table-layout-picker>
  `
})
export class ThemedEditorComponent {
  currentTheme = signal<ThemeMode>('auto');

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
  }

  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }

  onThemeChange(theme: string): void {
    console.log('Effective theme:', theme);
  }
}
```

### System Preference Detection

Automatically follow system theme:

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
    console.log('System theme is:', theme);
    // Update your app theme accordingly
  }
}
```

---

## Dynamic Grid Behavior

### Grid Expansion & Shrinking

The grid automatically expands and shrinks based on hover position:

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerComponent, GridDimensions } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-dynamic-grid',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <div class="grid-info">
      Current Grid: {{ currentDims().rows }} × {{ currentDims().cols }}
    </div>
    
    <ngx-table-layout-picker
      [rows]="10"
      [cols]="10"
      [maxRows]="20"
      [maxCols]="20"
      [expandable]="true"
      [shrinkThreshold]="2"
      (gridExpanded)="onExpanded($event)"
      (gridShrank)="onShrank($event)"
      (gridResized)="onResized($event)"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class DynamicGridComponent {
  currentDims = signal<GridDimensions>({ rows: 10, cols: 10 });

  onExpanded(dims: GridDimensions): void {
    console.log(`Grid expanded to ${dims.rows} × ${dims.cols}`);
    this.currentDims.set(dims);
  }

  onShrank(dims: GridDimensions): void {
    console.log(`Grid shrank to ${dims.rows} × ${dims.cols}`);
    this.currentDims.set(dims);
  }

  onResized(dims: GridDimensions): void {
    console.log(`Grid resized to ${dims.rows} × ${dims.cols}`);
    this.currentDims.set(dims);
  }

  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

### Adjusting Shrink Behavior

Control how aggressively the grid shrinks:

```typescript
@Component({
  template: `
    <div class="shrink-controls">
      <label>
        Shrink Threshold:
        <input type="range" min="1" max="5" 
               [(ngModel)]="shrinkThreshold()"
               (change)="onThresholdChange()">
        {{ shrinkThreshold() }}
      </label>
    </div>
    
    <ngx-table-layout-picker
      [shrinkThreshold]="shrinkThreshold()"
      [expandable]="true"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class ShrinkControlComponent {
  shrinkThreshold = signal(2);

  onThresholdChange(): void {
    console.log('Shrink threshold changed to:', this.shrinkThreshold());
  }

  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

### Disabling Dynamic Behavior

For a fixed grid size:

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      [rows]="10"
      [cols]="10"
      [expandable]="false"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class FixedGridComponent {
  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

---

## Event Handling

### Comprehensive Event Handling

Handle all available events:

```typescript
import { Component } from '@angular/core';
import { NgxTableLayoutPickerComponent } from 'ngx-table-layout-picker';
import type { TableSelection, TableCell, GridDimensions, ThemeMode } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-event-demo',
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <div class="event-log">
      <h3>Event Log</h3>
      <ul>
        @for (event of eventLog(); track $index) {
          <li>{{ event }}</li>
        }
      </ul>
    </div>
    
    <ngx-table-layout-picker
      [rows]="10"
      [cols]="10"
      (selectionChange)="onSelectionChange($event)"
      (cellHover)="onCellHover($event)"
      (gridExpanded)="onGridExpanded($event)"
      (gridShrank)="onGridShrank($event)"
      (gridResized)="onGridResized($event)"
      (themeChange)="onThemeChange($event)">
    </ngx-table-layout-picker>
  `
})
export class EventDemoComponent {
  eventLog = signal<string[]>([]);

  private log(message: string): void {
    this.eventLog.update(log => [message, ...log].slice(0, 10));
  }

  onSelectionChange(selection: TableSelection): void {
    this.log(`Selection: ${selection.rows} × ${selection.cols}`);
  }

  onCellHover(cell: TableCell): void {
    this.log(`Hover: ${cell.row} × ${cell.col}`);
  }

  onGridExpanded(dims: GridDimensions): void {
    this.log(`Expanded: ${dims.rows} × ${dims.cols}`);
  }

  onGridShrank(dims: GridDimensions): void {
    this.log(`Shrank: ${dims.rows} × ${dims.cols}`);
  }

  onGridResized(dims: GridDimensions): void {
    this.log(`Resized: ${dims.rows} × ${dims.cols}`);
  }

  onThemeChange(theme: string): void {
    this.log(`Theme: ${theme}`);
  }
}
```

### Debouncing Hover Events

Debounce rapid hover events to reduce processing:

```typescript
import { Component } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  template: `
    <ngx-table-layout-picker
      (cellHover)="onCellHover($event)"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class DebouncedHoverComponent implements OnInit, OnDestroy {
  private hoverSubject = new Subject<TableCell>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.hoverSubject.pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(cell => {
      this.processHover(cell);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCellHover(cell: TableCell): void {
    this.hoverSubject.next(cell);
  }

  private processHover(cell: TableCell): void {
    console.log('Debounced hover:', cell);
    // Your processing logic
  }

  onSelect(selection: TableSelection): void {
    console.log('Selected:', selection);
  }
}
```

---

## Integration Patterns

### Rich Text Editor Integration

Integrate with a rich text editor:

```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxTableLayoutPickerDropdownComponent, TableSelection } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-rich-editor',
  template: `
    <div class="editor-toolbar">
      <button (click)="bold()">Bold</button>
      <button (click)="italic()">Italic</button>
      
      <ngx-table-layout-picker-dropdown
        buttonLabel="Table"
        buttonIcon="table_chart"
        (tableSelected)="insertTable($event)">
      </ngx-table-layout-picker-dropdown>
    </div>
    
    <div #editor 
         contenteditable="true" 
         class="editor-content">
      Start typing...
    </div>
  `,
  styles: [`
    .editor-toolbar {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
    }
    
    .editor-content {
      min-height: 300px;
      padding: 1rem;
      border: 1px solid #ccc;
    }
  `]
})
export class RichEditorComponent {
  @ViewChild('editor') editorElement!: ElementRef<HTMLDivElement>;

  bold(): void {
    document.execCommand('bold');
  }

  italic(): void {
    document.execCommand('italic');
  }

  insertTable(selection: TableSelection): void {
    const table = this.createTable(selection.rows, selection.cols);
    const editor = this.editorElement.nativeElement;
    
    // Insert at cursor position
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(table);
    } else {
      editor.appendChild(table);
    }
  }

  private createTable(rows: number, cols: number): HTMLTableElement {
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    
    for (let r = 0; r < rows; r++) {
      const row = table.insertRow();
      for (let c = 0; c < cols; c++) {
        const cell = row.insertCell();
        cell.style.border = '1px solid #ccc';
        cell.style.padding = '8px';
        cell.textContent = '\u00A0'; // Non-breaking space
      }
    }
    
    return table;
  }
}
```

### Form Builder Integration

Use in a form builder:

```typescript
@Component({
  selector: 'app-form-builder',
  template: `
    <div class="form-builder">
      <div class="toolbar">
        <button (click)="addTextField()">Add Text Field</button>
        
        <ngx-table-layout-picker-dropdown
          buttonLabel="Add Table"
          (tableSelected)="addTableField($event)">
        </ngx-table-layout-picker-dropdown>
      </div>
      
      <div class="form-preview">
        @for (field of formFields(); track field.id) {
          <div class="form-field">
            @if (field.type === 'text') {
              <input type="text" [placeholder]="field.label">
            } @else if (field.type === 'table') {
              <div class="table-field">
                Table: {{ field.rows }} × {{ field.cols }}
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class FormBuilderComponent {
  formFields = signal<FormField[]>([]);
  private nextId = 1;

  addTextField(): void {
    this.formFields.update(fields => [
      ...fields,
      { id: this.nextId++, type: 'text', label: 'Text Field' }
    ]);
  }

  addTableField(selection: TableSelection): void {
    this.formFields.update(fields => [
      ...fields,
      {
        id: this.nextId++,
        type: 'table',
        rows: selection.rows,
        cols: selection.cols
      }
    ]);
  }
}

interface FormField {
  id: number;
  type: 'text' | 'table';
  label?: string;
  rows?: number;
  cols?: number;
}
```

---

## Best Practices

### 1. Use Standalone Components

Always import as standalone components:

```typescript
import { NgxTableLayoutPickerComponent } from 'ngx-table-layout-picker';

@Component({
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  // ...
})
```

### 2. Leverage Signals

Use signals for reactive state:

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      [theme]="currentTheme()"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class BestPracticeComponent {
  currentTheme = signal<ThemeMode>('auto');
  selectedTable = signal<TableSelection | null>(null);

  onSelect(selection: TableSelection): void {
    this.selectedTable.set(selection);
  }
}
```

### 3. Handle Accessibility

Ensure proper accessibility:

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      [ariaLabel]="'Select table dimensions for document'"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
```

### 4. Responsive Configuration

Always enable responsive mode for cross-device support:

```typescript
@Component({
  template: `
    <ngx-table-layout-picker
      [responsive]="true"
      [minCellSize]="20"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
```

### 5. Validate Selection

Always validate user selections:

```typescript
onSelect(selection: TableSelection): void {
  // Validate dimensions
  if (selection.rows < 1 || selection.cols < 1) {
    console.error('Invalid table dimensions');
    return;
  }
  
  if (selection.rows > 50 || selection.cols > 50) {
    console.warn('Large table selected, confirm with user');
    // Show confirmation dialog
  }
  
  this.createTable(selection);
}
```

---

## Common Scenarios

### Scenario 1: Document Editor

```typescript
@Component({
  selector: 'app-document-editor',
  template: `
    <div class="editor-container">
      <div class="toolbar">
        <ngx-table-layout-picker-dropdown
          buttonLabel="Insert Table"
          [selectorConfig]="{ rows: 8, cols: 8, maxRows: 15, maxCols: 15 }"
          (tableSelected)="insertTable($event)">
        </ngx-table-layout-picker-dropdown>
      </div>
      
      <div #document class="document">
        <!-- Document content -->
      </div>
    </div>
  `
})
export class DocumentEditorComponent {
  insertTable(selection: TableSelection): void {
    // Create and insert table into document
  }
}
```

### Scenario 2: Spreadsheet Tool

```typescript
@Component({
  selector: 'app-spreadsheet',
  template: `
    <ngx-table-layout-picker
      [rows]="20"
      [cols]="20"
      [maxRows]="100"
      [maxCols]="50"
      [cellSize]="20"
      [showFooter]="true"
      (selectionChange)="createSpreadsheet($event)">
    </ngx-table-layout-picker>
  `
})
export class SpreadsheetComponent {
  createSpreadsheet(selection: TableSelection): void {
    // Create spreadsheet with selected dimensions
  }
}
```

### Scenario 3: Email Composer

```typescript
@Component({
  selector: 'app-email-composer',
  template: `
    <div class="compose-toolbar">
      <ngx-table-layout-picker-dropdown
        buttonLabel="Table"
        buttonIcon="grid_on"
        [selectorConfig]="{ theme: 'auto', responsive: true }"
        (tableSelected)="insertTableInEmail($event)">
      </ngx-table-layout-picker-dropdown>
    </div>
    
    <div class="email-body" contenteditable="true">
      <!-- Email content -->
    </div>
  `
})
export class EmailComposerComponent {
  insertTableInEmail(selection: TableSelection): void {
    // Insert HTML table into email
  }
}
```

---

## Next Steps

- Explore [API Reference](./api-reference.md) for detailed component documentation
- Learn about [Theming](./theming.md) for custom styling
- Check out the [Demo Application](https://your-demo-url.com) for live examples

---

For questions or issues, visit the [GitHub repository](https://github.com/your-username/ngx-table-layout-picker).
