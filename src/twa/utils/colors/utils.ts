import {RGBColor, RGBExtColor} from './types';
import {toRGBExt} from './rgb';

/**
 * Returns true in case, color is recognized as dark.
 * @param color - color in format #RGB or #RRGGBB.
 * @throws {Error} Color has incorrect format.
 */
export function isColorDark(color: RGBColor | RGBExtColor): boolean {
  if (color.length === 4) {
    color = toRGBExt(color);
  }
  // hsp = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b)
  const hsp = Math.sqrt(
    new Array(3).fill(null).reduce<number>((acc, _, idx) => {
      const num = parseInt(color.slice(1 + idx * 2, 1 + (idx + 1) * 2), 16);
      const modifier = idx === 0
        ? 0.299
        : idx === 1
          ? 0.587
          : 0.114;

      return acc + num * num * modifier;
    }, 0),
  );

  // TODO: 120 is magic. Add description.
  return hsp < 120;
}
