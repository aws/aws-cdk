import { IPipe, SourceConfig, SourceWithDlq } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStream } from 'aws-cdk-lib/aws-kinesis';
import { KinesisStartingPosition } from './enums';
import {
  StreamSourceParameters,
  validateBatchSize,
  validateMaximumBatchingWindow,
  validateMaximumRecordAge,
  validateMaxiumRetryAttemps,
  validateParallelizationFactor,
} from './streamSource';

/**
 * Parameters for the Kinesis source.
 */
export interface KinesisSourceParameters extends StreamSourceParameters {
  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingposition
   */
  readonly startingPosition: KinesisStartingPosition;

  /**
   * With StartingPosition set to AT_TIMESTAMP, the time from which to start reading, in ISO 8601 format.
   *
   * @example
   * '2025-01-01T00:00:00Z'
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingpositiontimestamp
   * @default - no starting position timestamp
   */
  readonly startingPositionTimestamp?: string;
}

/**
 * A source that reads from Kinesis.
 */
export class KinesisSource extends SourceWithDlq {
  private readonly stream: IStream;
  private sourceParameters;

  constructor(stream: IStream, parameters: KinesisSourceParameters) {
    super(stream.streamArn, parameters.deadLetterTarget);

    this.stream = stream;
    this.sourceParameters = parameters;

    validateBatchSize(this.sourceParameters.batchSize);
    validateMaximumBatchingWindow(this.sourceParameters.maximumBatchingWindow?.toSeconds());
    validateMaximumRecordAge(this.sourceParameters.maximumRecordAge?.toSeconds());
    validateMaxiumRetryAttemps(this.sourceParameters.maximumRetryAttempts);
    validateParallelizationFactor(this.sourceParameters.parallelizationFactor);

    if (this.sourceParameters.startingPositionTimestamp && this.sourceParameters.startingPosition !== KinesisStartingPosition.AT_TIMESTAMP) {
      throw new Error(`Timestamp only valid with StartingPosition AT_TIMESTAMP for Kinesis streams, received ${this.sourceParameters.startingPosition}`);
    }
  }

  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: {
        kinesisStreamParameters: {
          batchSize: this.sourceParameters.batchSize,
          deadLetterConfig: this.deadLetterTargetArn ? { arn: this.deadLetterTargetArn } : undefined,
          maximumBatchingWindowInSeconds: this.sourceParameters.maximumBatchingWindow?.toSeconds(),
          maximumRecordAgeInSeconds: this.sourceParameters.maximumRecordAge?.toSeconds(),
          maximumRetryAttempts: this.sourceParameters.maximumRetryAttempts,
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
