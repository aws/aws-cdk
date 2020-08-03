/// !cdk-integ a-canary

import * as cdk from '@aws-cdk/core';
import * as synthetics from '../lib';

/*
 * Stack verification steps:
 *
 * -- aws synthetics get-canary --name canary-one has a state of 'RUNNING'
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'a-canary');

new synthetics.Canary(stack, 'MyCanary', {
  canaryName: 'canary-one',
  test: synthetics.Test.custom({
    handler: 'index.handler',
    code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
  }),
  runtime: synthetics.Runtime.SYNTHETICS_1_0,
});

app.synth();