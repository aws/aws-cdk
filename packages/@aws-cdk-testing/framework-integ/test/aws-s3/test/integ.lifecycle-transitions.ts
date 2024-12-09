import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Bucket, StorageClass, TransitionDefaultMinimumObjectSize } from 'aws-cdk-lib/aws-s3';

const app = new App();

const stack = new Stack(app, 's3-lifecycle-transitions');

new Bucket(stack, 'AllStorageClasses128K', {
  lifecycleRules: [
    {
      transitions: [{
        storageClass: StorageClass.DEEP_ARCHIVE,
        transitionAfter: Duration.days(30),
      }],
    },
    {
      objectSizeLessThan: 300000,
      objectSizeGreaterThan: 200000,
      transitions: [{
        storageClass: StorageClass.ONE_ZONE_INFREQUENT_ACCESS,
        transitionAfter: Duration.days(30),
      }],
    },
  ],
  transitionDefaultMinimumObjectSize: TransitionDefaultMinimumObjectSize.ALL_STORAGE_CLASSES_128_K,
  removalPolicy: RemovalPolicy.DESTROY,
});

new Bucket(stack, 'VariesByStorageClass', {
  lifecycleRules: [
    {
      transitions: [{
        storageClass: StorageClass.DEEP_ARCHIVE,
        transitionAfter: Duration.days(30),
      }],
    },
    {
      objectSizeLessThan: 300000,
      objectSizeGreaterThan: 200000,
      transitions: [{
        storageClass: StorageClass.ONE_ZONE_INFREQUENT_ACCESS,
        transitionAfter: Duration.days(30),
      }],
    },
  ],
  transitionDefaultMinimumObjectSize: TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cdk-integ-s3-lifecycle-transitions', {
  testCases: [stack],
});
