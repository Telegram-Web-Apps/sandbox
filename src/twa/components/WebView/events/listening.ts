import {ThemeParams} from '../../ThemeParams';

/**
 * Map where key is known event name, and value is its listener.
 */
export interface WebViewEventsMap {
  /**
   * User clicked back button.
   * @since WebApp version 6.1+
   */
  back_button_pressed: () => void;

  /**
   * Invoice was closed.
   */
  invoice_closed: () => void; // FIXME: Incorrect definition for listener.

  /**
   * User clicked main button.
   */
  main_button_pressed: () => void;

  /**
   * Popup was closed.
   * @param buttonId - Button identifier. Will be undefined in case, popup
   * was closed with outside click or via left top close button.
   */
  popup_closed: (buttonId: string | undefined) => void;

  /**
   * Telegram requested to update current application style.
   * @param html - `style` tag inner HTML.
   */
  set_custom_style: (html: string) => void;

  /**
   * Occurs when the Settings item in context menu is pressed.
   * eventHandler receives no parameters.
   * FIXME: We dont know how to imitate this event.
   *
   * @since WebApp version 6.1+
   */
  settings_button_pressed: () => void;

  /**
   * Occurs whenever theme settings are changed in the user's Telegram app
   * (including switching to night mode).
   *
   * @param theme - new theme params information.
   */
  theme_changed: (theme: ThemeParams) => void;

  /**
   * Viewport was changed.
   *
   * @param height - new viewport height.
   * @param isExpanded - new viewport expansion status.
   * @param isStateStable - new viewport stable status.
   */
  viewport_changed: (
    height: number, isExpanded: boolean, isStateStable: boolean
  ) => void;
}

/**
 * Returns listener for specified event name.
 */
export type WebViewEventListener<E extends keyof WebViewEventsMap> =
  WebViewEventsMap[E];