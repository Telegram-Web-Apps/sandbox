import {WebApp} from '../../../twa';
import {useEffect, useState} from 'react';

type Result = [typeof WebApp.headerColor, typeof WebApp.setHeaderColor];

/**
 * Hook which allows control of Web App header color.
 */
export function useWebAppHeaderColor(): Result {
  const [value, set] = useState(WebApp.headerColor);

  useEffect(() => {
    WebApp.on('headerColorChange', set);
    return () => WebApp.off('headerColorChange', set);
  }, []);

  return [value, WebApp.setHeaderColor];
}