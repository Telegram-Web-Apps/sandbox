/**
 * Object, created by Telegram desktop application. It allows usage of events.
 */
interface TelegramWebviewProxy {
  postEvent(event: string, data: string): void;
}

/**
 * TODO: Add description.
 */
interface WindowExternal {
  notify(search: string): void;
}

/**
 * Describes extracted event data from its text presentation.
 */
export interface EventData {
  /**
   * Event name.
   */
  type: string;

  /**
   * Event data.
   */
  data: string;
}

/**
 * Returns true, in case passed value contains object, created by Telegram
 * desktop application for communication via events.
 *
 * @param val - value to check.
 * @see TelegramWebviewProxy
 */
export function isDesktopEnv<T>(val: T): val is (T & { TelegramWebviewProxy: TelegramWebviewProxy }) {
  return (val as any).TelegramWebviewProxy !== undefined;
}

/**
 * States that passed value has "external" which could notify native device.
 * TODO: We dont know that is "external" and "notify". This code was taken from
 *  previous source code.
 *
 * @param val - value to check.
 * @see WindowExternal
 */
export function hasExternal<T>(val: T): val is (T & { external: WindowExternal }) {
  return 'external' in window && typeof (window.external as any).notify === 'function';
}

/**
 * Returns true in case, current environment is iframe.
 * @see https://stackoverflow.com/a/326076
 */
export function isIframeEnv(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
