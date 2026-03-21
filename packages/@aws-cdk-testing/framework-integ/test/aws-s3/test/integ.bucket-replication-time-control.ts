import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'S3-RTC-TestStack');

const dstBucket = new s3.Bucket(stack, 'DstBucket',{
  versioned: true,
});

new s3.Bucket(stack, 'S3SourceBucket-1', {
  versioned: true,
  replicationRules: [
    {
      priority: 1,
      destination: dstBucket,
      metrics: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
    },
  ],
});

new s3.Bucket(stack, 'S3SourceBucket-2', {
  versioned: true,
  replicationRules: [
    {
      priority: 1,
      destination: dstBucket,
      replicationTimeControl: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
      metrics: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
    },
  ],
});

new IntegTest(app, 's3-rtc-replication-metrics-integ-test', {
  testCases: [stack],
});
