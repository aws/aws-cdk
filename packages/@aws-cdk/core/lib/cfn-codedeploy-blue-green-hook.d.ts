import { Construct } from 'constructs';
import { CfnHook } from './cfn-hook';
import { FromCloudFormationOptions } from './helpers-internal';
/**
 * The possible types of traffic shifting for the blue-green deployment configuration.
 * The type of the `CfnTrafficRoutingConfig.type` property.
 */
export declare enum CfnTrafficRoutingType {
    /**
     * Switch from blue to green at once.
     */
    ALL_AT_ONCE = "AllAtOnce",
    /**
     * Specifies a configuration that shifts traffic from blue to green in two increments.
     */
    TIME_BASED_CANARY = "TimeBasedCanary",
    /**
     * Specifies a configuration that shifts traffic from blue to green in equal increments,
     * with an equal number of minutes between each increment.
     */
    TIME_BASED_LINEAR = "TimeBasedLinear"
}
/**
 * The traffic routing configuration if `CfnTrafficRoutingConfig.type`
 * is `CfnTrafficRoutingType.TIME_BASED_CANARY`.
 */
export interface CfnTrafficRoutingTimeBasedCanary {
    /**
     * The percentage of traffic to shift in the first increment of a time-based canary deployment.
     * The step percentage must be 14% or greater.
     *
     * @default 15
     */
    readonly stepPercentage?: number;
    /**
     * The number of minutes between the first and second traffic shifts of a time-based canary deployment.
     *
     * @default 5
     */
    readonly bakeTimeMins?: number;
}
/**
 * The traffic routing configuration if `CfnTrafficRoutingConfig.type`
 * is `CfnTrafficRoutingType.TIME_BASED_LINEAR`.
 */
export interface CfnTrafficRoutingTimeBasedLinear {
    /**
     * The percentage of traffic that is shifted at the start of each increment of a time-based linear deployment.
     * The step percentage must be 14% or greater.
     *
     * @default 15
     */
    readonly stepPercentage?: number;
    /**
     * The number of minutes between the first and second traffic shifts of a time-based linear deployment.
     *
     * @default 5
     */
    readonly bakeTimeMins?: number;
}
/**
 * Traffic routing configuration settings.
 * The type of the `CfnCodeDeployBlueGreenHookProps.trafficRoutingConfig` property.
 */
export interface CfnTrafficRoutingConfig {
    /**
     * The type of traffic shifting used by the blue-green deployment configuration.
     */
    readonly type: CfnTrafficRoutingType;
    /**
     * The configuration for traffic routing when `type` is
     * `CfnTrafficRoutingType.TIME_BASED_CANARY`.
     *
     * @default - none
     */
    readonly timeBasedCanary?: CfnTrafficRoutingTimeBasedCanary;
    /**
     * The configuration for traffic routing when `type` is
     * `CfnTrafficRoutingType.TIME_BASED_LINEAR`.
     *
     * @default - none
     */
    readonly timeBasedLinear?: CfnTrafficRoutingTimeBasedLinear;
}
/**
 * Additional options for the blue/green deployment.
 * The type of the `CfnCodeDeployBlueGreenHookProps.additionalOptions` property.
 */
export interface CfnCodeDeployBlueGreenAdditionalOptions {
    /**
     * Specifies time to wait, in minutes, before terminating the blue resources.
     *
     * @default - 5 minutes
     */
    readonly terminationWaitTimeInMinutes?: number;
}
/**
 * Lifecycle events for blue-green deployments.
 * The type of the `CfnCodeDeployBlueGreenHookProps.lifecycleEventHooks` property.
 */
export interface CfnCodeDeployBlueGreenLifecycleEventHooks {
    /**
     * Function to use to run tasks before the replacement task set is created.
     *
     * @default - none
     */
    readonly beforeInstall?: string;
    /**
     * Function to use to run tasks after the replacement task set is created and one of the target groups is associated with it.
     *
     * @default - none
     */
    readonly afterInstall?: string;
    /**
     * Function to use to run tasks after the test listener serves traffic to the replacement task set.
     *
     * @default - none
     */
    readonly afterAllowTestTraffic?: string;
    /**
     * Function to use to run tasks after the second target group is associated with the replacement task set,
     * but before traffic is shifted to the replacement task set.
     *
     * @default - none
     */
    readonly beforeAllowTraffic?: string;
    /**
     * Function to use to run tasks after the second target group serves traffic to the replacement task set.
     *
     * @default - none
     */
    readonly afterAllowTraffic?: string;
}
/**
 * Type of the `CfnCodeDeployBlueGreenApplication.target` property.
 */
export interface CfnCodeDeployBlueGreenApplicationTarget {
    /**
     * The resource type of the target being deployed.
     * Right now, the only allowed value is 'AWS::ECS::Service'.
     */
    readonly type: string;
    /**
     * The logical id of the target resource.
     */
    readonly logicalId: string;
}
/**
 * A traffic route,
 * representing where the traffic is being directed to.
 */
export interface CfnTrafficRoute {
    /**
     * The resource type of the route.
     * Today, the only allowed value is 'AWS::ElasticLoadBalancingV2::Listener'.
     */
    readonly type: string;
    /**
     * The logical id of the target resource.
     */
    readonly logicalId: string;
}
/**
 * Type of the `CfnCodeDeployBlueGreenEcsAttributes.trafficRouting` property.
 */
