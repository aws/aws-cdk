import { inspect } from 'util';
import { Bucket } from '../../aws-s3';
import { App, Stack } from '../lib';
import { Errors, UnscopedValidationError, ValidationError } from '../lib/errors';

jest
  .useFakeTimers()
  .setSystemTime(new Date('2020-01-01'));

describe('ValidationError', () => {
  test('ValidationError is ValidationError and ConstructError', () => {
    const error = new ValidationError('Error', 'this is an error', new App());

    expect(Errors.isConstructError(error)).toBe(true);
    expect(Errors.isValidationError(error)).toBe(true);
  });

  test('ValidationError data', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const error = new ValidationError('ValidationError', 'this is an error', stack);

    expect(error.time).toBe('2020-01-01T00:00:00.000Z');
    expect(error.type).toBe('validation');
    expect(error.level).toBe('error');
    expect(error.constructPath).toBe('MyStack');
    expect(error.constructInfo).toMatchObject({
      // fqns are different when run from compiled JS (first) and dynamically from TS (second)
      fqn: expect.stringMatching(/aws-cdk-lib\.Stack|constructs\.Construct/),
      version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
    });
    expect(error.message).toBe('this is an error');
    expect(error.stack).toContain('ValidationError: this is an error');
    expect(error.stack).toContain('at path [MyStack] in');
  });

  test('UnscopedValidationError is ValidationError and ConstructError', () => {
    const error = new UnscopedValidationError('ValidationError', 'this is an error');

    expect(Errors.isConstructError(error)).toBe(true);
    expect(Errors.isValidationError(error)).toBe(true);
    expect(error.name).toBe('ValidationError');
    expect(error.stack).toContain('ValidationError: this is an error');
  });

  test('presentation of a ValidationError', () => {
    try {
      const app = new App();
      const stack = new Stack(app, 'SomeStack');

      const targetBucket = new Bucket(stack, 'TargetBucket');

      throw new ValidationError('ErrorCode', 'There is an error here', targetBucket);
    } catch (e: any) {
      // NodeJS will render an uncaught error using inspect()
      const errorString = inspect(e);
      expect(anonymizeBetweenParens(errorString)).toMatchInlineSnapshot(`
"ErrorCode: There is an error here
    at <anonymous> (...)
    ...Promise.then.completed in jest-circus...
    at new Promise (...)
    ...callAsyncCircusFn in jest-circus, node internals, _runTest in jest-circus, runTestInternal in jest-runner...
Relates to construct:
    <.> (...)
     └─ SomeStack (...)
         └─ TargetBucket (...)"
`);
    }
  });

  test('presentation of an UnscopedValidationError', () => {
    try {
      throw new UnscopedValidationError('ErrorCode', 'There is an error here');
    } catch (e: any) {
      // NodeJS will render an uncaught error using inspect()
      const errorString = inspect(e);
      expect(anonymizeBetweenParens(errorString)).toMatchInlineSnapshot(`
"ErrorCode: There is an error here
    at <anonymous> (...)
    ...Promise.then.completed in jest-circus...
    at new Promise (...)
    ...callAsyncCircusFn in jest-circus, node internals, _runTest in jest-circus, runTestInternal in jest-runner..."
`);
    }
  });
});

/**
 * Anonymize info between parentheses.
 *
 * - Construct IDs are only injected by jsii, so a js-test test won't have these.
 * - File paths are only valid on 1 particular disk.
 */
function anonymizeBetweenParens(x: string): string {
  return x.split('\n')
    .map(s => s.replace(/\([^)]*\)/, '(...)'))
    .join('\n');
}
