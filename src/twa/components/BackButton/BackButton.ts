import {WebApp} from '../WebApp';
import {WebView} from '../WebView';
import {EventEmitter} from '../../lib';
import {BackButtonEventListener, BackButtonEventsMap} from './events';

const ee = new EventEmitter<BackButtonEventsMap>();

/**
 * Class which controls the back button, which can be displayed in the header
 * of the Web App in the Telegram interface.
 *
 * TODO: Component requires event which states, button was hidden of shown
 *  from outside.
 *
 * TODO: BackButton works explicitly in case, modal is not expanded. It means,
 *  when you call show(), it looks like nothing happens, but in case, you
 *  expand a Web App modal, back button shows up.
 */
export class BackButton {
  private static ee = ee;
  private static _isVisible = false;

  /**
   * Updates current visibility state.
   *
   * @since WebApp version 6.1+
   * @private
   */
  private static set isVisible(visible: boolean) {
    if (this._isVisible === visible) {
      return;
    }
    WebApp.requireVersion('6.1');
    WebView.postEvent('web_app_setup_back_button', {is_visible: visible});
    this._isVisible = visible;
    this.ee.emit('visibleChange', visible);
  }

  /**
   * Hides the button.
   */
  static hide = () => {
    this.isVisible = false;
  };

  /**
   * Shows whether the button is visible.
   */
  static get isVisible() {
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
      return WebView.on('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }
    this.ee.on(event, listener);
  };

  /**
   * Adds new listener to button click event. Passed listener will be called
   * when user presses back button.
   *
   * @param listener - event listener.
   * @deprecated use `on` method.
   */
  static onClick(listener: BackButtonEventListener<'click'>) {
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
      return WebView.off('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }
    this.ee.off(event, listener);
  };

  /**
   * Removes listener from button click event.
   *
   * @param listener - event listener.
   * @deprecated use `off` method.
   */
  static offClick(listener: BackButtonEventListener<'click'>) {
    this.off('click', listener);
  }

  /**
   * Shows the button.
   */
  static show = () => {
    this.isVisible = true;
  };
}

