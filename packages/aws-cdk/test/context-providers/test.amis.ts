import * as aws from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import * as nodeunit from 'nodeunit';
import { ISDK } from '../../lib/api';
import { AmiContextProviderPlugin } from '../../lib/context-providers/ami';

AWS.setSDKInstance(aws);

const mockSDK: ISDK = {
  defaultAccount: () => Promise.resolve('123456789012'),
  defaultRegion: () => Promise.resolve('bermuda-triangle-1337'),
  cloudFormation: () => { throw new Error('Not Mocked'); },
  ec2: () => Promise.resolve(new aws.EC2()),
  ecr: () => { throw new Error('Not Mocked'); },
  route53: () => { throw new Error('Not Mocked'); },
  s3: () => { throw new Error('Not Mocked'); },
  ssm: () => { throw new Error('Not Mocked'); },
};

type AwsCallback<T> = (err: Error | null, val: T) => void;

export = nodeunit.testCase({
  async 'calls DescribeImages on the request'(test: nodeunit.Test) {
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
        'some-filter': ['filtered']
      }
    });

    // THEN
    test.deepEqual(request!, {
      Owners: ['some-owner'],
      Filters: [
        {
          Name: 'some-filter',
          Values: ['filtered'],
        }
      ]
    } as aws.EC2.DescribeImagesRequest);

    AWS.restore();
    test.done();
  },
  async 'returns the most recent AMI matching the criteria'(test: nodeunit.Test) {
    // GIVEN
    AWS.mock('EC2', 'describeImages', (_: aws.EC2.DescribeImagesRequest, cb: AwsCallback<aws.EC2.DescribeImagesResult>) => {
      return cb(null, { Images: [
        {
          ImageId: 'ami-1234',
          CreationDate: "2016-06-22T08:39:59.000Z",
        },
        {
          ImageId: 'ami-5678',
          CreationDate: "2019-06-22T08:39:59.000Z",
        }
      ]});
    });

    // WHEN
    const result = await new AmiContextProviderPlugin(mockSDK).getValue({
      account: '1234',
      region: 'asdf',
      filters: {}
    });

    // THEN
    test.equals(result, 'ami-5678');

    AWS.restore();
    test.done();
  }
});
