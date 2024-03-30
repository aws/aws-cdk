import { IPipe, ISource, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStream } from 'aws-cdk-lib/aws-kinesis';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import { KinesisStartingPosition } from './enums';
import {
  StreamSourceParameters,
  getDeadLetterTargetArn,
  validateBatchSize,
  validateMaximumBatchingWindow,
  validateMaximumRecordAge,
  validateMaxiumRetryAttemps,
  validateParallelizationFactor,
} from './streamSourceProps';

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
export class KinesisSource implements ISource {
  private readonly stream: IStream;
  readonly sourceArn;
  private sourceParameters;

  private deadLetterTarget?: IQueue | ITopic;
  private deadLetterTargetArn?: string;

  constructor(stream: IStream, parameters: KinesisSourceParameters) {
    this.stream = stream;
    this.sourceArn = stream.streamArn;
    this.sourceParameters = parameters;
    this.deadLetterTarget = this.sourceParameters.deadLetterTarget;

    validateBatchSize(this.sourceParameters.batchSize);
    validateMaximumBatchingWindow(this.sourceParameters.maximumBatchingWindow?.toSeconds());
    validateMaximumRecordAge(this.sourceParameters.maximumRecordAge?.toSeconds());
    validateMaxiumRetryAttemps(this.sourceParameters.maximumRetryAttempts);
    validateParallelizationFactor(this.sourceParameters.parallelizationFactor);
    if (this.sourceParameters.startingPositionTimestamp && this.sourceParameters.startingPosition !== KinesisStartingPosition.AT_TIMESTAMP) {
      throw new Error(`Timestamp only valid with StartingPosition AT_TIMESTAMP for Kinesis streams, received ${this.sourceParameters.startingPosition}`);
    }

    this.deadLetterTargetArn = getDeadLetterTargetArn(this.sourceParameters.deadLetterTarget);
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

  grantDlqPush(grantee: IRole): void {
    if (this.deadLetterTarget instanceof Queue) {
      this.deadLetterTarget.grantSendMessages(grantee);
    } else if (this.deadLetterTarget instanceof Topic) {
      this.deadLetterTarget.grantPublish(grantee);
    }
  }
}
