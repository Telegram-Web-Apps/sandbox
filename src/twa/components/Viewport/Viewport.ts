import {RequestViewportInfo, WebView} from '../WebView';
import {EventEmitter} from '../../lib';
import {ViewportEventsMap} from './events';

/**
 * Contains information about current WebApp device viewport, its dimensions
 * and state.
 */
export class Viewport {
  private static _height = 0;
  private static _stableHeight = 0;
  private static _isExpanded = false;
  private static ee = new EventEmitter<ViewportEventsMap>();

  /**
   * Updates current viewport height.
   *
   * @param value - new height.
   * @private
   */
  private static set height(value: number) {
    if (this._height === value) {
      return;
    }
    this._height = value;
    this.ee.emit('heightChange', value);
  }

  /**
   * Updates current viewport stable height.
   *
   * @param value - new stable height.
   * @private
   */
  private static set stableHeight(value: number) {
    if (this._stableHeight === value) {
      return;
    }
    this._stableHeight = value;
    this.ee.emit('stableHeightChange', value);
  }

  /**
   * Updates current viewport expansion status.
   *
   * @param value - new expansion status.
   * @private
   */
  private static set isExpanded(value: boolean) {
    if (this._isExpanded === value) {
      return;
    }
    this._isExpanded = value;
    this.ee.emit('expansionChange', value);
  }

  /**
   * Applies new viewport information.
   *
   * @param info - viewport information.
   * @internal
   */
  static applyViewportInfo = (info: RequestViewportInfo) => {
    const {isExpanded, height, isStateStable} = info;

    // Reassign current viewport information.
    this.height = height;
    this.isExpanded = isExpanded;

    if (isStateStable) {
      this.stableHeight = height;
    }
  };

  /**
   * A method that expands the Web App to the maximum available height. To
   * find out if the Web App is expanded to the maximum height, refer to the
   * value of the `isExpanded`.
   *
   * @see isExpanded
   */
  static expand = (): void => WebView.postEvent('web_app_expand')

  /**
   * The current height of the visible area of the Web App.
   *
   * The application can display just the top part of the Web App, with its
   * lower part remaining outside the screen area. From this position, the
   * user can "pull" the Web App to its maximum height, while the bot can do
   * the same by calling `expand` method. As the position of the Web App
   * changes, the current height value of the visible area will be updated
   * in real time.
   *
   * Please note that the refresh rate of this value is not sufficient
   * to smoothly follow the lower border of the window. It should not be
   * used to pin interface elements to the bottom of the visible area. It's
   * more appropriate to use the value of the `stableHeight`
   * field for this purpose.
   *
   * @see init
   * @see expand
   * @see stableHeight
   */
  static get height(): number {
    return this._height;
  }

  /**
   * `true`, if the Web App is expanded to the maximum available height.
   * `false`, if the Web App occupies part of the screen and can be expanded
   * to the full height using `expand` method.
   *
   * @see expand
   */
  static get isExpanded(): boolean {
    return this._isExpanded;
  }

  /**
   * `true`, in case current viewport height is stable.
   */
  static get isStable(): boolean {
    return this._stableHeight === this._height;
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
   * Requests fresh information about viewport.
   */
  static request(): Promise<RequestViewportInfo> {
    return WebView.postEvent('web_app_request_viewport')
  }

  /**
   * The height of the visible area of the Web App in its last stable state.
   *
   * The application can display just the top part of the Web App, with its
   * lower part remaining outside the screen area. From this position,
   * the user can "pull" the Web App to its maximum height, while the bot can
   * do the same by calling `expand` method.
   *
   * Unlike the value of `height`, the value of `stableHeight`
   * does not change as the position of the Web App changes with user
   * gestures or during animations. The value of `stableHeight`
   * will be updated after all gestures and animations are completed and
   * the Web App reaches its final size.
   *
   * @see init
   * @see expand
   * @see height
   */
  static get stableHeight(): number {
    return this._stableHeight;
  }

  /**
   * Requests and applies fresh viewport information from native application.
   */
  static async sync() {
    this.applyViewportInfo(await this.request());
  }
}
