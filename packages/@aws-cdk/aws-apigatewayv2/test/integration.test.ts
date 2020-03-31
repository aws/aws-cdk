import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

// tslint:disable:max-line-length

test('Lambda integration', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    deploy: false
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'}))
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Integration", {
    ApiId: { Ref: "myapi4C7BF186" },
    IntegrationType: apigw.IntegrationType.AWS,
    IntegrationUri: { "Fn::Join": ["", ["arn:", { Ref: "AWS::Partition" }, ":apigateway:", { Ref: "AWS::Region" }, ":lambda:path/2015-03-31/functions/arn:", { Ref: "AWS::Partition" }, ":lambda:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":function:my-function/invocations"]] }
  }));
});

test('Lambda integration (with extra params)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    deploy: false
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
    connectionType: apigw.ConnectionType.INTERNET,
    integrationMethod: apigw.IntegrationMethod.GET
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Integration", {
    ApiId: { Ref: "myapi4C7BF186" },
    IntegrationType: apigw.IntegrationType.AWS,
    IntegrationUri: { "Fn::Join": ["", ["arn:", { Ref: "AWS::Partition" }, ":apigateway:", { Ref: "AWS::Region" }, ":lambda:path/2015-03-31/functions/arn:", { Ref: "AWS::Partition" }, ":lambda:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":function:my-function/invocations"]] },
    IntegrationMethod: apigw.IntegrationMethod.GET,
    ConnectionType: apigw.ConnectionType.INTERNET
  }));
});

test('Lambda integration (proxy)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    deploy: false
  });
  api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'})),
    proxy: true
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Integration", {
    ApiId: { Ref: "myapi4C7BF186" },
    IntegrationType: apigw.IntegrationType.AWS_PROXY,
    IntegrationUri: { "Fn::Join": ["", ["arn:", { Ref: "AWS::Partition" }, ":apigateway:", { Ref: "AWS::Region" }, ":lambda:path/2015-03-31/functions/arn:", { Ref: "AWS::Partition" }, ":lambda:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":function:my-function/invocations"]] }
  }));
});

test('Integration response', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    deploy: false
  });
  const integration = api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'}))
  });
  integration.addResponse(apigw.KnownIntegrationResponseKey.DEFAULT);

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::IntegrationResponse", {
    ApiId: { Ref: "myapi4C7BF186" },
    IntegrationId: { Ref: "myapimyFunction27BC3796" },
    IntegrationResponseKey: apigw.KnownIntegrationResponseKey.DEFAULT
  }));
});