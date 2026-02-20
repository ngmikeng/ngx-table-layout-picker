import { ComponentFixture } from '@angular/core/testing';

/**
 * Test utility helpers for ngx-table-layout-picker tests
 * Provides common testing functions to reduce code duplication
 */
export class TestHelpers {
  /**
   * Get a cell element by its row and column position
   */
  static getCellElement(
    fixture: ComponentFixture<any>,
    row: number,
    col: number
  ): HTMLElement | null {
    return fixture.nativeElement.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
  }

  /**
   * Trigger a mouse event on an element
   */
  static triggerMouseEvent(
    element: HTMLElement,
    eventType: 'mouseenter' | 'mouseleave' | 'click' | 'mousemove'
  ): void {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }

  /**
   * Trigger a touch event on an element
   */
  static triggerTouchEvent(
    element: HTMLElement,
    eventType: 'touchstart' | 'touchmove' | 'touchend',
    touches: Array<{ clientX: number; clientY: number }>
  ): void {
    const touchList = touches.map((touch) => {
      return new Touch({
        identifier: Date.now(),
        target: element,
        clientX: touch.clientX,
        clientY: touch.clientY,
        pageX: touch.clientX,
        pageY: touch.clientY,
        screenX: touch.clientX,
        screenY: touch.clientY,
        radiusX: 10,
        radiusY: 10,
        rotationAngle: 0,
        force: 1
      });
    });

    const event = new TouchEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window,
      touches: touchList,
      targetTouches: touchList,
      changedTouches: touchList
    });
    element.dispatchEvent(event);
  }

  /**
   * Check if a cell has the active class
   */
  static isCellActive(
    fixture: ComponentFixture<any>,
    row: number,
    col: number
  ): boolean {
    const cell = TestHelpers.getCellElement(fixture, row, col);
    return cell?.classList.contains('active') ?? false;
  }

  /**
   * Check if a cell has the hovered class
   */
  static isCellHovered(
    fixture: ComponentFixture<any>,
    row: number,
    col: number
  ): boolean {
    const cell = TestHelpers.getCellElement(fixture, row, col);
    return cell?.classList.contains('hovered') ?? false;
  }

  /**
   * Get all active cells in the grid
   */
  static getAllActiveCells(fixture: ComponentFixture<any>): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.active'));
  }

  /**
   * Mock media query for theme testing
   */
  static mockMediaQuery(matches: boolean): MediaQueryList {
    return {
      matches,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => true
    } as MediaQueryList;
  }

  /**
   * Mock ResizeObserver for responsive testing
   */
  static mockResizeObserver(): void {
    if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
      (window as any).ResizeObserver = class ResizeObserver {
        constructor(callback: ResizeObserverCallback) {}
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
  }

  /**
   * Wait for a specified time (for async testing)
   */
  static wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Trigger multiple hover events in sequence
   */
  static async hoverSequence(
    fixture: ComponentFixture<any>,
    positions: Array<{ row: number; col: number }>,
    delayMs: number = 50
  ): Promise<void> {
    for (const pos of positions) {
      const cell = TestHelpers.getCellElement(fixture, pos.row, pos.col);
      if (cell) {
        TestHelpers.triggerMouseEvent(cell, 'mouseenter');
        fixture.detectChanges();
        await TestHelpers.wait(delayMs);
      }
    }
  }

  /**
   * Get the selection text from the footer
   */
  static getSelectionText(fixture: ComponentFixture<any>): string | null {
    const footer = fixture.nativeElement.querySelector('.tls-footer');
    return footer?.textContent?.trim() ?? null;
  }

  /**
   * Get computed style property value
   */
  static getComputedStyleProperty(
    element: HTMLElement,
    property: string
  ): string {
    return window.getComputedStyle(element).getPropertyValue(property);
  }

  /**
   * Get ARIA attribute value from element
   */
  static getAriaAttribute(
    element: HTMLElement,
    attribute: string
  ): string | null {
    return element.getAttribute(attribute);
  }

  /**
   * Count cells in a grid
   */
  static countCells(fixture: ComponentFixture<any>): number {
    const cells = fixture.nativeElement.querySelectorAll('[data-row][data-col]');
    return cells.length;
  }

  /**
   * Get grid dimensions from rendered cells
   */
  static getRenderedGridDimensions(fixture: ComponentFixture<any>): {
    rows: number;
    cols: number;
  } {
    const cells = fixture.nativeElement.querySelectorAll('[data-row][data-col]');
    let maxRow = 0;
    let maxCol = 0;

    cells.forEach((cell: HTMLElement) => {
      const row = parseInt(cell.getAttribute('data-row') ?? '0', 10);
      const col = parseInt(cell.getAttribute('data-col') ?? '0', 10);
      maxRow = Math.max(maxRow, row);
      maxCol = Math.max(maxCol, col);
    });

    return { rows: maxRow, cols: maxCol };
  }

  /**
   * Simulate keyboard navigation
   */
  static triggerKeyboardEvent(
    element: HTMLElement,
    key: string,
    eventType: 'keydown' | 'keyup' | 'keypress' = 'keydown'
  ): void {
    const event = new KeyboardEvent(eventType, {
      key,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }

  /**
   * Get current theme from data attribute
   */
  static getCurrentTheme(fixture: ComponentFixture<any>): string | null {
    return fixture.nativeElement.getAttribute('data-theme');
  }
}
