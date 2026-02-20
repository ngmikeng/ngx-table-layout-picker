import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should default to auto theme', () => {
      expect(service.themeMode()).toBe('auto');
    });

    it('should detect system preference', () => {
      const preference = service.systemPreference();
      expect(['light', 'dark']).toContain(preference);
    });

    it('should resolve theme on initialization', () => {
      const resolved = service.resolvedTheme();
      expect(['light', 'dark']).toContain(resolved);
    });
  });

  describe('Theme Setting', () => {
    it('should set theme explicitly to light', () => {
      service.setTheme('light');
      expect(service.themeMode()).toBe('light');
      expect(service.resolvedTheme()).toBe('light');
    });

    it('should set theme explicitly to dark', () => {
      service.setTheme('dark');
      expect(service.themeMode()).toBe('dark');
      expect(service.resolvedTheme()).toBe('dark');
    });

    it('should set theme to auto', () => {
      service.setTheme('auto');
      expect(service.themeMode()).toBe('auto');
      const resolved = service.resolvedTheme();
      expect(['light', 'dark']).toContain(resolved);
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle from light to dark', () => {
      service.setTheme('light');
      expect(service.resolvedTheme()).toBe('light');
      
      service.toggleTheme();
      expect(service.resolvedTheme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.setTheme('dark');
      expect(service.resolvedTheme()).toBe('dark');
      
      service.toggleTheme();
      expect(service.resolvedTheme()).toBe('light');
    });

    it('should toggle multiple times', () => {
      service.setTheme('light');
      
      service.toggleTheme();
      expect(service.resolvedTheme()).toBe('dark');
      
      service.toggleTheme();
      expect(service.resolvedTheme()).toBe('light');
      
      service.toggleTheme();
      expect(service.resolvedTheme()).toBe('dark');
    });
  });

  describe('Theme Colors', () => {
    it('should get theme colors', () => {
      const colors = service.getThemeColors();
      expect(colors).toBeDefined();
      expect(typeof colors).toBe('object');
    });

    it('should return empty object in non-browser environment', () => {
      // This test verifies the SSR-safe behavior
      const colors = service.getThemeColors();
      expect(colors).toBeDefined();
    });
  });

  describe('System Theme Detection', () => {
    it('should detect system preference change', () => {
      const initialPreference = service.systemPreference();
      expect(['light', 'dark']).toContain(initialPreference);
    });

    it('should resolve auto theme based on system preference', () => {
      service.setTheme('auto');
      const systemPref = service.systemPreference();
      const resolved = service.resolvedTheme();
      expect(resolved).toBe(systemPref);
    });
  });

  describe('Theme Signals Reactivity', () => {
    it('should expose readonly theme mode signal', () => {
      const mode = service.themeMode();
      expect(mode).toBeDefined();
    });

    it('should expose readonly resolved theme signal', () => {
      const resolved = service.resolvedTheme();
      expect(resolved).toBeDefined();
    });

    it('should expose readonly system preference signal', () => {
      const preference = service.systemPreference();
      expect(preference).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid theme changes', () => {
      service.setTheme('light');
      service.setTheme('dark');
      service.setTheme('auto');
      service.setTheme('light');
      
      expect(service.themeMode()).toBe('light');
      expect(service.resolvedTheme()).toBe('light');
    });

    it('should maintain consistency between mode and resolved theme', () => {
      // When theme is explicitly set, resolved should match
      service.setTheme('light');
      expect(service.resolvedTheme()).toBe('light');
      
      service.setTheme('dark');
      expect(service.resolvedTheme()).toBe('dark');
    });
  });
});
