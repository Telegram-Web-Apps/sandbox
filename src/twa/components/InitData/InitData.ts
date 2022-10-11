import {parseQueryString} from '../../utils';
import {InitData as InitDataInterface, User, Chat, parse} from 'twa-init-data';

/**
 * Class which is responsible for communication with Web Apps init data.
 */
export class InitData {
  /**
   * Parsed init data parameters.
   */
  private static params: InitDataInterface = {
    hash: '',
    authDate: new Date(0),
  };

  /**
   * Copies parameters from passed init data to current one.
   * @param data - source init data.
   */
  static applyInitData = (data: InitData) => {
    const {raw, params, unsafe} = data;
    this.raw = raw;
    this.unsafe = unsafe;
    this.params = params;
  }

  /**
   * @see InitDataInterface.authDate
   */
  static get authDate(): Date {
    return this.params.authDate;
  }

  /**
   * @see InitDataInterface.canSendAfter
   */
  static get canSendAfter(): Date | undefined {
    return this.params.canSendAfter;
  }

  /**
   * @see InitDataInterface.chat
   */
  static get chat(): Chat | undefined {
    return this.params.chat;
  }

  /**
   * Attempts to create InitData instance from its raw representation.
   * @param raw - init data in raw format (query string).
   */
  static fromRaw(raw: string): InitData {
    return new InitData(raw, parseQueryString(raw), parse(raw));
  }

  /**
   * @see InitDataInterface.hash
   */
  static get hash(): string {
    return this.params.hash;
  }

  /**
   * @see InitDataInterface.queryId
   */
  static get queryId(): string | undefined {
    return this.params.queryId;
  }

  /**
   * @see InitDataInterface.receiver
   */
  static get receiver(): User | undefined {
    return this.params.receiver;
  }

  /**
   * Raw representation of init data. Usually presented as query string.
   */
  static raw = '';

  /**
   * @see InitDataInterface.startParam
   */
  static get startParam(): string | undefined {
    return this.params.startParam;
  }

  /**
   * @see InitDataInterface.user
   */
  static get user(): User | undefined {
    return this.params.user;
  }

  /**
   * Unsafe representation of init data. This field is useful in case,
   * some new updates appeared in Telegram Web Apps, but this library version
   * is not up-to-date.
   */
  static unsafe: Record<string, unknown> = {};

  constructor(
    public raw: string,
    public unsafe: Record<string, unknown>,
    public params: InitDataInterface,
  ) {
  }
}