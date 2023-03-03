import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as appreg from '../lib';

const app = new cdk.App();
const localStack = new cdk.Stack(app, 'integ-servicecatalogappregistry-local-resource');

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    enableCrossAccountStacks: true,
    applicationName: 'AppRegistryAssociatedApplication',
    stackName: 'TestAppRegistryApplicationStack',
  })],
});

new cdk.Stack(app, 'integ-servicecatalogappregistry-cross-account-resource', {
  env: {
    account: '123456',
  },
});

new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [localStack],
});

app.synth();