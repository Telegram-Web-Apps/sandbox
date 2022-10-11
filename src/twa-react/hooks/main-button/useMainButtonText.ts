import {useEffect, useState} from 'react';
import {MainButton} from '../../../twa';

type Result = [typeof MainButton.text, typeof MainButton.setText];

/**
 * Hook which returns main button text.
 */
export function useMainButtonText(): Result {
  const [value, set] = useState(MainButton.text);

  useEffect(() => {
    MainButton.on('textChange', set);
    return () => MainButton.off('textChange', set);
  }, []);

  return [value, MainButton.setText];
}