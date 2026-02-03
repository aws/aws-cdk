import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-application');

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    applicationName: 'AppRegistryNoStackIdApplication',
    env: { account: cdk.Aws.ACCOUNT_ID, region: cdk.Aws.REGION },
  })],
});

new cdk.Stack(app, 'resourcesStack', {
  env: { account: cdk.Aws.ACCOUNT_ID, region: cdk.Aws.REGION },
});

new integ.IntegTest(app, 'ApplicationAssociatorTest', {
  testCases: [stack],
});

app.synth();
