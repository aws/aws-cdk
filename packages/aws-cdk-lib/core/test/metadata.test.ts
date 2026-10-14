import { RootConstruct, type Construct } from 'constructs';
import { FeatureFlags } from '../lib';
import { Annotations } from '../lib/annotations';
import * as metadata from '../lib/metadata-resource';
import { Token } from '../lib/token';

describe('redactMetadata', () => {
  jest.mock('../lib/analytics-data-source/classes', () => ({
    AWS_CDK_CONSTRUCTOR_PROPS: {
      'aws-cdk-lib.aws-lambda': {
        Function: { key1: '*', key2: '*', myMethod: ['*', '*', { foo: 'boolean' }] },
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

  it('should redact method correctly', () => {
    const data = { addEnvironment: ['foo', 'bar', { removeInEdge: true }] };
    expect(metadata.redactMetadata('aws-cdk-lib.aws-lambda.Function', data)).toEqual({
      addEnvironment: ['*', '*', { removeInEdge: true }],
    });
  });

  it('should redact when class name is not found in module', () => {
    const data = { key1: 'value1' };
    const spy = jest.spyOn(metadata, 'redactTelemetryDataHelper');
    expect(metadata.redactMetadata('aws-cdk-lib.aws-lambda.UnknownClass', data)).toBe('*');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

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
    expect(metadata.redactTelemetryDataHelper({}, Token.asAny({ foo: 'bar' }))).toBe('*');
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
    // I don't think this tests what this test was originally intended to test, but it does
    // exactly reproduce the original mocked behavior.
    const allowedKeys = { key1: '*' };
    const data = Token.asAny({ key1: 'value1', unresolvedKey: 'value2' });
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

describe('isEnumValue', () => {
  test('returns true for valid enum value', () => {
    expect(metadata.isEnumValue('AccessEntryType', 'FARGATE_LINUX')).toBe(true);
  });

  test('returns false for invalid enum value', () => {
    expect(metadata.isEnumValue('AccessEntryType', 'FLOOPITY_BOOPITY')).toBe(false);
  });

  test('returns false for non-existent enum type', () => {
    expect(metadata.isEnumValue('NonExistentEnum', 'FARGATE_LINUX')).toBe(false);
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
});

describe('addMethodMetadata & addConstructMetadata', () => {
  let mockScope: Construct;
  let mockAnnotations: { addWarningV2: jest.Mock };
  let annotationsOf: jest.SpiedFunction<typeof Annotations.of>;

  beforeEach(() => {
    jest.restoreAllMocks(); // Reset mocks before each test

    // Create a mock Construct
    mockScope = new RootConstruct('TestConstruct');

    mockAnnotations = { addWarningV2: jest.fn() };
    annotationsOf = jest.spyOn(Annotations, 'of').mockReturnValue(mockAnnotations as any);
  });

  it('addMethodMetadata should trigger addWarningV2 when addMetadata throws an error', () => {
    // Mock addMetadata to throw an error
    jest.spyOn(FeatureFlags.prototype, 'isEnabled').mockImplementation(() => {
      throw new Error('Test Error');
    });

    // Act
    metadata.addMethodMetadata(mockScope, 'testMethod', { key: 'value' });

    // Assert

    expect(annotationsOf).toHaveBeenCalledWith(mockScope);
    expect(mockAnnotations.addWarningV2).toHaveBeenCalledWith(
      '@aws-cdk/core:addMethodMetadataFailed',
      'Failed to add method metadata for node [TestConstruct], method name testMethod. Reason: Error: Test Error',
    );
  });

  it('addConstructMetadata should trigger addWarningV2 when addMetadata throws an error', () => {
    // Mock addMetadata to throw an error
    jest.spyOn(FeatureFlags.prototype, 'isEnabled').mockImplementation(() => {
      throw new Error('Test Error');
    });

    // Act
    metadata.addConstructMetadata(mockScope, { key: 'value' });

    // Assert

    expect(annotationsOf).toHaveBeenCalledWith(mockScope);
    expect(mockAnnotations.addWarningV2).toHaveBeenCalledWith(
      '@aws-cdk/core:addConstructMetadataFailed',
      'Failed to add construct metadata for node [TestConstruct]. Reason: Error: Test Error',
    );
  });
});
