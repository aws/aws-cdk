import { IPipe, ISource, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { Duration } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStream } from 'aws-cdk-lib/aws-kinesis';
import { DeadLetterConfigParameters } from './deadLetterConfig';

/**
 * Parameters for the Kinesis source.
 */
export interface KinesisSourceParameters {
  /**
    * The maximum number of records to include in each batch.
    *
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-batchsize
    * @default 1
    */
  readonly batchSize?: number;

  /**
    * Define the target queue to send dead-letter queue events to.
    *
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-deadletterconfig
    * @default no dead letter queue
    */
  readonly deadLetterConfig?: DeadLetterConfigParameters;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumbatchingwindowinseconds
   * @default no batching window
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
   *
   * Leave undefined to set the maximum record age to infinite.
   *
   *  @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumrecordageinseconds
   * @default -1 (infinite)
   */
  readonly maximumRecordAge?: Duration;

  /**
   * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumretryattempts
   * @default -1 (infinite)
   */
  readonly maximumRetryAttempts?: number;

  /**
   * (Streams only) Define how to handle item process failures. AUTOMATIC_BISECT halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-onpartialbatchitemfailure
   * @default off
   */
  readonly onPartialBatchItemFailure?: OnPartialBatchItemFailure;

  /**
   * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-parallelizationfactor
   * @default 1
   */
  readonly parallelizationFactor?: number;

  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingposition
   */
  readonly startingPosition: StartingPosition;

  /**
   * With StartingPosition set to AT_TIMESTAMP, the time from which to start reading, in Unix time seconds.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingpositiontimestamp
   * @default no starting position timestamp
   */
  readonly startingPositionTimestamp?: string;
}

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
 * The position in a stream from which to start reading.
 */
export enum StartingPosition {
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
 * A source that reads from Kinesis.
 */
export class KinesisSource implements ISource {
  private readonly stream: IStream;
  readonly sourceArn;
  private sourceParameters;
  private batchSize;
  private maximumBatchingWindowInSeconds;
  private maximumRecordAgeInSeconds;
  private maximumRetryAttempts;
  private parallelizationFactor;

  constructor(stream: IStream, parameters: KinesisSourceParameters) {
    this.stream = stream;
    this.sourceArn = stream.streamArn;
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
        kinesisStreamParameters: {
          batchSize: this.batchSize,
          deadLetterConfig: this.sourceParameters.deadLetterConfig,
          maximumBatchingWindowInSeconds: this.maximumBatchingWindowInSeconds,
          maximumRecordAgeInSeconds: this.maximumRecordAgeInSeconds,
          maximumRetryAttempts: this.maximumRetryAttempts,
          onPartialBatchItemFailure: this.sourceParameters.onPartialBatchItemFailure,
          parallelizationFactor: this.sourceParameters.parallelizationFactor,
          startingPosition: this.sourceParameters.startingPosition,
          startingPositionTimestamp: this.sourceParameters.startingPositionTimestamp,
        },
      },
    };
  }

  grantRead(grantee: IRole): void {
    this.stream.grantRead(grantee);
  }
}
