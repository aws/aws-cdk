import type { ScheduleTargetBaseProps } from './target';
import { ScheduleTargetBase } from './target';
import type { IRole } from '../../aws-iam';
import type { IScheduleTarget } from '../../aws-scheduler';
import type * as sns from '../../aws-sns';

/**
 * Use an Amazon SNS topic as a target for AWS EventBridge Scheduler.
 */
export class SnsPublish extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly topic: sns.ITopic,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, topic.topicArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    this.topic.grantPublish(role);
  }
}
