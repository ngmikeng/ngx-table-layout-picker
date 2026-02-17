/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Theme color configuration
 */
export interface ThemeColors {
  /** Background color */
  background: string;
  /** Text color */
  text: string;
  /** Cell border color */
  border: string;
  /** Cell border color on hover */
  borderHover: string;
  /** Cell background color on hover */
  cellHover: string;
  /** Cell background color when active */
  cellActive: string;
}
