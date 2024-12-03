import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const app = new App();

const stack = new Stack(app, 'aws-cdk-s3');

// Test a lifecycle rule with an expiration DATE
new Bucket(stack, 'MyBucket', {
  lifecycleRules: [
    {
      expirationDate: new Date('2019-10-01'),
    },
    {
      expirationDate: new Date('2019-10-01'),
      objectSizeLessThan: 600,
      objectSizeGreaterThan: 500,
    },
  ],
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cdk-integ-lifecycle', {
  testCases: [stack],
});
