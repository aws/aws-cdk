/*import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as triggers from '@aws-cdk/triggers';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'TestStack');

const handler = new lambda.NodejsFunction(stack, 'Function', {
  entry: path.join(__dirname, 'integ-handlers/pnpm/dependencies-pnpm.ts'),
  runtime: Runtime.NODEJS_18_X,
  bundling: {
    minify: true,
    // Will be installed, not bundled
    // (axios is a package with sub-dependencies,
    // will be used to ensure pnpm bundling works as expected)
    nodeModules: ['axios'],
    forceDockerBundling: true,
  },
  depsLockFilePath: path.join(__dirname, 'integ-handlers/pnpm/pnpm-lock.yaml'),
});

new triggers.Trigger(stack, 'Trigger', {
  handler,
});

new integ.IntegTest(app, 'PnpmTest', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this will tell the runner to not check in assets.
});

app.synth();
*/
