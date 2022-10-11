import {useCallback, useEffect, useState} from 'react';
import {BackButton} from '../../../twa';

type SetFn = (visible: boolean) => void;
type Result = [typeof BackButton.isVisible, SetFn];

/**
 * Hook which allows BackButton's visibility state control.
 */
export function useBackButtonVisible(): Result {
  const [value, set] = useState(BackButton.isVisible);
  const setFn = useCallback<SetFn>(value => {
    if (value) {
      BackButton.show();
    } else {
      BackButton.hide();
    }
  }, []);

  useEffect(() => {
    BackButton.on('visibleChange', set);
    return () => BackButton.off('visibleChange', set);
  }, []);

  return [value, setFn];
}