import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from '../lib';

let stack: cdk.Stack;
let role: iam.IRole;
let script: glue.Code;
let codeBucket: s3.IBucket;
let job: glue.IJob;

describe('Create Scala Spark ETL Job with notifyDelayAfter', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
    codeBucket = s3.Bucket.fromBucketName(stack, 'CodeBucket', 'bucketname');
    script = glue.Code.fromBucket(codeBucket, 'script');
    job = new glue.ScalaSparkEtlJob(stack, 'ScalaSparkETLJob', {
      role,
      script,
      jobName: 'ScalaSparkETLJob',
      className: 'com.example.MyJob',
      notifyDelayAfter: cdk.Duration.minutes(5),
    });
  });

  test('NotificationProperty is set', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
      NotificationProperty: {
        NotifyDelayAfter: 5,
      },
    });
  });
});
