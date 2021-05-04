import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as apigateway from '../lib';

describe('request validator', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true });
    new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // WHEN
    new apigateway.RequestValidator(stack, 'my-model', {
      restApi: api,
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      ValidateRequestBody: true,
      ValidateRequestParameters: false,
    });
  });

  test('no deployment', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // WHEN
    new apigateway.RequestValidator(stack, 'my-model', {
      restApi: api,
      requestValidatorName: 'my-model',
      validateRequestBody: false,
      validateRequestParameters: true,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      Name: 'my-model',
      ValidateRequestBody: false,
      ValidateRequestParameters: true,
    });
  });
});
