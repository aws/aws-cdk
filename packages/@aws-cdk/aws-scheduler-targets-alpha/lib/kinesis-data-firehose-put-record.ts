import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an Amazon Kinesis Data Firehose as a target for AWS EventBridge Scheduler.
 */
export class KinesisDataFirehosePutRecord extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly deliveryStream: CfnDeliveryStream,
    private readonly props: ScheduleTargetBaseProps = {},
  ) {
    super(props, deliveryStream.attrArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    if (!sameEnvDimension(this.deliveryStream.stack.region, schedule.env.region)) {
      throw new Error(`Cannot assign the Firehose delivery stream in region ${this.deliveryStream.stack.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the Firehose delivery stream must be in the same region.`);
    }

    if (!sameEnvDimension(this.deliveryStream.stack.account, schedule.env.account)) {
      throw new Error(`Cannot assign the Firehose delivery stream in account ${this.deliveryStream.stack.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the Firehose delivery stream must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, this.deliveryStream.stack.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.deliveryStream.node)} in account ${this.deliveryStream.stack.account}. Both the target and the execution role must be in the same account.`);
    }

    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['firehose:PutRecord'],
      resources: [this.deliveryStream.attrArn],
    }));
  }
}