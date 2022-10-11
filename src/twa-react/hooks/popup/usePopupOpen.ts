import {Popup} from '../../../twa';
import {useEffect, useState} from 'react';

/**
 * Hooks which returns current Popup open state.
 */
export function usePopupOpen(): typeof Popup.isOpened {
  const [value, set] = useState(Popup.isOpened);

  useEffect(() => {
    Popup.on('openChange', set);
    return () => Popup.off('openChange', set);
  }, []);

  return value;
}