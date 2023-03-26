"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingletonFunction = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const function_1 = require("./function");
const function_base_1 = require("./function-base");
/**
 * A Lambda that will only ever be added to a stack once.
 *
 * This construct is a way to guarantee that the lambda function will be guaranteed to be part of the stack,
 * once and only once, irrespective of how many times the construct is declared to be part of the stack.
 * This is guaranteed as long as the `uuid` property and the optional `lambdaPurpose` property stay the same
 * whenever they're declared into the stack.
 *
 * @resource AWS::Lambda::Function
 */
class SingletonFunction extends function_base_1.FunctionBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_SingletonFunctionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SingletonFunction);
            }
            throw error;
        }
        this.lambdaFunction = this.ensureLambda(props);
        this.permissionsNode = this.lambdaFunction.node;
        this.architecture = this.lambdaFunction.architecture;
        this.functionArn = this.lambdaFunction.functionArn;
        this.functionName = this.lambdaFunction.functionName;
        this.role = this.lambdaFunction.role;
        this.runtime = this.lambdaFunction.runtime;
        this.grantPrincipal = this.lambdaFunction.grantPrincipal;
        this.canCreatePermissions = true; // Doesn't matter, addPermission is overriden anyway
    }
    /**
     * @inheritdoc
     */
    get isBoundToVpc() {
        return this.lambdaFunction.isBoundToVpc;
    }
    /**
     * @inheritdoc
     */
    get connections() {
        return this.lambdaFunction.connections;
    }
    /**
     * The LogGroup where the Lambda function's logs are made available.
     *
     * If either `logRetention` is set or this property is called, a CloudFormation custom resource is added to the stack that
     * pre-creates the log group as part of the stack deployment, if it already doesn't exist, and sets the correct log retention
     * period (never expire, by default).
     *
     * Further, if the log group already exists and the `logRetention` is not set, the custom resource will reset the log retention
     * to never expire even if it was configured with a different value.
     */
    get logGroup() {
        return this.lambdaFunction.logGroup;
    }
    /**
     * Returns a `lambda.Version` which represents the current version of this
     * singleton Lambda function. A new version will be created every time the
     * function's configuration changes.
     *
     * You can specify options for this version using the `currentVersionOptions`
     * prop when initializing the `lambda.SingletonFunction`.
     */
    get currentVersion() {
        return this.lambdaFunction.currentVersion;
    }
    get resourceArnsForGrantInvoke() {
        return [this.functionArn, `${this.functionArn}:*`];
    }
    ;
    /**
     * Adds an environment variable to this Lambda function.
     * If this is a ref to a Lambda function, this operation results in a no-op.
     * @param key The environment variable key.
     * @param value The environment variable's value.
     * @param options Environment variable options.
     */
    addEnvironment(key, value, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EnvironmentOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEnvironment);
            }
            throw error;
        }
        return this.lambdaFunction.addEnvironment(key, value, options);
    }
    /**
     * Adds one or more Lambda Layers to this Lambda function.
     *
     * @param layers the layers to be added.
     *
     * @throws if there are already 5 layers on this function, or the layer is incompatible with this function's runtime.
     */
    addLayers(...layers) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_ILayerVersion(layers);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addLayers);
            }
            throw error;
        }
        return this.lambdaFunction.addLayers(...layers);
    }
    addPermission(name, permission) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_Permission(permission);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addPermission);
            }
            throw error;
        }
        return this.lambdaFunction.addPermission(name, permission);
    }
    /**
     * Using node.addDependency() does not work on this method as the underlying lambda function is modeled
     * as a singleton across the stack. Use this method instead to declare dependencies.
     */
    addDependency(...up) {
        this.lambdaFunction.node.addDependency(...up);
    }
    /**
     * The SingletonFunction construct cannot be added as a dependency of another construct using
     * node.addDependency(). Use this method instead to declare this as a dependency of another construct.
     */
    dependOn(down) {
        down.node.addDependency(this.lambdaFunction);
    }
    /** @internal */
    _checkEdgeCompatibility() {
        return this.lambdaFunction._checkEdgeCompatibility();
    }
    /**
     * Returns the construct tree node that corresponds to the lambda function.
     * @internal
     */
    _functionNode() {
        return this.lambdaFunction.node;
    }
    ensureLambda(props) {
        const constructName = (props.lambdaPurpose || 'SingletonLambda') + slugify(props.uuid);
        const existing = cdk.Stack.of(this).node.tryFindChild(constructName);
        if (existing) {
            // Just assume this is true
            return existing;
        }
        return new function_1.Function(cdk.Stack.of(this), constructName, props);
    }
}
exports.SingletonFunction = SingletonFunction;
_a = JSII_RTTI_SYMBOL_1;
SingletonFunction[_a] = { fqn: "@aws-cdk/aws-lambda.SingletonFunction", version: "0.0.0" };
function slugify(x) {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xldG9uLWxhbWJkYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpbmdsZXRvbi1sYW1iZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EscUNBQXFDO0FBR3JDLHlDQUEyRjtBQUMzRixtREFBK0M7QUE4Qi9DOzs7Ozs7Ozs7R0FTRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsNEJBQVk7SUFnQmpELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDckUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQWpCUixpQkFBaUI7Ozs7UUFtQjFCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1FBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUM7UUFFckQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQztRQUNuRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDO1FBQ3JELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztRQUMzQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO1FBRXpELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsQ0FBQyxvREFBb0Q7S0FDdkY7SUFFRDs7T0FFRztJQUNILElBQVcsWUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDO0tBQ3pDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFdBQVc7UUFDcEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQztLQUN4QztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILElBQVcsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO0tBQ3JDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILElBQVcsY0FBYztRQUN2QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO0tBQzNDO0lBRUQsSUFBVywwQkFBMEI7UUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQztLQUNwRDtJQUFBLENBQUM7SUFFRjs7Ozs7O09BTUc7SUFDSSxjQUFjLENBQUMsR0FBVyxFQUFFLEtBQWEsRUFBRSxPQUE0Qjs7Ozs7Ozs7OztRQUM1RSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDaEU7SUFFRDs7Ozs7O09BTUc7SUFDSSxTQUFTLENBQUMsR0FBRyxNQUF1Qjs7Ozs7Ozs7OztRQUN6QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7S0FDakQ7SUFFTSxhQUFhLENBQUMsSUFBWSxFQUFFLFVBQXNCOzs7Ozs7Ozs7O1FBQ3ZELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzVEO0lBRUQ7OztPQUdHO0lBQ0ksYUFBYSxDQUFDLEdBQUcsRUFBaUI7UUFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDL0M7SUFFRDs7O09BR0c7SUFDSSxRQUFRLENBQUMsSUFBZ0I7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQzlDO0lBRUQsZ0JBQWdCO0lBQ1QsdUJBQXVCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0tBQ3REO0lBRUQ7OztPQUdHO0lBQ08sYUFBYTtRQUNyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO0tBQ2pDO0lBRU8sWUFBWSxDQUFDLEtBQTZCO1FBQ2hELE1BQU0sYUFBYSxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkYsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNyRSxJQUFJLFFBQVEsRUFBRTtZQUNaLDJCQUEyQjtZQUMzQixPQUFPLFFBQTBCLENBQUM7U0FDbkM7UUFFRCxPQUFPLElBQUksbUJBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDckU7O0FBNUlILDhDQTZJQzs7O0FBRUQsU0FBUyxPQUFPLENBQUMsQ0FBUztJQUN4QixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCwgSURlcGVuZGFibGUsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFyY2hpdGVjdHVyZSB9IGZyb20gJy4vYXJjaGl0ZWN0dXJlJztcbmltcG9ydCB7IEZ1bmN0aW9uIGFzIExhbWJkYUZ1bmN0aW9uLCBGdW5jdGlvblByb3BzLCBFbnZpcm9ubWVudE9wdGlvbnMgfSBmcm9tICcuL2Z1bmN0aW9uJztcbmltcG9ydCB7IEZ1bmN0aW9uQmFzZSB9IGZyb20gJy4vZnVuY3Rpb24tYmFzZSc7XG5pbXBvcnQgeyBWZXJzaW9uIH0gZnJvbSAnLi9sYW1iZGEtdmVyc2lvbic7XG5pbXBvcnQgeyBJTGF5ZXJWZXJzaW9uIH0gZnJvbSAnLi9sYXllcnMnO1xuaW1wb3J0IHsgUGVybWlzc2lvbiB9IGZyb20gJy4vcGVybWlzc2lvbic7XG5pbXBvcnQgeyBSdW50aW1lIH0gZnJvbSAnLi9ydW50aW1lJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIG5ld2x5IGNyZWF0ZWQgc2luZ2xldG9uIExhbWJkYVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNpbmdsZXRvbkZ1bmN0aW9uUHJvcHMgZXh0ZW5kcyBGdW5jdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIEEgdW5pcXVlIGlkZW50aWZpZXIgdG8gaWRlbnRpZnkgdGhpcyBsYW1iZGFcbiAgICpcbiAgICogVGhlIGlkZW50aWZpZXIgc2hvdWxkIGJlIHVuaXF1ZSBhY3Jvc3MgYWxsIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlcnMuXG4gICAqIFdlIHJlY29tbWVuZCBnZW5lcmF0aW5nIGEgVVVJRCBwZXIgcHJvdmlkZXIuXG4gICAqL1xuICByZWFkb25seSB1dWlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpdmUgbmFtZSBmb3IgdGhlIHB1cnBvc2Ugb2YgdGhpcyBMYW1iZGEuXG4gICAqXG4gICAqIElmIHRoZSBMYW1iZGEgZG9lcyBub3QgaGF2ZSBhIHBoeXNpY2FsIG5hbWUsIHRoaXMgc3RyaW5nIHdpbGwgYmVcbiAgICogcmVmbGVjdGVkIGl0cyBnZW5lcmF0ZWQgbmFtZS4gVGhlIGNvbWJpbmF0aW9uIG9mIGxhbWJkYVB1cnBvc2VcbiAgICogYW5kIHV1aWQgbXVzdCBiZSB1bmlxdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFNpbmdsZXRvbkxhbWJkYVxuICAgKi9cbiAgcmVhZG9ubHkgbGFtYmRhUHVycG9zZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIExhbWJkYSB0aGF0IHdpbGwgb25seSBldmVyIGJlIGFkZGVkIHRvIGEgc3RhY2sgb25jZS5cbiAqXG4gKiBUaGlzIGNvbnN0cnVjdCBpcyBhIHdheSB0byBndWFyYW50ZWUgdGhhdCB0aGUgbGFtYmRhIGZ1bmN0aW9uIHdpbGwgYmUgZ3VhcmFudGVlZCB0byBiZSBwYXJ0IG9mIHRoZSBzdGFjayxcbiAqIG9uY2UgYW5kIG9ubHkgb25jZSwgaXJyZXNwZWN0aXZlIG9mIGhvdyBtYW55IHRpbWVzIHRoZSBjb25zdHJ1Y3QgaXMgZGVjbGFyZWQgdG8gYmUgcGFydCBvZiB0aGUgc3RhY2suXG4gKiBUaGlzIGlzIGd1YXJhbnRlZWQgYXMgbG9uZyBhcyB0aGUgYHV1aWRgIHByb3BlcnR5IGFuZCB0aGUgb3B0aW9uYWwgYGxhbWJkYVB1cnBvc2VgIHByb3BlcnR5IHN0YXkgdGhlIHNhbWVcbiAqIHdoZW5ldmVyIHRoZXkncmUgZGVjbGFyZWQgaW50byB0aGUgc3RhY2suXG4gKlxuICogQHJlc291cmNlIEFXUzo6TGFtYmRhOjpGdW5jdGlvblxuICovXG5leHBvcnQgY2xhc3MgU2luZ2xldG9uRnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbkJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsO1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBmdW5jdGlvbkFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcbiAgcHVibGljIHJlYWRvbmx5IHBlcm1pc3Npb25zTm9kZTogTm9kZTtcbiAgcHVibGljIHJlYWRvbmx5IGFyY2hpdGVjdHVyZTogQXJjaGl0ZWN0dXJlO1xuXG4gIC8qKlxuICAgKiBUaGUgcnVudGltZSBlbnZpcm9ubWVudCBmb3IgdGhlIExhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBydW50aW1lOiBSdW50aW1lO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBjYW5DcmVhdGVQZXJtaXNzaW9uczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsYW1iZGFGdW5jdGlvbjogTGFtYmRhRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNpbmdsZXRvbkZ1bmN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5sYW1iZGFGdW5jdGlvbiA9IHRoaXMuZW5zdXJlTGFtYmRhKHByb3BzKTtcbiAgICB0aGlzLnBlcm1pc3Npb25zTm9kZSA9IHRoaXMubGFtYmRhRnVuY3Rpb24ubm9kZTtcbiAgICB0aGlzLmFyY2hpdGVjdHVyZSA9IHRoaXMubGFtYmRhRnVuY3Rpb24uYXJjaGl0ZWN0dXJlO1xuXG4gICAgdGhpcy5mdW5jdGlvbkFybiA9IHRoaXMubGFtYmRhRnVuY3Rpb24uZnVuY3Rpb25Bcm47XG4gICAgdGhpcy5mdW5jdGlvbk5hbWUgPSB0aGlzLmxhbWJkYUZ1bmN0aW9uLmZ1bmN0aW9uTmFtZTtcbiAgICB0aGlzLnJvbGUgPSB0aGlzLmxhbWJkYUZ1bmN0aW9uLnJvbGU7XG4gICAgdGhpcy5ydW50aW1lID0gdGhpcy5sYW1iZGFGdW5jdGlvbi5ydW50aW1lO1xuICAgIHRoaXMuZ3JhbnRQcmluY2lwYWwgPSB0aGlzLmxhbWJkYUZ1bmN0aW9uLmdyYW50UHJpbmNpcGFsO1xuXG4gICAgdGhpcy5jYW5DcmVhdGVQZXJtaXNzaW9ucyA9IHRydWU7IC8vIERvZXNuJ3QgbWF0dGVyLCBhZGRQZXJtaXNzaW9uIGlzIG92ZXJyaWRlbiBhbnl3YXlcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW5oZXJpdGRvY1xuICAgKi9cbiAgcHVibGljIGdldCBpc0JvdW5kVG9WcGMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubGFtYmRhRnVuY3Rpb24uaXNCb3VuZFRvVnBjO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbmhlcml0ZG9jXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbm5lY3Rpb25zKCk6IGVjMi5Db25uZWN0aW9ucyB7XG4gICAgcmV0dXJuIHRoaXMubGFtYmRhRnVuY3Rpb24uY29ubmVjdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIExvZ0dyb3VwIHdoZXJlIHRoZSBMYW1iZGEgZnVuY3Rpb24ncyBsb2dzIGFyZSBtYWRlIGF2YWlsYWJsZS5cbiAgICpcbiAgICogSWYgZWl0aGVyIGBsb2dSZXRlbnRpb25gIGlzIHNldCBvciB0aGlzIHByb3BlcnR5IGlzIGNhbGxlZCwgYSBDbG91ZEZvcm1hdGlvbiBjdXN0b20gcmVzb3VyY2UgaXMgYWRkZWQgdG8gdGhlIHN0YWNrIHRoYXRcbiAgICogcHJlLWNyZWF0ZXMgdGhlIGxvZyBncm91cCBhcyBwYXJ0IG9mIHRoZSBzdGFjayBkZXBsb3ltZW50LCBpZiBpdCBhbHJlYWR5IGRvZXNuJ3QgZXhpc3QsIGFuZCBzZXRzIHRoZSBjb3JyZWN0IGxvZyByZXRlbnRpb25cbiAgICogcGVyaW9kIChuZXZlciBleHBpcmUsIGJ5IGRlZmF1bHQpLlxuICAgKlxuICAgKiBGdXJ0aGVyLCBpZiB0aGUgbG9nIGdyb3VwIGFscmVhZHkgZXhpc3RzIGFuZCB0aGUgYGxvZ1JldGVudGlvbmAgaXMgbm90IHNldCwgdGhlIGN1c3RvbSByZXNvdXJjZSB3aWxsIHJlc2V0IHRoZSBsb2cgcmV0ZW50aW9uXG4gICAqIHRvIG5ldmVyIGV4cGlyZSBldmVuIGlmIGl0IHdhcyBjb25maWd1cmVkIHdpdGggYSBkaWZmZXJlbnQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGxvZ0dyb3VwKCk6IGxvZ3MuSUxvZ0dyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGFGdW5jdGlvbi5sb2dHcm91cDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYGxhbWJkYS5WZXJzaW9uYCB3aGljaCByZXByZXNlbnRzIHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhpc1xuICAgKiBzaW5nbGV0b24gTGFtYmRhIGZ1bmN0aW9uLiBBIG5ldyB2ZXJzaW9uIHdpbGwgYmUgY3JlYXRlZCBldmVyeSB0aW1lIHRoZVxuICAgKiBmdW5jdGlvbidzIGNvbmZpZ3VyYXRpb24gY2hhbmdlcy5cbiAgICpcbiAgICogWW91IGNhbiBzcGVjaWZ5IG9wdGlvbnMgZm9yIHRoaXMgdmVyc2lvbiB1c2luZyB0aGUgYGN1cnJlbnRWZXJzaW9uT3B0aW9uc2BcbiAgICogcHJvcCB3aGVuIGluaXRpYWxpemluZyB0aGUgYGxhbWJkYS5TaW5nbGV0b25GdW5jdGlvbmAuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGN1cnJlbnRWZXJzaW9uKCk6IFZlcnNpb24ge1xuICAgIHJldHVybiB0aGlzLmxhbWJkYUZ1bmN0aW9uLmN1cnJlbnRWZXJzaW9uO1xuICB9XG5cbiAgcHVibGljIGdldCByZXNvdXJjZUFybnNGb3JHcmFudEludm9rZSgpIHtcbiAgICByZXR1cm4gW3RoaXMuZnVuY3Rpb25Bcm4sIGAke3RoaXMuZnVuY3Rpb25Bcm59OipgXTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkcyBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZSB0byB0aGlzIExhbWJkYSBmdW5jdGlvbi5cbiAgICogSWYgdGhpcyBpcyBhIHJlZiB0byBhIExhbWJkYSBmdW5jdGlvbiwgdGhpcyBvcGVyYXRpb24gcmVzdWx0cyBpbiBhIG5vLW9wLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSBrZXkuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgZW52aXJvbm1lbnQgdmFyaWFibGUncyB2YWx1ZS5cbiAgICogQHBhcmFtIG9wdGlvbnMgRW52aXJvbm1lbnQgdmFyaWFibGUgb3B0aW9ucy5cbiAgICovXG4gIHB1YmxpYyBhZGRFbnZpcm9ubWVudChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgb3B0aW9ucz86IEVudmlyb25tZW50T3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmxhbWJkYUZ1bmN0aW9uLmFkZEVudmlyb25tZW50KGtleSwgdmFsdWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgb25lIG9yIG1vcmUgTGFtYmRhIExheWVycyB0byB0aGlzIExhbWJkYSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGxheWVycyB0aGUgbGF5ZXJzIHRvIGJlIGFkZGVkLlxuICAgKlxuICAgKiBAdGhyb3dzIGlmIHRoZXJlIGFyZSBhbHJlYWR5IDUgbGF5ZXJzIG9uIHRoaXMgZnVuY3Rpb24sIG9yIHRoZSBsYXllciBpcyBpbmNvbXBhdGlibGUgd2l0aCB0aGlzIGZ1bmN0aW9uJ3MgcnVudGltZS5cbiAgICovXG4gIHB1YmxpYyBhZGRMYXllcnMoLi4ubGF5ZXJzOiBJTGF5ZXJWZXJzaW9uW10pIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGFGdW5jdGlvbi5hZGRMYXllcnMoLi4ubGF5ZXJzKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRQZXJtaXNzaW9uKG5hbWU6IHN0cmluZywgcGVybWlzc2lvbjogUGVybWlzc2lvbikge1xuICAgIHJldHVybiB0aGlzLmxhbWJkYUZ1bmN0aW9uLmFkZFBlcm1pc3Npb24obmFtZSwgcGVybWlzc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogVXNpbmcgbm9kZS5hZGREZXBlbmRlbmN5KCkgZG9lcyBub3Qgd29yayBvbiB0aGlzIG1ldGhvZCBhcyB0aGUgdW5kZXJseWluZyBsYW1iZGEgZnVuY3Rpb24gaXMgbW9kZWxlZFxuICAgKiBhcyBhIHNpbmdsZXRvbiBhY3Jvc3MgdGhlIHN0YWNrLiBVc2UgdGhpcyBtZXRob2QgaW5zdGVhZCB0byBkZWNsYXJlIGRlcGVuZGVuY2llcy5cbiAgICovXG4gIHB1YmxpYyBhZGREZXBlbmRlbmN5KC4uLnVwOiBJRGVwZW5kYWJsZVtdKSB7XG4gICAgdGhpcy5sYW1iZGFGdW5jdGlvbi5ub2RlLmFkZERlcGVuZGVuY3koLi4udXApO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBTaW5nbGV0b25GdW5jdGlvbiBjb25zdHJ1Y3QgY2Fubm90IGJlIGFkZGVkIGFzIGEgZGVwZW5kZW5jeSBvZiBhbm90aGVyIGNvbnN0cnVjdCB1c2luZ1xuICAgKiBub2RlLmFkZERlcGVuZGVuY3koKS4gVXNlIHRoaXMgbWV0aG9kIGluc3RlYWQgdG8gZGVjbGFyZSB0aGlzIGFzIGEgZGVwZW5kZW5jeSBvZiBhbm90aGVyIGNvbnN0cnVjdC5cbiAgICovXG4gIHB1YmxpYyBkZXBlbmRPbihkb3duOiBJQ29uc3RydWN0KSB7XG4gICAgZG93bi5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5sYW1iZGFGdW5jdGlvbik7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfY2hlY2tFZGdlQ29tcGF0aWJpbGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGFGdW5jdGlvbi5fY2hlY2tFZGdlQ29tcGF0aWJpbGl0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNvbnN0cnVjdCB0cmVlIG5vZGUgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgbGFtYmRhIGZ1bmN0aW9uLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfZnVuY3Rpb25Ob2RlKCk6IE5vZGUge1xuICAgIHJldHVybiB0aGlzLmxhbWJkYUZ1bmN0aW9uLm5vZGU7XG4gIH1cblxuICBwcml2YXRlIGVuc3VyZUxhbWJkYShwcm9wczogU2luZ2xldG9uRnVuY3Rpb25Qcm9wcyk6IExhbWJkYUZ1bmN0aW9uIHtcbiAgICBjb25zdCBjb25zdHJ1Y3ROYW1lID0gKHByb3BzLmxhbWJkYVB1cnBvc2UgfHwgJ1NpbmdsZXRvbkxhbWJkYScpICsgc2x1Z2lmeShwcm9wcy51dWlkKTtcbiAgICBjb25zdCBleGlzdGluZyA9IGNkay5TdGFjay5vZih0aGlzKS5ub2RlLnRyeUZpbmRDaGlsZChjb25zdHJ1Y3ROYW1lKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIC8vIEp1c3QgYXNzdW1lIHRoaXMgaXMgdHJ1ZVxuICAgICAgcmV0dXJuIGV4aXN0aW5nIGFzIExhbWJkYUZ1bmN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTGFtYmRhRnVuY3Rpb24oY2RrLlN0YWNrLm9mKHRoaXMpLCBjb25zdHJ1Y3ROYW1lLCBwcm9wcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2x1Z2lmeSh4OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4geC5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xufVxuIl19