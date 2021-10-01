import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpRoute, HttpRouteKey } from '@aws-cdk/aws-apigatewayv2';
import { StateMachine, Chain, Pass, StateMachineType } from '@aws-cdk/aws-stepfunctions';
import { Stack, Duration } from '@aws-cdk/core';
import { StepFunctionsStartExecutionIntegration, StepFunctionsStartSyncExecutionIntegration } from '../../lib';

describe('AwsServiceIntegration', () => {
  test('StepFunctions-StartExecution', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    new HttpRoute(stack, 'StepFunctionsStartExeRoute', {
      httpApi: api,
      integration: new StepFunctionsStartExecutionIntegration(stack, {
        stateMachine: stateMachine(stack),
        name: 'MyExe',
        input: '$request.body',
        timeout: Duration.seconds(10),
        description: 'Start execution of state machine',
      }),
      routeKey: HttpRouteKey.with('/start'),
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      ApiId: {
        Ref: 'HttpApiF5A9A8A7',
      },
      IntegrationType: 'AWS_PROXY',
      CredentialsArn: {
        'Fn::GetAtt': [
          'StepFunctionsStartExeRouteApiGatewayIntegrationRoleE88875A9',
          'Arn',
        ],
      },
      Description: 'Start execution of state machine',
      IntegrationSubtype: 'StepFunctions-StartExecution',
      PayloadFormatVersion: '1.0',
      RequestParameters: {
        StateMachineArn: {
          Ref: 'MyStateMachine6C968CA5',
        },
        Name: 'MyExe',
        Input: '$request.body',
      },
      TimeoutInMillis: 10000,
    });
  });

  test('StepFunctions-StartSyncExecution', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    new HttpRoute(stack, 'StepFunctionsStartSyncExeRoute', {
      httpApi: api,
      integration: new StepFunctionsStartSyncExecutionIntegration(stack, {
        stateMachine: new StateMachine(stack, 'MyStateMachine', {
          stateMachineName: 'MyStateMachine',
          definition: Chain.start(new Pass(stack, 'Pass')),
          stateMachineType: StateMachineType.EXPRESS,
        }),
        name: 'MyExe',
        input: '$request.body',
        timeout: Duration.seconds(10),
      }),
      routeKey: HttpRouteKey.with('/startSync'),
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      ApiId: {
        Ref: 'HttpApiF5A9A8A7',
      },
      IntegrationType: 'AWS_PROXY',
      CredentialsArn: {
        'Fn::GetAtt': [
          'StepFunctionsStartSyncExeRouteApiGatewayIntegrationRole67241EA0',
          'Arn',
        ],
      },
      IntegrationSubtype: 'StepFunctions-StartSyncExecution',
      PayloadFormatVersion: '1.0',
      RequestParameters: {
        StateMachineArn: {
          Ref: 'MyStateMachine6C968CA5',
        },
        Name: 'MyExe',
        Input: '$request.body',
      },
      TimeoutInMillis: 10000,
    });
  });
});

function stateMachine(stack: Stack): StateMachine {
  return new StateMachine(stack, 'MyStateMachine', {
    stateMachineName: 'MyStateMachine',
    definition: Chain.start(new Pass(stack, 'Pass')),
    stateMachineType: StateMachineType.STANDARD,
  });
}