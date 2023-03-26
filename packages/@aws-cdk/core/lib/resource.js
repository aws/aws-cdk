"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const arn_1 = require("./arn");
const cfn_resource_1 = require("./cfn-resource");
const lazy_1 = require("./lazy");
const physical_name_generator_1 = require("./private/physical-name-generator");
const reference_1 = require("./reference");
const stack_1 = require("./stack");
const token_1 = require("./token");
// v2 - leave this as a separate section so it reduces merge conflicts when compat is removed
// eslint-disable-next-line import/order
const constructs_1 = require("constructs");
const RESOURCE_SYMBOL = Symbol.for('@aws-cdk/core.Resource');
/**
 * A construct which represents an AWS resource.
 */
class Resource extends constructs_1.Construct {
    /**
     * Check whether the given construct is a Resource
     */
    static isResource(construct) {
        return construct !== null && typeof (construct) === 'object' && RESOURCE_SYMBOL in construct;
    }
    /**
     * Returns true if the construct was created by CDK, and false otherwise
     */
    static isOwnedResource(construct) {
        return construct.node.defaultChild ? cfn_resource_1.CfnResource.isCfnResource(construct.node.defaultChild) : false;
    }
    constructor(scope, id, props = {}) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ResourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Resource);
            }
            throw error;
        }
        if ((props.account !== undefined || props.region !== undefined) && props.environmentFromArn !== undefined) {
            throw new Error(`Supply at most one of 'account'/'region' (${props.account}/${props.region}) and 'environmentFromArn' (${props.environmentFromArn})`);
        }
        Object.defineProperty(this, RESOURCE_SYMBOL, { value: true });
        this.stack = stack_1.Stack.of(this);
        const parsedArn = props.environmentFromArn ?
            // Since we only want the region and account, NO_RESOURE_NAME is good enough
            this.stack.splitArn(props.environmentFromArn, arn_1.ArnFormat.NO_RESOURCE_NAME)
            : undefined;
        this.env = {
            account: props.account ?? parsedArn?.account ?? this.stack.account,
            region: props.region ?? parsedArn?.region ?? this.stack.region,
        };
        let physicalName = props.physicalName;
        if (props.physicalName && (0, physical_name_generator_1.isGeneratedWhenNeededMarker)(props.physicalName)) {
            // auto-generate only if cross-env is required
            this._physicalName = undefined;
            this._allowCrossEnvironment = true;
            physicalName = lazy_1.Lazy.string({ produce: () => this._physicalName });
        }
        else if (props.physicalName && !token_1.Token.isUnresolved(props.physicalName)) {
            // concrete value specified by the user
            this._physicalName = props.physicalName;
            this._allowCrossEnvironment = true;
        }
        else {
            // either undefined (deploy-time) or has tokens, which means we can't use for cross-env
            this._physicalName = props.physicalName;
            this._allowCrossEnvironment = false;
        }
        if (physicalName === undefined) {
            physicalName = token_1.Token.asString(undefined);
        }
        this.physicalName = physicalName;
    }
    /**
     * Called when this resource is referenced across environments
     * (account/region) to order to request that a physical name will be generated
     * for this resource during synthesis, so the resource can be referenced
     * through it's absolute name/arn.
     *
     * @internal
     */
    _enableCrossEnvironment() {
        if (!this._allowCrossEnvironment) {
            // error out - a deploy-time name cannot be used across environments
            throw new Error(`Cannot use resource '${this.node.path}' in a cross-environment fashion, ` +
                "the resource's physical name must be explicit set or use `PhysicalName.GENERATE_IF_NEEDED`");
        }
        if (!this._physicalName) {
            this._physicalName = this.generatePhysicalName();
        }
    }
    /**
     * Apply the given removal policy to this resource
     *
     * The Removal Policy controls what happens to this resource when it stops
     * being managed by CloudFormation, either because you've removed it from the
     * CDK application or because you've made a change that requires the resource
     * to be replaced.
     *
     * The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
     * account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).
     */
    applyRemovalPolicy(policy) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_RemovalPolicy(policy);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.applyRemovalPolicy);
            }
            throw error;
        }
        const child = this.node.defaultChild;
        if (!child || !cfn_resource_1.CfnResource.isCfnResource(child)) {
            throw new Error('Cannot apply RemovalPolicy: no child or not a CfnResource. Apply the removal policy on the CfnResource directly.');
        }
        child.applyRemovalPolicy(policy);
    }
    generatePhysicalName() {
        return (0, physical_name_generator_1.generatePhysicalName)(this);
    }
    /**
     * Returns an environment-sensitive token that should be used for the
     * resource's "name" attribute (e.g. `bucket.bucketName`).
     *
     * Normally, this token will resolve to `nameAttr`, but if the resource is
     * referenced across environments, it will be resolved to `this.physicalName`,
     * which will be a concrete name.
     *
     * @param nameAttr The CFN attribute which resolves to the resource's name.
     * Commonly this is the resource's `ref`.
     */
    getResourceNameAttribute(nameAttr) {
        return mimicReference(nameAttr, {
            produce: (context) => {
                const consumingStack = stack_1.Stack.of(context.scope);
                if (this.stack.account !== consumingStack.account ||
                    (this.stack.region !== consumingStack.region &&
                        !consumingStack._crossRegionReferences)) {
                    this._enableCrossEnvironment();
                    return this.physicalName;
                }
                else {
                    return nameAttr;
                }
            },
        });
    }
    /**
     * Returns an environment-sensitive token that should be used for the
     * resource's "ARN" attribute (e.g. `bucket.bucketArn`).
     *
     * Normally, this token will resolve to `arnAttr`, but if the resource is
     * referenced across environments, `arnComponents` will be used to synthesize
     * a concrete ARN with the resource's physical name. Make sure to reference
     * `this.physicalName` in `arnComponents`.
     *
     * @param arnAttr The CFN attribute which resolves to the ARN of the resource.
     * Commonly it will be called "Arn" (e.g. `resource.attrArn`), but sometimes
     * it's the CFN resource's `ref`.
     * @param arnComponents The format of the ARN of this resource. You must
     * reference `this.physicalName` somewhere within the ARN in order for
     * cross-environment references to work.
     *
     */
    getResourceArnAttribute(arnAttr, arnComponents) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ArnComponents(arnComponents);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getResourceArnAttribute);
            }
            throw error;
        }
        return mimicReference(arnAttr, {
            produce: (context) => {
                const consumingStack = stack_1.Stack.of(context.scope);
                if (this.stack.account !== consumingStack.account ||
                    (this.stack.region !== consumingStack.region &&
                        !consumingStack._crossRegionReferences)) {
                    this._enableCrossEnvironment();
                    return this.stack.formatArn(arnComponents);
                }
                else {
                    return arnAttr;
                }
            },
        });
    }
}
_a = JSII_RTTI_SYMBOL_1;
Resource[_a] = { fqn: "@aws-cdk/core.Resource", version: "0.0.0" };
exports.Resource = Resource;
/**
 * Produce a Lazy that is also a Reference (if the base value is a Reference).
 *
 * If the given value is a Reference (or resolves to a Reference), return a new
 * Reference that mimics the same target and display name, but resolves using
 * the logic of the passed lazy.
 *
 * If the given value is NOT a Reference, just return a simple Lazy.
 */
