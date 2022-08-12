import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as apigateway from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'test-apigateway-restapi-defaults');

const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: true });

// at least one method is required
api.root.addMethod('GET');

new IntegTest(app, 'apigateway-restapi-defaults', {
  testCases: [stack],
});
