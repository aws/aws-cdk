import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AwsApiCall, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';

const app = new App();

const stack = new Stack(app, 'ReplicationStack');

const destinationBucket1 = new s3.Bucket(stack, 'DestinationBucket1', {
  versioned: true,
  removalPolicy: RemovalPolicy.DESTROY,
});
const destinationBucket2 = new s3.Bucket(stack, 'DestinationBucket2', {
  versioned: true,
  removalPolicy: RemovalPolicy.DESTROY,
});

const destinationKmsKey = new kms.Key(stack, 'DestinationKmsKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});
const sourceKmsKey = new kms.Key(stack, 'SourceKmsKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const sourceBucket = new s3.Bucket(stack, 'SourceBucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  versioned: true,
  encryptionKey: sourceKmsKey,
  replicationRules: [
    {
      destination: destinationBucket1,
      priority: 2,
      sseKmsEncryptedObjects: true,
      kmsKey: destinationKmsKey,
    },
    {
      destination: destinationBucket2,
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

const integ = new IntegTest(app, 'ReplicationInteg', {
  testCases: [stack],
});

const firstAssertion = integ.assertions
  .awsApiCall('S3', 'putObject', {
    Bucket: sourceBucket.bucketName,
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
    Bucket: sourceBucket.bucketName,
    Key: 'prefix-test-object',
    Body: 'test-object-body',
    ContentType: 'text/plain',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  }) as AwsApiCall;
secondAssertion.waiterProvider?.addToRolePolicy({
  Effect: 'Allow',
  Action: ['kms:*'],
  Resource: ['*'],
});

const thirdAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: destinationBucket1.bucketName,
    Key: 'test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  });

const fourthAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: destinationBucket1.bucketName,
    Key: 'prefix-test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  });

const fifthAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: destinationBucket2.bucketName,
    Key: 'prefix-test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  });

firstAssertion.next(secondAssertion).next(thirdAssertion).next(fourthAssertion).next(fifthAssertion);
