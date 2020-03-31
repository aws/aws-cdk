import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

// tslint:disable:max-line-length

test('minimal setup', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new apigw.Api(stack, 'my-api');

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Api", {
    Name: 'my-api',
    ProtocolType: apigw.ProtocolType.WEBSOCKET,
    RouteSelectionExpression: '${request.body.action}'
  }));

  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Deployment", {
    ApiId: { Ref: "myapi4C7BF186" }
  }));

  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Stage", {
    ApiId: { Ref: "myapi4C7BF186" },
    StageName: "prod",
    DeploymentId: { Ref: "myapiDeployment92F2CB492D341D1B" },
  }));
});

test('minimal setup (no deploy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new apigw.Api(stack, 'my-api', {
    deploy: false
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Api", {
    Name: 'my-api'
  }));

  cdkExpect(stack).notTo(haveResource("AWS::ApiGatewayV2::Deployment"));
  cdkExpect(stack).notTo(haveResource("AWS::ApiGatewayV2::Stage"));
});

test('minimal setup (no deploy, error)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  expect(() => {
    return new apigw.Api(stack, 'my-api', {
      deploy: false,
      deployOptions: {
        stageName: 'testStage'
      }
    });
  }).toThrow();
});

test('URLs and ARNs', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api');
  const importedStage = apigw.Stage.fromStageName(stack, 'devStage', 'dev');
  const importedRoute = apigw.Route.fromRouteAttributes(stack, 'devRoute', {
    key: 'routeKey',
    routeId: 'routeId'
  });

  // THEN
  expect(stack.resolve(api.clientUrl())).toEqual({ "Fn::Join": [ "", [ "wss://", { Ref: "myapi4C7BF186" }, ".execute-api.", { Ref: "AWS::Region" }, ".amazonaws.com/", { Ref: "myapiStageprod07E02E1F" } ] ] });
  expect(stack.resolve(api.clientUrl(importedStage))).toEqual({ "Fn::Join": [ "", [ "wss://", { Ref: "myapi4C7BF186" }, ".execute-api.", { Ref: "AWS::Region" }, ".amazonaws.com/dev" ] ] });

  expect(stack.resolve(api.connectionsUrl())).toEqual({ "Fn::Join": [ "", [ "https://", { Ref: "myapi4C7BF186" }, ".execute-api.", { Ref: "AWS::Region" }, ".amazonaws.com/", { Ref: "myapiStageprod07E02E1F" }, "/@connections" ] ] });
  expect(stack.resolve(api.connectionsUrl(importedStage))).toEqual({ "Fn::Join": [ "", [ "https://", { Ref: "myapi4C7BF186" }, ".execute-api.", { Ref: "AWS::Region" }, ".amazonaws.com/dev/@connections" ] ] });

  expect(stack.resolve(api.executeApiArn())).toEqual({ "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":", { Ref: "myapi4C7BF186" }, "/", { Ref: "myapiStageprod07E02E1F" }, "/*" ] ] });
  expect(stack.resolve(api.executeApiArn(importedRoute))).toEqual({ "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":", { Ref: "myapi4C7BF186" }, "/", { Ref: "myapiStageprod07E02E1F" }, "/routeKey" ] ] });
  expect(stack.resolve(api.executeApiArn(undefined, importedStage))).toEqual({ "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":", { Ref: "myapi4C7BF186" }, "/dev/*" ] ] });
  expect(stack.resolve(api.executeApiArn(importedRoute, importedStage))).toEqual({ "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":", { Ref: "myapi4C7BF186" }, "/dev/routeKey" ] ] });

  expect(stack.resolve(api.connectionsApiArn())).toEqual({ "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":", { Ref: "myapi4C7BF186" }, "/", { Ref: "myapiStageprod07E02E1F" }, "/POST/*" ] ] });
  expect(stack.resolve(api.connectionsApiArn('my-connection'))).toEqual({ "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":", { Ref: "myapi4C7BF186" }, "/", { Ref: "myapiStageprod07E02E1F" }, "/POST/my-connection" ] ] });
  expect(stack.resolve(api.connectionsApiArn(undefined, importedStage))).toEqual({ "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":", { Ref: "myapi4C7BF186" }, "/dev/POST/*" ] ] });
  expect(stack.resolve(api.connectionsApiArn('my-connection', importedStage))).toEqual({ "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":", { Ref: "myapi4C7BF186" }, "/dev/POST/my-connection" ] ] });
});

test('URLs and ARNs (no deploy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    deploy: false
  });
  const importedStage = apigw.Stage.fromStageName(stack, 'devStage', 'dev');

  // THEN
  expect(stack.resolve(api.clientUrl(importedStage))).toEqual({ "Fn::Join": [ "", [ "wss://", { Ref: "myapi4C7BF186" }, ".execute-api.", { Ref: "AWS::Region" }, ".amazonaws.com/dev" ] ] });
  expect(stack.resolve(api.connectionsUrl(importedStage))).toEqual({ "Fn::Join": [ "", [ "https://", { Ref: "myapi4C7BF186" }, ".execute-api.", { Ref: "AWS::Region" }, ".amazonaws.com/dev/@connections" ] ] });

  expect(() => stack.resolve(api.clientUrl())).toThrow();
  expect(() => stack.resolve(api.connectionsUrl())).toThrow();
});