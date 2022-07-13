import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn } from '../private/task-utils';

/**
 * Supported shard-level metrics.
 * https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html
 */
export enum ShardLevelMetrics {
  INCOMING_BYTES = 'IncomingBytes',
  INCOMING_RECORDS = 'IncomingRecords',
  OUTGOING_BYTES = 'OutgoingBytes',
  OUTGOING_RECORDS = 'OutgoingRecords',
  WRITE_PROVISIONED_THROUGHPUT_EXCEEDED = 'WriteProvisionedThroughputExceeded',
  READ_PROVISIONED_THROUGHPUT_EXCEEDED = 'ReadProvisionedThroughputExceeded',
  ITERATOR_AGE_MILLISECONDS = 'IteratorAgeMilliseconds',
  ALL = 'ALL'
}

/**
 * Properties for the task.
 */
export interface KinesisEnableEnhancedMonitoringProps extends sfn.TaskStateBaseProps {
  /**
   * The name of the stream for which to enable enhanced monitoring.
   */
  readonly streamName: string;

  /**
   * The name of the stream for which to enable enhanced monitoring.
   */
  readonly shardLevelMetrics: ShardLevelMetrics[];
}

/**
 * Task to enable enhanced Kinesis data stream monitoring for shard-level metrics.
 * https://docs.aws.amazon.com/kinesis/latest/APIReference/API_EnableEnhancedMonitoring.html
 */
export class KinesisEnableEnhancedMonitoring extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: KinesisEnableEnhancedMonitoringProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: [
          Stack.of(this).formatArn({
            service: 'kinesis',
            resource: 'stream',
            resourceName: props.streamName,
          }),
        ],
        actions: ['kinesis:EnableEnhancedMonitoring'],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('aws-sdk:kinesis', 'enableEnhancedMonitoring', sfn.IntegrationPattern.REQUEST_RESPONSE),
      Parameters: sfn.FieldUtils.renderObject({
        StreamName: this.props.streamName,
        ShardLevelMetrics: this.props.shardLevelMetrics,
      }),
    };
  }
}
