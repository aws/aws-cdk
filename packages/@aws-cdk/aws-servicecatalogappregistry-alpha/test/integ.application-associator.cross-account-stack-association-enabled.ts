import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as appreg from '../lib';

// Modified to work within single account for integration testing
// Cross-account functionality would require proper AWS Organizations setup

const app = new cdk.App();
const localStack = new cdk.Stack(app, 'integ-servicecatalogappregistry-local-resource', {
  env: { account: cdk.Aws.ACCOUNT_ID, region: cdk.Aws.REGION },
});

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    associateCrossAccountStacks: false, // Disabled for single-account testing
    applicationName: 'AppRegistryCrossAccountApplication',
    stackName: 'TestAppRegistryCrossAccountStack',
    env: { account: cdk.Aws.ACCOUNT_ID, region: cdk.Aws.REGION },
  })],
});

const secondStack = new cdk.Stack(app, 'integ-servicecatalogappregistry-second-resource', {
  env: { account: cdk.Aws.ACCOUNT_ID, region: cdk.Aws.REGION },
});

new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [localStack, secondStack],
});

app.synth();
