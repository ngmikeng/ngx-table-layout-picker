import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxTableLayoutPickerDropdownComponent, TableSelection } from 'ngx-table-layout-picker';

@Component({
  selector: 'app-dropdown-demo',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgxTableLayoutPickerDropdownComponent
  ],
  templateUrl: './dropdown-demo.component.html',
  styleUrl: './dropdown-demo.component.scss'
})
export class DropdownDemoComponent {
  protected readonly selection = signal<TableSelection | null>(null);

  protected onSelection(selection: TableSelection): void {
    this.selection.set(selection);
    console.log('Dropdown selection:', selection);
  }
}
