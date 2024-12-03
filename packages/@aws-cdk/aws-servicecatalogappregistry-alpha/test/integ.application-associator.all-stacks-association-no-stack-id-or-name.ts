import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-application');

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    applicationName: 'AppRegistryAssociatedApplication',
  })],
});

new cdk.Stack(stack, 'resourcesStack');

new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [stack],
});

app.synth();
