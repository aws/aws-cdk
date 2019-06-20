import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

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
      options: {
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          title: "test",
          type: "object",
          properties: { message: { type: "string" } }
        }
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
      options: {
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          title: "test",
          type: "object",
          properties: { message: { type: "string" } }
        }
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
