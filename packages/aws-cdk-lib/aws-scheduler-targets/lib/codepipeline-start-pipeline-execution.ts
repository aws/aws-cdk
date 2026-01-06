import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { CfnPipeline } from '../../aws-codepipeline';
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
    super(props, CfnPipeline.arnForPipeline(pipeline));
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codepipeline:StartPipelineExecution'],
      resources: [CfnPipeline.arnForPipeline(this.pipeline)],
    }));
  }
}
