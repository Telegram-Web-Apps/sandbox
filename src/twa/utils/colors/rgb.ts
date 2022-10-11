import {RGBExtColor} from './types';

/**
 * Return true in case, passed value is RGBColor.
 * @param value - value to check.
 */
export function isRGB(value: string): boolean {
  return /^#[\da-f]{3}$/i.test(value);
}

/**
 * Return true in case, passed value is RGBExtColor.
 * @param value - value to check.
 */
export function isRGBExt(value: string): boolean {
  return /^#[\da-f]{6}$/i.test(value);
}

/**
 * Converts passed value to #RRGGBB format.
 * @param value - value to convert.
 * @throws {SyntaxError} Passed value does not contain any of known RGB formats.
 * @see isRGBExt
 * @see isRGB
 */
export function toRGBExt(value: string): RGBExtColor {
  // Remove all spaces.
  const clean = value.replace(/\s/g, '');

  // Color is already in required format:
  // #RRGGBB
  if (isRGBExt(clean)) {
    return clean;
  }

  // Convert RGB to RRGGBB:
  // #RGB
  if (isRGB(clean)) {
    let color: RGBExtColor = '#';

    for (let i = 0; i < 3; i++) {
      color += clean[1 + i].repeat(2);
    }
    return color;
  }

  // Check if it is RGBCSSColor:
  // rgb(0,3,10)
  let match = clean.match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/);

  // No matches, replace current match with another pattern.
  // rgba(32,114,8,0)
  if (match === null) {
    match = clean.match(/^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),\d{1,3}\)$/)
  }

  // In case, this didn't work as well, we can't extract RGB color from passed
  // text.
  if (match === null) {
    throw new SyntaxError(`Value "${value}" does not match any of known RGB formats.`);
  }

  // Otherwise, take R, G and B components, convert to hex and create #RGB
  // string.
  return match.slice(1).reduce((acc, component) => {
    const formatted = parseInt(component).toString(16);
    return acc + (formatted.length === 1 ? '0' : '') + formatted;
  }, '#');
}