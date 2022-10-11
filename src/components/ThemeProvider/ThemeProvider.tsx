import React, {memo, PropsWithChildren, useMemo} from 'react';
import {useThemeParams} from '../../twa-react';
import {createTheme, NextUIProvider} from '@nextui-org/react';

type Props = PropsWithChildren;

/**
 * Component which is responsible for controlling current application theme.
 */
export const ThemeProvider = memo<Props>(function ThemeProvider(props) {
  const {
    backgroundColor = '',
    textColor = '',
    colorScheme,
    secondaryBackgroundColor = '',
    hintColor = '',
    linkColor = '',
    buttonColor = '',
    // buttonTextColor = '',
  } = useThemeParams();

  // Create theming settings for dark theme.
  const theme = useMemo(() => createTheme({
    type: colorScheme,
    theme: {
      colors: {
        secondaryBackground: secondaryBackgroundColor,
        hint: hintColor,
        link: linkColor,
        bg: backgroundColor,
        background: secondaryBackgroundColor,
        text: textColor,

        primary: buttonColor,
      },
    },
  }), [
    backgroundColor, textColor, colorScheme, secondaryBackgroundColor,
    linkColor, hintColor, buttonColor
  ]);

  return (
    <NextUIProvider theme={theme}>
      {props.children}
    </NextUIProvider>
  );
});