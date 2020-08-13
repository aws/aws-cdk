/// !cdk-integ canary-one

import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as synthetics from '../lib';

/*
 * Stack verification steps:
 *
 * -- aws synthetics get-canary --name canary-one has a state of 'RUNNING'
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'canary-one');

const bucket = new s3.Bucket(stack, 'mytestbucket');
const prefix = 'integ';

new synthetics.Canary(stack, 'MyCanary', {
  canaryName: 'canary-integ',
  test: synthetics.Test.custom({
    handler: 'index.handler',
    code: synthetics.Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`),
  }),
  runtime: synthetics.Runtime.SYNTHETICS_1_0,
  schedule: synthetics.Schedule.rate(cdk.Duration.minutes(1)),
  artifactsBucketLocation: { bucket, prefix },
});

app.synth();