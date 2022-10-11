import {SessionStorageKey, SessionStorageParams} from './types';

/**
 * Session storage key name base.
 */
const KEY_BASE = '__tg__';

/**
 * Sets value in sessionStorage storage by specified key.
 *
 * @param key - sessionStorage storage key.
 * @param value - value to set.
 * @return Returns true in case, value was successfully set.
 */
export function sessionStorageSet<K extends SessionStorageKey>(
  key: K,
  value: SessionStorageParams<K>
): boolean {
  try {
    window.sessionStorage.setItem(KEY_BASE + key, JSON.stringify(value));
    return true;
  } catch (e) {
  }
  return false;
}

/**
 * Returns value from sessionStorage storage by specified key.
 *
 * @param key - sessionStorage storage key.
 * @return Returns value which was stored previously or null in case, value
 * was never set.
 */
export function sessionStorageGet<K extends SessionStorageKey>(
  key: K
): SessionStorageParams<K> | null {
  try {
    const val = window.sessionStorage.getItem(KEY_BASE + key)

    return val === null ? null : JSON.parse(val);
  } catch (e) {
  }
  return null;
}
