import {WebApp} from '../../../twa';
import {useEffect, useState} from 'react';

type Result = [typeof WebApp.backgroundColor, typeof WebApp.setBackgroundColor];

/**
 * Hook which allows control of Web App background color.
 */
export function useWebAppBackgroundColor(): Result {
  const [value, set] = useState(WebApp.backgroundColor);

  useEffect(() => {
    WebApp.on('backgroundColorChange', set);
    return () => WebApp.off('backgroundColorChange', set);
  }, []);

  return [value, WebApp.setBackgroundColor];
}