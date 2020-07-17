import * as cdk from '@aws-cdk/core';
import * as apigateway from '../lib';

/*
 * Stack verification steps:
 * * `curl -i <CFN output PetsURL>` should return HTTP code 200 if private DNS is been enable.
 * * You will need access to the configured VPC. There are multiple ways to invoke the API.
 * * Find more information in the API Gateway documentation page in the following section:
 * * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-api-test-invoke-url.html
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-fromdefinition-inline-private');

const api = new apigateway.SpecRestApi(stack, 'my-private-api', {
  apiDefinition: apigateway.ApiDefinition.fromInline({
    'openapi': '3.0.2',
    'info': {
      version: '1.0.0',
      title: 'Test API for CDK',
    },
    'servers': [
      {
        'x-amazon-apigateway-endpoint-configuration': {
          vpcEndpointIds: [
            'vpce-00111a1111a1aa011',
          ],
        },
      },
    ],
    'paths': {
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
    'x-amazon-apigateway-policy': {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: [
            'execute-api:Invoke',
            'execute-api:GET',
          ],
          Resource: 'arn:aws:execute-api:${AWS::Region}:${AWS::AccountId}:*',
          Condition: {
            StringEquals: {
              'aws:sourceVpce': 'vpce-00111a1111a1aa011',
            },
          },
        },
      ],
    },
    'components': {
      schemas: {
        Empty: {
          title: 'Empty Schema',
          type: 'object',
        },
      },
    },
  }),
  endpointTypes: [apigateway.EndpointType.PRIVATE],
});

new cdk.CfnOutput(stack, 'PetsURL', {
  value: api.urlForPath('/pets'),
});

app.synth();
