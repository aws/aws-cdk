import { App, Stack } from '../lib';
import { Errors, ValidationError } from '../lib/errors';

jest
  .useFakeTimers()
  .setSystemTime(new Date('2020-01-01'));

describe('ValidationError', () => {
  test('ValidationError is ValidationError and ConstructError', () => {
    const error = new ValidationError('this is an error', new App());

    expect(Errors.isConstructError(error)).toBe(true);
    expect(Errors.isValidationError(error)).toBe(true);
  });

  test('ValidationError data', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const error = new ValidationError('this is an error', stack);

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
});
