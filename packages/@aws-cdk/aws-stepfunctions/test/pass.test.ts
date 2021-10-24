import '@aws-cdk/assert-internal/jest';
import { Result } from '../lib';

describe('Pass State', () => {
  test('fromString has proper value', () => {
    const testValue = 'test string';
    const result = Result.fromString(testValue);
    expect(result.value).toEqual(testValue);
  }),

  test('fromNumber has proper value', () => {
    const testValue = 1;
    const result = Result.fromNumber(testValue);
    expect(result.value).toEqual(testValue);
  }),

  test('fromBoolean has proper value', () => {
    const testValue = false;
    const result = Result.fromBoolean(testValue);
    expect(result.value).toEqual(testValue);
  }),

  test('fromObject has proper value', () => {
    const testValue = { a: 1 };
    const result = Result.fromObject(testValue);
    expect(result.value).toStrictEqual(testValue);
  }),

  test('fromArray has proper value', () => {
    const testValue = [1];
    const result = Result.fromArray(testValue);
    expect(result.value).toEqual(testValue);
  });
});
