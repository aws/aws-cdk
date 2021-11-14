import * as assertions from '@aws-cdk/assertions';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { HttpMethod, CallApiGatewayHttpApiEndpoint, AuthType } from '../../lib';

describe('CallApiGatewayHttpApiEndpoint', () => {
  test('default', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

    // WHEN
    const task = new CallApiGatewayHttpApiEndpoint(stack, 'Call', {
      apiId: httpApi.apiId,
      apiStack: cdk.Stack.of(httpApi),
      method: HttpMethod.GET,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      End: true,
      Parameters: {
        ApiEndpoint: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'HttpApiF5A9A8A7',
              },
              '.execute-api.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
        AuthType: 'NO_AUTH',
        Method: 'GET',
      },
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::apigateway:invoke',
          ],
        ],
      },
    });
  });

  test('iam auth', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

    // WHEN
    const task = new CallApiGatewayHttpApiEndpoint(stack, 'Call', {
      apiId: httpApi.apiId,
      apiStack: cdk.Stack.of(httpApi),
      method: HttpMethod.GET,
      authType: AuthType.IAM_ROLE,
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definition: task,
    });

    // THEN
    const assertStack = assertions.Template.fromStack(stack);
    assertStack.hasResourceProperties('AWS::IAM::Policy', assertions.Match.objectLike({
      PolicyDocument: assertions.Match.objectLike({
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':execute-api:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':',
                  { Ref: 'HttpApiF5A9A8A7' },
                  '/$default/GET/',
                ],
              ],
            },
          },
        ],
      }),
    }));
  });

  test('iam auth with dynamic api path', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

    // WHEN
    const task = new CallApiGatewayHttpApiEndpoint(stack, 'Call', {
      apiId: httpApi.apiId,
      apiStack: cdk.Stack.of(httpApi),
      method: HttpMethod.GET,
      apiPath: sfn.JsonPath.stringAt('States.Format(\'foo/{}\', $.foo)'),
      authType: AuthType.IAM_ROLE,
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definition: task,
    });

    // THEN
    const assertStack = assertions.Template.fromStack(stack);
    assertStack.hasResourceProperties('AWS::IAM::Policy', assertions.Match.objectLike({
      PolicyDocument: assertions.Match.objectLike({
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':execute-api:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':',
                  { Ref: 'HttpApiF5A9A8A7' },
                  '/$default/GET/*',
                ],
              ],
            },
          },
        ],
      }),
    }));
  });

  test('wait for task token', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

    // WHEN
    const task = new CallApiGatewayHttpApiEndpoint(stack, 'Call', {
      apiId: httpApi.apiId,
      apiStack: cdk.Stack.of(httpApi),
      method: HttpMethod.GET,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      headers: sfn.TaskInput.fromObject({ TaskToken: sfn.JsonPath.taskToken }),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      End: true,
      Parameters: {
        ApiEndpoint: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'HttpApiF5A9A8A7',
              },
              '.execute-api.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
        AuthType: 'NO_AUTH',
        Headers: {
          'TaskToken.$': '$$.Task.Token',
        },
        Method: 'GET',
      },
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::apigateway:invoke.waitForTaskToken',
          ],
        ],
      },
    });
  });

  test('wait for task token - missing token', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

    // THEN
    expect(() => {
      new CallApiGatewayHttpApiEndpoint(stack, 'Call', {
        apiId: httpApi.apiId,
        apiStack: cdk.Stack.of(httpApi),
        method: HttpMethod.GET,
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      });
    }).toThrow(/Task Token is required in `headers` for WAIT_FOR_TASK_TOKEN pattern. Use JsonPath.taskToken to set the token./);
  });

  test('unsupported integration pattern - RUN_JOB', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

    // THEN
    expect(() => {
      new CallApiGatewayHttpApiEndpoint(stack, 'Call', {
        apiId: httpApi.apiId,
        apiStack: cdk.Stack.of(httpApi),
        method: HttpMethod.GET,
        integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      });
    }).toThrow(/Unsupported service integration pattern./);
  });

  test('render Stage field', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');

    // WHEN
    const task = new CallApiGatewayHttpApiEndpoint(stack, 'Call', {
      apiId: httpApi.apiId,
      apiStack: cdk.Stack.of(httpApi),
      method: HttpMethod.GET,
      stageName: 'stage',
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      End: true,
      Parameters: {
        ApiEndpoint: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'HttpApiF5A9A8A7',
              },
              '.execute-api.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
        AuthType: 'NO_AUTH',
        Method: 'GET',
        Stage: 'stage',
      },
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::apigateway:invoke',
          ],
        ],
      },
    });
  });
});
