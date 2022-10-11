import {useEffect, useState} from 'react';
import {MainButton} from '../../../twa';

type Result = [typeof MainButton.color, typeof MainButton.setColor];

/**
 * Hook which returns main button color.
 */
export function useMainButtonColor(): Result {
  const [value, set] = useState(MainButton.color);

  useEffect(() => {
    MainButton.on('colorChange', set);
    return () => MainButton.off('colorChange', set);
  }, []);

  return [value, MainButton.setColor];
}