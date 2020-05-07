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
  ], context, mockSDK);

  // THEN - error is now in context

  // NOTE: error key is inlined here because it's part of the CX-API
  // compatibility surface.
  expect(context.get('asdf').$providerError).toBe('Something went wrong');
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
  ], context, mockSDK);

  // THEN - error is marked transient
  expect(context.get('asdf')[TRANSIENT_CONTEXT_KEY]).toBeTruthy();
});
