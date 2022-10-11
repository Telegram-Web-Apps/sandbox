import {RGBExtColor} from '../../utils';

/**
 * List of events supported for listening by MainButton.
 */
export interface MainButtonEventsMap {
  /**
   * Being emitted when main button changes its active state.
   * @param isActive - current main button active state.
   */
  activeChange: (isActive: boolean) => void;

  /**
   * Being emitted when user pressed main button.
   */
  click: () => void;

  /**
   * Being emitted when main button changes its color.
   * @param color - current main button color.
   */
  colorChange: (color: RGBExtColor) => void;

  /**
   * Being emitted when main button changes its progress visibility.
   * @param isVisible - current main button progress visibility state.
   */
  progressVisibleChange: (isVisible: boolean) => void;

  /**
   * Being emitted when main button changes its text.
   * @param text - current main button text.
   */
  textChange: (text: string) => void;

  /**
   * Being emitted when main button changes its color.
   * @param color - current main button text color.
   */
  textColorChange: (color: RGBExtColor) => void;

  /**
   * Being emitted when main button changes its visibility.
   * @param isVisible - current main button visibility state.
   */
  visibleChange: (isVisible: boolean) => void;
}

/**
 * Returns listener for specified MainButton event.
 */
export type MainButtonEventListener<E extends keyof MainButtonEventsMap> =
  MainButtonEventsMap[E];
