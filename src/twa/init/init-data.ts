import {WebView, InitData} from '../components';
import {SearchParamsParser} from '../utils';

/**
 * Parses URLSearchParams parameter as init data.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
const parseSearchParamAsInitData: SearchParamsParser<InitData> = value => {
  if (value === null) {
    throw new TypeError('Value has incorrect type.');
  }
  return InitData.fromRaw(value);
};

/**
 * Initializes init data.
 */
export function initInitData() {
  InitData.applyInitData(
    parseSearchParamAsInitData(WebView.initParams.get('tgWebAppData')),
  );
}