function mimicReference(refSource, producer) {
    const reference = token_1.Tokenization.reverse(refSource, {
        // If this is an ARN concatenation, just fail to extract a reference.
        failConcat: false,
    });
    if (!reference_1.Reference.isReference(reference)) {
        return lazy_1.Lazy.uncachedString(producer);
    }
    return token_1.Token.asString(new class extends reference_1.Reference {
        resolve(context) {
            return producer.produce(context);
        }
    }(reference, reference.target, reference.displayName));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwrQkFBaUQ7QUFDakQsaURBQTZDO0FBQzdDLGlDQUErQztBQUMvQywrRUFBc0c7QUFDdEcsMkNBQXdDO0FBR3hDLG1DQUFnQztBQUNoQyxtQ0FBOEM7QUFFOUMsNkZBQTZGO0FBQzdGLHdDQUF3QztBQUN4QywyQ0FBbUQ7QUFFbkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBd0c3RDs7R0FFRztBQUNILE1BQXNCLFFBQVMsU0FBUSxzQkFBUztJQUM5Qzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBcUI7UUFDNUMsT0FBTyxTQUFTLEtBQUssSUFBSSxJQUFJLE9BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxRQUFRLElBQUksZUFBZSxJQUFJLFNBQVMsQ0FBQztLQUM3RjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFxQjtRQUNqRCxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQywwQkFBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDckc7SUFxQkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF1QixFQUFFO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FuQ0MsUUFBUTs7OztRQXFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtZQUN6RyxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLCtCQUErQixLQUFLLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZKO1FBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFOUQsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzFDLDRFQUE0RTtZQUM1RSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsZUFBUyxDQUFDLGdCQUFnQixDQUFDO1lBQ3pFLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDZCxJQUFJLENBQUMsR0FBRyxHQUFHO1lBQ1QsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUksU0FBUyxFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87WUFDbEUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07U0FDL0QsQ0FBQztRQUVGLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFFdEMsSUFBSSxLQUFLLENBQUMsWUFBWSxJQUFJLElBQUEscURBQTJCLEVBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3pFLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztZQUMvQixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1lBQ25DLFlBQVksR0FBRyxXQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1NBQ25FO2FBQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsYUFBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDeEUsdUNBQXVDO1lBQ3ZDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUN4QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1NBQ3BDO2FBQU07WUFDTCx1RkFBdUY7WUFDdkYsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUM7U0FDckM7UUFFRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDOUIsWUFBWSxHQUFHLGFBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDMUM7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztLQUNsQztJQUVEOzs7Ozs7O09BT0c7SUFDSSx1QkFBdUI7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNoQyxvRUFBb0U7WUFDcEUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLG9DQUFvQztnQkFDeEYsNEZBQTRGLENBQUMsQ0FBQztTQUNqRztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDbEQ7S0FDRjtJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSSxrQkFBa0IsQ0FBQyxNQUFxQjs7Ozs7Ozs7OztRQUM3QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsMEJBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDL0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxrSEFBa0gsQ0FBQyxDQUFDO1NBQ3JJO1FBQ0QsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2xDO0lBRVMsb0JBQW9CO1FBQzVCLE9BQU8sSUFBQSw4Q0FBb0IsRUFBQyxJQUFJLENBQUMsQ0FBQztLQUNuQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDTyx3QkFBd0IsQ0FBQyxRQUFnQjtRQUNqRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLEVBQUU7WUFDOUIsT0FBTyxFQUFFLENBQUMsT0FBd0IsRUFBRSxFQUFFO2dCQUNwQyxNQUFNLGNBQWMsR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFL0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxjQUFjLENBQUMsT0FBTztvQkFDL0MsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxjQUFjLENBQUMsTUFBTTt3QkFDMUMsQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsRUFBRTtvQkFDM0MsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7b0JBQy9CLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDMUI7cUJBQU07b0JBQ0wsT0FBTyxRQUFRLENBQUM7aUJBQ2pCO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDTyx1QkFBdUIsQ0FBQyxPQUFlLEVBQUUsYUFBNEI7Ozs7Ozs7Ozs7UUFDN0UsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFO1lBQzdCLE9BQU8sRUFBRSxDQUFDLE9BQXdCLEVBQUUsRUFBRTtnQkFDcEMsTUFBTSxjQUFjLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9DLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssY0FBYyxDQUFDLE9BQU87b0JBQy9DLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssY0FBYyxDQUFDLE1BQU07d0JBQzFDLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDLEVBQUU7b0JBQzNDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO29CQUMvQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUM1QztxQkFBTTtvQkFDTCxPQUFPLE9BQU8sQ0FBQztpQkFDaEI7WUFDSCxDQUFDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7QUFwTG1CLDRCQUFRO0FBdUw5Qjs7Ozs7Ozs7R0FRRztBQUNILFNBQVMsY0FBYyxDQUFDLFNBQWMsRUFBRSxRQUF5QjtJQUMvRCxNQUFNLFNBQVMsR0FBRyxvQkFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7UUFDaEQscUVBQXFFO1FBQ3JFLFVBQVUsRUFBRSxLQUFLO0tBQ2xCLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUNyQyxPQUFPLFdBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdEM7SUFFRCxPQUFPLGFBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFNLFNBQVEscUJBQVM7UUFDeEMsT0FBTyxDQUFDLE9BQXdCO1lBQ3JDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNsQztLQUNGLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFybkNvbXBvbmVudHMsIEFybkZvcm1hdCB9IGZyb20gJy4vYXJuJztcbmltcG9ydCB7IENmblJlc291cmNlIH0gZnJvbSAnLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgSVN0cmluZ1Byb2R1Y2VyLCBMYXp5IH0gZnJvbSAnLi9sYXp5JztcbmltcG9ydCB7IGdlbmVyYXRlUGh5c2ljYWxOYW1lLCBpc0dlbmVyYXRlZFdoZW5OZWVkZWRNYXJrZXIgfSBmcm9tICcuL3ByaXZhdGUvcGh5c2ljYWwtbmFtZS1nZW5lcmF0b3InO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgUmVtb3ZhbFBvbGljeSB9IGZyb20gJy4vcmVtb3ZhbC1wb2xpY3knO1xuaW1wb3J0IHsgSVJlc29sdmVDb250ZXh0IH0gZnJvbSAnLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5pemF0aW9uIH0gZnJvbSAnLi90b2tlbic7XG5cbi8vIHYyIC0gbGVhdmUgdGhpcyBhcyBhIHNlcGFyYXRlIHNlY3Rpb24gc28gaXQgcmVkdWNlcyBtZXJnZSBjb25mbGljdHMgd2hlbiBjb21wYXQgaXMgcmVtb3ZlZFxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9vcmRlclxuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmNvbnN0IFJFU09VUkNFX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuUmVzb3VyY2UnKTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBlbnZpcm9ubWVudCBhIGdpdmVuIHJlc291cmNlIGxpdmVzIGluLlxuICogVXNlZCBhcyB0aGUgcmV0dXJuIHZhbHVlIGZvciB0aGUgYElSZXNvdXJjZS5lbnZgIHByb3BlcnR5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlRW52aXJvbm1lbnQge1xuICAvKipcbiAgICogVGhlIEFXUyBhY2NvdW50IElEIHRoYXQgdGhpcyByZXNvdXJjZSBiZWxvbmdzIHRvLlxuICAgKiBTaW5jZSB0aGlzIGNhbiBiZSBhIFRva2VuXG4gICAqIChmb3IgZXhhbXBsZSwgd2hlbiB0aGUgYWNjb3VudCBpcyBDbG91ZEZvcm1hdGlvbidzIEFXUzo6QWNjb3VudElkIGludHJpbnNpYyksXG4gICAqIG1ha2Ugc3VyZSB0byB1c2UgVG9rZW4uY29tcGFyZVN0cmluZ3MoKVxuICAgKiBpbnN0ZWFkIG9mIGp1c3QgY29tcGFyaW5nIHRoZSB2YWx1ZXMgZm9yIGVxdWFsaXR5LlxuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIHJlZ2lvbiB0aGF0IHRoaXMgcmVzb3VyY2UgYmVsb25ncyB0by5cbiAgICogU2luY2UgdGhpcyBjYW4gYmUgYSBUb2tlblxuICAgKiAoZm9yIGV4YW1wbGUsIHdoZW4gdGhlIHJlZ2lvbiBpcyBDbG91ZEZvcm1hdGlvbidzIEFXUzo6UmVnaW9uIGludHJpbnNpYyksXG4gICAqIG1ha2Ugc3VyZSB0byB1c2UgVG9rZW4uY29tcGFyZVN0cmluZ3MoKVxuICAgKiBpbnN0ZWFkIG9mIGp1c3QgY29tcGFyaW5nIHRoZSB2YWx1ZXMgZm9yIGVxdWFsaXR5LlxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uOiBzdHJpbmc7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgUmVzb3VyY2UgY29uc3RydWN0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElSZXNvdXJjZSBleHRlbmRzIElDb25zdHJ1Y3Qge1xuICAvKipcbiAgICogVGhlIHN0YWNrIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZC5cbiAgICovXG4gIHJlYWRvbmx5IHN0YWNrOiBTdGFjaztcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50IHRoaXMgcmVzb3VyY2UgYmVsb25ncyB0by5cbiAgICogRm9yIHJlc291cmNlcyB0aGF0IGFyZSBjcmVhdGVkIGFuZCBtYW5hZ2VkIGJ5IHRoZSBDREtcbiAgICogKGdlbmVyYWxseSwgdGhvc2UgY3JlYXRlZCBieSBjcmVhdGluZyBuZXcgY2xhc3MgaW5zdGFuY2VzIGxpa2UgUm9sZSwgQnVja2V0LCBldGMuKSxcbiAgICogdGhpcyBpcyBhbHdheXMgdGhlIHNhbWUgYXMgdGhlIGVudmlyb25tZW50IG9mIHRoZSBzdGFjayB0aGV5IGJlbG9uZyB0bztcbiAgICogaG93ZXZlciwgZm9yIGltcG9ydGVkIHJlc291cmNlc1xuICAgKiAodGhvc2Ugb2J0YWluZWQgZnJvbSBzdGF0aWMgbWV0aG9kcyBsaWtlIGZyb21Sb2xlQXJuLCBmcm9tQnVja2V0TmFtZSwgZXRjLiksXG4gICAqIHRoYXQgbWlnaHQgYmUgZGlmZmVyZW50IHRoYW4gdGhlIHN0YWNrIHRoZXkgd2VyZSBpbXBvcnRlZCBpbnRvLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52OiBSZXNvdXJjZUVudmlyb25tZW50O1xuXG4gIC8qKlxuICAgKiBBcHBseSB0aGUgZ2l2ZW4gcmVtb3ZhbCBwb2xpY3kgdG8gdGhpcyByZXNvdXJjZVxuICAgKlxuICAgKiBUaGUgUmVtb3ZhbCBQb2xpY3kgY29udHJvbHMgd2hhdCBoYXBwZW5zIHRvIHRoaXMgcmVzb3VyY2Ugd2hlbiBpdCBzdG9wc1xuICAgKiBiZWluZyBtYW5hZ2VkIGJ5IENsb3VkRm9ybWF0aW9uLCBlaXRoZXIgYmVjYXVzZSB5b3UndmUgcmVtb3ZlZCBpdCBmcm9tIHRoZVxuICAgKiBDREsgYXBwbGljYXRpb24gb3IgYmVjYXVzZSB5b3UndmUgbWFkZSBhIGNoYW5nZSB0aGF0IHJlcXVpcmVzIHRoZSByZXNvdXJjZVxuICAgKiB0byBiZSByZXBsYWNlZC5cbiAgICpcbiAgICogVGhlIHJlc291cmNlIGNhbiBiZSBkZWxldGVkIChgUmVtb3ZhbFBvbGljeS5ERVNUUk9ZYCksIG9yIGxlZnQgaW4geW91ciBBV1NcbiAgICogYWNjb3VudCBmb3IgZGF0YSByZWNvdmVyeSBhbmQgY2xlYW51cCBsYXRlciAoYFJlbW92YWxQb2xpY3kuUkVUQUlOYCkuXG4gICAqL1xuICBhcHBseVJlbW92YWxQb2xpY3kocG9saWN5OiBSZW1vdmFsUG9saWN5KTogdm9pZDtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYFJlc291cmNlYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBwYXNzZWQgaW4gYnkgdXNlcnMgdG8gdGhlIHBoeXNpY2FsIG5hbWUgcHJvcCBvZiB0aGUgcmVzb3VyY2UuXG4gICAqXG4gICAqIC0gYHVuZGVmaW5lZGAgaW1wbGllcyB0aGF0IGEgcGh5c2ljYWwgbmFtZSB3aWxsIGJlIGFsbG9jYXRlZCBieVxuICAgKiAgIENsb3VkRm9ybWF0aW9uIGR1cmluZyBkZXBsb3ltZW50LlxuICAgKiAtIGEgY29uY3JldGUgdmFsdWUgaW1wbGllcyBhIHNwZWNpZmljIHBoeXNpY2FsIG5hbWVcbiAgICogLSBgUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRGAgaXMgYSBtYXJrZXIgdGhhdCBpbmRpY2F0ZXMgdGhhdCBhIHBoeXNpY2FsIHdpbGwgb25seSBiZSBnZW5lcmF0ZWRcbiAgICogICBieSB0aGUgQ0RLIGlmIGl0IGlzIG5lZWRlZCBmb3IgY3Jvc3MtZW52aXJvbm1lbnQgcmVmZXJlbmNlcy4gT3RoZXJ3aXNlLCBpdCB3aWxsIGJlIGFsbG9jYXRlZCBieSBDbG91ZEZvcm1hdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgcGh5c2ljYWwgbmFtZSB3aWxsIGJlIGFsbG9jYXRlZCBieSBDbG91ZEZvcm1hdGlvbiBhdCBkZXBsb3ltZW50IHRpbWVcbiAgICovXG4gIHJlYWRvbmx5IHBoeXNpY2FsTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFXUyBhY2NvdW50IElEIHRoaXMgcmVzb3VyY2UgYmVsb25ncyB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgcmVzb3VyY2UgaXMgaW4gdGhlIHNhbWUgYWNjb3VudCBhcyB0aGUgc3RhY2sgaXQgYmVsb25ncyB0b1xuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFXUyByZWdpb24gdGhpcyByZXNvdXJjZSBiZWxvbmdzIHRvLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSByZXNvdXJjZSBpcyBpbiB0aGUgc2FtZSByZWdpb24gYXMgdGhlIHN0YWNrIGl0IGJlbG9uZ3MgdG9cbiAgICovXG4gIHJlYWRvbmx5IHJlZ2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogQVJOIHRvIGRlZHVjZSByZWdpb24gYW5kIGFjY291bnQgZnJvbVxuICAgKlxuICAgKiBUaGUgQVJOIGlzIHBhcnNlZCBhbmQgdGhlIGFjY291bnQgYW5kIHJlZ2lvbiBhcmUgdGFrZW4gZnJvbSB0aGUgQVJOLlxuICAgKiBUaGlzIHNob3VsZCBiZSB1c2VkIGZvciBpbXBvcnRlZCByZXNvdXJjZXMuXG4gICAqXG4gICAqIENhbm5vdCBiZSBzdXBwbGllZCB0b2dldGhlciB3aXRoIGVpdGhlciBgYWNjb3VudGAgb3IgYHJlZ2lvbmAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGFrZSBlbnZpcm9ubWVudCBmcm9tIGBhY2NvdW50YCwgYHJlZ2lvbmAgcGFyYW1ldGVycywgb3IgdXNlIFN0YWNrIGVudmlyb25tZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnRGcm9tQXJuPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgY29uc3RydWN0IHdoaWNoIHJlcHJlc2VudHMgYW4gQVdTIHJlc291cmNlLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzb3VyY2UgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gY29uc3RydWN0IGlzIGEgUmVzb3VyY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNSZXNvdXJjZShjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBjb25zdHJ1Y3QgaXMgUmVzb3VyY2Uge1xuICAgIHJldHVybiBjb25zdHJ1Y3QgIT09IG51bGwgJiYgdHlwZW9mKGNvbnN0cnVjdCkgPT09ICdvYmplY3QnICYmIFJFU09VUkNFX1NZTUJPTCBpbiBjb25zdHJ1Y3Q7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBjb25zdHJ1Y3Qgd2FzIGNyZWF0ZWQgYnkgQ0RLLCBhbmQgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzT3duZWRSZXNvdXJjZShjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gY29uc3RydWN0Lm5vZGUuZGVmYXVsdENoaWxkID8gQ2ZuUmVzb3VyY2UuaXNDZm5SZXNvdXJjZShjb25zdHJ1Y3Qubm9kZS5kZWZhdWx0Q2hpbGQpIDogZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgc3RhY2s6IFN0YWNrO1xuICBwdWJsaWMgcmVhZG9ubHkgZW52OiBSZXNvdXJjZUVudmlyb25tZW50O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nLWVuY29kZWQgdG9rZW4gdGhhdCByZXNvbHZlcyB0byB0aGUgcGh5c2ljYWwgbmFtZSB0aGF0XG4gICAqIHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlLlxuICAgKlxuICAgKiBUaGlzIHZhbHVlIHdpbGwgcmVzb2x2ZSB0byBvbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICogLSBhIGNvbmNyZXRlIHZhbHVlIChlLmcuIGBcIm15LWF3ZXNvbWUtYnVja2V0XCJgKVxuICAgKiAtIGB1bmRlZmluZWRgLCB3aGVuIGEgbmFtZSBzaG91bGQgYmUgZ2VuZXJhdGVkIGJ5IENsb3VkRm9ybWF0aW9uXG4gICAqIC0gYSBjb25jcmV0ZSBuYW1lIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGR1cmluZyBzeW50aGVzaXMsIGluXG4gICAqICAgY3Jvc3MtZW52aXJvbm1lbnQgc2NlbmFyaW9zLlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHBoeXNpY2FsTmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgX3BoeXNpY2FsTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hbGxvd0Nyb3NzRW52aXJvbm1lbnQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFJlc291cmNlUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAoKHByb3BzLmFjY291bnQgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy5yZWdpb24gIT09IHVuZGVmaW5lZCkgJiYgcHJvcHMuZW52aXJvbm1lbnRGcm9tQXJuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3VwcGx5IGF0IG1vc3Qgb25lIG9mICdhY2NvdW50Jy8ncmVnaW9uJyAoJHtwcm9wcy5hY2NvdW50fS8ke3Byb3BzLnJlZ2lvbn0pIGFuZCAnZW52aXJvbm1lbnRGcm9tQXJuJyAoJHtwcm9wcy5lbnZpcm9ubWVudEZyb21Bcm59KWApO1xuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBSRVNPVVJDRV9TWU1CT0wsIHsgdmFsdWU6IHRydWUgfSk7XG5cbiAgICB0aGlzLnN0YWNrID0gU3RhY2sub2YodGhpcyk7XG5cbiAgICBjb25zdCBwYXJzZWRBcm4gPSBwcm9wcy5lbnZpcm9ubWVudEZyb21Bcm4gP1xuICAgICAgLy8gU2luY2Ugd2Ugb25seSB3YW50IHRoZSByZWdpb24gYW5kIGFjY291bnQsIE5PX1JFU09VUkVfTkFNRSBpcyBnb29kIGVub3VnaFxuICAgICAgdGhpcy5zdGFjay5zcGxpdEFybihwcm9wcy5lbnZpcm9ubWVudEZyb21Bcm4sIEFybkZvcm1hdC5OT19SRVNPVVJDRV9OQU1FKVxuICAgICAgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5lbnYgPSB7XG4gICAgICBhY2NvdW50OiBwcm9wcy5hY2NvdW50ID8/IHBhcnNlZEFybj8uYWNjb3VudCA/PyB0aGlzLnN0YWNrLmFjY291bnQsXG4gICAgICByZWdpb246IHByb3BzLnJlZ2lvbiA/PyBwYXJzZWRBcm4/LnJlZ2lvbiA/PyB0aGlzLnN0YWNrLnJlZ2lvbixcbiAgICB9O1xuXG4gICAgbGV0IHBoeXNpY2FsTmFtZSA9IHByb3BzLnBoeXNpY2FsTmFtZTtcblxuICAgIGlmIChwcm9wcy5waHlzaWNhbE5hbWUgJiYgaXNHZW5lcmF0ZWRXaGVuTmVlZGVkTWFya2VyKHByb3BzLnBoeXNpY2FsTmFtZSkpIHtcbiAgICAgIC8vIGF1dG8tZ2VuZXJhdGUgb25seSBpZiBjcm9zcy1lbnYgaXMgcmVxdWlyZWRcbiAgICAgIHRoaXMuX3BoeXNpY2FsTmFtZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2FsbG93Q3Jvc3NFbnZpcm9ubWVudCA9IHRydWU7XG4gICAgICBwaHlzaWNhbE5hbWUgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHRoaXMuX3BoeXNpY2FsTmFtZSB9KTtcbiAgICB9IGVsc2UgaWYgKHByb3BzLnBoeXNpY2FsTmFtZSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLnBoeXNpY2FsTmFtZSkpIHtcbiAgICAgIC8vIGNvbmNyZXRlIHZhbHVlIHNwZWNpZmllZCBieSB0aGUgdXNlclxuICAgICAgdGhpcy5fcGh5c2ljYWxOYW1lID0gcHJvcHMucGh5c2ljYWxOYW1lO1xuICAgICAgdGhpcy5fYWxsb3dDcm9zc0Vudmlyb25tZW50ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZWl0aGVyIHVuZGVmaW5lZCAoZGVwbG95LXRpbWUpIG9yIGhhcyB0b2tlbnMsIHdoaWNoIG1lYW5zIHdlIGNhbid0IHVzZSBmb3IgY3Jvc3MtZW52XG4gICAgICB0aGlzLl9waHlzaWNhbE5hbWUgPSBwcm9wcy5waHlzaWNhbE5hbWU7XG4gICAgICB0aGlzLl9hbGxvd0Nyb3NzRW52aXJvbm1lbnQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocGh5c2ljYWxOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHBoeXNpY2FsTmFtZSA9IFRva2VuLmFzU3RyaW5nKHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgdGhpcy5waHlzaWNhbE5hbWUgPSBwaHlzaWNhbE5hbWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhpcyByZXNvdXJjZSBpcyByZWZlcmVuY2VkIGFjcm9zcyBlbnZpcm9ubWVudHNcbiAgICogKGFjY291bnQvcmVnaW9uKSB0byBvcmRlciB0byByZXF1ZXN0IHRoYXQgYSBwaHlzaWNhbCBuYW1lIHdpbGwgYmUgZ2VuZXJhdGVkXG4gICAqIGZvciB0aGlzIHJlc291cmNlIGR1cmluZyBzeW50aGVzaXMsIHNvIHRoZSByZXNvdXJjZSBjYW4gYmUgcmVmZXJlbmNlZFxuICAgKiB0aHJvdWdoIGl0J3MgYWJzb2x1dGUgbmFtZS9hcm4uXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9lbmFibGVDcm9zc0Vudmlyb25tZW50KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fYWxsb3dDcm9zc0Vudmlyb25tZW50KSB7XG4gICAgICAvLyBlcnJvciBvdXQgLSBhIGRlcGxveS10aW1lIG5hbWUgY2Fubm90IGJlIHVzZWQgYWNyb3NzIGVudmlyb25tZW50c1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgdXNlIHJlc291cmNlICcke3RoaXMubm9kZS5wYXRofScgaW4gYSBjcm9zcy1lbnZpcm9ubWVudCBmYXNoaW9uLCBgICtcbiAgICAgICAgXCJ0aGUgcmVzb3VyY2UncyBwaHlzaWNhbCBuYW1lIG11c3QgYmUgZXhwbGljaXQgc2V0IG9yIHVzZSBgUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRGBcIik7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9waHlzaWNhbE5hbWUpIHtcbiAgICAgIHRoaXMuX3BoeXNpY2FsTmFtZSA9IHRoaXMuZ2VuZXJhdGVQaHlzaWNhbE5hbWUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdGhlIGdpdmVuIHJlbW92YWwgcG9saWN5IHRvIHRoaXMgcmVzb3VyY2VcbiAgICpcbiAgICogVGhlIFJlbW92YWwgUG9saWN5IGNvbnRyb2xzIHdoYXQgaGFwcGVucyB0byB0aGlzIHJlc291cmNlIHdoZW4gaXQgc3RvcHNcbiAgICogYmVpbmcgbWFuYWdlZCBieSBDbG91ZEZvcm1hdGlvbiwgZWl0aGVyIGJlY2F1c2UgeW91J3ZlIHJlbW92ZWQgaXQgZnJvbSB0aGVcbiAgICogQ0RLIGFwcGxpY2F0aW9uIG9yIGJlY2F1c2UgeW91J3ZlIG1hZGUgYSBjaGFuZ2UgdGhhdCByZXF1aXJlcyB0aGUgcmVzb3VyY2VcbiAgICogdG8gYmUgcmVwbGFjZWQuXG4gICAqXG4gICAqIFRoZSByZXNvdXJjZSBjYW4gYmUgZGVsZXRlZCAoYFJlbW92YWxQb2xpY3kuREVTVFJPWWApLCBvciBsZWZ0IGluIHlvdXIgQVdTXG4gICAqIGFjY291bnQgZm9yIGRhdGEgcmVjb3ZlcnkgYW5kIGNsZWFudXAgbGF0ZXIgKGBSZW1vdmFsUG9saWN5LlJFVEFJTmApLlxuICAgKi9cbiAgcHVibGljIGFwcGx5UmVtb3ZhbFBvbGljeShwb2xpY3k6IFJlbW92YWxQb2xpY3kpIHtcbiAgICBjb25zdCBjaGlsZCA9IHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQ7XG4gICAgaWYgKCFjaGlsZCB8fCAhQ2ZuUmVzb3VyY2UuaXNDZm5SZXNvdXJjZShjaGlsZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFwcGx5IFJlbW92YWxQb2xpY3k6IG5vIGNoaWxkIG9yIG5vdCBhIENmblJlc291cmNlLiBBcHBseSB0aGUgcmVtb3ZhbCBwb2xpY3kgb24gdGhlIENmblJlc291cmNlIGRpcmVjdGx5LicpO1xuICAgIH1cbiAgICBjaGlsZC5hcHBseVJlbW92YWxQb2xpY3kocG9saWN5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZW5lcmF0ZVBoeXNpY2FsTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBnZW5lcmF0ZVBoeXNpY2FsTmFtZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGVudmlyb25tZW50LXNlbnNpdGl2ZSB0b2tlbiB0aGF0IHNob3VsZCBiZSB1c2VkIGZvciB0aGVcbiAgICogcmVzb3VyY2UncyBcIm5hbWVcIiBhdHRyaWJ1dGUgKGUuZy4gYGJ1Y2tldC5idWNrZXROYW1lYCkuXG4gICAqXG4gICAqIE5vcm1hbGx5LCB0aGlzIHRva2VuIHdpbGwgcmVzb2x2ZSB0byBgbmFtZUF0dHJgLCBidXQgaWYgdGhlIHJlc291cmNlIGlzXG4gICAqIHJlZmVyZW5jZWQgYWNyb3NzIGVudmlyb25tZW50cywgaXQgd2lsbCBiZSByZXNvbHZlZCB0byBgdGhpcy5waHlzaWNhbE5hbWVgLFxuICAgKiB3aGljaCB3aWxsIGJlIGEgY29uY3JldGUgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIG5hbWVBdHRyIFRoZSBDRk4gYXR0cmlidXRlIHdoaWNoIHJlc29sdmVzIHRvIHRoZSByZXNvdXJjZSdzIG5hbWUuXG4gICAqIENvbW1vbmx5IHRoaXMgaXMgdGhlIHJlc291cmNlJ3MgYHJlZmAuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKG5hbWVBdHRyOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbWltaWNSZWZlcmVuY2UobmFtZUF0dHIsIHtcbiAgICAgIHByb2R1Y2U6IChjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpID0+IHtcbiAgICAgICAgY29uc3QgY29uc3VtaW5nU3RhY2sgPSBTdGFjay5vZihjb250ZXh0LnNjb3BlKTtcblxuICAgICAgICBpZiAodGhpcy5zdGFjay5hY2NvdW50ICE9PSBjb25zdW1pbmdTdGFjay5hY2NvdW50IHx8XG4gICAgICAgICAgKHRoaXMuc3RhY2sucmVnaW9uICE9PSBjb25zdW1pbmdTdGFjay5yZWdpb24gJiZcbiAgICAgICAgICAgICFjb25zdW1pbmdTdGFjay5fY3Jvc3NSZWdpb25SZWZlcmVuY2VzKSkge1xuICAgICAgICAgIHRoaXMuX2VuYWJsZUNyb3NzRW52aXJvbm1lbnQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5waHlzaWNhbE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5hbWVBdHRyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZW52aXJvbm1lbnQtc2Vuc2l0aXZlIHRva2VuIHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZVxuICAgKiByZXNvdXJjZSdzIFwiQVJOXCIgYXR0cmlidXRlIChlLmcuIGBidWNrZXQuYnVja2V0QXJuYCkuXG4gICAqXG4gICAqIE5vcm1hbGx5LCB0aGlzIHRva2VuIHdpbGwgcmVzb2x2ZSB0byBgYXJuQXR0cmAsIGJ1dCBpZiB0aGUgcmVzb3VyY2UgaXNcbiAgICogcmVmZXJlbmNlZCBhY3Jvc3MgZW52aXJvbm1lbnRzLCBgYXJuQ29tcG9uZW50c2Agd2lsbCBiZSB1c2VkIHRvIHN5bnRoZXNpemVcbiAgICogYSBjb25jcmV0ZSBBUk4gd2l0aCB0aGUgcmVzb3VyY2UncyBwaHlzaWNhbCBuYW1lLiBNYWtlIHN1cmUgdG8gcmVmZXJlbmNlXG4gICAqIGB0aGlzLnBoeXNpY2FsTmFtZWAgaW4gYGFybkNvbXBvbmVudHNgLlxuICAgKlxuICAgKiBAcGFyYW0gYXJuQXR0ciBUaGUgQ0ZOIGF0dHJpYnV0ZSB3aGljaCByZXNvbHZlcyB0byB0aGUgQVJOIG9mIHRoZSByZXNvdXJjZS5cbiAgICogQ29tbW9ubHkgaXQgd2lsbCBiZSBjYWxsZWQgXCJBcm5cIiAoZS5nLiBgcmVzb3VyY2UuYXR0ckFybmApLCBidXQgc29tZXRpbWVzXG4gICAqIGl0J3MgdGhlIENGTiByZXNvdXJjZSdzIGByZWZgLlxuICAgKiBAcGFyYW0gYXJuQ29tcG9uZW50cyBUaGUgZm9ybWF0IG9mIHRoZSBBUk4gb2YgdGhpcyByZXNvdXJjZS4gWW91IG11c3RcbiAgICogcmVmZXJlbmNlIGB0aGlzLnBoeXNpY2FsTmFtZWAgc29tZXdoZXJlIHdpdGhpbiB0aGUgQVJOIGluIG9yZGVyIGZvclxuICAgKiBjcm9zcy1lbnZpcm9ubWVudCByZWZlcmVuY2VzIHRvIHdvcmsuXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUoYXJuQXR0cjogc3RyaW5nLCBhcm5Db21wb25lbnRzOiBBcm5Db21wb25lbnRzKSB7XG4gICAgcmV0dXJuIG1pbWljUmVmZXJlbmNlKGFybkF0dHIsIHtcbiAgICAgIHByb2R1Y2U6IChjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpID0+IHtcbiAgICAgICAgY29uc3QgY29uc3VtaW5nU3RhY2sgPSBTdGFjay5vZihjb250ZXh0LnNjb3BlKTtcbiAgICAgICAgaWYgKHRoaXMuc3RhY2suYWNjb3VudCAhPT0gY29uc3VtaW5nU3RhY2suYWNjb3VudCB8fFxuICAgICAgICAgICh0aGlzLnN0YWNrLnJlZ2lvbiAhPT0gY29uc3VtaW5nU3RhY2sucmVnaW9uICYmXG4gICAgICAgICAgICAhY29uc3VtaW5nU3RhY2suX2Nyb3NzUmVnaW9uUmVmZXJlbmNlcykpIHtcbiAgICAgICAgICB0aGlzLl9lbmFibGVDcm9zc0Vudmlyb25tZW50KCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2suZm9ybWF0QXJuKGFybkNvbXBvbmVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBhcm5BdHRyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogUHJvZHVjZSBhIExhenkgdGhhdCBpcyBhbHNvIGEgUmVmZXJlbmNlIChpZiB0aGUgYmFzZSB2YWx1ZSBpcyBhIFJlZmVyZW5jZSkuXG4gKlxuICogSWYgdGhlIGdpdmVuIHZhbHVlIGlzIGEgUmVmZXJlbmNlIChvciByZXNvbHZlcyB0byBhIFJlZmVyZW5jZSksIHJldHVybiBhIG5ld1xuICogUmVmZXJlbmNlIHRoYXQgbWltaWNzIHRoZSBzYW1lIHRhcmdldCBhbmQgZGlzcGxheSBuYW1lLCBidXQgcmVzb2x2ZXMgdXNpbmdcbiAqIHRoZSBsb2dpYyBvZiB0aGUgcGFzc2VkIGxhenkuXG4gKlxuICogSWYgdGhlIGdpdmVuIHZhbHVlIGlzIE5PVCBhIFJlZmVyZW5jZSwganVzdCByZXR1cm4gYSBzaW1wbGUgTGF6eS5cbiAqL1xuZnVuY3Rpb24gbWltaWNSZWZlcmVuY2UocmVmU291cmNlOiBhbnksIHByb2R1Y2VyOiBJU3RyaW5nUHJvZHVjZXIpOiBzdHJpbmcge1xuICBjb25zdCByZWZlcmVuY2UgPSBUb2tlbml6YXRpb24ucmV2ZXJzZShyZWZTb3VyY2UsIHtcbiAgICAvLyBJZiB0aGlzIGlzIGFuIEFSTiBjb25jYXRlbmF0aW9uLCBqdXN0IGZhaWwgdG8gZXh0cmFjdCBhIHJlZmVyZW5jZS5cbiAgICBmYWlsQ29uY2F0OiBmYWxzZSxcbiAgfSk7XG4gIGlmICghUmVmZXJlbmNlLmlzUmVmZXJlbmNlKHJlZmVyZW5jZSkpIHtcbiAgICByZXR1cm4gTGF6eS51bmNhY2hlZFN0cmluZyhwcm9kdWNlcik7XG4gIH1cblxuICByZXR1cm4gVG9rZW4uYXNTdHJpbmcobmV3IGNsYXNzIGV4dGVuZHMgUmVmZXJlbmNlIHtcbiAgICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgICAgIHJldHVybiBwcm9kdWNlci5wcm9kdWNlKGNvbnRleHQpO1xuICAgIH1cbiAgfShyZWZlcmVuY2UsIHJlZmVyZW5jZS50YXJnZXQsIHJlZmVyZW5jZS5kaXNwbGF5TmFtZSkpO1xufVxuIl19