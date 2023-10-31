import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-spec-rest-api-origin-custom-origin');

const restApiSwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Example API',
    description: 'Example API for testing',
    version: '0.1.9',
  },
  servers: [
    {
      url: 'http://api.example.com/v1',
      description: 'Production endpoint',
    },
    {
      url: 'http://staging-api.example.com',
      description: 'Staging endpoint',
    },
  ],
  paths: {
    '/users': {
      get: {
        summary: 'Returns a list of users.',
        description: 'Optional extended description in CommonMark or HTML.',
        responses: {
          200: {
            description: 'A JSON array of user names',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: "string';",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const api = new apigateway.SpecRestApi(stack, 'RestApi', {
  apiDefinition: apigateway.ApiDefinition.fromInline(restApiSwaggerDefinition),
});

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.RestApiOrigin(api, { originPath: '/' }) },
});

new IntegTest(app, 'rest-api-origin-custom-origin-path', {
  testCases: [stack],
});