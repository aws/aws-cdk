import codepipeline = require('@aws-cdk/aws-codepipeline');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import { singletonEventRole } from './util';

  /**
   * Allows the pipeline to be used as a CloudWatch event rule target.
   */
export class CodePipeline implements events.IRuleTarget {
  constructor(private readonly pipeline: codepipeline.IPipeline) {
  }

  public bind(_rule: events.IRule): events.RuleTargetConfig {
    return {
      id: this.pipeline.node.uniqueId,
      arn: this.pipeline.pipelineArn,
      role: singletonEventRole(this.pipeline, [new iam.PolicyStatement({
        resources: [this.pipeline.pipelineArn],
        actions: ['codepipeline:StartPipelineExecution'],
      })])
    };
  }
}
