import {RGBExtColor} from '../../utils';

/**
 * WebApp version in format like "\d+.\d+".
 */
export type Version = string;

/**
 * Web App color keys which could be used to change header or background color.
 */
export type SettableColorKey = 'bg_color' | 'secondary_bg_color';

/**
 * Web App platform.
 * - `tdesktop` - Windows desktop.
 */
export type Platform = 'tdesktop' | string;

/**
 * Web App background color.
 */
export type WebAppBackgroundColor = SettableColorKey | RGBExtColor;
