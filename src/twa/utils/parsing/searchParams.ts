import {SchemaParserResult} from './shared';

/**
 * Represents a function which is recognized as parser. It receives value
 * which is presented in some URLSearchParams.
 * @see URLSearchParams
 */
export type SearchParamsParser<R> = (value: string | null) => R;

/**
 * Represents parsing schema definition for some URLSearchParams. Value
 * describes settings for property. The first value is source search parameter
 * name and the second one is parser which accepts specified parameter value.
 * TODO: Property should be optional in case, T[K] is optional.
 */
export type SearchParamsStructSchema<T> = {
  [K in keyof T]: [string, SearchParamsParser<T[K]>];
};

/**
 * Function which accepts value and converts it to specified type.
 */
type SchemaParserResultFunc<R> = (value: string | URLSearchParams) => R;

/**
 * Creates new parser for specified schema.
 * TODO: Add getDefault function.
 * @param schema - schema description.
 */
export function createSearchParamsSchemaParser<R>(
  schema: SearchParamsStructSchema<R>,
): SchemaParserResultFunc<SchemaParserResult<R>> {
  return value => {
    // Convert passed value to URLSearchParams.
    const query = typeof value === 'string' ? new URLSearchParams(value) : value;
    const result = {} as R;

    for (const prop in schema) {
      const [name, parser] = schema[prop];

      try {
        const value = parser(query.get(name));

        if (value !== undefined) {
          result[prop] = value;
        }
      } catch (e) {
        throw new Error(`Unable to parse param "${name}"`, {cause: e});
      }
    }

    return result;
  };
}

/**
 * Parses URLSearchParams parameter as string.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseSearchParamAsString: SearchParamsParser<string> = value => {
  if (value === null) {
    throw new TypeError(`Unable to parse value "${value}" as string.`);
  }
  return value;
};

/**
 * Parses URLSearchParams parameter as optional string.
 * @param value - raw value.
 */
export const parseSearchParamAsOptString: SearchParamsParser<string | undefined> =
  value => value === null ? undefined : value;

/**
 * Parses URLSearchParams parameter as int.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseSearchParamAsInt: SearchParamsParser<number> = value => {
  if (value === null || value === '') {
    throw new TypeError(`Unable to parse value "${value}" as string.`);
  }
  const num = parseInt(value);
  if (Number.isNaN(num)) {
    throw new TypeError(`Unable to parse value "${value}" as int.`);
  }
  return num;
};

/**
 * Parses URLSearchParams parameter as Date.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseSearchParamAsDate: SearchParamsParser<Date> = value => {
  if (value === '' || value === null) {
    throw new TypeError(`Unable to parse value "${value}" as Date`);
  }
  const date = new Date(parseInt(value) * 1000);
  if (date.toString() === 'Invalid Date') {
    throw new TypeError(`Unable to parse value "${value}" as Date`);
  }
  return date;
};

/**
 * Parses URLSearchParams parameter as optional Date.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseSearchParamAsOptDate: SearchParamsParser<Date | undefined> =
  value => {
    if (value === null) {
      return;
    }
    const date = new Date(parseInt(value) * 1000);
    if (date.toString() === 'Invalid Date') {
      throw new TypeError(`Unable to value "${value}" as Date`);
    }
    return date;
  };