#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as apigw from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-from-open-api-spec');

new apigw.SpecHttpApi(stack, 'oas-api', {
  apiDefinition: apigw.ApiDefinition.fromInline({
    openapi: '3.0.2',
    paths: {
      '/pets': {
        get: {
          'responses': {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Empty',
                  },
                },
              },
            },
          },
          'x-amazon-apigateway-integration': {
            responses: {
              default: {
                statusCode: '200',
              },
            },
            requestTemplates: {
              'application/json': '{"statusCode": 200}',
            },
            passthroughBehavior: 'when_no_match',
            type: 'mock',
          },
        },
      },
    },
    components: {
      schemas: {
        Empty: {
          title: 'Empty Schema',
          type: 'object',
        },
      },
    },
  }),
});

app.synth();
