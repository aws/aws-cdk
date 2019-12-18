import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as apigw from '../lib';

export = {
  'default setup'(test: Test) {
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
        title: "test",
        type: apigw.JsonSchemaType.OBJECT,
        properties: { message: { type: apigw.JsonSchemaType.STRING } }
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
        title: "test",
        type: apigw.JsonSchemaType.OBJECT,
        properties: { message: { type: apigw.JsonSchemaType.STRING } }
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
