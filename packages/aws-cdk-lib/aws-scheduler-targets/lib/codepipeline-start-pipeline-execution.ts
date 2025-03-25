import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IPipeline } from '../../aws-codepipeline';
import { IRole, PolicyStatement } from '../../aws-iam';
import { IScheduleTarget } from '../../aws-scheduler';

/**
 * Use an AWS CodePipeline pipeline as a target for AWS EventBridge Scheduler.
 */
export class CodePipelineStartPipelineExecution extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly pipeline: IPipeline,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, pipeline.pipelineArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codepipeline:StartPipelineExecution'],
      resources: [this.pipeline.pipelineArn],
    }));
  }
}
