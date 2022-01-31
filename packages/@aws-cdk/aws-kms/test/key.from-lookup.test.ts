import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { ContextProvider, GetContextValueOptions, GetContextValueResult, Lazy, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { Key } from '../lib';

test('requires concrete values', () => {
  expect(() => {
    // GIVEN
    const stack = new Stack();

    Key.fromLookup(stack, 'Key', {
      aliasName: Lazy.string({ produce: () => 'some-id' }),
    });
  }).toThrow('All arguments to Key.fromLookup() must be concrete (no Tokens)');
});

test('return correct key', () => {
  const previous = mockKeyContextProviderWith({
    keyId: '12345678-1234-1234-1234-123456789012',
  }, options => {
    expect(options.aliasName).toEqual('alias/foo');
  });

  const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
  const key = Key.fromLookup(stack, 'Key', {
    aliasName: 'alias/foo',
  });

  expect(key.keyId).toEqual('12345678-1234-1234-1234-123456789012');
  expect(stack.resolve(key.keyArn)).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
    ]],
  });

  restoreContextProvider(previous);
});

interface MockKeyContextResponse {
  readonly keyId: string;
}

function mockKeyContextProviderWith(
  response: MockKeyContextResponse,
  paramValidator?: (options: cxschema.KeyContextQuery) => void) {
  const previous = ContextProvider.getValue;
  ContextProvider.getValue = (_scope: Construct, options: GetContextValueOptions) => {
    // do some basic sanity checks
    expect(options.provider).toEqual(cxschema.ContextProvider.KEY_PROVIDER);

    if (paramValidator) {
      paramValidator(options.props as any);
    }

    return {
      value: {
        ...response,
      } as cxapi.KeyContextResponse,
    };
  };
  return previous;
}

function restoreContextProvider(previous: (scope: Construct, options: GetContextValueOptions) => GetContextValueResult): void {
  ContextProvider.getValue = previous;
}
