import { IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Use an AWS Step function as a target for AWS EventBridge Scheduler.
 */
export class StepFunctionsStartExecution extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly stateMachine: IStateMachine,
    props: ScheduleTargetBaseProps,
  ) {
    super(props, stateMachine.stateMachineArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    this.stateMachine.grantStartExecution(role);
  }
}
