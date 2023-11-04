import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an SNS topic as a target for AWS EventBridge Scheduler.
 */
export class SnsPublish extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly topic: ITopic,
    private readonly props: ScheduleTargetBaseProps = {},
  ) {
    super(props, topic.topicArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    if (!sameEnvDimension(this.topic.env.region, schedule.env.region)) {
      throw new Error(`Cannot assign topic in region ${this.topic.env.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the topic must be in the same region.`);
    }

    if (!sameEnvDimension(this.topic.env.account, schedule.env.account)) {
      throw new Error(`Cannot assign topic in account ${this.topic.env.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the topic must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, schedule.env.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.account}. Both the target and the execution role must be in the same account.`);
    }

    this.topic.grantPublish(role);
  }
}