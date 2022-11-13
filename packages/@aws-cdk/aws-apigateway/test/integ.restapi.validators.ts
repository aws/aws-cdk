import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as apigateway from '../lib';

class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'my-api');

    const foo = api.root.addResource('foo');
    const bar = api.root.addResource('bar');

    foo.addMethod(
      'POST',
      new apigateway.HttpIntegration('http://example.com/foo'),
      {
        requestModels: {
          'application/json': api.addModel('FooModel', {
            schema: {
              type: apigateway.JsonSchemaType.OBJECT,
              properties: {
                foo: {
                  type: apigateway.JsonSchemaType.STRING,
                },
              },
            },
          }),
        },
        requestValidatorOptions: {
          validateRequestBody: true,
        },
      },
    );
    bar.addMethod(
      'POST',
      new apigateway.HttpIntegration('http://example.com/bar'),
      {
        requestModels: {
          'application/json': api.addModel('BarModel', {
            schema: {
              type: apigateway.JsonSchemaType.OBJECT,
              properties: {
                bar: {
                  type: apigateway.JsonSchemaType.STRING,
                },
              },
            },
          }),
        },
        requestValidatorOptions: {
          validateRequestBody: true,
        },
      },
    );
  }
}

const app = new cdk.App();

const testCase = new Test(app, 'test-apigateway-restapi');
new IntegTest(app, 'apigateway-restapi', {
  testCases: [testCase],
});

