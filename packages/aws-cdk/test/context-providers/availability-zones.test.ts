import { DescribeAvailabilityZonesCommand } from '@aws-sdk/client-ec2';
import { SDK, SdkForEnvironment } from '../../lib';
import { AZContextProviderPlugin } from '../../lib/context-providers/availability-zones';
import { FAKE_CREDENTIAL_CHAIN, mockEC2Client, MockSdkProvider } from '../util/mock-sdk';

const mockSDK = new (class extends MockSdkProvider {
  public forEnvironment(): Promise<SdkForEnvironment> {
    return Promise.resolve({ sdk: new SDK(FAKE_CREDENTIAL_CHAIN, mockSDK.defaultRegion, {}), didAssumeRole: false });
  }
})();

test('empty array as result when response has no AZs', async () => {
  // GIVEN
  mockEC2Client.on(DescribeAvailabilityZonesCommand).resolves({
    AvailabilityZones: undefined,
  });

  // WHEN
  const azs = await new AZContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'asdf',
  });

  // THEN
  expect(azs).toEqual([]);
});

test('returns AZs', async () => {
  // GIVEN
  mockEC2Client.on(DescribeAvailabilityZonesCommand).resolves({
    AvailabilityZones: [{
      ZoneName: 'us-east-1a',
      State: 'available',
    }],
  });

  // WHEN
  const azs = await new AZContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'asdf',
  });

  // THEN
  expect(azs).toEqual(['us-east-1a']);
});
