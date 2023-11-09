import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an Amazon SNS topic as a target for AWS EventBridge Scheduler.
 */
export class SnsPublish extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly topic: sns.ITopic,
    private readonly props: ScheduleTargetBaseProps = {},
  ) {
    super(props, topic.topicArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    // Check if target and schedule are in the region
    if (!sameEnvDimension(this.topic.env.region, schedule.env.region)) {
      throw new Error(`Cannot assign topic in region ${this.topic.env.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the topic must be in the same region.`);
    }

    // Check if target and schedule are in the same account
    if (!sameEnvDimension(this.topic.env.account, schedule.env.account)) {
      throw new Error(`Cannot assign topic in account ${this.topic.env.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${role.env.account}. Both the schedule and the topic must be in the same account.`);
    }

    // Check if target and role are in the same account
    if (this.props.role && !sameEnvDimension(this.props.role.env.account, this.topic.env.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to publish to target ${Names.nodeUniqueId(this.topic.node)} in account ${this.topic.env.account}. Both the target and the execution role must be in the same account.`);
    }

    this.topic.grantPublish(role);
  }
}
