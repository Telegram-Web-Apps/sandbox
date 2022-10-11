import {SettableColorKey} from './types';

/**
 * Converts settable color key to key of ThemeParams.
 * @param key - key to convert.
 */
export function toThemeParamsKey(key: SettableColorKey): 'backgroundColor' | 'secondaryBackgroundColor' {
  if (key === 'bg_color') {
    return 'backgroundColor';
  }
  return 'secondaryBackgroundColor';
}