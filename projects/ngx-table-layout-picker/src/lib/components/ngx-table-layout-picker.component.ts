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
  inject,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCellComponent } from './table-cell/table-cell.component';
import { TableFooterComponent } from './table-footer/table-footer.component';
import { TableLayoutService } from '../services/table-layout.service';
import { ResponsiveService } from '../services/responsive.service';
import { ThemeService } from '../services/theme.service';
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
    '[class.tls-mobile]': 'responsiveService.isMobile()',
    '[class.tls-tablet]': 'responsiveService.isTablet()',
    '[class.tls-desktop]': 'responsiveService.isDesktop()',
    'role': 'grid',
    '[attr.aria-label]': 'ariaLabel'
  }
})
export class NgxTableLayoutPickerComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly layoutService = inject(TableLayoutService);
  protected readonly responsiveService = inject(ResponsiveService);
  private readonly themeService = inject(ThemeService);
  private readonly elementRef = inject(ElementRef);
  private mediaQuery?: MediaQueryList;
  private resizeObserver?: ResizeObserver;
  private containerWidth = signal<number>(0);

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
  @Input() shrinkThreshold = 2;

  // Output events
  @Output() selectionChange = new EventEmitter<TableSelection>();
  @Output() cellHover = new EventEmitter<TableCell>();
  @Output() gridExpanded = new EventEmitter<GridDimensions>();
  @Output() gridShrank = new EventEmitter<GridDimensions>();
  @Output() gridResized = new EventEmitter<GridDimensions>();
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

  // Responsive computed properties
  protected readonly responsiveRows = computed(() => {
    if (!this.responsive) return this.currentDimensions().rows;
    
    const breakpoint = this.responsiveService.currentBreakpoint();
    const recommended = this.responsiveService.getRecommendedGridSize();
    
    // Use recommended size if initial dimensions haven't been expanded
    if (this.currentDimensions().rows === this.rows) {
      return Math.min(recommended.rows, this.rows);
    }
    
    return this.currentDimensions().rows;
  });
  
  protected readonly responsiveCols = computed(() => {
    if (!this.responsive) return this.currentDimensions().cols;
    
    const breakpoint = this.responsiveService.currentBreakpoint();
    const recommended = this.responsiveService.getRecommendedGridSize();
    
    // Use recommended size if initial dimensions haven't been expanded
    if (this.currentDimensions().cols === this.cols) {
      return Math.min(recommended.cols, this.cols);
    }
    
    return this.currentDimensions().cols;
  });
  
  protected readonly responsiveCellSize = computed(() => {
    if (!this.responsive) return this.cellSize;
    
    const containerW = this.containerWidth();
    if (containerW === 0) {
      return this.responsiveService.getRecommendedCellSize();
    }
    
    const cols = this.responsiveCols();
    const minSize = this.responsiveService.isMobile() 
      ? this.responsiveService.getMinTouchTargetSize() 
      : this.minCellSize;
    
    return this.responsiveService.calculateCellSize(
      containerW,
      cols,
      minSize,
      this.cellSize
    );
  });

  protected readonly rowsArray = computed(() =>
    this.layoutService.generateRange(this.responsive ? this.responsiveRows() : this.currentDimensions().rows)
  );

  protected readonly colsArray = computed(() =>
    this.layoutService.generateRange(this.responsive ? this.responsiveCols() : this.currentDimensions().cols)
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
  
  ngAfterViewInit(): void {
    // Set up resize observer for responsive behavior
    if (this.responsive && typeof window !== 'undefined' && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(
        this.responsiveService.debounce((entries) => {
          for (const entry of entries) {
            const width = entry.contentRect.width;
            this.containerWidth.set(width);
          }
        }, 150)
      );
      
      const container = this.elementRef.nativeElement.querySelector('.tls-container');
      if (container) {
        this.resizeObserver.observe(container);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.onThemeMediaChange);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
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

    // Handle grid expansion/shrinking if enabled
    if (this.expandable) {
      const currentDims = this.currentDimensions();
      const optimalDimensions = this.layoutService.calculateOptimalDimensions(
        currentDims,
        cell,
        { rows: this.rows, cols: this.cols },
        { rows: this.maxRows, cols: this.maxCols },
        this.shrinkThreshold
      );

      // Check if dimensions changed
      if (optimalDimensions.rows !== currentDims.rows || optimalDimensions.cols !== currentDims.cols) {
        const expanded = optimalDimensions.rows > currentDims.rows || optimalDimensions.cols > currentDims.cols;
        const shrank = optimalDimensions.rows < currentDims.rows || optimalDimensions.cols < currentDims.cols;
        
        this.currentDimensions.set(optimalDimensions);
        this.gridResized.emit(optimalDimensions);
        
        if (expanded) {
          this.gridExpanded.emit(optimalDimensions);
        }
        if (shrank) {
          this.gridShrank.emit(optimalDimensions);
        }
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
