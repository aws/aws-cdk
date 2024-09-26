/**
 * Define how to handle item process failures.
 */
export enum OnPartialBatchItemFailure {
  /**
   * EventBridge halves each batch and will retry each half until all the
   * records are processed or there is one failed message left in the batch.
   */
  AUTOMATIC_BISECT = 'AUTOMATIC_BISECT',
}

/**
 * The position in a Kinesis stream from which to start reading.
 */
export enum KinesisStartingPosition {
  /**
   * Start streaming at the last untrimmed record in the shard,
   * which is the oldest data record in the shard.
   */
  TRIM_HORIZON = 'TRIM_HORIZON',
  /**
   * Start streaming just after the most recent record in the shard,
   * so that you always read the most recent data in the shard.
   */
  LATEST = 'LATEST',
  /**
   * Start streaming from the position denoted by the time stamp
   * specified in the `startingPositionTimestamp` field.
   */
  AT_TIMESTAMP = 'AT_TIMESTAMP',
}

/**
 * The position in a DynamoDB stream from which to start reading.
 */
export enum DynamoDBStartingPosition {
  /**
   * Start reading at the last (untrimmed) stream record,
   * which is the oldest record in the shard.
   */
  TRIM_HORIZON = 'TRIM_HORIZON',
  /**
   * Start reading just after the most recent stream record in the shard,
   * so that you always read the most recent data in the shard.
   */
  LATEST = 'LATEST',
}
