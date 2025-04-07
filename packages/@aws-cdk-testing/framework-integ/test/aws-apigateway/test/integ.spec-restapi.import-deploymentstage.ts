import * as cdk from 'aws-cdk-lib/core';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-specrestapi-import-deployment-stage');

const apiDefinition = {
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

// Set deploy to false so SpecRestApi does not automatically create a Deployment
const api = new apigateway.SpecRestApi(stack, 'my-api', {
  deploy: false,
  apiDefinition: apigateway.ApiDefinition.fromInline(apiDefinition),
});

// Manually create a deployment that deploys to an existing stage
const deployment = new apigateway.Deployment(stack, 'MyManualDeployment', {
  api: api,
  stageName: 'myStage',
});

deployment.addToLogicalId(apiDefinition);

new integ.IntegTest(app, 'specrestapi-import-deployment-stage', {
  testCases: [stack],
});

app.synth();
