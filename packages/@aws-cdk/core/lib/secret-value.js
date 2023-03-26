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
_a = JSII_RTTI_SYMBOL_1;
SecretValue[_a] = { fqn: "@aws-cdk/core.SecretValue", version: "0.0.0" };
exports.SecretValue = SecretValue;
const SECRET_VALUE_SYM = Symbol.for('@aws-cdk/core.SecretValue');
Object.defineProperty(SecretValue.prototype, SECRET_VALUE_SYM, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0LXZhbHVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjcmV0LXZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDRDQUFxRDtBQUNyRCxtRUFBMEY7QUFFMUYsaURBQTZDO0FBQzdDLG1EQUErQztBQUMvQywyREFBdUQ7QUFDdkQsbURBQWdFO0FBRWhFLG1DQUE4QztBQUU5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Qkc7QUFDSCxNQUFhLFdBQVksU0FBUSxxQkFBUztJQUN4Qzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBTTtRQUNoQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDMUQ7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjOzs7Ozs7Ozs7O1FBQ3BDLE9BQU8sSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBYztRQUMxQyxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2hDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQWdCLEVBQUUsVUFBdUMsRUFBRTs7Ozs7Ozs7OztRQUN0RixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsSUFBSSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDM0YsTUFBTSxJQUFJLEtBQUssQ0FBQyxj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TyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQy9COzs7O0FBMUxVLGtDQUFXO0FBNE54QixNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUVqRSxNQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7SUFDN0QsS0FBSyxFQUFFLElBQUk7SUFDWCxZQUFZLEVBQUUsS0FBSztJQUNuQixVQUFVLEVBQUUsS0FBSztJQUNqQixRQUFRLEVBQUUsS0FBSztDQUNoQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDSEVDS19TRUNSRVRfVVNBR0UgfSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ2ZuRHluYW1pY1JlZmVyZW5jZSwgQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UgfSBmcm9tICcuL2Nmbi1keW5hbWljLXJlZmVyZW5jZSc7XG5pbXBvcnQgeyBDZm5QYXJhbWV0ZXIgfSBmcm9tICcuL2Nmbi1wYXJhbWV0ZXInO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBGZWF0dXJlRmxhZ3MgfSBmcm9tICcuL2ZlYXR1cmUtZmxhZ3MnO1xuaW1wb3J0IHsgQ2ZuUmVmZXJlbmNlIH0gZnJvbSAnLi9wcml2YXRlL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSW50cmluc2ljLCBJbnRyaW5zaWNQcm9wcyB9IGZyb20gJy4vcHJpdmF0ZS9pbnRyaW5zaWMnO1xuaW1wb3J0IHsgSVJlc29sdmVDb250ZXh0IH0gZnJvbSAnLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFRva2VuLCBUb2tlbml6YXRpb24gfSBmcm9tICcuL3Rva2VuJztcblxuLyoqXG4gKiBXb3JrIHdpdGggc2VjcmV0IHZhbHVlcyBpbiB0aGUgQ0RLXG4gKlxuICogQ29uc3RydWN0cyB0aGF0IG5lZWQgc2VjcmV0cyB3aWxsIGRlY2xhcmUgcGFyYW1ldGVycyBvZiB0eXBlIGBTZWNyZXRWYWx1ZWAuXG4gKlxuICogVGhlIGFjdHVhbCB2YWx1ZXMgb2YgdGhlc2Ugc2VjcmV0cyBzaG91bGQgbm90IGJlIGNvbW1pdHRlZCB0byB5b3VyXG4gKiByZXBvc2l0b3J5LCBvciBldmVuIGVuZCB1cCBpbiB0aGUgc3ludGhlc2l6ZWQgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuIEluc3RlYWQsIHlvdSBzaG91bGRcbiAqIHN0b3JlIHRoZW0gaW4gYW4gZXh0ZXJuYWwgc3lzdGVtIGxpa2UgQVdTIFNlY3JldHMgTWFuYWdlciBvciBTU00gUGFyYW1ldGVyXG4gKiBTdG9yZSwgYW5kIHlvdSBjYW4gcmVmZXJlbmNlIHRoZW0gYnkgY2FsbGluZyBgU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoKWAgb3JcbiAqIGBTZWNyZXRWYWx1ZS5zc21TZWN1cmUoKWAuXG4gKlxuICogWW91IGNhbiB1c2UgYFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgpYCB0byBjb25zdHJ1Y3QgYSBgU2VjcmV0VmFsdWVgIGZyb20gYVxuICogbGl0ZXJhbCBzdHJpbmcsIGJ1dCBkb2luZyBzbyBpcyBoaWdobHkgZGlzY291cmFnZWQuXG4gKlxuICogVG8gbWFrZSBzdXJlIHNlY3JldCB2YWx1ZXMgZG9uJ3QgYWNjaWRlbnRhbGx5IGVuZCB1cCBpbiByZWFkYWJsZSBwYXJ0c1xuICogb2YgeW91ciBpbmZyYXN0cnVjdHVyZSBkZWZpbml0aW9uIChzdWNoIGFzIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAqIG9mIGFuIEFXUyBMYW1iZGEgRnVuY3Rpb24sIHdoZXJlIGV2ZXJ5b25lIHdobyBjYW4gcmVhZCB0aGUgZnVuY3Rpb25cbiAqIGRlZmluaXRpb24gaGFzIGFjY2VzcyB0byB0aGUgc2VjcmV0KSwgdXNpbmcgc2VjcmV0IHZhbHVlcyBkaXJlY3RseSBpcyBub3RcbiAqIGFsbG93ZWQuIFlvdSBtdXN0IHBhc3MgdGhlbSB0byBjb25zdHJ1Y3RzIHRoYXQgYWNjZXB0IGBTZWNyZXRWYWx1ZWBcbiAqIHByb3BlcnRpZXMsIHdoaWNoIGFyZSBndWFyYW50ZWVkIHRvIHVzZSB0aGUgdmFsdWUgb25seSBpbiBDbG91ZEZvcm1hdGlvblxuICogcHJvcGVydGllcyB0aGF0IGFyZSB3cml0ZS1vbmx5LlxuICpcbiAqIElmIHlvdSBhcmUgc3VyZSB0aGF0IHdoYXQgeW91IGFyZSBkb2luZyBpcyBzYWZlLCB5b3UgY2FuIGNhbGxcbiAqIGBzZWNyZXRWYWx1ZS51bnNhZmVVbndyYXAoKWAgdG8gYWNjZXNzIHRoZSBwcm90ZWN0ZWQgc3RyaW5nIG9mIHRoZSBzZWNyZXRcbiAqIHZhbHVlLlxuICpcbiAqIChJZiB5b3UgYXJlIHdyaXRpbmcgc29tZXRoaW5nIGxpa2UgYW4gQVdTIExhbWJkYSBGdW5jdGlvbiBhbmQgbmVlZCB0byBhY2Nlc3NcbiAqIGEgc2VjcmV0IGluc2lkZSBpdCwgbWFrZSB0aGUgQVBJIGNhbGwgdG8gYEdldFNlY3JldFZhbHVlYCBkaXJlY3RseSBpbnNpZGVcbiAqIHlvdXIgTGFtYmEncyBjb2RlLCBpbnN0ZWFkIG9mIHVzaW5nIGVudmlyb25tZW50IHZhcmlhYmxlcy4pXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWNyZXRWYWx1ZSBleHRlbmRzIEludHJpbnNpYyB7XG4gIC8qKlxuICAgKiBUZXN0IHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgU2VjcmV0VmFsdWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNTZWNyZXRWYWx1ZSh4OiBhbnkpOiB4IGlzIFNlY3JldFZhbHVlIHtcbiAgICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggJiYgeFtTRUNSRVRfVkFMVUVfU1lNXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBsaXRlcmFsIHNlY3JldCB2YWx1ZSBmb3IgdXNlIHdpdGggc2VjcmV0LWF3YXJlIGNvbnN0cnVjdHNcbiAgICpcbiAgICogRG8gbm90IHVzZSB0aGlzIG1ldGhvZCBmb3IgYW55IHNlY3JldHMgdGhhdCB5b3UgY2FyZSBhYm91dCEgVGhlIHZhbHVlXG4gICAqIHdpbGwgYmUgdmlzaWJsZSB0byBhbnlvbmUgd2hvIGhhcyBhY2Nlc3MgdG8gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlXG4gICAqICh2aWEgdGhlIEFXUyBDb25zb2xlLCBTREtzLCBvciBDTEkpLlxuICAgKlxuICAgKiBUaGUgb25seSByZWFzb25hYmxlIHVzZSBjYXNlIGZvciB1c2luZyB0aGlzIG1ldGhvZCBpcyB3aGVuIHlvdSBhcmUgdGVzdGluZy5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGB1bnNhZmVQbGFpblRleHQoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGxhaW5UZXh0KHNlY3JldDogc3RyaW5nKTogU2VjcmV0VmFsdWUge1xuICAgIHJldHVybiBuZXcgU2VjcmV0VmFsdWUoc2VjcmV0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBsaXRlcmFsIHNlY3JldCB2YWx1ZSBmb3IgdXNlIHdpdGggc2VjcmV0LWF3YXJlIGNvbnN0cnVjdHNcbiAgICpcbiAgICogRG8gbm90IHVzZSB0aGlzIG1ldGhvZCBmb3IgYW55IHNlY3JldHMgdGhhdCB5b3UgY2FyZSBhYm91dCEgVGhlIHZhbHVlXG4gICAqIHdpbGwgYmUgdmlzaWJsZSB0byBhbnlvbmUgd2hvIGhhcyBhY2Nlc3MgdG8gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlXG4gICAqICh2aWEgdGhlIEFXUyBDb25zb2xlLCBTREtzLCBvciBDTEkpLlxuICAgKlxuICAgKiBUaGUgcHJpbWFyeSB1c2UgY2FzZSBmb3IgdXNpbmcgdGhpcyBtZXRob2QgaXMgd2hlbiB5b3UgYXJlIHRlc3RpbmcuXG4gICAqXG4gICAqIFRoZSBvdGhlciB1c2UgY2FzZSB3aGVyZSB0aGlzIGlzIGFwcHJvcHJpYXRlIGlzIHdoZW4gY29uc3RydWN0aW5nIGEgSlNPTiBzZWNyZXQuXG4gICAqIEZvciBleGFtcGxlLCBhIEpTT04gc2VjcmV0IG1pZ2h0IGhhdmUgbXVsdGlwbGUgZmllbGRzIHdoZXJlIG9ubHkgc29tZSBhcmUgYWN0dWFsXG4gICAqIHNlY3JldCB2YWx1ZXMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGRlY2xhcmUgY29uc3Qgc2VjcmV0OiBTZWNyZXRWYWx1ZTtcbiAgICogY29uc3QganNvblNlY3JldCA9IHtcbiAgICogICB1c2VybmFtZTogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdteVVzZXJuYW1lJyksXG4gICAqICAgcGFzc3dvcmQ6IHNlY3JldCxcbiAgICogfTtcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdW5zYWZlUGxhaW5UZXh0KHNlY3JldDogc3RyaW5nKTogU2VjcmV0VmFsdWUge1xuICAgIHJldHVybiBuZXcgU2VjcmV0VmFsdWUoc2VjcmV0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYFNlY3JldFZhbHVlYCB3aXRoIGEgdmFsdWUgd2hpY2ggaXMgZHluYW1pY2FsbHkgbG9hZGVkIGZyb20gQVdTIFNlY3JldHMgTWFuYWdlci5cbiAgICpcbiAgICogSWYgeW91IHJvdGF0ZSB0aGUgdmFsdWUgaW4gdGhlIFNlY3JldCwgeW91IG11c3QgYWxzbyBjaGFuZ2UgYXQgbGVhc3Qgb25lIHByb3BlcnR5XG4gICAqIG9uIHRoZSByZXNvdXJjZSB3aGVyZSB5b3UgYXJlIHVzaW5nIHRoZSBzZWNyZXQsIHRvIGZvcmNlIENsb3VkRm9ybWF0aW9uIHRvIHJlLXJlYWQgdGhlIHNlY3JldC5cbiAgICpcbiAgICogQHBhcmFtIHNlY3JldElkIFRoZSBJRCBvciBBUk4gb2YgdGhlIHNlY3JldFxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNlY3JldHNNYW5hZ2VyKHNlY3JldElkOiBzdHJpbmcsIG9wdGlvbnM6IFNlY3JldHNNYW5hZ2VyU2VjcmV0T3B0aW9ucyA9IHt9KTogU2VjcmV0VmFsdWUge1xuICAgIGlmICghc2VjcmV0SWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2VjcmV0SWQgY2Fubm90IGJlIGVtcHR5Jyk7XG4gICAgfVxuXG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoc2VjcmV0SWQpICYmICFzZWNyZXRJZC5zdGFydHNXaXRoKCdhcm46JykgJiYgc2VjcmV0SWQuaW5jbHVkZXMoJzonKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZWNyZXQgaWQgXCIke3NlY3JldElkfVwiIGlzIG5vdCBhbiBBUk4gYnV0IGNvbnRhaW5zIFwiOlwiYCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudmVyc2lvblN0YWdlICYmIG9wdGlvbnMudmVyc2lvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZlcmlvblN0YWdlOiAnJHtvcHRpb25zLnZlcnNpb25TdGFnZX0nIGFuZCB2ZXJzaW9uSWQ6ICcke29wdGlvbnMudmVyc2lvbklkfScgd2VyZSBib3RoIHByb3ZpZGVkIGJ1dCBvbmx5IG9uZSBpcyBhbGxvd2VkYCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSBbXG4gICAgICBzZWNyZXRJZCxcbiAgICAgICdTZWNyZXRTdHJpbmcnLFxuICAgICAgb3B0aW9ucy5qc29uRmllbGQgfHwgJycsXG4gICAgICBvcHRpb25zLnZlcnNpb25TdGFnZSB8fCAnJyxcbiAgICAgIG9wdGlvbnMudmVyc2lvbklkIHx8ICcnLFxuICAgIF07XG5cbiAgICBjb25zdCBkeXJlZiA9IG5ldyBDZm5EeW5hbWljUmVmZXJlbmNlKENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUiwgcGFydHMuam9pbignOicpKTtcbiAgICByZXR1cm4gdGhpcy5jZm5EeW5hbWljUmVmZXJlbmNlKGR5cmVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgYSBzZWNyZXQgdmFsdWUgc3RvcmVkIGZyb20gYSBTeXN0ZW1zIE1hbmFnZXIgKFNTTSkgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBUaGlzIHNlY3JldCBzb3VyY2UgaW4gb25seSBzdXBwb3J0ZWQgaW4gYSBsaW1pdGVkIHNldCBvZiByZXNvdXJjZXMgYW5kXG4gICAqIHByb3BlcnRpZXMuIFtDbGljayBoZXJlIGZvciB0aGUgbGlzdCBvZiBzdXBwb3J0ZWRcbiAgICogcHJvcGVydGllc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvZHluYW1pYy1yZWZlcmVuY2VzLmh0bWwjdGVtcGxhdGUtcGFyYW1ldGVycy1keW5hbWljLXBhdHRlcm5zLXJlc291cmNlcykuXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJOYW1lIFRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgaW4gdGhlIFN5c3RlbXMgTWFuYWdlclxuICAgKiBQYXJhbWV0ZXIgU3RvcmUuIFRoZSBwYXJhbWV0ZXIgbmFtZSBpcyBjYXNlLXNlbnNpdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIHZlcnNpb24gQW4gaW50ZWdlciB0aGF0IHNwZWNpZmllcyB0aGUgdmVyc2lvbiBvZiB0aGUgcGFyYW1ldGVyIHRvXG4gICAqIHVzZS4gSWYgeW91IGRvbid0IHNwZWNpZnkgdGhlIGV4YWN0IHZlcnNpb24sIEFXUyBDbG91ZEZvcm1hdGlvbiB1c2VzIHRoZVxuICAgKiBsYXRlc3QgdmVyc2lvbiBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzc21TZWN1cmUocGFyYW1ldGVyTmFtZTogc3RyaW5nLCB2ZXJzaW9uPzogc3RyaW5nKTogU2VjcmV0VmFsdWUge1xuICAgIHJldHVybiB0aGlzLmNmbkR5bmFtaWNSZWZlcmVuY2UoXG4gICAgICBuZXcgQ2ZuRHluYW1pY1JlZmVyZW5jZShDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZS5TU01fU0VDVVJFLFxuICAgICAgICB2ZXJzaW9uID8gYCR7cGFyYW1ldGVyTmFtZX06JHt2ZXJzaW9ufWAgOiBwYXJhbWV0ZXJOYW1lKSk7XG4gIH1cblxuICAvKipcbiAgICogT2J0YWluIHRoZSBzZWNyZXQgdmFsdWUgdGhyb3VnaCBhIENsb3VkRm9ybWF0aW9uIGR5bmFtaWMgcmVmZXJlbmNlLlxuICAgKlxuICAgKiBJZiBwb3NzaWJsZSwgdXNlIGBTZWNyZXRWYWx1ZS5zc21TZWN1cmVgIG9yIGBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcmAgZGlyZWN0bHkuXG4gICAqXG4gICAqIEBwYXJhbSByZWYgVGhlIGR5bmFtaWMgcmVmZXJlbmNlIHRvIHVzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2ZuRHluYW1pY1JlZmVyZW5jZShyZWY6IENmbkR5bmFtaWNSZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gbmV3IFNlY3JldFZhbHVlKHJlZik7XG4gIH1cblxuICAvKipcbiAgICogT2J0YWluIHRoZSBzZWNyZXQgdmFsdWUgdGhyb3VnaCBhIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlci5cbiAgICpcbiAgICogR2VuZXJhbGx5LCB0aGlzIGlzIG5vdCBhIHJlY29tbWVuZGVkIGFwcHJvYWNoLiBBV1MgU2VjcmV0cyBNYW5hZ2VyIGlzIHRoZVxuICAgKiByZWNvbW1lbmRlZCB3YXkgdG8gcmVmZXJlbmNlIHNlY3JldHMuXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbSBUaGUgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVyIHRvIHVzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2ZuUGFyYW1ldGVyKHBhcmFtOiBDZm5QYXJhbWV0ZXIpIHtcbiAgICBpZiAoIXBhcmFtLm5vRWNobykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDbG91ZEZvcm1hdGlvbiBwYXJhbWV0ZXIgbXVzdCBiZSBjb25maWd1cmVkIHdpdGggXCJOb0VjaG9cIicpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU2VjcmV0VmFsdWUocGFyYW0udmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBhIHJlc291cmNlJ3Mgb3V0cHV0IGFzIHNlY3JldCB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZXNvdXJjZUF0dHJpYnV0ZShhdHRyOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNvbHZlZCA9IFRva2VuaXphdGlvbi5yZXZlcnNlQ29tcGxldGVTdHJpbmcoYXR0cik7XG4gICAgaWYgKCFyZXNvbHZlZCB8fCAhQ2ZuUmVmZXJlbmNlLmlzQ2ZuUmVmZXJlbmNlKHJlc29sdmVkKSB8fCAhQ2ZuUmVzb3VyY2UuaXNDZm5SZXNvdXJjZShyZXNvbHZlZC50YXJnZXQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlY3JldFZhbHVlLnJlc291cmNlQXR0cmlidXRlKCkgbXVzdCBiZSB1c2VkIHdpdGggYSByZXNvdXJjZSBhdHRyaWJ1dGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNlY3JldFZhbHVlKGF0dHIpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSByYXdWYWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBTZWNyZXRWYWx1ZSAoZG8gbm90IHVzZSEpXG4gICAqXG4gICAqIERvIG5vdCB1c2UgdGhlIGNvbnN0cnVjdG9yIGRpcmVjdGx5OiB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IGZ1bmN0aW9ucyBvbiB0aGUgY2xhc3NcbiAgICogaW5zdGVhZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZFZhbHVlOiBhbnksIG9wdGlvbnM/OiBJbnRyaW5zaWNQcm9wcykge1xuICAgIHN1cGVyKHByb3RlY3RlZFZhbHVlLCBvcHRpb25zKTtcbiAgICB0aGlzLnJhd1ZhbHVlID0gcHJvdGVjdGVkVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZSB1c2FnZSBwcm90ZWN0aW9uIG9uIHRoaXMgc2VjcmV0XG4gICAqXG4gICAqIENhbGwgdGhpcyB0byBpbmRpY2F0ZSB0aGF0IHlvdSB3YW50IHRvIHVzZSB0aGUgc2VjcmV0IHZhbHVlIGhlbGQgYnkgdGhpc1xuICAgKiBvYmplY3QgaW4gYW4gdW5jaGVja2VkIHdheS4gSWYgeW91IGRvbid0IGNhbGwgdGhpcyBtZXRob2QsIHVzaW5nIHRoZSBzZWNyZXRcbiAgICogdmFsdWUgZGlyZWN0bHkgaW4gYSBzdHJpbmcgY29udGV4dCBvciBhcyBhIHByb3BlcnR5IHZhbHVlIHNvbWV3aGVyZSB3aWxsXG4gICAqIHByb2R1Y2UgYW4gZXJyb3IuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGhhcyAndW5zYWZlJyBpbiB0aGUgbmFtZSBvbiBwdXJwb3NlISBNYWtlIHN1cmUgdGhhdCB0aGVcbiAgICogY29uc3RydWN0IHByb3BlcnR5IHlvdSBhcmUgdXNpbmcgdGhlIHJldHVybmVkIHZhbHVlIGluIGlzIGRvZXMgbm90IGVuZCB1cFxuICAgKiBpbiBhIHBsYWNlIGluIHlvdXIgQVdTIGluZnJhc3RydWN0dXJlIHdoZXJlIGl0IGNvdWxkIGJlIHJlYWQgYnkgYW55b25lXG4gICAqIHVuZXhwZWN0ZWQuXG4gICAqXG4gICAqIFdoZW4gaW4gZG91YnQsIGRvbid0IGNhbGwgdGhpcyBtZXRob2QgYW5kIG9ubHkgcGFzcyB0aGUgb2JqZWN0IHRvIGNvbnN0cnVjdHMgdGhhdFxuICAgKiBhY2NlcHQgYFNlY3JldFZhbHVlYCBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgcHVibGljIHVuc2FmZVVud3JhcCgpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcy5yYXdWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSB0aGUgc2VjcmV0XG4gICAqXG4gICAqIElmIHRoZSBmZWF0dXJlIGZsYWcgaXMgbm90IHNldCwgcmVzb2x2ZSBhcyBub3JtYWwuIE90aGVyd2lzZSwgdGhyb3cgYSBkZXNjcmlwdGl2ZVxuICAgKiBlcnJvciB0aGF0IHRoZSB1c2FnZSBndWFyZCBpcyBtaXNzaW5nLlxuICAgKi9cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgaWYgKEZlYXR1cmVGbGFncy5vZihjb250ZXh0LnNjb3BlKS5pc0VuYWJsZWQoQ0hFQ0tfU0VDUkVUX1VTQUdFKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgU3ludGhpbmcgYSBzZWNyZXQgdmFsdWUgdG8gJHtjb250ZXh0LmRvY3VtZW50UGF0aC5qb2luKCcvJyl9LiBVc2luZyBhIFNlY3JldFZhbHVlIGhlcmUgcmlza3MgZXhwb3NpbmcgeW91ciBzZWNyZXQuIE9ubHkgcGFzcyBTZWNyZXRWYWx1ZXMgdG8gY29uc3RydWN0cyB0aGF0IGFjY2VwdCBhIFNlY3JldFZhbHVlIHByb3BlcnR5LCBvciBjYWxsIEFXUyBTZWNyZXRzIE1hbmFnZXIgZGlyZWN0bHkgaW4geW91ciBydW50aW1lIGNvZGUuIENhbGwgJ3NlY3JldFZhbHVlLnVuc2FmZVVud3JhcCgpJyBpZiB5b3UgdW5kZXJzdGFuZCBhbmQgYWNjZXB0IHRoZSByaXNrcy5gLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLnJlc29sdmUoY29udGV4dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciByZWZlcmVuY2luZyBhIHNlY3JldCB2YWx1ZSBmcm9tIFNlY3JldHMgTWFuYWdlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWNyZXRzTWFuYWdlclNlY3JldE9wdGlvbnMge1xuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBzZWNyZXQgdmVyc2lvbiB0aGF0IHlvdSB3YW50IHRvIHJldHJpZXZlIGJ5IHRoZSBzdGFnaW5nIGxhYmVsIGF0dGFjaGVkIHRvIHRoZSB2ZXJzaW9uLlxuICAgKlxuICAgKiBDYW4gc3BlY2lmeSBhdCBtb3N0IG9uZSBvZiBgdmVyc2lvbklkYCBhbmQgYHZlcnNpb25TdGFnZWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IEFXU0NVUlJFTlRcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25TdGFnZT86IHN0cmluZztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgdmVyc2lvbiBvZiB0aGUgc2VjcmV0IHlvdSB3YW50IHRvIHVzZS5cbiAgICpcbiAgICogQ2FuIHNwZWNpZnkgYXQgbW9zdCBvbmUgb2YgYHZlcnNpb25JZGAgYW5kIGB2ZXJzaW9uU3RhZ2VgLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBV1NDVVJSRU5UXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBrZXkgb2YgYSBKU09OIGZpZWxkIHRvIHJldHJpZXZlLiBUaGlzIGNhbiBvbmx5IGJlIHVzZWQgaWYgdGhlIHNlY3JldFxuICAgKiBzdG9yZXMgYSBKU09OIG9iamVjdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSByZXR1cm5zIGFsbCB0aGUgY29udGVudCBzdG9yZWQgaW4gdGhlIFNlY3JldHMgTWFuYWdlciBzZWNyZXQuXG4gICAqL1xuICByZWFkb25seSBqc29uRmllbGQ/OiBzdHJpbmc7XG59XG5cbmNvbnN0IFNFQ1JFVF9WQUxVRV9TWU0gPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9jb3JlLlNlY3JldFZhbHVlJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZWNyZXRWYWx1ZS5wcm90b3R5cGUsIFNFQ1JFVF9WQUxVRV9TWU0sIHtcbiAgdmFsdWU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG59KTtcbiJdfQ==