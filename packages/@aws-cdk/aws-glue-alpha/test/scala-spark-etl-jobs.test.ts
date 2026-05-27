import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from '../lib';

test('Scala Spark ETL Job sets NotificationProperty', () => {
  const stack = new cdk.Stack();
  const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
  const codeBucket = s3.Bucket.fromBucketName(stack, 'CodeBucket', 'bucketname');
  const script = glue.Code.fromBucket(codeBucket, 'script');
  new glue.ScalaSparkEtlJob(stack, 'ScalaSparkETLJob', {
    role,
    script,
    jobName: 'ScalaSparkETLJob',
    className: 'com.example.MyJob',
    notifyDelayAfter: cdk.Duration.minutes(5),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
    NotificationProperty: {
      NotifyDelayAfter: 5,
    },
  });
});
