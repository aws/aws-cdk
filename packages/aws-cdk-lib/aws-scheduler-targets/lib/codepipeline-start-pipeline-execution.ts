import type { ScheduleTargetBaseProps } from './target';
import { ScheduleTargetBase } from './target';
import type { IPipeline } from '../../aws-codepipeline';
import { CfnPipeline } from '../../aws-codepipeline';
import type { IRole } from '../../aws-iam';
import { PolicyStatement } from '../../aws-iam';
import type { IScheduleTarget } from '../../aws-scheduler';
import type { IPipelineRef } from '../../interfaces/generated/aws-codepipeline-interfaces.generated';

/**
 * Use an AWS CodePipeline pipeline as a target for AWS EventBridge Scheduler.
 */
export class CodePipelineStartPipelineExecution extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly pipeline: IPipelineRef,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, pipelineArn(pipeline));
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codepipeline:StartPipelineExecution'],
      resources: [pipelineArn(this.pipeline)],
    }));
  }
}

function pipelineArn(pipeline: IPipelineRef) : string {
  // If the pipeline happens to be an IPipeline, it might already have a literal ARN, different
  // than we one we construct from the `pipelineName` and the env.
  //
  // Because the Role logical ID is also hashed from this string, we have to keep on using
  // it in order to not cause damage to existing templates.
  return isIPipeline(pipeline) ? pipeline.pipelineArn : CfnPipeline.arnForPipeline(pipeline);
}

function isIPipeline(pipeline: IPipelineRef): pipeline is IPipeline {
  return 'pipelineArn' in pipeline;
}
