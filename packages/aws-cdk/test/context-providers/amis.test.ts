import * as aws from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import { AmiContextProviderPlugin } from '../../lib/context-providers/ami';
import { MockSdkProvider } from '../util/mock-sdk';

// If the 'aws-sdk' package imported here and the 'aws-sdk' package imported by 'aws-sdk-mock' aren't
// the same physical package on disk (if version mismatches cause hoisting/deduping to not happen),
// the type check here takes too long and makes the TypeScript compiler fail.
// Suppress the type check using 'as any' to make this more robust.
AWS.setSDKInstance(aws as any);

afterEach(done => {
  AWS.restore();
  done();
});

const mockSDK = new MockSdkProvider();

type AwsCallback<T> = (err: Error | null, val: T) => void;

test('calls DescribeImages on the request', async () => {
  // GIVEN
  let request: aws.EC2.DescribeImagesRequest;
  AWS.mock('EC2', 'describeImages', (params: aws.EC2.DescribeImagesRequest, cb: AwsCallback<aws.EC2.DescribeImagesResult>) => {
    request = params;
    return cb(null, { Images: [{ ImageId: 'ami-1234' }] });
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
  expect(request!).toEqual({
    Owners: ['some-owner'],
    Filters: [
      {
        Name: 'some-filter',
        Values: ['filtered'],
      },
    ],
  } as aws.EC2.DescribeImagesRequest);
});

test('returns the most recent AMI matching the criteria', async () => {
  // GIVEN
  AWS.mock('EC2', 'describeImages', (_: aws.EC2.DescribeImagesRequest, cb: AwsCallback<aws.EC2.DescribeImagesResult>) => {
    return cb(null, {
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
