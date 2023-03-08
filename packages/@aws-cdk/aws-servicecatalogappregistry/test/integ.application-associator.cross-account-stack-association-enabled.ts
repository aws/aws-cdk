import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as appreg from '../lib';

const app = new cdk.App();
const localStack = new cdk.Stack(app, 'integ-servicecatalogappregistry-first-resource');

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    associateCrossAccountStacks: true,
    applicationName: 'AppRegistryAssociatedApplication',
    stackName: 'TestAppRegistryApplicationStack',
  })],
});

new cdk.Stack(app, 'integ-servicecatalogappregistry-second-resource');

new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [localStack],
});

app.synth();