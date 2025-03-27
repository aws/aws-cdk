import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IRole } from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import { IScheduleTarget } from '../../aws-scheduler';

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
