import { IScheduleTarget, ISchedule } from '@aws-cdk/aws-scheduler-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Use an AWS Step function as a target for AWS EventBridge Scheduler.
 */
export class StepFunctionsStartExecution extends ScheduleTargetBase implements IScheduleTarget {
  private readonly stateMachine: IStateMachine;

  constructor(
    stateMachine: IStateMachine,
    props: ScheduleTargetBaseProps,
  ) {
    super(props, stateMachine.stateMachineArn);
    this.stateMachine = stateMachine;
  }

  protected addTargetActionToRole(_schedule: ISchedule, role: IRole): void {
    this.stateMachine.grantStartExecution(role);
  }
}
