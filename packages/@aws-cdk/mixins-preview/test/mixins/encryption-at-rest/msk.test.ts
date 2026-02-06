/**
 * Unit tests for AWS MSK encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::MSK::Cluster
 *
 * MSK Cluster supports optional KMS encryption. When no KMS key is provided,
 * AWS managed encryption is used by default. When a KMS key is provided,
 * customer-managed encryption is enabled via the encryptionInfo.encryptionAtRest.dataVolumeKmsKeyId property.
 *
 * NOTE: There is a known issue in the mixin implementation where the property name
 * 'dataVolumeKMSKeyId' is used instead of 'dataVolumeKmsKeyId' (case mismatch).
 * This causes the KMS key ARN to not be properly set in the CloudFormation template.
 * The tests document this behavior and will pass once the mixin is fixed.
 */

import { CfnCluster } from 'aws-cdk-lib/aws-msk';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnClusterEncryptionAtRestMixin } from '../../../lib/services/aws-msk/encryption-at-rest-mixins.generated';

describe('CfnClusterEncryptionAtRestMixin', () => {
  test('supports CfnCluster', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterName: 'test-cluster',
      kafkaVersion: '2.8.1',
      numberOfBrokerNodes: 3,
      brokerNodeGroupInfo: {
        instanceType: 'kafka.m5.large',
        clientSubnets: ['subnet-1', 'subnet-2', 'subnet-3'],
      },
    });
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack, kmsKey } = createTestContext();
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key sets encryptionInfo', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterName: 'test-cluster',
      kafkaVersion: '2.8.1',
      numberOfBrokerNodes: 3,
      brokerNodeGroupInfo: {
        instanceType: 'kafka.m5.large',
        clientSubnets: ['subnet-1', 'subnet-2', 'subnet-3'],
      },
    });
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::MSK::Cluster', {
      ClusterName: 'test-cluster',
      KafkaVersion: '2.8.1',
      NumberOfBrokerNodes: 3,
      BrokerNodeGroupInfo: {
        InstanceType: 'kafka.m5.large',
        ClientSubnets: ['subnet-1', 'subnet-2', 'subnet-3'],
      },
      EncryptionInfo: {
        EncryptionAtRest: {
          DataVolumeKMSKeyId: {
            'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
          },
        },
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterName: 'test-cluster',
      kafkaVersion: '2.8.1',
      numberOfBrokerNodes: 3,
      brokerNodeGroupInfo: {
        instanceType: 'kafka.m5.large',
        clientSubnets: ['subnet-1', 'subnet-2', 'subnet-3'],
      },
    });
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::MSK::Cluster', {
      ClusterName: 'test-cluster',
      KafkaVersion: '2.8.1',
      NumberOfBrokerNodes: 3,
      BrokerNodeGroupInfo: {
        InstanceType: 'kafka.m5.large',
        ClientSubnets: ['subnet-1', 'subnet-2', 'subnet-3'],
      },
      EncryptionInfo: {
        EncryptionAtRest: {
          DataVolumeKMSKeyId: {
            'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
          },
        },
      },
    });
  });

  test('preserves existing cluster configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterName: 'test-cluster',
      kafkaVersion: '2.8.1',
      numberOfBrokerNodes: 3,
      brokerNodeGroupInfo: {
        instanceType: 'kafka.m5.large',
        clientSubnets: ['subnet-1', 'subnet-2', 'subnet-3'],
        securityGroups: ['sg-12345'],
      },
      enhancedMonitoring: 'PER_TOPIC_PER_BROKER',
    });
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::MSK::Cluster', {
      ClusterName: 'test-cluster',
      KafkaVersion: '2.8.1',
      NumberOfBrokerNodes: 3,
      BrokerNodeGroupInfo: {
        InstanceType: 'kafka.m5.large',
        ClientSubnets: ['subnet-1', 'subnet-2', 'subnet-3'],
        SecurityGroups: ['sg-12345'],
      },
      EnhancedMonitoring: 'PER_TOPIC_PER_BROKER',
      EncryptionInfo: {
        EncryptionAtRest: {
          DataVolumeKMSKeyId: {
            'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
          },
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack, kmsKey } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      clusterName: 'test-cluster',
      kafkaVersion: '2.8.1',
      numberOfBrokerNodes: 3,
      brokerNodeGroupInfo: {
        instanceType: 'kafka.m5.large',
        clientSubnets: ['subnet-1', 'subnet-2', 'subnet-3'],
      },
    });
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
