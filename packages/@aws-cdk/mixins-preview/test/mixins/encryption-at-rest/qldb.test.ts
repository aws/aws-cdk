/**
 * Unit tests for AWS QLDB encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::QLDB::Ledger
 */

import { CfnLedger } from 'aws-cdk-lib/aws-qldb';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnLedgerEncryptionAtRestMixin } from '../../../lib/services/aws-qldb/encryption-at-rest-mixins.generated';

describe('CfnLedgerEncryptionAtRestMixin', () => {
  test('supports CfnLedger', () => {
    const { stack } = createTestContext();
    const resource = new CfnLedger(stack, 'Resource', {
      permissionsMode: 'STANDARD',
    });
    const mixin = new CfnLedgerEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnLedgerEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnLedger(stack, 'Resource', {
      permissionsMode: 'STANDARD',
    });
    const mixin = new CfnLedgerEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No KMS properties set when no key provided - uses AWS managed key by default
    template().hasResourceProperties('AWS::QLDB::Ledger', {
      PermissionsMode: 'STANDARD',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnLedger(stack, 'Resource', {
      permissionsMode: 'STANDARD',
    });
    const mixin = new CfnLedgerEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::QLDB::Ledger', {
      PermissionsMode: 'STANDARD',
      KmsKey: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });
});
