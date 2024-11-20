import { Duration } from '../../core';

/**
 * Algorithms which can be used by SNS to calculate the delays associated with all of the retry attempts between the first and last retries in the backoff phase.
 */
export enum BackoffFunction {
  /**
   * Arithmetic, see {@link https://docs.aws.amazon.com/images/sns/latest/dg/images/backoff-graph.png|this image} for how this function compares to others
   */
  ARITHMETIC = 'ARITHMETIC',
  /**
   * Exponential, see {@link https://docs.aws.amazon.com/images/sns/latest/dg/images/backoff-graph.png|this image} for how this function compares to others
   */
  EXPONENTIAL = 'EXPONENTIAL',
  /**
   * Geometric, see {@link https://docs.aws.amazon.com/images/sns/latest/dg/images/backoff-graph.png|this image} for how this function compares to others
   */
  GEOMETRIC = 'GEOMETRIC',
  /**
   * Linear, see {@link https://docs.aws.amazon.com/images/sns/latest/dg/images/backoff-graph.png|this image} for how this function compares to others
   */
  LINEAR = 'LINEAR',
}

/**
 * Options for customising AWS SNS HTTP/S delivery throttling.
 */
export interface ThrottlePolicy {
  /**
   * The maximum number of deliveries per second, per subscription.
   *
   * @default - no throttling
   */
  readonly maxReceivesPerSecond?: number;
}

/**
 * Options for customising aspects of the content sent in AWS SNS HTTP/S requests.
 */
export interface RequestPolicy {
  /**
   * The content type of the notification being sent to HTTP/S endpoints.
   *
   * @default - text/plain; charset=UTF-8
   */
  readonly headerContentType?: string;
}

/**
 * Options for customising the retry policy of the delivery of SNS messages to HTTP/S endpoints.
 */
export interface HealthyRetryPolicy {
  /**
   * The minimum delay for a retry.  Must be at least one second, not exceed `maxDelayTarget`, and correspond to a whole number of seconds.
   *
   * @default - 20 seconds
   */
  readonly minDelayTarget?: Duration;
  /**
   * The maximum delay for a retry.  Must be at least `minDelayTarget` less than 3,600 seconds, and correspond to a whole number of seconds,
   *
   * @default - 20 seconds
   */
  readonly maxDelayTarget?: Duration;

  /**
   * The total number of retries, including immediate, pre-backoff, backoff, and post-backoff retries.  Must be greater than or equal to zero and not exceed 100.
   *
   * @default 3
   */
  readonly numRetries?: number;

  /**
   * The number of retries to be done immediately, with no delay between them.  Must be zero or greater.
   *
   * @default 0
   */
  readonly numNoDelayRetries?: number;

  /**
   * The number of retries in the pre-backoff phase, with the specified minimum delay between them.  Must be zero or greater
   *
   * @default 0
   */
  readonly numMinDelayRetries?: number;

  /**
   * The number of retries in the post-backoff phase, with the maximum delay between them.  Must be zero or greater
   *
   * @default 0
   */
  readonly numMaxDelayRetries?: number;

  /**
   * The model for backoff between retries.
   *
   * @default - linear
   */
  readonly backoffFunction?: BackoffFunction;
}

/**
 * Options for customising the delivery of SNS messages to HTTP/S endpoints.
 */
export interface DeliveryPolicy {

  /**
   * The retry policy of the delivery of SNS messages to HTTP/S endpoints.
   *
   * @default - Amazon SNS attempts up to three retries with a delay between failed attempts set at 20 seconds
   */
  readonly healthyRetryPolicy?: HealthyRetryPolicy;

  /**
   * The throttling policy of the delivery of SNS messages to HTTP/S endpoints.
   *
   * @default - No throttling
   */
  readonly throttlePolicy?: ThrottlePolicy;

  /**
   * The request of the content sent in AWS SNS HTTP/S requests.
   *
   * @default - The content type is set to 'text/plain; charset=UTF-8'
   */
  readonly requestPolicy?: RequestPolicy;
}
