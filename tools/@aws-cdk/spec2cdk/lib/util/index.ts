export * as queryDb from './db';
export * as log from './log';
export * as jsii from './jsii';
export * from './jsdoc-tags';
export * from './patterned-name';
export * from './split-summary';
export * from './ts-file-writer';

/**
 * Type guard to filter out undefined values.
 */
export function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
