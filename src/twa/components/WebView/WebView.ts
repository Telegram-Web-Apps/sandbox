import {EventEmitter} from '../../lib';
import {hasExternal, isDesktopEnv, isIframeEnv} from './utils';
import {
  WebViewEventsMap,
  WebViewPostAwaitableEventResult,
  WebViewPostAwaitableEventName,
  WebViewPostEmptyEvent,
  WebViewPostEventArgs,
  WebViewPostEventWithArgs, WebViewEventListener,
} from './events';
import {isRecord} from '../../utils';
import {ThemeParams} from '../ThemeParams';
import {WebApp} from '../WebApp';

/**
 * Parent iframe source which is allowed to receive our messages.
 * TODO: Target should be 'https://web.telegram.org'. This value is set for
 *  test purposes.
 */
const TRUSTED_PARENT_IFRAME_TARGET = '*';

/**
 * Provides special layer between parent device and current application.
 * It can send and receive events, return initial application parameters and
 * much more.
 */
export class WebView {
  private static ee = new EventEmitter<WebViewEventsMap>();

  /**
   * Emits event.
   * @private
   */
  private static emit = this.ee.emit.bind(this.ee);

  /**
   * Emits event in unsafe mode.
   * @private
   */
  private static emitUnsafe = this.ee.emitUnsafe.bind(this.ee);

  /**
   * Returns Promise which is returned by awaitable event.
   *
   * @param event - post awaitable event name.
   * @private
   */
  private static getPostAwaitableEventPromise<E extends WebViewPostAwaitableEventName>(
    event: E,
  ): Promise<WebViewPostAwaitableEventResult<E>> {
    const isDesktop = WebApp.isDesktop();

    // Viewport is being requested.
    if (event === 'web_app_request_viewport') {
      type PromiseResult = WebViewPostAwaitableEventResult<'web_app_request_viewport'>;

      // FIXME: Desktop version does not seem to process this event.
      if (isDesktop) {
        return Promise.resolve<PromiseResult>({
          height: window.innerHeight,
          isStateStable: true,
          isExpanded: true,
        }) as Promise<WebViewPostAwaitableEventResult<E>>;
      }

      return new Promise<PromiseResult>(res => {
        const listenedEvent = 'viewport_changed' as const;

        // Create listener.
        const listener: WebViewEventListener<typeof listenedEvent> = (
          height,
          isExpanded,
          isStateStable,
        ) => {
          // Resolve received value.
          res({height, isExpanded, isStateStable});

          // Remove event listener.
          this.off(listenedEvent, listener);
        };

        // Start event listening.
        return this.on(listenedEvent, listener);
      }) as Promise<WebViewPostAwaitableEventResult<E>>;
    }

    // Theme is being requested.
    if (event === 'web_app_request_theme') {
      type PromiseResult = WebViewPostAwaitableEventResult<'web_app_request_theme'>;

      // FIXME: Desktop version does not seem to process this event.
      if (isDesktop) {
        return Promise.resolve<PromiseResult>({
          raw: ThemeParams.raw,
          unsafe: ThemeParams.unsafe,
          params: ThemeParams.params,
        }) as Promise<WebViewPostAwaitableEventResult<E>>;
      }

      return new Promise<PromiseResult>(res => {
        const listenedEvent = 'theme_changed' as const;

        // Create listener.
        const listener: WebViewEventListener<typeof listenedEvent> = theme => {
          // Resolve received value.
          res(theme);

          // Remove event listener.
          this.off(listenedEvent, listener);
        };

        // Start event listening.
        return this.on(listenedEvent, listener);
      }) as Promise<WebViewPostAwaitableEventResult<E>>;
    }

    throw new Error(`Not awaitable event "${event}" passed.`);
  }

  /**
   * Is debug mode currently enabled. This value must be set by developer
   * himself. In case, it is enabled, additional logs will appear in console.
   */
  static debug = false;

  /**
   * Current application init params. Normally, the source of this property is
   * list of parameters specified in application's location hash.
   */
  static initParams = new URLSearchParams();

  /**
   * Adds new event listener.
   */
  static on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  static off = this.ee.off.bind(this.ee);

