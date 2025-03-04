import { Construct } from 'constructs';
import * as cxschema from '../../cloud-assembly-schema';
import { App, ContextProvider, GetContextValueOptions, GetContextValueResult, Lazy, Stack } from '../../core';
import * as cxapi from '../../cx-api';
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

test('return dummy key if returnDummyKeyOnMissing is true', () => {
  const app = new App();
  const stack = new Stack(app, 'MyStack', { env: { region: 'us-east-1', account: '123456789012' } });
  const key = Key.fromLookup(stack, 'Key', {
    aliasName: 'alias/foo',
    returnDummyKeyOnMissing: true,
  });

  expect(key.keyId).toEqual(Key.DEFAULT_DUMMY_KEY_ID);
  expect(app.synth().manifest.missing).toEqual([
    {
      key: 'key-provider:account=123456789012:aliasName=alias/foo:region=us-east-1',
      props: {
        account: '123456789012',
        aliasName: 'alias/foo',
        ignoreErrorOnMissingContext: true,
        lookupRoleArn: 'arn:${AWS::Partition}:iam::123456789012:role/cdk-hnb659fds-lookup-role-123456789012-us-east-1',
        dummyValue: {
          keyId: '1234abcd-12ab-34cd-56ef-1234567890ab',
        },
        region: 'us-east-1',
      },
      provider: 'key-provider',
    },
  ]);
});

describe('isLookupDummy method', () => {
  test('return false if the lookup key is not a dummy key', () => {
    const previous = mockKeyContextProviderWith({
      keyId: '12345678-1234-1234-1234-123456789012',
    }, options => {
      expect(options.aliasName).toEqual('alias/foo');
    });

    const app = new App();
    const stack = new Stack(app, 'MyStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const key = Key.fromLookup(stack, 'Key', {
      aliasName: 'alias/foo',
      returnDummyKeyOnMissing: true,
    });

    expect(Key.isLookupDummy(key)).toEqual(false);

    restoreContextProvider(previous);
  });

  test('return true if the lookup key is a dummy key', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const key = Key.fromLookup(stack, 'Key', {
      aliasName: 'alias/foo',
      returnDummyKeyOnMissing: true,
    });

    expect(Key.isLookupDummy(key)).toEqual(true);
  });
});

interface MockKeyContextResponse {
  readonly keyId: string;
}

function mockKeyContextProviderWith(
  response: MockKeyContextResponse,
  paramValidator?: (options: cxschema.KeyContextQuery) => void) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
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
