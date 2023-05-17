import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-cloudfront-rest-api-origin');

const api = new apigateway.RestApi(stack, 'RestApi', { endpointTypes: [apigateway.EndpointType.REGIONAL], cloudWatchRole: true });
api.root.addMethod('GET');

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.RestApiOrigin(api) },
});

new IntegTest(app, 'rest-api-origin', {
  testCases: [stack],
});
