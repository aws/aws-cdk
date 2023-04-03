import { CfnDynamicReference } from './cfn-dynamic-reference';
import { CfnParameter } from './cfn-parameter';
import { Intrinsic, IntrinsicProps } from './private/intrinsic';
import { IResolveContext } from './resolvable';
/**
 * Work with secret values in the CDK
 *
 * Constructs that need secrets will declare parameters of type `SecretValue`.
 *
 * The actual values of these secrets should not be committed to your
 * repository, or even end up in the synthesized CloudFormation template. Instead, you should
 * store them in an external system like AWS Secrets Manager or SSM Parameter
 * Store, and you can reference them by calling `SecretValue.secretsManager()` or
 * `SecretValue.ssmSecure()`.
 *
 * You can use `SecretValue.unsafePlainText()` to construct a `SecretValue` from a
 * literal string, but doing so is highly discouraged.
 *
 * To make sure secret values don't accidentally end up in readable parts
 * of your infrastructure definition (such as the environment variables
 * of an AWS Lambda Function, where everyone who can read the function
 * definition has access to the secret), using secret values directly is not
 * allowed. You must pass them to constructs that accept `SecretValue`
 * properties, which are guaranteed to use the value only in CloudFormation
 * properties that are write-only.
 *
 * If you are sure that what you are doing is safe, you can call
 * `secretValue.unsafeUnwrap()` to access the protected string of the secret
 * value.
 *
 * (If you are writing something like an AWS Lambda Function and need to access
 * a secret inside it, make the API call to `GetSecretValue` directly inside
 * your Lamba's code, instead of using environment variables.)
 */
export declare class SecretValue extends Intrinsic {
    /**
     * Test whether an object is a SecretValue
     */
    static isSecretValue(x: any): x is SecretValue;
    /**
     * Construct a literal secret value for use with secret-aware constructs
     *
     * Do not use this method for any secrets that you care about! The value
     * will be visible to anyone who has access to the CloudFormation template
     * (via the AWS Console, SDKs, or CLI).
     *
     * The only reasonable use case for using this method is when you are testing.
     *
     * @deprecated Use `unsafePlainText()` instead.
     */
    static plainText(secret: string): SecretValue;
    /**
     * Construct a literal secret value for use with secret-aware constructs
     *
     * Do not use this method for any secrets that you care about! The value
     * will be visible to anyone who has access to the CloudFormation template
     * (via the AWS Console, SDKs, or CLI).
     *
     * The primary use case for using this method is when you are testing.
     *
     * The other use case where this is appropriate is when constructing a JSON secret.
     * For example, a JSON secret might have multiple fields where only some are actual
     * secret values.
     *
     * @example
     * declare const secret: SecretValue;
     * const jsonSecret = {
     *   username: SecretValue.unsafePlainText('myUsername'),
     *   password: secret,
     * };
     */
    static unsafePlainText(secret: string): SecretValue;
    /**
     * Creates a `SecretValue` with a value which is dynamically loaded from AWS Secrets Manager.
     *
     * If you rotate the value in the Secret, you must also change at least one property
     * on the resource where you are using the secret, to force CloudFormation to re-read the secret.
     *
     * @param secretId The ID or ARN of the secret
     * @param options Options
     */
    static secretsManager(secretId: string, options?: SecretsManagerSecretOptions): SecretValue;
    /**
     * Use a secret value stored from a Systems Manager (SSM) parameter.
     *
     * This secret source in only supported in a limited set of resources and
     * properties. [Click here for the list of supported
     * properties](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#template-parameters-dynamic-patterns-resources).
     *
     * @param parameterName The name of the parameter in the Systems Manager
     * Parameter Store. The parameter name is case-sensitive.
     *
     * @param version An integer that specifies the version of the parameter to
     * use. If you don't specify the exact version, AWS CloudFormation uses the
     * latest version of the parameter.
     */
    static ssmSecure(parameterName: string, version?: string): SecretValue;
    /**
     * Obtain the secret value through a CloudFormation dynamic reference.
     *
     * If possible, use `SecretValue.ssmSecure` or `SecretValue.secretsManager` directly.
     *
     * @param ref The dynamic reference to use.
     */
    static cfnDynamicReference(ref: CfnDynamicReference): SecretValue;
    /**
     * Obtain the secret value through a CloudFormation parameter.
     *
     * Generally, this is not a recommended approach. AWS Secrets Manager is the
     * recommended way to reference secrets.
     *
     * @param param The CloudFormation parameter to use.
     */
    static cfnParameter(param: CfnParameter): SecretValue;
    /**
     * Use a resource's output as secret value
     */
    static resourceAttribute(attr: string): SecretValue;
    private readonly rawValue;
    /**
     * Construct a SecretValue (do not use!)
     *
     * Do not use the constructor directly: use one of the factory functions on the class
     * instead.
     */
    constructor(protectedValue: any, options?: IntrinsicProps);
    /**
     * Disable usage protection on this secret
     *
     * Call this to indicate that you want to use the secret value held by this
     * object in an unchecked way. If you don't call this method, using the secret
     * value directly in a string context or as a property value somewhere will
     * produce an error.
     *
     * This method has 'unsafe' in the name on purpose! Make sure that the
     * construct property you are using the returned value in is does not end up
     * in a place in your AWS infrastructure where it could be read by anyone
     * unexpected.
     *
     * When in doubt, don't call this method and only pass the object to constructs that
     * accept `SecretValue` parameters.
     */
    unsafeUnwrap(): string;
    /**
     * Resolve the secret
     *
     * If the feature flag is not set, resolve as normal. Otherwise, throw a descriptive
     * error that the usage guard is missing.
     */
    resolve(context: IResolveContext): any;
}
/**
 * Options for referencing a secret value from Secrets Manager.
 */
export interface SecretsManagerSecretOptions {
    /**
     * Specifies the secret version that you want to retrieve by the staging label attached to the version.
     *
     * Can specify at most one of `versionId` and `versionStage`.
     *
     * @default AWSCURRENT
     */
    readonly versionStage?: string;
    /**
     * Specifies the unique identifier of the version of the secret you want to use.
     *
     * Can specify at most one of `versionId` and `versionStage`.
     *
     * @default AWSCURRENT
     */
    readonly versionId?: string;
    /**
     * The key of a JSON field to retrieve. This can only be used if the secret
     * stores a JSON object.
     *
     * @default - returns all the content stored in the Secrets Manager secret.
     */
    readonly jsonField?: string;
}
