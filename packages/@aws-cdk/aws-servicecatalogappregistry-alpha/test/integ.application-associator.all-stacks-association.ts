/// !cdk-integ integ-servicecatalogappregistry-application
import * as cdk from 'aws-cdk-lib';
import * as appreg from '../lib';

const app = new cdk.App();

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [appreg.TargetApplication.createApplicationStack({
    applicationName: 'AppRegistryAllStacksApplication',
    stackName: 'AppRegistryAllStacksAssociatorStack',
    env: { account: cdk.Aws.ACCOUNT_ID, region: cdk.Aws.REGION },
  })],
});

new cdk.Stack(app, 'resourcesStack', {
  env: { account: cdk.Aws.ACCOUNT_ID, region: cdk.Aws.REGION },
});

app.synth();
