import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an AWS Lambda function as a target for AWS EventBridge Scheduler.
 */
export class LambdaInvoke extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly func: lambda.IFunction,
    private readonly props: ScheduleTargetBaseProps,
  ) {
    super(props, func.functionArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    if (!sameEnvDimension(this.func.env.region, schedule.env.region)) {
      throw new Error(`Cannot assign function in region ${this.func.env.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the function must be in the same region.`);
    }

    if (!sameEnvDimension(this.func.env.account, schedule.env.account)) {
      throw new Error(`Cannot assign function in account ${this.func.env.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the function must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, this.func.env.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.func.node)} in account ${this.func.env.account}. Both the target and the execution role must be in the same account.`);
    }

    this.func.grantInvoke(role);
  }
}