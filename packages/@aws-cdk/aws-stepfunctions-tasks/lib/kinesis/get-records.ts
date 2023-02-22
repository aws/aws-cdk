import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Properties for getting records from an Amazon Kinesis stream as a task
 */
export interface KinesisGetRecordsProps extends sfn.TaskStateBaseProps {

  /**
   * The stream name to read from
   */
  readonly streamName: string;

  /**
   * The iterator to use to start reading from the stream
   */
  readonly shardIterator: string;

  /**
   * The maximum number of records to return from the stream
   *
   * @default - 10000
   */
  readonly limit?: number;

}

export class KinesisGetRecords extends sfn.TaskStateBase {

  protected readonly taskMetrics: sfn.TaskMetricsConfig;
  protected readonly taskPolicies: iam.PolicyStatement[];
  private readonly streamArn: string;

  constructor(scope: Construct, id: string, private readonly props: KinesisGetRecordsProps) {
    super(scope, id, props);

    this.streamArn = Stack.of(this).formatArn({
      service: 'kinesis',
      resource: this.props.streamName,
    });

    this.taskPolicies = [new iam.PolicyStatement({
      resources: [
        this.streamArn,
      ],
      actions: [
        'kinesis:GetRecords',
        'kinesis:DescribeStream',
      ],
    })];

    this.taskMetrics = {
      metricPrefixSingular: 'KinesisGetRecords',
      metricPrefixPlural: 'KinesisGetRecords',
      metricDimensions: { StreamName: this.props.streamName },
    };
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: 'arn:aws:states:::aws-sdk:kinesis:getRecords',
      Parameters: {
        StreamARN: this.streamArn,
        ShardIterator: this.props.shardIterator,
        Limit: this.props.limit ?? 10000,
      },
    };
  }
}