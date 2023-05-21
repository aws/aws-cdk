/*
 * integration tests act as snapshot tests to make sure the rendered template is stable.
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import * as core from 'aws-cdk-lib';
import * as vpclattice from '../lib';

const app = new core.App();

const stack = new core.Stack(app, 'vpcLatticeTestStack');

new vpclattice.ServiceNetwork(stack, 'ServiceNetwork', {
  name: 'serviceNetwork',
});

app.synth();
