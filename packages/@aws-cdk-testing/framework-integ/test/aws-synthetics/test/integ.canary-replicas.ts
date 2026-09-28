import * as cdk from 'aws-cdk-lib/core';
import { Canary, Code, Runtime, Schedule, Test } from 'aws-cdk-lib/aws-synthetics';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'canary-replicas');

// Multi-location (replica) canaries require a recent Synthetics runtime.
new Canary(stack, 'Canary', {
  test: Test.custom({
    handler: 'index.handler',
    code: Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`),
  }),
  schedule: Schedule.rate(cdk.Duration.minutes(1)),
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_17_0,
  provisionedResourceCleanup: true,
  replicas: [
    { region: 'us-west-2' },
  ],
});

new IntegTest(app, 'IntegCanaryReplicasTest', {
  testCases: [stack],
});
