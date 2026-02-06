/**
 * Unit tests for AWS EC2 Security-related encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::EC2::VerifiedAccessEndpoint
 * - AWS::EC2::VerifiedAccessGroup
 * - AWS::EC2::VerifiedAccessTrustProvider
 *
 * These EC2 resources support optional KMS encryption for security-related features.
 *
 * Note: AWS::EC2::EnclaveCertificateIamRoleAssociation is NOT included because
 * EncryptionKmsKeyId is a read-only attribute (returned via Fn::GetAtt), not a
 * settable property. The encryption key is automatically managed by AWS.
 */

import {
  CfnVerifiedAccessEndpoint,
  CfnVerifiedAccessGroup,
  CfnVerifiedAccessTrustProvider,
} from 'aws-cdk-lib/aws-ec2';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnVerifiedAccessEndpointEncryptionAtRestMixin,
  CfnVerifiedAccessGroupEncryptionAtRestMixin,
  CfnVerifiedAccessTrustProviderEncryptionAtRestMixin,
} from '../../../lib/services/aws-ec2/encryption-at-rest-mixins.generated';

describe('CfnVerifiedAccessEndpointEncryptionAtRestMixin', () => {
  test('supports CfnVerifiedAccessEndpoint', () => {
    const { stack } = createTestContext();
    const resource = new CfnVerifiedAccessEndpoint(stack, 'Resource', {
      applicationDomain: 'app.example.com',
      attachmentType: 'vpc',
      domainCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/test-cert',
      endpointDomainPrefix: 'test',
      endpointType: 'load-balancer',
      verifiedAccessGroupId: 'vag-12345678',
    });
    const mixin = new CfnVerifiedAccessEndpointEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnVerifiedAccessEndpointEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnVerifiedAccessEndpoint(stack, 'Resource', {
      applicationDomain: 'app.example.com',
      attachmentType: 'vpc',
      domainCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/test-cert',
      endpointDomainPrefix: 'test',
      endpointType: 'load-balancer',
      verifiedAccessGroupId: 'vag-12345678',
    });
    const mixin = new CfnVerifiedAccessEndpointEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::EC2::VerifiedAccessEndpoint', {
      ApplicationDomain: 'app.example.com',
      SseSpecification: {
        KmsKeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnVerifiedAccessEndpoint(stack, 'Resource', {
      applicationDomain: 'app.example.com',
      attachmentType: 'vpc',
      domainCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/test-cert',
      endpointDomainPrefix: 'test',
      endpointType: 'load-balancer',
      verifiedAccessGroupId: 'vag-12345678',
    });
    const mixin = new CfnVerifiedAccessEndpointEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnVerifiedAccessGroupEncryptionAtRestMixin', () => {
  test('supports CfnVerifiedAccessGroup', () => {
    const { stack } = createTestContext();
    const resource = new CfnVerifiedAccessGroup(stack, 'Resource', {
      verifiedAccessInstanceId: 'vai-12345678',
    });
    const mixin = new CfnVerifiedAccessGroupEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnVerifiedAccessGroupEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnVerifiedAccessGroup(stack, 'Resource', {
      verifiedAccessInstanceId: 'vai-12345678',
    });
    const mixin = new CfnVerifiedAccessGroupEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::EC2::VerifiedAccessGroup', {
      VerifiedAccessInstanceId: 'vai-12345678',
      SseSpecification: {
        KmsKeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnVerifiedAccessGroup(stack, 'Resource', {
      verifiedAccessInstanceId: 'vai-12345678',
    });
    const mixin = new CfnVerifiedAccessGroupEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnVerifiedAccessTrustProviderEncryptionAtRestMixin', () => {
  test('supports CfnVerifiedAccessTrustProvider', () => {
    const { stack } = createTestContext();
    const resource = new CfnVerifiedAccessTrustProvider(stack, 'Resource', {
      policyReferenceName: 'test-policy',
      trustProviderType: 'user',
      userTrustProviderType: 'iam-identity-center',
    });
    const mixin = new CfnVerifiedAccessTrustProviderEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnVerifiedAccessTrustProviderEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnVerifiedAccessTrustProvider(stack, 'Resource', {
      policyReferenceName: 'test-policy',
      trustProviderType: 'user',
      userTrustProviderType: 'iam-identity-center',
    });
    const mixin = new CfnVerifiedAccessTrustProviderEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::EC2::VerifiedAccessTrustProvider', {
      PolicyReferenceName: 'test-policy',
      SseSpecification: {
        KmsKeyArn: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnVerifiedAccessTrustProvider(stack, 'Resource', {
      policyReferenceName: 'test-policy',
      trustProviderType: 'user',
      userTrustProviderType: 'iam-identity-center',
    });
    const mixin = new CfnVerifiedAccessTrustProviderEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
