import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as events from 'aws-cdk-lib/aws-events';
import * as api from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-events-targets-api-gateway-integ');

const specRestApi = new api.SpecRestApi(stack, 'MySpecRestApi', {
  apiDefinition: api.ApiDefinition.fromInline({
    openapi: '3.0.2',
    paths: {
      '/test': {
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

const rule = new events.Rule(stack, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

rule.addTarget(new targets.ApiGateway(specRestApi));

const testCase = new IntegTest(app, 'ApiGatewayTarget', {
  testCases: [stack],
});

// describe the results of the execution
const ruleDescription = testCase.assertions.awsApiCall('@aws-sdk/client-eventbridge', 'ListTargetsByRule', {
  Rule: rule.ruleName,
  EventBusName: 'default',
  Limit: 1,
});

// assert the results
ruleDescription.expect(ExpectedResult.objectLike({
  Targets: [
    {
      HttpParameters: {},
    },
  ],
}));

app.synth();
