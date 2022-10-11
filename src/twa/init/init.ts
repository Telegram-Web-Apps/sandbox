import {initInitData} from './init-data';
import {initWebApp} from './web-app';
import {
  WebApp,
  WebView,
  Viewport,
  Popup,
  InitData,
  ThemeParams,
  MainButton,
  HapticFeedback,
  BackButton,
} from '../components';
import {initViewport} from './viewport';
import {initTheme} from './theme';
import {initWebView} from './web-view';
import {initMainButton} from './main-button';

/**
 * Main Telegram Web Apps function which initializes main system components.
 * After calling this function, usage of WebView and WebApp becomes allowed.
 *
 * @param debug - should debug mode be enabled.
 * @param assignGlobals - should core functionality of SDK be added to global
 * window object.
 */
export async function init(debug = false, assignGlobals = false) {
  if (assignGlobals) {
    const w = window as any;

    w.BackButton = BackButton;
    w.HapticFeedback = HapticFeedback;
    w.InitData = InitData;
    w.MainButton = MainButton;
    w.Popup = Popup;
    w.ThemeParams = ThemeParams;
    w.Viewport = Viewport;
    w.WebApp = WebApp;
    w.WebView = WebView;
  }

  initWebView(debug);
  initWebApp();
  await initTheme();
  await initViewport();
  await initMainButton();
  initInitData();
}

/**
 * Notifies Telegram about current application is ready to show.
 *
 * @see WebApp.ready
 */
export function ready() {
  WebApp.ready();
}