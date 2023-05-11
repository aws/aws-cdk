import { bindBaseTargetConfig, singletonEventRole, TargetBaseProps } from './util';
import * as codepipeline from '../../aws-codepipeline';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';

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
    private readonly pipeline: codepipeline.IPipeline,
    private readonly options: CodePipelineTargetOptions = {}) {
  }

  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const role = this.options.eventRole || singletonEventRole(this.pipeline);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [this.pipeline.pipelineArn],
      actions: ['codepipeline:StartPipelineExecution'],
    }));

    return {
      ...bindBaseTargetConfig(this.options),
      id: '',
      arn: this.pipeline.pipelineArn,
      role,
      targetResource: this.pipeline,
    };
  }
}
