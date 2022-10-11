import {
  Platform,
  SettableColorKey,
  Version,
  WebAppBackgroundColor,
} from './types';
import {isIframeEnv, WebView} from '../WebView';
import {formatURL, toRGBExt, RGBExtColor} from '../../utils';
import {ThemeParams} from '../ThemeParams';
import {toThemeParamsKey} from './utils';
import {EventEmitter} from '../../lib';
import {WebAppEventsMap} from './events';

/**
 * Provides functionality which is recognized as common for Web Apps. In other
 * words, this class mostly contains utilities.
 */
export class WebApp {
  private static _isClosingConfirmationEnabled = false;
  private static _headerColor: SettableColorKey = 'bg_color';
  private static _backgroundColor: WebAppBackgroundColor = 'bg_color';
  private static ee = new EventEmitter<WebAppEventsMap>();

  /**
   * Updates current closing confirmation enable status.
   *
   * @param value - new closing confirmation status.
   * @private
   */
  private static set isClosingConfirmationEnabled(value: boolean) {
    if (this._isClosingConfirmationEnabled === value) {
      return;
    }
    this.requireVersion('6.2');

    // Update current value.
    this._isClosingConfirmationEnabled = value;

    // Send request to native app.
    WebView.postEvent('web_app_setup_closing_behavior', {
      need_confirmation: value,
    });

    // Emit event.
    this.ee.emit('closingConfirmationChange', value);
  }

  /**
   * Current native application background color.
   */
  static get backgroundColor(): RGBExtColor | undefined {
    return this._backgroundColor === 'bg_color' || this._backgroundColor === 'secondary_bg_color'
      ? ThemeParams[toThemeParamsKey(this._backgroundColor)]
      : this._backgroundColor;
  }

  /**
   * Closes the Web App.
   */
  static close = (): void => WebView.postEvent('web_app_close');

  /**
   * Disables the confirmation dialog while the user is trying to close the
   * Web App.
   */
  static disableClosingConfirmation = (): void => {
    this.isClosingConfirmationEnabled = false;
  }

  /**
   * Enables the confirmation dialog while the user is trying to close the
   * Web App.
   */
  static enableClosingConfirmation = (): void => {
    this.isClosingConfirmationEnabled = true;
  }

  /**
   * Current native application header color.
   */
  static get headerColor(): SettableColorKey | undefined {
    return this._headerColor;
  }

  /**
   * Returns true in case, current Web App platform is desktop.
   */
  static isDesktop = (): boolean => this.platform === 'tdesktop';

  /**
   * `true`, if the confirmation dialog enabled while the user is trying to
   * close the Web App.
   */
  static get isClosingConfirmationEnabled(): boolean {
    return this._isClosingConfirmationEnabled;
  }

  /**
   * Return `true` in case, passed version is more than or equal to current
   * Web App version.
   *
   * @param version - compared version.
   */
  static isVersionAtLeast = (version: Version): boolean => {
    // TODO: Should we check if current version and compared version has
    //  incorrect format (symbols)?
    // Split both of the version by dot.
    const aParts = this.version.split('.');
    const bParts = version.split('.');

    // Compute maximum length.
    const len = Math.max(aParts.length, bParts.length);

    // Iterate over each part of version and compare them. In case, part is
    // missing, assume its value is equal to 0.
    for (let i = 0; i < len; i++) {
      const aVal = parseInt(aParts[i] || '0');
      const bVal = parseInt(bParts[i] || '0');

      if (aVal === bVal) {
        continue;
      }
      return aVal > bVal;
    }
    return true;
  }

  /**
   * Opens a link in an external browser. The Web App will not be closed.
   *
   * Note that this method can be called only in response to the user
   * interaction with the Web App interface (e.g. click inside the Web App
   * or on the main button).
   *
   * @param url - URL to be opened.
   */
  static openLink = (url: string): void => {
    const formattedURL = formatURL(url);

    // In case, current version is 6.1+, open link with special native
    // application event.
    // TODO: No mention about version in docs.
    if (this.isVersionAtLeast('6.1')) {
      return WebView.postEvent('web_app_open_link', {url: formattedURL});
    }
    // Otherwise, do it in legacy way.
    window.open(formattedURL, '_blank');
  }

