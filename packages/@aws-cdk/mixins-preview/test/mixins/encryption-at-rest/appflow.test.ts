/**
 * Unit tests for AWS AppFlow encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::AppFlow::ConnectorProfile
 * - AWS::AppFlow::Flow
 *
 * AppFlow supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * kMSArn property.
 */

import { CfnConnectorProfile, CfnFlow } from 'aws-cdk-lib/aws-appflow';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnConnectorProfileEncryptionAtRestMixin,
  CfnFlowEncryptionAtRestMixin,
} from '../../../lib/services/aws-appflow/encryption-at-rest-mixins.generated';

describe('CfnConnectorProfileEncryptionAtRestMixin', () => {
  test('supports CfnConnectorProfile', () => {
    const { stack } = createTestContext();
    const resource = new CfnConnectorProfile(stack, 'Resource', {
      connectorProfileName: 'test-profile',
      connectionMode: 'Public',
      connectorType: 'Salesforce',
    });
    const mixin = new CfnConnectorProfileEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnConnectorProfileEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnConnectorProfile(stack, 'Resource', {
      connectorProfileName: 'test-profile',
      connectionMode: 'Public',
      connectorType: 'Salesforce',
    });
    const mixin = new CfnConnectorProfileEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppFlow::ConnectorProfile', {
      ConnectorProfileName: 'test-profile',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnConnectorProfile(stack, 'Resource', {
      connectorProfileName: 'test-profile',
      connectionMode: 'Public',
      connectorType: 'Salesforce',
    });
    const mixin = new CfnConnectorProfileEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppFlow::ConnectorProfile', {
      ConnectorProfileName: 'test-profile',
      KMSArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnConnectorProfile(stack, 'Resource', {
      connectorProfileName: 'test-profile',
      connectionMode: 'Public',
      connectorType: 'Salesforce',
    });
    const mixin = new CfnConnectorProfileEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnFlowEncryptionAtRestMixin', () => {
  test('supports CfnFlow', () => {
    const { stack } = createTestContext();
    const resource = new CfnFlow(stack, 'Resource', {
      flowName: 'test-flow',
      destinationFlowConfigList: [{
        connectorType: 'S3',
        destinationConnectorProperties: {
          s3: {
            bucketName: 'test-bucket',
          },
        },
      }],
      sourceFlowConfig: {
        connectorType: 'S3',
        sourceConnectorProperties: {
          s3: {
            bucketName: 'source-bucket',
            bucketPrefix: 'prefix',
          },
        },
      },
      tasks: [{
        taskType: 'Map',
        sourceFields: ['field1'],
      }],
      triggerConfig: {
        triggerType: 'OnDemand',
      },
    });
    const mixin = new CfnFlowEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnFlowEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnFlow(stack, 'Resource', {
      flowName: 'test-flow',
      destinationFlowConfigList: [{
        connectorType: 'S3',
        destinationConnectorProperties: {
          s3: {
            bucketName: 'test-bucket',
          },
        },
      }],
      sourceFlowConfig: {
        connectorType: 'S3',
        sourceConnectorProperties: {
          s3: {
            bucketName: 'source-bucket',
            bucketPrefix: 'prefix',
          },
        },
      },
      tasks: [{
        taskType: 'Map',
        sourceFields: ['field1'],
      }],
      triggerConfig: {
        triggerType: 'OnDemand',
      },
    });
    const mixin = new CfnFlowEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppFlow::Flow', {
      FlowName: 'test-flow',
      KMSArn: {
        'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnFlow(stack, 'Resource', {
      flowName: 'test-flow',
      destinationFlowConfigList: [{
        connectorType: 'S3',
        destinationConnectorProperties: {
          s3: {
            bucketName: 'test-bucket',
          },
        },
      }],
      sourceFlowConfig: {
        connectorType: 'S3',
        sourceConnectorProperties: {
          s3: {
            bucketName: 'source-bucket',
            bucketPrefix: 'prefix',
          },
        },
      },
      tasks: [{
        taskType: 'Map',
        sourceFields: ['field1'],
      }],
      triggerConfig: {
        triggerType: 'OnDemand',
      },
    });
    const mixin = new CfnFlowEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
