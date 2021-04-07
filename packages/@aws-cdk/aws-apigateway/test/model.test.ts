import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as apigw from '../lib';

describe('model', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true });
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // WHEN
    new apigw.Model(stack, 'my-model', {
      restApi: api,
      schema: {
        schema: apigw.JsonSchemaVersion.DRAFT4,
        title: 'test',
        type: apigw.JsonSchemaType.OBJECT,
        properties: { message: { type: apigw.JsonSchemaType.STRING } },
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::Model', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      Schema: {
        $schema: 'http://json-schema.org/draft-04/schema#',
        title: 'test',
        type: 'object',
        properties: { message: { type: 'string' } },
      },
      ContentType: 'application/json',
    });
  });

  test('no deployment', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true });
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // WHEN
    new apigw.Model(stack, 'my-model', {
      restApi: api,
      schema: {
        schema: apigw.JsonSchemaVersion.DRAFT4,
        title: 'test',
        type: apigw.JsonSchemaType.OBJECT,
        properties: { message: { type: apigw.JsonSchemaType.STRING } },
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::Model', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      Schema: {
        $schema: 'http://json-schema.org/draft-04/schema#',
        title: 'test',
        type: 'object',
        properties: { message: { type: 'string' } },
      },
    });
  });
});
