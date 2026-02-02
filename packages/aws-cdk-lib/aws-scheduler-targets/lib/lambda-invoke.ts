import type { ScheduleTargetBaseProps } from './target';
import { ScheduleTargetBase } from './target';
import type { IRole } from '../../aws-iam';
import type * as lambda from '../../aws-lambda';
import type { IScheduleTarget } from '../../aws-scheduler';

/**
 * Use an AWS Lambda function as a target for AWS EventBridge Scheduler.
 */
export class LambdaInvoke extends ScheduleTargetBase implements IScheduleTarget {
  private readonly func: lambda.IFunction;

  constructor(
    func: lambda.IFunction,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, func.functionArn);
    this.func = func;
  }

  protected addTargetActionToRole(role: IRole): void {
    this.func.grantInvoke(role);
  }
}
