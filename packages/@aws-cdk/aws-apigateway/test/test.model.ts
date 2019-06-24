import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import apigateway = require('../lib');
import { JsonSchemaType, JsonSchemaVersion } from '../lib';

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
    new apigateway.Model(stack, 'my-model', {
      restApi: api,
      schema: {
        schema: JsonSchemaVersion.DRAFT4,
        title: "test",
        type: JsonSchemaType.OBJECT,
        properties: { message: { type: JsonSchemaType.STRING } }
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      Schema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "test",
        type: "object",
        properties: { message: { type: "string" } }
      }
    }));

    test.done();
  },

  'no deployment'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true });
    new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // WHEN
    new apigateway.Model(stack, 'my-model', {
      restApi: api,
      schema: {
        schema: JsonSchemaVersion.DRAFT4,
        title: "test",
        type: JsonSchemaType.OBJECT,
        properties: { message: { type: JsonSchemaType.STRING } }
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      Schema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "test",
        type: "object",
        properties: { message: { type: "string" } }
      }
    }));

    test.done();
  }
};
