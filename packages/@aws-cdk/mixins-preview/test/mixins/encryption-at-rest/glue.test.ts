/**
 * Unit tests for AWS Glue encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::Glue::DataCatalogEncryptionSettings
 * - AWS::Glue::MLTransform
 * - AWS::Glue::SecurityConfiguration (no KMS support)
 *
 * DataCatalogEncryptionSettings and MLTransform support customer-managed KMS keys.
 * SecurityConfiguration does not support customer-managed KMS keys.
 */

import { CfnDataCatalogEncryptionSettings, CfnMLTransform, CfnSecurityConfiguration } from 'aws-cdk-lib/aws-glue';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnDataCatalogEncryptionSettingsEncryptionAtRestMixin,
  CfnMLTransformEncryptionAtRestMixin,
  CfnSecurityConfigurationEncryptionAtRestMixin,
} from '../../../lib/services/aws-glue/encryption-at-rest-mixins.generated';

describe('CfnDataCatalogEncryptionSettingsEncryptionAtRestMixin', () => {
  test('supports CfnDataCatalogEncryptionSettings', () => {
    const { stack } = createTestContext();
    const resource = new CfnDataCatalogEncryptionSettings(stack, 'Resource', {
      catalogId: '123456789012',
      dataCatalogEncryptionSettings: {},
    });
    const mixin = new CfnDataCatalogEncryptionSettingsEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnDataCatalogEncryptionSettingsEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (enables SSE-KMS mode)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnDataCatalogEncryptionSettings(stack, 'Resource', {
      catalogId: '123456789012',
      dataCatalogEncryptionSettings: {},
    });
    const mixin = new CfnDataCatalogEncryptionSettingsEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, SSE-KMS mode is enabled but no specific key is set
    template().hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      CatalogId: '123456789012',
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: {
          CatalogEncryptionMode: 'SSE-KMS',
        },
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnDataCatalogEncryptionSettings(stack, 'Resource', {
      catalogId: '123456789012',
      dataCatalogEncryptionSettings: {},
    });
    const mixin = new CfnDataCatalogEncryptionSettingsEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Glue::DataCatalogEncryptionSettings', {
      CatalogId: '123456789012',
      DataCatalogEncryptionSettings: {
        EncryptionAtRest: {
          CatalogEncryptionMode: 'SSE-KMS',
          SseAwsKmsKeyId: {
            'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
          },
        },
      },
    });
  });
});

describe('CfnMLTransformEncryptionAtRestMixin', () => {
  test('supports CfnMLTransform', () => {
    const { stack } = createTestContext();
    const resource = new CfnMLTransform(stack, 'Resource', {
      inputRecordTables: {
        glueTables: [
          {
            databaseName: 'my-database',
            tableName: 'my-table',
          },
        ],
      },
      role: 'arn:aws:iam::123456789012:role/glue-role',
      transformParameters: {
        transformType: 'FIND_MATCHES',
        findMatchesParameters: {
          primaryKeyColumnName: 'id',
        },
      },
    });
    const mixin = new CfnMLTransformEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnMLTransformEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (enables SSE-KMS mode)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnMLTransform(stack, 'Resource', {
      inputRecordTables: {
        glueTables: [
          {
            databaseName: 'my-database',
            tableName: 'my-table',
          },
        ],
      },
      role: 'arn:aws:iam::123456789012:role/glue-role',
      transformParameters: {
        transformType: 'FIND_MATCHES',
        findMatchesParameters: {
          primaryKeyColumnName: 'id',
        },
      },
    });
    const mixin = new CfnMLTransformEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // Without KMS key, SSE-KMS mode is enabled but no specific key is set
    template().hasResourceProperties('AWS::Glue::MLTransform', {
      Role: 'arn:aws:iam::123456789012:role/glue-role',
      TransformEncryption: {
        MLUserDataEncryption: {
          MLUserDataEncryptionMode: 'SSE-KMS',
        },
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnMLTransform(stack, 'Resource', {
      inputRecordTables: {
        glueTables: [
          {
            databaseName: 'my-database',
            tableName: 'my-table',
          },
        ],
      },
      role: 'arn:aws:iam::123456789012:role/glue-role',
      transformParameters: {
        transformType: 'FIND_MATCHES',
        findMatchesParameters: {
          primaryKeyColumnName: 'id',
        },
      },
    });
    const mixin = new CfnMLTransformEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::Glue::MLTransform', {
      Role: 'arn:aws:iam::123456789012:role/glue-role',
      TransformEncryption: {
        MLUserDataEncryption: {
          MLUserDataEncryptionMode: 'SSE-KMS',
          KmsKeyId: {
            'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
          },
        },
      },
    });
  });
});

describe('CfnSecurityConfigurationEncryptionAtRestMixin', () => {
  test('supports CfnSecurityConfiguration', () => {
    const { stack } = createTestContext();
    const resource = new CfnSecurityConfiguration(stack, 'Resource', {
      encryptionConfiguration: {
        s3Encryptions: [
          {
            s3EncryptionMode: 'SSE-S3',
          },
        ],
      },
      name: 'my-security-config',
    });
    const mixin = new CfnSecurityConfigurationEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnSecurityConfigurationEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption (no KMS support - service-managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnSecurityConfiguration(stack, 'Resource', {
      encryptionConfiguration: {
        s3Encryptions: [
          {
            s3EncryptionMode: 'SSE-S3',
          },
        ],
      },
      name: 'my-security-config',
    });
    const mixin = new CfnSecurityConfigurationEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // SecurityConfiguration does not support customer-managed KMS keys
    template().hasResourceProperties('AWS::Glue::SecurityConfiguration', {
      Name: 'my-security-config',
      EncryptionConfiguration: {
        S3Encryptions: [
          {
            S3EncryptionMode: 'SSE-S3',
          },
        ],
      },
    });
  });
});
