import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-appregistry-disable-url');

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    applicationName: 'AppRegistryDisableUrlApp',
    stackName: 'AppRegistryDisableUrlAppStack',
    emitApplicationManagerUrlAsOutput: false,
  })],
});

new cdk.Stack(stack, 'resourcesStack');

const testCase = new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [stack],
});

// Disassociate stacks from the AppRegistry application before teardown.
// The integ-runner may destroy the application stack before the associated
// stacks finish deleting their CfnResourceAssociation, causing DELETE_FAILED.
const disassoc = testCase.assertions.awsApiCall('ServiceCatalogAppRegistry', 'disassociateResource', {
  application: 'AppRegistryDisableUrlApp',
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
