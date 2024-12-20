import 'aws-sdk-client-mock';
import { DescribeImagesCommand } from '@aws-sdk/client-ec2';
import { SDK, SdkForEnvironment } from '../../lib';
import { AmiContextProviderPlugin } from '../../lib/context-providers/ami';
import { FAKE_CREDENTIAL_CHAIN, MockSdkProvider, mockEC2Client } from '../util/mock-sdk';

const mockSDK = new (class extends MockSdkProvider {
  public forEnvironment(): Promise<SdkForEnvironment> {
    return Promise.resolve({ sdk: new SDK(FAKE_CREDENTIAL_CHAIN, mockSDK.defaultRegion, {}), didAssumeRole: false });
  }
})();

test('calls DescribeImages on the request', async () => {
  // GIVEN
  mockEC2Client.on(DescribeImagesCommand).resolves({
    Images: [{ ImageId: 'ami-1234' }],
  });

  // WHEN
  await new AmiContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'asdf',
    owners: ['some-owner'],
    filters: {
      'some-filter': ['filtered'],
    },
  });

  // THEN
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeImagesCommand, {
    Owners: ['some-owner'],
    Filters: [
      {
        Name: 'some-filter',
        Values: ['filtered'],
      },
    ],
  });
});

test('returns the most recent AMI matching the criteria', async () => {
  // GIVEN
  mockEC2Client.on(DescribeImagesCommand).resolves({
    Images: [
      {
        ImageId: 'ami-1234',
        CreationDate: '2016-06-22T08:39:59.000Z',
      },
      {
        ImageId: 'ami-5678',
        CreationDate: '2019-06-22T08:39:59.000Z',
      },
    ],
  });

  // WHEN
  const result = await new AmiContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'asdf',
    filters: {},
  });

  // THEN
  expect(result).toBe('ami-5678');
});
