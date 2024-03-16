import { IPipe, ISource, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { Duration } from 'aws-cdk-lib';
import { ITableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { DeadLetterConfigParameters } from './deadLetterConfig';
import { DynamoDBStartingPosition, OnPartialBatchItemFailure } from './enums';

/**
 * Parameters for the DynamoDB source.
 */
export interface DynamoDBSourceParameters {
  /**
    * The maximum number of records to include in each batch.
    *
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-batchsize
    * @default 1
    */
  readonly batchSize?: number;

  /**
    * Define the target queue to send dead-letter queue events to.
    *
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-deadletterconfig
    * @default no dead letter queue
    */
  readonly deadLetterConfig?: DeadLetterConfigParameters;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumbatchingwindowinseconds
   * @default no batching window
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
   *
   * Leave undefined to set the maximum record age to infinite.
   *
   *  @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumrecordageinseconds
   * @default -1 (infinite)
   */
  readonly maximumRecordAge?: Duration;

  /**
   * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumretryattempts
   * @default -1 (infinite)
   */
  readonly maximumRetryAttempts?: number;

  /**
   * (Streams only) Define how to handle item process failures. AUTOMATIC_BISECT halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-onpartialbatchitemfailure
   * @default off
   */
  readonly onPartialBatchItemFailure?: OnPartialBatchItemFailure;

  /**
   * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-parallelizationfactor
   * @default 1
   */
  readonly parallelizationFactor?: number;

  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-startingposition
   */
  readonly startingPosition: DynamoDBStartingPosition;
}

/**
 * A source that reads from an DynamoDB stream.
 */
export class DynamoDBSource implements ISource {
  private readonly table: ITableV2;
  readonly sourceArn;
  private sourceParameters;

  private batchSize;
  private maximumBatchingWindowInSeconds;
  private maximumRecordAgeInSeconds;
  private maximumRetryAttempts;
  private parallelizationFactor;

  constructor(table: ITableV2, parameters: DynamoDBSourceParameters) {
    this.table = table;

    if (table.tableStreamArn === undefined) {
      throw new Error('Table does not have a stream defined, cannot create pipes source');
    }

    this.sourceArn = table.tableStreamArn;
    this.sourceParameters = parameters;

    this.batchSize = this.sourceParameters.batchSize;
    this.maximumBatchingWindowInSeconds = this.sourceParameters.maximumBatchingWindow?.toSeconds();
    this.maximumRecordAgeInSeconds = this.sourceParameters.maximumRecordAge?.toSeconds();
    this.maximumRetryAttempts = this.sourceParameters.maximumRetryAttempts;
    this.parallelizationFactor = this.sourceParameters.parallelizationFactor;

    if (this.batchSize !== undefined) {
      if (this.batchSize < 1 || this.batchSize > 10000) {
        throw new Error(`Batch size must be between 1 and 10000, received ${this.batchSize}`);
      }
    }
    if (this.maximumBatchingWindowInSeconds !== undefined) {
      // only need to check upper bound since Duration amounts cannot be negative
      if (this.maximumBatchingWindowInSeconds > 300) {
        throw new Error(`Maximum batching window must be between 0 and 300, received ${this.maximumBatchingWindowInSeconds}`);
      }
    }
    if (this.maximumRecordAgeInSeconds !== undefined) {
      // only need to check upper bound since Duration amounts cannot be negative
      if (this.maximumRecordAgeInSeconds > 604800) {
        throw new Error(`Maximum record age in seconds must be between -1 and 604800, received ${this.maximumRecordAgeInSeconds}`);
      }
    }
    if (this.maximumRetryAttempts !== undefined) {
      if (this.maximumRetryAttempts < -1 || this.maximumRetryAttempts > 10000) {
        throw new Error(`Maximum retry attempts must be between -1 and 10000, received ${this.maximumRetryAttempts}`);
      }
    }
    if (this.parallelizationFactor !== undefined) {
      if (this.parallelizationFactor < 1 || this.parallelizationFactor > 10) {
        throw new Error(`Parallelization factor must be between 1 and 10, received ${this.parallelizationFactor}`);
      }
    }
  }

  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: {
        dynamoDbStreamParameters: {
          batchSize: this.batchSize,
          deadLetterConfig: this.sourceParameters.deadLetterConfig,
          maximumBatchingWindowInSeconds: this.maximumBatchingWindowInSeconds,
          maximumRecordAgeInSeconds: this.maximumRecordAgeInSeconds,
          maximumRetryAttempts: this.maximumRetryAttempts,
          onPartialBatchItemFailure: this.sourceParameters.onPartialBatchItemFailure,
          parallelizationFactor: this.sourceParameters.parallelizationFactor,
          startingPosition: this.sourceParameters.startingPosition,
        },
      },
    };
  }

  grantRead(grantee: IRole): void {
    this.table.grantStreamRead(grantee);
  }
}

