import { App, Stack } from 'aws-cdk-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ga from 'aws-cdk-lib/aws-globalaccelerator';

const app = new App({});

const stack = new Stack(app, 'global-accelerator-unique-name');

new ga.Accelerator(stack, 'Accelerator');

new IntegTest(app, 'GlobalAcceleratorUniqueName', {
  testCases: [stack],
});

app.synth();
