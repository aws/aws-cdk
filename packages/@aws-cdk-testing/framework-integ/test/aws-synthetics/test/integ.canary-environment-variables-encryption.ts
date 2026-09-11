import * as cdk from 'aws-cdk-lib/core';
import { Canary, Code, Runtime, Schedule, Test } from 'aws-cdk-lib/aws-synthetics';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'canary-environment-variables-encryption');

const encryptKey = new Key(stack, 'EnvKey', { removalPolicy: RemovalPolicy.DESTROY });

new Canary(stack, 'Canary', {
  test: Test.custom({
    handler: 'index.handler',
    code: Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`),
  }),
  schedule: Schedule.rate(cdk.Duration.minutes(1)),
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_13_0,
  provisionedResourceCleanup: true,
  environmentVariables: {
    stage: 'prod',
  },
  environmentVariablesEncryptionKey: encryptKey,
});

new IntegTest(app, 'IntegCanaryEnvironmentVariablesEncryptionTest', {
  testCases: [stack],
});
