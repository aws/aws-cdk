import { Duration } from '@aws-cdk/core';

/**
 * CachingConfig for AppSync resolvers
 */
export interface CachingConfig {
  /**
   * The caching keys for a resolver that has caching enabled.
   * Valid values are entries from the $context.arguments, $context.source, and $context.identity maps.
   *
   * @default - No caching keys
   */
  readonly cachingKeys?: string[];

  /**
   * The TTL in seconds for a resolver that has caching enabled.
   * Valid values are between 1 and 3600 seconds.
   *
   */
  readonly ttl: Duration;
}
