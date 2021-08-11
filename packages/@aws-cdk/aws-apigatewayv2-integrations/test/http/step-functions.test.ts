import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpRoute, HttpRouteKey } from '@aws-cdk/aws-apigatewayv2';
import { IRole, Role } from '@aws-cdk/aws-iam';
import { StateMachine } from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { StepFunctionsStartExecutionIntegration, StepFunctionsStartSyncExecutionIntegration, StepFunctionsStopExecutionIntegration } from '../../lib/http/aws-proxy';

describe('Step Functions integrations', () => {
  describe('StartExecution', () => {
    test('minimum integration', () => {
      const { stack, httpApi, role } = createTestFixtures('arn:aws:iam::123456789012:role/start');
      const stateMachine = StateMachine.fromStateMachineArn(
        stack,
        'StateMachine',
        'arn:aws:states:eu-central-2:123456789012:stateMachine:minimum',
      );
      new HttpRoute(stack, 'Route', {
        httpApi,
        routeKey: HttpRouteKey.DEFAULT,
        integration: new StepFunctionsStartExecutionIntegration({
          stateMachine,
          role,
        }),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'StepFunctions-StartExecution',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/start',
        RequestParameters: {
          StateMachineArn: stateMachine.stateMachineArn,
        },
      });
    });
    test('full integration', () => {
      const { stack, httpApi, role } = createTestFixtures('arn:aws:iam::123456789012:role/start');
      const stateMachine = StateMachine.fromStateMachineArn(
        stack,
        'StateMachine',
        'arn:aws:states:us-west-1:123456789012:stateMachine:my-state-machine',
      );
      new HttpRoute(stack, 'Route', {
        httpApi,
        routeKey: HttpRouteKey.DEFAULT,
        integration: new StepFunctionsStartExecutionIntegration({
          role,
          stateMachine,
          name: 'execution-name',
          input: '$request.body',
          region: 'us-west-2',
        }),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'StepFunctions-StartExecution',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/start',
        RequestParameters: {
          StateMachineArn: 'arn:aws:states:us-west-1:123456789012:stateMachine:my-state-machine',
          Name: 'execution-name',
          Input: '$request.body',
          Region: 'us-west-2',
        },
      });
    });
  });

  describe('StartSyncExecution', () => {
    test('minimum integration', () => {
      const { stack, httpApi, role } = createTestFixtures(
        'arn:aws:iam::123456789012:role/start-sync',
      );
      const stateMachine = StateMachine.fromStateMachineArn(
        stack,
        'StateMachine',
        'arn:aws:states:eu-central-2:123456789012:stateMachine:minimum',
      );
      new HttpRoute(stack, 'Route', {
        httpApi,
        routeKey: HttpRouteKey.DEFAULT,
        integration: new StepFunctionsStartSyncExecutionIntegration({
          stateMachine,
          role,
        }),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'StepFunctions-StartSyncExecution',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/start-sync',
        RequestParameters: {
          StateMachineArn: stateMachine.stateMachineArn,
        },
      });
    });
    test('full integration', () => {
      const { stack, httpApi, role } = createTestFixtures(
        'arn:aws:iam::123456789012:role/start-sync',
      );
      const stateMachine = StateMachine.fromStateMachineArn(
        stack,
        'StateMachine',
        'arn:aws:states:us-west-2:123456789012:stateMachine:sync',
      );
      new HttpRoute(stack, 'Route', {
        httpApi,
        routeKey: HttpRouteKey.DEFAULT,
        integration: new StepFunctionsStartSyncExecutionIntegration({
          role,
          stateMachine,
          name: 'execution',
          input: '{}',
          traceHeader: '$request.headers["X-My-Trace-ID"]',
          region: 'us-east-2',
        }),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'StepFunctions-StartSyncExecution',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/start-sync',
        RequestParameters: {
          StateMachineArn: 'arn:aws:states:us-west-2:123456789012:stateMachine:sync',
          Name: 'execution',
          Input: '{}',
          TraceHeader: '$request.headers["X-My-Trace-ID"]',
          Region: 'us-east-2',
        },
      });
    });
  });

  describe('StopExecution', () => {
    test('minimum integration', () => {
      const { stack, httpApi, role } = createTestFixtures('arn:aws:iam::123456789012:role/stop');
      new HttpRoute(stack, 'Route', {
        httpApi,
        routeKey: HttpRouteKey.DEFAULT,
        integration: new StepFunctionsStopExecutionIntegration({
          executionArn: 'arn:aws:states:us-east-2:123456789012:executions:state:my-execution',
          role,
        }),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'StepFunctions-StopExecution',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/stop',
        RequestParameters: {
          ExecutionArn: 'arn:aws:states:us-east-2:123456789012:executions:state:my-execution',
        },
      });
    });
    test('full integration', () => {
      const { stack, httpApi, role } = createTestFixtures(
        'arn:aws:iam::123456789012:role/stop',
      );
      new HttpRoute(stack, 'Route', {
        httpApi,
        routeKey: HttpRouteKey.DEFAULT,
        integration: new StepFunctionsStopExecutionIntegration({
          executionArn: 'arn:aws:states:us-east-2:123456789012:executions:state:my-execution',
          error: '$request.body.error',
          cause: '$request.body.cause',
          role,
          region: 'eu-west-2',
        }),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'StepFunctions-StopExecution',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/stop',
        RequestParameters: {
          ExecutionArn: 'arn:aws:states:us-east-2:123456789012:executions:state:my-execution',
          Error: '$request.body.error',
          Cause: '$request.body.cause',
          Region: 'eu-west-2',
        },
      });
    });
  });
});

function createTestFixtures(): { stack: Stack, httpApi: HttpApi };
function createTestFixtures(roleArn: string): { stack: Stack, httpApi: HttpApi, role: IRole };
function createTestFixtures(roleArn?: string) {
  const stack = new Stack();
  const httpApi = new HttpApi(stack, 'API');
  const role = roleArn && Role.fromRoleArn(stack, 'Role', roleArn);
  return {
    stack,
    httpApi,
    role,
  };
}
