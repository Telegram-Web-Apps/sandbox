/**
 * List of events supported for listening by BackButton.
 */
export interface BackButtonEventsMap {
  /**
   * Being emitted when user pressed back button.
   */
  click: () => void;

  /**
   * Being emitted when back button changes visibility status.
   * @param visible - current visibility status.
   */
  visibleChange: (visible: boolean) => void;
}

/**
 * Returns listener for specified BackButton event.
 */
export type BackButtonEventListener<E extends keyof BackButtonEventsMap> = BackButtonEventsMap[E];
