import { GetParameterCommand } from '@aws-sdk/client-ssm';
import { SDK, SdkForEnvironment } from '../../lib';
import { SSMContextProviderPlugin } from '../../lib/context-providers/ssm-parameters';
import { FAKE_CREDENTIAL_CHAIN, MockSdkProvider, mockSSMClient, restoreSdkMocksToDefault } from '../util/mock-sdk';

const mockSDK = new (class extends MockSdkProvider {
  public forEnvironment(): Promise<SdkForEnvironment> {
    return Promise.resolve({ sdk: new SDK(FAKE_CREDENTIAL_CHAIN, mockSDK.defaultRegion, {}), didAssumeRole: false });
  }
})();

describe('ssmParameters', () => {
  test('returns value', async () => {
    restoreSdkMocksToDefault();
    const provider = new SSMContextProviderPlugin(mockSDK);

    mockSSMClient.on(GetParameterCommand).resolves({
      Parameter: {
        Value: 'bar',
      },
    });

    // WHEN
    const value = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      parameterName: 'foo',
    });

    expect(value).toEqual('bar');
  });

  test('errors when parameter is not found', async () => {
    restoreSdkMocksToDefault();
    const provider = new SSMContextProviderPlugin(mockSDK);

    const notFound = new Error('Parameter not found');
    notFound.name = 'ParameterNotFound';
    mockSSMClient.on(GetParameterCommand).rejects(notFound);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        parameterName: 'foo',
      })).rejects.toThrow(/SSM parameter not available in account/);
  });
});
