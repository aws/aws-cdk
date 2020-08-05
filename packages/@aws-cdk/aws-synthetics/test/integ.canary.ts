/// !cdk-integ a-canary1

import * as cdk from '@aws-cdk/core';
import * as synthetics from '../lib';

/*
 * Stack verification steps:
 *
 * -- aws synthetics get-canary --name canary-one has a state of 'RUNNING'
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'a-canary1');

new synthetics.Canary(stack, 'MyCanary', {
  canaryName: 'canary-custom',
  test: synthetics.Test.custom({
    handler: 'index.handler',
    code: synthetics.Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`),
  }),
  runtime: synthetics.Runtime.SYNTHETICS_1_0,
  schedule: synthetics.Schedule.rate(cdk.Duration.minutes(1)),
});

app.synth();