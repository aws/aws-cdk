import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IPipeline } from 'aws-cdk-lib/aws-codepipeline';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an AWS CodePipeline pipeline as a target for AWS EventBridge Scheduler.
 */
export class CodePipelineStartPipelineExecution extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly pipeline: IPipeline,
    private readonly props: ScheduleTargetBaseProps = {},
  ) {
    super(props, pipeline.pipelineArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    const region = this.pipeline.env.region ?? '';
    const account = this.pipeline.env.account ?? '';

    if (!sameEnvDimension(region, schedule.env.region)) {
      throw new Error(`Cannot assign pipeline in region ${region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the pipeline must be in the same region.`);
    }

    if (!sameEnvDimension(account, schedule.env.account)) {
      throw new Error(`Cannot assign pipeline in account ${account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the pipeline must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.pipeline.node)} in account ${account}. Both the target and the execution role must be in the same account.`);
    }

    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codepipeline:StartPipelineExecution'],
      resources: [this.pipeline.pipelineArn],
    }));
  }
}
