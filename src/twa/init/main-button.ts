import {MainButton, ThemeParams} from '../components';

/**
 * Initializes main button. Expects ThemeParams to be initialized.
 */
export async function initMainButton() {
  // Get initial MainButton colors.
  MainButton.applyThemeInfo(await ThemeParams.request());
}