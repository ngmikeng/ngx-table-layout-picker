import { Injectable, signal, computed, effect } from '@angular/core';
import { ThemeMode } from '../models/theme.model';

/**
 * Centralized service for theme management
 * Handles theme detection and system preference monitoring
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Current theme mode
  private readonly _themeMode = signal<ThemeMode>('auto');
  public readonly themeMode = this._themeMode.asReadonly();
  
  // Resolved theme (light or dark, never auto)
  private readonly _resolvedTheme = signal<'light' | 'dark'>('light');
  public readonly resolvedTheme = this._resolvedTheme.asReadonly();
  
  // System preference
  private readonly _systemPreference = signal<'light' | 'dark'>('light');
  public readonly systemPreference = this._systemPreference.asReadonly();
  
  private mediaQuery?: MediaQueryList;
  
  constructor() {
    // Initialize media query listener
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.updateSystemPreference();
      this.mediaQuery.addEventListener('change', this.onMediaQueryChange);
    }
    
    // Effect to update resolved theme when mode or system preference changes
    effect(() => {
      const mode = this._themeMode();
      const system = this._systemPreference();
      
      if (mode === 'auto') {
        this._resolvedTheme.set(system);
      } else {
        this._resolvedTheme.set(mode);
      }
    });
  }
  
  /**
   * Set theme mode
   */
  setTheme(mode: ThemeMode): void {
    this._themeMode.set(mode);
    this.applyThemeToDocument();
  }
  
  /**
   * Toggle between light and dark
   */
  toggleTheme(): void {
    const current = this._resolvedTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }
  
  /**
   * Update system preference from media query
   */
  private updateSystemPreference(): void {
    if (!this.mediaQuery) return;
    const isDark = this.mediaQuery.matches;
    this._systemPreference.set(isDark ? 'dark' : 'light');
    
    // If in auto mode, update resolved theme
    if (this._themeMode() === 'auto') {
      this._resolvedTheme.set(isDark ? 'dark' : 'light');
    }
  }
  
  /**
   * Handle media query change
   */
  private readonly onMediaQueryChange = (): void => {
    this.updateSystemPreference();
  };
  
  /**
   * Apply theme to document root
   */
  private applyThemeToDocument(): void {
    const theme = this._resolvedTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  /**
   * Get theme colors for current theme
   */
  getThemeColors(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {};
    }
    
    const style = getComputedStyle(document.documentElement);
    return {
      background: style.getPropertyValue('--tls-background').trim(),
      text: style.getPropertyValue('--tls-text').trim(),
      border: style.getPropertyValue('--tls-border').trim(),
      borderHover: style.getPropertyValue('--tls-border-hover').trim(),
      cellActive: style.getPropertyValue('--tls-cell-active').trim(),
      focusColor: style.getPropertyValue('--tls-focus-color').trim(),
    };
  }
  
  /**
   * Cleanup
   */
  ngOnDestroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.onMediaQueryChange);
    }
  }
}
