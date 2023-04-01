import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
/**
 * This example demonstrates how to create a CodePipeline that deploys an ECS Service
 * from a different source repository than the source repository of your CDK code.
 * If your application code and your CDK code are in the same repository,
 * use the CDK Pipelines module instead of this method.
 */
/**
 * These are the construction properties for `EcsAppStack`.
 * They extend the standard Stack properties,
 * but also require providing the ContainerImage that the service will use.
 * That Image will be provided from the Stack containing the CodePipeline.
 */
export interface EcsAppStackProps extends cdk.StackProps {
    readonly image: ecs.ContainerImage;
}
/**
 * This is the Stack containing a simple ECS Service that uses the provided ContainerImage.
 */
export declare class EcsAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EcsAppStackProps);
}
/**
 * This is the Stack containing the CodePipeline definition that deploys an ECS Service.
 */
export declare class PipelineStack extends cdk.Stack {
    readonly tagParameterContainerImage: ecs.TagParameterContainerImage;
    constructor(scope: Construct, id: string, props?: cdk.StackProps);
}
