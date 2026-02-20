import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxTableLayoutPickerComponent, TableSelection } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-inline-demo',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgxTableLayoutPickerComponent
  ],
  templateUrl: './inline-demo.component.html',
  styleUrl: './inline-demo.component.scss'
})
export class InlineDemoComponent {
  protected readonly selection = signal<TableSelection | null>(null);

  protected onSelection(selection: TableSelection): void {
    this.selection.set(selection);
    console.log('Inline selection:', selection);
  }
}
