/// !cdk-integ canary-one

import * as path from 'path';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as synthetics from '../lib';

/*
 * Stack verification steps:
 *
 * -- aws synthetics get-canary --name canary-integ has a state of 'RUNNING'
 * -- aws synthetics get-canary --name assetcanary-one has a state of 'RUNNING'
 * -- aws synthetics get-canary --name assetcanary-two has a state of 'RUNNING'
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
  schedule: synthetics.Schedule.rate(cdk.Duration.minutes(1)),
  artifactsBucketLocation: { bucket, prefix },
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_2_0,
});

new synthetics.Canary(stack, 'MyCanaryOne', {
  canaryName: 'assetcanary-one',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
  }),
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_2_0,
});

new synthetics.Canary(stack, 'MyCanaryTwo', {
  canaryName: 'assetcanary-two',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canary.zip')),
  }),
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_2_0,
});

app.synth();
