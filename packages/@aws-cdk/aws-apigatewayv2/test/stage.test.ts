import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

// tslint:disable:max-line-length

test('minimal setup', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    protocolType: apigw.ProtocolType.WEBSOCKET,
    routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false
  });
  const deployment = new apigw.Deployment(stack, 'deployment', {
    api
  });
  new apigw.Stage(stack, 'stage', {
    api,
    deployment,
    stageName: 'dev'
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Stage", {
    ApiId: { Ref: "myapi4C7BF186" },
    StageName: "dev",
    DeploymentId: { Ref: "deployment33381975F8795BE8" },
  }));
});