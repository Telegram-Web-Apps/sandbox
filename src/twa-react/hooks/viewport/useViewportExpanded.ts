import {useEffect, useState} from 'react';
import {Viewport} from '../../../twa';

type Result = [typeof Viewport.isExpanded, typeof Viewport.expand];

/**
 * Hook which allows control of Viewport expansion state.
 */
export function useViewportExpand(): Result {
  const [value, set] = useState(Viewport.isExpanded);

  useEffect(() => {
    Viewport.on('expansionChange', set);
    return () => Viewport.off('expansionChange', set);
  }, []);

  return [value, Viewport.expand];
}