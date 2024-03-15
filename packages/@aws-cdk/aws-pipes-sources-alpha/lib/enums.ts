/**
 * Define how to handle item process failures.
 */
export enum OnPartialBatchItemFailure {
  /**
   * AUTOMATIC_BISECT
   */
  AUTOMATIC_BISECT = 'AUTOMATIC_BISECT',
}

/**
 * The position in a Kinesis stream from which to start reading.
 */
export enum KinesisStartingPosition {
  /**
   * TRIM_HORIZON
   */
  TRIM_HORIZON = 'TRIM_HORIZON',
  /**
   * LATEST
   */
  LATEST = 'LATEST',
  /**
   * AT_TIMESTAMP
   */
  AT_TIMESTAMP = 'AT_TIMESTAMP',
}

/**
 * The position in a DynamoDB stream from which to start reading.
 */
export enum DynamoDBStartingPosition {
  /**
   * TRIM_HORIZON
   */
  TRIM_HORIZON = 'TRIM_HORIZON',
  /**
   * LATEST
   */
  LATEST = 'LATEST',
}
