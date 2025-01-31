import * as metadata from '../lib/metadata-resource';
import { Token } from '../lib/token';

describe('redactMetadata', () => {
  jest.mock('../lib/analytics-data-source/classes', () => ({
    AWS_CDK_CONSTRUCTOR_PROPS: {
      'aws-cdk-lib.aws-lambda': {
        Function: { key1: '*', key2: '*' },
      },
      'aws-cdk-lib.aws-s3': {
        Bucket: { key1: '*', key2: '*' },
      },
    },
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redact when fqn does not have 3 parts', () => {
    const data = { key1: 'value1' };
    const spy = jest.spyOn(metadata, 'redactTelemetryDataHelper');
    expect(metadata.redactMetadata('invalid-fqn', data)).toBe('*');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should redact when module is not in AWS_CDK_CONSTRUCTOR_PROPS', () => {
    const data = { key1: 'value1' };
    const spy = jest.spyOn(metadata, 'redactTelemetryDataHelper');
    expect(metadata.redactMetadata('aws-cdk-lib.aws-unknown.Function', data)).toBe('*');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should redact when class name is not found in module', () => {
    const data = { key1: 'value1' };
    const spy = jest.spyOn(metadata, 'redactTelemetryDataHelper');
    expect(metadata.redactMetadata('aws-cdk-lib.aws-lambda.UnknownClass', data)).toBe('*');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

jest.mock('../lib/token', () => ({
  Token: {
    isUnresolved: jest.fn(),
    asString: jest.fn(),
    asList: jest.fn(),
    asNumber: jest.fn(),
  },
}));

describe('redactTelemetryDataHelper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return boolean values as is', () => {
    expect(metadata.redactTelemetryDataHelper({}, true)).toBe(true);
    expect(metadata.redactTelemetryDataHelper({}, false)).toBe(false);
  });

  it('should redact strings and numbers', () => {
    expect(metadata.redactTelemetryDataHelper({}, 'test')).toBe('*');
    expect(metadata.redactTelemetryDataHelper({}, 123)).toBe('*');
  });

  it('should redact unresolved tokens', () => {
    (Token.isUnresolved as jest.Mock).mockReturnValue(true);
    expect(metadata.redactTelemetryDataHelper({}, { foo: 'bar' })).toBe('*');
    expect(Token.isUnresolved).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should recursively redact array elements', () => {
    const data = [true, 'secret', 42];
    expect(metadata.redactTelemetryDataHelper({}, data)).toEqual([true, '*', '*']);
  });

  it('should redact constructs as "*"', () => {
    const constructMock = {};
    expect(metadata.redactTelemetryDataHelper({}, constructMock)).toBe('*');
  });

  it('should redact keys and values not in allowedKeys', () => {
    const allowedKeys = { key1: '*' };
    const data = { key1: 'value1', key2: 'value2' };
    expect(metadata.redactTelemetryDataHelper(allowedKeys, data)).toEqual({ key1: '*' });
  });

  it('should skip unresolved token keys', () => {
    (Token.isUnresolved as jest.Mock).mockReturnValue(true);
    const allowedKeys = { key1: '*' };
    const data = { key1: 'value1', unresolvedKey: 'value2' };
    expect(metadata.redactTelemetryDataHelper(allowedKeys, data)).toEqual('*');
  });

  it('should handle nested objects according to allowedKeys', () => {
    const allowedKeys = { key1: { subKey1: '*' } };
    const data = { key1: { subKey1: 'value1', subKey2: 'value2' }, key2: 'value3' };
    expect(metadata.redactTelemetryDataHelper(allowedKeys, data)).toEqual({
      key1: { subKey1: '*' },
    });
  });

  it('should redact any other type of data as "*"', () => {
    expect(metadata.redactTelemetryDataHelper({}, null)).toBe('*');
    expect(metadata.redactTelemetryDataHelper({}, undefined)).toBe('*');
    expect(metadata.redactTelemetryDataHelper({}, () => {})).toBe('*');
  });
});

jest.mock('../lib/analytics-data-source/enums', () => ({
  AWS_CDK_ENUMS: {
    ExampleEnum: ['VALUE_ONE', 'VALUE_TWO', 'VALUE_THREE'],
    AnotherEnum: ['OPTION_A', 'OPTION_B', 'OPTION_C'],
  },
}));

describe('isEnumValue', () => {
  test('returns true for valid enum value', () => {
    expect(metadata.isEnumValue('ExampleEnum', 'VALUE_ONE')).toBe(true);
  });

  test('returns false for invalid enum value', () => {
    expect(metadata.isEnumValue('ExampleEnum', 'INVALID_VALUE')).toBe(false);
  });

  test('returns false for non-existent enum type', () => {
    expect(metadata.isEnumValue('NonExistentEnum', 'VALUE_ONE')).toBe(false);
  });

  test('returns false if allowedKeys is "*" (wildcard)', () => {
    expect(metadata.isEnumValue('*', 'VALUE_ONE')).toBe(false);
  });

  test('returns false if allowedKeys is not a string', () => {
    expect(metadata.isEnumValue(123, 'VALUE_ONE')).toBe(false);
    expect(metadata.isEnumValue(null, 'VALUE_ONE')).toBe(false);
    expect(metadata.isEnumValue(undefined, 'VALUE_ONE')).toBe(false);
    expect(metadata.isEnumValue({}, 'VALUE_ONE')).toBe(false);
  });

  test('returns false if value is not included in the enum values', () => {
    expect(metadata.isEnumValue('AnotherEnum', 'NOT_AN_OPTION')).toBe(false);
  });

  test('returns true for another valid enum value', () => {
    expect(metadata.isEnumValue('AnotherEnum', 'OPTION_A')).toBe(true);
  });
});
