import { Construct } from 'constructs';
import { CfnApiCache } from './appsync.generated';

/**
 * enum with all Api Caching Behavior values
 */
export enum CacheBehavior {
  /**
   * FULL_REQUEST_CACHING: All requests are fully cached.
   */
  FULL_REQUEST_CACHING = 'FULL_REQUEST_CACHING',
  /**
   * PER_RESOLVER_CACHING: Individual resolvers that you specify are cached.
   */
  PER_RESOLVER_CACHING = 'PER_RESOLVER_CACHING',
}

/**
 * enum with all Health Metrics Configuration options
 */
export enum HealthMetrics {
  /**
   * ENABLE CloudWatch metrics on cache
   */
  ENABLED = 'ENABLED',
  /**
   * DISABLE CloudWatch metrics on cache
   */
  DISABLED = 'DISABLED',
}

/**
 * enum with all cache instance type values
 */
export enum CacheType {
  /**
   * SMALL cache instance type
   */
  SMALL = 'SMALL',
  /**
   * MEDIUM cache instance type
   */
  MEDIUM = 'MEDIUM',
  /**
   * LARGE cache instance type
   */
  LARGE = 'LARGE',
  /**
   * XLARGE cache instance type
   */
  XLARGE = 'XLARGE',
  /**
   * LARGE_2X cache instance type
   */
  LARGE_2X = 'LARGE_2X',
  /**
   * LARGE_4X cache instance type
   */
  LARGE_4X = 'LARGE_4X',
  /**
   * LARGE_8X cache instance type  (not available in all regions)
   */
  LARGE_8X = 'LARGE_8X ',
  /**
   * LARGE_12X cache instance type
   */
  LARGE_12X = 'LARGE_12X',
}

/**
 * Base properties for an Api Cache
 */
export interface ApiCacheBaseProps {
  /**
   * Caching behavior
   */
  readonly apiCachingBehavior: CacheBehavior;

  /**
   * At-rest encryption flag for cache
   *
   * @default - idk
   */
  readonly atRestEncryptionEnabled?: boolean;
  /**
   * Controls how cache health metrics will be emitted to CloudWatch
   * Metrics will be recorded by API ID
   *
   * @default - idk
   */
  readonly healthMetricsConfig?: HealthMetrics;
  /**
   * Transit encryption flag when connecting to cache
   *
   * @default - idk
   */
  readonly transitEncryptionEnabled?: boolean;
  /**
   * TTL in seconds for cache entries. Valid values are 1–3,600 seconds.
   *
   */
  readonly ttl: number;
  /**
   * The cache instance type
   */
  readonly type: CacheType;
}

/**
 * Properties for an Api Cache
 */
export interface ApiCacheProps extends ApiCacheBaseProps {
  /**
   * The GraphQL API ID.
   */
  readonly apiId: string;
}

/**
 * Cache for a GraphQL API
 */
export class ApiCache extends Construct {
  constructor(scope: Construct, id: string, props: ApiCacheProps) {
    super(scope, id);

    new CfnApiCache(this, 'Resource', {
      apiId: props.apiId,
      apiCachingBehavior: props.apiCachingBehavior,
      atRestEncryptionEnabled: props.atRestEncryptionEnabled,
      healthMetricsConfig: props.healthMetricsConfig,
      transitEncryptionEnabled: props.transitEncryptionEnabled,
      ttl: props.ttl,
      type: props.type,
    });
  }
}