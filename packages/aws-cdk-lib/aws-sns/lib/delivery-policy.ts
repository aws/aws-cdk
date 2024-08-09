/**
 * Algorithms which can be used by SNS to calculate the delays associated with all of the retry attempts between the first and last retries in the backoff phase.
 */
export enum BackoffFunction {
  /** Arithmetic.
   */
  ARITHMETIC = 'ARITHMETIC',
  /** Geometric.
   */
  EXPONENTIAL = 'EXPONENTIAL',
  /** Linear.
   */
  GEOMETRIC = 'GEOMETRIC',
  /** Linear.
   */
  LINEAR = 'LINEAR',
}

/**
 * Options for customising AWS SNS HTTP/S delivery throttling.
 */
export interface ThrottlePolicy {
  /** The maximum number of deliveries per second, per subscription.
   * @default - no throttling
   */
  readonly maxReceivesPerSecond?: number;
}

/**
 * Options for customising aspects of the content sent in AWS SNS HTTP/S requests.
 */
export interface RequestPolicy {
  /** The content type of the notification being sent to HTTP/S endpoints.
   * @default - text/plain; charset=UTF-8
   */
  readonly headerContentType?: string;
}

/**
 * Options for customising the retry policy of the delivery of SNS messages to HTTP/S endpoints.
 */
export interface HealthyRetryPolicy {
  /** The minimum delay for a retry (in seconds).  Must be at least 1 and not exceed `maxDelayTarget`.
   * @default 20
   */
  readonly minDelayTarget: number;
  /** The maximum delay for a retry (in seconds).  Must be at least `minDelayTarget` and less than 3,600.
   * @default 20
   */
  readonly maxDelayTarget: number;

  /** The total number of retries, including immediate, pre-backoff, backoff, and post-backoff retries.  Must be greater than or equal to zero and not exceed 100.
   * @default 3
   */
  readonly numRetries: number;

  /** The number of retries to be done immediately, with no delay between them.  Must be zero or greater.
   * @default 0
   */
  readonly numNoDelayRetries?: number;

  /** The number of retries in the pre-backoff phase, with the specified minimum delay between them.  Must be zero or greater
   * @default 0
   */
  readonly numMinDelayRetries?: number;

  /** The number of retries in the post-backoff phase, with the maximum delay between them.  Must be zero or greater
   * @default 0
   */
  readonly numMaxDelayRetries?: number;

  /** The model for backoff between retries.
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
   * @default - Amazon SNS attempts up to three retries with a delay between failed attempts set at 20 seconds
   */
  readonly healthyRetryPolicy?: HealthyRetryPolicy;

  /**
   * The throttling policy of the delivery of SNS messages to HTTP/S endpoints.
   * @default - No throttling
   */
  readonly throttlePolicy?: ThrottlePolicy;

  /**
   * The request of the content sent in AWS SNS HTTP/S requests.
   * @default - The content type is set to 'text/plain; charset=UTF-8'
   */
  readonly requestPolicy?: RequestPolicy;
}
