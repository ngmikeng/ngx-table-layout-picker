import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResponsiveService, ThemeService } from 'ngx-table-layout-picker';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'NGX Table Layout Picker';
  protected readonly darkMode = signal(false);
  protected readonly sidenavOpened = signal(true);
  
  protected readonly navItems: NavItem[] = [
    { label: 'Home', route: '/home', icon: 'home' },
    { label: 'Inline Demo', route: '/inline-demo', icon: 'table_view' },
    { label: 'Dropdown Demo', route: '/dropdown-demo', icon: 'arrow_drop_down_circle' },
    { label: 'Responsive Demo', route: '/responsive-demo', icon: 'devices' },
    { label: 'Documentation', route: '/docs', icon: 'book' }
  ];
  
  constructor(
    protected readonly router: Router,
    protected readonly responsiveService: ResponsiveService,
    protected readonly themeService: ThemeService
  ) {}
  
  // Computed property to check if mobile
  protected readonly isMobile = computed(() => {
    return this.responsiveService.currentBreakpoint() === 'mobile';
  });

  protected toggleDarkMode(): void {
    this.darkMode.update(v => !v);
    this.themeService.setTheme(this.darkMode() ? 'dark' : 'light');
  }

  protected toggleSidenav(): void {
    this.sidenavOpened.update(v => !v);
  }

  protected isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  protected onNavItemClick(): void {
    // Close sidenav on mobile after navigation
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }
}
