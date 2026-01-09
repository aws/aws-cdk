import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { CfnPipeline, IPipeline } from '../../aws-codepipeline';
import { IRole, PolicyStatement } from '../../aws-iam';
import { IScheduleTarget } from '../../aws-scheduler';
import { IPipelineRef } from '../../interfaces/generated/aws-codepipeline-interfaces.generated';

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
  return !!(pipeline as IPipeline).pipelineArn;
}
