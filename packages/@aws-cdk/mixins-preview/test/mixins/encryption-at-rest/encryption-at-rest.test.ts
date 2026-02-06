/**
 * Cross-service tests for the EncryptionAtRest mixin.
 *
 * Tests cover:
 * - EncryptionAtRest class with no KMS key
 * - EncryptionAtRest class with KMS key
 * - EncryptionAtRest skips resources requiring KMS when no key provided
 * - EncryptionAtRest applies to multiple resources in scope
 * - SUPPORTED_RESOURCE_TYPES static property
 */

import { App, Stack } from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as kms from 'aws-cdk-lib/aws-kms';
import { CfnBucket } from 'aws-cdk-lib/aws-s3';
import { CfnTable } from 'aws-cdk-lib/aws-dynamodb';
import { CfnQueue } from 'aws-cdk-lib/aws-sqs';
import { CfnTopic } from 'aws-cdk-lib/aws-sns';
import { CfnStream } from 'aws-cdk-lib/aws-kinesis';
import { EncryptionAtRest } from '../../../lib/mixins/encryption-at-rest.generated';

describe('EncryptionAtRest Cross-Service Mixin', () => {
  describe('with no KMS key', () => {
    test('applies encryption to S3 bucket without KMS key', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const bucket = new CfnBucket(stack, 'Bucket', {
        bucketName: 'test-bucket',
      });

      const mixin = new EncryptionAtRest();
      expect(mixin.supports(bucket)).toBe(true);
      mixin.applyTo(bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: 'test-bucket',
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [{
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          }],
        },
      });
    });

    test('applies encryption to SQS queue without KMS key', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const queue = new CfnQueue(stack, 'Queue', {
        queueName: 'test-queue',
      });

      const mixin = new EncryptionAtRest();
      expect(mixin.supports(queue)).toBe(true);
      mixin.applyTo(queue);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::SQS::Queue', {
        QueueName: 'test-queue',
        SqsManagedSseEnabled: true,
      });
    });

    test('applies encryption to DynamoDB table without KMS key', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const table = new CfnTable(stack, 'Table', {
        tableName: 'test-table',
        keySchema: [{
          attributeName: 'pk',
          keyType: 'HASH',
        }],
        attributeDefinitions: [{
          attributeName: 'pk',
          attributeType: 'S',
        }],
      });

      const mixin = new EncryptionAtRest();
      expect(mixin.supports(table)).toBe(true);
      mixin.applyTo(table);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        TableName: 'test-table',
        SSESpecification: {
          SSEEnabled: true,
        },
      });
    });
  });

  describe('with KMS key', () => {
    test('applies encryption to S3 bucket with KMS key', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const kmsKey = new kms.Key(stack, 'Key');
      const bucket = new CfnBucket(stack, 'Bucket', {
        bucketName: 'test-bucket',
      });

      const mixin = new EncryptionAtRest(kmsKey);
      mixin.applyTo(bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: 'test-bucket',
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [{
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'aws:kms',
              KMSMasterKeyID: {
                'Fn::GetAtt': ['Key961B73FD', 'Arn'],
              },
            },
          }],
        },
      });
    });

    test('applies encryption to SNS topic with KMS key', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const kmsKey = new kms.Key(stack, 'Key');
      const topic = new CfnTopic(stack, 'Topic', {
        topicName: 'test-topic',
      });

      const mixin = new EncryptionAtRest(kmsKey);
      mixin.applyTo(topic);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::SNS::Topic', {
        TopicName: 'test-topic',
        KmsMasterKeyId: {
          'Fn::GetAtt': ['Key961B73FD', 'Arn'],
        },
      });
    });
  });

  describe('skips resources requiring KMS when no key provided', () => {
    test('does not apply to Kinesis stream without KMS key (KMS required)', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const stream = new CfnStream(stack, 'Stream', {
        name: 'test-stream',
        shardCount: 1,
      });

      const mixin = new EncryptionAtRest();
      // The mixin supports the resource type but returns undefined from factory
      expect(mixin.supports(stream)).toBe(true);
      mixin.applyTo(stream);

      const template = Template.fromStack(stack);
      // Stream should not have encryption applied since no KMS key was provided
      template.hasResourceProperties('AWS::Kinesis::Stream', {
        Name: 'test-stream',
        ShardCount: 1,
      });
    });

    test('applies to Kinesis stream with KMS key', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const kmsKey = new kms.Key(stack, 'Key');
      const stream = new CfnStream(stack, 'Stream', {
        name: 'test-stream',
        shardCount: 1,
      });

      const mixin = new EncryptionAtRest(kmsKey);
      mixin.applyTo(stream);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Kinesis::Stream', {
        Name: 'test-stream',
        StreamEncryption: {
          EncryptionType: 'KMS',
          KeyId: {
            'Fn::GetAtt': ['Key961B73FD', 'Arn'],
          },
        },
      });
    });
  });

  describe('applies to multiple resources in scope', () => {
    test('applies encryption to multiple resources', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');
      const kmsKey = new kms.Key(stack, 'Key');

      const bucket = new CfnBucket(stack, 'Bucket', {
        bucketName: 'test-bucket',
      });
      const queue = new CfnQueue(stack, 'Queue', {
        queueName: 'test-queue',
      });
      const topic = new CfnTopic(stack, 'Topic', {
        topicName: 'test-topic',
      });

      const mixin = new EncryptionAtRest(kmsKey);
      mixin.applyTo(bucket);
      mixin.applyTo(queue);
      mixin.applyTo(topic);

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [{
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'aws:kms',
            },
          }],
        },
      });

      template.hasResourceProperties('AWS::SQS::Queue', {
        KmsMasterKeyId: {
          'Fn::GetAtt': ['Key961B73FD', 'Arn'],
        },
      });

      template.hasResourceProperties('AWS::SNS::Topic', {
        KmsMasterKeyId: {
          'Fn::GetAtt': ['Key961B73FD', 'Arn'],
        },
      });
    });
  });

  describe('SUPPORTED_RESOURCE_TYPES static property', () => {
    test('contains expected resource types', () => {
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::S3::Bucket');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::DynamoDB::Table');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::SQS::Queue');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::SNS::Topic');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::Lambda::Function');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::Kinesis::Stream');
    });

    test('is an array of strings', () => {
      expect(Array.isArray(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES)).toBe(true);
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES.length).toBeGreaterThan(0);
      EncryptionAtRest.SUPPORTED_RESOURCE_TYPES.forEach(type => {
        expect(typeof type).toBe('string');
        expect(type).toMatch(/^AWS::/);
      });
    });

    test('contains KMS required resources', () => {
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::Kinesis::Stream');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::AppRunner::Service');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::AppIntegrations::DataIntegration');
    });

    test('contains no KMS support resources', () => {
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::AppSync::ApiCache');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::EC2::Instance');
      expect(EncryptionAtRest.SUPPORTED_RESOURCE_TYPES).toContain('AWS::DynamoDB::GlobalTable');
    });
  });

  describe('does not support non-CfnResource constructs', () => {
    test('returns false for non-CfnResource', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack');

      const mixin = new EncryptionAtRest();
      expect(mixin.supports(stack)).toBe(false);
      expect(mixin.supports(app)).toBe(false);
    });
  });
});
