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
    deploy: false
  });
  const functionArn = stack.formatArn({ service: 'lambda', resource: 'function', resourceName: 'my-function', sep: ':'});
  new apigw.Authorizer(stack, 'authorizer', {
    authorizerName: 'my-authorizer',
    authorizerType: apigw.AuthorizerType.JWT,
    authorizerUri: `arn:${stack.partition}:apigateway:${stack.region}:lambda:path/2015-03-31/functions/${functionArn}/invocations`,
    api
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Authorizer", {
    ApiId: { Ref: "myapi4C7BF186" },
    Name: "my-authorizer",
    AuthorizerType: "JWT",
    AuthorizerUri: { "Fn::Join": ["", ["arn:", { Ref: "AWS::Partition" }, ":apigateway:", { Ref: "AWS::Region" }, ":lambda:path/2015-03-31/functions/arn:", { Ref: "AWS::Partition" }, ":lambda:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":function:my-function/invocations"]] },
    IdentitySource: []
  }));
});