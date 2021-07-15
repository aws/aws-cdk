import { anything } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpRoute, HttpRouteKey, IntegrationCredentials } from '@aws-cdk/aws-apigatewayv2';
import { Role } from '@aws-cdk/aws-iam';
import { Queue } from '@aws-cdk/aws-sqs';
import { Duration, Stack } from '@aws-cdk/core';
import { SQSAttribute, SQSReceiveMessageIntegration, SQSSendMessageIntegration } from '../../lib/http/aws-proxy';

describe('SQS Integrations', () => {
  describe('SendMessage', () => {
    test('basic integration', () => {
      const stack = new Stack();
      const api = new HttpApi(stack, 'API');
      const queue = Queue.fromQueueArn(stack, 'Queue', 'arn:aws:sqs:eu-west-2:123456789012:queue');
      new HttpRoute(stack, 'Route', {
        httpApi: api,
        integration: new SQSSendMessageIntegration({
          queue,
          body: 'message',
        }),
        routeKey: HttpRouteKey.with('/sendMessage'),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'SQS-SendMessage',
        PayloadFormatVersion: '1.0',
        RequestParameters: {
          QueueUrl: {
            'Fn::Join': [
              '',
              [
                'https://sqs.eu-west-2.',
                {
                  Ref: 'AWS::URLSuffix',
                },
                '/123456789012/queue',
              ],
            ],
          },
          MessageBody: 'message',
        },
      });
    });
    test('full integration', () => {
      const stack = new Stack();
      const api = new HttpApi(stack, 'API');
      const queue = Queue.fromQueueArn(stack, 'Queue', 'arn:aws:sqs:us-east-1:123456789012:queue');
      const role = Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/sqs-role');
      new HttpRoute(stack, 'Full', {
        httpApi: api,
        integration: new SQSSendMessageIntegration({
          body: 'message-body',
          queue,
          attributes: 'some-attributes',
          credentials: IntegrationCredentials.fromRole(role),
          deduplicationId: '$request.id',
          delay: Duration.seconds(4),
          groupId: 'the-group',
          region: 'us-east-1',
          systemAttributes: 'system-attrs',
        }),
        routeKey: HttpRouteKey.DEFAULT,
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'SQS-SendMessage',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/sqs-role',
        RequestParameters: {
          QueueUrl: anything(),
          DelaySeconds: 4,
          MessageAttributes: 'some-attributes',
          MessageBody: 'message-body',
          MessageDeduplicationId: '$request.id',
          MessageGroupId: 'the-group',
          Region: 'us-east-1',
          MessageSystemAttributes: 'system-attrs',
        },
      });
    });
  });

  test('ReceiveMessage', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'API');
    const role = Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/sqs-receive');
    const queue = Queue.fromQueueArn(stack, 'Queue', 'arn:aws:sqs:us-west-1:123456789012:receive-queue.fifo');

    new HttpRoute(stack, 'Route', {
      httpApi: api,
      integration: new SQSReceiveMessageIntegration({
        credentials: IntegrationCredentials.fromRole(role),
        queue,
        attributeNames: [SQSAttribute.ALL],
        maxNumberOfMessages: 2,
        messageAttributeNames: ['Attribute1'],
        receiveRequestAttemptId: 'rra-id',
        visibilityTimeout: Duration.seconds(30),
        waitTime: Duration.seconds(4),
        region: 'eu-central-1',
      }),
      routeKey: HttpRouteKey.DEFAULT,
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'SQS-ReceiveMessage',
      PayloadFormatVersion: '1.0',
      CredentialsArn: 'arn:aws:iam::123456789012:role/sqs-receive',
      RequestParameters: {
        QueueUrl: {
          'Fn::Join': [
            '',
            [
              'https://sqs.us-west-1.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/123456789012/receive-queue.fifo',
            ],
          ],
        },
        AttributeNames: ['All'],
        MaxNumberOfMessages: 2,
        MessageAttributeNames: ['Attribute1'],
        ReceiveRequestAttemptId: 'rra-id',
        VisibilityTimeout: 30,
        WaitTimeSeconds: 4,
        Region: 'eu-central-1',
      },
    });
  });
});
