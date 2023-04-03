import { Construct } from 'constructs';
import { BaseDeploymentConfig, BaseDeploymentConfigOptions, IBaseDeploymentConfig } from '../base-deployment-config';
import { TrafficRouting } from '../traffic-routing-config';
/**
 * The Deployment Configuration of a Lambda Deployment Group.
 *
 * If you're managing the Deployment Configuration alongside the rest of your CDK resources,
 * use the `LambdaDeploymentConfig` class.
 *
 * If you want to reference an already existing deployment configuration,
 * or one defined in a different CDK Stack,
 * use the `LambdaDeploymentConfig#fromLambdaDeploymentConfigName` method.
 *
 * The default, pre-defined Configurations are available as constants on the `LambdaDeploymentConfig` class
 * (`LambdaDeploymentConfig.AllAtOnce`, `LambdaDeploymentConfig.Canary10Percent30Minutes`, etc.).
 */
export interface ILambdaDeploymentConfig extends IBaseDeploymentConfig {
}
/**
 * Properties of a reference to a CodeDeploy Lambda Deployment Configuration.
 *
 * @see LambdaDeploymentConfig#import
 */
export interface LambdaDeploymentConfigImportProps {
    /**
     * The physical, human-readable name of the custom CodeDeploy Lambda Deployment Configuration
     * that we are referencing.
     */
    readonly deploymentConfigName: string;
}
/**
 * Construction properties of `LambdaDeploymentConfig`.
 */
export interface LambdaDeploymentConfigProps extends BaseDeploymentConfigOptions {
    /**
     * The configuration that specifies how traffic is shifted from the 'blue'
     * target group to the 'green' target group during a deployment.
     * @default AllAtOnce
     */
    readonly trafficRouting?: TrafficRouting;
}
/**
 * A custom Deployment Configuration for a Lambda Deployment Group.
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export declare class LambdaDeploymentConfig extends BaseDeploymentConfig implements ILambdaDeploymentConfig {
    /** CodeDeploy predefined deployment configuration that shifts all traffic to the updated Lambda function at once. */
    static readonly ALL_AT_ONCE: ILambdaDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 30 minutes later. */
    static readonly CANARY_10PERCENT_30MINUTES: ILambdaDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed five minutes later. */
    static readonly CANARY_10PERCENT_5MINUTES: ILambdaDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 10 minutes later. */
    static readonly CANARY_10PERCENT_10MINUTES: ILambdaDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 15 minutes later. */
    static readonly CANARY_10PERCENT_15MINUTES: ILambdaDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every 10 minutes until all traffic is shifted. */
    static readonly LINEAR_10PERCENT_EVERY_10MINUTES: ILambdaDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every minute until all traffic is shifted. */
    static readonly LINEAR_10PERCENT_EVERY_1MINUTE: ILambdaDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every two minutes until all traffic is shifted. */
    static readonly LINEAR_10PERCENT_EVERY_2MINUTES: ILambdaDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every three minutes until all traffic is shifted. */
    static readonly LINEAR_10PERCENT_EVERY_3MINUTES: ILambdaDeploymentConfig;
    /**
     * Import a Deployment Configuration for a Lambda Deployment Group defined outside the CDK.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param lambdaDeploymentConfigName the name of the Lambda Deployment Configuration to import
     * @returns a Construct representing a reference to an existing Lambda Deployment Configuration
     */
    static fromLambdaDeploymentConfigName(scope: Construct, id: string, lambdaDeploymentConfigName: string): ILambdaDeploymentConfig;
    /**
     * Import a Deployment Configuration for a Lambda Deployment Group defined outside the CDK.
     *
     * @param _scope the parent Construct for this new Construct
     * @param _id the logical ID of this new Construct
     * @param props the properties of the referenced custom Deployment Configuration
     * @returns a Construct representing a reference to an existing custom Deployment Configuration
     * @deprecated use `fromLambdaDeploymentConfigName`
     */
    static import(_scope: Construct, _id: string, props: LambdaDeploymentConfigImportProps): ILambdaDeploymentConfig;
    private static deploymentConfig;
    constructor(scope: Construct, id: string, props?: LambdaDeploymentConfigProps);
}
