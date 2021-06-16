import * as contextproviders from '../../lib/context-providers';
import { Context, TRANSIENT_CONTEXT_KEY } from '../../lib/settings';
import { MockSdkProvider } from '../util/mock-sdk';

const mockSDK = new MockSdkProvider();

const TEST_PROVIDER: any = 'testprovider';

test('errors are reported into the context value', async () => {
  // GIVEN
  contextproviders.registerContextProvider(TEST_PROVIDER, class {
    public async getValue(_: {[key: string]: any}): Promise<any> {
      throw new Error('Something went wrong');
    }
  });
  const context = new Context();

  // WHEN
  await contextproviders.provideContextValues([
    { key: 'asdf', props: { account: '1234', region: 'us-east-1' }, provider: TEST_PROVIDER },
  ], context, mockSDK, {
    account: '1234',
    region: 'us-east-1',
    name: '',
  });

  // THEN - error is now in context

  // NOTE: error key is inlined here because it's part of the CX-API
  // compatibility surface.
  expect(context.get('asdf').$providerError).toBe('Something went wrong');
});

test('foooooooooooo', async () => {
  // GIVEN
  contextproviders.registerContextProvider(TEST_PROVIDER, class {
    public async getValue(args: {[key: string]: any}): Promise<any> {
      if (args.lookupRoleArn != null) {
        return 'some resolved value';
      } else {
        throw new Error('No lookupRoleArn');
      }
    }
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
  ], context, mockSDK, {
    account: '1234',
    region: 'us-east-1',
    name: '',
  });

  // THEN - Value gets resolved
  expect(context.get('asdf')).toEqual('some resolved value');
});

test('errors are marked transient', async () => {
  // GIVEN
  contextproviders.registerContextProvider(TEST_PROVIDER, class {
    public async getValue(_: {[key: string]: any}): Promise<any> {
      throw new Error('Something went wrong');
    }
  });
  const context = new Context();

  // WHEN
  await contextproviders.provideContextValues([
    { key: 'asdf', props: { account: '1234', region: 'us-east-1' }, provider: TEST_PROVIDER },
  ], context, mockSDK, {
    account: '',
    region: '',
    name: '',
  });

  // THEN - error is marked transient
  expect(context.get('asdf')[TRANSIENT_CONTEXT_KEY]).toBeTruthy();
});
