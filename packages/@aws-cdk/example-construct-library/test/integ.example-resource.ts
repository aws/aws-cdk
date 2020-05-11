/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import * as core from '@aws-cdk/core';
// as in unit tests, we use a qualified import,
// not bring in individual classes
import * as er from '../lib';

const app = new core.App();

const stack = new core.Stack(app, 'ExampleResourceIntegTestStack');

new er.ExampleResource(stack, 'ExampleResource', {
  // we don't want to leave trash in the account after running the deployment of this
  removalPolicy: core.RemovalPolicy.DESTROY,
});

app.synth();
