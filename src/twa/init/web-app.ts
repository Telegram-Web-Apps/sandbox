import {
  createSearchParamsSchemaParser,
  parseSearchParamAsString,
} from '../utils';
import {WebApp, WebView} from '../components';

/**
 * Extracts WebApp meta information from specified search params.
 */
const extractWebAppMeta = createSearchParamsSchemaParser({
  platform: ['tgWebAppPlatform', parseSearchParamAsString],
  version: ['tgWebAppVersion', parseSearchParamAsString],
});

/**
 * Initializes web app.
 */
export function initWebApp() {
  // Get all required WebApp parameters.
  const {version, platform} = extractWebAppMeta(WebView.initParams);
  WebApp.platform = platform;
  WebApp.version = version;

  // TODO: There should be some "linkHandler" on document click (check source).
  // TODO: There should be handler for some "settings_button_pressed" event.
}