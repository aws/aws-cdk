import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'test-apigateway-restapi-defaults');

const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: true });

// at least one method is required
api.root.addMethod('GET');

new IntegTest(app, 'apigateway-restapi-defaults', {
  testCases: [stack],
});
