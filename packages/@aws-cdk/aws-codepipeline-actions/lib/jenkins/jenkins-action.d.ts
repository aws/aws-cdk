import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { IJenkinsProvider } from './jenkins-provider';
import { Action } from '../action';
/**
 * The type of the Jenkins Action that determines its CodePipeline Category -
 * Build, or Test.
 * Note that a Jenkins provider, even if it has the same name,
 * must be separately registered for each type.
 */
export declare enum JenkinsActionType {
    /**
     * The Action will have the Build Category.
     */
    BUILD = 0,
    /**
     * The Action will have the Test Category.
     */
    TEST = 1
}
/**
 * Construction properties of `JenkinsAction`.
 */
export interface JenkinsActionProps extends codepipeline.CommonActionProps {
    /**
     * The source to use as input for this build.
     */
    readonly inputs?: codepipeline.Artifact[];
    /**
     *
     */
    readonly outputs?: codepipeline.Artifact[];
    /**
     * The Jenkins Provider for this Action.
     */
    readonly jenkinsProvider: IJenkinsProvider;
    /**
     * The name of the project (sometimes also called job, or task)
     * on your Jenkins installation that will be invoked by this Action.
     *
     * @example 'MyJob'
     */
    readonly projectName: string;
    /**
     * The type of the Action - Build, or Test.
     */
    readonly type: JenkinsActionType;
}
/**
 * Jenkins build CodePipeline Action.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-four-stage-pipeline.html
 */
export declare class JenkinsAction extends Action {
    private readonly props;
    constructor(props: JenkinsActionProps);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
