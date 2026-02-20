import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { NgxTableLayoutPickerComponent, TableSelection, ResponsiveService } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-responsive-demo',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    NgxTableLayoutPickerComponent
  ],
  templateUrl: './responsive-demo.component.html',
  styleUrl: './responsive-demo.component.scss'
})
export class ResponsiveDemoComponent {
  protected readonly selection = signal<TableSelection | null>(null);
  protected readonly responsiveService = inject(ResponsiveService);

  protected readonly currentBreakpoint = computed(() => {
    return this.responsiveService.currentBreakpoint().toUpperCase();
  });

  protected readonly isTouchDevice = computed(() => {
    return this.responsiveService.isTouchDevice();
  });

  protected readonly recommendedGridSize = computed(() => {
    const size = this.responsiveService.getRecommendedGridSize();
    return `${size.rows}×${size.cols}`;
  });

  protected onSelection(selection: TableSelection): void {
    this.selection.set(selection);
    console.log('Responsive selection:', selection);
  }
}
