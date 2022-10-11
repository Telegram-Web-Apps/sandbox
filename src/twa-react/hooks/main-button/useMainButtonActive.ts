import {useCallback, useEffect, useState} from 'react';
import {MainButton} from '../../../twa';

type SetFn = (value: boolean) => void;
type Result = [typeof MainButton.isActive, SetFn];

/**
 * Hook which returns main button active status.
 */
export function useMainButtonActive(): Result {
  const [value, set] = useState(MainButton.isActive);
  const setFn = useCallback<SetFn>(value => {
    if (value) {
      MainButton.enable();
    } else {
      MainButton.disable();
    }
  }, []);

  useEffect(() => {
    MainButton.on('activeChange', set);
    return () => MainButton.off('activeChange', set);
  }, []);

  return [value, setFn];
}