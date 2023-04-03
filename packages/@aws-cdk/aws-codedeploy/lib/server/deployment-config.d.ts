import { Construct } from 'constructs';
import { BaseDeploymentConfig, BaseDeploymentConfigOptions, IBaseDeploymentConfig } from '../base-deployment-config';
import { MinimumHealthyHosts } from '../host-health-config';
/**
 * The Deployment Configuration of an EC2/on-premise Deployment Group.
 * The default, pre-defined Configurations are available as constants on the `ServerDeploymentConfig` class
 * (`ServerDeploymentConfig.HALF_AT_A_TIME`, `ServerDeploymentConfig.ALL_AT_ONCE`, etc.).
 * To create a custom Deployment Configuration,
 * instantiate the `ServerDeploymentConfig` Construct.
 */
export interface IServerDeploymentConfig extends IBaseDeploymentConfig {
}
/**
 * Construction properties of `ServerDeploymentConfig`.
 */
export interface ServerDeploymentConfigProps extends BaseDeploymentConfigOptions {
    /**
     * Minimum number of healthy hosts.
     */
    readonly minimumHealthyHosts: MinimumHealthyHosts;
}
/**
 * A custom Deployment Configuration for an EC2/on-premise Deployment Group.
 *
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export declare class ServerDeploymentConfig extends BaseDeploymentConfig implements IServerDeploymentConfig {
    /**
     * The CodeDeployDefault.OneAtATime predefined deployment configuration for EC2/on-premises compute platform
     *
     * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html#deployment-configuration-server
     */
    static readonly ONE_AT_A_TIME: IServerDeploymentConfig;
    /**
     * The CodeDeployDefault.HalfAtATime predefined deployment configuration for EC2/on-premises compute platform
     *
     * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html#deployment-configuration-server
     */
    static readonly HALF_AT_A_TIME: IServerDeploymentConfig;
    /**
     * The CodeDeployDefault.AllAtOnce predefined deployment configuration for EC2/on-premises compute platform
     *
     * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html#deployment-configuration-server
     */
    static readonly ALL_AT_ONCE: IServerDeploymentConfig;
    /**
     * Import a custom Deployment Configuration for an EC2/on-premise Deployment Group defined either outside the CDK app,
     * or in a different region.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param serverDeploymentConfigName the properties of the referenced custom Deployment Configuration
     * @returns a Construct representing a reference to an existing custom Deployment Configuration
     */
    static fromServerDeploymentConfigName(scope: Construct, id: string, serverDeploymentConfigName: string): IServerDeploymentConfig;
    private static deploymentConfig;
    constructor(scope: Construct, id: string, props: ServerDeploymentConfigProps);
}
