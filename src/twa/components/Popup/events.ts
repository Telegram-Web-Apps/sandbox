import {PopupParams} from './types';

/**
 * List of events supported for listening by Popup.
 */
export interface PopupEventsMap {
  /**
   * Being emitted when popup opens.
   * @param params - popup parameters.
   */
  open: (params: PopupParams) => void;

  /**
   * Being emitted when popup open state changes.
   * @param isOpened - current open state.
   */
  openChange: (isOpened: boolean) => void;

  /**
   * Being emitted when popup closes.
   * @param buttonId - button identifier. Will be undefined in case, user
   * pressed native app close button or clicks outside.
   */
  close: (buttonId: string | undefined) => void;
}