  /**
   * Sends event to native application which launched Web App. In case,
   * low-level control required, usage of this function allowed,
   * but expected behavior not guaranteed.
   *
   * This function accepts only events, which are awaitable. As a result,
   * it returns Promise with value which depends on passed value.
   *
   * @param event - event name.
   * @throws {Error} Web View could not determine current
   * environment and possible way to send event.
   */
  static postEvent<E extends WebViewPostAwaitableEventName>(event: E): Promise<WebViewPostAwaitableEventResult<E>>;
  /**
   * Sends event to native application which launched Web App. In case,
   * low-level control required, usage of this function allowed,
   * but expected behavior not guaranteed.
   *
   * This function accepts only events, which do not require arguments.
   *
   * @param event - event name.
   * @throws {Error} Web View could not determine current
   * environment and possible way to send event.
   */
  static postEvent<E extends WebViewPostEmptyEvent>(event: E): void;
  /**
   * Sends event to native application which launched Web App. In case,
   * low-level control required, usage of this function allowed,
   * but expected behavior not guaranteed.
   *
   * This function accepts only events, which require arguments.
   *
   * @param event - event name.
   * @param args - event arguments.
   * @throws {Error} Web View could not determine current
   * environment and possible way to send event.
   */
  static postEvent<E extends WebViewPostEventWithArgs>(event: E, args: WebViewPostEventArgs<E>): void;
  static postEvent(event: string, data: any = ''): any {
    let promise: Promise<any> | undefined;
    let postType: string;

    // For awaitable events, we should return promise.
    if (event === 'web_app_request_theme' || event === 'web_app_request_viewport') {
      promise = this.getPostAwaitableEventPromise(event);
    }

    // We are currently in iframe. So, use default algorithm to communicate
    // with parent window.
    if (isIframeEnv()) {
      // Post message.
      window.parent.postMessage(JSON.stringify({
        eventType: event,
        eventData: data,
      }), TRUSTED_PARENT_IFRAME_TARGET);
      postType = 'postMessage';
    }
    // In case, window has TelegramWebViewProxy, use it.
    else if (isDesktopEnv(window)) {
      window.TelegramWebviewProxy.postEvent(event, JSON.stringify(data));
      postType = 'TelegramWebviewProxy';
    }
    // In case, external notifier exist, use it.
    else if (hasExternal(window)) {
      window.external.notify(JSON.stringify({
        eventType: event,
        eventData: data,
      }));
      postType = 'external.notify';
    } else {
      // Otherwise, application is not ready to post events.
      throw new Error(
        'Web View could not determine current environment and possible ' +
        'way to send event.'
      );
    }

    if (this.debug) {
      // TODO: Create function for this.
      console.log(`[Telegram SDK]: postEvent via ${postType}:`, event, data);
    }
    return promise;
  }

  /**
   * Prepares event data before passing it to listeners. Normally, you should
   * not use this function directly.
   *
   * @param type - event name.
   * @param data - event data.
   * @throws {TypeError} Data has unexpected format for event.
   */
  static receiveEvent = (type: string | keyof WebViewEventsMap, data: unknown) => {
    // At this point, for known events we can prepare data before passing
    // it to event listeners.
    switch (type) {
      case 'viewport_changed':
        if (
          isRecord(data) &&
          typeof data.height === 'number' &&
          typeof data.is_expanded === 'boolean' &&
          typeof data.is_state_stable === 'boolean'
        ) {
          return this.emit(
            type, data.height, data.is_expanded, data.is_state_stable,
          );
        }
        break;

      case 'theme_changed':
        if (isRecord(data) && isRecord(data.theme_params)) {
          return this.emit(type, ThemeParams.fromJSON(data.theme_params));
        }
        break;

      case 'popup_closed':
        if (
          // FIXME: undefined is sent on desktop.
          data === undefined ||
          // FIXME: empty object is sent on Android.
          (isRecord(data) && Object.keys(data).length === 0)
        ) {
          return this.emit(type, undefined);
        }
        if (isRecord(data) && typeof data.button_id === 'string') {
          return this.emit(type, data.button_id);
        }
        break;

      case 'set_custom_style':
        if (typeof data === 'string') {
          return this.emit(type, data);
        }
        break;

      case 'main_button_pressed':
      case 'back_button_pressed':
        return this.emit(type);

      // All other event listeners will receive unknown type of data.
      default:
        return this.emitUnsafe(type, data);
    }

    throw new TypeError(
      `Unable to emit event "${type}". Data has unexpected format`,
    );
  };

  /**
   * Add listener for all events. It is triggered always, when `emit`
   * function called.
   */
  static subscribe = this.ee.subscribe.bind(this.ee);

  /**
   * Removes listener added with `subscribe`.
   */
  static unsubscribe = this.ee.unsubscribe.bind(this.ee);
}
