import { IPipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStream } from 'aws-cdk-lib/aws-kinesis';
import { KinesisStartingPosition } from './enums';
import { StreamSource, StreamSourceParameters } from './streamSource';

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
   * new Date(Date.UTC(1969, 10, 20, 0, 0, 0))
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingpositiontimestamp
   * @default - no starting position timestamp
   */
  readonly startingPositionTimestamp?: Date;
}

/**
 * A source that reads from Kinesis.
 */
export class KinesisSource extends StreamSource {
  private readonly stream: IStream;
  private readonly startingPosition: KinesisStartingPosition;
  private readonly startingPositionTimestamp?: Date;
  private readonly deadLetterTargetArn?: string;

  constructor(stream: IStream, parameters: KinesisSourceParameters) {
    super(stream.streamArn, parameters);
    this.stream = stream;
    this.startingPosition = parameters.startingPosition;
    this.startingPositionTimestamp = parameters.startingPositionTimestamp;
    this.deadLetterTargetArn = this.getDeadLetterTargetArn(this.deadLetterTarget);

    if (this.startingPositionTimestamp && this.startingPosition !== KinesisStartingPosition.AT_TIMESTAMP) {
      throw new Error(`Timestamp only valid with StartingPosition AT_TIMESTAMP for Kinesis streams, received ${this.startingPosition}`);
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
          startingPosition: this.startingPosition,
          startingPositionTimestamp: this.startingPositionTimestamp?.toISOString(),
        },
      },
    };
  }

  grantRead(grantee: IRole): void {
    this.stream.grantRead(grantee);
  }
}
