#!/usr/bin/env node
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'WebSocketApiDisableExecuteApiEndpointStack');

const api = new apigw.WebSocketApi(stack, 'WebSocketApi', {
  disableExecuteApiEndpoint: true,
});

const integ = new IntegTest(app, 'WebSocketApiDisableExecuteApiEndpointInteg', {
  testCases: [stack],
});

integ.assertions.awsApiCall('ApiGatewayV2', 'getApi', {
  ApiId: api.apiId,
}).expect(ExpectedResult.objectLike({
  DisableExecuteApiEndpoint: true,
}));
