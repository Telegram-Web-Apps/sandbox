import {useEffect, useState} from 'react';
import {MainButton} from '../../../twa';

type Result = [typeof MainButton.textColor, typeof MainButton.setTextColor];

/**
 * Hook which returns main button text color.
 */
export function useMainButtonTextColor(): Result {
  const [value, set] = useState(MainButton.textColor);

  useEffect(() => {
    MainButton.on('textColorChange', set);
    return () => MainButton.off('textColorChange', set);
  }, []);

  return [value, MainButton.setTextColor];
}