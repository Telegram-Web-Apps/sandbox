import {ThemeParams} from './ThemeParams';

/**
 * List of events supported for listening by ThemeParams.
 */
export interface ThemeParamsEventsMap {
  /**
   * Being emitted when theme params changed.
   * @param theme - new theme.
   */
  change: (theme: typeof ThemeParams) => void;
}