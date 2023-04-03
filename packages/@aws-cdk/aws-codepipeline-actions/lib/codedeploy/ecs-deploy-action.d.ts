import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Configuration for replacing a placeholder string in the ECS task
 * definition template file with an image URI.
 */
export interface CodeDeployEcsContainerImageInput {
    /**
     * The artifact that contains an `imageDetails.json` file with the image URI.
     *
     * The artifact's `imageDetails.json` file must be a JSON file containing an
     * `ImageURI` property.  For example:
     * `{ "ImageURI": "ACCOUNTID.dkr.ecr.us-west-2.amazonaws.com/dk-image-repo@sha256:example3" }`
     */
    readonly input: codepipeline.Artifact;
    /**
     * The placeholder string in the ECS task definition template file that will
     * be replaced with the image URI.
     *
     * The placeholder string must be surrounded by angle brackets in the template file.
     * For example, if the task definition template file contains a placeholder like
     * `"image": "<PLACEHOLDER>"`, then the `taskDefinitionPlaceholder` value should
     * be `PLACEHOLDER`.
     *
     * @default IMAGE
     */
    readonly taskDefinitionPlaceholder?: string;
}
/**
 * Construction properties of the `CodeDeployEcsDeployAction CodeDeploy ECS deploy CodePipeline Action`.
 */
export interface CodeDeployEcsDeployActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * The CodeDeploy ECS Deployment Group to deploy to.
     */
    readonly deploymentGroup: codedeploy.IEcsDeploymentGroup;
    /**
     * The artifact containing the ECS task definition template file.
     * During deployment, the task definition template file contents
     * will be registered with ECS.
     *
     * If you use this property, it's assumed the file is called 'taskdef.json'.
     * If your task definition template uses a different filename, leave this property empty,
     * and use the `taskDefinitionTemplateFile` property instead.
     *
     * @default - one of this property, or `taskDefinitionTemplateFile`, is required
     */
    readonly taskDefinitionTemplateInput?: codepipeline.Artifact;
    /**
     * The name of the ECS task definition template file.
     * During deployment, the task definition template file contents
     * will be registered with ECS.
     *
     * Use this property if you want to use a different name for this file than the default 'taskdef.json'.
     * If you use this property, you don't need to specify the `taskDefinitionTemplateInput` property.
     *
     * @default - one of this property, or `taskDefinitionTemplateInput`, is required
     */
    readonly taskDefinitionTemplateFile?: codepipeline.ArtifactPath;
    /**
     * The artifact containing the CodeDeploy AppSpec file.
     * During deployment, a new task definition will be registered
     * with ECS, and the new task definition ID will be inserted into
     * the CodeDeploy AppSpec file.  The AppSpec file contents will be
     * provided to CodeDeploy for the deployment.
     *
     * If you use this property, it's assumed the file is called 'appspec.yaml'.
     * If your AppSpec file uses a different filename, leave this property empty,
     * and use the `appSpecTemplateFile` property instead.
     *
     * @default - one of this property, or `appSpecTemplateFile`, is required
     */
    readonly appSpecTemplateInput?: codepipeline.Artifact;
    /**
     * The name of the CodeDeploy AppSpec file.
     * During deployment, a new task definition will be registered
     * with ECS, and the new task definition ID will be inserted into
     * the CodeDeploy AppSpec file.  The AppSpec file contents will be
     * provided to CodeDeploy for the deployment.
     *
     * Use this property if you want to use a different name for this file than the default 'appspec.yaml'.
     * If you use this property, you don't need to specify the `appSpecTemplateInput` property.
     *
     * @default - one of this property, or `appSpecTemplateInput`, is required
     */
    readonly appSpecTemplateFile?: codepipeline.ArtifactPath;
    /**
     * Configuration for dynamically updated images in the task definition.
     *
     * Provide pairs of an image details input artifact and a placeholder string
     * that will be used to dynamically update the ECS task definition template
     * file prior to deployment. A maximum of 4 images can be given.
     */
    readonly containerImageInputs?: CodeDeployEcsContainerImageInput[];
}
export declare class CodeDeployEcsDeployAction extends Action {
    private readonly actionProps;
    constructor(props: CodeDeployEcsDeployActionProps);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
