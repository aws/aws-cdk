import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as events from '@aws-cdk/aws-events';
import { Construct } from 'constructs';
import { CodeStarConnectionsSourceActionProps } from '../codestar-connections/source-action';
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
export declare class BitBucketSourceAction implements codepipeline.IAction {
    private readonly codeStarConnectionsSourceAction;
    constructor(props: BitBucketSourceActionProps);
    get actionProperties(): codepipeline.ActionProperties;
    bind(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
    onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;
}
