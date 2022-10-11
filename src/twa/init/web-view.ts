import {EventData, isIframeEnv, WebView} from '../components';
import {parseHash, sessionStorageGet} from '../utils';

/**
 * Extracts init params from specified path.
 *
 * @param path - path to extract init params from.
 * @return Returns init data from hash of specified path. In case, path has
 * no hash, path is recognized as hash.
 * @see urlParseHashParams
 */
function extractInitParams(path: string): URLSearchParams {
  return parseHash(path).query;
}

/**
 * Extracts init params from specified path and applies init params which were
 * previously stored in session storage. Only those fields from session
 * storage are applied which are missing in current in currently parsed init
 * params. It means, current init params fields will not be overwritten, but
 * fulfilled.
 *
 * @param path - path to extract init params from.
 * @return Returns init data from hash of specified
 */
function extractFulfilledInitParams(path: string): URLSearchParams {
  // Get init params from URL.
  const params = extractInitParams(path);
  // Get stored init params.
  const sessParams = sessionStorageGet('initParams');

  // In case, we have session params, we should fill current init params with
  // missing session params.
  if (sessParams !== null) {
    sessParams.forEach(([k, v]) => {
      if (!params.has(k)) {
        params.set(k, v);
      }
    });
  }
  return params;
}

/**
 * Extracts event data from message event sent from parent source.
 *
 * @param eventData - received event data.
 * @throws {SyntaxError} Passed value is not JSON presented as string.
 * @throws {TypeError} Passed value is JSON, but not an object with expected
 * keys and values. Expected keys are `eventType` and `eventData` which are
 * both strings.
 * @return Extracted event data from its string presentation.
 */
function extractMessageEventData(eventData: string): EventData {
  const data = JSON.parse(eventData);

  // data should be something like {eventType: string; eventData: string}.
  if (
    typeof data !== 'object' ||
    data === null ||
    Array.isArray(data) ||
    typeof data.eventType !== 'string' ||
    typeof data.eventData !== 'string'
  ) {
    throw new TypeError(`${eventData} does not present JSON object converted to string.`);
  }
  return {type: data.eventType, data: data.eventData};
}

/**
 * Applies library backward compatibility with different platforms.
 */
function applyBackward() {
  // Define all paths, where "receiveEvent" function should be defined.
  const paths: string[][] = [
    // Windows Phone App.
    ['TelegramGameProxy_receiveEvent'],
    // Telegram Desktop.
    ['TelegramGameProxy', 'receiveEvent'],
    // Android.
    ['Telegram', 'WebView', 'receiveEvent'],
  ];
  const wnd = window as any;

  // Iterate over each of the paths and assign "receiveEvent" function.
  paths.forEach(path => {
    // Path starts from "window" object.
    let currentObj = wnd;

    path.forEach((p, idx, arr) => {
      // We are on the last iteration, where function property name is passed.
      if (idx === arr.length - 1) {
        // TODO: Overriding previous receiveEvent will lead to other web views
        //  inability to receive events as long as this instance will capture
        //  them.
        currentObj[p] = WebView.receiveEvent;
        return;
      }
      // Otherwise, we should create new object or refer to existing, and
      // set pointer to it.
      if (!(p in currentObj)) {
        const pointer = {};
        currentObj[p] = pointer;
        currentObj = pointer;
      } else {
        currentObj = currentObj[p];
      }
    });
  });
}

/**
 * Initializes WebView.
 */
export function initWebView(debug: boolean) {
  // Extract init params from current window location and store them in WebView.
  WebView.initParams = extractFulfilledInitParams(window.location.toString());

  // In case, debug mode is enabled, we are logging all events captured by
  // WebView.
  if (debug) {
    WebView.debug = debug;
    WebView.subscribe((event, ...args) => {
      // TODO: Create function for this.
      if (args.length === 0) {
        console.log(`[Telegram SDK]: Event "${event}" received.`);
      } else {
        console.log(`[Telegram SDK]: Event "${event}" received. Data:`, ...args);
      }
    });
  }

  // In case, we are currently in iframe, it is required to listen to
  // messages, coming from parent source to apply requested changes.
  // The only one case, when current application was placed into iframe is
  // web version of Telegram.
  if (isIframeEnv()) {
    // Create special style element which is responsible for application
    // style controlled by app source. Add style element ID to find it
    // in DOM a bit faster for debug purposes.
    const styleElement = document.createElement('style');
    styleElement.id = '__tg-iframe-style__';
    document.head.appendChild(styleElement);

    // Listen to events from parent environment.
    window.addEventListener('message', event => {
      // Reject events from non-parent sources.
      if (event.source !== window.parent || typeof event.data !== 'string') {
        // TODO: Add logging when parent is unknown, or event has unexpected
        //  type.
        return;
      }

      // Extracted event data.
      let ed: EventData;
      try {
        ed = extractMessageEventData(event.data);
      } catch (e) {
        // TODO: Add error logging.
        return;
      }

      // Prepare data before sending to handlers.
      WebView.receiveEvent(ed.type, ed.data);
    });

    // Add all required listeners. Here we place all listeners that are
    // common between all Telegram technologies (Telegram Games as Web Apps
    // currently).
    WebView.on('set_custom_style', html => styleElement.innerHTML = html);

    // Notify Telegram, iframe is ready.
    WebView.postEvent('iframe_ready');
  } else {
    // Otherwise, we should apply backward compatibility scripts as long as
    // other platforms do not use iframes.
    applyBackward();
  }
}