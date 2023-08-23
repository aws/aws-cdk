import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'test-apigateway-restapi-cloudwatch-removal-policy');

const api = new apigateway.RestApi(stack, 'my-api', {
  cloudWatchRole: true,
  cloudWatchRoleRemovalPolicy: cdk.RemovalPolicy.DESTROY,
});

api.root.addMethod('GET');

new IntegTest(app, 'apigateway-restapi-cloudwatch-removal-policy', {
  testCases: [stack],
});

app.synth();
