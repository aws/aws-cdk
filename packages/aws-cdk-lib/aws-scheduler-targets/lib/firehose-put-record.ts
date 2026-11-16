import type { ScheduleTargetBaseProps } from './target';
import { ScheduleTargetBase } from './target';
import type { IRole } from '../../aws-iam';
import { PolicyStatement } from '../../aws-iam';
import type { IDeliveryStream } from '../../aws-kinesisfirehose';
import type { IScheduleTarget } from '../../aws-scheduler';

/**
 * Use an Amazon Data Firehose as a target for AWS EventBridge Scheduler.
 */
export class FirehosePutRecord extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly deliveryStream: IDeliveryStream,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, deliveryStream.deliveryStreamArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['firehose:PutRecord'],
      resources: [this.deliveryStream.deliveryStreamArn],
    }));
  }
}
