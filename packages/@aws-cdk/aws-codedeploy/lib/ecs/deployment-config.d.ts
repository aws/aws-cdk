import { Construct } from 'constructs';
import { BaseDeploymentConfig, BaseDeploymentConfigOptions, IBaseDeploymentConfig } from '../base-deployment-config';
import { TrafficRouting } from '../traffic-routing-config';
/**
 * The Deployment Configuration of an ECS Deployment Group.
 *
 * If you're managing the Deployment Configuration alongside the rest of your CDK resources,
 * use the `EcsDeploymentConfig` class.
 *
 * If you want to reference an already existing deployment configuration,
 * or one defined in a different CDK Stack,
 * use the `EcsDeploymentConfig#fromEcsDeploymentConfigName` method.
 *
 * The default, pre-defined Configurations are available as constants on the `EcsDeploymentConfig` class
 * (for example, `EcsDeploymentConfig.AllAtOnce`).
 */
export interface IEcsDeploymentConfig extends IBaseDeploymentConfig {
}
/**
 * Construction properties of `EcsDeploymentConfig`.
 */
export interface EcsDeploymentConfigProps extends BaseDeploymentConfigOptions {
    /**
     * The configuration that specifies how traffic is shifted from the 'blue'
     * target group to the 'green' target group during a deployment.
     * @default AllAtOnce
     */
    readonly trafficRouting?: TrafficRouting;
}
/**
 * A custom Deployment Configuration for an ECS Deployment Group.
 *
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export declare class EcsDeploymentConfig extends BaseDeploymentConfig implements IEcsDeploymentConfig {
    /** CodeDeploy predefined deployment configuration that shifts all traffic to the updated ECS task set at once. */
    static readonly ALL_AT_ONCE: IEcsDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every minute until all traffic is shifted. */
    static readonly LINEAR_10PERCENT_EVERY_1MINUTES: IEcsDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every three minutes until all traffic is shifted. */
    static readonly LINEAR_10PERCENT_EVERY_3MINUTES: IEcsDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed five minutes later. */
    static readonly CANARY_10PERCENT_5MINUTES: IEcsDeploymentConfig;
    /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 15 minutes later. */
    static readonly CANARY_10PERCENT_15MINUTES: IEcsDeploymentConfig;
    /**
     * Import a custom Deployment Configuration for an ECS Deployment Group defined outside the CDK.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param ecsDeploymentConfigName the name of the referenced custom Deployment Configuration
     * @returns a Construct representing a reference to an existing custom Deployment Configuration
     */
    static fromEcsDeploymentConfigName(scope: Construct, id: string, ecsDeploymentConfigName: string): IEcsDeploymentConfig;
    private static deploymentConfig;
    constructor(scope: Construct, id: string, props?: EcsDeploymentConfigProps);
}
