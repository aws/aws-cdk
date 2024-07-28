import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
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

const kmsKey = new kms.Key(stack, 'KmsKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const sourceBucket = new s3.Bucket(stack, 'SourceBucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  versioned: true,
  replicationRules: [
    {
      destination: s3.ReplicationDestination.sameAccount(destinationBucket1),
    },
    {
      destination: s3.ReplicationDestination.sameAccount(destinationBucket2),
      replicationTimeControl: true,
      replicationTimeControlMetrics: true,
      kmsKey,
      storageClass: s3.StorageClass.INFREQUENT_ACCESS,
      sseKmsEncryptedObjects: true,
      replicaModifications: true,
      priority: 1,
      deleteMarkerReplication: true,
      id: 'full-settings-rule',
      prefixFilter: 'prefix',
      tagFilter: [{ key: 'filterKey', value: 'filterValue' }],
    },
  ],
});

const testCase = new IntegTest(app, 'ReplicationInteg', {
  testCases: [stack],
});

testCase.assertions.awsApiCall('S3', 'putObject', {
  Bucket: sourceBucket.bucketName,
  Key: 'test-object',
  Body: 'test-object-body',
  ContentType: 'text/plain',
}).waitForAssertions();
testCase.assertions.awsApiCall('S3', 'putObject', {
  Bucket: sourceBucket.bucketName,
  Key: 'prefix-test-object',
  Body: 'test-object-body',
  ContentType: 'text/plain',
}).waitForAssertions();
testCase.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: destinationBucket1.bucketName,
}).expect(ExpectedResult.objectLike({ KeyCount: 2 })).waitForAssertions();
testCase.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: destinationBucket2.bucketName,
}).expect(ExpectedResult.objectLike({ KeyCount: 1 })).waitForAssertions();
