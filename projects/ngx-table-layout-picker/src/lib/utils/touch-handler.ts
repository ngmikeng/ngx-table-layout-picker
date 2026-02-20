import { TableCell } from '../models/table-cell.model';

/**
 * Handler for touch events with improved mobile interaction
 */
export class TouchHandler {
  private touchStartTime: number = 0;
  private lastTouchCell: TableCell | null = null;
  private touchMoveThrottle: number = 0;
  private static readonly THROTTLE_MS = 50;
  
  /**
   * Callback when cell is hovered via touch
   */
  onCellHover?: (cell: TableCell) => void;
  
  /**
   * Callback when cell is selected via touch
   */
  onCellSelect?: (cell: TableCell) => void;
  
  /**
   * Handle touch start event
   */
  handleTouchStart(event: TouchEvent, row: number, col: number): void {
    event.preventDefault();
    this.touchStartTime = Date.now();
    
    const cell: TableCell = { row, col };
    this.lastTouchCell = cell;
    
    // Trigger haptic feedback
    this.triggerHapticFeedback('light');
    
    // Emit hover event
    if (this.onCellHover) {
      this.onCellHover(cell);
    }
  }
  
  /**
   * Handle touch move event (for dragging across cells)
   */
  handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    
    // Throttle move events
    const now = Date.now();
    if (now - this.touchMoveThrottle < TouchHandler.THROTTLE_MS) {
      return;
    }
    this.touchMoveThrottle = now;
    
    const touch = event.touches[0];
    if (!touch) return;
    
    // Find element under touch point
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;
    
    // Get cell coordinates from data attributes
    const cellElement = this.findCellElement(element);
    if (!cellElement) return;
    
    const row = parseInt(cellElement.getAttribute('data-row') || '0', 10);
    const col = parseInt(cellElement.getAttribute('data-col') || '0', 10);
    
    if (row > 0 && col > 0) {
      const cell: TableCell = { row, col };
      
      // Only emit if cell changed
      if (!this.lastTouchCell || 
          this.lastTouchCell.row !== row || 
          this.lastTouchCell.col !== col) {
        this.lastTouchCell = cell;
        this.triggerHapticFeedback('light');
        
        if (this.onCellHover) {
          this.onCellHover(cell);
        }
      }
    }
  }
  
  /**
   * Handle touch end event
   */
  handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    
    if (!this.lastTouchCell) return;
    
    const touchDuration = Date.now() - this.touchStartTime;
    
    // If touch was short (tap), treat as selection
    if (touchDuration < 300 && this.onCellSelect) {
      this.triggerHapticFeedback('medium');
      this.onCellSelect(this.lastTouchCell);
    }
    
    this.lastTouchCell = null;
  }
  
  /**
   * Find the cell element from any child element
   */
  private findCellElement(element: Element): HTMLElement | null {
    let current: HTMLElement | null = element as HTMLElement;
    let depth = 0;
    
    while (current && depth < 5) {
      if (current.hasAttribute('data-row') && current.hasAttribute('data-col')) {
        return current;
      }
      current = current.parentElement;
      depth++;
    }
    
    return null;
  }
  
  /**
   * Trigger haptic feedback on supported devices
   */
  private triggerHapticFeedback(style: 'light' | 'medium' | 'heavy' = 'medium'): void {
    // Check if Haptic Feedback API is available (iOS Safari, some Android browsers)
    if ('vibrate' in navigator) {
      const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 30;
      navigator.vibrate(duration);
    }
    
    // iOS Haptic Feedback (requires specific API, not always available)
    // This is a fallback placeholder - actual implementation may require native integration
    if ((window as any).webkit?.messageHandlers?.hapticFeedback) {
      (window as any).webkit.messageHandlers.hapticFeedback.postMessage({ style });
    }
  }
}
