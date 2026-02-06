/**
 * Unit tests for AWS Lambda encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Lambda::EventSourceMapping
 * - AWS::Lambda::Function
 *
 * Both resources support optional KMS encryption. When no KMS key is provided,
 * AWS managed encryption is used by default. When a KMS key is provided,
 * customer-managed encryption is enabled.
 */

import { CfnEventSourceMapping, CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnEventSourceMappingEncryptionAtRestMixin,
  CfnFunctionEncryptionAtRestMixin,
} from '../../../lib/services/aws-lambda/encryption-at-rest-mixins.generated';

describe('CfnEventSourceMappingEncryptionAtRestMixin', () => {
  test('supports CfnEventSourceMapping', () => {
    const { stack } = createTestContext();
    const resource = new CfnEventSourceMapping(stack, 'Resource', {
      functionName: 'my-function',
    });
    const mixin = new CfnEventSourceMappingEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnEventSourceMappingEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnEventSourceMapping(stack, 'Resource', {
      functionName: 'my-function',
    });
    const mixin = new CfnEventSourceMappingEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyArn is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionName: 'my-function',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnEventSourceMapping(stack, 'Resource', {
      functionName: 'my-function',
    });
    const mixin = new CfnEventSourceMappingEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionName: 'my-function',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});

describe('CfnFunctionEncryptionAtRestMixin', () => {
  test('supports CfnFunction', () => {
    const { stack } = createTestContext();
    const resource = new CfnFunction(stack, 'Resource', {
      code: {
        zipFile: 'exports.handler = async () => { return "Hello"; };',
      },
      role: 'arn:aws:iam::123456789012:role/lambda-role',
      runtime: 'nodejs18.x',
      handler: 'index.handler',
    });
    const mixin = new CfnFunctionEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFunctionEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnFunction(stack, 'Resource', {
      code: {
        zipFile: 'exports.handler = async () => { return "Hello"; };',
      },
      role: 'arn:aws:iam::123456789012:role/lambda-role',
      runtime: 'nodejs18.x',
      handler: 'index.handler',
    });
    const mixin = new CfnFunctionEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no KmsKeyArn is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::Lambda::Function', {
      Role: 'arn:aws:iam::123456789012:role/lambda-role',
      Runtime: 'nodejs18.x',
      Handler: 'index.handler',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnFunction(stack, 'Resource', {
      code: {
        zipFile: 'exports.handler = async () => { return "Hello"; };',
      },
      role: 'arn:aws:iam::123456789012:role/lambda-role',
      runtime: 'nodejs18.x',
      handler: 'index.handler',
    });
    const mixin = new CfnFunctionEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Lambda::Function', {
      Role: 'arn:aws:iam::123456789012:role/lambda-role',
      Runtime: 'nodejs18.x',
      Handler: 'index.handler',
      KmsKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
