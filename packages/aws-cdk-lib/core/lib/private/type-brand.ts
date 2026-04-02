/**
 * Simple branded types for TypeScript
 *
 * Every usage of this type generates a new unique brand, so you must assign
 * it to a type:
 *
 * ```ts
 * export type MyTypeBrand = Branded<string>;
 * ```
 */
export type Branded<T, U> = T & { readonly [__brand]: U };

/**
 * This makes the brand property inaccessible because no one can even theoretically get to the unique symbol value.
 *
 * (In practice, there is no such property, so it's good that no one can get to it).
 */
declare const __brand: unique symbol;
