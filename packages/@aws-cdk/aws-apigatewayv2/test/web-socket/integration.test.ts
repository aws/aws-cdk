import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../../lib';

// tslint:disable:max-line-length

test('Http integration (WebSocket)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addHttpIntegration('myFunction', {
    url: 'https://test.example.com/',
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: apigw.WebSocketIntegrationType.HTTP,
    IntegrationUri: 'https://test.example.com/',
  }));
});

test('Http integration (WebSocket, proxy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addHttpIntegration('myFunction', {
    url: 'https://test.example.com/',
    proxy: true,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: apigw.WebSocketIntegrationType.HTTP_PROXY,
    IntegrationUri: 'https://test.example.com/',
  }));
});

test('Lambda integration (WebSocket)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: apigw.WebSocketIntegrationType.AWS,
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':lambda:path/2015-03-31/functions/arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':function:my-function/invocations']] },
  }));
});

test('Lambda integration (WebSocket, proxy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
    proxy: true,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: apigw.WebSocketIntegrationType.AWS_PROXY,
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':lambda:path/2015-03-31/functions/arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':function:my-function/invocations']] },
  }));
});

test('Mock integration (WebSocket)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addMockIntegration('myMock', { });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: apigw.WebSocketIntegrationType.MOCK,
    IntegrationUri: '',
  }));
});

test('Service integration (WebSocket)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addServiceIntegration('myService', {
    arn: stack.formatArn({ service: 'dynamodb', resource: 'table', resourceName: 'my-table', sep: '/'}),
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: apigw.WebSocketIntegrationType.AWS,
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':dynamodb:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':table/my-table']] },
  }));
});

test('Service integration (WebSocket, proxy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addServiceIntegration('myService', {
    arn: stack.formatArn({ service: 'dynamodb', resource: 'table', resourceName: 'my-table', sep: '/'}),
    proxy: true,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: apigw.WebSocketIntegrationType.AWS_PROXY,
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':dynamodb:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':table/my-table']] },
  }));
});

test('Lambda integration (WebSocket, with extra params)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
    connectionType: apigw.WebSocketConnectionType.INTERNET,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'AWS',
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':lambda:path/2015-03-31/functions/arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':function:my-function/invocations']] },
    ConnectionType: 'INTERNET',
  }));
});

test('Integration response', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  const integration = api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
  });
  integration.addResponse(apigw.WebSocketIntegrationResponseKey.DEFAULT);

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::IntegrationResponse', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationId: { Ref: 'myapimyFunctionlambdaintegrationB6693307' },
    IntegrationResponseKey: '$default',
  }));
});