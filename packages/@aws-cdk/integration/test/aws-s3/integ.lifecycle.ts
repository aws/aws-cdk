import { Bucket } from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';

const app = new App();

const stack = new Stack(app, 'aws-cdk-s3');

// Test a lifecycle rule with an expiration DATE
new Bucket(stack, 'MyBucket', {
  lifecycleRules: [{
    expirationDate: new Date('2019-10-01'),
  }],
  removalPolicy: RemovalPolicy.DESTROY,
});

app.synth();
