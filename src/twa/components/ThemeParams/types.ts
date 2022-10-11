import {RGBExtColor} from '../../utils';

/**
 * Describes theme parameters which are passed to WebApp.
 * @see https://core.telegram.org/bots/webapps#themeparams
 */
export interface ThemeParams {
  backgroundColor?: RGBExtColor;
  buttonColor?: RGBExtColor;
  buttonTextColor?: RGBExtColor;
  hintColor?: RGBExtColor;
  linkColor?: RGBExtColor;
  secondaryBackgroundColor?: RGBExtColor;
  textColor?: RGBExtColor;
}

/**
 * Color scheme.
 */
export type ColorScheme = 'dark' | 'light';