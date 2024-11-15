import { ISchedule, IScheduleTarget, ScheduleTargetConfig } from '@aws-cdk/aws-scheduler-alpha';
import { Token } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

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
