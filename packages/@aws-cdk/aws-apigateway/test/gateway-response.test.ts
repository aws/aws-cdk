import '@aws-cdk/assert/jest';
import { ABSENT } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { ResponseType, RestApi } from '../lib';

describe('gateway response', () => {
  test('gateway response resource is created', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new RestApi(stack, 'restapi', {
      deploy: false,
      cloudWatchRole: false,
    });

    api.root.addMethod('GET');
    api.addGatewayResponse('test-response', {
      type: ResponseType.ACCESS_DENIED,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::GatewayResponse', {
      ResponseType: 'ACCESS_DENIED',
      RestApiId: stack.resolve(api.restApiId),
      StatusCode: ABSENT,
      ResponseParameters: ABSENT,
      ResponseTemplates: ABSENT,
    });
  });

  test('gateway response resource is created with parameters', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new RestApi(stack, 'restapi', {
      deploy: false,
      cloudWatchRole: false,
    });

    api.root.addMethod('GET');
    api.addGatewayResponse('test-response', {
      type: ResponseType.AUTHORIZER_FAILURE,
      statusCode: '500',
      responseHeaders: {
        'Access-Control-Allow-Origin': 'test.com',
        'test-key': 'test-value',
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::GatewayResponse', {
      ResponseType: 'AUTHORIZER_FAILURE',
      RestApiId: stack.resolve(api.restApiId),
      StatusCode: '500',
      ResponseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Origin': 'test.com',
        'gatewayresponse.header.test-key': 'test-value',
      },
      ResponseTemplates: ABSENT,
    });
  });

  test('gateway response resource is created with templates', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new RestApi(stack, 'restapi', {
      deploy: false,
      cloudWatchRole: false,
    });

    api.root.addMethod('GET');
    api.addGatewayResponse('test-response', {
      type: ResponseType.AUTHORIZER_FAILURE,
      statusCode: '500',
      templates: {
        'application/json': '{ "message": $context.error.messageString, "statusCode": "488" }',
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::GatewayResponse', {
      ResponseType: 'AUTHORIZER_FAILURE',
      RestApiId: stack.resolve(api.restApiId),
      StatusCode: '500',
      ResponseParameters: ABSENT,
      ResponseTemplates: {
        'application/json': '{ "message": $context.error.messageString, "statusCode": "488" }',
      },
    });
  });

  test('deployment changes when gateway response is updated', () => {
    // GIVEN
    const stack = new Stack();
    const restApi = new RestApi(stack, 'restapi', {
      deploy: true,
    });
    const deploymentResource = restApi.latestDeployment!.node.defaultChild;
    const logicalId = (deploymentResource as any).calculateLogicalId();

    // WHEN
    restApi.addGatewayResponse('gatewayResponse', {
      type: ResponseType.AUTHORIZER_CONFIGURATION_ERROR,
    });
    const newLogicalId = (deploymentResource as any).calculateLogicalId();

    // THEN
    expect(newLogicalId).not.toEqual(logicalId);
  });
});