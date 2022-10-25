/// !cdk-integ integ-servicecatalogappregistry-application
import * as cdk from '@aws-cdk/core';
import * as appreg from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-application');


new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  appAssociatorProps: [appreg.ApplicationAssociatorPropsInputFactory.getApplicationAssociatorPropsFromAppName('AppRegistryAssociatedApplication', {
    stackName: 'AppRegistryApplicationAssociatorStack',
  }, 'Testing AppRegistry ApplicationAssociator')],
});

new cdk.Stack(stack, 'resourcesStack');

app.synth();
