import { ISchedule, IScheduleTarget, ScheduleTargetConfig } from '@aws-cdk/aws-scheduler-alpha';
import { Names, Token } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

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

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    if (!sameEnvDimension(this.stream.env.region, schedule.env.region)) {
      throw new Error(`Cannot assign stream in region ${this.stream.env.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the stream must be in the same region.`);
    }

    if (!sameEnvDimension(this.stream.env.account, schedule.env.account)) {
      throw new Error(`Cannot assign stream in account ${this.stream.env.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the stream must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, this.stream.env.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.stream.node)} in account ${this.stream.env.account}. Both the target and the execution role must be in the same account.`);
    }

    this.stream.grantWrite(role);
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