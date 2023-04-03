import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Construction properties of the `CodeDeployServerDeployAction CodeDeploy server deploy CodePipeline Action`.
 */
export interface CodeDeployServerDeployActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * The source to use as input for deployment.
     */
    readonly input: codepipeline.Artifact;
    /**
     * The CodeDeploy server Deployment Group to deploy to.
     */
    readonly deploymentGroup: codedeploy.IServerDeploymentGroup;
}
export declare class CodeDeployServerDeployAction extends Action {
    private readonly deploymentGroup;
    constructor(props: CodeDeployServerDeployActionProps);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
