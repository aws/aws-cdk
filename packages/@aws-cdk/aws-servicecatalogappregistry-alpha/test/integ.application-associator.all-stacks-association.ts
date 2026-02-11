import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-appregistry-all-stacks');

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    applicationName: 'AppRegistryAllStacksApp',
    stackName: 'AppRegistryAllStacksAppStack',
  })],
});

new cdk.Stack(stack, 'resourcesStack');

new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      // ApplicationAssociator associates stacks with the AppRegistry application.
      // On teardown, CloudFormation tries to delete the application before
      // disassociating the stacks, causing DELETE_FAILED. This is an
      // AppRegistry service limitation, not a test defect.
      expectError: true,
    },
  },
});

app.synth();
