import {OptionalKeys} from '../../types';

/**
 * Result of function which represents a parser created with specified schema.
 */
export type SchemaParserResult<T> =
  { [K in OptionalKeys<T>]?: T[K] }
  & { [K in Exclude<keyof T, OptionalKeys<T>>]: T[K] };