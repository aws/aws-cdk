import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecs from '@aws-cdk/aws-ecs';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Construction properties of `EcsDeployAction`.
 */
export interface EcsDeployActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * The input artifact that contains the JSON image definitions file to use for deployments.
     * The JSON file is a list of objects,
     * each with 2 keys: `name` is the name of the container in the Task Definition,
     * and `imageUri` is the Docker image URI you want to update your service with.
     * If you use this property, it's assumed the file is called 'imagedefinitions.json'.
     * If your build uses a different file, leave this property empty,
     * and use the `imageFile` property instead.
     *
     * @default - one of this property, or `imageFile`, is required
     * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-create.html#pipelines-create-image-definitions
     */
    readonly input?: codepipeline.Artifact;
    /**
     * The name of the JSON image definitions file to use for deployments.
     * The JSON file is a list of objects,
     * each with 2 keys: `name` is the name of the container in the Task Definition,
     * and `imageUri` is the Docker image URI you want to update your service with.
     * Use this property if you want to use a different name for this file than the default 'imagedefinitions.json'.
     * If you use this property, you don't need to specify the `input` property.
     *
     * @default - one of this property, or `input`, is required
     * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-create.html#pipelines-create-image-definitions
     */
    readonly imageFile?: codepipeline.ArtifactPath;
    /**
     * The ECS Service to deploy.
     */
    readonly service: ecs.IBaseService;
    /**
     * Timeout for the ECS deployment in minutes. Value must be between 1-60.
     *
     * @default - 60 minutes
     * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-ECS.html
     */
    readonly deploymentTimeout?: Duration;
}
/**
 * CodePipeline Action to deploy an ECS Service.
 */
export declare class EcsDeployAction extends Action {
    private readonly props;
    private readonly deploymentTimeout?;
    constructor(props: EcsDeployActionProps);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
