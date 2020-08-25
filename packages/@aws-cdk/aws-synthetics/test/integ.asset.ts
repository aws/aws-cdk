/// !cdk-integ canary-asset

import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as synthetics from '../lib';

/*
 * Stack verification steps:
 *
 * -- aws synthetics get-canary --name assetcanary-one has a state of 'RUNNING'
 * -- aws synthetics get-canary --name assetcanary-two has a state of 'RUNNING'
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'canary-asset');

new synthetics.Canary(stack, 'MyCanary', {
  canaryName: 'assetcanary-one',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
  }),
});

new synthetics.Canary(stack, 'MyCanaryTwo', {
  canaryName: 'assetcanary-two',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canary.zip')),
  }),
});

app.synth();