export interface CfnTrafficRouting {
    /**
     * The listener to be used by your load balancer to direct traffic to your target groups.
     */
    readonly prodTrafficRoute: CfnTrafficRoute;
    /**
     * The listener to be used by your load balancer to direct traffic to your target groups.
     */
    readonly testTrafficRoute: CfnTrafficRoute;
    /**
     * The logical IDs of the blue and green, respectively,
     * AWS::ElasticLoadBalancingV2::TargetGroup target groups.
     */
    readonly targetGroups: string[];
}
/**
 * The attributes of the ECS Service being deployed.
 * Type of the `CfnCodeDeployBlueGreenApplication.ecsAttributes` property.
 */
export interface CfnCodeDeployBlueGreenEcsAttributes {
    /**
     * The logical IDs of the blue and green, respectively,
     * AWS::ECS::TaskDefinition task definitions.
     */
    readonly taskDefinitions: string[];
    /**
     * The logical IDs of the blue and green, respectively,
     * AWS::ECS::TaskSet task sets.
     */
    readonly taskSets: string[];
    /**
     * The traffic routing configuration.
     */
    readonly trafficRouting: CfnTrafficRouting;
}
/**
 * The application actually being deployed.
 * Type of the `CfnCodeDeployBlueGreenHookProps.applications` property.
 */
export interface CfnCodeDeployBlueGreenApplication {
    /**
     * The target that is being deployed.
     */
    readonly target: CfnCodeDeployBlueGreenApplicationTarget;
    /**
     * The detailed attributes of the deployed target.
     */
    readonly ecsAttributes: CfnCodeDeployBlueGreenEcsAttributes;
}
/**
 * Construction properties of `CfnCodeDeployBlueGreenHook`.
 */
export interface CfnCodeDeployBlueGreenHookProps {
    /**
     * The IAM Role for CloudFormation to use to perform blue-green deployments.
     */
    readonly serviceRole: string;
    /**
     * Properties of the Amazon ECS applications being deployed.
     */
    readonly applications: CfnCodeDeployBlueGreenApplication[];
    /**
     * Traffic routing configuration settings.
     *
     * @default - time-based canary traffic shifting, with a 15% step percentage and a five minute bake time
     */
    readonly trafficRoutingConfig?: CfnTrafficRoutingConfig;
    /**
     * Additional options for the blue/green deployment.
     *
     * @default - no additional options
     */
    readonly additionalOptions?: CfnCodeDeployBlueGreenAdditionalOptions;
    /**
     * Use lifecycle event hooks to specify a Lambda function that CodeDeploy can call to validate a deployment.
     * You can use the same function or a different one for deployment lifecycle events.
     * Following completion of the validation tests,
     * the Lambda `CfnCodeDeployBlueGreenLifecycleEventHooks.afterAllowTraffic`
     * function calls back CodeDeploy and delivers a result of 'Succeeded' or 'Failed'.
     *
     * @default - no lifecycle event hooks
     */
    readonly lifecycleEventHooks?: CfnCodeDeployBlueGreenLifecycleEventHooks;
}
/**
 * A CloudFormation Hook for CodeDeploy blue-green ECS deployments.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/blue-green.html#blue-green-template-reference
 */
export declare class CfnCodeDeployBlueGreenHook extends CfnHook {
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: Construct, id: string, hookAttributes: any, options: FromCloudFormationOptions): CfnCodeDeployBlueGreenHook;
    private _serviceRole;
    private _applications;
    private _trafficRoutingConfig?;
    private _additionalOptions?;
    private _lifecycleEventHooks?;
    /**
     * Creates a new CodeDeploy blue-green ECS Hook.
     *
     * @param scope the scope to create the hook in (usually the containing Stack object)
     * @param id the identifier of the construct - will be used to generate the logical ID of the Hook
     * @param props the properties of the Hook
     */
    constructor(scope: Construct, id: string, props: CfnCodeDeployBlueGreenHookProps);
    /**
     * The IAM Role for CloudFormation to use to perform blue-green deployments.
     */
    get serviceRole(): string;
    set serviceRole(serviceRole: string);
    /**
     * Properties of the Amazon ECS applications being deployed.
     */
    get applications(): CfnCodeDeployBlueGreenApplication[];
    set applications(value: CfnCodeDeployBlueGreenApplication[]);
    /**
     * Traffic routing configuration settings.
     *
     * @default - time-based canary traffic shifting, with a 15% step percentage and a five minute bake time
     */
    get trafficRoutingConfig(): CfnTrafficRoutingConfig | undefined;
    set trafficRoutingConfig(value: CfnTrafficRoutingConfig | undefined);
    /**
     * Additional options for the blue/green deployment.
     *
     * @default - no additional options
     */
    get additionalOptions(): CfnCodeDeployBlueGreenAdditionalOptions | undefined;
    set additionalOptions(value: CfnCodeDeployBlueGreenAdditionalOptions | undefined);
    /**
     * Use lifecycle event hooks to specify a Lambda function that CodeDeploy can call to validate a deployment.
     * You can use the same function or a different one for deployment lifecycle events.
     * Following completion of the validation tests,
     * the Lambda `CfnCodeDeployBlueGreenLifecycleEventHooks.afterAllowTraffic`
     * function calls back CodeDeploy and delivers a result of 'Succeeded' or 'Failed'.
     *
     * @default - no lifecycle event hooks
     */
    get lifecycleEventHooks(): CfnCodeDeployBlueGreenLifecycleEventHooks | undefined;
    set lifecycleEventHooks(value: CfnCodeDeployBlueGreenLifecycleEventHooks | undefined);
    protected renderProperties(_props?: {
        [p: string]: any;
    }): {
        [p: string]: any;
    } | undefined;
}
