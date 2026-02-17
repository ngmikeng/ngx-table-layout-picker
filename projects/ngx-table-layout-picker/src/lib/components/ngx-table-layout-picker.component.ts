import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  effect,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCellComponent } from './table-cell/table-cell.component';
import { TableFooterComponent } from './table-footer/table-footer.component';
import { TableLayoutService } from '../services/table-layout.service';
import { TableCell } from '../models/table-cell.model';
import { TableSelection } from '../models/table-selection.model';
import { GridDimensions } from '../models/grid-dimensions.model';
import { ThemeMode } from '../models/theme.model';

/**
 * Main table layout picker component
 * Renders an interactive grid for selecting table dimensions
 */
@Component({
  selector: 'ngx-table-layout-picker',
  standalone: true,
  imports: [CommonModule, TableCellComponent, TableFooterComponent],
  templateUrl: './ngx-table-layout-picker.component.html',
  styleUrls: ['./ngx-table-layout-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-theme]': 'effectiveTheme()',
    '[class.tls-responsive]': 'responsive',
    'role': 'grid',
    '[attr.aria-label]': 'ariaLabel'
  }
})
export class NgxTableLayoutPickerComponent implements OnInit, OnDestroy {
  private readonly layoutService = inject(TableLayoutService);
  private mediaQuery?: MediaQueryList;

  // Input properties
  @Input() rows = 10;
  @Input() cols = 10;
  @Input() maxRows = 20;
  @Input() maxCols = 20;
  @Input() showFooter = true;
  @Input() theme: ThemeMode = 'auto';
  @Input() cellSize = 24;
  @Input() expandable = true;
  @Input() responsive = true;
  @Input() ariaLabel = 'Table layout selector';
  @Input() minCellSize = 20;

  // Output events
  @Output() selectionChange = new EventEmitter<TableSelection>();
  @Output() cellHover = new EventEmitter<TableCell>();
  @Output() gridExpanded = new EventEmitter<GridDimensions>();
  @Output() themeChange = new EventEmitter<ThemeMode>();

  // Signals for reactive state
  protected readonly hoveredCell = signal<TableCell | null>(null);
  protected readonly currentDimensions = signal<GridDimensions>({
    rows: this.rows,
    cols: this.cols
  });
  protected readonly systemTheme = signal<'light' | 'dark'>('light');

  // Computed values
  protected readonly effectiveTheme = computed(() => {
    if (this.theme === 'auto') {
      return this.systemTheme();
    }
    return this.theme;
  });

  protected readonly rowsArray = computed(() =>
    this.layoutService.generateRange(this.currentDimensions().rows)
  );

  protected readonly colsArray = computed(() =>
    this.layoutService.generateRange(this.currentDimensions().cols)
  );

  protected readonly selectionText = computed(() => {
    const hovered = this.hoveredCell();
    if (!hovered) return '';
    return this.layoutService.formatSelectionText(hovered.row, hovered.col);
  });

  protected readonly hasHoveredCell = computed(() => this.hoveredCell() !== null);

  constructor() {
    // Effect to handle theme changes
    effect(() => {
      const theme = this.effectiveTheme();
      this.themeChange.emit(theme);
    });
  }

  ngOnInit(): void {
    // Validate and normalize initial configuration
    const config = this.layoutService.validateConfig({
      rows: this.rows,
      cols: this.cols,
      maxRows: this.maxRows,
      maxCols: this.maxCols,
      cellSize: this.cellSize,
      minCellSize: this.minCellSize
    });

    this.rows = config.rows!;
    this.cols = config.cols!;
    this.maxRows = config.maxRows!;
    this.maxCols = config.maxCols!;
    this.cellSize = config.cellSize!;
    this.minCellSize = config.minCellSize!;

    this.currentDimensions.set({ rows: this.rows, cols: this.cols });

    // Set up system theme detection
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.updateSystemTheme(this.mediaQuery);
      this.mediaQuery.addEventListener('change', this.onThemeMediaChange);
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.onThemeMediaChange);
    }
  }

  private readonly onThemeMediaChange = (e: MediaQueryListEvent): void => {
    this.updateSystemTheme(e);
  };

  private updateSystemTheme(mediaQuery: MediaQueryList | MediaQueryListEvent): void {
    this.systemTheme.set(mediaQuery.matches ? 'dark' : 'light');
  }

  /**
   * Handle cell hover
   */
  protected onCellHover(row: number, col: number): void {
    const cell: TableCell = { row, col };
    this.hoveredCell.set(cell);
    this.cellHover.emit(cell);

    // Handle grid expansion if enabled
    if (this.expandable) {
      const expansion = this.layoutService.shouldExpandGrid(
        this.currentDimensions(),
        cell,
        { rows: this.maxRows, cols: this.maxCols }
      );

      if (expansion.expandRows || expansion.expandCols) {
        const newDimensions = {
          rows: expansion.expandRows
            ? this.currentDimensions().rows + 1
            : this.currentDimensions().rows,
          cols: expansion.expandCols
            ? this.currentDimensions().cols + 1
            : this.currentDimensions().cols
        };
        this.currentDimensions.set(newDimensions);
        this.gridExpanded.emit(newDimensions);
      }
    }
  }

  /**
   * Handle cell click (selection)
   */
  protected onCellClick(row: number, col: number): void {
    const selection: TableSelection = {
      rows: row,
      cols: col,
      cells: this.layoutService.calculateActiveCells(row, col),
      timestamp: new Date()
    };
    this.selectionChange.emit(selection);
  }

  /**
   * Handle container mouse leave
   */
  protected onContainerLeave(): void {
    this.hoveredCell.set(null);
  }

  /**
   * Determine if a cell is active (within hover selection)
   */
  protected isCellActive(row: number, col: number): boolean {
    return this.layoutService.isCellActive(
      { row, col },
      this.hoveredCell()
    );
  }

  /**
   * Get ARIA label for a cell
   */
  protected getCellAriaLabel(row: number, col: number): string {
    return this.layoutService.getCellAriaLabel(row, col);
  }

  /**
   * Screen reader text for announcements
   */
  protected readonly screenReaderText = computed(() => {
    const hovered = this.hoveredCell();
    if (!hovered) return '';
    return `Selected ${hovered.row} rows by ${hovered.col} columns`;
  });

  // Public API methods

  /**
   * Reset the grid to initial dimensions
   */
  public reset(): void {
    this.currentDimensions.set({ rows: this.rows, cols: this.cols });
    this.hoveredCell.set(null);
  }

  /**
   * Set the hovered cell programmatically
   */
  public setHoveredCell(row: number, col: number): void {
    this.onCellHover(row, col);
  }

  /**
   * Get current grid dimensions
   */
  public getDimensions(): GridDimensions {
    return this.currentDimensions();
  }

  /**
   * Force theme update
   */
  public setTheme(theme: ThemeMode): void {
    this.theme = theme;
  }
}
