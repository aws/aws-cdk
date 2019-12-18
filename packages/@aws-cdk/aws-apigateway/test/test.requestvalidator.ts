import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as apigateway from '../lib';

export = {
  'default setup'(test: Test) {
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
      validateRequestParameters: false
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      ValidateRequestBody: true,
      ValidateRequestParameters: false
    }));

    test.done();
  },

  'no deployment'(test: Test) {
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
      validateRequestParameters: true
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      Name: "my-model",
      ValidateRequestBody: false,
      ValidateRequestParameters: true
    }));

    test.done();
  }
};
