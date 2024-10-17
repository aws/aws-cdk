import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Use an Amazon SNS topic as a target for AWS EventBridge Scheduler.
 */
export class SnsPublish extends ScheduleTargetBase implements IScheduleTarget {
  private readonly topic: sns.ITopic;

  constructor(
    topic: sns.ITopic,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, topic.topicArn);
    this.topic = topic;
  }

  protected addTargetActionToRole(_schedule: ISchedule, role: IRole): void {
    this.topic.grantPublish(role);
  }
}
