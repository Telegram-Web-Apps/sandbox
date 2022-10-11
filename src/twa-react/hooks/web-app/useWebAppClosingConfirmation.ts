import {WebApp} from '../../../twa';
import {useCallback, useEffect, useState} from 'react';

type SetFn = (enabled: boolean) => void;
type Result = [typeof WebApp.isClosingConfirmationEnabled, SetFn];

/**
 * Hooks which allows control of Web App background color.
 */
export function useWebAppClosingConfirmation(): Result {
  const [value, set] = useState(WebApp.isClosingConfirmationEnabled);
  const setFn = useCallback<SetFn>(value => {
    if (value) {
      WebApp.enableClosingConfirmation();
    } else {
      WebApp.disableClosingConfirmation();
    }
  }, []);

  useEffect(() => {
    WebApp.on('closingConfirmationChange', set);
    return () => WebApp.off('closingConfirmationChange', set);
  }, []);

  return [value, setFn];
}