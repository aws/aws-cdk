"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretValue = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cx_api_1 = require("@aws-cdk/cx-api");
const cfn_dynamic_reference_1 = require("./cfn-dynamic-reference");
const cfn_resource_1 = require("./cfn-resource");
const feature_flags_1 = require("./feature-flags");
const cfn_reference_1 = require("./private/cfn-reference");
const intrinsic_1 = require("./private/intrinsic");
const token_1 = require("./token");
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
class SecretValue extends intrinsic_1.Intrinsic {
    /**
     * Construct a SecretValue (do not use!)
     *
     * Do not use the constructor directly: use one of the factory functions on the class
     * instead.
     */
    constructor(protectedValue, options) {
        super(protectedValue, options);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IntrinsicProps(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SecretValue);
            }
            throw error;
        }
        this.rawValue = protectedValue;
    }
    /**
     * Test whether an object is a SecretValue
     */
    static isSecretValue(x) {
        return typeof x === 'object' && x && x[SECRET_VALUE_SYM];
    }
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
    static plainText(secret) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.SecretValue#plainText", "Use `unsafePlainText()` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.plainText);
            }
            throw error;
        }
        return new SecretValue(secret);
    }
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
    static unsafePlainText(secret) {
        return new SecretValue(secret);
    }
    /**
     * Creates a `SecretValue` with a value which is dynamically loaded from AWS Secrets Manager.
     *
     * If you rotate the value in the Secret, you must also change at least one property
     * on the resource where you are using the secret, to force CloudFormation to re-read the secret.
     *
     * @param secretId The ID or ARN of the secret
     * @param options Options
     */
    static secretsManager(secretId, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_SecretsManagerSecretOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.secretsManager);
            }
            throw error;
        }
        if (!secretId) {
            throw new Error('secretId cannot be empty');
        }
        if (!token_1.Token.isUnresolved(secretId) && !secretId.startsWith('arn:') && secretId.includes(':')) {
            throw new Error(`secret id "${secretId}" is not an ARN but contains ":"`);
        }
        if (options.versionStage && options.versionId) {
            throw new Error(`verionStage: '${options.versionStage}' and versionId: '${options.versionId}' were both provided but only one is allowed`);
        }
        const parts = [
            secretId,
            'SecretString',
            options.jsonField || '',
            options.versionStage || '',
            options.versionId || '',
        ];
        const dyref = new cfn_dynamic_reference_1.CfnDynamicReference(cfn_dynamic_reference_1.CfnDynamicReferenceService.SECRETS_MANAGER, parts.join(':'));
        return this.cfnDynamicReference(dyref);
    }
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
    static ssmSecure(parameterName, version) {
        return this.cfnDynamicReference(new cfn_dynamic_reference_1.CfnDynamicReference(cfn_dynamic_reference_1.CfnDynamicReferenceService.SSM_SECURE, version ? `${parameterName}:${version}` : parameterName));
    }
    /**
     * Obtain the secret value through a CloudFormation dynamic reference.
     *
     * If possible, use `SecretValue.ssmSecure` or `SecretValue.secretsManager` directly.
     *
     * @param ref The dynamic reference to use.
     */
    static cfnDynamicReference(ref) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnDynamicReference(ref);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.cfnDynamicReference);
            }
            throw error;
        }
        return new SecretValue(ref);
    }
    /**
     * Obtain the secret value through a CloudFormation parameter.
     *
     * Generally, this is not a recommended approach. AWS Secrets Manager is the
     * recommended way to reference secrets.
     *
     * @param param The CloudFormation parameter to use.
     */
    static cfnParameter(param) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnParameter(param);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.cfnParameter);
            }
            throw error;
        }
        if (!param.noEcho) {
            throw new Error('CloudFormation parameter must be configured with "NoEcho"');
        }
        return new SecretValue(param.value);
    }
    /**
     * Use a resource's output as secret value
     */
    static resourceAttribute(attr) {
        const resolved = token_1.Tokenization.reverseCompleteString(attr);
        if (!resolved || !cfn_reference_1.CfnReference.isCfnReference(resolved) || !cfn_resource_1.CfnResource.isCfnResource(resolved.target)) {
            throw new Error('SecretValue.resourceAttribute() must be used with a resource attribute');
        }
        return new SecretValue(attr);
    }
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
    unsafeUnwrap() {
        return token_1.Token.asString(this.rawValue);
    }
    /**
     * Resolve the secret
     *
     * If the feature flag is not set, resolve as normal. Otherwise, throw a descriptive
     * error that the usage guard is missing.
     */
    resolve(context) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IResolveContext(context);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.resolve);
            }
            throw error;
        }
        if (feature_flags_1.FeatureFlags.of(context.scope).isEnabled(cx_api_1.CHECK_SECRET_USAGE)) {
            throw new Error(`Synthing a secret value to ${context.documentPath.join('/')}. Using a SecretValue here risks exposing your secret. Only pass SecretValues to constructs that accept a SecretValue property, or call AWS Secrets Manager directly in your runtime code. Call 'secretValue.unsafeUnwrap()' if you understand and accept the risks.`);
        }
        return super.resolve(context);
    }
}
exports.SecretValue = SecretValue;
_a = JSII_RTTI_SYMBOL_1;
SecretValue[_a] = { fqn: "@aws-cdk/core.SecretValue", version: "0.0.0" };
const SECRET_VALUE_SYM = Symbol.for('@aws-cdk/core.SecretValue');
Object.defineProperty(SecretValue.prototype, SECRET_VALUE_SYM, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0LXZhbHVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjcmV0LXZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDRDQUFxRDtBQUNyRCxtRUFBMEY7QUFFMUYsaURBQTZDO0FBQzdDLG1EQUErQztBQUMvQywyREFBdUQ7QUFDdkQsbURBQWdFO0FBRWhFLG1DQUE4QztBQUU5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Qkc7QUFDSCxNQUFhLFdBQVksU0FBUSxxQkFBUztJQThJeEM7Ozs7O09BS0c7SUFDSCxZQUFZLGNBQW1CLEVBQUUsT0FBd0I7UUFDdkQsS0FBSyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQzs7Ozs7OytDQXJKdEIsV0FBVzs7OztRQXNKcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUM7S0FDaEM7SUF0SkQ7O09BRUc7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQU07UUFDaEMsT0FBTyxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQzFEO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBYzs7Ozs7Ozs7OztRQUNwQyxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2hDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkc7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQWM7UUFDMUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNoQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFnQixFQUFFLFVBQXVDLEVBQUU7Ozs7Ozs7Ozs7UUFDdEYsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUM3QztRQUVE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QUFPLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDL0I7O0FBMUxILGtDQTJMQzs7O0FBaUNELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtJQUM3RCxLQUFLLEVBQUUsSUFBSTtJQUNYLFlBQVksRUFBRSxLQUFLO0lBQ25CLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFFBQVEsRUFBRSxLQUFLO0NBQ2hCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENIRUNLX1NFQ1JFVF9VU0FHRSB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDZm5EeW5hbWljUmVmZXJlbmNlLCBDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZSB9IGZyb20gJy4vY2ZuLWR5bmFtaWMtcmVmZXJlbmNlJztcbmltcG9ydCB7IENmblBhcmFtZXRlciB9IGZyb20gJy4vY2ZuLXBhcmFtZXRlcic7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IEZlYXR1cmVGbGFncyB9IGZyb20gJy4vZmVhdHVyZS1mbGFncyc7XG5pbXBvcnQgeyBDZm5SZWZlcmVuY2UgfSBmcm9tICcuL3ByaXZhdGUvY2ZuLXJlZmVyZW5jZSc7XG5pbXBvcnQgeyBJbnRyaW5zaWMsIEludHJpbnNpY1Byb3BzIH0gZnJvbSAnLi9wcml2YXRlL2ludHJpbnNpYyc7XG5pbXBvcnQgeyBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4vKipcbiAqIFdvcmsgd2l0aCBzZWNyZXQgdmFsdWVzIGluIHRoZSBDREtcbiAqXG4gKiBDb25zdHJ1Y3RzIHRoYXQgbmVlZCBzZWNyZXRzIHdpbGwgZGVjbGFyZSBwYXJhbWV0ZXJzIG9mIHR5cGUgYFNlY3JldFZhbHVlYC5cbiAqXG4gKiBUaGUgYWN0dWFsIHZhbHVlcyBvZiB0aGVzZSBzZWNyZXRzIHNob3VsZCBub3QgYmUgY29tbWl0dGVkIHRvIHlvdXJcbiAqIHJlcG9zaXRvcnksIG9yIGV2ZW4gZW5kIHVwIGluIHRoZSBzeW50aGVzaXplZCBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS4gSW5zdGVhZCwgeW91IHNob3VsZFxuICogc3RvcmUgdGhlbSBpbiBhbiBleHRlcm5hbCBzeXN0ZW0gbGlrZSBBV1MgU2VjcmV0cyBNYW5hZ2VyIG9yIFNTTSBQYXJhbWV0ZXJcbiAqIFN0b3JlLCBhbmQgeW91IGNhbiByZWZlcmVuY2UgdGhlbSBieSBjYWxsaW5nIGBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcigpYCBvclxuICogYFNlY3JldFZhbHVlLnNzbVNlY3VyZSgpYC5cbiAqXG4gKiBZb3UgY2FuIHVzZSBgU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KClgIHRvIGNvbnN0cnVjdCBhIGBTZWNyZXRWYWx1ZWAgZnJvbSBhXG4gKiBsaXRlcmFsIHN0cmluZywgYnV0IGRvaW5nIHNvIGlzIGhpZ2hseSBkaXNjb3VyYWdlZC5cbiAqXG4gKiBUbyBtYWtlIHN1cmUgc2VjcmV0IHZhbHVlcyBkb24ndCBhY2NpZGVudGFsbHkgZW5kIHVwIGluIHJlYWRhYmxlIHBhcnRzXG4gKiBvZiB5b3VyIGluZnJhc3RydWN0dXJlIGRlZmluaXRpb24gKHN1Y2ggYXMgdGhlIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICogb2YgYW4gQVdTIExhbWJkYSBGdW5jdGlvbiwgd2hlcmUgZXZlcnlvbmUgd2hvIGNhbiByZWFkIHRoZSBmdW5jdGlvblxuICogZGVmaW5pdGlvbiBoYXMgYWNjZXNzIHRvIHRoZSBzZWNyZXQpLCB1c2luZyBzZWNyZXQgdmFsdWVzIGRpcmVjdGx5IGlzIG5vdFxuICogYWxsb3dlZC4gWW91IG11c3QgcGFzcyB0aGVtIHRvIGNvbnN0cnVjdHMgdGhhdCBhY2NlcHQgYFNlY3JldFZhbHVlYFxuICogcHJvcGVydGllcywgd2hpY2ggYXJlIGd1YXJhbnRlZWQgdG8gdXNlIHRoZSB2YWx1ZSBvbmx5IGluIENsb3VkRm9ybWF0aW9uXG4gKiBwcm9wZXJ0aWVzIHRoYXQgYXJlIHdyaXRlLW9ubHkuXG4gKlxuICogSWYgeW91IGFyZSBzdXJlIHRoYXQgd2hhdCB5b3UgYXJlIGRvaW5nIGlzIHNhZmUsIHlvdSBjYW4gY2FsbFxuICogYHNlY3JldFZhbHVlLnVuc2FmZVVud3JhcCgpYCB0byBhY2Nlc3MgdGhlIHByb3RlY3RlZCBzdHJpbmcgb2YgdGhlIHNlY3JldFxuICogdmFsdWUuXG4gKlxuICogKElmIHlvdSBhcmUgd3JpdGluZyBzb21ldGhpbmcgbGlrZSBhbiBBV1MgTGFtYmRhIEZ1bmN0aW9uIGFuZCBuZWVkIHRvIGFjY2Vzc1xuICogYSBzZWNyZXQgaW5zaWRlIGl0LCBtYWtlIHRoZSBBUEkgY2FsbCB0byBgR2V0U2VjcmV0VmFsdWVgIGRpcmVjdGx5IGluc2lkZVxuICogeW91ciBMYW1iYSdzIGNvZGUsIGluc3RlYWQgb2YgdXNpbmcgZW52aXJvbm1lbnQgdmFyaWFibGVzLilcbiAqL1xuZXhwb3J0IGNsYXNzIFNlY3JldFZhbHVlIGV4dGVuZHMgSW50cmluc2ljIHtcbiAgLyoqXG4gICAqIFRlc3Qgd2hldGhlciBhbiBvYmplY3QgaXMgYSBTZWNyZXRWYWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc1NlY3JldFZhbHVlKHg6IGFueSk6IHggaXMgU2VjcmV0VmFsdWUge1xuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAmJiB4W1NFQ1JFVF9WQUxVRV9TWU1dO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIGxpdGVyYWwgc2VjcmV0IHZhbHVlIGZvciB1c2Ugd2l0aCBzZWNyZXQtYXdhcmUgY29uc3RydWN0c1xuICAgKlxuICAgKiBEbyBub3QgdXNlIHRoaXMgbWV0aG9kIGZvciBhbnkgc2VjcmV0cyB0aGF0IHlvdSBjYXJlIGFib3V0ISBUaGUgdmFsdWVcbiAgICogd2lsbCBiZSB2aXNpYmxlIHRvIGFueW9uZSB3aG8gaGFzIGFjY2VzcyB0byB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVcbiAgICogKHZpYSB0aGUgQVdTIENvbnNvbGUsIFNES3MsIG9yIENMSSkuXG4gICAqXG4gICAqIFRoZSBvbmx5IHJlYXNvbmFibGUgdXNlIGNhc2UgZm9yIHVzaW5nIHRoaXMgbWV0aG9kIGlzIHdoZW4geW91IGFyZSB0ZXN0aW5nLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHVuc2FmZVBsYWluVGV4dCgpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwbGFpblRleHQoc2VjcmV0OiBzdHJpbmcpOiBTZWNyZXRWYWx1ZSB7XG4gICAgcmV0dXJuIG5ldyBTZWNyZXRWYWx1ZShzZWNyZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIGxpdGVyYWwgc2VjcmV0IHZhbHVlIGZvciB1c2Ugd2l0aCBzZWNyZXQtYXdhcmUgY29uc3RydWN0c1xuICAgKlxuICAgKiBEbyBub3QgdXNlIHRoaXMgbWV0aG9kIGZvciBhbnkgc2VjcmV0cyB0aGF0IHlvdSBjYXJlIGFib3V0ISBUaGUgdmFsdWVcbiAgICogd2lsbCBiZSB2aXNpYmxlIHRvIGFueW9uZSB3aG8gaGFzIGFjY2VzcyB0byB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVcbiAgICogKHZpYSB0aGUgQVdTIENvbnNvbGUsIFNES3MsIG9yIENMSSkuXG4gICAqXG4gICAqIFRoZSBwcmltYXJ5IHVzZSBjYXNlIGZvciB1c2luZyB0aGlzIG1ldGhvZCBpcyB3aGVuIHlvdSBhcmUgdGVzdGluZy5cbiAgICpcbiAgICogVGhlIG90aGVyIHVzZSBjYXNlIHdoZXJlIHRoaXMgaXMgYXBwcm9wcmlhdGUgaXMgd2hlbiBjb25zdHJ1Y3RpbmcgYSBKU09OIHNlY3JldC5cbiAgICogRm9yIGV4YW1wbGUsIGEgSlNPTiBzZWNyZXQgbWlnaHQgaGF2ZSBtdWx0aXBsZSBmaWVsZHMgd2hlcmUgb25seSBzb21lIGFyZSBhY3R1YWxcbiAgICogc2VjcmV0IHZhbHVlcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZGVjbGFyZSBjb25zdCBzZWNyZXQ6IFNlY3JldFZhbHVlO1xuICAgKiBjb25zdCBqc29uU2VjcmV0ID0ge1xuICAgKiAgIHVzZXJuYW1lOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ215VXNlcm5hbWUnKSxcbiAgICogICBwYXNzd29yZDogc2VjcmV0LFxuICAgKiB9O1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyB1bnNhZmVQbGFpblRleHQoc2VjcmV0OiBzdHJpbmcpOiBTZWNyZXRWYWx1ZSB7XG4gICAgcmV0dXJuIG5ldyBTZWNyZXRWYWx1ZShzZWNyZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgU2VjcmV0VmFsdWVgIHdpdGggYSB2YWx1ZSB3aGljaCBpcyBkeW5hbWljYWxseSBsb2FkZWQgZnJvbSBBV1MgU2VjcmV0cyBNYW5hZ2VyLlxuICAgKlxuICAgKiBJZiB5b3Ugcm90YXRlIHRoZSB2YWx1ZSBpbiB0aGUgU2VjcmV0LCB5b3UgbXVzdCBhbHNvIGNoYW5nZSBhdCBsZWFzdCBvbmUgcHJvcGVydHlcbiAgICogb24gdGhlIHJlc291cmNlIHdoZXJlIHlvdSBhcmUgdXNpbmcgdGhlIHNlY3JldCwgdG8gZm9yY2UgQ2xvdWRGb3JtYXRpb24gdG8gcmUtcmVhZCB0aGUgc2VjcmV0LlxuICAgKlxuICAgKiBAcGFyYW0gc2VjcmV0SWQgVGhlIElEIG9yIEFSTiBvZiB0aGUgc2VjcmV0XG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2VjcmV0c01hbmFnZXIoc2VjcmV0SWQ6IHN0cmluZywgb3B0aW9uczogU2VjcmV0c01hbmFnZXJTZWNyZXRPcHRpb25zID0ge30pOiBTZWNyZXRWYWx1ZSB7XG4gICAgaWYgKCFzZWNyZXRJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZWNyZXRJZCBjYW5ub3QgYmUgZW1wdHknKTtcbiAgICB9XG5cbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChzZWNyZXRJZCkgJiYgIXNlY3JldElkLnN0YXJ0c1dpdGgoJ2FybjonKSAmJiBzZWNyZXRJZC5pbmNsdWRlcygnOicpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlY3JldCBpZCBcIiR7c2VjcmV0SWR9XCIgaXMgbm90IGFuIEFSTiBidXQgY29udGFpbnMgXCI6XCJgKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy52ZXJzaW9uU3RhZ2UgJiYgb3B0aW9ucy52ZXJzaW9uSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdmVyaW9uU3RhZ2U6ICcke29wdGlvbnMudmVyc2lvblN0YWdlfScgYW5kIHZlcnNpb25JZDogJyR7b3B0aW9ucy52ZXJzaW9uSWR9JyB3ZXJlIGJvdGggcHJvdmlkZWQgYnV0IG9ubHkgb25lIGlzIGFsbG93ZWRgKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJ0cyA9IFtcbiAgICAgIHNlY3JldElkLFxuICAgICAgJ1NlY3JldFN0cmluZycsXG4gICAgICBvcHRpb25zLmpzb25GaWVsZCB8fCAnJyxcbiAgICAgIG9wdGlvbnMudmVyc2lvblN0YWdlIHx8ICcnLFxuICAgICAgb3B0aW9ucy52ZXJzaW9uSWQgfHwgJycsXG4gICAgXTtcblxuICAgIGNvbnN0IGR5cmVmID0gbmV3IENmbkR5bmFtaWNSZWZlcmVuY2UoQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UuU0VDUkVUU19NQU5BR0VSLCBwYXJ0cy5qb2luKCc6JykpO1xuICAgIHJldHVybiB0aGlzLmNmbkR5bmFtaWNSZWZlcmVuY2UoZHlyZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBhIHNlY3JldCB2YWx1ZSBzdG9yZWQgZnJvbSBhIFN5c3RlbXMgTWFuYWdlciAoU1NNKSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFRoaXMgc2VjcmV0IHNvdXJjZSBpbiBvbmx5IHN1cHBvcnRlZCBpbiBhIGxpbWl0ZWQgc2V0IG9mIHJlc291cmNlcyBhbmRcbiAgICogcHJvcGVydGllcy4gW0NsaWNrIGhlcmUgZm9yIHRoZSBsaXN0IG9mIHN1cHBvcnRlZFxuICAgKiBwcm9wZXJ0aWVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9keW5hbWljLXJlZmVyZW5jZXMuaHRtbCN0ZW1wbGF0ZS1wYXJhbWV0ZXJzLWR5bmFtaWMtcGF0dGVybnMtcmVzb3VyY2VzKS5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtZXRlck5hbWUgVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciBpbiB0aGUgU3lzdGVtcyBNYW5hZ2VyXG4gICAqIFBhcmFtZXRlciBTdG9yZS4gVGhlIHBhcmFtZXRlciBuYW1lIGlzIGNhc2Utc2Vuc2l0aXZlLlxuICAgKlxuICAgKiBAcGFyYW0gdmVyc2lvbiBBbiBpbnRlZ2VyIHRoYXQgc3BlY2lmaWVzIHRoZSB2ZXJzaW9uIG9mIHRoZSBwYXJhbWV0ZXIgdG9cbiAgICogdXNlLiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSB0aGUgZXhhY3QgdmVyc2lvbiwgQVdTIENsb3VkRm9ybWF0aW9uIHVzZXMgdGhlXG4gICAqIGxhdGVzdCB2ZXJzaW9uIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNzbVNlY3VyZShwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHZlcnNpb24/OiBzdHJpbmcpOiBTZWNyZXRWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMuY2ZuRHluYW1pY1JlZmVyZW5jZShcbiAgICAgIG5ldyBDZm5EeW5hbWljUmVmZXJlbmNlKENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlLlNTTV9TRUNVUkUsXG4gICAgICAgIHZlcnNpb24gPyBgJHtwYXJhbWV0ZXJOYW1lfToke3ZlcnNpb259YCA6IHBhcmFtZXRlck5hbWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPYnRhaW4gdGhlIHNlY3JldCB2YWx1ZSB0aHJvdWdoIGEgQ2xvdWRGb3JtYXRpb24gZHluYW1pYyByZWZlcmVuY2UuXG4gICAqXG4gICAqIElmIHBvc3NpYmxlLCB1c2UgYFNlY3JldFZhbHVlLnNzbVNlY3VyZWAgb3IgYFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyYCBkaXJlY3RseS5cbiAgICpcbiAgICogQHBhcmFtIHJlZiBUaGUgZHluYW1pYyByZWZlcmVuY2UgdG8gdXNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjZm5EeW5hbWljUmVmZXJlbmNlKHJlZjogQ2ZuRHluYW1pY1JlZmVyZW5jZSkge1xuICAgIHJldHVybiBuZXcgU2VjcmV0VmFsdWUocmVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPYnRhaW4gdGhlIHNlY3JldCB2YWx1ZSB0aHJvdWdoIGEgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVyLlxuICAgKlxuICAgKiBHZW5lcmFsbHksIHRoaXMgaXMgbm90IGEgcmVjb21tZW5kZWQgYXBwcm9hY2guIEFXUyBTZWNyZXRzIE1hbmFnZXIgaXMgdGhlXG4gICAqIHJlY29tbWVuZGVkIHdheSB0byByZWZlcmVuY2Ugc2VjcmV0cy5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtIFRoZSBDbG91ZEZvcm1hdGlvbiBwYXJhbWV0ZXIgdG8gdXNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjZm5QYXJhbWV0ZXIocGFyYW06IENmblBhcmFtZXRlcikge1xuICAgIGlmICghcGFyYW0ubm9FY2hvKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nsb3VkRm9ybWF0aW9uIHBhcmFtZXRlciBtdXN0IGJlIGNvbmZpZ3VyZWQgd2l0aCBcIk5vRWNob1wiJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTZWNyZXRWYWx1ZShwYXJhbS52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgcmVzb3VyY2UncyBvdXRwdXQgYXMgc2VjcmV0IHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlc291cmNlQXR0cmlidXRlKGF0dHI6IHN0cmluZykge1xuICAgIGNvbnN0IHJlc29sdmVkID0gVG9rZW5pemF0aW9uLnJldmVyc2VDb21wbGV0ZVN0cmluZyhhdHRyKTtcbiAgICBpZiAoIXJlc29sdmVkIHx8ICFDZm5SZWZlcmVuY2UuaXNDZm5SZWZlcmVuY2UocmVzb2x2ZWQpIHx8ICFDZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKHJlc29sdmVkLnRhcmdldCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2VjcmV0VmFsdWUucmVzb3VyY2VBdHRyaWJ1dGUoKSBtdXN0IGJlIHVzZWQgd2l0aCBhIHJlc291cmNlIGF0dHJpYnV0ZScpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU2VjcmV0VmFsdWUoYXR0cik7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IHJhd1ZhbHVlOiBhbnk7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIFNlY3JldFZhbHVlIChkbyBub3QgdXNlISlcbiAgICpcbiAgICogRG8gbm90IHVzZSB0aGUgY29uc3RydWN0b3IgZGlyZWN0bHk6IHVzZSBvbmUgb2YgdGhlIGZhY3RvcnkgZnVuY3Rpb25zIG9uIHRoZSBjbGFzc1xuICAgKiBpbnN0ZWFkLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkVmFsdWU6IGFueSwgb3B0aW9ucz86IEludHJpbnNpY1Byb3BzKSB7XG4gICAgc3VwZXIocHJvdGVjdGVkVmFsdWUsIG9wdGlvbnMpO1xuICAgIHRoaXMucmF3VmFsdWUgPSBwcm90ZWN0ZWRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHVzYWdlIHByb3RlY3Rpb24gb24gdGhpcyBzZWNyZXRcbiAgICpcbiAgICogQ2FsbCB0aGlzIHRvIGluZGljYXRlIHRoYXQgeW91IHdhbnQgdG8gdXNlIHRoZSBzZWNyZXQgdmFsdWUgaGVsZCBieSB0aGlzXG4gICAqIG9iamVjdCBpbiBhbiB1bmNoZWNrZWQgd2F5LiBJZiB5b3UgZG9uJ3QgY2FsbCB0aGlzIG1ldGhvZCwgdXNpbmcgdGhlIHNlY3JldFxuICAgKiB2YWx1ZSBkaXJlY3RseSBpbiBhIHN0cmluZyBjb250ZXh0IG9yIGFzIGEgcHJvcGVydHkgdmFsdWUgc29tZXdoZXJlIHdpbGxcbiAgICogcHJvZHVjZSBhbiBlcnJvci5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaGFzICd1bnNhZmUnIGluIHRoZSBuYW1lIG9uIHB1cnBvc2UhIE1ha2Ugc3VyZSB0aGF0IHRoZVxuICAgKiBjb25zdHJ1Y3QgcHJvcGVydHkgeW91IGFyZSB1c2luZyB0aGUgcmV0dXJuZWQgdmFsdWUgaW4gaXMgZG9lcyBub3QgZW5kIHVwXG4gICAqIGluIGEgcGxhY2UgaW4geW91ciBBV1MgaW5mcmFzdHJ1Y3R1cmUgd2hlcmUgaXQgY291bGQgYmUgcmVhZCBieSBhbnlvbmVcbiAgICogdW5leHBlY3RlZC5cbiAgICpcbiAgICogV2hlbiBpbiBkb3VidCwgZG9uJ3QgY2FsbCB0aGlzIG1ldGhvZCBhbmQgb25seSBwYXNzIHRoZSBvYmplY3QgdG8gY29uc3RydWN0cyB0aGF0XG4gICAqIGFjY2VwdCBgU2VjcmV0VmFsdWVgIHBhcmFtZXRlcnMuXG4gICAqL1xuICBwdWJsaWMgdW5zYWZlVW53cmFwKCkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzLnJhd1ZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIHRoZSBzZWNyZXRcbiAgICpcbiAgICogSWYgdGhlIGZlYXR1cmUgZmxhZyBpcyBub3Qgc2V0LCByZXNvbHZlIGFzIG5vcm1hbC4gT3RoZXJ3aXNlLCB0aHJvdyBhIGRlc2NyaXB0aXZlXG4gICAqIGVycm9yIHRoYXQgdGhlIHVzYWdlIGd1YXJkIGlzIG1pc3NpbmcuXG4gICAqL1xuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgICBpZiAoRmVhdHVyZUZsYWdzLm9mKGNvbnRleHQuc2NvcGUpLmlzRW5hYmxlZChDSEVDS19TRUNSRVRfVVNBR0UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBTeW50aGluZyBhIHNlY3JldCB2YWx1ZSB0byAke2NvbnRleHQuZG9jdW1lbnRQYXRoLmpvaW4oJy8nKX0uIFVzaW5nIGEgU2VjcmV0VmFsdWUgaGVyZSByaXNrcyBleHBvc2luZyB5b3VyIHNlY3JldC4gT25seSBwYXNzIFNlY3JldFZhbHVlcyB0byBjb25zdHJ1Y3RzIHRoYXQgYWNjZXB0IGEgU2VjcmV0VmFsdWUgcHJvcGVydHksIG9yIGNhbGwgQVdTIFNlY3JldHMgTWFuYWdlciBkaXJlY3RseSBpbiB5b3VyIHJ1bnRpbWUgY29kZS4gQ2FsbCAnc2VjcmV0VmFsdWUudW5zYWZlVW53cmFwKCknIGlmIHlvdSB1bmRlcnN0YW5kIGFuZCBhY2NlcHQgdGhlIHJpc2tzLmAsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIucmVzb2x2ZShjb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHJlZmVyZW5jaW5nIGEgc2VjcmV0IHZhbHVlIGZyb20gU2VjcmV0cyBNYW5hZ2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlY3JldHNNYW5hZ2VyU2VjcmV0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIHNlY3JldCB2ZXJzaW9uIHRoYXQgeW91IHdhbnQgdG8gcmV0cmlldmUgYnkgdGhlIHN0YWdpbmcgbGFiZWwgYXR0YWNoZWQgdG8gdGhlIHZlcnNpb24uXG4gICAqXG4gICAqIENhbiBzcGVjaWZ5IGF0IG1vc3Qgb25lIG9mIGB2ZXJzaW9uSWRgIGFuZCBgdmVyc2lvblN0YWdlYC5cbiAgICpcbiAgICogQGRlZmF1bHQgQVdTQ1VSUkVOVFxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvblN0YWdlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSB2ZXJzaW9uIG9mIHRoZSBzZWNyZXQgeW91IHdhbnQgdG8gdXNlLlxuICAgKlxuICAgKiBDYW4gc3BlY2lmeSBhdCBtb3N0IG9uZSBvZiBgdmVyc2lvbklkYCBhbmQgYHZlcnNpb25TdGFnZWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IEFXU0NVUlJFTlRcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25JZD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGtleSBvZiBhIEpTT04gZmllbGQgdG8gcmV0cmlldmUuIFRoaXMgY2FuIG9ubHkgYmUgdXNlZCBpZiB0aGUgc2VjcmV0XG4gICAqIHN0b3JlcyBhIEpTT04gb2JqZWN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHJldHVybnMgYWxsIHRoZSBjb250ZW50IHN0b3JlZCBpbiB0aGUgU2VjcmV0cyBNYW5hZ2VyIHNlY3JldC5cbiAgICovXG4gIHJlYWRvbmx5IGpzb25GaWVsZD86IHN0cmluZztcbn1cblxuY29uc3QgU0VDUkVUX1ZBTFVFX1NZTSA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuU2VjcmV0VmFsdWUnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNlY3JldFZhbHVlLnByb3RvdHlwZSwgU0VDUkVUX1ZBTFVFX1NZTSwge1xuICB2YWx1ZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbn0pO1xuIl19