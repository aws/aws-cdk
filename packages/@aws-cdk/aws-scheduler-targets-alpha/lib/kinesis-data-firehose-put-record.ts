import { IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Use an Amazon Kinesis Data Firehose as a target for AWS EventBridge Scheduler.
 */
export class KinesisDataFirehosePutRecord extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly deliveryStream: CfnDeliveryStream,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, deliveryStream.attrArn);
  }

  protected addTargetActionToRole(role: IRole): void {

    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['firehose:PutRecord'],
      resources: [this.deliveryStream.attrArn],
    }));
  }
}
