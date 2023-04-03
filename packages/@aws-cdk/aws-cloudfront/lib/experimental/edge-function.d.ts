import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Resource } from '@aws-cdk/core';
import { Construct, Node } from 'constructs';
/**
 * Properties for creating a Lambda@Edge function
 */
export interface EdgeFunctionProps extends lambda.FunctionProps {
    /**
     * The stack ID of Lambda@Edge function.
     *
     * @default - `edge-lambda-stack-${region}`
     */
    readonly stackId?: string;
}
/**
 * A Lambda@Edge function.
 *
 * Convenience resource for requesting a Lambda function in the 'us-east-1' region for use with Lambda@Edge.
 * Implements several restrictions enforced by Lambda@Edge.
 *
 * Note that this construct requires that the 'us-east-1' region has been bootstrapped.
 * See https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html or 'cdk bootstrap --help' for options.
 *
 * @resource AWS::Lambda::Function
 */
export declare class EdgeFunction extends Resource implements lambda.IVersion {
    private static readonly EDGE_REGION;
    readonly edgeArn: string;
    readonly functionName: string;
    readonly functionArn: string;
    readonly grantPrincipal: iam.IPrincipal;
    readonly isBoundToVpc = false;
    readonly permissionsNode: Node;
    readonly role?: iam.IRole;
    readonly version: string;
    readonly architecture: lambda.Architecture;
    readonly resourceArnsForGrantInvoke: string[];
    private readonly _edgeFunction;
    constructor(scope: Construct, id: string, props: EdgeFunctionProps);
    get lambda(): lambda.IFunction;
    /**
     * Convenience method to make `EdgeFunction` conform to the same interface as `Function`.
     */
    get currentVersion(): lambda.IVersion;
    addAlias(aliasName: string, options?: lambda.AliasOptions): lambda.Alias;
    /**
     * Not supported. Connections are only applicable to VPC-enabled functions.
     */
    get connections(): ec2.Connections;
    get latestVersion(): lambda.IVersion;
    addEventSourceMapping(id: string, options: lambda.EventSourceMappingOptions): lambda.EventSourceMapping;
    addPermission(id: string, permission: lambda.Permission): void;
    addToRolePolicy(statement: iam.PolicyStatement): void;
    grantInvoke(identity: iam.IGrantable): iam.Grant;
    grantInvokeUrl(identity: iam.IGrantable): iam.Grant;
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    metricDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    metricErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    metricInvocations(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    metricThrottles(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /** Adds an event source to this function. */
    addEventSource(source: lambda.IEventSource): void;
    configureAsyncInvoke(options: lambda.EventInvokeConfigOptions): void;
    addFunctionUrl(options?: lambda.FunctionUrlOptions): lambda.FunctionUrl;
    /** Create a function in-region */
    private createInRegionFunction;
    /** Create a support stack and function in us-east-1, and a SSM reader in-region */
    private createCrossRegionFunction;
    private createCrossRegionArnReader;
    private edgeStack;
}
