import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';

/**
 * An enum representing the different types of shard iterators that can be used
 * to read data from a Kinesis data stream.
 */
export enum ShardIteratorType {
  /**
   * Start reading data from the beginning of the shard.
   */
  TRIM_HORIZON = 'TRIM_HORIZON',
  /**
   * Start reading data from the latest available record in the shard.
   */
  LATEST = 'LATEST',
  /**
   * Start reading data from the record at or after the specified sequence number.
   */
  AT_SEQUENCE_NUMBER = 'AT_SEQUENCE_NUMBER',
  /**
   * Start reading data from the record at or after the specified timestamp.
   */
  AT_TIMESTAMP = 'AT_TIMESTAMP',
  /**
   * Start reading data from the record at or after the latest checkpoint in the shard.
   */
  AFTER_SEQUENCE_NUMBER = 'AFTER_SEQUENCE_NUMBER',
}


/**
 * Properties for Kinesis GetShardIterator task.
 */
export interface KinesisGetShardIteratorProps extends sfn.TaskStateBaseProps {
  /**
   * The name of the Kinesis data stream.
   */
  readonly streamName: string;
  /**
   * The shard ID of the Kinesis data stream.
   */
  readonly shardId: string;
  /**
   * Determines the position in the shard from which to start reading data records. Can be one of the following:
   * - `AT_SEQUENCE_NUMBER`: Start reading from the position denoted by a specific sequence number, provided in the
   *   `startingSequenceNumber` property.
   * - `AFTER_SEQUENCE_NUMBER`: Start reading right after the position denoted by a specific sequence number, provided
   *   in the `startingSequenceNumber` property.
   * - `TRIM_HORIZON`: Start reading at the last untrimmed record in the shard in the system, which is the oldest data
   *   record in the shard.
   * - `LATEST`: Start reading just after the most recent record in the shard, so that you always read the most
   *   recent data in the shard.
   * - `AT_TIMESTAMP`: Start reading from the position denoted by a specific time stamp, provided in the
   *   `timestamp` property.
   *
   * Default: `TRIM_HORIZON`
   */
  readonly shardIteratorType: ShardIteratorType;
  /**
   * The sequence number of the data record in the shard from which to start reading. Required if
   * `shardIteratorType` is set to `AT_SEQUENCE_NUMBER` or `AFTER_SEQUENCE_NUMBER`.
   */
  readonly startingSequenceNumber?: string;
  /**
   * The time stamp of the data record from which to start reading. Required if `shardIteratorType` is set to
   * `AT_TIMESTAMP`. A time stamp is the Unix epoch date with precision in milliseconds.
   */
  readonly timestamp?: number;
}


export class KinesisGetShardIterator extends sfn.TaskStateBase {
  protected readonly taskMetrics: sfn.TaskMetricsConfig;
  protected readonly taskPolicies: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: KinesisGetShardIteratorProps) {
    super(scope, id, props);
    this.taskPolicies = [new iam.PolicyStatement({
      actions: ['kinesis:GetShardIterator'],
      resources: [`arn:aws:kinesis:*:*:stream/${this.props.streamName}`],
    })];

    this.taskMetrics = {
      metricPrefixSingular: 'KinesisGetShardIterator',
      metricPrefixPlural: 'KinesisGetShardIterator',
      metricDimensions: { StreamName: this.props.streamName },
    };
  }

  protected _renderTask(): any {
    return {
      Resource: 'arn:aws:states:::aws-sdk:kinesis:getShardIterator',
      Parameters: {
        StreamName: this.props.streamName,
        ShardId: this.props.shardId,
        ShardIteratorType: this.props.shardIteratorType,
        StartingSequenceNumber: this.props.startingSequenceNumber,
        Timestamp: this.props.timestamp,
      },
    };
  }
}
