"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractQualifierFromArn = exports.Version = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const function_1 = require("./function");
const function_base_1 = require("./function-base");
const lambda_generated_1 = require("./lambda.generated");
const util_1 = require("./util");
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
class Version extends function_base_1.QualifiedFunctionBase {
    constructor(scope, id, props) {
        super(scope, id);
        this.canCreatePermissions = true;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_VersionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Version);
            }
            throw error;
        }
        this.lambda = props.lambda;
        this.architecture = props.lambda.architecture;
        const version = new lambda_generated_1.CfnVersion(this, 'Resource', {
            codeSha256: props.codeSha256,
            description: props.description,
            functionName: props.lambda.functionName,
            provisionedConcurrencyConfig: this.determineProvisionedConcurrency(props),
        });
        if (props.removalPolicy) {
            version.applyRemovalPolicy(props.removalPolicy, {
                default: core_1.RemovalPolicy.DESTROY,
            });
        }
        this.version = version.attrVersion;
        this.functionArn = version.ref;
        this.functionName = `${this.lambda.functionName}:${this.version}`;
        this.qualifier = version.attrVersion;
        if (props.onFailure || props.onSuccess || props.maxEventAge || props.retryAttempts !== undefined) {
            this.configureAsyncInvoke({
                onFailure: props.onFailure,
                onSuccess: props.onSuccess,
                maxEventAge: props.maxEventAge,
                retryAttempts: props.retryAttempts,
            });
        }
    }
    /**
     * Construct a Version object from a Version ARN.
     *
     * @param scope The cdk scope creating this resource
     * @param id The cdk id of this resource
     * @param versionArn The version ARN to create this version from
     */
    static fromVersionArn(scope, id, versionArn) {
        const version = extractQualifierFromArn(versionArn);
        const lambda = function_1.Function.fromFunctionArn(scope, `${id}Function`, versionArn);
        class Import extends function_base_1.QualifiedFunctionBase {
            constructor() {
                super(...arguments);
                this.version = version;
                this.lambda = lambda;
                this.functionName = `${lambda.functionName}:${version}`;
                this.functionArn = versionArn;
                this.grantPrincipal = lambda.grantPrincipal;
                this.role = lambda.role;
                this.architecture = lambda.architecture;
                this.qualifier = version;
                this.canCreatePermissions = this._isStackAccount();
            }
            addAlias(name, opts = {}) {
                return util_1.addAlias(this, this, name, opts);
            }
            get edgeArn() {
                if (version === '$LATEST') {
                    throw new Error('$LATEST function version cannot be used for Lambda@Edge');
                }
                return this.functionArn;
            }
        }
        return new Import(scope, id);
    }
    static fromVersionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_VersionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromVersionAttributes);
            }
            throw error;
        }
        class Import extends function_base_1.QualifiedFunctionBase {
            constructor() {
                super(...arguments);
                this.version = attrs.version;
                this.lambda = attrs.lambda;
                this.functionName = `${attrs.lambda.functionName}:${attrs.version}`;
                this.functionArn = `${attrs.lambda.functionArn}:${attrs.version}`;
                this.grantPrincipal = attrs.lambda.grantPrincipal;
                this.role = attrs.lambda.role;
                this.architecture = attrs.lambda.architecture;
                this.qualifier = attrs.version;
                this.canCreatePermissions = this._isStackAccount();
            }
            addAlias(name, opts = {}) {
                return util_1.addAlias(this, this, name, opts);
            }
            get edgeArn() {
                if (attrs.version === '$LATEST') {
                    throw new Error('$LATEST function version cannot be used for Lambda@Edge');
                }
                return this.functionArn;
            }
        }
        return new Import(scope, id);
    }
    get grantPrincipal() {
        return this.lambda.grantPrincipal;
    }
    get role() {
        return this.lambda.role;
    }
    metric(metricName, props = {}) {
        // Metrics on Aliases need the "bare" function name, and the alias' ARN, this differs from the base behavior.
        return super.metric(metricName, {
            dimensions: {
                FunctionName: this.lambda.functionName,
                // construct the ARN from the underlying lambda so that alarms on an alias
                // don't cause a circular dependency with CodeDeploy
                // see: https://github.com/aws/aws-cdk/issues/2231
                Resource: `${this.lambda.functionArn}:${this.version}`,
            },
            ...props,
        });
    }
    /**
     * Defines an alias for this version.
     * @param aliasName The name of the alias (e.g. "live")
     * @param options Alias options
     * @deprecated Calling `addAlias` on a `Version` object will cause the Alias to be replaced on every function update. Call `function.addAlias()` or `new Alias()` instead.
     */
    addAlias(aliasName, options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-lambda.Version#addAlias", "Calling `addAlias` on a `Version` object will cause the Alias to be replaced on every function update. Call `function.addAlias()` or `new Alias()` instead.");
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AliasOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAlias);
            }
            throw error;
        }
        return util_1.addAlias(this, this, aliasName, options);
    }
    get edgeArn() {
        // Validate first that this version can be used for Lambda@Edge
        if (this.version === '$LATEST') {
            throw new Error('$LATEST function version cannot be used for Lambda@Edge');
        }
        // Check compatibility at synthesis. It could be that the version was associated
        // with a CloudFront distribution first and made incompatible afterwards.
        return core_1.Lazy.string({
            produce: () => {
                // Validate that the underlying function can be used for Lambda@Edge
                if (this.lambda instanceof function_1.Function) {
                    this.lambda._checkEdgeCompatibility();
                }
                return this.functionArn;
            },
        });
    }
    /**
     * Validate that the provisionedConcurrentExecutions makes sense
     *
     * Member must have value greater than or equal to 1
     */
    determineProvisionedConcurrency(props) {
        if (!props.provisionedConcurrentExecutions) {
            return undefined;
        }
        if (props.provisionedConcurrentExecutions <= 0) {
            throw new Error('provisionedConcurrentExecutions must have value greater than or equal to 1');
        }
        return { provisionedConcurrentExecutions: props.provisionedConcurrentExecutions };
    }
}
exports.Version = Version;
_a = JSII_RTTI_SYMBOL_1;
Version[_a] = { fqn: "@aws-cdk/aws-lambda.Version", version: "0.0.0" };
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
function extractQualifierFromArn(arn) {
    return core_1.Fn.select(7, core_1.Fn.split(':', arn));
}
exports.extractQualifierFromArn = extractQualifierFromArn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLXZlcnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEtdmVyc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBd0Q7QUFLeEQseUNBQXNDO0FBQ3RDLG1EQUFtRTtBQUNuRSx5REFBZ0Q7QUFDaEQsaUNBQWtDO0FBdUZsQzs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE1BQWEsT0FBUSxTQUFRLHFDQUFxQjtJQTJFaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUMzRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSEEseUJBQW9CLEdBQUcsSUFBSSxDQUFDOzs7Ozs7K0NBekVwQyxPQUFPOzs7O1FBOEVoQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUU5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLDZCQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMvQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLFlBQVksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVk7WUFDdkMsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLCtCQUErQixDQUFDLEtBQUssQ0FBQztTQUMxRSxDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDdkIsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7Z0JBQzlDLE9BQU8sRUFBRSxvQkFBYSxDQUFDLE9BQU87YUFDL0IsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFP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b3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgRm4sIExhenksIFJlbW92YWxQb2xpY3kgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWxpYXMsIEFsaWFzT3B0aW9ucyB9IGZyb20gJy4vYWxpYXMnO1xuaW1wb3J0IHsgQXJjaGl0ZWN0dXJlIH0gZnJvbSAnLi9hcmNoaXRlY3R1cmUnO1xuaW1wb3J0IHsgRXZlbnRJbnZva2VDb25maWdPcHRpb25zIH0gZnJvbSAnLi9ldmVudC1pbnZva2UtY29uZmlnJztcbmltcG9ydCB7IEZ1bmN0aW9uIH0gZnJvbSAnLi9mdW5jdGlvbic7XG5pbXBvcnQgeyBJRnVuY3Rpb24sIFF1YWxpZmllZEZ1bmN0aW9uQmFzZSB9IGZyb20gJy4vZnVuY3Rpb24tYmFzZSc7XG5pbXBvcnQgeyBDZm5WZXJzaW9uIH0gZnJvbSAnLi9sYW1iZGEuZ2VuZXJhdGVkJztcbmltcG9ydCB7IGFkZEFsaWFzIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBJVmVyc2lvbiBleHRlbmRzIElGdW5jdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgbW9zdCByZWNlbnRseSBkZXBsb3llZCB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb24uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgQVdTIExhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGxhbWJkYTogSUZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSB2ZXJzaW9uIGZvciBMYW1iZGFARWRnZS5cbiAgICovXG4gIHJlYWRvbmx5IGVkZ2VBcm46IHN0cmluZztcblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBhbGlhcyBmb3IgdGhpcyB2ZXJzaW9uLlxuICAgKiBAcGFyYW0gYWxpYXNOYW1lIFRoZSBuYW1lIG9mIHRoZSBhbGlhc1xuICAgKiBAcGFyYW0gb3B0aW9ucyBBbGlhcyBvcHRpb25zXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIENhbGxpbmcgYGFkZEFsaWFzYCBvbiBhIGBWZXJzaW9uYCBvYmplY3Qgd2lsbCBjYXVzZSB0aGUgQWxpYXMgdG8gYmUgcmVwbGFjZWQgb24gZXZlcnkgZnVuY3Rpb24gdXBkYXRlLiBDYWxsIGBmdW5jdGlvbi5hZGRBbGlhcygpYCBvciBgbmV3IEFsaWFzKClgIGluc3RlYWQuXG4gICAqL1xuICBhZGRBbGlhcyhhbGlhc05hbWU6IHN0cmluZywgb3B0aW9ucz86IEFsaWFzT3B0aW9ucyk6IEFsaWFzO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGBsYW1iZGEuVmVyc2lvbmBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWZXJzaW9uT3B0aW9ucyBleHRlbmRzIEV2ZW50SW52b2tlQ29uZmlnT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTSEEyNTYgb2YgdGhlIHZlcnNpb24gb2YgdGhlIExhbWJkYSBzb3VyY2UgY29kZVxuICAgKlxuICAgKiBTcGVjaWZ5IHRvIHZhbGlkYXRlIHRoYXQgeW91J3JlIGRlcGxveWluZyB0aGUgcmlnaHQgdmVyc2lvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gdmFsaWRhdGlvbiBpcyBwZXJmb3JtZWRcbiAgICovXG4gIHJlYWRvbmx5IGNvZGVTaGEyNTY/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlc2NyaXB0aW9uIG9mIHRoZSB2ZXJzaW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IERlc2NyaXB0aW9uIG9mIHRoZSBMYW1iZGFcbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgYSBwcm92aXNpb25lZCBjb25jdXJyZW5jeSBjb25maWd1cmF0aW9uIGZvciBhIGZ1bmN0aW9uJ3MgdmVyc2lvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gcHJvdmlzaW9uZWQgY29uY3VycmVuY3lcbiAgICovXG4gIHJlYWRvbmx5IHByb3Zpc2lvbmVkQ29uY3VycmVudEV4ZWN1dGlvbnM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmV0YWluIG9sZCB2ZXJzaW9ucyBvZiB0aGlzIGZ1bmN0aW9uIHdoZW4gYSBuZXcgdmVyc2lvbiBpc1xuICAgKiBjcmVhdGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBSZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBSZW1vdmFsUG9saWN5O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgbmV3IExhbWJkYSB2ZXJzaW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmVyc2lvblByb3BzIGV4dGVuZHMgVmVyc2lvbk9wdGlvbnMge1xuICAvKipcbiAgICogRnVuY3Rpb24gdG8gZ2V0IHRoZSB2YWx1ZSBvZlxuICAgKi9cbiAgcmVhZG9ubHkgbGFtYmRhOiBJRnVuY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyc2lvbkF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIHZlcnNpb24uXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsYW1iZGEgZnVuY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBsYW1iZGE6IElGdW5jdGlvbjtcbn1cblxuLyoqXG4gKiBUYWcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgYSBGdW5jdGlvbiB3aXRoIGEgVmVyc2lvbiBudW1iZXJcbiAqXG4gKiBBdm9pZCB1c2luZyB0aGlzIHJlc291cmNlIGRpcmVjdGx5LiBJZiB5b3UgbmVlZCBhIFZlcnNpb24gb2JqZWN0LCB1c2VcbiAqIGBmdW5jdGlvbi5jdXJyZW50VmVyc2lvbmAgaW5zdGVhZC4gVGhhdCB3aWxsIGFkZCBhIFZlcnNpb24gb2JqZWN0IHRvIHlvdXJcbiAqIHRlbXBsYXRlLCBhbmQgbWFrZSBzdXJlIHRoZSBWZXJzaW9uIGlzIGludmFsaWRhdGVkIHdoZW5ldmVyIHRoZSBGdW5jdGlvblxuICogb2JqZWN0IGNoYW5nZXMuIElmIHlvdSB1c2UgdGhlIGBWZXJzaW9uYCByZXNvdXJjZSBkaXJlY3RseSwgeW91IGFyZVxuICogcmVzcG9uc2libGUgZm9yIG1ha2luZyBzdXJlIGl0IGlzIGludmFsaWRhdGVkIChieSBjaGFuZ2luZyBpdHNcbiAqIGxvZ2ljYWwgSUQpIHdoZW5ldmVyIG5lY2Vzc2FyeS5cbiAqXG4gKiBWZXJzaW9uIHJlc291cmNlcyBjYW4gdGhlbiBiZSB1c2VkIGluIGBBbGlhc2AgcmVzb3VyY2VzIHRvIHJlZmVyIHRvIGFcbiAqIHBhcnRpY3VsYXIgZGVwbG95bWVudCBvZiBhIExhbWJkYS5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byBlbnN1cmUgdGhhdCB5b3UncmUgYXNzb2NpYXRpbmcgdGhlIHJpZ2h0IHZlcnNpb24gd2l0aFxuICogdGhlIHJpZ2h0IGRlcGxveW1lbnQsIHNwZWNpZnkgdGhlIGBjb2RlU2hhMjU2YCBwcm9wZXJ0eSB3aGlsZVxuICogY3JlYXRpbmcgdGhlIGBWZXJzaW9uLlxuICovXG5leHBvcnQgY2xhc3MgVmVyc2lvbiBleHRlbmRzIFF1YWxpZmllZEZ1bmN0aW9uQmFzZSBpbXBsZW1lbnRzIElWZXJzaW9uIHtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgVmVyc2lvbiBvYmplY3QgZnJvbSBhIFZlcnNpb24gQVJOLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIGNkayBzY29wZSBjcmVhdGluZyB0aGlzIHJlc291cmNlXG4gICAqIEBwYXJhbSBpZCBUaGUgY2RrIGlkIG9mIHRoaXMgcmVzb3VyY2VcbiAgICogQHBhcmFtIHZlcnNpb25Bcm4gVGhlIHZlcnNpb24gQVJOIHRvIGNyZWF0ZSB0aGlzIHZlcnNpb24gZnJvbVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVmVyc2lvbkFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCB2ZXJzaW9uQXJuOiBzdHJpbmcpOiBJVmVyc2lvbiB7XG4gICAgY29uc3QgdmVyc2lvbiA9IGV4dHJhY3RRdWFsaWZpZXJGcm9tQXJuKHZlcnNpb25Bcm4pO1xuICAgIGNvbnN0IGxhbWJkYSA9IEZ1bmN0aW9uLmZyb21GdW5jdGlvbkFybihzY29wZSwgYCR7aWR9RnVuY3Rpb25gLCB2ZXJzaW9uQXJuKTtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFF1YWxpZmllZEZ1bmN0aW9uQmFzZSBpbXBsZW1lbnRzIElWZXJzaW9uIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBsYW1iZGEgPSBsYW1iZGE7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lID0gYCR7bGFtYmRhLmZ1bmN0aW9uTmFtZX06JHt2ZXJzaW9ufWA7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25Bcm4gPSB2ZXJzaW9uQXJuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsID0gbGFtYmRhLmdyYW50UHJpbmNpcGFsO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJvbGUgPSBsYW1iZGEucm9sZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhcmNoaXRlY3R1cmUgPSBsYW1iZGEuYXJjaGl0ZWN0dXJlO1xuXG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgcXVhbGlmaWVyID0gdmVyc2lvbjtcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBjYW5DcmVhdGVQZXJtaXNzaW9ucyA9IHRoaXMuX2lzU3RhY2tBY2NvdW50KCk7XG5cbiAgICAgIHB1YmxpYyBhZGRBbGlhcyhuYW1lOiBzdHJpbmcsIG9wdHM6IEFsaWFzT3B0aW9ucyA9IHt9KTogQWxpYXMge1xuICAgICAgICByZXR1cm4gYWRkQWxpYXModGhpcywgdGhpcywgbmFtZSwgb3B0cyk7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyBnZXQgZWRnZUFybigpOiBzdHJpbmcge1xuICAgICAgICBpZiAodmVyc2lvbiA9PT0gJyRMQVRFU1QnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCckTEFURVNUIGZ1bmN0aW9uIHZlcnNpb24gY2Fubm90IGJlIHVzZWQgZm9yIExhbWJkYUBFZGdlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZnVuY3Rpb25Bcm47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZyb21WZXJzaW9uQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogVmVyc2lvbkF0dHJpYnV0ZXMpOiBJVmVyc2lvbiB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUXVhbGlmaWVkRnVuY3Rpb25CYXNlIGltcGxlbWVudHMgSVZlcnNpb24ge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHZlcnNpb24gPSBhdHRycy52ZXJzaW9uO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGxhbWJkYSA9IGF0dHJzLmxhbWJkYTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBmdW5jdGlvbk5hbWUgPSBgJHthdHRycy5sYW1iZGEuZnVuY3Rpb25OYW1lfToke2F0dHJzLnZlcnNpb259YDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBmdW5jdGlvbkFybiA9IGAke2F0dHJzLmxhbWJkYS5mdW5jdGlvbkFybn06JHthdHRycy52ZXJzaW9ufWA7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWwgPSBhdHRycy5sYW1iZGEuZ3JhbnRQcmluY2lwYWw7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcm9sZSA9IGF0dHJzLmxhbWJkYS5yb2xlO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGFyY2hpdGVjdHVyZSA9IGF0dHJzLmxhbWJkYS5hcmNoaXRlY3R1cmU7XG5cbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBxdWFsaWZpZXIgPSBhdHRycy52ZXJzaW9uO1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNhbkNyZWF0ZVBlcm1pc3Npb25zID0gdGhpcy5faXNTdGFja0FjY291bnQoKTtcblxuICAgICAgcHVibGljIGFkZEFsaWFzKG5hbWU6IHN0cmluZywgb3B0czogQWxpYXNPcHRpb25zID0ge30pOiBBbGlhcyB7XG4gICAgICAgIHJldHVybiBhZGRBbGlhcyh0aGlzLCB0aGlzLCBuYW1lLCBvcHRzKTtcbiAgICAgIH1cblxuICAgICAgcHVibGljIGdldCBlZGdlQXJuKCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChhdHRycy52ZXJzaW9uID09PSAnJExBVEVTVCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJyRMQVRFU1QgZnVuY3Rpb24gdmVyc2lvbiBjYW5ub3QgYmUgdXNlZCBmb3IgTGFtYmRhQEVkZ2UnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5mdW5jdGlvbkFybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBsYW1iZGE6IElGdW5jdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBmdW5jdGlvbk5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGFyY2hpdGVjdHVyZTogQXJjaGl0ZWN0dXJlO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBxdWFsaWZpZXI6IHN0cmluZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGNhbkNyZWF0ZVBlcm1pc3Npb25zID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVmVyc2lvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMubGFtYmRhID0gcHJvcHMubGFtYmRhO1xuICAgIHRoaXMuYXJjaGl0ZWN0dXJlID0gcHJvcHMubGFtYmRhLmFyY2hpdGVjdHVyZTtcblxuICAgIGNvbnN0IHZlcnNpb24gPSBuZXcgQ2ZuVmVyc2lvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBjb2RlU2hhMjU2OiBwcm9wcy5jb2RlU2hhMjU2LFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgZnVuY3Rpb25OYW1lOiBwcm9wcy5sYW1iZGEuZnVuY3Rpb25OYW1lLFxuICAgICAgcHJvdmlzaW9uZWRDb25jdXJyZW5jeUNvbmZpZzogdGhpcy5kZXRlcm1pbmVQcm92aXNpb25lZENvbmN1cnJlbmN5KHByb3BzKSxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5yZW1vdmFsUG9saWN5KSB7XG4gICAgICB2ZXJzaW9uLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5LCB7XG4gICAgICAgIGRlZmF1bHQ6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb24uYXR0clZlcnNpb247XG4gICAgdGhpcy5mdW5jdGlvbkFybiA9IHZlcnNpb24ucmVmO1xuICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gYCR7dGhpcy5sYW1iZGEuZnVuY3Rpb25OYW1lfToke3RoaXMudmVyc2lvbn1gO1xuICAgIHRoaXMucXVhbGlmaWVyID0gdmVyc2lvbi5hdHRyVmVyc2lvbjtcblxuICAgIGlmIChwcm9wcy5vbkZhaWx1cmUgfHwgcHJvcHMub25TdWNjZXNzIHx8IHByb3BzLm1heEV2ZW50QWdlIHx8IHByb3BzLnJldHJ5QXR0ZW1wdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jb25maWd1cmVBc3luY0ludm9rZSh7XG4gICAgICAgIG9uRmFpbHVyZTogcHJvcHMub25GYWlsdXJlLFxuICAgICAgICBvblN1Y2Nlc3M6IHByb3BzLm9uU3VjY2VzcyxcbiAgICAgICAgbWF4RXZlbnRBZ2U6IHByb3BzLm1heEV2ZW50QWdlLFxuICAgICAgICByZXRyeUF0dGVtcHRzOiBwcm9wcy5yZXRyeUF0dGVtcHRzLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCBncmFudFByaW5jaXBhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEuZ3JhbnRQcmluY2lwYWw7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHJvbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubGFtYmRhLnJvbGU7XG4gIH1cblxuICBwdWJsaWMgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM6IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyA9IHt9KTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIC8vIE1ldHJpY3Mgb24gQWxpYXNlcyBuZWVkIHRoZSBcImJhcmVcIiBmdW5jdGlvbiBuYW1lLCBhbmQgdGhlIGFsaWFzJyBBUk4sIHRoaXMgZGlmZmVycyBmcm9tIHRoZSBiYXNlIGJlaGF2aW9yLlxuICAgIHJldHVybiBzdXBlci5tZXRyaWMobWV0cmljTmFtZSwge1xuICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICBGdW5jdGlvbk5hbWU6IHRoaXMubGFtYmRhLmZ1bmN0aW9uTmFtZSxcbiAgICAgICAgLy8gY29uc3RydWN0IHRoZSBBUk4gZnJvbSB0aGUgdW5kZXJseWluZyBsYW1iZGEgc28gdGhhdCBhbGFybXMgb24gYW4gYWxpYXNcbiAgICAgICAgLy8gZG9uJ3QgY2F1c2UgYSBjaXJjdWxhciBkZXBlbmRlbmN5IHdpdGggQ29kZURlcGxveVxuICAgICAgICAvLyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvMjIzMVxuICAgICAgICBSZXNvdXJjZTogYCR7dGhpcy5sYW1iZGEuZnVuY3Rpb25Bcm59OiR7dGhpcy52ZXJzaW9ufWAsXG4gICAgICB9LFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBhbGlhcyBmb3IgdGhpcyB2ZXJzaW9uLlxuICAgKiBAcGFyYW0gYWxpYXNOYW1lIFRoZSBuYW1lIG9mIHRoZSBhbGlhcyAoZS5nLiBcImxpdmVcIilcbiAgICogQHBhcmFtIG9wdGlvbnMgQWxpYXMgb3B0aW9uc1xuICAgKiBAZGVwcmVjYXRlZCBDYWxsaW5nIGBhZGRBbGlhc2Agb24gYSBgVmVyc2lvbmAgb2JqZWN0IHdpbGwgY2F1c2UgdGhlIEFsaWFzIHRvIGJlIHJlcGxhY2VkIG9uIGV2ZXJ5IGZ1bmN0aW9uIHVwZGF0ZS4gQ2FsbCBgZnVuY3Rpb24uYWRkQWxpYXMoKWAgb3IgYG5ldyBBbGlhcygpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIGFkZEFsaWFzKGFsaWFzTmFtZTogc3RyaW5nLCBvcHRpb25zOiBBbGlhc09wdGlvbnMgPSB7fSk6IEFsaWFzIHtcbiAgICByZXR1cm4gYWRkQWxpYXModGhpcywgdGhpcywgYWxpYXNOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZWRnZUFybigpOiBzdHJpbmcge1xuICAgIC8vIFZhbGlkYXRlIGZpcnN0IHRoYXQgdGhpcyB2ZXJzaW9uIGNhbiBiZSB1c2VkIGZvciBMYW1iZGFARWRnZVxuICAgIGlmICh0aGlzLnZlcnNpb24gPT09ICckTEFURVNUJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCckTEFURVNUIGZ1bmN0aW9uIHZlcnNpb24gY2Fubm90IGJlIHVzZWQgZm9yIExhbWJkYUBFZGdlJyk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgY29tcGF0aWJpbGl0eSBhdCBzeW50aGVzaXMuIEl0IGNvdWxkIGJlIHRoYXQgdGhlIHZlcnNpb24gd2FzIGFzc29jaWF0ZWRcbiAgICAvLyB3aXRoIGEgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gZmlyc3QgYW5kIG1hZGUgaW5jb21wYXRpYmxlIGFmdGVyd2FyZHMuXG4gICAgcmV0dXJuIExhenkuc3RyaW5nKHtcbiAgICAgIHByb2R1Y2U6ICgpID0+IHtcbiAgICAgICAgLy8gVmFsaWRhdGUgdGhhdCB0aGUgdW5kZXJseWluZyBmdW5jdGlvbiBjYW4gYmUgdXNlZCBmb3IgTGFtYmRhQEVkZ2VcbiAgICAgICAgaWYgKHRoaXMubGFtYmRhIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLmxhbWJkYS5fY2hlY2tFZGdlQ29tcGF0aWJpbGl0eSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZnVuY3Rpb25Bcm47XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoYXQgdGhlIHByb3Zpc2lvbmVkQ29uY3VycmVudEV4ZWN1dGlvbnMgbWFrZXMgc2Vuc2VcbiAgICpcbiAgICogTWVtYmVyIG11c3QgaGF2ZSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMVxuICAgKi9cbiAgcHJpdmF0ZSBkZXRlcm1pbmVQcm92aXNpb25lZENvbmN1cnJlbmN5KHByb3BzOiBWZXJzaW9uUHJvcHMpOiBDZm5WZXJzaW9uLlByb3Zpc2lvbmVkQ29uY3VycmVuY3lDb25maWd1cmF0aW9uUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghcHJvcHMucHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9ucykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMucHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9ucyA8PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb3Zpc2lvbmVkQ29uY3VycmVudEV4ZWN1dGlvbnMgbXVzdCBoYXZlIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAxJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9uczogcHJvcHMucHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9ucyB9O1xuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYW4gb3BhcXVlICh0b2tlbikgQVJOLCByZXR1cm5zIGEgQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvbiB0aGF0IGV4dHJhY3RzIHRoZVxuICogcXVhbGlmaWVyICg9IHZlcnNpb24gb3IgYWxpYXMpIGZyb20gdGhlIEFSTi5cbiAqXG4gKiBWZXJzaW9uIEFSTnMgbG9vayBsaWtlIHRoaXM6XG4gKlxuICogICBhcm46YXdzOmxhbWJkYTpyZWdpb246YWNjb3VudC1pZDpmdW5jdGlvbjpmdW5jdGlvbi1uYW1lOnF1YWxpZmllclxuICpcbiAqIC4ud2hpY2ggbWVhbnMgdGhhdCBpbiBvcmRlciB0byBleHRyYWN0IHRoZSBgcXVhbGlmaWVyYCBjb21wb25lbnQgZnJvbSB0aGUgQVJOLCB3ZSBjYW5cbiAqIHNwbGl0IHRoZSBBUk4gdXNpbmcgXCI6XCIgYW5kIHNlbGVjdCB0aGUgY29tcG9uZW50IGluIGluZGV4IDcuXG4gKlxuICogQHJldHVybnMgYEZuU2VsZWN0KDcsIEZuU3BsaXQoJzonLCBhcm4pKWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RRdWFsaWZpZXJGcm9tQXJuKGFybjogc3RyaW5nKSB7XG4gIHJldHVybiBGbi5zZWxlY3QoNywgRm4uc3BsaXQoJzonLCBhcm4pKTtcbn1cbiJdfQ==