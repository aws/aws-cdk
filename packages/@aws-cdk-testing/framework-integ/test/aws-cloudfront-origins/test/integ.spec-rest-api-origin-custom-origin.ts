import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-spec-rest-api-origin-custom-origin');

const restApiSwaggerDefinition = {
  openapi: '3.0.2',
  info: {
    version: '1.0.0',
    title: 'Test API for CDK',
  },
  paths: {
    '/pets': {
      get: {
        'summary': 'Test Method',
        'operationId': 'testMethod',
        'responses': {
          200: {
            description: 'A paged array of pets',
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
