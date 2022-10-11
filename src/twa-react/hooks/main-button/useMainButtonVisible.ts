import {useCallback, useEffect, useState} from 'react';
import {MainButton} from '../../../twa';

type SetFn = (value: boolean) => void;
type Result = [typeof MainButton.isVisible, SetFn];

/**
 * Hook which returns main button visibility.
 */
export function useMainButtonVisible(): Result {
  const [value, set] = useState(MainButton.isVisible);
  const setFn = useCallback<SetFn>(value => {
    if (value) {
      MainButton.show();
    } else {
      MainButton.hide();
    }
  }, []);

  useEffect(() => {
    MainButton.on('visibleChange', set);
    return () => MainButton.off('visibleChange', set);
  }, []);

  return [value, setFn];
}