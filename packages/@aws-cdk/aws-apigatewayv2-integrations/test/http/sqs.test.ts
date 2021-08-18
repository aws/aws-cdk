import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpRoute, HttpRouteKey } from '@aws-cdk/aws-apigatewayv2';
import { IRole, Role } from '@aws-cdk/aws-iam';
import { Queue } from '@aws-cdk/aws-sqs';
import { Duration, Stack } from '@aws-cdk/core';
import {
  AttributeListMappingExpression,
  SqsAttribute,
  SqsDeleteMessageIntegration,
  SqsPurgeQueueIntegration,
  SqsReceiveMessageIntegration,
  SqsSendMessageIntegration,
} from '../../lib/http/aws-proxy';
import { ArrayMappingExpression, DurationMappingExpression, Mapping, QueueMappingExpression, StringMappingExpression } from '../../lib/http/mapping-expression';

describe('SQS Integrations', () => {
  describe('SendMessage', () => {
    test('basic integration', () => {
      const { stack, api, queue, role } = setupTestFixtures(
        'arn:aws:sqs:eu-west-2:123456789012:queue',
        'arn:aws:iam::123456789012:role/send',
      );
      new HttpRoute(stack, 'Route', {
        httpApi: api,
        integration: new SqsSendMessageIntegration({
          queue,
          body: StringMappingExpression.fromValue('message'),
          role,
        }),
        routeKey: HttpRouteKey.with('/sendMessage'),
      });


      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'SQS-SendMessage',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/send',
        RequestParameters: {
          QueueUrl: makeQueueUrl('eu-west-2', '123456789012', 'queue'),
          MessageBody: 'message',
        },
      });
    });
    test('full integration', () => {
      const { stack, api, queue, role } = setupTestFixtures(
        'arn:aws:sqs:us-east-1:123456789012:queue',
        'arn:aws:iam::123456789012:role/sqs-role',
      );
      new HttpRoute(stack, 'Full', {
        httpApi: api,
        integration: new SqsSendMessageIntegration({
          body: StringMappingExpression.fromValue('message-body'),
          queue,
          role,
          attributes: StringMappingExpression.fromValue('some-attributes'),
          deduplicationId: StringMappingExpression.fromValue('$request.id'),
          delay: DurationMappingExpression.fromDuration(Duration.seconds(4)),
          groupId: StringMappingExpression.fromValue('the-group'),
          region: 'us-east-1',
          systemAttributes: StringMappingExpression.fromValue('system-attrs'),
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
          DelaySeconds: '4',
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

  describe('ReceiveMessage', () => {
    test('minimum integration', () => {
      const { stack, api, queue, role } = setupTestFixtures(
        'arn:aws:sqs:us-east-1:123456789012:receive-queue',
        'arn:aws:iam::123456789012:role/receive',
      );
      new HttpRoute(stack, 'Route', {
        httpApi: api,
        routeKey: HttpRouteKey.with('/messages'),
        integration: new SqsReceiveMessageIntegration({
          queue,
          role,
        }),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'SQS-ReceiveMessage',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/receive',
        RequestParameters: {
          QueueUrl: makeQueueUrl('us-east-1', '123456789012', 'receive-queue'),
        },
      });
    });
    test('full integration', () => {
      const { stack, api, role, queue } = setupTestFixtures(
        'arn:aws:sqs:us-west-1:123456789012:receive-queue.fifo',
        'arn:aws:iam::123456789012:role/sqs-receive',
      );

      new HttpRoute(stack, 'Route', {
        httpApi: api,
        integration: new SqsReceiveMessageIntegration({
          role,
          queue,
          attributeNames: AttributeListMappingExpression.fromAttributeList([SqsAttribute.ALL]),
          maxNumberOfMessages: StringMappingExpression.fromValue('2'),
          messageAttributeNames: ArrayMappingExpression.fromValue(['Attribute1']),
          receiveRequestAttemptId: StringMappingExpression.fromValue('rra-id'),
          visibilityTimeout: DurationMappingExpression.fromDuration(Duration.seconds(30)),
          waitTime: DurationMappingExpression.fromDuration(Duration.seconds(4)),
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
          AttributeNames: '["All"]',
          MaxNumberOfMessages: '2',
          MessageAttributeNames: '["Attribute1"]',
          ReceiveRequestAttemptId: 'rra-id',
          VisibilityTimeout: '30',
          WaitTimeSeconds: '4',
          Region: 'eu-central-1',
        },
      });
    });
  });
  describe('DeleteMessage', () => {
    test('minimum integration', () => {
      const { stack, api, queue, role } = setupTestFixtures(
        'arn:aws:sqs:eu-central-1:123456789012:delete',
        'arn:aws:iam::123456789012:role/delete',
      );
      new HttpRoute(stack, 'Route', {
        httpApi: api,
        routeKey: HttpRouteKey.with('/delete'),
        integration: new SqsDeleteMessageIntegration({
          queue,
          receiptHandle: StringMappingExpression.fromMapping(Mapping.fromRequestBody()),
          role,
        }),
      });
      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'SQS-DeleteMessage',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/delete',
        RequestParameters: {
          QueueUrl: makeQueueUrl('eu-central-1', '123456789012', 'delete'),
          ReceiptHandle: '$request.body',
        },
      });
    });
    test('full integration', () => {
      const { stack, api, role, queue } = setupTestFixtures(
        'arn:aws:sqs:eu-west-2:123456789012:queue',
        'arn:aws:iam::123456789012:role/sqs-delete',
      );
      new HttpRoute(stack, 'Route', {
        httpApi: api,
        integration: new SqsDeleteMessageIntegration({
          queue,
          receiptHandle: StringMappingExpression.fromValue('MbZj6wDWli%2BJvwwJaBV%2B3dcjk2YW2vA3%2BSTFFljT'),
          role,
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
  });
  describe('PurgeQueue', () => {
    test('minimum integration', () => {
      const { stack, api, queue, role } = setupTestFixtures(
        'arn:aws:sqs:eu-west-1:123456789012:queue',
        'arn:aws:iam::123456789012:role/purge',
      );
      new HttpRoute(stack, 'Route', {
        httpApi: api,
        routeKey: HttpRouteKey.with('/purge'),
        integration: new SqsPurgeQueueIntegration({
          queue,
          role,
        }),
      });
      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'SQS-PurgeQueue',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/purge',
        RequestParameters: {
          QueueUrl: makeQueueUrl('eu-west-1', '123456789012', 'queue'),
        },
      });
    });
    test('full integration', () => {
      const { stack, api, queue, role } = setupTestFixtures(
        'arn:aws:sqs:eu-west-1:123456789012:queue',
        'arn:aws:iam::123456789012:role/purge',
      );
      new HttpRoute(stack, 'Route', {
        httpApi: api,
        integration: new SqsPurgeQueueIntegration({
          queue,
          role,
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
});

function setupTestFixtures(): { stack: Stack, api: HttpApi };
function setupTestFixtures(queueArn: string, roleArn: string): {
  stack: Stack,
  api: HttpApi,
  queue: QueueMappingExpression,
  role: IRole,
};
function setupTestFixtures(queueArn?: string, roleArn?: string) {
  const stack = new Stack();
  return {
    stack,
    api: new HttpApi(stack, 'API'),
    queue: queueArn && QueueMappingExpression.fromQueue(Queue.fromQueueArn(stack, 'Queue', queueArn)),
    role: roleArn && Role.fromRoleArn(stack, 'Role', roleArn),
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
