import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IRole } from '../../aws-iam';
import { IScheduleTarget } from '../../aws-scheduler';
import { IStateMachine } from '../../aws-stepfunctions';

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
