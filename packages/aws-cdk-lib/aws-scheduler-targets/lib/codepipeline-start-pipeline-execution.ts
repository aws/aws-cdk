import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { getPipelineArn } from '../../aws-codepipeline/lib/private/ref-utils';
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
    super(props, getPipelineArn(pipeline));
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codepipeline:StartPipelineExecution'],
      resources: [getPipelineArn(this.pipeline)],
    }));
  }
}
