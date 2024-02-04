import { App, Stack } from '../../..';
import { Match, Template } from '../../../assertions';
import { HttpApi, HttpRoute, HttpRouteKey, MappingValue, ParameterMapping, PayloadFormatVersion } from '../../../aws-apigatewayv2';
import * as sfn from '../../../aws-stepfunctions';
import { HttpStepFunctionsIntegration } from '../../lib/http/stepfunctions';

describe('StepFunctionsIntegration', () => {
  test('default', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const targetStateMachine = new sfn.StateMachine(stack, 'StateMachine', {
      definition: new sfn.Pass(stack, 'Pass'),
    });

    new HttpRoute(stack, 'StepFunctionsRoute', {
      httpApi: api,
      integration: new HttpStepFunctionsIntegration('Integration', {
        stateMachine: targetStateMachine,
      }),
      routeKey: HttpRouteKey.with('/tests'),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'apigateway.amazonaws.com',
            },
          },
        ]),
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: stack.resolve(targetStateMachine.stateMachineArn),
          },
        ],
      },
      Roles: [
        {
          Ref: 'StepFunctionsRouteInvokeRole5E3B5519',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ConnectionType: 'INTERNET',
      CredentialsArn: {
        'Fn::GetAtt': [
          'StepFunctionsRouteInvokeRole5E3B5519',
          'Arn',
        ],
      },
      IntegrationMethod: 'ANY',
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'StepFunctions-StartExecution',
      PayloadFormatVersion: '1.0',
    });
  });
});

