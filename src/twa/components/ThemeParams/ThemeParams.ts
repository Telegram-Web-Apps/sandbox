import {ColorScheme, ThemeParams as ThemeParamsInterface} from './types';
import {
  createJSONStructParser, isColorDark,
  parseJSONParamAsOptRGBExt,
  RGBExtColor,
} from '../../utils';
import {RequestThemeInfo, WebView} from '../WebView';
import {EventEmitter} from '../../lib';
import {ThemeParamsEventsMap} from './events';

/**
 * Extracts theme information from specified JSON.
 */
const extractFromJSON = createJSONStructParser({
  backgroundColor: ['bg_color', parseJSONParamAsOptRGBExt],
  buttonColor: ['button_color', parseJSONParamAsOptRGBExt],
  buttonTextColor: ['button_text_color', parseJSONParamAsOptRGBExt],
  hintColor: ['hint_color', parseJSONParamAsOptRGBExt],
  linkColor: ['link_color', parseJSONParamAsOptRGBExt],
  secondaryBackgroundColor: ['secondary_bg_color', parseJSONParamAsOptRGBExt],
  textColor: ['text_color', parseJSONParamAsOptRGBExt],
});

/**
 * Contains information about currently used theme by application.
 */
export class ThemeParams {
  private static ee = new EventEmitter<ThemeParamsEventsMap>();

  /**
   * Applies new theme parameters.
   *
   * @param theme - theme parameters.
   * @internal
   */
  static applyThemeInfo = ({raw, params, unsafe}: RequestThemeInfo) => {
    this.raw = raw;
    this.params = params;
    this.unsafe = unsafe;
    this.ee.emit('change', this);
  };

  /**
   * Background color in the #RRGGBB format.
   */
  static get backgroundColor(): RGBExtColor | undefined {
    return this.params.backgroundColor;
  }

  /**
   * Button color in the #RRGGBB format.
   */
  static get buttonColor(): RGBExtColor | undefined {
    return this.params.buttonColor;
  }

  /**
   * Button text color in the #RRGGBB format.
   */
  static get buttonTextColor(): RGBExtColor | undefined {
    return this.params.buttonTextColor;
  }

  /**
   * Current Web App color scheme. This value is dynamically computed depending
   * on current theme params.
   */
  static get colorScheme(): ColorScheme {
    const bgColor = this.backgroundColor;

    return bgColor === undefined
      ? 'dark'
      : isColorDark(bgColor) ? 'dark' : 'light';
  }

  /**
   * Creates new ThemeParams instance from their raw representation.
   * @param str - JSON string representation of theme parameters.
   */
  static fromJSONString(str: string): ThemeParams {
    return new ThemeParams(str, JSON.parse(str), extractFromJSON(str));
  }

  /**
   * Creates new ThemeParams instance from JSON.
   * @param json - JSON representation of theme parameters.
   */
  static fromJSON(json: Record<string, unknown>): ThemeParams {
    return new ThemeParams(JSON.stringify(json), json, extractFromJSON(json));
  }

  /**
   * Hint text color in the #RRGGBB format.
   */
  static get hintColor(): RGBExtColor | undefined {
    return this.params.hintColor;
  }

  /**
   * Link color in the #RRGGBB format.
   */
  static get linkColor(): RGBExtColor | undefined {
    return this.params.linkColor;
  }

  /**
   * Adds new event listener.
   */
  static on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  static off = this.ee.off.bind(this.ee);

  /**
   * Represents theme parameters which are safe to use. All of these parameters
   * were extracted from `raw` property.
   *
   * @see raw
   */
  static params: ThemeParamsInterface = {};

  /**
   * Value which is unsafe to use. It represents parsed version of `raw`
   * property and may contain values not specified in current `ThemeParams`
   * instance public properties. This value is useful in case, Telegram native
   * application updated, but current SDK version is out of date.
   */
  static unsafe: Record<string, unknown> = {};

  /**
   * Raw representation of parsed theme params. It is usually presented as JSON
   * object converted to string.
   */
  static raw = '';

  /**
   * Requests fresh information about current theme information.
   */
  static request(): Promise<RequestThemeInfo> {
    return WebView.postEvent('web_app_request_theme');
  }

  /**
   * Requests and applies fresh theme params from native application.
   */
  static async sync() {
    this.applyThemeInfo(await this.request());
  }

  /**
   * Secondary background color in the #RRGGBB format.
   * @since WebApp version 6.1+
   */
  static get secondaryBackgroundColor(): RGBExtColor | undefined {
    return this.params.secondaryBackgroundColor;
  }

  /**
   * Main text color in the #RRGGBB format.
   */
  static get textColor(): RGBExtColor | undefined {
    return this.params.textColor;
  }

  constructor(
    public raw: string,
    public unsafe: Record<string, unknown>,
    public params: ThemeParamsInterface,
  ) {
  }
}