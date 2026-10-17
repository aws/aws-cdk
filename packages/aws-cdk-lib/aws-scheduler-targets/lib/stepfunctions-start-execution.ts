import type { ScheduleTargetBaseProps } from './target';
import { ScheduleTargetBase } from './target';
import type { IRole } from '../../aws-iam';
import type { IScheduleTarget } from '../../aws-scheduler';
import type { IStateMachine } from '../../aws-stepfunctions';

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
