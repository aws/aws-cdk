/**
 * Unit tests for AWS EKS encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::EKS::Cluster
 */

import { CfnCluster } from 'aws-cdk-lib/aws-eks';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnClusterEncryptionAtRestMixin } from '../../../lib/services/aws-eks/encryption-at-rest-mixins.generated';

describe('CfnClusterEncryptionAtRestMixin', () => {
  test('supports CfnCluster', () => {
    const { stack } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/eks-cluster-role',
      resourcesVpcConfig: {
        subnetIds: ['subnet-12345678', 'subnet-87654321'],
      },
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnClusterEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (no encryption config set)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/eks-cluster-role',
      resourcesVpcConfig: {
        subnetIds: ['subnet-12345678', 'subnet-87654321'],
      },
    });
    const mixin = new CfnClusterEncryptionAtRestMixin();
    mixin.applyTo(resource);
    // No encryption config set when no KMS key provided - secrets not encrypted by default
    template().hasResourceProperties('AWS::EKS::Cluster', {
      RoleArn: 'arn:aws:iam::123456789012:role/eks-cluster-role',
      ResourcesVpcConfig: {
        SubnetIds: ['subnet-12345678', 'subnet-87654321'],
      },
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnCluster(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/eks-cluster-role',
      resourcesVpcConfig: {
        subnetIds: ['subnet-12345678', 'subnet-87654321'],
      },
    });
    const mixin = new CfnClusterEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::EKS::Cluster', {
      RoleArn: 'arn:aws:iam::123456789012:role/eks-cluster-role',
      ResourcesVpcConfig: {
        SubnetIds: ['subnet-12345678', 'subnet-87654321'],
      },
      EncryptionConfig: [
        {
          Provider: {
            KeyArn: { 'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'] },
          },
        },
      ],
    });
  });
});
