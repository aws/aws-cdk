import { App, Stack } from 'aws-cdk-lib';

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ga from 'aws-cdk-lib/aws-globalaccelerator';

const app = new App({ context: { '@aws-cdk/core:disableGitSource': true } });

const stack = new Stack(app, 'global-accelerator-unique-name');

new ga.Accelerator(stack, 'Accelerator');

new IntegTest(app, 'GlobalAcceleratorUniqueName', {
  testCases: [stack],
});

app.synth();
