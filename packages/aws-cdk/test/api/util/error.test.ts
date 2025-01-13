import { formatErrorMessage } from '../../../lib/util/error';

describe('formatErrorMessage', () => {
  test('should return the formatted message for a regular Error object', () => {
    const error = new Error('Something went wrong');
    const result = formatErrorMessage(error);
    expect(result).toBe('Something went wrong');
  });

  test('should return the formatted message for an AggregateError', () => {
    const error = {
      errors: [
        new Error('Inner error 1'),
        new Error('Inner error 2'),
        new Error('Inner error 3'),
      ],
    };
    const result = formatErrorMessage(error);
    expect(result).toBe('AggregateError: Inner error 1\nInner error 2\nInner error 3');
  });

  test('should return "Unknown error" for null or undefined error', () => {
    expect(formatErrorMessage(null)).toBe('Unknown error');
    expect(formatErrorMessage(undefined)).toBe('Unknown error');
  });
});
