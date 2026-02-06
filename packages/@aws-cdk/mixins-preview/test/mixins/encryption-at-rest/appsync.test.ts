/**
 * Unit tests for AWS AppSync encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::AppSync::ApiCache (no KMS support)
 *
 * AppSync ApiCache supports encryption at rest but does not support
 * customer-managed KMS keys. The mixin enables encryption via the
 * atRestEncryptionEnabled property.
 */

import { CfnApiCache } from 'aws-cdk-lib/aws-appsync';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import { CfnApiCacheEncryptionAtRestMixin } from '../../../lib/services/aws-appsync/encryption-at-rest-mixins.generated';

describe('CfnApiCacheEncryptionAtRestMixin', () => {
  test('supports CfnApiCache', () => {
    const { stack } = createTestContext();
    const resource = new CfnApiCache(stack, 'Resource', {
      apiCachingBehavior: 'FULL_REQUEST_CACHING',
      apiId: 'test-api-id',
      ttl: 300,
      type: 'SMALL',
    });
    const mixin = new CfnApiCacheEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnApiCacheEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption (no KMS support - uses service-managed encryption)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnApiCache(stack, 'Resource', {
      apiCachingBehavior: 'FULL_REQUEST_CACHING',
      apiId: 'test-api-id',
      ttl: 300,
      type: 'SMALL',
    });
    const mixin = new CfnApiCacheEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppSync::ApiCache', {
      ApiCachingBehavior: 'FULL_REQUEST_CACHING',
      ApiId: 'test-api-id',
      AtRestEncryptionEnabled: true,
    });
  });

  test('preserves existing configuration when applying encryption', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnApiCache(stack, 'Resource', {
      apiCachingBehavior: 'PER_RESOLVER_CACHING',
      apiId: 'test-api-id',
      ttl: 600,
      type: 'MEDIUM',
      transitEncryptionEnabled: true,
    });
    const mixin = new CfnApiCacheEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::AppSync::ApiCache', {
      ApiCachingBehavior: 'PER_RESOLVER_CACHING',
      ApiId: 'test-api-id',
      Ttl: 600,
      Type: 'MEDIUM',
      TransitEncryptionEnabled: true,
      AtRestEncryptionEnabled: true,
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnApiCache(stack, 'Resource', {
      apiCachingBehavior: 'FULL_REQUEST_CACHING',
      apiId: 'test-api-id',
      ttl: 300,
      type: 'SMALL',
    });
    const mixin = new CfnApiCacheEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
