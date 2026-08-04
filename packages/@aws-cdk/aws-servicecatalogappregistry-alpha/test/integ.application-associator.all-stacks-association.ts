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

const testCase = new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [stack],
});

// Disassociate all stacks from the AppRegistry application before teardown.
// The integ-runner may destroy the application stack before the associated
// stacks finish deleting their CfnResourceAssociation, causing DELETE_FAILED.
// Using the assertions phase (post-deploy, pre-destroy) to clean up.
const disassoc = testCase.assertions.awsApiCall('ServiceCatalogAppRegistry', 'disassociateResource', {
  application: 'AppRegistryAllStacksApp',
  resourceType: 'CFN_STACK',
  resource: stack.stackId,
});
disassoc.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    'servicecatalog:DisassociateResource',
    'resource-groups:DisassociateResource',
    'cloudformation:UpdateStack',
    'cloudformation:DescribeStacks',
    'tag:GetResources',
    'tag:UntagResources',
  ],
  Resource: ['*'],
});

app.synth();
