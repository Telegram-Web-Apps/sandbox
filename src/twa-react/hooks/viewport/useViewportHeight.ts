import {useEffect, useState} from 'react';
import {Viewport} from '../../../twa';

/**
 * Hook which returns Viewport height.
 */
export function useViewportHeight(): typeof Viewport.height {
  const [value, set] = useState(Viewport.height);

  useEffect(() => {
    Viewport.on('heightChange', set);
    return () => Viewport.off('heightChange', set);
  }, []);

  return value;
}