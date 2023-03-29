import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-application');

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    applicationName: 'AppRegistryAssociatedApplication',
    emitApplicationManagerUrlAsOutput: false,
  })],
});

new cdk.Stack(stack, 'resourcesStack');

new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [stack],
});

app.synth();