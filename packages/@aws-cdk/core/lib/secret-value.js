"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretValue = void 0;
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
        if (!secretId) {
            throw new Error('secretId cannot be empty');
        }
        if (!token_1.Token.isUnresolved(secretId) && !secretId.startsWith('arn:') && secretId.includes(':')) {
            throw new Error(`secret id "${secretId}" is not an ARN but contains ":"`);
        }
        if (options.versionStage && options.versionId) {
            throw new Error(`versionStage: '${options.versionStage}' and versionId: '${options.versionId}' were both provided but only one is allowed`);
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
        if (feature_flags_1.FeatureFlags.of(context.scope).isEnabled(cx_api_1.CHECK_SECRET_USAGE)) {
            throw new Error(`Synthing a secret value to ${context.documentPath.join('/')}. Using a SecretValue here risks exposing your secret. Only pass SecretValues to constructs that accept a SecretValue property, or call AWS Secrets Manager directly in your runtime code. Call 'secretValue.unsafeUnwrap()' if you understand and accept the risks.`);
        }
        return super.resolve(context);
    }
}
exports.SecretValue = SecretValue;
const SECRET_VALUE_SYM = Symbol.for('@aws-cdk/core.SecretValue');
Object.defineProperty(SecretValue.prototype, SECRET_VALUE_SYM, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0LXZhbHVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjcmV0LXZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUFxRDtBQUNyRCxtRUFBMEY7QUFFMUYsaURBQTZDO0FBQzdDLG1EQUErQztBQUMvQywyREFBdUQ7QUFDdkQsbURBQWdFO0FBRWhFLG1DQUE4QztBQUU5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Qkc7QUFDSCxNQUFhLFdBQVksU0FBUSxxQkFBUztJQUN4Qzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBTTtRQUNoQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWM7UUFDcEMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkc7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQWM7UUFDMUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQWdCLEVBQUUsVUFBdUMsRUFBRTtRQUN0RixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsSUFBSSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDM0YsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLFFB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QztJQUNoQyxDQUFDO0NBQ0Y7QUEzTEQsa0NBMkxDO0FBaUNELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtJQUM3RCxLQUFLLEVBQUUsSUFBSTtJQUNYLFlBQVksRUFBRSxLQUFLO0lBQ25CLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFFBQVEsRUFBRSxLQUFLO0NBQ2hCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENIRUNLX1NFQ1JFVF9VU0FHRSB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDZm5EeW5hbWljUmVmZXJlbmNlLCBDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZSB9IGZyb20gJy4vY2ZuLWR5bmFtaWMtcmVmZXJlbmNlJztcbmltcG9ydCB7IENmblBhcmFtZXRlciB9IGZyb20gJy4vY2ZuLXBhcmFtZXRlcic7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IEZlYXR1cmVGbGFncyB9IGZyb20gJy4vZmVhdHVyZS1mbGFncyc7XG5pbXBvcnQgeyBDZm5SZWZlcmVuY2UgfSBmcm9tICcuL3ByaXZhdGUvY2ZuLXJlZmVyZW5jZSc7XG5pbXBvcnQgeyBJbnRyaW5zaWMsIEludHJpbnNpY1Byb3BzIH0gZnJvbSAnLi9wcml2YXRlL2ludHJpbnNpYyc7XG5pbXBvcnQgeyBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4vKipcbiAqIFdvcmsgd2l0aCBzZWNyZXQgdmFsdWVzIGluIHRoZSBDREtcbiAqXG4gKiBDb25zdHJ1Y3RzIHRoYXQgbmVlZCBzZWNyZXRzIHdpbGwgZGVjbGFyZSBwYXJhbWV0ZXJzIG9mIHR5cGUgYFNlY3JldFZhbHVlYC5cbiAqXG4gKiBUaGUgYWN0dWFsIHZhbHVlcyBvZiB0aGVzZSBzZWNyZXRzIHNob3VsZCBub3QgYmUgY29tbWl0dGVkIHRvIHlvdXJcbiAqIHJlcG9zaXRvcnksIG9yIGV2ZW4gZW5kIHVwIGluIHRoZSBzeW50aGVzaXplZCBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS4gSW5zdGVhZCwgeW91IHNob3VsZFxuICogc3RvcmUgdGhlbSBpbiBhbiBleHRlcm5hbCBzeXN0ZW0gbGlrZSBBV1MgU2VjcmV0cyBNYW5hZ2VyIG9yIFNTTSBQYXJhbWV0ZXJcbiAqIFN0b3JlLCBhbmQgeW91IGNhbiByZWZlcmVuY2UgdGhlbSBieSBjYWxsaW5nIGBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcigpYCBvclxuICogYFNlY3JldFZhbHVlLnNzbVNlY3VyZSgpYC5cbiAqXG4gKiBZb3UgY2FuIHVzZSBgU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KClgIHRvIGNvbnN0cnVjdCBhIGBTZWNyZXRWYWx1ZWAgZnJvbSBhXG4gKiBsaXRlcmFsIHN0cmluZywgYnV0IGRvaW5nIHNvIGlzIGhpZ2hseSBkaXNjb3VyYWdlZC5cbiAqXG4gKiBUbyBtYWtlIHN1cmUgc2VjcmV0IHZhbHVlcyBkb24ndCBhY2NpZGVudGFsbHkgZW5kIHVwIGluIHJlYWRhYmxlIHBhcnRzXG4gKiBvZiB5b3VyIGluZnJhc3RydWN0dXJlIGRlZmluaXRpb24gKHN1Y2ggYXMgdGhlIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICogb2YgYW4gQVdTIExhbWJkYSBGdW5jdGlvbiwgd2hlcmUgZXZlcnlvbmUgd2hvIGNhbiByZWFkIHRoZSBmdW5jdGlvblxuICogZGVmaW5pdGlvbiBoYXMgYWNjZXNzIHRvIHRoZSBzZWNyZXQpLCB1c2luZyBzZWNyZXQgdmFsdWVzIGRpcmVjdGx5IGlzIG5vdFxuICogYWxsb3dlZC4gWW91IG11c3QgcGFzcyB0aGVtIHRvIGNvbnN0cnVjdHMgdGhhdCBhY2NlcHQgYFNlY3JldFZhbHVlYFxuICogcHJvcGVydGllcywgd2hpY2ggYXJlIGd1YXJhbnRlZWQgdG8gdXNlIHRoZSB2YWx1ZSBvbmx5IGluIENsb3VkRm9ybWF0aW9uXG4gKiBwcm9wZXJ0aWVzIHRoYXQgYXJlIHdyaXRlLW9ubHkuXG4gKlxuICogSWYgeW91IGFyZSBzdXJlIHRoYXQgd2hhdCB5b3UgYXJlIGRvaW5nIGlzIHNhZmUsIHlvdSBjYW4gY2FsbFxuICogYHNlY3JldFZhbHVlLnVuc2FmZVVud3JhcCgpYCB0byBhY2Nlc3MgdGhlIHByb3RlY3RlZCBzdHJpbmcgb2YgdGhlIHNlY3JldFxuICogdmFsdWUuXG4gKlxuICogKElmIHlvdSBhcmUgd3JpdGluZyBzb21ldGhpbmcgbGlrZSBhbiBBV1MgTGFtYmRhIEZ1bmN0aW9uIGFuZCBuZWVkIHRvIGFjY2Vzc1xuICogYSBzZWNyZXQgaW5zaWRlIGl0LCBtYWtlIHRoZSBBUEkgY2FsbCB0byBgR2V0U2VjcmV0VmFsdWVgIGRpcmVjdGx5IGluc2lkZVxuICogeW91ciBMYW1iYSdzIGNvZGUsIGluc3RlYWQgb2YgdXNpbmcgZW52aXJvbm1lbnQgdmFyaWFibGVzLilcbiAqL1xuZXhwb3J0IGNsYXNzIFNlY3JldFZhbHVlIGV4dGVuZHMgSW50cmluc2ljIHtcbiAgLyoqXG4gICAqIFRlc3Qgd2hldGhlciBhbiBvYmplY3QgaXMgYSBTZWNyZXRWYWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc1NlY3JldFZhbHVlKHg6IGFueSk6IHggaXMgU2VjcmV0VmFsdWUge1xuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAmJiB4W1NFQ1JFVF9WQUxVRV9TWU1dO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIGxpdGVyYWwgc2VjcmV0IHZhbHVlIGZvciB1c2Ugd2l0aCBzZWNyZXQtYXdhcmUgY29uc3RydWN0c1xuICAgKlxuICAgKiBEbyBub3QgdXNlIHRoaXMgbWV0aG9kIGZvciBhbnkgc2VjcmV0cyB0aGF0IHlvdSBjYXJlIGFib3V0ISBUaGUgdmFsdWVcbiAgICogd2lsbCBiZSB2aXNpYmxlIHRvIGFueW9uZSB3aG8gaGFzIGFjY2VzcyB0byB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVcbiAgICogKHZpYSB0aGUgQVdTIENvbnNvbGUsIFNES3MsIG9yIENMSSkuXG4gICAqXG4gICAqIFRoZSBvbmx5IHJlYXNvbmFibGUgdXNlIGNhc2UgZm9yIHVzaW5nIHRoaXMgbWV0aG9kIGlzIHdoZW4geW91IGFyZSB0ZXN0aW5nLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHVuc2FmZVBsYWluVGV4dCgpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwbGFpblRleHQoc2VjcmV0OiBzdHJpbmcpOiBTZWNyZXRWYWx1ZSB7XG4gICAgcmV0dXJuIG5ldyBTZWNyZXRWYWx1ZShzZWNyZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIGxpdGVyYWwgc2VjcmV0IHZhbHVlIGZvciB1c2Ugd2l0aCBzZWNyZXQtYXdhcmUgY29uc3RydWN0c1xuICAgKlxuICAgKiBEbyBub3QgdXNlIHRoaXMgbWV0aG9kIGZvciBhbnkgc2VjcmV0cyB0aGF0IHlvdSBjYXJlIGFib3V0ISBUaGUgdmFsdWVcbiAgICogd2lsbCBiZSB2aXNpYmxlIHRvIGFueW9uZSB3aG8gaGFzIGFjY2VzcyB0byB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVcbiAgICogKHZpYSB0aGUgQVdTIENvbnNvbGUsIFNES3MsIG9yIENMSSkuXG4gICAqXG4gICAqIFRoZSBwcmltYXJ5IHVzZSBjYXNlIGZvciB1c2luZyB0aGlzIG1ldGhvZCBpcyB3aGVuIHlvdSBhcmUgdGVzdGluZy5cbiAgICpcbiAgICogVGhlIG90aGVyIHVzZSBjYXNlIHdoZXJlIHRoaXMgaXMgYXBwcm9wcmlhdGUgaXMgd2hlbiBjb25zdHJ1Y3RpbmcgYSBKU09OIHNlY3JldC5cbiAgICogRm9yIGV4YW1wbGUsIGEgSlNPTiBzZWNyZXQgbWlnaHQgaGF2ZSBtdWx0aXBsZSBmaWVsZHMgd2hlcmUgb25seSBzb21lIGFyZSBhY3R1YWxcbiAgICogc2VjcmV0IHZhbHVlcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZGVjbGFyZSBjb25zdCBzZWNyZXQ6IFNlY3JldFZhbHVlO1xuICAgKiBjb25zdCBqc29uU2VjcmV0ID0ge1xuICAgKiAgIHVzZXJuYW1lOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ215VXNlcm5hbWUnKSxcbiAgICogICBwYXNzd29yZDogc2VjcmV0LFxuICAgKiB9O1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyB1bnNhZmVQbGFpblRleHQoc2VjcmV0OiBzdHJpbmcpOiBTZWNyZXRWYWx1ZSB7XG4gICAgcmV0dXJuIG5ldyBTZWNyZXRWYWx1ZShzZWNyZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgU2VjcmV0VmFsdWVgIHdpdGggYSB2YWx1ZSB3aGljaCBpcyBkeW5hbWljYWxseSBsb2FkZWQgZnJvbSBBV1MgU2VjcmV0cyBNYW5hZ2VyLlxuICAgKlxuICAgKiBJZiB5b3Ugcm90YXRlIHRoZSB2YWx1ZSBpbiB0aGUgU2VjcmV0LCB5b3UgbXVzdCBhbHNvIGNoYW5nZSBhdCBsZWFzdCBvbmUgcHJvcGVydHlcbiAgICogb24gdGhlIHJlc291cmNlIHdoZXJlIHlvdSBhcmUgdXNpbmcgdGhlIHNlY3JldCwgdG8gZm9yY2UgQ2xvdWRGb3JtYXRpb24gdG8gcmUtcmVhZCB0aGUgc2VjcmV0LlxuICAgKlxuICAgKiBAcGFyYW0gc2VjcmV0SWQgVGhlIElEIG9yIEFSTiBvZiB0aGUgc2VjcmV0XG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2VjcmV0c01hbmFnZXIoc2VjcmV0SWQ6IHN0cmluZywgb3B0aW9uczogU2VjcmV0c01hbmFnZXJTZWNyZXRPcHRpb25zID0ge30pOiBTZWNyZXRWYWx1ZSB7XG4gICAgaWYgKCFzZWNyZXRJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZWNyZXRJZCBjYW5ub3QgYmUgZW1wdHknKTtcbiAgICB9XG5cbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChzZWNyZXRJZCkgJiYgIXNlY3JldElkLnN0YXJ0c1dpdGgoJ2FybjonKSAmJiBzZWNyZXRJZC5pbmNsdWRlcygnOicpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlY3JldCBpZCBcIiR7c2VjcmV0SWR9XCIgaXMgbm90IGFuIEFSTiBidXQgY29udGFpbnMgXCI6XCJgKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy52ZXJzaW9uU3RhZ2UgJiYgb3B0aW9ucy52ZXJzaW9uSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdmVyc2lvblN0YWdlOiAnJHtvcHRpb25zLnZlcnNpb25TdGFnZX0nIGFuZCB2ZXJzaW9uSWQ6ICcke29wdGlvbnMudmVyc2lvbklkfScgd2VyZSBib3RoIHByb3ZpZGVkIGJ1dCBvbmx5IG9uZSBpcyBhbGxvd2VkYCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSBbXG4gICAgICBzZWNyZXRJZCxcbiAgICAgICdTZWNyZXRTdHJpbmcnLFxuICAgICAgb3B0aW9ucy5qc29uRmllbGQgfHwgJycsXG4gICAgICBvcHRpb25zLnZlcnNpb25TdGFnZSB8fCAnJyxcbiAgICAgIG9wdGlvbnMudmVyc2lvbklkIHx8ICcnLFxuICAgIF07XG5cbiAgICBjb25zdCBkeXJlZiA9IG5ldyBDZm5EeW5hbWljUmVmZXJlbmNlKENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUiwgcGFydHMuam9pbignOicpKTtcbiAgICByZXR1cm4gdGhpcy5jZm5EeW5hbWljUmVmZXJlbmNlKGR5cmVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgYSBzZWNyZXQgdmFsdWUgc3RvcmVkIGZyb20gYSBTeXN0ZW1zIE1hbmFnZXIgKFNTTSkgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBUaGlzIHNlY3JldCBzb3VyY2UgaW4gb25seSBzdXBwb3J0ZWQgaW4gYSBsaW1pdGVkIHNldCBvZiByZXNvdXJjZXMgYW5kXG4gICAqIHByb3BlcnRpZXMuIFtDbGljayBoZXJlIGZvciB0aGUgbGlzdCBvZiBzdXBwb3J0ZWRcbiAgICogcHJvcGVydGllc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvZHluYW1pYy1yZWZlcmVuY2VzLmh0bWwjdGVtcGxhdGUtcGFyYW1ldGVycy1keW5hbWljLXBhdHRlcm5zLXJlc291cmNlcykuXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJOYW1lIFRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgaW4gdGhlIFN5c3RlbXMgTWFuYWdlclxuICAgKiBQYXJhbWV0ZXIgU3RvcmUuIFRoZSBwYXJhbWV0ZXIgbmFtZSBpcyBjYXNlLXNlbnNpdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIHZlcnNpb24gQW4gaW50ZWdlciB0aGF0IHNwZWNpZmllcyB0aGUgdmVyc2lvbiBvZiB0aGUgcGFyYW1ldGVyIHRvXG4gICAqIHVzZS4gSWYgeW91IGRvbid0IHNwZWNpZnkgdGhlIGV4YWN0IHZlcnNpb24sIEFXUyBDbG91ZEZvcm1hdGlvbiB1c2VzIHRoZVxuICAgKiBsYXRlc3QgdmVyc2lvbiBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzc21TZWN1cmUocGFyYW1ldGVyTmFtZTogc3RyaW5nLCB2ZXJzaW9uPzogc3RyaW5nKTogU2VjcmV0VmFsdWUge1xuICAgIHJldHVybiB0aGlzLmNmbkR5bmFtaWNSZWZlcmVuY2UoXG4gICAgICBuZXcgQ2ZuRHluYW1pY1JlZmVyZW5jZShDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZS5TU01fU0VDVVJFLFxuICAgICAgICB2ZXJzaW9uID8gYCR7cGFyYW1ldGVyTmFtZX06JHt2ZXJzaW9ufWAgOiBwYXJhbWV0ZXJOYW1lKSk7XG4gIH1cblxuICAvKipcbiAgICogT2J0YWluIHRoZSBzZWNyZXQgdmFsdWUgdGhyb3VnaCBhIENsb3VkRm9ybWF0aW9uIGR5bmFtaWMgcmVmZXJlbmNlLlxuICAgKlxuICAgKiBJZiBwb3NzaWJsZSwgdXNlIGBTZWNyZXRWYWx1ZS5zc21TZWN1cmVgIG9yIGBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcmAgZGlyZWN0bHkuXG4gICAqXG4gICAqIEBwYXJhbSByZWYgVGhlIGR5bmFtaWMgcmVmZXJlbmNlIHRvIHVzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2ZuRHluYW1pY1JlZmVyZW5jZShyZWY6IENmbkR5bmFtaWNSZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gbmV3IFNlY3JldFZhbHVlKHJlZik7XG4gIH1cblxuICAvKipcbiAgICogT2J0YWluIHRoZSBzZWNyZXQgdmFsdWUgdGhyb3VnaCBhIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlci5cbiAgICpcbiAgICogR2VuZXJhbGx5LCB0aGlzIGlzIG5vdCBhIHJlY29tbWVuZGVkIGFwcHJvYWNoLiBBV1MgU2VjcmV0cyBNYW5hZ2VyIGlzIHRoZVxuICAgKiByZWNvbW1lbmRlZCB3YXkgdG8gcmVmZXJlbmNlIHNlY3JldHMuXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbSBUaGUgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVyIHRvIHVzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2ZuUGFyYW1ldGVyKHBhcmFtOiBDZm5QYXJhbWV0ZXIpIHtcbiAgICBpZiAoIXBhcmFtLm5vRWNobykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDbG91ZEZvcm1hdGlvbiBwYXJhbWV0ZXIgbXVzdCBiZSBjb25maWd1cmVkIHdpdGggXCJOb0VjaG9cIicpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU2VjcmV0VmFsdWUocGFyYW0udmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBhIHJlc291cmNlJ3Mgb3V0cHV0IGFzIHNlY3JldCB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZXNvdXJjZUF0dHJpYnV0ZShhdHRyOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNvbHZlZCA9IFRva2VuaXphdGlvbi5yZXZlcnNlQ29tcGxldGVTdHJpbmcoYXR0cik7XG4gICAgaWYgKCFyZXNvbHZlZCB8fCAhQ2ZuUmVmZXJlbmNlLmlzQ2ZuUmVmZXJlbmNlKHJlc29sdmVkKSB8fCAhQ2ZuUmVzb3VyY2UuaXNDZm5SZXNvdXJjZShyZXNvbHZlZC50YXJnZXQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlY3JldFZhbHVlLnJlc291cmNlQXR0cmlidXRlKCkgbXVzdCBiZSB1c2VkIHdpdGggYSByZXNvdXJjZSBhdHRyaWJ1dGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNlY3JldFZhbHVlKGF0dHIpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSByYXdWYWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBTZWNyZXRWYWx1ZSAoZG8gbm90IHVzZSEpXG4gICAqXG4gICAqIERvIG5vdCB1c2UgdGhlIGNvbnN0cnVjdG9yIGRpcmVjdGx5OiB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IGZ1bmN0aW9ucyBvbiB0aGUgY2xhc3NcbiAgICogaW5zdGVhZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZFZhbHVlOiBhbnksIG9wdGlvbnM/OiBJbnRyaW5zaWNQcm9wcykge1xuICAgIHN1cGVyKHByb3RlY3RlZFZhbHVlLCBvcHRpb25zKTtcbiAgICB0aGlzLnJhd1ZhbHVlID0gcHJvdGVjdGVkVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZSB1c2FnZSBwcm90ZWN0aW9uIG9uIHRoaXMgc2VjcmV0XG4gICAqXG4gICAqIENhbGwgdGhpcyB0byBpbmRpY2F0ZSB0aGF0IHlvdSB3YW50IHRvIHVzZSB0aGUgc2VjcmV0IHZhbHVlIGhlbGQgYnkgdGhpc1xuICAgKiBvYmplY3QgaW4gYW4gdW5jaGVja2VkIHdheS4gSWYgeW91IGRvbid0IGNhbGwgdGhpcyBtZXRob2QsIHVzaW5nIHRoZSBzZWNyZXRcbiAgICogdmFsdWUgZGlyZWN0bHkgaW4gYSBzdHJpbmcgY29udGV4dCBvciBhcyBhIHByb3BlcnR5IHZhbHVlIHNvbWV3aGVyZSB3aWxsXG4gICAqIHByb2R1Y2UgYW4gZXJyb3IuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGhhcyAndW5zYWZlJyBpbiB0aGUgbmFtZSBvbiBwdXJwb3NlISBNYWtlIHN1cmUgdGhhdCB0aGVcbiAgICogY29uc3RydWN0IHByb3BlcnR5IHlvdSBhcmUgdXNpbmcgdGhlIHJldHVybmVkIHZhbHVlIGluIGlzIGRvZXMgbm90IGVuZCB1cFxuICAgKiBpbiBhIHBsYWNlIGluIHlvdXIgQVdTIGluZnJhc3RydWN0dXJlIHdoZXJlIGl0IGNvdWxkIGJlIHJlYWQgYnkgYW55b25lXG4gICAqIHVuZXhwZWN0ZWQuXG4gICAqXG4gICAqIFdoZW4gaW4gZG91YnQsIGRvbid0IGNhbGwgdGhpcyBtZXRob2QgYW5kIG9ubHkgcGFzcyB0aGUgb2JqZWN0IHRvIGNvbnN0cnVjdHMgdGhhdFxuICAgKiBhY2NlcHQgYFNlY3JldFZhbHVlYCBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgcHVibGljIHVuc2FmZVVud3JhcCgpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcy5yYXdWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSB0aGUgc2VjcmV0XG4gICAqXG4gICAqIElmIHRoZSBmZWF0dXJlIGZsYWcgaXMgbm90IHNldCwgcmVzb2x2ZSBhcyBub3JtYWwuIE90aGVyd2lzZSwgdGhyb3cgYSBkZXNjcmlwdGl2ZVxuICAgKiBlcnJvciB0aGF0IHRoZSB1c2FnZSBndWFyZCBpcyBtaXNzaW5nLlxuICAgKi9cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgaWYgKEZlYXR1cmVGbGFncy5vZihjb250ZXh0LnNjb3BlKS5pc0VuYWJsZWQoQ0hFQ0tfU0VDUkVUX1VTQUdFKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgU3ludGhpbmcgYSBzZWNyZXQgdmFsdWUgdG8gJHtjb250ZXh0LmRvY3VtZW50UGF0aC5qb2luKCcvJyl9LiBVc2luZyBhIFNlY3JldFZhbHVlIGhlcmUgcmlza3MgZXhwb3NpbmcgeW91ciBzZWNyZXQuIE9ubHkgcGFzcyBTZWNyZXRWYWx1ZXMgdG8gY29uc3RydWN0cyB0aGF0IGFjY2VwdCBhIFNlY3JldFZhbHVlIHByb3BlcnR5LCBvciBjYWxsIEFXUyBTZWNyZXRzIE1hbmFnZXIgZGlyZWN0bHkgaW4geW91ciBydW50aW1lIGNvZGUuIENhbGwgJ3NlY3JldFZhbHVlLnVuc2FmZVVud3JhcCgpJyBpZiB5b3UgdW5kZXJzdGFuZCBhbmQgYWNjZXB0IHRoZSByaXNrcy5gLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLnJlc29sdmUoY29udGV4dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciByZWZlcmVuY2luZyBhIHNlY3JldCB2YWx1ZSBmcm9tIFNlY3JldHMgTWFuYWdlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWNyZXRzTWFuYWdlclNlY3JldE9wdGlvbnMge1xuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBzZWNyZXQgdmVyc2lvbiB0aGF0IHlvdSB3YW50IHRvIHJldHJpZXZlIGJ5IHRoZSBzdGFnaW5nIGxhYmVsIGF0dGFjaGVkIHRvIHRoZSB2ZXJzaW9uLlxuICAgKlxuICAgKiBDYW4gc3BlY2lmeSBhdCBtb3N0IG9uZSBvZiBgdmVyc2lvbklkYCBhbmQgYHZlcnNpb25TdGFnZWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IEFXU0NVUlJFTlRcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25TdGFnZT86IHN0cmluZztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgdmVyc2lvbiBvZiB0aGUgc2VjcmV0IHlvdSB3YW50IHRvIHVzZS5cbiAgICpcbiAgICogQ2FuIHNwZWNpZnkgYXQgbW9zdCBvbmUgb2YgYHZlcnNpb25JZGAgYW5kIGB2ZXJzaW9uU3RhZ2VgLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBV1NDVVJSRU5UXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBrZXkgb2YgYSBKU09OIGZpZWxkIHRvIHJldHJpZXZlLiBUaGlzIGNhbiBvbmx5IGJlIHVzZWQgaWYgdGhlIHNlY3JldFxuICAgKiBzdG9yZXMgYSBKU09OIG9iamVjdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSByZXR1cm5zIGFsbCB0aGUgY29udGVudCBzdG9yZWQgaW4gdGhlIFNlY3JldHMgTWFuYWdlciBzZWNyZXQuXG4gICAqL1xuICByZWFkb25seSBqc29uRmllbGQ/OiBzdHJpbmc7XG59XG5cbmNvbnN0IFNFQ1JFVF9WQUxVRV9TWU0gPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9jb3JlLlNlY3JldFZhbHVlJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZWNyZXRWYWx1ZS5wcm90b3R5cGUsIFNFQ1JFVF9WQUxVRV9TWU0sIHtcbiAgdmFsdWU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG59KTtcbiJdfQ==