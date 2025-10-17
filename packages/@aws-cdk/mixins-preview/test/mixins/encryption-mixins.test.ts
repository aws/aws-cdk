import { Stack, App } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { EncryptionAtRest } from '../../lib/mixins';

describe('EncryptionAtRest', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  test('applies to S3 bucket', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket');
    const mixin = new EncryptionAtRest();

    expect(mixin.supports(bucket)).toBe(true);
    mixin.applyTo(bucket);

    expect(bucket.bucketEncryption).toBeDefined();
    const config = bucket.bucketEncryption as any;
    expect(config?.serverSideEncryptionConfiguration?.[0]?.serverSideEncryptionByDefault?.sseAlgorithm).toBe('aws:kms');
  });

  test('applies to CloudWatch LogGroup', () => {
    const logGroup = new logs.CfnLogGroup(stack, 'LogGroup');
    const mixin = new EncryptionAtRest();

    expect(mixin.supports(logGroup)).toBe(true);
    mixin.applyTo(logGroup);

    expect((logGroup as any).kmsKeyId).toBe('alias/aws/logs');
  });

  test('applies to DynamoDB table', () => {
    const table = new dynamodb.CfnTable(stack, 'Table', {
      keySchema: [{
        attributeName: 'id',
        keyType: 'HASH',
      }],
      attributeDefinitions: [{
        attributeName: 'id',
        attributeType: 'S',
      }],
    });
    const mixin = new EncryptionAtRest();

    expect(mixin.supports(table)).toBe(true);
    mixin.applyTo(table);

    const spec = table.sseSpecification as any;
    expect(spec?.sseEnabled).toBe(true);
  });

  test('with custom config', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket');
    const mixin = new EncryptionAtRest({
      algorithm: 'AES256',
      bucketKeyEnabled: false,
    });

    mixin.applyTo(bucket);

    const config = bucket.bucketEncryption as any;
    expect(config?.serverSideEncryptionConfiguration?.[0]?.serverSideEncryptionByDefault?.sseAlgorithm).toBe('AES256');
    expect(config?.serverSideEncryptionConfiguration?.[0]?.bucketKeyEnabled).toBe(false);
  });

  test('validation detects missing encryption', () => {
    const bucket = new s3.CfnBucket(stack, 'Bucket');
    const mixin = new EncryptionAtRest();

    const errors = mixin.validate(bucket);
    expect(errors).toContain('S3 bucket encryption not configured');

    mixin.applyTo(bucket);
    const errorsAfter = mixin.validate(bucket);
    expect(errorsAfter).toEqual([]);
  });
});
