import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/**
 * Internal component for displaying selection information
 * Not exported in public API
 */
@Component({
  selector: 'lib-table-footer',
  standalone: true,
  template: `
    <div class="tls-footer" [class.visible]="visible">
      <span>{{ selectionText || '0 × 0' }}</span>
    </div>
  `,
  styleUrls: ['./table-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFooterComponent {
  /** Text showing current selection (e.g., "5 × 7") */
  @Input() selectionText = '';
  
  /** Whether the footer should be visible */
  @Input() visible = false;
}
