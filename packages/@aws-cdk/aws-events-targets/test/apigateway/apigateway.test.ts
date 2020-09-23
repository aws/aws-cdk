import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as events from '@aws-cdk/aws-events';
import { Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

describe('ApiGateway event target', () => {
  let stack: Stack;
  let restApi: apigateway.RestApi;

  beforeEach(() => {
    stack = new Stack();
    restApi = new apigateway.RestApi(stack, 'MyApiGateway');
    restApi.root.addResource('v1').addResource('{id}').addMethod('PUT');
  });

  describe('when added to an event rule as a target', () => {
    let rule: events.Rule;

    beforeEach(() => {
      rule = new events.Rule(stack, 'rule', {
        schedule: events.Schedule.expression('rate(1 minute)'),
      });
    });

    describe('with default settings', () => {
      beforeEach(() => {
        rule.addTarget(new targets.ApiGateway(restApi));
      });

      test("adds the API Gateway's ARN and role to the targets of the rule", () => {
        expect(stack).to(haveResource('AWS::Events::Rule', {
          Targets: [
            {
              Arn: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':execute-api:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':',
                    {
                      Ref: 'MyApiGateway04A753E5',
                    },
                    '/*/*/*',
                  ],
                ],
              },
              Id: 'Target0',
              RoleArn: { 'Fn::GetAtt': ['MyApiGatewayEventsRole86361856', 'Arn'] },
            },
          ],
        }));
      });

      test("creates a policy that has Invoke permissions on the API Gateway's ARN", () => {
        expect(stack).to(haveResource('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':execute-api:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':',
                      {
                        Ref: 'MyApiGateway04A753E5',
                      },
                      '/*/*/*',
                    ],
                  ],
                },
              },
            ],
            Version: '2012-10-17',
          },
        }));
      });
    });

    describe('with parameters', () => {
      beforeEach(() => {
        rule.addTarget(new targets.ApiGateway(restApi, {
          path: '/v1/*',
          method: 'PUT',
          stage: 'prod',
          input: events.RuleTargetInput.fromObject({
            foo: events.EventField.fromPath('$.detail.bar'),
          }),
          httpParameters: {
            pathParameterValues: ['$.detail.id'],
          },
        }));
      });

      test("creates a policy that has Invoke permissions on the API Gateway's ARN", () => {
        expect(stack).to(haveResource('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':execute-api:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':',
                      {
                        Ref: 'MyApiGateway04A753E5',
                      },
                      '/prod/PUT/v1/*',
                    ],
                  ],
                },
              },
            ],
            Version: '2012-10-17',
          },
        }));
      });

      test('sets the parameters', () => {
        expect(stack).to(haveResourceLike('AWS::Events::Rule', {
          Targets: [
            {
              Arn: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':execute-api:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':',
                    {
                      Ref: 'MyApiGateway04A753E5',
                    },
                    '/prod/PUT/v1/*',
                  ],
                ],
              },
              HttpParameters: {
                PathParameterValues: [
                  '$.detail.id',
                ],
              },
              Id: 'Target0',
              InputTransformer: {
                InputPathsMap: {
                  'detail-bar': '$.detail.bar',
                },
                InputTemplate: '{\"foo\":<detail-bar>}',
              },
            },
          ],
        }));
      });
    });
  });
});