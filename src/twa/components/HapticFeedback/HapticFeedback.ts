import {
  ImpactHapticFeedback,
  NotificationHapticFeedback,
  WebView,
} from '../WebView';
import {WebApp} from '../WebApp';

/**
 * Class which controls haptic feedback. It allows calling different types of
 * haptic notifications.
 */
export class HapticFeedback {
  /**
   * A method tells that an impact occurred. The Telegram app may play the
   * appropriate haptics based on style value passed. Style can be one of
   * these values:
   * - `light`, indicates a collision between small or lightweight UI objects,
   * - `medium`, indicates a collision between medium-sized or medium-weight UI objects,
   * - `heavy`, indicates a collision between large or heavyweight UI objects,
   * - `rigid`, indicates a collision between hard or inflexible UI objects,
   * - `soft`, indicates a collision between soft or flexible UI objects.
   *
   * @param style - impact style.
   * @since WebApp version 6.1+
   */
  static impactOccurred = (style: ImpactHapticFeedback['impact_style']): void => {
    WebApp.requireVersion('6.1');
    WebView.postEvent('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: style,
    });
  };

  /**
   * A method tells that a task or action has succeeded, failed, or produced
   * a warning. The Telegram app may play the appropriate haptics based on
   * type value passed. Type can be one of these values:
   * - `error`, indicates that a task or action has failed,
   * - `success`, indicates that a task or action has completed successfully,
   * - `warning`, indicates that a task or action produced a warning.
   *
   * @param type - notification type.
   * @since WebApp version 6.1+
   */
  static notificationOccurred = (
    type: NotificationHapticFeedback['notification_type'],
  ): void => {
    WebApp.requireVersion('6.1');
    WebView.postEvent('web_app_trigger_haptic_feedback', {
      type: 'notification',
      notification_type: type,
    });
  };

  /**
   * A method tells that the user has changed a selection. The Telegram app
   * may play the appropriate haptics.
   *
   * Do not use this feedback when the user makes or confirms a selection;
   * use it only when the selection changes.
   *
   * @since WebApp version 6.1+
   */
  static selectionChanged = (): void => {
    WebApp.requireVersion('6.1');
    WebView.postEvent('web_app_trigger_haptic_feedback', {
      type: 'selection_change',
    });
  };
}