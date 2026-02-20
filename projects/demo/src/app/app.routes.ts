import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'inline-demo',
    loadComponent: () => import('./pages/inline-demo/inline-demo.component').then(m => m.InlineDemoComponent)
  },
  {
    path: 'dropdown-demo',
    loadComponent: () => import('./pages/dropdown-demo/dropdown-demo.component').then(m => m.DropdownDemoComponent)
  },
  {
    path: 'responsive-demo',
    loadComponent: () => import('./pages/responsive-demo/responsive-demo.component').then(m => m.ResponsiveDemoComponent)
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs.component').then(m => m.DocsComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
