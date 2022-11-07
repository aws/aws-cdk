import { App, Duration, Stack } from '@aws-cdk/core';
import { Bucket } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-s3');

new Bucket(stack, 'MyBucket', {
  lifecycleRules: [{
    noncurrentVersionExpiration: Duration.days(30),
    noncurrentVersionsToRetain: 123,
  }],
});

app.synth();