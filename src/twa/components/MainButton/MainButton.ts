import {RequestThemeInfo, WebView} from '../WebView';
import {RGBExtColor} from '../../utils';
import {EventEmitter} from '../../lib';
import {MainButtonEventListener, MainButtonEventsMap} from './events';

const ee = new EventEmitter<MainButtonEventsMap>();

/**
 * Controls the main button, which is displayed at the bottom
 * of the Web App in the Telegram interface.
 *
 * TODO: Desktop animation is rather bad in case, we call progress visibility
 *  right after click. It is not smooth.
 *
 * TODO: We need event to get current main button state.
 */
export class MainButton {
  private static _color: RGBExtColor = '#2481cc';
  private static _textColor: RGBExtColor = '#ffffff';
  private static _isActive = true;
  private static _isVisible = false;
  private static _isProgressVisible = false;
  private static _text = 'CONTINUE';
  private static ee = ee;

  /**
   * Sends current button state to native app.
   * @private
   */
  private static commit(): void {
    WebView.postEvent('web_app_setup_main_button', {
      is_visible: this.isVisible,
      is_active: this.isActive,
      is_progress_visible: this.isProgressVisible,
      text: this.text,
      color: this.color,
      text_color: this.textColor,
    });
  }

  /**
   * Updates current button color.
   *
   * @param color - color to set.
   * @private
   */
  private static set color(color: RGBExtColor) {
    // FIXME: Check color.
    if (this._color === color) {
      return;
    }
    this._color = color;
    this.commit();
    this.ee.emit('colorChange', this._color);
  }

  /**
   * Updates current button activity state.
   *
   * @param active - should button be active.
   * @private
   */
  private static set isActive(active: boolean) {
    if (this._isActive === active) {
      return;
    }
    this._isActive = active;
    this.commit();
    this.ee.emit('activeChange', this._isActive);
  }

  /**
   * Updates current progress visibility state.
   *
   * @param visible - should progress be visible.
   * @private
   */
  private static set isProgressVisible(visible: boolean) {
    if (this._isProgressVisible === visible) {
      return;
    }
    this._isProgressVisible = visible;
    this.commit();
    this.ee.emit('progressVisibleChange', this._isProgressVisible);
  }

  /**
   * Updates current button visibility state.
   *
   * @param visible - should button be visible.
   * @private
   */
  private static set isVisible(visible: boolean) {
    if (this._isVisible === visible) {
      return;
    }
    this._isVisible = visible;
    this.commit();
    this.ee.emit('visibleChange', this._isVisible);
  }

  /**
   * Sets current button text. Note, that minimum text length is 1 symbols
   * and the maximum is 64.
   *
   * @param text - text to set.
   * @throws {Error} Text has incorrect length.
   */
  private static set text(text: string) {
    const trimmed = text.trim();

    if (trimmed.length === 0 || trimmed.length > 64) {
      throw new Error(`Text has incorrect length: ${trimmed.length}`);
    }
    if (this._text === trimmed) {
      return;
    }
    this._text = trimmed;
    this.commit();
    this.ee.emit('textChange', this._text);
  }

  /**
   * Updates current button text color.
   * @param color - target color.
   */
  private static set textColor(color: RGBExtColor) {
    // FIXME: Check color.
    if (this._textColor === color) {
      return;
    }
    this._textColor = color;
    this.commit();
    this.ee.emit('textColorChange', this._textColor);
  }

  /**
   * Applies passed theme parameters.
   * @param theme - theme to apply.
   * @internal
   */
  static applyThemeInfo = (theme: RequestThemeInfo) => {
    const {
      buttonColor = this.color,
      buttonTextColor = this.textColor,
    } = theme.params;
    this._color = buttonColor;
    this._textColor = buttonTextColor;
  };

  /**
   * Current button color.
   */
  static get color(): RGBExtColor {
    return this._color;
  }

  /**
   * Disables button.
   * FIXME: This method does not work on Android. Event "main_button_pressed"
   *  keeps getting received even in case, button is disabled.
   */
  static disable = (): typeof MainButton => {
    this.isActive = false;
    return this;
  };

  /**
   * Enables button.
   */
  static enable = (): typeof MainButton => {
    this.isActive = true;
    return this;
  };

  /**
   * Hides button.
   */
  static hide = (): typeof MainButton => {
    this.isVisible = false;
    return this;
  };

  /**
   * Hides button progress.
   */
  static hideProgress = (): typeof MainButton => {
    this.isProgressVisible = false;
    return this;
  };

  /**
   * Shows whether the button is active.
   */
  static get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Shows whether the button is displaying a loading indicator.
   */
  static get isProgressVisible(): boolean {
    return this._isProgressVisible;
  }

  /**
   * Shows whether the button is visible.
   */
  static get isVisible(): boolean {
    return this._isVisible;
  }

  /**
   * Adds new event listener.
   *
   * @param event - event name.
   * @param listener - event listener.
   */
  static on: typeof ee['on'] = (event, listener) => {
    // 'click' event is custom and listened by WebView.
    if (event === 'click') {
      return WebView.on('main_button_pressed', listener as MainButtonEventListener<'click'>);
    }
    this.ee.on(event, listener);
  };

  /**
   * Adds listener which will be called in case, main button was clicked.
   *
   * @param listener - event listener.
   * @deprecated Use `on` function.
   */
  static onClick(listener: MainButtonEventListener<'click'>) {
    this.on('click', listener);
  }

  /**
   * Removes event listener.
   *
   * @param event - event name.
   * @param listener - event listener.
   */
  static off: typeof ee['off'] = (event, listener) => {
    // 'click' event is custom and listened by WebView.
    if (event === 'click') {
      return WebView.off('main_button_pressed', listener as MainButtonEventListener<'click'>);
    }
    this.ee.off(event, listener);
  };

  /**
   * Removes onclick event listener.
   *
   * @param listener - listener to call.
   * @deprecated Use `off` function.
   */
  static offClick(listener: MainButtonEventListener<'click'>) {
    this.off('click', listener);
  }

  /**
   * Shows the button. Note that opening the Web App from the attachment
   * menu hides the main button until the user interacts with the Web App
   * interface.
   */
  static show = (): typeof MainButton => {
    this.isVisible = true;
    return this;
  };

  /**
   * A method to show a loading indicator on the button.
   * It is recommended to display loading progress if the action tied to the
   * button may take a long time.
   */
  static showProgress = (): typeof MainButton => {
    this.isProgressVisible = true;
    return this;
  };

  /**
   * Sets new main button text.
   * @param text - new text.
   */
  static setText = (text: string): typeof MainButton => {
    this.text = text;
    return this;
  }

  /**
   * Sets new main button text color.
   * @param color - new text color.
   */
  static setTextColor = (color: RGBExtColor): typeof MainButton => {
    this.textColor = color;
    return this;
  }

  /**
   * Updates current button color.
   * @param color - color to set.
   */
  static setColor = (color: RGBExtColor): typeof MainButton => {
    this.color = color;
    return this;
  }

  /**
   * Current button text.
   */
  static get text(): string {
    return this._text;
  }

  /**
   * Current button text color.
   */
  static get textColor(): RGBExtColor {
    return this._textColor;
  }
}