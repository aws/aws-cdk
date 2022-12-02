import * as cdk from '@aws-cdk/core';
import { Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as appreg from '../lib';

const app = new cdk.App();
const stackUsEast1 = new Stack(app, 'integ-servicecatalogappregistry-application-us-east-1', {
  env: {
    region: 'us-east-1',
  },
});
const stackUsWest2 = new Stack(app, 'integ-servicecatalogappregistry-application-us-west-2', {
  env: {
    region: 'us-west-2',
  },
});

new appreg.ApplicationAssociator(app, 'RegisterCdkApplication', {
  applications: [
    appreg.TargetApplication.createApplicationStack({
      applicationName: 'AppRegistryAssociatedApplication',
      stackName: 'AppRegistryApplicationAssociatorStack',
      env: {
        region: 'us-east-1',
      },
    }),
    appreg.TargetApplication.createApplicationStack({
      applicationName: 'AppRegistryAssociatedApplication',
      stackName: 'AppRegistryApplicationAssociatorStack',
      env: {
        region: 'us-west-2',
      },
    }),
  ],
});

new cdk.Stack(stackUsEast1, 'resourcesStack-us-east-1', {
  env: {
    region: 'us-east-1',
  },
});

new cdk.Stack(stackUsWest2, 'resourcesStack-us-west-2', {
  env: {
    region: 'us-west-2',
  },
});

new integ.IntegTest(app, 'ServiceCatalogAppRegistryMultiRegionAppTests', {
  testCases: [
    stackUsEast1,
    stackUsWest2,
  ],
  /**
   * Override default 'DeployAssert' test stack which would cause ApplicationAsssociator to throw an error
   * due to its region not being specified. No assertions performed for now.
   */
  assertionStack: stackUsEast1,
});

app.synth();
