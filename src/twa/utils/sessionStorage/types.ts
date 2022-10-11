import {ThemeParamsInterface} from '../../components/ThemeParams';

/**
 * Represents a map where key is the name of sessionStorage storage key and
 * value is expected type stored by this key.
 */
interface SessionStorageParamsMap {
  initParams: [string, string][];
  themeParams: ThemeParamsInterface;
}

/**
 * List of known sessionStorage storage keys.
 */
export type SessionStorageKey = keyof SessionStorageParamsMap;

/**
 * Returns params for specified sessionStorage storage key.
 */
export type SessionStorageParams<K extends SessionStorageKey> =
  SessionStorageParamsMap[K];