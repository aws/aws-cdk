import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { RemovalPolicy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Alias, AliasOptions } from './alias';
import { Architecture } from './architecture';
import { EventInvokeConfigOptions } from './event-invoke-config';
import { IFunction, QualifiedFunctionBase } from './function-base';
export interface IVersion extends IFunction {
    /**
     * The most recently deployed version of this function.
     * @attribute
     */
    readonly version: string;
    /**
     * The underlying AWS Lambda function.
     */
    readonly lambda: IFunction;
    /**
     * The ARN of the version for Lambda@Edge.
     */
    readonly edgeArn: string;
    /**
     * Defines an alias for this version.
     * @param aliasName The name of the alias
     * @param options Alias options
     *
     * @deprecated Calling `addAlias` on a `Version` object will cause the Alias to be replaced on every function update. Call `function.addAlias()` or `new Alias()` instead.
     */
    addAlias(aliasName: string, options?: AliasOptions): Alias;
}
/**
 * Options for `lambda.Version`
 */
export interface VersionOptions extends EventInvokeConfigOptions {
    /**
     * SHA256 of the version of the Lambda source code
     *
     * Specify to validate that you're deploying the right version.
     *
     * @default No validation is performed
     */
    readonly codeSha256?: string;
    /**
     * Description of the version
     *
     * @default Description of the Lambda
     */
    readonly description?: string;
    /**
     * Specifies a provisioned concurrency configuration for a function's version.
     *
     * @default No provisioned concurrency
     */
    readonly provisionedConcurrentExecutions?: number;
    /**
     * Whether to retain old versions of this function when a new version is
     * created.
     *
     * @default RemovalPolicy.DESTROY
     */
    readonly removalPolicy?: RemovalPolicy;
}
/**
 * Properties for a new Lambda version
 */
export interface VersionProps extends VersionOptions {
    /**
     * Function to get the value of
     */
    readonly lambda: IFunction;
}
export interface VersionAttributes {
    /**
     * The version.
     */
    readonly version: string;
    /**
     * The lambda function.
     */
    readonly lambda: IFunction;
}
/**
 * Tag the current state of a Function with a Version number
 *
 * Avoid using this resource directly. If you need a Version object, use
 * `function.currentVersion` instead. That will add a Version object to your
 * template, and make sure the Version is invalidated whenever the Function
 * object changes. If you use the `Version` resource directly, you are
 * responsible for making sure it is invalidated (by changing its
 * logical ID) whenever necessary.
 *
 * Version resources can then be used in `Alias` resources to refer to a
 * particular deployment of a Lambda.
 *
 * If you want to ensure that you're associating the right version with
 * the right deployment, specify the `codeSha256` property while
 * creating the `Version.
 */
export declare class Version extends QualifiedFunctionBase implements IVersion {
    /**
     * Construct a Version object from a Version ARN.
     *
     * @param scope The cdk scope creating this resource
     * @param id The cdk id of this resource
     * @param versionArn The version ARN to create this version from
     */
    static fromVersionArn(scope: Construct, id: string, versionArn: string): IVersion;
    static fromVersionAttributes(scope: Construct, id: string, attrs: VersionAttributes): IVersion;
    readonly version: string;
    readonly lambda: IFunction;
    readonly functionArn: string;
    readonly functionName: string;
    readonly architecture: Architecture;
    protected readonly qualifier: string;
    protected readonly canCreatePermissions = true;
    constructor(scope: Construct, id: string, props: VersionProps);
    get grantPrincipal(): import("@aws-cdk/aws-iam").IPrincipal;
    get role(): import("@aws-cdk/aws-iam").IRole | undefined;
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Defines an alias for this version.
     * @param aliasName The name of the alias (e.g. "live")
     * @param options Alias options
     * @deprecated Calling `addAlias` on a `Version` object will cause the Alias to be replaced on every function update. Call `function.addAlias()` or `new Alias()` instead.
     */
    addAlias(aliasName: string, options?: AliasOptions): Alias;
    get edgeArn(): string;
    /**
     * Validate that the provisionedConcurrentExecutions makes sense
     *
     * Member must have value greater than or equal to 1
     */
    private determineProvisionedConcurrency;
}
/**
 * Given an opaque (token) ARN, returns a CloudFormation expression that extracts the
 * qualifier (= version or alias) from the ARN.
 *
 * Version ARNs look like this:
 *
 *   arn:aws:lambda:region:account-id:function:function-name:qualifier
 *
 * ..which means that in order to extract the `qualifier` component from the ARN, we can
 * split the ARN using ":" and select the component in index 7.
 *
 * @returns `FnSelect(7, FnSplit(':', arn))`
 */
export declare function extractQualifierFromArn(arn: string): string;
