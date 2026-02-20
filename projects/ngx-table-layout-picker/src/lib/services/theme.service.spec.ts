import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

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

  it('should resolve theme', () => {
    const resolved = service.resolvedTheme();
    expect(['light', 'dark']).toContain(resolved);
  });

  it('should set theme explicitly', () => {
    service.setTheme('dark');
    expect(service.themeMode()).toBe('dark');
    expect(service.resolvedTheme()).toBe('dark');
  });

  it('should toggle between light and dark', () => {
    service.setTheme('light');
    expect(service.resolvedTheme()).toBe('light');
    
    service.toggleTheme();
    expect(service.resolvedTheme()).toBe('dark');
    
    service.toggleTheme();
    expect(service.resolvedTheme()).toBe('light');
  });

  it('should get theme colors', () => {
    const colors = service.getThemeColors();
    expect(colors).toBeDefined();
  });
});
