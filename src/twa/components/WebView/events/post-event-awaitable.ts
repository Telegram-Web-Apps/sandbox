import {ThemeParams as ThemeParamsInterface} from '../../ThemeParams/types';

/**
 * Information returned by "web_app_request_viewport" event.
 */
export interface RequestViewportInfo {
  height: number;
  isExpanded: boolean;
  isStateStable: boolean;
}

/**
 * Information returned by "web_app_request_theme" event.
 */
export interface RequestThemeInfo {
  raw: string;
  unsafe: Record<string, unknown>;
  params: ThemeParamsInterface;
}

/**
 * Describes list of events, which could be awaited by WebView. Key is event
 * name, value is Promise result.
 */
export interface WebViewPostAwaitableEventsMap {
  /**
   * @see WebViewPostEventsMap.web_app_request_theme
   * @see WebViewEventsMap.theme_changed
   */
  web_app_request_theme: RequestThemeInfo;

  /**
   * @see WebViewPostEventsMap.web_app_request_viewport
   * @see WebViewEventsMap.viewport_changed
   */
  web_app_request_viewport: RequestViewportInfo;
}

/**
 * Event names which could be awaited by WebView.
 */
export type WebViewPostAwaitableEventName = keyof WebViewPostAwaitableEventsMap;

/**
 * Returns post awaitable event args.
 */
export type WebViewPostAwaitableEventResult<E extends WebViewPostAwaitableEventName> =
  WebViewPostAwaitableEventsMap[E];