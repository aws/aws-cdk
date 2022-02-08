import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { App, Stack } from '../lib';
import { ContextProvider } from '../lib/context-provider';
import { synthesize } from '../lib/private/synthesis';

describe('context', () => {
  test('AvailabilityZoneProvider returns a list with dummy values if the context is not available', () => {
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    const azs = stack.availabilityZones;

    expect(azs).toEqual(['dummy1a', 'dummy1b', 'dummy1c']);

  });

  test('AvailabilityZoneProvider will return context list if available', () => {
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    const before = stack.availabilityZones;
    expect(before).toEqual(['dummy1a', 'dummy1b', 'dummy1c']);
    const key = expectedContextKey(stack);

    stack.node.setContext(key, ['us-east-1a', 'us-east-1b']);

    const azs = stack.availabilityZones;
    expect(azs).toEqual(['us-east-1a', 'us-east-1b']);


  });

  test('AvailabilityZoneProvider will complain if not given a list', () => {
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    const before = stack.availabilityZones;
    expect(before).toEqual(['dummy1a', 'dummy1b', 'dummy1c']);
    const key = expectedContextKey(stack);

    stack.node.setContext(key, 'not-a-list');

    expect(
      () => stack.availabilityZones,
    ).toThrow();


  });

  test('ContextProvider consistently generates a key', () => {
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    const key = ContextProvider.getKey(stack, {
      provider: 'ssm',
      props: {
        parameterName: 'foo',
        anyStringParam: 'bar',
      },
    });

    expect(key).toEqual({
      key: 'ssm:account=12345:anyStringParam=bar:parameterName=foo:region=us-east-1',
      props: {
        account: '12345',
        region: 'us-east-1',
        parameterName: 'foo',
        anyStringParam: 'bar',
      },
    });

    const complexKey = ContextProvider.getKey(stack, {
      provider: 'vpc',
      props: {
        cidrBlock: '192.168.0.16',
        tags: { Name: 'MyVPC', Env: 'Preprod' },
        igw: false,
      },
    });
    expect(complexKey).toEqual({
      key: 'vpc:account=12345:cidrBlock=192.168.0.16:igw=false:region=us-east-1:tags.Env=Preprod:tags.Name=MyVPC',
      props: {
        account: '12345',
        region: 'us-east-1',
        cidrBlock: '192.168.0.16',
        tags: { Name: 'MyVPC', Env: 'Preprod' },
        igw: false,
      },
    });

  });

  test('Key generation can contain arbitrarily deep structures', () => {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });

    // WHEN
    const key = ContextProvider.getKey(stack, {
      provider: 'provider',
      props: {
        list: [
          { key: 'key1', value: 'value1' },
          { key: 'key2', value: 'value2' },
        ],
      },
    });

    // THEN
    expect(key).toEqual({
      key: 'provider:account=12345:list.0.key=key1:list.0.value=value1:list.1.key=key2:list.1.value=value2:region=us-east-1',
      props: {
        account: '12345',
        region: 'us-east-1',
        list: [
          { key: 'key1', value: 'value1' },
          { key: 'key2', value: 'value2' },
        ],
      },
    });


  });

  test('Keys with undefined values are not serialized', () => {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });

    // WHEN
    const result = ContextProvider.getKey(stack, {
      provider: 'provider',
      props: {
        p1: 42,
        p2: undefined,
      },
    });

    // THEN
    expect(result).toEqual({
      key: 'provider:account=12345:p1=42:region=us-east-1',
      props: {
        account: '12345',
        region: 'us-east-1',
        p1: 42,
        p2: undefined,
      },
    });


  });

  test('context provider errors are attached to tree', () => {
    const contextProps = { provider: 'availability-zones' };
    const contextKey = 'availability-zones:account=12345:region=us-east-1'; // Depends on the mangling algo

    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });

    // NOTE: error key is inlined here because it's part of the CX-API
    // compatibility surface.
    stack.node.setContext(contextKey, { $providerError: 'I had a boo-boo' });
    const construct = new Construct(stack, 'Child');

    // Verify that we got the right hardcoded key above, give a descriptive error if not
    expect(ContextProvider.getKey(construct, contextProps).key).toEqual(contextKey);

    // WHEN
    ContextProvider.getValue(construct, {
      ...contextProps,
      dummyValue: undefined,
    });

    // THEN
    const error = construct.node.metadata.find(m => m.type === 'aws:cdk:error');
    expect(error && error.data).toEqual('I had a boo-boo');


  });

  test('can skip account/region from attach to context', () => {
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    expect(ContextProvider.getKey(stack, { provider: 'asdf', includeEnvironment: false }).key).toEqual('asdf:');
  });
});

/**
 * Get the expected context key from a stack with missing parameters
 */
function expectedContextKey(stack: Stack): string {
  const missing = synthesize(stack).manifest.missing;
  if (!missing || missing.length !== 1) {
    throw new Error('Expecting assembly to include a single missing context report');
  }
  return missing[0].key;
}
