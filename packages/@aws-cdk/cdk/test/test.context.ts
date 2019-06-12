import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { App, Construct, ConstructNode, Context, ContextProvider, Stack } from '../lib';

export = {
  'AvailabilityZoneProvider returns a list with dummy values if the context is not available'(test: Test) {
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    const azs = Context.getAvailabilityZones(stack);

    test.deepEqual(azs, ['dummy1a', 'dummy1b', 'dummy1c']);
    test.done();
  },

  'AvailabilityZoneProvider will return context list if available'(test: Test) {
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    const before = Context.getAvailabilityZones(stack);
    test.deepEqual(before, [ 'dummy1a', 'dummy1b', 'dummy1c' ]);
    const key = expectedContextKey(stack);

    stack.node.setContext(key, ['us-east-1a', 'us-east-1b']);

    const azs = Context.getAvailabilityZones(stack);
    test.deepEqual(azs, ['us-east-1a', 'us-east-1b']);

    test.done();
  },

  'AvailabilityZoneProvider will complain if not given a list'(test: Test) {
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    const before = Context.getAvailabilityZones(stack);
    test.deepEqual(before, [ 'dummy1a', 'dummy1b', 'dummy1c' ]);
    const key = expectedContextKey(stack);

    stack.node.setContext(key, 'not-a-list');

    test.throws(
      () => Context.getAvailabilityZones(stack)
    );

    test.done();
  },

  'ContextProvider consistently generates a key'(test: Test) {
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    const provider = new ContextProvider(stack, 'ssm', {
      parameterName: 'foo',
      anyStringParam: 'bar',
    });
    const key = provider.key;
    test.deepEqual(key, 'ssm:account=12345:anyStringParam=bar:parameterName=foo:region=us-east-1');
    const complex = new ContextProvider(stack, 'vpc', {
      cidrBlock: '192.168.0.16',
      tags: { Name: 'MyVPC', Env: 'Preprod' },
      igw: false,
    });
    const complexKey = complex.key;
    test.deepEqual(complexKey,
      'vpc:account=12345:cidrBlock=192.168.0.16:igw=false:region=us-east-1:tags.Env=Preprod:tags.Name=MyVPC');
    test.done();
  },

  'Key generation can contain arbitrarily deep structures'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });

    // WHEN
    const provider = new ContextProvider(stack, 'provider', {
      list: [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ],
    });

    // THEN
    test.equals(provider.key, 'provider:account=12345:list.0.key=key1:list.0.value=value1:list.1.key=key2:list.1.value=value2:region=us-east-1');

    test.done();
  },

  'SSM parameter provider will return context values if available'(test: Test) {
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345', region: 'us-east-1' } });
    Context.getSsmParameter(stack, 'test');
    const key = expectedContextKey(stack);

    stack.node.setContext(key, 'abc');

    const ssmp = Context.getSsmParameter(stack, 'test');
    const azs = stack.resolve(ssmp);
    test.deepEqual(azs, 'abc');

    test.done();
  },

  'Return default values if "env" is undefined to facilitate unit tests, but also expect metadata to include "error" messages'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'test-stack');

    const child = new Construct(stack, 'ChildConstruct');

    test.deepEqual(Context.getAvailabilityZones(stack), [ 'dummy1a', 'dummy1b', 'dummy1c' ]);
    test.deepEqual(Context.getSsmParameter(child, 'foo'), 'dummy');

    const assembly = app.synth();
    const output = assembly.getStack('test-stack');
    const metadata = output.manifest.metadata || {};
    const azError: cxapi.MetadataEntry | undefined = metadata['/test-stack'].find(x => x.type === cxapi.ERROR_METADATA_KEY);
    const ssmError: cxapi.MetadataEntry | undefined = metadata['/test-stack/ChildConstruct'].find(x => x.type === cxapi.ERROR_METADATA_KEY);

    test.ok(azError && (azError.data as string).includes('Cannot determine scope for context provider availability-zones'));
    test.ok(ssmError && (ssmError.data as string).includes('Cannot determine scope for context provider ssm'));

    test.done();
  },

  'fails if region is not specified in CLI context'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    stack.node.setContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY, '1111111111');

    // THEN
    test.throws(() => Context.getAvailabilityZones(stack), /A region must be specified in order to obtain environmental context: availability-zones/);
    test.done();
  }
};

/**
 * Get the expected context key from a stack with missing parameters
 */
function expectedContextKey(stack: Stack): string {
  const missing = ConstructNode.synth(stack.node).manifest.missing;
  if (!missing || missing.length !== 1) {
    throw new Error(`Expecting assembly to include a single missing context report`);
  }
  return missing[0].key;
}
