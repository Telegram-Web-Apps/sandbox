import {useEffect, useState} from 'react';
import {Viewport} from '../../../twa';

/**
 * Hook which returns Viewport stable height.
 */
export function useViewportStableHeight(): typeof Viewport.stableHeight {
  const [value, set] = useState(Viewport.stableHeight);

  useEffect(() => {
    Viewport.on('stableHeightChange', set);
    return () => Viewport.off('stableHeightChange', set);
  }, []);

  return value;
}