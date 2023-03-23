import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as origins from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-cloudfront-rest-api-origin-custom-origin-path');

const api = new apigateway.RestApi(stack, 'RestApi', { endpointTypes: [apigateway.EndpointType.REGIONAL], cloudWatchRole: true });
api.root.addMethod('GET');

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.RestApiOrigin(api, { originPath: '/' }) },
});

new IntegTest(app, 'rest-api-origin-custom-origin-path', {
  testCases: [stack],
});