import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '../../../../lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const app = new App();
const stack = new Stack(app, 'WaiterProviderStack');

const bucket = new Bucket(stack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const integ = new IntegTest(app, 'WaiterProviderTest', {
  testCases: [stack],
});

const listObjectsCall = integ.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: bucket.bucketName,
  MaxKeys: 1,
}).expect(ExpectedResult.objectLike({
  KeyCount: 0,
})).waitForAssertions({
  interval: Duration.seconds(10),
  totalTimeout: Duration.minutes(3),
});

listObjectsCall.waiterProvider?.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: [
    `${bucket.bucketArn}`,
    `${bucket.bucketArn}/*`,
  ],
});