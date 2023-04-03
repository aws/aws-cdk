import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { TargetBaseProps } from './util';
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
export declare class CodePipeline implements events.IRuleTarget {
    private readonly pipeline;
    private readonly options;
    constructor(pipeline: codepipeline.IPipeline, options?: CodePipelineTargetOptions);
    bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
