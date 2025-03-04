import { App, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AwsApiCall, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import { SET_UNIQUE_REPLICATION_ROLE_NAME } from 'aws-cdk-lib/cx-api';

class TestStack extends Stack {
  public readonly sourceBucket1: s3.Bucket;
  public readonly sourceBucket2: s3.Bucket;
  public readonly destinationBucket: s3.Bucket;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.destinationBucket = new s3.Bucket(this, 'DestinationBucket', {
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const destinationKmsKey = new kms.Key(this, 'DestinationKmsKey', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const sourceKmsKey = new kms.Key(this, 'SourceKmsKey', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.sourceBucket1 = new s3.Bucket(this, 'SourceBucket1', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryptionKey: sourceKmsKey,
      replicationRules: [
        {
          destination: this.destinationBucket,
          priority: 1,
          sseKmsEncryptedObjects: true,
          kmsKey: destinationKmsKey,
          replicationTimeControl: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
          metrics: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
        },
      ],
    });

    this.sourceBucket2 = new s3.Bucket(this, 'SourceBucket2', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryptionKey: sourceKmsKey,
      replicationRules: [
        {
          destination: this.destinationBucket,
          priority: 2,
          sseKmsEncryptedObjects: true,
          kmsKey: destinationKmsKey,
          replicationTimeControl: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
          metrics: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
        },
      ],
    });
  }
}

const app = new App({
  postCliContext: {
    [SET_UNIQUE_REPLICATION_ROLE_NAME]: true,
  },
});
const stack = new TestStack(app, 'BucketReplicationMultipleSourcesTestStack');
const integ = new IntegTest(app, 'ReplicationInteg', {
  testCases: [stack],
});

const firstAssertion = integ.assertions
  .awsApiCall('S3', 'putObject', {
    Bucket: stack.sourceBucket1.bucketName,
    Key: 'test-object-1',
    Body: 'test-object-body',
    ContentType: 'text/plain',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  }) as AwsApiCall;
firstAssertion.waiterProvider?.addToRolePolicy({
  Effect: 'Allow',
  Action: ['kms:*'],
  Resource: ['*'],
});

const secondAssertion = integ.assertions
  .awsApiCall('S3', 'putObject', {
    Bucket: stack.sourceBucket2.bucketName,
    Key: 'test-object-2',
    Body: 'test-object-body',
    ContentType: 'text/plain',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  }) as AwsApiCall;

const thirdAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: stack.destinationBucket.bucketName,
    Key: 'test-object-1',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(15),
  }) as AwsApiCall;
thirdAssertion.waiterProvider?.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:*'],
  Resource: ['*'],
});

const fourthAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: stack.destinationBucket.bucketName,
    Key: 'test-object-2',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(15),
  });

firstAssertion
  .next(secondAssertion)
  .next(thirdAssertion)
  .next(fourthAssertion);
