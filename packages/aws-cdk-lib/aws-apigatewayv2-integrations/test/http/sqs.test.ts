import { Match, Template } from '../../../assertions';
import { HttpApi, HttpIntegrationSubtype, HttpRoute, HttpRouteKey, ParameterMapping } from '../../../aws-apigatewayv2';
import * as sqs from '../../../aws-sqs';
import { App, Stack } from '../../../core';
import { HttpSqsIntegration } from '../../lib';

describe('SqsIntegration', () => {
  test('default', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const targetQueue = new sqs.Queue(stack, 'Queue');

    new HttpRoute(stack, 'SqsRoute', {
      httpApi: api,
      integration: new HttpSqsIntegration('Integration', {
        queue: targetQueue,
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
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: stack.resolve(targetQueue.queueArn),
          },
        ],
      },
      Roles: [
        {
          Ref: 'SqsRouteInvokeRoleDF4DF6D8',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ConnectionType: 'INTERNET',
      CredentialsArn: {
        'Fn::GetAtt': [
          'SqsRouteInvokeRoleDF4DF6D8',
          'Arn',
        ],
      },
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'SQS-SendMessage',
      PayloadFormatVersion: '1.0',
      RequestParameters: {
        QueueUrl: stack.resolve(targetQueue.queueUrl),
        MessageBody: '$request.body.MessageBody',
      },
    });
  });

  test('with parameterMapping', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const targetQueue = new sqs.Queue(stack, 'Queue');

    new HttpRoute(stack, 'SqsRoute', {
      httpApi: api,
      integration: new HttpSqsIntegration('Integration', {
        queue: targetQueue,
        parameterMapping: new ParameterMapping()
          .custom('test', 'testValue'),
      }),
      routeKey: HttpRouteKey.with('/tests'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ConnectionType: 'INTERNET',
      CredentialsArn: {
        'Fn::GetAtt': [
          'SqsRouteInvokeRoleDF4DF6D8',
          'Arn',
        ],
      },
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'SQS-SendMessage',
      PayloadFormatVersion: '1.0',
      RequestParameters: {
        test: 'testValue',
      },
    });
  });

  test.each([
    [
      HttpIntegrationSubtype.SQS_SEND_MESSAGE,
      'sqs:SendMessage',
      new ParameterMapping().custom('QueueUrl', '$request.body.QueueUrl').custom('MessageBody', '$request.body.MessageBody'),
    ],
    [
      HttpIntegrationSubtype.SQS_RECEIVE_MESSAGE,
      'sqs:ReceiveMessage',
      undefined,
    ],
    [
      HttpIntegrationSubtype.SQS_DELETE_MESSAGE,
      'sqs:DeleteMessage',
      new ParameterMapping().custom('QueueUrl', '$request.body.QueueUrl').custom('ReceiptHandle', '$request.body.ReceiptHandle'),
    ],
    [
      HttpIntegrationSubtype.SQS_PURGE_QUEUE,
      'sqs:PurgeQueue',
      undefined,
    ],
  ])('with subtype %s', (subtype, action, parameterMapping) => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const targetQueue = new sqs.Queue(stack, 'Queue');

    new HttpRoute(stack, 'SqsRoute', {
      httpApi: api,
      integration: new HttpSqsIntegration('Integration', {
        queue: targetQueue,
        subtype,
        parameterMapping,
      }),
      routeKey: HttpRouteKey.with('/tests'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: action,
            Effect: 'Allow',
            Resource: stack.resolve(targetQueue.queueArn),
          },
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ConnectionType: 'INTERNET',
      CredentialsArn: {
        'Fn::GetAtt': [
          'SqsRouteInvokeRoleDF4DF6D8',
          'Arn',
        ],
      },
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: subtype,
      PayloadFormatVersion: '1.0',
      RequestParameters: {
        ...(parameterMapping ?
          parameterMapping.mappings :
          { QueueUrl: stack.resolve(targetQueue.queueUrl) }
        ),
      },
    });
  });

  test('throw error when subtype does not start with STEPFUNCTIONS_', () => {
    const app = new App();
    const stack = new Stack(app, 'stack');
    const api = new HttpApi(stack, 'HttpApi');
    const targetQueue = new sqs.Queue(stack, 'Queue');

    expect(() => {
      new HttpRoute(stack, 'SqsRoute', {
        httpApi: api,
        integration: new HttpSqsIntegration('Integration', {
          queue: targetQueue,
          subtype: HttpIntegrationSubtype.STEPFUNCTIONS_START_EXECUTION,
        }),
        routeKey: HttpRouteKey.with('/tests'),
      });
    }).toThrow(/Subtype must start with `SQS_`/);
  });
});

