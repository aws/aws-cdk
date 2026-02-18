import type { TargetBaseProps } from './util';
import { bindBaseTargetConfig, singletonEventRole } from './util';
import { CfnPipeline } from '../../aws-codepipeline/lib/codepipeline.generated';
import type * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import type { IPipelineRef } from '../../interfaces/generated/aws-codepipeline-interfaces.generated';

/**
 * Customization options when creating a `CodePipeline` event target.
 */
export interface CodePipelineTargetOptions extends TargetBaseProps {
  /**
   * The role to assume before invoking the target
   * (i.e., the pipeline) when the given rule is triggered.
   *
   * @default - a new role will be created
   */
  readonly eventRole?: iam.IRole;
}

/**
 * Allows the pipeline to be used as an EventBridge rule target.
 */
export class CodePipeline implements events.IRuleTarget {
  constructor(
    private readonly pipeline: IPipelineRef,
    private readonly options: CodePipelineTargetOptions = {}) {
  }

  public bind(_rule: events.IRuleRef, _id?: string): events.RuleTargetConfig {
    const role = this.options.eventRole || singletonEventRole(this.pipeline);
    const pipelineArn = CfnPipeline.arnForPipeline(this.pipeline);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [pipelineArn],
      actions: ['codepipeline:StartPipelineExecution'],
    }));

    return {
      ...bindBaseTargetConfig(this.options),
      id: '',
      arn: pipelineArn,
      role,
      targetResource: this.pipeline,
    };
  }
}
