"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alias = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const appscaling = require("@aws-cdk/aws-applicationautoscaling");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const function_base_1 = require("./function-base");
const lambda_version_1 = require("./lambda-version");
const lambda_generated_1 = require("./lambda.generated");
const scalable_function_attribute_1 = require("./private/scalable-function-attribute");
/**
 * A new alias to a particular version of a Lambda function.
 */
class Alias extends function_base_1.QualifiedFunctionBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.aliasName,
        });
        this.canCreatePermissions = true;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AliasProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Alias);
            }
            throw error;
        }
        this.lambda = props.version.lambda;
        this.aliasName = this.physicalName;
        this.version = props.version;
        this.architecture = this.lambda.architecture;
        const alias = new lambda_generated_1.CfnAlias(this, 'Resource', {
            name: this.aliasName,
            description: props.description,
            functionName: this.version.lambda.functionName,
            functionVersion: props.version.version,
            routingConfig: this.determineRoutingConfig(props),
            provisionedConcurrencyConfig: this.determineProvisionedConcurrency(props),
        });
        // Use a Service Linked Role
        // https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-service-linked-roles.html
        this.scalingRole = iam.Role.fromRoleArn(this, 'ScalingRole', this.stack.formatArn({
            service: 'iam',
            region: '',
            resource: 'role/aws-service-role/lambda.application-autoscaling.amazonaws.com',
            resourceName: 'AWSServiceRoleForApplicationAutoScaling_LambdaConcurrency',
        }));
        this.functionArn = this.getResourceArnAttribute(alias.ref, {
            service: 'lambda',
            resource: 'function',
            resourceName: `${this.lambda.functionName}:${this.physicalName}`,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.qualifier = lambda_version_1.extractQualifierFromArn(alias.ref);
        if (props.onFailure || props.onSuccess || props.maxEventAge || props.retryAttempts !== undefined) {
            this.configureAsyncInvoke({
                onFailure: props.onFailure,
                onSuccess: props.onSuccess,
                maxEventAge: props.maxEventAge,
                retryAttempts: props.retryAttempts,
            });
        }
        // ARN parsing splits on `:`, so we can only get the function's name from the ARN as resourceName...
        // And we're parsing it out (instead of using the underlying function directly) in order to have use of it incur
        // an implicit dependency on the resource.
        this.functionName = `${this.stack.splitArn(this.functionArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName}:${this.aliasName}`;
    }
    static fromAliasAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AliasAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAliasAttributes);
            }
            throw error;
        }
        class Imported extends function_base_1.QualifiedFunctionBase {
            constructor() {
                super(...arguments);
                this.aliasName = attrs.aliasName;
                this.version = attrs.aliasVersion;
                this.lambda = attrs.aliasVersion.lambda;
                this.functionArn = `${attrs.aliasVersion.lambda.functionArn}:${attrs.aliasName}`;
                this.functionName = `${attrs.aliasVersion.lambda.functionName}:${attrs.aliasName}`;
                this.grantPrincipal = attrs.aliasVersion.grantPrincipal;
                this.role = attrs.aliasVersion.role;
                this.architecture = attrs.aliasVersion.lambda.architecture;
                this.canCreatePermissions = this._isStackAccount();
                this.qualifier = attrs.aliasName;
            }
        }
        return new Imported(scope, id);
    }
    get grantPrincipal() {
        return this.version.grantPrincipal;
    }
    get role() {
        return this.version.role;
    }
    metric(metricName, props = {}) {
        // Metrics on Aliases need the "bare" function name, and the alias' ARN, this differs from the base behavior.
        return super.metric(metricName, {
            dimensionsMap: {
                FunctionName: this.lambda.functionName,
                // construct the name from the underlying lambda so that alarms on an alias
                // don't cause a circular dependency with CodeDeploy
                // see: https://github.com/aws/aws-cdk/issues/2231
                Resource: `${this.lambda.functionName}:${this.aliasName}`,
            },
            ...props,
        });
    }
    /**
     * Configure provisioned concurrency autoscaling on a function alias. Returns a scalable attribute that can call
     * `scaleOnUtilization()` and `scaleOnSchedule()`.
     *
     * @param options Autoscaling options
     */
    addAutoScaling(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AutoScalingOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAutoScaling);
            }
            throw error;
        }
        if (this.scalableAlias) {
            throw new Error('AutoScaling already enabled for this alias');
        }
        return this.scalableAlias = new scalable_function_attribute_1.ScalableFunctionAttribute(this, 'AliasScaling', {
            minCapacity: options.minCapacity ?? 1,
            maxCapacity: options.maxCapacity,
            resourceId: `function:${this.functionName}`,
            dimension: 'lambda:function:ProvisionedConcurrency',
            serviceNamespace: appscaling.ServiceNamespace.LAMBDA,
            role: this.scalingRole,
        });
    }
    /**
     * Calculate the routingConfig parameter from the input props
     */
    determineRoutingConfig(props) {
        if (!props.additionalVersions || props.additionalVersions.length === 0) {
            return undefined;
        }
        this.validateAdditionalWeights(props.additionalVersions);
        return {
            additionalVersionWeights: props.additionalVersions.map(vw => {
                return {
                    functionVersion: vw.version.version,
                    functionWeight: vw.weight,
                };
            }),
        };
    }
    /**
     * Validate that the additional version weights make sense
     *
     * We validate that they are positive and add up to something <= 1.
     */
    validateAdditionalWeights(weights) {
        const total = weights.map(w => {
            if (w.weight < 0 || w.weight > 1) {
                throw new Error(`Additional version weight must be between 0 and 1, got: ${w.weight}`);
            }
            return w.weight;
        }).reduce((a, x) => a + x);
        if (total > 1) {
            throw new Error(`Sum of additional version weights must not exceed 1, got: ${total}`);
        }
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
exports.Alias = Alias;
_a = JSII_RTTI_SYMBOL_1;
Alias[_a] = { fqn: "@aws-cdk/aws-lambda.Alias", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbGlhcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrRUFBa0U7QUFFbEUsd0NBQXdDO0FBQ3hDLHdDQUEwQztBQUkxQyxtREFBbUU7QUFDbkUscURBQXFFO0FBQ3JFLHlEQUE4QztBQUM5Qyx1RkFBa0Y7QUE2RWxGOztHQUVHO0FBQ0gsTUFBYSxLQUFNLFNBQVEscUNBQXFCO0lBcUQ5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWlCO1FBQ3pELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzlCLENBQUMsQ0FBQztRQVJjLHlCQUFvQixHQUFZLElBQUksQ0FBQzs7Ozs7OytDQWhEN0MsS0FBSzs7OztRQTBEZCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUU3QyxNQUFNLEtBQUssR0FBRyxJQUFJLDJCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMzQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDcEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZO1lBQzlDLGVBQWUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87WUFDdEMsYUFBYSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUM7WUFDakQsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLCtCQUErQixDQUFD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LENBQUM7U0FDL0Y7UUFFRCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsS0FBSyxDQUFDLCtCQUErQixFQUFFLENBQUM7S0FDbkY7O0FBdE1ILHNCQXVNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHNjYWxpbmcgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcGxpY2F0aW9uYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcm5Gb3JtYXQgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQXJjaGl0ZWN0dXJlIH0gZnJvbSAnLi9hcmNoaXRlY3R1cmUnO1xuaW1wb3J0IHsgRXZlbnRJbnZva2VDb25maWdPcHRpb25zIH0gZnJvbSAnLi9ldmVudC1pbnZva2UtY29uZmlnJztcbmltcG9ydCB7IElGdW5jdGlvbiwgUXVhbGlmaWVkRnVuY3Rpb25CYXNlIH0gZnJvbSAnLi9mdW5jdGlvbi1iYXNlJztcbmltcG9ydCB7IGV4dHJhY3RRdWFsaWZpZXJGcm9tQXJuLCBJVmVyc2lvbiB9IGZyb20gJy4vbGFtYmRhLXZlcnNpb24nO1xuaW1wb3J0IHsgQ2ZuQWxpYXMgfSBmcm9tICcuL2xhbWJkYS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgU2NhbGFibGVGdW5jdGlvbkF0dHJpYnV0ZSB9IGZyb20gJy4vcHJpdmF0ZS9zY2FsYWJsZS1mdW5jdGlvbi1hdHRyaWJ1dGUnO1xuaW1wb3J0IHsgQXV0b1NjYWxpbmdPcHRpb25zLCBJU2NhbGFibGVGdW5jdGlvbkF0dHJpYnV0ZSB9IGZyb20gJy4vc2NhbGFibGUtYXR0cmlidXRlLWFwaSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFsaWFzIGV4dGVuZHMgSUZ1bmN0aW9uIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhpcyBhbGlhcy5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxpYXNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIExhbWJkYSBmdW5jdGlvbiB2ZXJzaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbjogSVZlcnNpb247XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYGxhbWJkYS5BbGlhc2AuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWxpYXNPcHRpb25zIGV4dGVuZHMgRXZlbnRJbnZva2VDb25maWdPcHRpb25zIHtcbiAgLyoqXG4gICAqIERlc2NyaXB0aW9uIGZvciB0aGUgYWxpYXNcbiAgICpcbiAgICogQGRlZmF1bHQgTm8gZGVzY3JpcHRpb25cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHZlcnNpb25zIHdpdGggaW5kaXZpZHVhbCB3ZWlnaHRzIHRoaXMgYWxpYXMgcG9pbnRzIHRvXG4gICAqXG4gICAqIEluZGl2aWR1YWwgYWRkaXRpb25hbCB2ZXJzaW9uIHdlaWdodHMgc3BlY2lmaWVkIGhlcmUgc2hvdWxkIGFkZCB1cCB0b1xuICAgKiAobGVzcyB0aGFuKSBvbmUuIEFsbCByZW1haW5pbmcgd2VpZ2h0IGlzIHJvdXRlZCB0byB0aGUgZGVmYXVsdFxuICAgKiB2ZXJzaW9uLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdGhlIGNvbmZpZyBpc1xuICAgKlxuICAgKiAgICB2ZXJzaW9uOiBcIjFcIlxuICAgKiAgICBhZGRpdGlvbmFsVmVyc2lvbnM6IFt7IHZlcnNpb246IFwiMlwiLCB3ZWlnaHQ6IDAuMDUgfV1cbiAgICpcbiAgICogVGhlbiA1JSBvZiB0cmFmZmljIHdpbGwgYmUgcm91dGVkIHRvIGZ1bmN0aW9uIHZlcnNpb24gMiwgd2hpbGVcbiAgICogdGhlIHJlbWFpbmluZyA5NSUgb2YgdHJhZmZpYyB3aWxsIGJlIHJvdXRlZCB0byBmdW5jdGlvbiB2ZXJzaW9uIDEuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGFkZGl0aW9uYWwgdmVyc2lvbnNcbiAgICovXG4gIHJlYWRvbmx5IGFkZGl0aW9uYWxWZXJzaW9ucz86IFZlcnNpb25XZWlnaHRbXTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGEgcHJvdmlzaW9uZWQgY29uY3VycmVuY3kgY29uZmlndXJhdGlvbiBmb3IgYSBmdW5jdGlvbidzIGFsaWFzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBwcm92aXNpb25lZCBjb25jdXJyZW5jeVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9ucz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIG5ldyBMYW1iZGEgYWxpYXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGlhc1Byb3BzIGV4dGVuZHMgQWxpYXNPcHRpb25zIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhpcyBhbGlhc1xuICAgKi9cbiAgcmVhZG9ubHkgYWxpYXNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHZlcnNpb24gdGhpcyBhbGlhcyByZWZlcnMgdG9cbiAgICpcbiAgICogVXNlIGxhbWJkYS5jdXJyZW50VmVyc2lvbiB0byByZWZlcmVuY2UgYSB2ZXJzaW9uIHdpdGggeW91ciBsYXRlc3QgY2hhbmdlcy5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb246IElWZXJzaW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFsaWFzQXR0cmlidXRlcyB7XG4gIHJlYWRvbmx5IGFsaWFzTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBhbGlhc1ZlcnNpb246IElWZXJzaW9uO1xufVxuXG4vKipcbiAqIEEgbmV3IGFsaWFzIHRvIGEgcGFydGljdWxhciB2ZXJzaW9uIG9mIGEgTGFtYmRhIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgQWxpYXMgZXh0ZW5kcyBRdWFsaWZpZWRGdW5jdGlvbkJhc2UgaW1wbGVtZW50cyBJQWxpYXMge1xuICBwdWJsaWMgc3RhdGljIGZyb21BbGlhc0F0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IEFsaWFzQXR0cmlidXRlcyk6IElBbGlhcyB7XG4gICAgY2xhc3MgSW1wb3J0ZWQgZXh0ZW5kcyBRdWFsaWZpZWRGdW5jdGlvbkJhc2UgaW1wbGVtZW50cyBJQWxpYXMge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGFsaWFzTmFtZSA9IGF0dHJzLmFsaWFzTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uID0gYXR0cnMuYWxpYXNWZXJzaW9uO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGxhbWJkYSA9IGF0dHJzLmFsaWFzVmVyc2lvbi5sYW1iZGE7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25Bcm4gPSBgJHthdHRycy5hbGlhc1ZlcnNpb24ubGFtYmRhLmZ1bmN0aW9uQXJufToke2F0dHJzLmFsaWFzTmFtZX1gO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uTmFtZSA9IGAke2F0dHJzLmFsaWFzVmVyc2lvbi5sYW1iZGEuZnVuY3Rpb25OYW1lfToke2F0dHJzLmFsaWFzTmFtZX1gO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsID0gYXR0cnMuYWxpYXNWZXJzaW9uLmdyYW50UHJpbmNpcGFsO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJvbGUgPSBhdHRycy5hbGlhc1ZlcnNpb24ucm9sZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhcmNoaXRlY3R1cmUgPSBhdHRycy5hbGlhc1ZlcnNpb24ubGFtYmRhLmFyY2hpdGVjdHVyZTtcblxuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNhbkNyZWF0ZVBlcm1pc3Npb25zID0gdGhpcy5faXNTdGFja0FjY291bnQoKTtcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBxdWFsaWZpZXIgPSBhdHRycy5hbGlhc05hbWU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0ZWQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoaXMgYWxpYXMuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhbGlhc05hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIEFSTiBvZiB0aGlzIGFsaWFzXG4gICAqXG4gICAqIFVzZWQgdG8gYmUgYWJsZSB0byB1c2UgQWxpYXMgaW4gcGxhY2Ugb2YgYSByZWd1bGFyIExhbWJkYS4gTGFtYmRhIGFjY2VwdHNcbiAgICogQVJOcyBldmVyeXdoZXJlIGl0IGFjY2VwdHMgZnVuY3Rpb24gbmFtZXMuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGxhbWJkYTogSUZ1bmN0aW9uO1xuXG4gIHB1YmxpYyByZWFkb25seSBhcmNoaXRlY3R1cmU6IEFyY2hpdGVjdHVyZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbjogSVZlcnNpb247XG5cbiAgLyoqXG4gICAqIEFSTiBvZiB0aGlzIGFsaWFzXG4gICAqXG4gICAqIFVzZWQgdG8gYmUgYWJsZSB0byB1c2UgQWxpYXMgaW4gcGxhY2Ugb2YgYSByZWd1bGFyIExhbWJkYS4gTGFtYmRhIGFjY2VwdHNcbiAgICogQVJOcyBldmVyeXdoZXJlIGl0IGFjY2VwdHMgZnVuY3Rpb24gbmFtZXMuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25Bcm46IHN0cmluZztcblxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgcXVhbGlmaWVyOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGNhbkNyZWF0ZVBlcm1pc3Npb25zOiBib29sZWFuID0gdHJ1ZTtcblxuICBwcml2YXRlIHNjYWxhYmxlQWxpYXM/OiBTY2FsYWJsZUZ1bmN0aW9uQXR0cmlidXRlO1xuICBwcml2YXRlIHJlYWRvbmx5IHNjYWxpbmdSb2xlOiBpYW0uSVJvbGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFsaWFzUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuYWxpYXNOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5sYW1iZGEgPSBwcm9wcy52ZXJzaW9uLmxhbWJkYTtcbiAgICB0aGlzLmFsaWFzTmFtZSA9IHRoaXMucGh5c2ljYWxOYW1lO1xuICAgIHRoaXMudmVyc2lvbiA9IHByb3BzLnZlcnNpb247XG4gICAgdGhpcy5hcmNoaXRlY3R1cmUgPSB0aGlzLmxhbWJkYS5hcmNoaXRlY3R1cmU7XG5cbiAgICBjb25zdCBhbGlhcyA9IG5ldyBDZm5BbGlhcyh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiB0aGlzLmFsaWFzTmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIGZ1bmN0aW9uTmFtZTogdGhpcy52ZXJzaW9uLmxhbWJkYS5mdW5jdGlvbk5hbWUsXG4gICAgICBmdW5jdGlvblZlcnNpb246IHByb3BzLnZlcnNpb24udmVyc2lvbixcbiAgICAgIHJvdXRpbmdDb25maWc6IHRoaXMuZGV0ZXJtaW5lUm91dGluZ0NvbmZpZyhwcm9wcyksXG4gICAgICBwcm92aXNpb25lZENvbmN1cnJlbmN5Q29uZmlnOiB0aGlzLmRldGVybWluZVByb3Zpc2lvbmVkQ29uY3VycmVuY3kocHJvcHMpLFxuICAgIH0pO1xuXG4gICAgLy8gVXNlIGEgU2VydmljZSBMaW5rZWQgUm9sZVxuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9hcHBsaWNhdGlvbi91c2VyZ3VpZGUvYXBwbGljYXRpb24tYXV0by1zY2FsaW5nLXNlcnZpY2UtbGlua2VkLXJvbGVzLmh0bWxcbiAgICB0aGlzLnNjYWxpbmdSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4odGhpcywgJ1NjYWxpbmdSb2xlJywgdGhpcy5zdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICByZWdpb246ICcnLFxuICAgICAgcmVzb3VyY2U6ICdyb2xlL2F3cy1zZXJ2aWNlLXJvbGUvbGFtYmRhLmFwcGxpY2F0aW9uLWF1dG9zY2FsaW5nLmFtYXpvbmF3cy5jb20nLFxuICAgICAgcmVzb3VyY2VOYW1lOiAnQVdTU2VydmljZVJvbGVGb3JBcHBsaWNhdGlvbkF1dG9TY2FsaW5nX0xhbWJkYUNvbmN1cnJlbmN5JyxcbiAgICB9KSk7XG5cbiAgICB0aGlzLmZ1bmN0aW9uQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShhbGlhcy5yZWYsIHtcbiAgICAgIHNlcnZpY2U6ICdsYW1iZGEnLFxuICAgICAgcmVzb3VyY2U6ICdmdW5jdGlvbicsXG4gICAgICByZXNvdXJjZU5hbWU6IGAke3RoaXMubGFtYmRhLmZ1bmN0aW9uTmFtZX06JHt0aGlzLnBoeXNpY2FsTmFtZX1gLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KTtcblxuICAgIHRoaXMucXVhbGlmaWVyID0gZXh0cmFjdFF1YWxpZmllckZyb21Bcm4oYWxpYXMucmVmKTtcblxuICAgIGlmIChwcm9wcy5vbkZhaWx1cmUgfHwgcHJvcHMub25TdWNjZXNzIHx8IHByb3BzLm1heEV2ZW50QWdlIHx8IHByb3BzLnJldHJ5QXR0ZW1wdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jb25maWd1cmVBc3luY0ludm9rZSh7XG4gICAgICAgIG9uRmFpbHVyZTogcHJvcHMub25GYWlsdXJlLFxuICAgICAgICBvblN1Y2Nlc3M6IHByb3BzLm9uU3VjY2VzcyxcbiAgICAgICAgbWF4RXZlbnRBZ2U6IHByb3BzLm1heEV2ZW50QWdlLFxuICAgICAgICByZXRyeUF0dGVtcHRzOiBwcm9wcy5yZXRyeUF0dGVtcHRzLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQVJOIHBhcnNpbmcgc3BsaXRzIG9uIGA6YCwgc28gd2UgY2FuIG9ubHkgZ2V0IHRoZSBmdW5jdGlvbidzIG5hbWUgZnJvbSB0aGUgQVJOIGFzIHJlc291cmNlTmFtZS4uLlxuICAgIC8vIEFuZCB3ZSdyZSBwYXJzaW5nIGl0IG91dCAoaW5zdGVhZCBvZiB1c2luZyB0aGUgdW5kZXJseWluZyBmdW5jdGlvbiBkaXJlY3RseSkgaW4gb3JkZXIgdG8gaGF2ZSB1c2Ugb2YgaXQgaW5jdXJcbiAgICAvLyBhbiBpbXBsaWNpdCBkZXBlbmRlbmN5IG9uIHRoZSByZXNvdXJjZS5cbiAgICB0aGlzLmZ1bmN0aW9uTmFtZSA9IGAke3RoaXMuc3RhY2suc3BsaXRBcm4odGhpcy5mdW5jdGlvbkFybiwgQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZSF9OiR7dGhpcy5hbGlhc05hbWV9YDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZ3JhbnRQcmluY2lwYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudmVyc2lvbi5ncmFudFByaW5jaXBhbDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcm9sZSgpIHtcbiAgICByZXR1cm4gdGhpcy52ZXJzaW9uLnJvbGU7XG4gIH1cblxuICBwdWJsaWMgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM6IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyA9IHt9KTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIC8vIE1ldHJpY3Mgb24gQWxpYXNlcyBuZWVkIHRoZSBcImJhcmVcIiBmdW5jdGlvbiBuYW1lLCBhbmQgdGhlIGFsaWFzJyBBUk4sIHRoaXMgZGlmZmVycyBmcm9tIHRoZSBiYXNlIGJlaGF2aW9yLlxuICAgIHJldHVybiBzdXBlci5tZXRyaWMobWV0cmljTmFtZSwge1xuICAgICAgZGltZW5zaW9uc01hcDoge1xuICAgICAgICBGdW5jdGlvbk5hbWU6IHRoaXMubGFtYmRhLmZ1bmN0aW9uTmFtZSxcbiAgICAgICAgLy8gY29uc3RydWN0IHRoZSBuYW1lIGZyb20gdGhlIHVuZGVybHlpbmcgbGFtYmRhIHNvIHRoYXQgYWxhcm1zIG9uIGFuIGFsaWFzXG4gICAgICAgIC8vIGRvbid0IGNhdXNlIGEgY2lyY3VsYXIgZGVwZW5kZW5jeSB3aXRoIENvZGVEZXBsb3lcbiAgICAgICAgLy8gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzIyMzFcbiAgICAgICAgUmVzb3VyY2U6IGAke3RoaXMubGFtYmRhLmZ1bmN0aW9uTmFtZX06JHt0aGlzLmFsaWFzTmFtZX1gLFxuICAgICAgfSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSBwcm92aXNpb25lZCBjb25jdXJyZW5jeSBhdXRvc2NhbGluZyBvbiBhIGZ1bmN0aW9uIGFsaWFzLiBSZXR1cm5zIGEgc2NhbGFibGUgYXR0cmlidXRlIHRoYXQgY2FuIGNhbGxcbiAgICogYHNjYWxlT25VdGlsaXphdGlvbigpYCBhbmQgYHNjYWxlT25TY2hlZHVsZSgpYC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQXV0b3NjYWxpbmcgb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIGFkZEF1dG9TY2FsaW5nKG9wdGlvbnM6IEF1dG9TY2FsaW5nT3B0aW9ucyk6IElTY2FsYWJsZUZ1bmN0aW9uQXR0cmlidXRlIHtcbiAgICBpZiAodGhpcy5zY2FsYWJsZUFsaWFzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F1dG9TY2FsaW5nIGFscmVhZHkgZW5hYmxlZCBmb3IgdGhpcyBhbGlhcycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zY2FsYWJsZUFsaWFzID0gbmV3IFNjYWxhYmxlRnVuY3Rpb25BdHRyaWJ1dGUodGhpcywgJ0FsaWFzU2NhbGluZycsIHtcbiAgICAgIG1pbkNhcGFjaXR5OiBvcHRpb25zLm1pbkNhcGFjaXR5ID8/IDEsXG4gICAgICBtYXhDYXBhY2l0eTogb3B0aW9ucy5tYXhDYXBhY2l0eSxcbiAgICAgIHJlc291cmNlSWQ6IGBmdW5jdGlvbjoke3RoaXMuZnVuY3Rpb25OYW1lfWAsXG4gICAgICBkaW1lbnNpb246ICdsYW1iZGE6ZnVuY3Rpb246UHJvdmlzaW9uZWRDb25jdXJyZW5jeScsXG4gICAgICBzZXJ2aWNlTmFtZXNwYWNlOiBhcHBzY2FsaW5nLlNlcnZpY2VOYW1lc3BhY2UuTEFNQkRBLFxuICAgICAgcm9sZTogdGhpcy5zY2FsaW5nUm9sZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIHJvdXRpbmdDb25maWcgcGFyYW1ldGVyIGZyb20gdGhlIGlucHV0IHByb3BzXG4gICAqL1xuICBwcml2YXRlIGRldGVybWluZVJvdXRpbmdDb25maWcocHJvcHM6IEFsaWFzUHJvcHMpIHtcbiAgICBpZiAoIXByb3BzLmFkZGl0aW9uYWxWZXJzaW9ucyB8fCBwcm9wcy5hZGRpdGlvbmFsVmVyc2lvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRoaXMudmFsaWRhdGVBZGRpdGlvbmFsV2VpZ2h0cyhwcm9wcy5hZGRpdGlvbmFsVmVyc2lvbnMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFkZGl0aW9uYWxWZXJzaW9uV2VpZ2h0czogcHJvcHMuYWRkaXRpb25hbFZlcnNpb25zLm1hcCh2dyA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnVuY3Rpb25WZXJzaW9uOiB2dy52ZXJzaW9uLnZlcnNpb24sXG4gICAgICAgICAgZnVuY3Rpb25XZWlnaHQ6IHZ3LndlaWdodCxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdGhhdCB0aGUgYWRkaXRpb25hbCB2ZXJzaW9uIHdlaWdodHMgbWFrZSBzZW5zZVxuICAgKlxuICAgKiBXZSB2YWxpZGF0ZSB0aGF0IHRoZXkgYXJlIHBvc2l0aXZlIGFuZCBhZGQgdXAgdG8gc29tZXRoaW5nIDw9IDEuXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlQWRkaXRpb25hbFdlaWdodHMod2VpZ2h0czogVmVyc2lvbldlaWdodFtdKSB7XG4gICAgY29uc3QgdG90YWwgPSB3ZWlnaHRzLm1hcCh3ID0+IHtcbiAgICAgIGlmICh3LndlaWdodCA8IDAgfHwgdy53ZWlnaHQgPiAxKSB7IHRocm93IG5ldyBFcnJvcihgQWRkaXRpb25hbCB2ZXJzaW9uIHdlaWdodCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMSwgZ290OiAke3cud2VpZ2h0fWApOyB9XG4gICAgICByZXR1cm4gdy53ZWlnaHQ7XG4gICAgfSkucmVkdWNlKChhLCB4KSA9PiBhICsgeCk7XG5cbiAgICBpZiAodG90YWwgPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFN1bSBvZiBhZGRpdGlvbmFsIHZlcnNpb24gd2VpZ2h0cyBtdXN0IG5vdCBleGNlZWQgMSwgZ290OiAke3RvdGFsfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IHRoZSBwcm92aXNpb25lZENvbmN1cnJlbnRFeGVjdXRpb25zIG1ha2VzIHNlbnNlXG4gICAqXG4gICAqIE1lbWJlciBtdXN0IGhhdmUgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDFcbiAgICovXG4gIHByaXZhdGUgZGV0ZXJtaW5lUHJvdmlzaW9uZWRDb25jdXJyZW5jeShwcm9wczogQWxpYXNQcm9wcyk6IENmbkFsaWFzLlByb3Zpc2lvbmVkQ29uY3VycmVuY3lDb25maWd1cmF0aW9uUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghcHJvcHMucHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9ucykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMucHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9ucyA8PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb3Zpc2lvbmVkQ29uY3VycmVudEV4ZWN1dGlvbnMgbXVzdCBoYXZlIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAxJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9uczogcHJvcHMucHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9ucyB9O1xuICB9XG59XG5cbi8qKlxuICogQSB2ZXJzaW9uL3dlaWdodCBwYWlyIGZvciByb3V0aW5nIHRyYWZmaWMgdG8gTGFtYmRhIGZ1bmN0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFZlcnNpb25XZWlnaHQge1xuICAvKipcbiAgICogVGhlIHZlcnNpb24gdG8gcm91dGUgdHJhZmZpYyB0b1xuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbjogSVZlcnNpb247XG5cbiAgLyoqXG4gICAqIEhvdyBtdWNoIHdlaWdodCB0byBhc3NpZ24gdG8gdGhpcyB2ZXJzaW9uICgwLi4xKVxuICAgKi9cbiAgcmVhZG9ubHkgd2VpZ2h0OiBudW1iZXI7XG59XG4iXX0=