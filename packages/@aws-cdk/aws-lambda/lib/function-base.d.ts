import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct, Node } from 'constructs';
import { Architecture } from './architecture';
import { EventInvokeConfigOptions } from './event-invoke-config';
import { IEventSource } from './event-source';
import { EventSourceMapping, EventSourceMappingOptions } from './event-source-mapping';
import { FunctionUrlOptions, FunctionUrl } from './function-url';
import { IVersion } from './lambda-version';
import { Permission } from './permission';
export interface IFunction extends IResource, ec2.IConnectable, iam.IGrantable {
    /**
     * The name of the function.
     *
     * @attribute
     */
    readonly functionName: string;
    /**
     * The ARN of the function.
     *
     * @attribute
     */
    readonly functionArn: string;
    /**
     * The IAM role associated with this function.
     */
    readonly role?: iam.IRole;
    /**
     * Whether or not this Lambda function was bound to a VPC
     *
     * If this is is `false`, trying to access the `connections` object will fail.
     */
    readonly isBoundToVpc: boolean;
    /**
     * The `$LATEST` version of this function.
     *
     * Note that this is reference to a non-specific AWS Lambda version, which
     * means the function this version refers to can return different results in
     * different invocations.
     *
     * To obtain a reference to an explicit version which references the current
     * function configuration, use `lambdaFunction.currentVersion` instead.
     */
    readonly latestVersion: IVersion;
    /**
     * The construct node where permissions are attached.
     */
    readonly permissionsNode: Node;
    /**
     * The system architectures compatible with this lambda function.
     */
    readonly architecture: Architecture;
    /**
     * The ARN(s) to put into the resource field of the generated IAM policy for grantInvoke().
     *
     * This property is for cdk modules to consume only. You should not need to use this property.
     * Instead, use grantInvoke() directly.
     */
    readonly resourceArnsForGrantInvoke: string[];
    /**
     * Adds an event source that maps to this AWS Lambda function.
     * @param id construct ID
     * @param options mapping options
     */
    addEventSourceMapping(id: string, options: EventSourceMappingOptions): EventSourceMapping;
    /**
     * Adds a permission to the Lambda resource policy.
     * @param id The id for the permission construct
     * @param permission The permission to grant to this Lambda function. @see Permission for details.
     */
    addPermission(id: string, permission: Permission): void;
    /**
     * Adds a statement to the IAM role assumed by the instance.
     */
    addToRolePolicy(statement: iam.PolicyStatement): void;
    /**
     * Grant the given identity permissions to invoke this Lambda
     */
    grantInvoke(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to invoke this Lambda Function URL
     */
    grantInvokeUrl(identity: iam.IGrantable): iam.Grant;
    /**
     * Return the given named metric for this Lambda
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the Duration of this Lambda
     *
     * @default average over 5 minutes
     */
    metricDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of invocations of this Lambda
     *
     * @default sum over 5 minutes
     */
    metricInvocations(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of throttled invocations of this Lambda
     *
     * @default sum over 5 minutes
     */
    metricThrottles(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Adds an event source to this function.
     *
     * Event sources are implemented in the @aws-cdk/aws-lambda-event-sources module.
     *
     * The following example adds an SQS Queue as an event source:
     * ```
     * import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
     * myFunction.addEventSource(new SqsEventSource(myQueue));
     * ```
     */
    addEventSource(source: IEventSource): void;
    /**
     * Configures options for asynchronous invocation.
     */
    configureAsyncInvoke(options: EventInvokeConfigOptions): void;
    /**
     * Adds a url to this lambda function.
     */
    addFunctionUrl(options?: FunctionUrlOptions): FunctionUrl;
}
/**
 * Represents a Lambda function defined outside of this stack.
 */
export interface FunctionAttributes {
    /**
     * The ARN of the Lambda function.
     *
     * Format: arn:<partition>:lambda:<region>:<account-id>:function:<function-name>
     */
    readonly functionArn: string;
    /**
     * The IAM execution role associated with this function.
     *
     * If the role is not specified, any role-related operations will no-op.
     */
    readonly role?: iam.IRole;
    /**
     * Id of the security group of this Lambda, if in a VPC.
     *
     * This needs to be given in order to support allowing connections
     * to this Lambda.
     *
     * @deprecated use `securityGroup` instead
     */
    readonly securityGroupId?: string;
    /**
     * The security group of this Lambda, if in a VPC.
     *
     * This needs to be given in order to support allowing connections
     * to this Lambda.
     */
    readonly securityGroup?: ec2.ISecurityGroup;
    /**
     * Setting this property informs the CDK that the imported function is in the same environment as the stack.
     * This affects certain behaviours such as, whether this function's permission can be modified.
     * When not configured, the CDK attempts to auto-determine this. For environment agnostic stacks, i.e., stacks
     * where the account is not specified with the `env` property, this is determined to be false.
     *
     * Set this to property *ONLY IF* the imported function is in the same account as the stack
     * it's imported in.
     * @default - depends: true, if the Stack is configured with an explicit `env` (account and region) and the account is the same as this function.
     * For environment-agnostic stacks this will default to `false`.
     */
    readonly sameEnvironment?: boolean;
    /**
     * Setting this property informs the CDK that the imported function ALREADY HAS the necessary permissions
     * for what you are trying to do. When not configured, the CDK attempts to auto-determine whether or not
     * additional permissions are necessary on the function when grant APIs are used. If the CDK tried to add
     * permissions on an imported lambda, it will fail.
     *
     * Set this property *ONLY IF* you are committing to manage the imported function's permissions outside of
     * CDK. You are acknowledging that your CDK code alone will have insufficient permissions to access the
     * imported function.
     *
     * @default false
     */
    readonly skipPermissions?: boolean;
    /**
     * The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64).
     * @default - Architecture.X86_64
     */
    readonly architecture?: Architecture;
}
export declare abstract class FunctionBase extends Resource implements IFunction, ec2.IClientVpnConnectionHandler {
    /**
     * The principal this Lambda Function is running as
     */
    abstract readonly grantPrincipal: iam.IPrincipal;
    /**
     * The name of the function.
     */
    abstract readonly functionName: string;
    /**
     * The ARN fo the function.
     */
    abstract readonly functionArn: string;
    /**
     * The IAM role associated with this function.
     *
     * Undefined if the function was imported without a role.
     */
    abstract readonly role?: iam.IRole;
    /**
     * The construct node where permissions are attached.
     */
    abstract readonly permissionsNode: Node;
    /**
     * The architecture of this Lambda Function.
     */
    abstract readonly architecture: Architecture;
    /**
     * Whether the addPermission() call adds any permissions
     *
     * True for new Lambdas, false for version $LATEST and imported Lambdas
     * from different accounts.
     */
    protected abstract readonly canCreatePermissions: boolean;
    /**
     * The ARN(s) to put into the resource field of the generated IAM policy for grantInvoke()
     */
    abstract readonly resourceArnsForGrantInvoke: string[];
    /**
     * Whether the user decides to skip adding permissions.
     * The only use case is for cross-account, imported lambdas
     * where the user commits to modifying the permisssions
     * on the imported lambda outside CDK.
     * @internal
     */
    protected readonly _skipPermissions?: boolean;
    /**
     * Actual connections object for this Lambda
     *
     * May be unset, in which case this Lambda is not configured use in a VPC.
     * @internal
     */
    protected _connections?: ec2.Connections;
    private _latestVersion?;
    /**
     * Flag to delay adding a warning message until current version is invoked.
     * @internal
     */
    protected _warnIfCurrentVersionCalled: boolean;
    /**
     * Mapping of invocation principals to grants. Used to de-dupe `grantInvoke()` calls.
     * @internal
     */
    protected _invocationGrants: Record<string, iam.Grant>;
    /**
     * Mapping of fucntion URL invocation principals to grants. Used to de-dupe `grantInvokeUrl()` calls.
     * @internal
     */
    protected _functionUrlInvocationGrants: Record<string, iam.Grant>;
    /**
     * A warning will be added to functions under the following conditions:
     * - permissions that include `lambda:InvokeFunction` are added to the unqualified function.
     * - function.currentVersion is invoked before or after the permission is created.
     *
     * This applies only to permissions on Lambda functions, not versions or aliases.
     * This function is overridden as a noOp for QualifiedFunctionBase.
     */
    considerWarningOnInvokeFunctionPermissions(scope: Construct, action: string): void;
    protected warnInvokeFunctionPermissions(scope: Construct): void;
    /**
     * Adds a permission to the Lambda resource policy.
     * @param id The id for the permission construct
     * @param permission The permission to grant to this Lambda function. @see Permission for details.
     */
    addPermission(id: string, permission: Permission): void;
    /**
     * Adds a statement to the IAM role assumed by the instance.
     */
    addToRolePolicy(statement: iam.PolicyStatement): void;
    /**
     * Access the Connections object
     *
     * Will fail if not a VPC-enabled Lambda Function
     */
    get connections(): ec2.Connections;
    get latestVersion(): IVersion;
    /**
     * Whether or not this Lambda function was bound to a VPC
     *
     * If this is is `false`, trying to access the `connections` object will fail.
     */
    get isBoundToVpc(): boolean;
    addEventSourceMapping(id: string, options: EventSourceMappingOptions): EventSourceMapping;
    /**
     * Grant the given identity permissions to invoke this Lambda
     */
    grantInvoke(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to invoke this Lambda Function URL
     */
    grantInvokeUrl(grantee: iam.IGrantable): iam.Grant;
    addEventSource(source: IEventSource): void;
    configureAsyncInvoke(options: EventInvokeConfigOptions): void;
    addFunctionUrl(options?: FunctionUrlOptions): FunctionUrl;
    /**
     * Returns the construct tree node that corresponds to the lambda function.
     * For use internally for constructs, when the tree is set up in non-standard ways. Ex: SingletonFunction.
     * @internal
     */
    protected _functionNode(): Node;
    /**
     * Given the function arn, check if the account id matches this account
     *
     * Function ARNs look like this:
     *
     *   arn:aws:lambda:region:account-id:function:function-name
     *
     * ..which means that in order to extract the `account-id` component from the ARN, we can
     * split the ARN using ":" and select the component in index 4.
     *
     * @returns true if account id of function matches the account specified on the stack, false otherwise.
     *
     * @internal
     */
    protected _isStackAccount(): boolean;
    private grant;
    /**
     * Translate IPrincipal to something we can pass to AWS::Lambda::Permissions
     *
     * Do some nasty things because `Permission` supports a subset of what the
     * full IAM principal language supports, and we may not be able to parse strings
     * outright because they may be tokens.
     *
     * Try to recognize some specific Principal classes first, then try a generic
     * fallback.
     */
    private parsePermissionPrincipal;
    private validateConditionCombinations;
    private validateConditions;
    private isPrincipalWithConditions;
}
export declare abstract class QualifiedFunctionBase extends FunctionBase {
    abstract readonly lambda: IFunction;
    readonly permissionsNode: Node;
    /**
     * The qualifier of the version or alias of this function.
     * A qualifier is the identifier that's appended to a version or alias ARN.
     * @see https://docs.aws.amazon.com/lambda/latest/dg/API_GetFunctionConfiguration.html#API_GetFunctionConfiguration_RequestParameters
     */
    protected abstract readonly qualifier: string;
    get latestVersion(): IVersion;
    get resourceArnsForGrantInvoke(): string[];
    configureAsyncInvoke(options: EventInvokeConfigOptions): void;
    considerWarningOnInvokeFunctionPermissions(_scope: Construct, _action: string): void;
}
