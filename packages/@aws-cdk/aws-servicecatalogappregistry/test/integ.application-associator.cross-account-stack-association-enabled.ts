import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as appreg from '../lib';

// When doing a deployment for these stacks, specify stack `env` properties and use
// the same `account` for `localStack` and the TargetApplication stack, and a separate
// account for `crossAccountStack`.
// The accounts should be in the same AWS Organization with cross-account sharing enabled.

const app = new cdk.App();
const localStack = new cdk.Stack(app, 'integ-servicecatalogappregistry-local-resource');

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    associateCrossAccountStacks: true,
    applicationName: 'AppRegistryAssociatedApplication',
    stackName: 'TestAppRegistryApplicationStack',
  })],
});

const crossAccountStack = new cdk.Stack(app, 'integ-servicecatalogappregistry-cross-account-resource');

new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [localStack, crossAccountStack],
});

app.synth();