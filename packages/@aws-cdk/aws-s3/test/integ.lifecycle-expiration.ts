import { App, Duration, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Bucket } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-s3');

new Bucket(stack, 'MyBucket', {
  lifecycleRules: [{
    noncurrentVersionExpiration: Duration.days(30),
    noncurrentVersionsToRetain: 123,
  }],
});

new IntegTest(app, 'cdk-integ-lifecycle-expiration', {
  testCases: [stack],
});