/**
 * Strips `readonly` modifiers from a type.
 *
 * Used by the module-private `set*` helpers to assign a property that is
 * declared `readonly` (to match an interface contract under
 * `exactOptionalPropertyTypes`) but is resolved after construction.
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
