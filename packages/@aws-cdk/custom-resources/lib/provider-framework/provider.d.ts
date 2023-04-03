import { CustomResourceProviderConfig, ICustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Initialization properties for the `Provider` construct.
 */
export interface ProviderProps {
    /**
     * The AWS Lambda function to invoke for all resource lifecycle operations
     * (CREATE/UPDATE/DELETE).
     *
     * This function is responsible to begin the requested resource operation
     * (CREATE/UPDATE/DELETE) and return any additional properties to add to the
     * event, which will later be passed to `isComplete`. The `PhysicalResourceId`
     * property must be included in the response.
     */
    readonly onEventHandler: lambda.IFunction;
    /**
     * The AWS Lambda function to invoke in order to determine if the operation is
     * complete.
     *
     * This function will be called immediately after `onEvent` and then
     * periodically based on the configured query interval as long as it returns
     * `false`. If the function still returns `false` and the alloted timeout has
     * passed, the operation will fail.
     *
     * @default - provider is synchronous. This means that the `onEvent` handler
     * is expected to finish all lifecycle operations within the initial invocation.
     */
    readonly isCompleteHandler?: lambda.IFunction;
    /**
     * Time between calls to the `isComplete` handler which determines if the
     * resource has been stabilized.
     *
     * The first `isComplete` will be called immediately after `handler` and then
     * every `queryInterval` seconds, and until `timeout` has been reached or until
     * `isComplete` returns `true`.
     *
     * @default Duration.seconds(5)
     */
    readonly queryInterval?: Duration;
    /**
     * Total timeout for the entire operation.
     *
     * The maximum timeout is 2 hours (yes, it can exceed the AWS Lambda 15 minutes)
     *
     * @default Duration.minutes(30)
     */
    readonly totalTimeout?: Duration;
    /**
     * The number of days framework log events are kept in CloudWatch Logs. When
     * updating this property, unsetting it doesn't remove the log retention policy.
     * To remove the retention policy, set the value to `INFINITE`.
     *
     * @default logs.RetentionDays.INFINITE
     */
    readonly logRetention?: logs.RetentionDays;
    /**
     * The vpc to provision the lambda functions in.
     *
     * @default - functions are not provisioned inside a vpc.
     */
    readonly vpc?: ec2.IVpc;
    /**
     * Which subnets from the VPC to place the lambda functions in.
     *
     * Only used if 'vpc' is supplied. Note: internet access for Lambdas
     * requires a NAT gateway, so picking Public subnets is not allowed.
     *
     * @default - the Vpc default strategy if not specified
     */
    readonly vpcSubnets?: ec2.SubnetSelection;
    /**
     * Security groups to attach to the provider functions.
     *
     * Only used if 'vpc' is supplied
     *
     * @default - If `vpc` is not supplied, no security groups are attached. Otherwise, a dedicated security
     * group is created for each function.
     */
    readonly securityGroups?: ec2.ISecurityGroup[];
    /**
     * AWS Lambda execution role.
     *
     * The role that will be assumed by the AWS Lambda.
     * Must be assumable by the 'lambda.amazonaws.com' service principal.
     *
     * @default - A default role will be created.
     */
    readonly role?: iam.IRole;
    /**
     * Provider Lambda name.
     *
     * The provider lambda function name.
     *
     * @default -  CloudFormation default name from unique physical ID
     */
    readonly providerFunctionName?: string;
}
/**
 * Defines an AWS CloudFormation custom resource provider.
 */
export declare class Provider extends Construct implements ICustomResourceProvider {
    /**
     * The user-defined AWS Lambda function which is invoked for all resource
     * lifecycle operations (CREATE/UPDATE/DELETE).
     */
    readonly onEventHandler: lambda.IFunction;
    /**
     * The user-defined AWS Lambda function which is invoked asynchronously in
     * order to determine if the operation is complete.
     */
    readonly isCompleteHandler?: lambda.IFunction;
    /**
     * The service token to use in order to define custom resources that are
     * backed by this provider.
     */
    readonly serviceToken: string;
    private readonly entrypoint;
    private readonly logRetention?;
    private readonly vpc?;
    private readonly vpcSubnets?;
    private readonly securityGroups?;
    private readonly role?;
    constructor(scope: Construct, id: string, props: ProviderProps);
    /**
     * Called by `CustomResource` which uses this provider.
     * @deprecated use `provider.serviceToken` instead
     */
    bind(_scope: Construct): CustomResourceProviderConfig;
    private createFunction;
}
