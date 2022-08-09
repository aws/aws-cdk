#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as apigw from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-from-open-api-spec');

new apigw.SpecHttpApi(stack, 'oas-api', {
  apiDefinition: apigw.ApiDefinition.fromInline({
    openapi: '3.0.0',
    info: {
      version: '0.0.0',
      title: 'Example API',
      description: 'An example OpenAPI spec.',
    },
    paths: {
      '/list': {
        get: {
          responses: {
            200: {
              description: 'Successful response',
            },
          },
        },
      },
    },
  }),
});

app.synth();
