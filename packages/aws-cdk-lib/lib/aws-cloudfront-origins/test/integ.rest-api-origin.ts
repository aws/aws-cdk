import * as apigateway from '../../aws-apigateway';
import * as cloudfront from '../../aws-cloudfront';
import * as cdk from '../../core';
import { IntegTest } from '../../integ-tests';
import * as origins from '../lib';

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
