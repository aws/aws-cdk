import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-s3-assets');

process.env.CDK_COMMAND = 'destroy';

/**
 * This test is wacky. I had to create the asset using lambda correctly, so I used a local test folder '/Users/myid/testFolder'.
 * Where I added a test python file with nothing but a handler and return.
 * Then I deployed this using --update-on-failed.
 * After this I edited the path to /notarealpath and updated the snapshot by hand so the s3 bucket and key were ''.
 */

new Function(stack, 'MyFunction', {
  runtime: Runtime.PYTHON_3_13,
  handler: 'index.handler',
  code: Code.fromAsset('/notarealpath'),
});

new IntegTest(app, 'testing-destroy-synth', {
  testCases: [stack],
});

delete process.env.CDK_COMMAND;
