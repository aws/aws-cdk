import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpRoute, HttpRouteKey } from '@aws-cdk/aws-apigatewayv2';
import { Role } from '@aws-cdk/aws-iam';
import { Stream } from '@aws-cdk/aws-kinesis';
import { Stack } from '@aws-cdk/core';
import { KinesisPutRecordIntegration } from '../../lib/http/aws-proxy';

describe('Kinesis Integration', () => {
  describe('PutRecord', () => {
    test('minimum integration', () => {
      const stack = new Stack();
      const httpApi = new HttpApi(stack, 'API');
      const stream = Stream.fromStreamArn(stack, 'Stream', 'arn:aws:kinesis:::stream/Minimum');
      const role = Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/put');
      new HttpRoute(stack, 'Route', {
        httpApi,
        routeKey: HttpRouteKey.DEFAULT,
        integration: new KinesisPutRecordIntegration({
          stream,
          partitionKey: 'key',
          data: '$request.body',
          role,
        }),
      });
      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'Kinesis-PutRecord',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/put',
        RequestParameters: {
          StreamName: stream.streamName,
          Data: '$request.body',
          PartitionKey: 'key',
        },
      });
    });
    test('full integration', () => {
      const stack = new Stack();
      const httpApi = new HttpApi(stack, 'API');
      const role = Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/kinesis-put');
      const stream = Stream.fromStreamArn(stack, 'Stream', 'arn:aws:kinesis:::stream/Integration');
      new HttpRoute(stack, 'Route', {
        httpApi,
        routeKey: HttpRouteKey.DEFAULT,
        integration: new KinesisPutRecordIntegration({
          stream,
          data: '$request.body',
          partitionKey: 'key',
          sequenceNumberForOrdering: 'sequence',
          explicitHashKey: 'hashKey',
          role,
          region: 'eu-north-1',
        }),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        IntegrationType: 'AWS_PROXY',
        IntegrationSubtype: 'Kinesis-PutRecord',
        PayloadFormatVersion: '1.0',
        CredentialsArn: 'arn:aws:iam::123456789012:role/kinesis-put',
        RequestParameters: {
          StreamName: 'Integration',
          Data: '$request.body',
          PartitionKey: 'key',
          SequenceNumberForOrdering: 'sequence',
          ExplicitHashKey: 'hashKey',
          Region: 'eu-north-1',
        },
      });
    });
  });
});
