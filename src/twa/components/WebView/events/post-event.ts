import {PopupButton} from '../../Popup';

/**
 * Generic type which creates new types of haptic feedback.
 */
type HapticFeedback<T extends string, P = {}> = { type: T } & P;

/**
 * `impactOccurred` haptic feedback.
 */
export type ImpactHapticFeedback = HapticFeedback<'impact', {
  impact_style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
}>;

/**
 * `notificationOccurred` haptic feedback.
 */
export type NotificationHapticFeedback = HapticFeedback<'notification', {
  notification_type: 'error' | 'success' | 'warning'
}>;

/**
 * `selectionChanged` haptic feedback.
 */
export type SelectionHapticFeedback = HapticFeedback<'selection_change'>;

/**
 * Describes list of events and their parameters that could be posted by
 * WebView.
 */
export interface WebViewPostEventsMap {
  /**
   * Notifies external iframe about current frame is ready.
   */
  iframe_ready: never;

  /**
   * Closes WebApp.
   */
  web_app_close: never;

  /**
   * Sends data to bot.
   */
  web_app_data_send: { data: string };

  /**
   * Expands WebApp.
   */
  web_app_expand: never;

  /**
   * Opens link in default browser. Doesn't close application.
   */
  web_app_open_link: { url: string };

  /**
   * Opens link which has format like "https://t.me/*".
   */
  web_app_open_tg_link: { url: string };

  /**
   * Opens new popup.
   * TODO: It is awaitable
   */
  web_app_open_popup: {
    title: string;
    message: string;
    buttons: PopupButton[];
  };

  /**
   * Notifies Telegram about current application is ready to be shown.
   */
  web_app_ready: never;

  /**
   * Requests current theme from Telegram.
   */
  web_app_request_theme: never;

  /**
   * Requests current viewport information from Telegram.
   */
  web_app_request_viewport: never;

  /**
   * Updates current information about back button.
   */
  web_app_setup_back_button: { is_visible: boolean };

  /**
   * Updates current information about main button.
   */
  web_app_setup_main_button: {
    is_visible?: boolean;
    is_active?: boolean;
    is_progress_visible?: boolean;
    text?: string;
    color?: string;
    text_color?: string;
  };

  /**
   * Changes current closing confirmation requirement status.
   */
  web_app_setup_closing_behavior: { need_confirmation: boolean };

  /**
   * Updates current background color.
   */
  web_app_set_background_color: { color: string };

  /**
   * Updates current header color.
   */
  web_app_set_header_color: { color_key: string };

  /**
   * Generates haptic feedback events.
   */
  web_app_trigger_haptic_feedback:
    | ImpactHapticFeedback
    | NotificationHapticFeedback
    | SelectionHapticFeedback;
}

/**
 * Known callable event names.
 */
export type WebViewPostEventName = keyof WebViewPostEventsMap;

/**
 * Names of events, which do not require arguments.
 */
export type WebViewPostEmptyEvent = {
  [K in WebViewPostEventName]: [WebViewPostEventsMap[K]] extends [never]
    ? K
    : never
}[WebViewPostEventName];

/**
 * Names of events, which required arguments.
 */
export type WebViewPostEventWithArgs =
  Exclude<WebViewPostEventName, WebViewPostEmptyEvent>;

/**
 * Returns arguments for specified event.
 */
export type WebViewPostEventArgs<E extends WebViewPostEventWithArgs> =
  WebViewPostEventsMap[E];