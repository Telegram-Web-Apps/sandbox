import {AnyFunc} from '../../types';

/**
 * Returns function that represents event listener.
 */
export type EventListener<Params> = Params extends any[]
  ? (...args: Params) => void
  : Params extends AnyFunc
    ? (...args: Parameters<Params>) => void
    : never;

/**
 * Verifies that passed generic type could be used to describe event
 * parameters.
 */
export type EventParams<Params> = Params extends any[]
  ? Params
  : Params extends AnyFunc
    ? Parameters<Params>
    : never;

/**
 * Returns event names which do not require any arguments.
 */
export type EmptyEvents<Schema> = {
  [E in keyof Schema]: Schema[E] extends [] ? E : never;
}[keyof Schema];

/**
 * Returns event names which require arguments.
 */
export type NonEmptyEvents<Schema> = Exclude<keyof Schema, EmptyEvents<Schema>>;

/**
 * Represents any allowed listener.
 */
export type AnyListener = EventListener<any[]>;

/**
 * Represents listener which is listening to any events.
 */
export type GlobalListener = (event: string, ...args: any[]) => void;