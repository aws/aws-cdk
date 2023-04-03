import * as codebuild from '@aws-cdk/aws-codebuild';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { TargetBaseProps } from './util';
/**
 * Customize the CodeBuild Event Target
 */
export interface CodeBuildProjectProps extends TargetBaseProps {
    /**
     * The role to assume before invoking the target
     * (i.e., the codebuild) when the given rule is triggered.
     *
     * @default - a new role will be created
     */
    readonly eventRole?: iam.IRole;
    /**
     * The event to send to CodeBuild
     *
     * This will be the payload for the StartBuild API.
     *
     * @default - the entire EventBridge event
     */
    readonly event?: events.RuleTargetInput;
}
/**
 * Start a CodeBuild build when an Amazon EventBridge rule is triggered.
 */
export declare class CodeBuildProject implements events.IRuleTarget {
    private readonly project;
    private readonly props;
    constructor(project: codebuild.IProject, props?: CodeBuildProjectProps);
    /**
     * Allows using build projects as event rule targets.
     */
    bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
