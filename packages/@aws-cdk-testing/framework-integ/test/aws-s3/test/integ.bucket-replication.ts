import { App, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AwsApiCall, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import { SET_UNIQUE_REPLICATION_ROLE_NAME } from 'aws-cdk-lib/cx-api';

class TestStack extends Stack {
  public readonly sourceBucket: s3.Bucket;
  public readonly destinationBucket1: s3.Bucket;
  public readonly destinationBucket2: s3.Bucket;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.destinationBucket1 = new s3.Bucket(this, 'DestinationBucket1', {
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    this.destinationBucket2 = new s3.Bucket(this, 'DestinationBucket2', {
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

    this.sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryptionKey: sourceKmsKey,
      replicationRules: [
        {
          destination: this.destinationBucket1,
          priority: 2,
          sseKmsEncryptedObjects: true,
          kmsKey: destinationKmsKey,
          replicationTimeControl: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
          metrics: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
        },
        {
          destination: this.destinationBucket2,
          replicationTimeControl: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
          metrics: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
          kmsKey: destinationKmsKey,
          storageClass: s3.StorageClass.INFREQUENT_ACCESS,
          sseKmsEncryptedObjects: true,
          replicaModifications: true,
          priority: 1,
          deleteMarkerReplication: true,
          id: 'full-settings-rule',
          filter: {
            prefix: 'prefix',
          },
        },
      ],
    });
  }
}

// Disabled SET_UNIQUE_REPLICATION_ROLE_NAME feature flag
const app = new App({
  postCliContext: {
    [SET_UNIQUE_REPLICATION_ROLE_NAME]: false,
  },
});
const stack = new TestStack(app, 'BucketReplicationTestStack');
const integ = new IntegTest(app, 'ReplicationInteg', {
  testCases: [stack],
});

const firstAssertion = integ.assertions
  .awsApiCall('S3', 'putObject', {
    Bucket: stack.sourceBucket.bucketName,
    Key: 'test-object',
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
    Bucket: stack.sourceBucket.bucketName,
    Key: 'prefix-test-object',
    Body: 'test-object-body',
    ContentType: 'text/plain',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  }) as AwsApiCall;

const thirdAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: stack.destinationBucket1.bucketName,
    Key: 'test-object',
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
    Bucket: stack.destinationBucket1.bucketName,
    Key: 'prefix-test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(15),
  });

const fifthAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: stack.destinationBucket2.bucketName,
    Key: 'prefix-test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(15),
  });

firstAssertion
  .next(secondAssertion)
  .next(thirdAssertion)
  .next(fourthAssertion)
  .next(fifthAssertion);
