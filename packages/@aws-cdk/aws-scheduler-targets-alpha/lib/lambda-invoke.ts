import { IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

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
