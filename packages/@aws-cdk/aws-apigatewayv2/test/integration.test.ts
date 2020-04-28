import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

// tslint:disable:max-line-length

test('Lambda integration (WebSocket)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: apigw.IntegrationType.AWS,
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':lambda:path/2015-03-31/functions/arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':function:my-function/invocations']] },
  }));
});

test('Lambda integration (WebSocket, with extra params)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
    connectionType: apigw.ConnectionType.INTERNET,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'AWS',
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':lambda:path/2015-03-31/functions/arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':function:my-function/invocations']] },
    IntegrationMethod: 'POST',
    ConnectionType: 'INTERNET',
  }));
});

test('Lambda integration (WebSocket, proxy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
    proxy: true,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'AWS_PROXY',
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':lambda:path/2015-03-31/functions/arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':function:my-function/invocations']] },
    IntegrationMethod: 'POST',
  }));
});

test('Lambda integration (HTTP)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.HttpApi(stack, 'my-api', {
    deploy: false,
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'AWS_PROXY',
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':lambda:path/2015-03-31/functions/arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':function:my-function/invocations']] },
    IntegrationMethod: 'POST',
  }));
});

test('Http integration (HTTP)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.HttpApi(stack, 'my-api', {
    deploy: false,
  });
  api.addHttpIntegration('myFunction', {
    url: 'https://aws.amazon.com/',
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'HTTP_PROXY',
    IntegrationUri: 'https://aws.amazon.com/',
    IntegrationMethod: 'ANY',
  }));

  api.addHttpIntegration('myFunction2', {
    url: 'https://console.aws.amazon.com/',
    integrationMethod: 'POST',
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'HTTP_PROXY',
    IntegrationUri: 'https://aws.amazon.com/',
    IntegrationMethod: 'ANY',
  }));
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'HTTP_PROXY',
    IntegrationUri: 'https://console.aws.amazon.com/',
    IntegrationMethod: 'POST',
  }));
});

test('Service integration (HTTP)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.HttpApi(stack, 'my-api', {
    deploy: false,
  });
  api.addServiceIntegration('myObject', {
    arn: stack.formatArn({ service: 's3', account: '', region: '', resource: 'my-bucket', resourceName: 'my-key', sep: '/'}),
  });
  api.addServiceIntegration('myOtherObject', {
    integrationMethod: 'GET',
    arn: stack.formatArn({ service: 's3', account: '', region: '', resource: 'my-bucket', resourceName: 'my-other-key', sep: '/'}),
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'AWS_PROXY',
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket/my-key']] },
    IntegrationMethod: 'ANY',
  }));
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Integration', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationType: 'AWS_PROXY',
    IntegrationUri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket/my-other-key']] },
    IntegrationMethod: 'GET',
  }));
});

test('Integration response', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  const integration = api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
  });
  integration.addResponse(apigw.KnownIntegrationResponseKey.DEFAULT);

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::IntegrationResponse', {
    ApiId: { Ref: 'myapi4C7BF186' },
    IntegrationId: { Ref: 'myapimyFunctionlambdaintegrationB6693307' },
    IntegrationResponseKey: '$default',
  }));
});