import { Duration, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ILambdaDeploymentConfig } from './deployment-config';
/**
 * Lambda Deployment config type
 * @deprecated Use `LambdaDeploymentConfig`
 */
export declare enum CustomLambdaDeploymentConfigType {
    /**
     * Canary deployment type
     * @deprecated Use `LambdaDeploymentConfig`
     */
    CANARY = "Canary",
    /**
     * Linear deployment type
     * @deprecated Use `LambdaDeploymentConfig`
     */
    LINEAR = "Linear"
}
/**
 * Properties of a reference to a CodeDeploy Lambda Deployment Configuration.
 * @deprecated Use `LambdaDeploymentConfig`
 */
export interface CustomLambdaDeploymentConfigProps {
    /**
     * The type of deployment config, either CANARY or LINEAR
     * @deprecated Use `LambdaDeploymentConfig`
     */
    readonly type: CustomLambdaDeploymentConfigType;
    /**
     * The integer percentage of traffic to shift:
     * - For LINEAR, the percentage to shift every interval
     * - For CANARY, the percentage to shift until the interval passes, before the full deployment
     * @deprecated Use `LambdaDeploymentConfig`
     */
    readonly percentage: number;
    /**
     * The interval, in number of minutes:
     * - For LINEAR, how frequently additional traffic is shifted
     * - For CANARY, how long to shift traffic before the full deployment
     * @deprecated Use `LambdaDeploymentConfig`
     */
    readonly interval: Duration;
    /**
     * The verbatim name of the deployment config. Must be unique per account/region.
     * Other parameters cannot be updated if this name is provided.
     * @default - automatically generated name
     * @deprecated Use `LambdaDeploymentConfig`
     */
    readonly deploymentConfigName?: string;
}
/**
 * A custom Deployment Configuration for a Lambda Deployment Group.
 * @resource AWS::CodeDeploy::DeploymentGroup
 * @deprecated CloudFormation now supports Lambda deployment configurations without custom resources. Use `LambdaDeploymentConfig`.
 */
export declare class CustomLambdaDeploymentConfig extends Resource implements ILambdaDeploymentConfig {
    /**
     * The name of the deployment config
     * @attribute
     * @deprecated Use `LambdaDeploymentConfig`
     */
    readonly deploymentConfigName: string;
    /**
     * The arn of the deployment config
     * @attribute
     * @deprecated Use `LambdaDeploymentConfig`
     */
    readonly deploymentConfigArn: string;
    constructor(scope: Construct, id: string, props: CustomLambdaDeploymentConfigProps);
    private validateParameters;
}
