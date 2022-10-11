/**
 * Describes any unknown function.
 */
export type AnyFunc = (...args: any[]) => any;

/**
 * Return keys which are optional or could have undefined values in specified
 * type.
 */
export type OptionalKeys<T> = Exclude<{
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T], undefined>;