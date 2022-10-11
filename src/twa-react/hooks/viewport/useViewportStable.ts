import {useViewportHeight} from './useViewportHeight';
import {useViewportStableHeight} from './useViewportStableHeight';

/**
 * Hook which returns Viewport stable status.
 */
export function useViewportStable(): boolean {
  return useViewportHeight() === useViewportStableHeight();
}