/// !cdk-integ integ-servicecatalogappregistry-application
import * as cdk from '@aws-cdk/core';
import * as appreg from '../lib';


const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalogappregistry-application');


new appreg.AutomaticApplication(app, 'AutoApplication', {
  applicationName: 'AppRegistryAutomaticApplication',
  description: 'Testing AppRegistry AutomaticApplication',
  stackProps: {
    stackName: 'AppRegistryAutoApplicationStack',
  },
});

new cdk.Stack(stack, 'resourcesStack');

app.synth();
