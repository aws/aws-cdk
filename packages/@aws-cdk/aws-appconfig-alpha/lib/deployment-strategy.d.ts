import { Resource, IResource, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
/**
 * Properties for DeploymentStrategy.
 */
export interface DeploymentStrategyProps {
    /**
     * The rollout strategy for the deployment strategy. You can use predefined deployment
     * strategies, such as RolloutStrategy.ALL_AT_ONCE, RolloutStrategy.LINEAR_50_PERCENT_EVERY_30_SECONDS,
     * or RolloutStrategy.CANARY_10_PERCENT_20_MINUTES.
     */
    readonly rolloutStrategy: RolloutStrategy;
    /**
     * A name for the deployment strategy.
     *
     * @default - A name is generated.
     */
    readonly deploymentStrategyName?: string;
    /**
     * A description of the deployment strategy.
     *
     * @default - No description.
     */
    readonly description?: string;
}
/**
 * An AWS AppConfig deployment strategy.
 *
 * @resource AWS::AppConfig::DeploymentStrategy
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html
 */
export declare class DeploymentStrategy extends Resource implements IDeploymentStrategy {
    /**
     * Imports a deployment strategy into the CDK using its Amazon Resource Name (ARN).
     *
     * @param scope The parent construct
     * @param id The name of the deployment strategy construct
     * @param deploymentStrategyArn The Amazon Resource Name (ARN) of the deployment strategy
     */
    static fromDeploymentStrategyArn(scope: Construct, id: string, deploymentStrategyArn: string): IDeploymentStrategy;
    /**
     * Imports a deployment strategy into the CDK using its ID.
     *
     * @param scope The parent construct
     * @param id The name of the deployment strategy construct
     * @param deploymentStrategyId The ID of the deployment strategy
     */
    static fromDeploymentStrategyId(scope: Construct, id: string, deploymentStrategyId: DeploymentStrategyId): IDeploymentStrategy;
    /**
     * The name of the deployment strategy.
     */
    readonly name?: string;
    /**
     * The deployment duration in minutes of the deployment strategy.
     */
    readonly deploymentDurationInMinutes?: number;
    /**
     * The growth factor of the deployment strategy.
     */
    readonly growthFactor?: number;
    /**
     * The description of the deployment strategy.
     */
    readonly description?: string;
    /**
     * The final bake time in minutes of the deployment strategy.
     */
    readonly finalBakeTimeInMinutes?: number;
    /**
     * The growth type of the deployment strategy.
     */
    readonly growthType?: GrowthType;
    /**
     * The ID of the deployment strategy.
     */
    readonly deploymentStrategyId: string;
    /**
     * The Amazon Resource Name (ARN) of the deployment strategy.
     *
     * @attribute
     */
    readonly deploymentStrategyArn: string;
    private readonly _cfnDeploymentStrategy;
    constructor(scope: Construct, id: string, props: DeploymentStrategyProps);
}
/**
 * Defines the growth type of the deployment strategy.
 */
export declare enum GrowthType {
    /**
     * AWS AppConfig will process the deployment by increments of the growth factor
     * evenly distributed over the deployment.
     */
    LINEAR = "LINEAR",
    /**
     * AWS AppConfig will process the deployment exponentially using the following formula:
     * `G*(2^N)`. In this formula, `G` is the step percentage specified by the user and `N`
     * is the number of steps until the configuration is deployed to all targets.
     */
    EXPONENTIAL = "EXPONENTIAL"
}
/**
 * Defines the deployment strategy ID's of AWS AppConfig deployment strategies.
 *
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html
 */
export declare abstract class DeploymentStrategyId {
    /**
     * **AWS Recommended**. This strategy processes the deployment exponentially using a 10% growth factor over 20 minutes.
     * AWS AppConfig recommends using this strategy for production deployments because it aligns with AWS best practices
     * for configuration deployments.
     */
    static readonly CANARY_10_PERCENT_20_MINUTES: DeploymentStrategyId;
    /**
     * **Testing/Demonstration**. This strategy deploys the configuration to half of all targets every 30 seconds for a
     * one-minute deployment. AWS AppConfig recommends using this strategy only for testing or demonstration purposes because
     * it has a short duration and bake time.
     */
    static readonly LINEAR_50_PERCENT_EVERY_30_SECONDS: DeploymentStrategyId;
    /**
     * **AWS Recommended**. This strategy deploys the configuration to 20% of all targets every six minutes for a 30 minute deployment.
     * AWS AppConfig recommends using this strategy for production deployments because it aligns with AWS best practices
     * for configuration deployments.
     */
    static readonly LINEAR_20_PERCENT_EVERY_6_MINUTES: DeploymentStrategyId;
    /**
     * **Quick**. This strategy deploys the configuration to all targets immediately.
     */
    static readonly ALL_AT_ONCE: DeploymentStrategyId;
    /**
     * Builds a deployment strategy ID from a string.
     *
     * @param deploymentStrategyId The deployment strategy ID.
     */
    static fromString(deploymentStrategyId: string): DeploymentStrategyId;
    /**
     * The deployment strategy ID.
     */
    abstract readonly id: string;
}
/**
 * Properties for the Rollout Strategy.
 */
export interface RolloutStrategyProps {
    /**
     * The growth factor of the deployment strategy. This defines
     * the percentage of targets to receive a deployed configuration
     * during each interval.
     */
    readonly growthFactor: number;
    /**
     * The deployment duration of the deployment strategy. This defines
     * the total amount of time for a deployment to last.
     */
    readonly deploymentDuration: Duration;
    /**
     * The final bake time of the deployment strategy.
     *
     * This setting specifies the amount of time AWS AppConfig monitors for Amazon
     * CloudWatch alarms after the configuration has been deployed to
     * 100% of its targets, before considering the deployment to be complete.
     * If an alarm is triggered during this time, AWS AppConfig rolls back
     * the deployment.
     *
     * @default Duration.minutes(0)
     */
    readonly finalBakeTime?: Duration;
}
/**
 * Defines the rollout strategy for a deployment strategy and includes the growth factor,
 * deployment duration, growth type, and optionally final bake time.
 *
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html
 */
export declare abstract class RolloutStrategy {
    /**
     * **AWS Recommended**. This strategy processes the deployment exponentially using a 10% growth factor over 20 minutes.
     * AWS AppConfig recommends using this strategy for production deployments because it aligns with AWS best practices
     * for configuration deployments.
     */
    static readonly CANARY_10_PERCENT_20_MINUTES: RolloutStrategy;
    /**
     * **Testing/Demonstration**. This strategy deploys the configuration to half of all targets every 30 seconds for a
     * one-minute deployment. AWS AppConfig recommends using this strategy only for testing or demonstration purposes because
     * it has a short duration and bake time.
     */
    static readonly LINEAR_50_PERCENT_EVERY_30_SECONDS: RolloutStrategy;
    /**
     * **AWS Recommended**. This strategy deploys the configuration to 20% of all targets every six minutes for a 30 minute deployment.
     * AWS AppConfig recommends using this strategy for production deployments because it aligns with AWS best practices
     * for configuration deployments.
     */
    static readonly LINEAR_20_PERCENT_EVERY_6_MINUTES: RolloutStrategy;
    /**
     * **Quick**. This strategy deploys the configuration to all targets immediately.
     */
    static readonly ALL_AT_ONCE: RolloutStrategy;
    /**
     * Build your own linear rollout strategy.
     */
    static linear(props: RolloutStrategyProps): RolloutStrategy;
    /**
     * Build your own exponential rollout strategy.
     */
    static exponential(props: RolloutStrategyProps): RolloutStrategy;
    /**
     * The growth factor of the rollout strategy.
     */
    abstract readonly growthFactor: number;
    /**
     * The deployment duration of the rollout strategy.
     */
    abstract readonly deploymentDuration: Duration;
    /**
     * The growth type of the rollout strategy.
     */
    abstract readonly growthType?: GrowthType;
    /**
     * The final bake time of the deployment strategy.
     */
    abstract readonly finalBakeTime?: Duration;
}
export interface IDeploymentStrategy extends IResource {
    /**
     * The name of the deployment strategy.
     */
    readonly name?: string;
    /**
     * The deployment duration in minutes.
     */
    readonly deploymentDurationInMinutes?: number;
    /**
     * The growth factor of the deployment strategy.
     */
    readonly growthFactor?: number;
    /**
     * The description of the deployment strategy.
     */
    readonly description?: string;
    /**
     * The final bake time in minutes.
     */
    readonly finalBakeTimeInMinutes?: number;
    /**
     * The growth type of the deployment strategy.
     */
    readonly growthType?: GrowthType;
    /**
     * The ID of the deployment strategy.
     * @attribute
     */
    readonly deploymentStrategyId: string;
    /**
     * The Amazon Resource Name (ARN) of the deployment strategy.
     * @attribute
     */
    readonly deploymentStrategyArn: string;
}
