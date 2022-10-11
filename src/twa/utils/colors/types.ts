/**
 * Color in format #RGB.
 */
export type RGBColor = string;

/**
 * Color in format #RRGGBB.
 */
export type RGBExtColor = string;

/**
 * Color in format #RRGGBBAA.
 */
export type RGBAColor = string;

/**
 * Color in format rgb(R, G, B).
 */
export type RGBCSSColor = string;

/**
 * Color in format rgba(R, G, B, A).
 */
export type RGBACSSColor = string;

/**
 * Any RGB color.
 */
export type AnyRGBColor = RGBColor | RGBAColor | RGBCSSColor | RGBACSSColor;