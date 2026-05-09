
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
