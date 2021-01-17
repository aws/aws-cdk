import * as cdk from '@aws-cdk/core';
import { IBucket } from './bucket';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Implemented by constructs that can be used as bucket notification destinations.
 */
export interface IBucketNotificationDestination {
  /**
   * Registers this resource to receive notifications for the specified
   * bucket. This method will only be called once for each destination/bucket
   * pair and the result will be cached, so there is no need to implement
   * idempotency in each destination.
   * @param bucket The bucket object to bind to
   */
  bind(scope: Construct, bucket: IBucket): BucketNotificationDestinationConfig;
}

/**
 * Represents the properties of a notification destination.
 */
export interface BucketNotificationDestinationConfig {
  /**
   * The notification type.
   */
  readonly type: BucketNotificationDestinationType;

  /**
   * The ARN of the destination (i.e. Lambda, SNS, SQS).
   */
  readonly arn: string;

  /**
   * Any additional dependencies that should be resolved before the bucket notification
   * can be configured (for example, the SNS Topic Policy resource).
   */
  readonly dependencies?: cdk.IDependable[]
}

/**
 * Supported types of notification destinations.
 */
export enum BucketNotificationDestinationType {
  LAMBDA,
  QUEUE,
  TOPIC
}
