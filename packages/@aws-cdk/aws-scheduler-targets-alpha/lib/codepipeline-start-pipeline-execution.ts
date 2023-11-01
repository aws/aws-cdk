import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IPipeline } from 'aws-cdk-lib/aws-codepipeline';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

export class CodePipelineStartPipelineExecution extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly pipeline: IPipeline,
    private readonly props: ScheduleTargetBaseProps,
  ) {
    super(props, pipeline.pipelineArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    const pipelineEnv = this.pipeline.env;
    if (!sameEnvDimension(pipelineEnv.region, schedule.env.region)) {
      throw new Error(`Cannot assign pipeline in region ${pipelineEnv.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the pipeline must be in the same region.`);
    }

    if (!sameEnvDimension(pipelineEnv.account, schedule.env.account)) {
      throw new Error(`Cannot assign pipeline in account ${pipelineEnv.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the pipeline must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, pipelineEnv.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.pipeline.node)} in account ${pipelineEnv.account}. Both the target and the execution role must be in the same account.`);
    }

    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codepipeline:StartPipelineExecution'],
      resources: [this.pipeline.pipelineArn],
    }));
  }
}
