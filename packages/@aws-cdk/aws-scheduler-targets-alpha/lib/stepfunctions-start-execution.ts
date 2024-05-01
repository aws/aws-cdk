import { IScheduleTarget, ISchedule } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an AWS Step function as a target for AWS EventBridge Scheduler.
 */
export class StepFunctionsStartExecution extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly stateMachine: IStateMachine,
    private readonly props: ScheduleTargetBaseProps,
  ) {
    super(props, stateMachine.stateMachineArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    const stateMachineEnv = this.stateMachine.env;
    if (!sameEnvDimension(stateMachineEnv.region, schedule.env.region)) {
      throw new Error(`Cannot assign stateMachine in region ${stateMachineEnv.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the stateMachine must be in the same region.`);
    }

    if (!sameEnvDimension(stateMachineEnv.account, schedule.env.account)) {
      throw new Error(`Cannot assign stateMachine in account ${stateMachineEnv.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the stateMachine must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, stateMachineEnv.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.stateMachine.node)} in account ${stateMachineEnv.account}. Both the target and the execution role must be in the same account.`);
    }

    this.stateMachine.grantStartExecution(role);
  }
}
