import {useCallback, useEffect, useState} from 'react';
import {MainButton} from '../../../twa';

type SetFn = (value: boolean) => void;
type Result = [typeof MainButton.isProgressVisible, SetFn];

/**
 * Hook which returns main button progress visibility.
 */
export function useMainButtonProgressVisible(): Result {
  const [value, set] = useState(MainButton.isProgressVisible);
  const setFn = useCallback<SetFn>(value => {
    if (value) {
      MainButton.showProgress();
    } else {
      MainButton.hideProgress();
    }
  }, []);

  useEffect(() => {
    MainButton.on('progressVisibleChange', set);
    return () => MainButton.off('progressVisibleChange', set);
  }, []);

  return [value, setFn];
}