import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import { ScheduleTargetInput } from '../input';
import { ISchedule } from '../schedule';

/**
 * DISCLAIMER: WORK IN PROGRESS, INTERFACE MIGHT CHANGE
 *
 * This unit is not yet finished. The LambaInvoke target is only implemented to be able
 * to create some sensible unit tests.
 */

export namespace targets {
  export interface ScheduleTargetBaseProps {
    readonly role?: iam.IRole;
    readonly input?: ScheduleTargetInput;
  }

  abstract class ScheduleTargetBase {
    constructor(
      private readonly baseProps: ScheduleTargetBaseProps,
      protected readonly targetArn: string,
    ) {
    }

    protected abstract addTargetActionToRole(role: iam.IRole): void;

    protected bindBaseTargetConfig(_schedule: ISchedule): CfnSchedule.TargetProperty {
      if (typeof this.baseProps.role === undefined) {
        throw Error('A role is needed (for now)');
      }
      this.addTargetActionToRole(this.baseProps.role!);
      return {
        arn: this.targetArn,
        roleArn: this.baseProps.role!.roleArn,
        input: this.baseProps.input?.bind(_schedule),
      };
    }

    bind(schedule: ISchedule): CfnSchedule.TargetProperty {
      return this.bindBaseTargetConfig(schedule);
    }
  }

  export class LambdaInvoke extends ScheduleTargetBase {
    constructor(
      baseProps: ScheduleTargetBaseProps,
      private readonly func: lambda.IFunction,
    ) {
      super(baseProps, func.functionArn);
    }

    protected addTargetActionToRole(role: iam.IRole): void {
      this.func.grantInvoke(role);
    }
  }
}