import { Template } from 'aws-cdk-lib/assertions';
import { WebSocketApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Stack } from 'aws-cdk-lib';
import { WebSocketStateMachineIntegration } from '../../lib';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';

describe('StateMachineWebSocketIntegration', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const fooStepFn = fooStateMachine(stack, 'StepFn');

    // WHEN
    new WebSocketApi(stack, 'Api', {
      connectRouteOptions: {
        integration: new WebSocketStateMachineIntegration('Integration', fooStepFn),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS',
      IntegrationUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':apigateway:',
            {
              Ref: 'AWS::Region',
            },
            ':states:',
            '/action/StartExecution',
          ],
        ],
      },
    });
  });
});

function fooStateMachine(stack: Stack, id: string) {
  return new StateMachine(stack, id, { });
}
