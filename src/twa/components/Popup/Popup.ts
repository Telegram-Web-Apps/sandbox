import {PopupParams} from './types';
import {WebView} from '../WebView';
import {WebApp} from '../WebApp';
import {EventEmitter} from '../../lib';
import {PopupEventsMap} from './events';
import {preparePopupParams} from './utils';

const ee = new EventEmitter<PopupEventsMap>();

/**
 * Controls currently displayed application popup. It allows developers to
 * open new custom popups and detect popup-connected events.
 */
export class Popup {
  private static ee = ee;
  static _isOpened = false;

  /**
   * Changes current open state.
   *
   * @param value - new open state.
   * @private
   */
  private static set isOpened(value: boolean) {
    if (this._isOpened === value) {
      return;
    }
    this._isOpened = value;
    this.ee.emit('openChange', this._isOpened);
  }

  /**
   * Shows whether popup is currently opened.
   */
  static get isOpened(): boolean {
    return this._isOpened;
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
   * A method that shows a native popup described by the `params` argument.
   * Promise will be resolved when popup is closed. Resolved value will have
   * an identifier of pressed button.
   *
   * In case, user clicked outside the popup or clicked top right popup close
   * button, `null` will be returned.
   *
   * FIXME: On desktop, you have to wait for about 1 or 2 seconds before
   *  calling this function again. Otherwise, nothing will happen.
   *  On iOS there is a critical bug when user clicks outside of popup, event
   *  `popup_closed` will not be sent.
   *
   * @param params - popup parameters.
   * @since WebApp version 6.2+
   * @see preparePopupParams
   * @throws {Error} Popup is already opened.
   */
  static show(params: PopupParams): Promise<string | null> {
    WebApp.requireVersion('6.2');

    // Don't allow opening several popups.
    if (this._isOpened) {
      throw new Error('Popup is already opened.');
    }

    // Format all required parameters.
    const preparedParams = preparePopupParams(params);

    // Create promise which will be returned to receive clicked popup button
    // identifier.
    const promise = new Promise<string | null>(res => {
      const listener = (buttonId: string | undefined) => {
        // Remove event listener.
        WebView.off('popup_closed', listener);

        // Update popup opened flag.
        this.isOpened = false;

        // Resolve promise.
        res(buttonId === undefined ? null : buttonId);

        // Emit close event.
        this.ee.emit('close', buttonId);
      };

      // Add listener to detect popup close.
      WebView.on('popup_closed', listener);

      // Notify native app we need to open popup.
      WebView.postEvent('web_app_open_popup', preparedParams);
    });

    // Update popup opened status.
    this.isOpened = true;

    // Emit open event.
    this.ee.emit('open', preparedParams);

    return promise;
  }

  /**
   * A method that shows message in a simple alert with a 'Close' button.
   * Promise will be resolved when popup is closed.
   *
   * @param message - message to display.
   * @since WebApp version 6.2+
   * @see show
   */
  static async showAlert(message: string): Promise<void> {
    await this.show({message, buttons: [{type: 'close'}]});
  }

  /**
   * A method that shows message in a simple confirmation window with `OK`
   * and `Cancel` buttons. Promise will be resolved when popup is closed.
   * Resolved value will be `true` in case, user pressed `OK` button. The
   * result will be `false` otherwise.
   *
   * @param message - message to display.
   * @since WebApp version 6.2+
   * @see show
   */
  static showConfirm(message: string): Promise<boolean> {
    return this
      .show({
        message,
        buttons: [{type: 'ok', id: 'ok'}, {id: 'cancel', type: 'cancel'}],
      })
      .then(id => id === 'ok');
  }
}
