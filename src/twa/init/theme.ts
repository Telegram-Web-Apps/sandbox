import {ThemeParams, WebView} from '../components';
import {SearchParamsParser} from '../utils';

/**
 * Parses URLSearchParams parameter as theme params.
 * @param value - raw value.
 */
const parseSearchParamAsTheme: SearchParamsParser<ThemeParams | null> = value => {
  return value === null ? null : ThemeParams.fromJSONString(value);
};

/**
 * Initializes theme.
 */
export async function initTheme() {
  // Extract initial theme parameters information from web view init params.
  const theme = parseSearchParamAsTheme(
    WebView.initParams.get('tgWebAppThemeParams'),
  );

  if (theme !== null) {
    // Apply this information to global component.
    ThemeParams.applyThemeInfo(theme);
  }

  // In case, theme was changed from external environment, apply it.
  WebView.on('theme_changed', ThemeParams.applyThemeInfo);

  // Synchronize theme.
  // NOTE: Some lines before, we already extracted theme params from init
  //  params. Nevertheless, this way of getting theme parameters is recognized
  //  not recommended. That's why we sync theme with native app for future
  //  platform changes.
  await ThemeParams.sync();
}