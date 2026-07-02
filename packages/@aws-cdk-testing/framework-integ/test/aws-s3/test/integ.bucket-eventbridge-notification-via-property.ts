import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { S3_EVENTBRIDGE_NOTIFICATION_VIA_CFN_PROPERTY } from 'aws-cdk-lib/cx-api';

// With the feature flag enabled, EventBridge-only buckets set the notification
// configuration directly on the bucket resource and do not create the shared
// notifications custom resource (and therefore do not accumulate a per-bucket IAM
// policy on its role). This is the scenario that previously hit the 10,240 byte
// IAM role policy size limit with many EventBridge-enabled buckets.
const app = new cdk.App({
  context: {
    [S3_EVENTBRIDGE_NOTIFICATION_VIA_CFN_PROPERTY]: true,
  },
});
const stack = new cdk.Stack(app, 'S3EventBridgeNotificationViaPropertyTest');

const bucketViaProp = new s3.Bucket(stack, 'Bucket', {
  eventBridgeEnabled: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const integTest = new integ.IntegTest(app, 'S3EventBridgeNotificationViaPropertyIntegTest', {
  testCases: [stack],
});

// The bucket itself carries the EventBridge configuration.
integTest.assertions.awsApiCall('S3', 'getBucketNotificationConfiguration', {
  Bucket: bucketViaProp.bucketName,
}).expect(integ.ExpectedResult.objectLike({
  EventBridgeConfiguration: {},
}));
