import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { Architecture } from './architecture';
import { EventInvokeConfigOptions } from './event-invoke-config';
import { IFunction, QualifiedFunctionBase } from './function-base';
import { IVersion } from './lambda-version';
import { AutoScalingOptions, IScalableFunctionAttribute } from './scalable-attribute-api';
export interface IAlias extends IFunction {
    /**
     * Name of this alias.
     *
     * @attribute
     */
    readonly aliasName: string;
    /**
     * The underlying Lambda function version.
     */
    readonly version: IVersion;
}
/**
 * Options for `lambda.Alias`.
 */
export interface AliasOptions extends EventInvokeConfigOptions {
    /**
     * Description for the alias
     *
     * @default No description
     */
    readonly description?: string;
    /**
     * Additional versions with individual weights this alias points to
     *
     * Individual additional version weights specified here should add up to
     * (less than) one. All remaining weight is routed to the default
     * version.
     *
     * For example, the config is
     *
     *    version: "1"
     *    additionalVersions: [{ version: "2", weight: 0.05 }]
     *
     * Then 5% of traffic will be routed to function version 2, while
     * the remaining 95% of traffic will be routed to function version 1.
     *
     * @default No additional versions
     */
    readonly additionalVersions?: VersionWeight[];
    /**
     * Specifies a provisioned concurrency configuration for a function's alias.
     *
     * @default No provisioned concurrency
     */
    readonly provisionedConcurrentExecutions?: number;
}
/**
 * Properties for a new Lambda alias
 */
export interface AliasProps extends AliasOptions {
    /**
     * Name of this alias
     */
    readonly aliasName: string;
    /**
     * Function version this alias refers to
     *
     * Use lambda.currentVersion to reference a version with your latest changes.
     */
    readonly version: IVersion;
}
export interface AliasAttributes {
    readonly aliasName: string;
    readonly aliasVersion: IVersion;
}
/**
 * A new alias to a particular version of a Lambda function.
 */
export declare class Alias extends QualifiedFunctionBase implements IAlias {
    static fromAliasAttributes(scope: Construct, id: string, attrs: AliasAttributes): IAlias;
    /**
     * Name of this alias.
     *
     * @attribute
     */
    readonly aliasName: string;
    /**
     * ARN of this alias
     *
     * Used to be able to use Alias in place of a regular Lambda. Lambda accepts
     * ARNs everywhere it accepts function names.
     */
    readonly functionName: string;
    readonly lambda: IFunction;
    readonly architecture: Architecture;
    readonly version: IVersion;
    /**
     * ARN of this alias
     *
     * Used to be able to use Alias in place of a regular Lambda. Lambda accepts
     * ARNs everywhere it accepts function names.
     */
    readonly functionArn: string;
    protected readonly qualifier: string;
    protected readonly canCreatePermissions: boolean;
    private scalableAlias?;
    private readonly scalingRole;
    constructor(scope: Construct, id: string, props: AliasProps);
    get grantPrincipal(): iam.IPrincipal;
    get role(): iam.IRole | undefined;
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Configure provisioned concurrency autoscaling on a function alias. Returns a scalable attribute that can call
     * `scaleOnUtilization()` and `scaleOnSchedule()`.
     *
     * @param options Autoscaling options
     */
    addAutoScaling(options: AutoScalingOptions): IScalableFunctionAttribute;
    /**
     * Calculate the routingConfig parameter from the input props
     */
    private determineRoutingConfig;
    /**
     * Validate that the additional version weights make sense
     *
     * We validate that they are positive and add up to something <= 1.
     */
    private validateAdditionalWeights;
    /**
     * Validate that the provisionedConcurrentExecutions makes sense
     *
     * Member must have value greater than or equal to 1
     */
    private determineProvisionedConcurrency;
}
/**
 * A version/weight pair for routing traffic to Lambda functions
 */
export interface VersionWeight {
    /**
     * The version to route traffic to
     */
    readonly version: IVersion;
    /**
     * How much weight to assign to this version (0..1)
     */
    readonly weight: number;
}
