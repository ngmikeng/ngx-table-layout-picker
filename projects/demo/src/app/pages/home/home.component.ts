import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly features = [
    {
      icon: 'table_view',
      title: 'Inline Mode',
      description: 'Direct component usage for seamless integration',
      route: '/inline-demo'
    },
    {
      icon: 'arrow_drop_down_circle',
      title: 'Dropdown Mode',
      description: 'Material Menu integration with customizable buttons',
      route: '/dropdown-demo'
    },
    {
      icon: 'devices',
      title: 'Responsive Design',
      description: 'Adaptive grid sizing for all screen sizes',
      route: '/responsive-demo'
    },
    {
      icon: 'book',
      title: 'Documentation',
      description: 'Comprehensive usage guide and API reference',
      route: '/docs'
    }
  ];

  protected readonly keyFeatures = [
    'Standalone components (Angular 17+)',
    'Signal-based state management',
    'Light & dark theme support',
    'Responsive design',
    'Full keyboard navigation',
    'ARIA accessibility',
    'Angular Material integration',
    'Customizable styling',
    'Touch handling with haptic feedback',
    'iOS safe area support'
  ];
}
