import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as events from '@aws-cdk/aws-events';
import { Construct } from 'constructs';
import { CodeStarConnectionsSourceAction, CodeStarConnectionsSourceActionProps } from '../codestar-connections/source-action';

/**
 * Construction properties for `BitBucketSourceAction`.
 *
 * @deprecated use CodeStarConnectionsSourceActionProps instead
 */
export interface BitBucketSourceActionProps extends CodeStarConnectionsSourceActionProps {
}

/**
 * A CodePipeline source action for BitBucket.
 *
 * @deprecated use CodeStarConnectionsSourceAction instead
 */
export class BitBucketSourceAction implements codepipeline.IAction {
  private readonly codeStarConnectionsSourceAction: CodeStarConnectionsSourceAction;

  constructor(props: BitBucketSourceActionProps) {
    this.codeStarConnectionsSourceAction = new CodeStarConnectionsSourceAction(props);
  }

  public get actionProperties(): codepipeline.ActionProperties {
    return this.codeStarConnectionsSourceAction.actionProperties;
  }

  public bind(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    return this.codeStarConnectionsSourceAction.bind(scope, stage, options);
  }

  public onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule {
    return this.codeStarConnectionsSourceAction.onStateChange(name, target, options);
  }
}
