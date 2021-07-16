import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpRoute, HttpRouteKey, IntegrationCredentials } from '@aws-cdk/aws-apigatewayv2';
import { IRole, Role } from '@aws-cdk/aws-iam';
import { IQueue, Queue } from '@aws-cdk/aws-sqs';
import { Duration, Stack } from '@aws-cdk/core';
import { SQSAttribute, SQSDeleteMessageIntegration, SQSPurgeQueueIntegration, SQSReceiveMessageIntegration, SQSSendMessageIntegration } from '../../lib/http/aws-proxy';

describe('SQS Integrations', () => {
  describe('SendMessage', () => {
    test('basic integration', () => {
      const {
        stack,
        api,
        queue,
      } = setupTestFixtures('arn:aws:sqs:eu-west-2:123456789012:queue');
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
          QueueUrl: makeQueueUrl('eu-west-2', '123456789012', 'queue'),
          MessageBody: 'message',
        },
      });
    });
    test('full integration', () => {
      const {
        stack,
        api,
        queue,
        role,
      } = setupTestFixtures('arn:aws:sqs:us-east-1:123456789012:queue', 'arn:aws:iam::123456789012:role/sqs-role');
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
          QueueUrl: makeQueueUrl('us-east-1', '123456789012', 'queue'),
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
    const {
      stack,
      api,
      role,
      queue,
    } = setupTestFixtures('arn:aws:sqs:us-west-1:123456789012:receive-queue.fifo', 'arn:aws:iam::123456789012:role/sqs-receive');

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
        QueueUrl: makeQueueUrl('us-west-1', '123456789012', 'receive-queue.fifo'),
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
  test('DeleteMessage', () => {
    const {
      stack,
      api,
      role,
      queue,
    } = setupTestFixtures('arn:aws:sqs:eu-west-2:123456789012:queue', 'arn:aws:iam::123456789012:role/sqs-delete');
    new HttpRoute(stack, 'Route', {
      httpApi: api,
      integration: new SQSDeleteMessageIntegration({
        queue,
        receiptHandle: 'MbZj6wDWli%2BJvwwJaBV%2B3dcjk2YW2vA3%2BSTFFljT',
        credentials: IntegrationCredentials.fromRole(role),
        region: 'eu-west-1',
      }),
      routeKey: HttpRouteKey.DEFAULT,
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'SQS-DeleteMessage',
      PayloadFormatVersion: '1.0',
      CredentialsArn: 'arn:aws:iam::123456789012:role/sqs-delete',
      RequestParameters: {
        QueueUrl: makeQueueUrl('eu-west-2', '123456789012', 'queue'),
        ReceiptHandle: 'MbZj6wDWli%2BJvwwJaBV%2B3dcjk2YW2vA3%2BSTFFljT',
        Region: 'eu-west-1',
      },
    });
  });
  test('PurgeQueue', () => {
    const {
      stack,
      api,
      queue,
      role,
    } = setupTestFixtures('arn:aws:sqs:eu-west-1:123456789012:queue', 'arn:aws:iam::123456789012:role/purge');
    new HttpRoute(stack, 'Route', {
      httpApi: api,
      integration: new SQSPurgeQueueIntegration({
        queue,
        credentials: IntegrationCredentials.fromRole(role),
        region: 'us-east-2',
      }),
      routeKey: HttpRouteKey.DEFAULT,
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'SQS-PurgeQueue',
      PayloadFormatVersion: '1.0',
      CredentialsArn: 'arn:aws:iam::123456789012:role/purge',
      RequestParameters: {
        QueueUrl: makeQueueUrl('eu-west-1', '123456789012', 'queue'),
        Region: 'us-east-2',
      },
    });
  });
});

function setupTestFixtures(queueArn: string): { stack: Stack, api: HttpApi, queue: IQueue };
function setupTestFixtures(queueArn: string, roleArn: string): { stack: Stack, api: HttpApi, queue: IQueue, role: IRole };
function setupTestFixtures(queueArn: string, roleArn?: string) {
  const stack = new Stack();
  const api = new HttpApi(stack, 'API');
  const queue = Queue.fromQueueArn(stack, 'Queue', queueArn);
  return {
    stack,
    api,
    queue,
    role: roleArn ? Role.fromRoleArn(stack, 'Role', roleArn) : undefined,
  };
}

function makeQueueUrl(region: string, account: string, queueName: string) {
  return {
    'Fn::Join': [
      '',
      [
        `https://sqs.${region}.`,
        {
          Ref: 'AWS::URLSuffix',
        },
        `/${account}/${queueName}`,
      ],
    ],
  };
}
