import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../../lib';

// tslint:disable:max-line-length

test('minimal setup (WebSocket)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketKnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Api', {
    Name: 'my-api',
    ProtocolType: 'WEBSOCKET',
    RouteSelectionExpression: '${context.routeKey}',
  }));

  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Deployment', {
    ApiId: { Ref: 'myapi4C7BF186' },
  }));

  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Stage', {
    ApiId: { Ref: 'myapi4C7BF186' },
    StageName: 'prod',
    DeploymentId: { Ref: 'myapiDeployment92F2CB49' },
  }));
});

test('minimal setup (WebSocket, no deploy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketKnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Api', {
    Name: 'my-api',
  }));

  cdkExpect(stack).notTo(haveResource('AWS::ApiGatewayV2::Deployment'));
  cdkExpect(stack).notTo(haveResource('AWS::ApiGatewayV2::Stage'));
});

test('minimal setup (no deploy, error)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  expect(() => {
    return new apigw.WebSocketApi(stack, 'my-api', {
      routeSelectionExpression: apigw.WebSocketKnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
      deploy: false,
      deployOptions: {
        stageName: 'testStage',
      },
    });
  }).toThrow();
});

test('URLs and ARNs (WebSocket)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', { routeSelectionExpression: apigw.WebSocketKnownRouteSelectionExpression.CONTEXT_ROUTE_KEY });
  const importedStage = apigw.WebSocketStage.fromStageName(stack, 'devStage', 'dev');

  // THEN
  expect(stack.resolve(api.clientUrl())).toEqual({ 'Fn::Join': [ '', [ 'wss://', { Ref: 'myapi4C7BF186' }, '.execute-api.', { Ref: 'AWS::Region' }, '.amazonaws.com/', { Ref: 'myapiDefaultStage51F6D7C3' } ] ] });
  expect(stack.resolve(api.clientUrl(importedStage))).toEqual({ 'Fn::Join': [ '', [ 'wss://', { Ref: 'myapi4C7BF186' }, '.execute-api.', { Ref: 'AWS::Region' }, '.amazonaws.com/dev' ] ] });

  expect(stack.resolve(api.connectionsUrl())).toEqual({ 'Fn::Join': [ '', [ 'https://', { Ref: 'myapi4C7BF186' }, '.execute-api.', { Ref: 'AWS::Region' }, '.amazonaws.com/', { Ref: 'myapiDefaultStage51F6D7C3' }, '/@connections' ] ] });
  expect(stack.resolve(api.connectionsUrl(importedStage))).toEqual({ 'Fn::Join': [ '', [ 'https://', { Ref: 'myapi4C7BF186' }, '.execute-api.', { Ref: 'AWS::Region' }, '.amazonaws.com/dev/@connections' ] ] });

  expect(stack.resolve(api.executeApiArn())).toEqual({ 'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':', { Ref: 'myapi4C7BF186' }, '/', { Ref: 'myapiDefaultStage51F6D7C3' }, '/*' ] ] });
  expect(stack.resolve(api.executeApiArn('routeKey'))).toEqual({ 'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':', { Ref: 'myapi4C7BF186' }, '/', { Ref: 'myapiDefaultStage51F6D7C3' }, '/routeKey' ] ] });
  expect(stack.resolve(api.executeApiArn(undefined, importedStage))).toEqual({ 'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':', { Ref: 'myapi4C7BF186' }, '/dev/*' ] ] });
  expect(stack.resolve(api.executeApiArn('routeKey', importedStage))).toEqual({ 'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':', { Ref: 'myapi4C7BF186' }, '/dev/routeKey' ] ] });

  expect(stack.resolve(api.connectionsApiArn())).toEqual({ 'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':', { Ref: 'myapi4C7BF186' }, '/', { Ref: 'myapiDefaultStage51F6D7C3' }, '/POST/*' ] ] });
  expect(stack.resolve(api.connectionsApiArn('my-connection'))).toEqual({ 'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':', { Ref: 'myapi4C7BF186' }, '/', { Ref: 'myapiDefaultStage51F6D7C3' }, '/POST/my-connection' ] ] });
  expect(stack.resolve(api.connectionsApiArn(undefined, importedStage))).toEqual({ 'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':', { Ref: 'myapi4C7BF186' }, '/dev/POST/*' ] ] });
  expect(stack.resolve(api.connectionsApiArn('my-connection', importedStage))).toEqual({ 'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':', { Ref: 'myapi4C7BF186' }, '/dev/POST/my-connection' ] ] });
});

test('URLs and ARNs (WebSocket, no deploy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketKnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  const importedStage = apigw.WebSocketStage.fromStageName(stack, 'devStage', 'dev');

  // THEN
  expect(stack.resolve(api.clientUrl(importedStage))).toEqual({ 'Fn::Join': [ '', [ 'wss://', { Ref: 'myapi4C7BF186' }, '.execute-api.', { Ref: 'AWS::Region' }, '.amazonaws.com/dev' ] ] });
  expect(stack.resolve(api.connectionsUrl(importedStage))).toEqual({ 'Fn::Join': [ '', [ 'https://', { Ref: 'myapi4C7BF186' }, '.execute-api.', { Ref: 'AWS::Region' }, '.amazonaws.com/dev/@connections' ] ] });

  expect(() => stack.resolve(api.clientUrl())).toThrow();
  expect(() => stack.resolve(api.connectionsUrl())).toThrow();
});