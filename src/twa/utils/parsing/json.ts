import {RGBExtColor, toRGBExt} from '../colors';
import {SchemaParserResult} from './shared';

/**
 * Represents a function which is recognized as parser for some JSON value.
 * It receives value which is presented in some JSON.
 */
type Parser<R> = (value: unknown) => R;

/**
 * Represents parsing schema definition for some JSON structure. Value
 * describes settings for this JSON property. The first value is source
 * JSON property name and the second one is parser which accepts specified
 * property value.
 * TODO: Property should be optional in case, T[K] is optional.
 */
type StructSchema<T> = {
  [K in keyof T]: [string, Parser<T[K]>]
};

/**
 * Function which accepts value and converts it to specified type.
 */
type SchemaParserResultFunc<R> = (value: unknown) => R;

/**
 * Create new parser for JSON structure with specified schema.
 * @param schema - parsing schema.
 * TODO: Throws are not for this function.
 * TODO: Add getDefault function.
 * @throws {SyntaxError} Received value does not represent JSON converted to
 * string.
 * @throws {TypeError} JSON value is not object.
 */
export function createJSONStructParser<R>(
  schema: StructSchema<R>,
): SchemaParserResultFunc<SchemaParserResult<R>>;
/**
 * Create new parser for JSON structure with specified schema. In case, value
 * is null, undefined will be returned.
 * @param schema - parsing schema.
 * @param optional - is result optional.
 * TODO: Throws are not for this function.
 * TODO: Add getDefault function.
 * @throws {SyntaxError} Received value does not represent JSON converted to
 * string.
 * @throws {TypeError} JSON value is not object.
 * @throws {TypeError} Value is null.
 */
export function createJSONStructParser<R>(
  schema: StructSchema<R>,
  optional: true,
): SchemaParserResultFunc<SchemaParserResult<R> | undefined>;
export function createJSONStructParser<R>(
  schema: StructSchema<R>,
  optional?: true,
): SchemaParserResultFunc<SchemaParserResult<R> | undefined> {
  return value => {
    if (value === null || value === undefined) {
      if (optional) {
        return;
      }
      throw new TypeError(`Unable to parse value as JSON as it is empty (null or undefined).`);
    }
    let json: any = value;

    // Convert value to JSON in case, it is string. We expect value to be
    // JSON string.
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      } catch (e) {
        throw new SyntaxError(`Unable to parse value "${value}" as JSON as long as value is not JSON string.`);
      }
    }

    // We expect json to usual object.
    if (typeof json !== 'object' || json === null || Array.isArray(json)) {
      throw new TypeError(`Unable to value "${value}" as JSON as long as value is not JSON object.`);
    }

    // Iterate over each schema property and extract it from JSON.
    const result = {} as R;
    for (const prop in schema) {
      const [paramName, parser] = schema[prop];
      try {
        const value = parser(json[paramName]);

        if (value !== undefined) {
          result[prop] = value;
        }
      } catch (e) {
        throw new Error(`Unable to parse parameter "${paramName}"`, {cause: e});
      }
    }

    return result;
  };
}

/**
 * Converts value received from some JSON to string.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJSONParamAsInt: Parser<number> = value => {
  if (typeof value !== 'number') {
    throw new TypeError(`Unable to value "${value}" as int`);
  }
  return value;
};

/**
 * Converts value received from some JSON to string.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJSONParamAsString: Parser<string> = value => {
  if (typeof value !== 'string') {
    throw new TypeError(`Unable to value "${value}" as string`);
  }
  return value;
};

/**
 * Converts value received from some JSON to string or undefined.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJSONParamAsOptString: Parser<string | undefined> =
  value => value === undefined ? value : parseJSONParamAsString(value);

/**
 * Converts value received from some JSON to RGB in full format or undefined.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJSONParamAsOptRGBExt: Parser<RGBExtColor | undefined> =
    value => value === undefined ? value : toRGBExt(parseJSONParamAsString(value));

/**
 * Converts value received from some JSON to boolean or undefined.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJSONParamAsOptBool: Parser<boolean | undefined> = value => {
  if (value === undefined) {
    return;
  }
  if (typeof value !== 'boolean') {
    throw new TypeError(`Unable to value "${value}" as boolean`);
  }
  return value;
};
