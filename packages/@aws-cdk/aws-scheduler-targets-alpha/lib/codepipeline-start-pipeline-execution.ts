import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { IPipeline } from 'aws-cdk-lib/aws-codepipeline';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Use an AWS CodePipeline pipeline as a target for AWS EventBridge Scheduler.
 */
export class CodePipelineStartPipelineExecution extends ScheduleTargetBase implements IScheduleTarget {
  private readonly pipeline: IPipeline;

  constructor(
    pipeline: IPipeline,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, pipeline.pipelineArn);
    this.pipeline = pipeline;
  }

  protected addTargetActionToRole(_schedule: ISchedule, role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codepipeline:StartPipelineExecution'],
      resources: [this.pipeline.pipelineArn],
    }));
  }
}
