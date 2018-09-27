import { App, Stack } from '@aws-cdk/cdk';
import { Bucket } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-s3');

// Test a lifecycle rule with an expiration DATE
new Bucket(stack, 'MyBucket', {
  lifecycleRules: [{
    expirationDate: new Date('2019-10-01')
  }]
});

process.stdout.write(app.run());
