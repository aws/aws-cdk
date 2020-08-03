/// !cdk-integ asset-canary

import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as synthetics from '../lib';

/*
 * Stack verification steps:
 *
 * -- aws synthetics get-canary --name assetcanary1 has a state of 'RUNNING'
 * -- aws synthetics get-canary --name assetcanary2 has a state of 'RUNNING'
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'asset-canary');

new synthetics.Canary(stack, 'MyCanary', {
  canaryName: 'assetcanary1',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
  }),
});

new synthetics.Canary(stack, 'MyCanaryTwo', {
  canaryName: 'assetcanary2',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canary.zip')),
  }),
});

app.synth();