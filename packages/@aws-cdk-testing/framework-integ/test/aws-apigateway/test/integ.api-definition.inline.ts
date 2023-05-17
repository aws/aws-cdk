import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

/*
 * Stack verification steps:
 * * `curl -i <CFN output PetsURL>` should return HTTP code 200
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-fromdefinition-inline');

const api = new apigateway.SpecRestApi(stack, 'my-api', {
  cloudWatchRole: true,
  apiDefinition: apigateway.ApiDefinition.fromInline({
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
  }),
});

new cdk.CfnOutput(stack, 'PetsURL', {
  value: api.urlForPath('/pets'),
});

new IntegTest(app, 'inline-api-definition', {
  testCases: [stack],
});
