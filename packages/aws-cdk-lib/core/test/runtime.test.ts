import { getRefProperty, ensureStringOrUndefined } from '../lib/runtime';

describe('getRefProperty', () => {
  test('returns the value for a defined key', () => {
    const ref = { roleArn: 'arn:aws:iam::123456789012:role/MyRole' };
    expect(getRefProperty(ref, 'roleArn')).toBe('arn:aws:iam::123456789012:role/MyRole');
  });

  test('returns undefined when ref is undefined', () => {
    expect(getRefProperty<{ roleArn: string }, 'roleArn'>(undefined, 'roleArn')).toBeUndefined();
  });

  test('returns undefined when ref is null', () => {
    expect(getRefProperty(null as any, 'roleArn')).toBeUndefined();
  });

  test('throws when the key exists but value is undefined', () => {
    const ref = { roleArn: undefined };
    expect(() => getRefProperty(ref, 'roleArn')).toThrow(
      "Expected 'roleArn' to be defined in reference interface",
    );
  });
});

describe('ensureStringOrUndefined', () => {
  test('returns the string value', () => {
    expect(ensureStringOrUndefined('hello', 'myProp', 'string')).toBe('hello');
  });

  test('returns undefined when value is undefined', () => {
    expect(ensureStringOrUndefined(undefined, 'myProp', 'string')).toBeUndefined();
  });

  test('throws when value is an object', () => {
    expect(() => ensureStringOrUndefined({} as any, 'myProp', 'IRef | string')).toThrow(
      'Property myProp should be one of IRef | string',
    );
  });
});
