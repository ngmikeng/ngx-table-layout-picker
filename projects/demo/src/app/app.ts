import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  NgxTableLayoutPickerComponent,
  NgxTableLayoutPickerDropdownComponent,
  TableSelection
} from 'ngx-table-layout-picker';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    NgxTableLayoutPickerComponent,
    NgxTableLayoutPickerDropdownComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'NGX Table Layout Picker Demo';
  protected readonly darkMode = signal(false);
  protected readonly lastSelection = signal<TableSelection | null>(null);
  protected readonly inlineSelection = signal<TableSelection | null>(null);
  protected readonly dropdownSelection = signal<TableSelection | null>(null);

  protected toggleDarkMode(): void {
    this.darkMode.update(v => !v);
  }

  protected onInlineSelection(selection: TableSelection): void {
    this.inlineSelection.set(selection);
    this.lastSelection.set(selection);
    console.log('Inline selection:', selection);
  }

  protected onDropdownSelection(selection: TableSelection): void {
    this.dropdownSelection.set(selection);
    this.lastSelection.set(selection);
    console.log('Dropdown selection:', selection);
  }
}
