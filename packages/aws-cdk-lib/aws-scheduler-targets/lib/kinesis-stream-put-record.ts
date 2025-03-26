import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IRole } from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import { ISchedule, IScheduleTarget, ScheduleTargetConfig } from '../../aws-scheduler';
import { Token } from '../../core';

/**
 * Properties for a Kinesis Data Streams Target
 */
export interface KinesisStreamPutRecordProps extends ScheduleTargetBaseProps {
  /**
   * The shard to which EventBridge Scheduler sends the event.
   *
   * The length must be between 1 and 256.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-kinesisparameters.html
   */
  readonly partitionKey: string;
}

/**
 * Use an Amazon Kinesis Data Streams as a target for AWS EventBridge Scheduler.
 */
export class KinesisStreamPutRecord extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly stream: kinesis.IStream,
    private readonly props: KinesisStreamPutRecordProps,
  ) {
    super(props, stream.streamArn);

    if (!Token.isUnresolved(props.partitionKey) && (props.partitionKey.length < 1 || props.partitionKey.length > 256)) {
      throw new Error(`partitionKey length must be between 1 and 256, got ${props.partitionKey.length}`);
    }
  }

  protected addTargetActionToRole(role: IRole): void {
    this.stream.grant(role, 'kinesis:PutRecord', 'kinesis:PutRecords');
    this.stream.encryptionKey?.grant(role, 'kms:GenerateDataKey*');
  }

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    return {
      ...super.bindBaseTargetConfig(_schedule),
      kinesisParameters: {
        partitionKey: this.props.partitionKey,
      },
    };
  }
}
