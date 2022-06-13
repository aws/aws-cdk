import { PluginHost } from '../../lib/api/plugin';
import * as contextproviders from '../../lib/context-providers';
import { Context, TRANSIENT_CONTEXT_KEY } from '../../lib/settings';
import { MockSdkProvider } from '../util/mock-sdk';

const mockSDK = new MockSdkProvider();

const TEST_PROVIDER: any = 'testprovider';
const PLUGIN_PROVIDER: any = 'plugin';

test('errors are reported into the context value', async () => {
  // GIVEN
  contextproviders.registerContextProvider(TEST_PROVIDER, {
    async getValue(_: {[key: string]: any}): Promise<any> {
      throw new Error('Something went wrong');
    },
  });
  const context = new Context();

  // WHEN
  await contextproviders.provideContextValues([
    { key: 'asdf', props: { account: '1234', region: 'us-east-1' }, provider: TEST_PROVIDER },
  ], context, mockSDK);

  // THEN - error is now in context

  // NOTE: error key is inlined here because it's part of the CX-API
  // compatibility surface.
  expect(context.get('asdf').$providerError).toBe('Something went wrong');
});

test('lookup role ARN is resolved', async () => {
  // GIVEN
  contextproviders.registerContextProvider(TEST_PROVIDER, {
    async getValue(args: {[key: string]: any}): Promise<any> {
      if (args.lookupRoleArn == null) {
        throw new Error('No lookupRoleArn');
      }

      if (args.lookupRoleArn.includes('${AWS::Partition}')) {
        throw new Error('Partition not resolved');
      }

      return 'some resolved value';
    },
  });
  const context = new Context();

  // WHEN
  await contextproviders.provideContextValues([
    {
      key: 'asdf',
      props: {
        account: '1234',
        region: 'us-east-1',
        lookupRoleArn: 'arn:${AWS::Partition}:iam::280619947791:role/cdk-hnb659fds-lookup-role-280619947791-us-east-1',
      },
      provider: TEST_PROVIDER,
    },
  ], context, mockSDK);

  // THEN - Value gets resolved
  expect(context.get('asdf')).toEqual('some resolved value');
});

test('errors are marked transient', async () => {
  // GIVEN
  contextproviders.registerContextProvider(TEST_PROVIDER, {
    async getValue(_: {[key: string]: any}): Promise<any> {
      throw new Error('Something went wrong');
    },
  });
  const context = new Context();

  // WHEN
  await contextproviders.provideContextValues([
    { key: 'asdf', props: { account: '1234', region: 'us-east-1' }, provider: TEST_PROVIDER },
  ], context, mockSDK);

  // THEN - error is marked transient
  expect(context.get('asdf')[TRANSIENT_CONTEXT_KEY]).toBeTruthy();
});

test('context provider can be registered using PluginHost', async () => {
  let called = false;

  // GIVEN
  PluginHost.instance.registerContextProviderAlpha('prov', {
    async getValue(_: {[key: string]: any}): Promise<any> {
      called = true;
      return '';
    },
  });
  const context = new Context();

  // WHEN
  await contextproviders.provideContextValues([
    { key: 'asdf', props: { account: '1234', region: 'us-east-1', pluginName: 'prov' }, provider: PLUGIN_PROVIDER },
  ], context, mockSDK);

  // THEN - error is marked transient
  expect(called).toEqual(true);
});

test('plugin context provider can be called without account/region', async () => {
  // GIVEN
  PluginHost.instance.registerContextProviderAlpha('prov', {
    async getValue(_: {[key: string]: any}): Promise<any> {
      return 'yay';
    },
  });
  const context = new Context();

  // WHEN
  await contextproviders.provideContextValues([
    { key: 'asdf', props: { banana: 'yellow', pluginName: 'prov' } as any, provider: PLUGIN_PROVIDER },
  ], context, mockSDK);

  // THEN - error is marked transient
  expect(context.get('asdf')).toEqual('yay');
});
