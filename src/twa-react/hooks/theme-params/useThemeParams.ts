import {useEffect, useState} from 'react';
import {ThemeParams, ThemeParams as ThemeParamsSDK} from '../../../twa';

type PickedProps =
  | 'backgroundColor' | 'buttonColor' | 'buttonTextColor' | 'hintColor'
  | 'linkColor' | 'secondaryBackgroundColor' | 'textColor' | 'raw' | 'unsafe' | 'colorScheme';
type Result = Pick<typeof ThemeParamsSDK, PickedProps>;

function extractResult(theme: typeof ThemeParams): Result {
  return {
    backgroundColor: theme.backgroundColor,
    buttonColor: theme.buttonColor,
    buttonTextColor: theme.buttonTextColor,
    colorScheme: theme.colorScheme,
    hintColor: theme.hintColor,
    linkColor: theme.linkColor,
    raw: theme.raw,
    secondaryBackgroundColor: theme.secondaryBackgroundColor,
    textColor: theme.textColor,
    unsafe: theme.unsafe,
  };
}

/**
 * Hook which allows usage of ThemeParams component.
 */
export function useThemeParams(): Result {
  const [value, set] = useState<Result>(extractResult(ThemeParams));

  useEffect(() => {
    const listener = (theme: typeof ThemeParams) => set(extractResult(theme));
    ThemeParams.on('change', listener);

    return () => ThemeParams.off('change', listener);
  }, []);

  return value;
}