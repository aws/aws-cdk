import * as cdk from 'aws-cdk-lib/core';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-import-deployment-stage');

// Set deploy to false so RestApi does not automatically create a Deployment
const api = new apigateway.RestApi(stack, 'my-api', {
  retainDeployments: true,
  deploy: false,
});
api.root.addMethod('GET');

// Manually create a deployment that deploys to an existing stage
const deployment = new apigateway.Deployment(stack, 'MyManualDeployment', {
  api: api,
  stageName: 'myStage',
});

// Generate a new logical ID so the deployment reflects changes made to api
deployment.addToLogicalId(`Deployment-${Date.now()}`);

new integ.IntegTest(app, 'restapi-import-deployment-stage', {
  testCases: [stack],
});

app.synth();