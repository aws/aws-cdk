/**
 * Unit tests for AWS DataBrew encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::DataBrew::Job
 *
 * DataBrew Job encryption behavior depends on service configuration.
 * When a KMS key is provided, customer-managed encryption is enabled via the encryptionKeyArn property.
 */

import { CfnJob } from 'aws-cdk-lib/aws-databrew';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnJobEncryptionAtRestMixin } from '../../../lib/services/aws-databrew/encryption-at-rest-mixins.generated';

describe('CfnJobEncryptionAtRestMixin', () => {
  test('supports CfnJob', () => {
    const { stack } = createTestContext();
    const resource = new CfnJob(stack, 'Resource', {
      name: 'my-job',
      type: 'PROFILE',
      roleArn: 'arn:aws:iam::123456789012:role/databrew-role',
    });
    const mixin = new CfnJobEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnJobEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnJob(stack, 'Resource', {
      name: 'my-job',
      type: 'PROFILE',
      roleArn: 'arn:aws:iam::123456789012:role/databrew-role',
    });
    const mixin = new CfnJobEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, no EncryptionKeyArn is set - AWS managed encryption is used by default
    template().hasResourceProperties('AWS::DataBrew::Job', {
      Name: 'my-job',
      Type: 'PROFILE',
      RoleArn: 'arn:aws:iam::123456789012:role/databrew-role',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnJob(stack, 'Resource', {
      name: 'my-job',
      type: 'PROFILE',
      roleArn: 'arn:aws:iam::123456789012:role/databrew-role',
    });
    const mixin = new CfnJobEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::DataBrew::Job', {
      Name: 'my-job',
      Type: 'PROFILE',
      RoleArn: 'arn:aws:iam::123456789012:role/databrew-role',
      EncryptionKeyArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