  /**
   * Opens a telegram link inside Telegram app. The Web App will be closed.
   *
   * @param url - URL to be opened.
   * @throws {Error} URL has not allowed hostname.
   * @since WebApp version 6.1+
   */
  static openTelegramLink = (url: string): void => {
    const {hostname, pathname, search} = new URL(formatURL(url));

    // We allow opening links with the only 1 hostname.
    if (hostname !== 't.me') {
      throw new Error(
        `URL has not allowed hostname: ${hostname}. Only "t.me" is allowed`,
      );
    }

    // In case, current version is 6.1+ or we are currently in iframe, open
    // link with special native application event.
    // TODO: Is it correct that calling of this method is allowed in case
    //  it is iframe or v6.1+? Code was taken from source, but no mention in
    //  docs.
    if (isIframeEnv() || this.isVersionAtLeast('6.1')) {
      return WebView.postEvent('web_app_open_tg_link', {
        url: pathname + search,
      });
    }
    // Otherwise, do it in legacy way.
    window.location.href = url;
  }

  /**
   * TODO: Check docs.
   * FIXME: Implement
   * Opens an invoice using the link url.
   *
   * @since Bot API 6.1+
   * @param url
   */
  static openInvoice = (url: string): void => {
    throw new Error('not implemented');
  }

  /**
   * Adds new event listener.
   */
  static on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  static off = this.ee.off.bind(this.ee);

  /**
   * Current Web App platform.
   */
  static platform: Platform = 'unknown';

  /**
   * Informs the Telegram app that the Web App is ready to be displayed.
   *
   * It is recommended to call this method as early as possible, as soon as
   * all essential interface elements loaded. Once this method called,
   * the loading placeholder is hidden and the Web App shown.
   *
   * If the method not called, the placeholder will be hidden only when
   * the page fully loaded.
   */
  static ready = (): void => WebView.postEvent('web_app_ready');

  /**
   * Checks if current version satisfies minimum (passed) version.
   *
   * @param version - version number.
   * @throws {Error} Version of Web App does not support this method.
   */
  static requireVersion = (version: Version): void => {
    if (!this.isVersionAtLeast(version)) {
      throw new Error(`Version "${version}" of WebApp does not support this method.`);
    }
  }

  /**
   * A method used to send data to the bot. When this method called, a
   * service message sent to the bot containing the data of the
   * length up to 4096 bytes, and the Web App closed. See the field
   * `web_app_data` in the class Message.
   *
   * This method is only available for Web Apps launched via a Keyboard button.
   *
   * @param data - data to send to bot.
   * @throws {Error} data has incorrect size.
   */
  static sendData = (data: string): void => {
    // Firstly, compute passed text size in bytes.
    const size = new Blob([data]).size;
    if (size === 0 || size > 4096) {
      throw new Error(`Passed data has incorrect size: ${size}`);
    }
    WebView.postEvent('web_app_data_send', {data});
  }

  /**
   * Updates current application background color.
   * FIXME: Has no effect on desktop.
   *
   * @param color - settable color key or color description in known RGB
   * format.
   * @since WebApp version 6.1+
   */
  static setBackgroundColor = (color: WebAppBackgroundColor): void => {
    this.requireVersion('6.1');

    // In case, passed color has some RGB format, we should convert it
    // to #RGB.
    if (color !== 'bg_color' && color !== 'secondary_bg_color') {
      // Convert passed value to expected #RRGGBB format.
      color = toRGBExt(color);
    }

    // Don't do anything in case, color is the same.
    if (this._backgroundColor === color) {
      return;
    }

    // Override current background color key.
    this._backgroundColor = color;

    // Notify native application about updating current background color.
    WebView.postEvent('web_app_set_background_color', {color});

    // Emit event.
    this.ee.emit('backgroundColorChange', color);
  }

  /**
   * Updates current application header color.
   * FIXME: Has no effect on desktop. Works incorrectly on Android, color
   *  applies only after dragging application modal.
   *
   * @param color - settable color key.
   * @since WebApp version 6.1+
   */
  static setHeaderColor = (color: SettableColorKey): void => {
    this.requireVersion('6.1');

    // Don't do anything in case, color is the same.
    if (this._headerColor === color) {
      return;
    }

    // Override current header color key.
    this._headerColor = color;

    // Notify native application about updating current header color.
    WebView.postEvent('web_app_set_header_color', {color_key: color});

    // Emit event.
    this.ee.emit('headerColorChange', color);
  }

  /**
   * Current Web App version.
   */
  static version = '6.0';
}