/// !cdk-integ integ-servicecatalogappregistry-application
import * as cdk from '@aws-cdk/core';
import * as appreg from '../lib';


const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-application');


new appreg.RegisterApplication(app, 'RegisterCdkApplication', {
  applicationName: 'AppRegistryRegisterApplication',
  description: 'Testing AppRegistry RegisterApplication',
  stackProps: {
    stackName: 'AppRegistryRegisterApplicationStack',
  },
});

new cdk.Stack(stack, 'resourcesStack');

app.synth();
