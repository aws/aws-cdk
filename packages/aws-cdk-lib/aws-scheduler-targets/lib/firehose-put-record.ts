import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IRole, PolicyStatement } from '../../aws-iam';
import { IDeliveryStream } from '../../aws-kinesisfirehose';
import { IScheduleTarget } from '../../aws-scheduler';

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
