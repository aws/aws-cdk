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
        if (props.physicalName && physical_name_generator_1.isGeneratedWhenNeededMarker(props.physicalName)) {
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
        return physical_name_generator_1.generatePhysicalName(this);
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
exports.Resource = Resource;
_a = JSII_RTTI_SYMBOL_1;
Resource[_a] = { fqn: "@aws-cdk/core.Resource", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwrQkFBaUQ7QUFDakQsaURBQTZDO0FBQzdDLGlDQUErQztBQUMvQywrRUFBc0c7QUFDdEcsMkNBQXdDO0FBR3hDLG1DQUFnQztBQUNoQyxtQ0FBOEM7QUFFOUMsNkZBQTZGO0FBQzdGLHdDQUF3QztBQUN4QywyQ0FBbUQ7QUFFbkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBd0c3RDs7R0FFRztBQUNILE1BQXNCLFFBQVMsU0FBUSxzQkFBUztJQWtDOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF1QixFQUFFO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FuQ0MsUUFBUTs7OztRQXFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtZQUN6RyxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLCtCQUErQixLQUFLLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZKO1FBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFOUQsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzFDLDRFQUE0RTtZQUM1RSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FB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c0IsQ0FBQyxFQUFFO29CQUMzQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztvQkFDL0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDNUM7cUJBQU07b0JBQ0wsT0FBTyxPQUFPLENBQUM7aUJBQ2hCO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FBQztLQUNKOztBQXBMSCw0QkFxTEM7OztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBUyxjQUFjLENBQUMsU0FBYyxFQUFFLFFBQXlCO0lBQy9ELE1BQU0sU0FBUyxHQUFHLG9CQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtRQUNoRCxxRUFBcUU7UUFDckUsVUFBVSxFQUFFLEtBQUs7S0FDbEIsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLHFCQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3JDLE9BQU8sV0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN0QztJQUVELE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQU0sU0FBUSxxQkFBUztRQUMvQyxPQUFPLENBQUMsT0FBd0I7WUFDOUIsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xDO0tBQ0YsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJuQ29tcG9uZW50cywgQXJuRm9ybWF0IH0gZnJvbSAnLi9hcm4nO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBJU3RyaW5nUHJvZHVjZXIsIExhenkgfSBmcm9tICcuL2xhenknO1xuaW1wb3J0IHsgZ2VuZXJhdGVQaHlzaWNhbE5hbWUsIGlzR2VuZXJhdGVkV2hlbk5lZWRlZE1hcmtlciB9IGZyb20gJy4vcHJpdmF0ZS9waHlzaWNhbC1uYW1lLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBSZWZlcmVuY2UgfSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5IH0gZnJvbSAnLi9yZW1vdmFsLXBvbGljeSc7XG5pbXBvcnQgeyBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IFRva2VuLCBUb2tlbml6YXRpb24gfSBmcm9tICcuL3Rva2VuJztcblxuLy8gdjIgLSBsZWF2ZSB0aGlzIGFzIGEgc2VwYXJhdGUgc2VjdGlvbiBzbyBpdCByZWR1Y2VzIG1lcmdlIGNvbmZsaWN0cyB3aGVuIGNvbXBhdCBpcyByZW1vdmVkXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L29yZGVyXG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuY29uc3QgUkVTT1VSQ0VfU1lNQk9MID0gU3ltYm9sLmZvcignQGF3cy1jZGsvY29yZS5SZXNvdXJjZScpO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGVudmlyb25tZW50IGEgZ2l2ZW4gcmVzb3VyY2UgbGl2ZXMgaW4uXG4gKiBVc2VkIGFzIHRoZSByZXR1cm4gdmFsdWUgZm9yIHRoZSBgSVJlc291cmNlLmVudmAgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzb3VyY2VFbnZpcm9ubWVudCB7XG4gIC8qKlxuICAgKiBUaGUgQVdTIGFjY291bnQgSUQgdGhhdCB0aGlzIHJlc291cmNlIGJlbG9uZ3MgdG8uXG4gICAqIFNpbmNlIHRoaXMgY2FuIGJlIGEgVG9rZW5cbiAgICogKGZvciBleGFtcGxlLCB3aGVuIHRoZSBhY2NvdW50IGlzIENsb3VkRm9ybWF0aW9uJ3MgQVdTOjpBY2NvdW50SWQgaW50cmluc2ljKSxcbiAgICogbWFrZSBzdXJlIHRvIHVzZSBUb2tlbi5jb21wYXJlU3RyaW5ncygpXG4gICAqIGluc3RlYWQgb2YganVzdCBjb21wYXJpbmcgdGhlIHZhbHVlcyBmb3IgZXF1YWxpdHkuXG4gICAqL1xuICByZWFkb25seSBhY2NvdW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgcmVnaW9uIHRoYXQgdGhpcyByZXNvdXJjZSBiZWxvbmdzIHRvLlxuICAgKiBTaW5jZSB0aGlzIGNhbiBiZSBhIFRva2VuXG4gICAqIChmb3IgZXhhbXBsZSwgd2hlbiB0aGUgcmVnaW9uIGlzIENsb3VkRm9ybWF0aW9uJ3MgQVdTOjpSZWdpb24gaW50cmluc2ljKSxcbiAgICogbWFrZSBzdXJlIHRvIHVzZSBUb2tlbi5jb21wYXJlU3RyaW5ncygpXG4gICAqIGluc3RlYWQgb2YganVzdCBjb21wYXJpbmcgdGhlIHZhbHVlcyBmb3IgZXF1YWxpdHkuXG4gICAqL1xuICByZWFkb25seSByZWdpb246IHN0cmluZztcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBSZXNvdXJjZSBjb25zdHJ1Y3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVJlc291cmNlIGV4dGVuZHMgSUNvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBUaGUgc3RhY2sgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhY2s6IFN0YWNrO1xuXG4gIC8qKlxuICAgKiBUaGUgZW52aXJvbm1lbnQgdGhpcyByZXNvdXJjZSBiZWxvbmdzIHRvLlxuICAgKiBGb3IgcmVzb3VyY2VzIHRoYXQgYXJlIGNyZWF0ZWQgYW5kIG1hbmFnZWQgYnkgdGhlIENES1xuICAgKiAoZ2VuZXJhbGx5LCB0aG9zZSBjcmVhdGVkIGJ5IGNyZWF0aW5nIG5ldyBjbGFzcyBpbnN0YW5jZXMgbGlrZSBSb2xlLCBCdWNrZXQsIGV0Yy4pLFxuICAgKiB0aGlzIGlzIGFsd2F5cyB0aGUgc2FtZSBhcyB0aGUgZW52aXJvbm1lbnQgb2YgdGhlIHN0YWNrIHRoZXkgYmVsb25nIHRvO1xuICAgKiBob3dldmVyLCBmb3IgaW1wb3J0ZWQgcmVzb3VyY2VzXG4gICAqICh0aG9zZSBvYnRhaW5lZCBmcm9tIHN0YXRpYyBtZXRob2RzIGxpa2UgZnJvbVJvbGVBcm4sIGZyb21CdWNrZXROYW1lLCBldGMuKSxcbiAgICogdGhhdCBtaWdodCBiZSBkaWZmZXJlbnQgdGhhbiB0aGUgc3RhY2sgdGhleSB3ZXJlIGltcG9ydGVkIGludG8uXG4gICAqL1xuICByZWFkb25seSBlbnY6IFJlc291cmNlRW52aXJvbm1lbnQ7XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBnaXZlbiByZW1vdmFsIHBvbGljeSB0byB0aGlzIHJlc291cmNlXG4gICAqXG4gICAqIFRoZSBSZW1vdmFsIFBvbGljeSBjb250cm9scyB3aGF0IGhhcHBlbnMgdG8gdGhpcyByZXNvdXJjZSB3aGVuIGl0IHN0b3BzXG4gICAqIGJlaW5nIG1hbmFnZWQgYnkgQ2xvdWRGb3JtYXRpb24sIGVpdGhlciBiZWNhdXNlIHlvdSd2ZSByZW1vdmVkIGl0IGZyb20gdGhlXG4gICAqIENESyBhcHBsaWNhdGlvbiBvciBiZWNhdXNlIHlvdSd2ZSBtYWRlIGEgY2hhbmdlIHRoYXQgcmVxdWlyZXMgdGhlIHJlc291cmNlXG4gICAqIHRvIGJlIHJlcGxhY2VkLlxuICAgKlxuICAgKiBUaGUgcmVzb3VyY2UgY2FuIGJlIGRlbGV0ZWQgKGBSZW1vdmFsUG9saWN5LkRFU1RST1lgKSwgb3IgbGVmdCBpbiB5b3VyIEFXU1xuICAgKiBhY2NvdW50IGZvciBkYXRhIHJlY292ZXJ5IGFuZCBjbGVhbnVwIGxhdGVyIChgUmVtb3ZhbFBvbGljeS5SRVRBSU5gKS5cbiAgICovXG4gIGFwcGx5UmVtb3ZhbFBvbGljeShwb2xpY3k6IFJlbW92YWxQb2xpY3kpOiB2b2lkO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBgUmVzb3VyY2VgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIHZhbHVlIHBhc3NlZCBpbiBieSB1c2VycyB0byB0aGUgcGh5c2ljYWwgbmFtZSBwcm9wIG9mIHRoZSByZXNvdXJjZS5cbiAgICpcbiAgICogLSBgdW5kZWZpbmVkYCBpbXBsaWVzIHRoYXQgYSBwaHlzaWNhbCBuYW1lIHdpbGwgYmUgYWxsb2NhdGVkIGJ5XG4gICAqICAgQ2xvdWRGb3JtYXRpb24gZHVyaW5nIGRlcGxveW1lbnQuXG4gICAqIC0gYSBjb25jcmV0ZSB2YWx1ZSBpbXBsaWVzIGEgc3BlY2lmaWMgcGh5c2ljYWwgbmFtZVxuICAgKiAtIGBQaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVEYCBpcyBhIG1hcmtlciB0aGF0IGluZGljYXRlcyB0aGF0IGEgcGh5c2ljYWwgd2lsbCBvbmx5IGJlIGdlbmVyYXRlZFxuICAgKiAgIGJ5IHRoZSBDREsgaWYgaXQgaXMgbmVlZGVkIGZvciBjcm9zcy1lbnZpcm9ubWVudCByZWZlcmVuY2VzLiBPdGhlcndpc2UsIGl0IHdpbGwgYmUgYWxsb2NhdGVkIGJ5IENsb3VkRm9ybWF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBwaHlzaWNhbCBuYW1lIHdpbGwgYmUgYWxsb2NhdGVkIGJ5IENsb3VkRm9ybWF0aW9uIGF0IGRlcGxveW1lbnQgdGltZVxuICAgKi9cbiAgcmVhZG9ubHkgcGh5c2ljYWxOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIGFjY291bnQgSUQgdGhpcyByZXNvdXJjZSBiZWxvbmdzIHRvLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSByZXNvdXJjZSBpcyBpbiB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBzdGFjayBpdCBiZWxvbmdzIHRvXG4gICAqL1xuICByZWFkb25seSBhY2NvdW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIHJlZ2lvbiB0aGlzIHJlc291cmNlIGJlbG9uZ3MgdG8uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIHJlc291cmNlIGlzIGluIHRoZSBzYW1lIHJlZ2lvbiBhcyB0aGUgc3RhY2sgaXQgYmVsb25ncyB0b1xuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBUk4gdG8gZGVkdWNlIHJlZ2lvbiBhbmQgYWNjb3VudCBmcm9tXG4gICAqXG4gICAqIFRoZSBBUk4gaXMgcGFyc2VkIGFuZCB0aGUgYWNjb3VudCBhbmQgcmVnaW9uIGFyZSB0YWtlbiBmcm9tIHRoZSBBUk4uXG4gICAqIFRoaXMgc2hvdWxkIGJlIHVzZWQgZm9yIGltcG9ydGVkIHJlc291cmNlcy5cbiAgICpcbiAgICogQ2Fubm90IGJlIHN1cHBsaWVkIHRvZ2V0aGVyIHdpdGggZWl0aGVyIGBhY2NvdW50YCBvciBgcmVnaW9uYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0YWtlIGVudmlyb25tZW50IGZyb20gYGFjY291bnRgLCBgcmVnaW9uYCBwYXJhbWV0ZXJzLCBvciB1c2UgU3RhY2sgZW52aXJvbm1lbnQuXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudEZyb21Bcm4/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBjb25zdHJ1Y3Qgd2hpY2ggcmVwcmVzZW50cyBhbiBBV1MgcmVzb3VyY2UuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXNvdXJjZSBleHRlbmRzIENvbnN0cnVjdCBpbXBsZW1lbnRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiBjb25zdHJ1Y3QgaXMgYSBSZXNvdXJjZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc1Jlc291cmNlKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IGNvbnN0cnVjdCBpcyBSZXNvdXJjZSB7XG4gICAgcmV0dXJuIGNvbnN0cnVjdCAhPT0gbnVsbCAmJiB0eXBlb2YoY29uc3RydWN0KSA9PT0gJ29iamVjdCcgJiYgUkVTT1VSQ0VfU1lNQk9MIGluIGNvbnN0cnVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGNvbnN0cnVjdCB3YXMgY3JlYXRlZCBieSBDREssIGFuZCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNPd25lZFJlc291cmNlKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjb25zdHJ1Y3Qubm9kZS5kZWZhdWx0Q2hpbGQgPyBDZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKGNvbnN0cnVjdC5ub2RlLmRlZmF1bHRDaGlsZCkgOiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBzdGFjazogU3RhY2s7XG4gIHB1YmxpYyByZWFkb25seSBlbnY6IFJlc291cmNlRW52aXJvbm1lbnQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmctZW5jb2RlZCB0b2tlbiB0aGF0IHJlc29sdmVzIHRvIHRoZSBwaHlzaWNhbCBuYW1lIHRoYXRcbiAgICogc2hvdWxkIGJlIHBhc3NlZCB0byB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UuXG4gICAqXG4gICAqIFRoaXMgdmFsdWUgd2lsbCByZXNvbHZlIHRvIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAtIGEgY29uY3JldGUgdmFsdWUgKGUuZy4gYFwibXktYXdlc29tZS1idWNrZXRcImApXG4gICAqIC0gYHVuZGVmaW5lZGAsIHdoZW4gYSBuYW1lIHNob3VsZCBiZSBnZW5lcmF0ZWQgYnkgQ2xvdWRGb3JtYXRpb25cbiAgICogLSBhIGNvbmNyZXRlIG5hbWUgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgZHVyaW5nIHN5bnRoZXNpcywgaW5cbiAgICogICBjcm9zcy1lbnZpcm9ubWVudCBzY2VuYXJpb3MuXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgcGh5c2ljYWxOYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfcGh5c2ljYWxOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FsbG93Q3Jvc3NFbnZpcm9ubWVudDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUmVzb3VyY2VQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmICgocHJvcHMuYWNjb3VudCAhPT0gdW5kZWZpbmVkIHx8IHByb3BzLnJlZ2lvbiAhPT0gdW5kZWZpbmVkKSAmJiBwcm9wcy5lbnZpcm9ubWVudEZyb21Bcm4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTdXBwbHkgYXQgbW9zdCBvbmUgb2YgJ2FjY291bnQnLydyZWdpb24nICgke3Byb3BzLmFjY291bnR9LyR7cHJvcHMucmVnaW9ufSkgYW5kICdlbnZpcm9ubWVudEZyb21Bcm4nICgke3Byb3BzLmVudmlyb25tZW50RnJvbUFybn0pYCk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFJFU09VUkNFX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuICAgIHRoaXMuc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIGNvbnN0IHBhcnNlZEFybiA9IHByb3BzLmVudmlyb25tZW50RnJvbUFybiA/XG4gICAgICAvLyBTaW5jZSB3ZSBvbmx5IHdhbnQgdGhlIHJlZ2lvbiBhbmQgYWNjb3VudCwgTk9fUkVTT1VSRV9OQU1FIGlzIGdvb2QgZW5vdWdoXG4gICAgICB0aGlzLnN0YWNrLnNwbGl0QXJuKHByb3BzLmVudmlyb25tZW50RnJvbUFybiwgQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUUpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLmVudiA9IHtcbiAgICAgIGFjY291bnQ6IHByb3BzLmFjY291bnQgPz8gcGFyc2VkQXJuPy5hY2NvdW50ID8/IHRoaXMuc3RhY2suYWNjb3VudCxcbiAgICAgIHJlZ2lvbjogcHJvcHMucmVnaW9uID8/IHBhcnNlZEFybj8ucmVnaW9uID8/IHRoaXMuc3RhY2sucmVnaW9uLFxuICAgIH07XG5cbiAgICBsZXQgcGh5c2ljYWxOYW1lID0gcHJvcHMucGh5c2ljYWxOYW1lO1xuXG4gICAgaWYgKHByb3BzLnBoeXNpY2FsTmFtZSAmJiBpc0dlbmVyYXRlZFdoZW5OZWVkZWRNYXJrZXIocHJvcHMucGh5c2ljYWxOYW1lKSkge1xuICAgICAgLy8gYXV0by1nZW5lcmF0ZSBvbmx5IGlmIGNyb3NzLWVudiBpcyByZXF1aXJlZFxuICAgICAgdGhpcy5fcGh5c2ljYWxOYW1lID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fYWxsb3dDcm9zc0Vudmlyb25tZW50ID0gdHJ1ZTtcbiAgICAgIHBoeXNpY2FsTmFtZSA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gdGhpcy5fcGh5c2ljYWxOYW1lIH0pO1xuICAgIH0gZWxzZSBpZiAocHJvcHMucGh5c2ljYWxOYW1lICYmICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMucGh5c2ljYWxOYW1lKSkge1xuICAgICAgLy8gY29uY3JldGUgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSB1c2VyXG4gICAgICB0aGlzLl9waHlzaWNhbE5hbWUgPSBwcm9wcy5waHlzaWNhbE5hbWU7XG4gICAgICB0aGlzLl9hbGxvd0Nyb3NzRW52aXJvbm1lbnQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlaXRoZXIgdW5kZWZpbmVkIChkZXBsb3ktdGltZSkgb3IgaGFzIHRva2Vucywgd2hpY2ggbWVhbnMgd2UgY2FuJ3QgdXNlIGZvciBjcm9zcy1lbnZcbiAgICAgIHRoaXMuX3BoeXNpY2FsTmFtZSA9IHByb3BzLnBoeXNpY2FsTmFtZTtcbiAgICAgIHRoaXMuX2FsbG93Q3Jvc3NFbnZpcm9ubWVudCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwaHlzaWNhbE5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcGh5c2ljYWxOYW1lID0gVG9rZW4uYXNTdHJpbmcodW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICB0aGlzLnBoeXNpY2FsTmFtZSA9IHBoeXNpY2FsTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGlzIHJlc291cmNlIGlzIHJlZmVyZW5jZWQgYWNyb3NzIGVudmlyb25tZW50c1xuICAgKiAoYWNjb3VudC9yZWdpb24pIHRvIG9yZGVyIHRvIHJlcXVlc3QgdGhhdCBhIHBoeXNpY2FsIG5hbWUgd2lsbCBiZSBnZW5lcmF0ZWRcbiAgICogZm9yIHRoaXMgcmVzb3VyY2UgZHVyaW5nIHN5bnRoZXNpcywgc28gdGhlIHJlc291cmNlIGNhbiBiZSByZWZlcmVuY2VkXG4gICAqIHRocm91Z2ggaXQncyBhYnNvbHV0ZSBuYW1lL2Fybi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2VuYWJsZUNyb3NzRW52aXJvbm1lbnQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hbGxvd0Nyb3NzRW52aXJvbm1lbnQpIHtcbiAgICAgIC8vIGVycm9yIG91dCAtIGEgZGVwbG95LXRpbWUgbmFtZSBjYW5ub3QgYmUgdXNlZCBhY3Jvc3MgZW52aXJvbm1lbnRzXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCB1c2UgcmVzb3VyY2UgJyR7dGhpcy5ub2RlLnBhdGh9JyBpbiBhIGNyb3NzLWVudmlyb25tZW50IGZhc2hpb24sIGAgK1xuICAgICAgICBcInRoZSByZXNvdXJjZSdzIHBoeXNpY2FsIG5hbWUgbXVzdCBiZSBleHBsaWNpdCBzZXQgb3IgdXNlIGBQaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVEYFwiKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3BoeXNpY2FsTmFtZSkge1xuICAgICAgdGhpcy5fcGh5c2ljYWxOYW1lID0gdGhpcy5nZW5lcmF0ZVBoeXNpY2FsTmFtZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSB0aGUgZ2l2ZW4gcmVtb3ZhbCBwb2xpY3kgdG8gdGhpcyByZXNvdXJjZVxuICAgKlxuICAgKiBUaGUgUmVtb3ZhbCBQb2xpY3kgY29udHJvbHMgd2hhdCBoYXBwZW5zIHRvIHRoaXMgcmVzb3VyY2Ugd2hlbiBpdCBzdG9wc1xuICAgKiBiZWluZyBtYW5hZ2VkIGJ5IENsb3VkRm9ybWF0aW9uLCBlaXRoZXIgYmVjYXVzZSB5b3UndmUgcmVtb3ZlZCBpdCBmcm9tIHRoZVxuICAgKiBDREsgYXBwbGljYXRpb24gb3IgYmVjYXVzZSB5b3UndmUgbWFkZSBhIGNoYW5nZSB0aGF0IHJlcXVpcmVzIHRoZSByZXNvdXJjZVxuICAgKiB0byBiZSByZXBsYWNlZC5cbiAgICpcbiAgICogVGhlIHJlc291cmNlIGNhbiBiZSBkZWxldGVkIChgUmVtb3ZhbFBvbGljeS5ERVNUUk9ZYCksIG9yIGxlZnQgaW4geW91ciBBV1NcbiAgICogYWNjb3VudCBmb3IgZGF0YSByZWNvdmVyeSBhbmQgY2xlYW51cCBsYXRlciAoYFJlbW92YWxQb2xpY3kuUkVUQUlOYCkuXG4gICAqL1xuICBwdWJsaWMgYXBwbHlSZW1vdmFsUG9saWN5KHBvbGljeTogUmVtb3ZhbFBvbGljeSkge1xuICAgIGNvbnN0IGNoaWxkID0gdGhpcy5ub2RlLmRlZmF1bHRDaGlsZDtcbiAgICBpZiAoIWNoaWxkIHx8ICFDZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKGNoaWxkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYXBwbHkgUmVtb3ZhbFBvbGljeTogbm8gY2hpbGQgb3Igbm90IGEgQ2ZuUmVzb3VyY2UuIEFwcGx5IHRoZSByZW1vdmFsIHBvbGljeSBvbiB0aGUgQ2ZuUmVzb3VyY2UgZGlyZWN0bHkuJyk7XG4gICAgfVxuICAgIGNoaWxkLmFwcGx5UmVtb3ZhbFBvbGljeShwb2xpY3kpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdlbmVyYXRlUGh5c2ljYWxOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdlbmVyYXRlUGh5c2ljYWxOYW1lKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZW52aXJvbm1lbnQtc2Vuc2l0aXZlIHRva2VuIHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZVxuICAgKiByZXNvdXJjZSdzIFwibmFtZVwiIGF0dHJpYnV0ZSAoZS5nLiBgYnVja2V0LmJ1Y2tldE5hbWVgKS5cbiAgICpcbiAgICogTm9ybWFsbHksIHRoaXMgdG9rZW4gd2lsbCByZXNvbHZlIHRvIGBuYW1lQXR0cmAsIGJ1dCBpZiB0aGUgcmVzb3VyY2UgaXNcbiAgICogcmVmZXJlbmNlZCBhY3Jvc3MgZW52aXJvbm1lbnRzLCBpdCB3aWxsIGJlIHJlc29sdmVkIHRvIGB0aGlzLnBoeXNpY2FsTmFtZWAsXG4gICAqIHdoaWNoIHdpbGwgYmUgYSBjb25jcmV0ZSBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZUF0dHIgVGhlIENGTiBhdHRyaWJ1dGUgd2hpY2ggcmVzb2x2ZXMgdG8gdGhlIHJlc291cmNlJ3MgbmFtZS5cbiAgICogQ29tbW9ubHkgdGhpcyBpcyB0aGUgcmVzb3VyY2UncyBgcmVmYC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUobmFtZUF0dHI6IHN0cmluZykge1xuICAgIHJldHVybiBtaW1pY1JlZmVyZW5jZShuYW1lQXR0ciwge1xuICAgICAgcHJvZHVjZTogKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkgPT4ge1xuICAgICAgICBjb25zdCBjb25zdW1pbmdTdGFjayA9IFN0YWNrLm9mKGNvbnRleHQuc2NvcGUpO1xuXG4gICAgICAgIGlmICh0aGlzLnN0YWNrLmFjY291bnQgIT09IGNvbnN1bWluZ1N0YWNrLmFjY291bnQgfHxcbiAgICAgICAgICAodGhpcy5zdGFjay5yZWdpb24gIT09IGNvbnN1bWluZ1N0YWNrLnJlZ2lvbiAmJlxuICAgICAgICAgICAgIWNvbnN1bWluZ1N0YWNrLl9jcm9zc1JlZ2lvblJlZmVyZW5jZXMpKSB7XG4gICAgICAgICAgdGhpcy5fZW5hYmxlQ3Jvc3NFbnZpcm9ubWVudCgpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnBoeXNpY2FsTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmFtZUF0dHI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbnZpcm9ubWVudC1zZW5zaXRpdmUgdG9rZW4gdGhhdCBzaG91bGQgYmUgdXNlZCBmb3IgdGhlXG4gICAqIHJlc291cmNlJ3MgXCJBUk5cIiBhdHRyaWJ1dGUgKGUuZy4gYGJ1Y2tldC5idWNrZXRBcm5gKS5cbiAgICpcbiAgICogTm9ybWFsbHksIHRoaXMgdG9rZW4gd2lsbCByZXNvbHZlIHRvIGBhcm5BdHRyYCwgYnV0IGlmIHRoZSByZXNvdXJjZSBpc1xuICAgKiByZWZlcmVuY2VkIGFjcm9zcyBlbnZpcm9ubWVudHMsIGBhcm5Db21wb25lbnRzYCB3aWxsIGJlIHVzZWQgdG8gc3ludGhlc2l6ZVxuICAgKiBhIGNvbmNyZXRlIEFSTiB3aXRoIHRoZSByZXNvdXJjZSdzIHBoeXNpY2FsIG5hbWUuIE1ha2Ugc3VyZSB0byByZWZlcmVuY2VcbiAgICogYHRoaXMucGh5c2ljYWxOYW1lYCBpbiBgYXJuQ29tcG9uZW50c2AuXG4gICAqXG4gICAqIEBwYXJhbSBhcm5BdHRyIFRoZSBDRk4gYXR0cmlidXRlIHdoaWNoIHJlc29sdmVzIHRvIHRoZSBBUk4gb2YgdGhlIHJlc291cmNlLlxuICAgKiBDb21tb25seSBpdCB3aWxsIGJlIGNhbGxlZCBcIkFyblwiIChlLmcuIGByZXNvdXJjZS5hdHRyQXJuYCksIGJ1dCBzb21ldGltZXNcbiAgICogaXQncyB0aGUgQ0ZOIHJlc291cmNlJ3MgYHJlZmAuXG4gICAqIEBwYXJhbSBhcm5Db21wb25lbnRzIFRoZSBmb3JtYXQgb2YgdGhlIEFSTiBvZiB0aGlzIHJlc291cmNlLiBZb3UgbXVzdFxuICAgKiByZWZlcmVuY2UgYHRoaXMucGh5c2ljYWxOYW1lYCBzb21ld2hlcmUgd2l0aGluIHRoZSBBUk4gaW4gb3JkZXIgZm9yXG4gICAqIGNyb3NzLWVudmlyb25tZW50IHJlZmVyZW5jZXMgdG8gd29yay5cbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBnZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShhcm5BdHRyOiBzdHJpbmcsIGFybkNvbXBvbmVudHM6IEFybkNvbXBvbmVudHMpIHtcbiAgICByZXR1cm4gbWltaWNSZWZlcmVuY2UoYXJuQXR0ciwge1xuICAgICAgcHJvZHVjZTogKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkgPT4ge1xuICAgICAgICBjb25zdCBjb25zdW1pbmdTdGFjayA9IFN0YWNrLm9mKGNvbnRleHQuc2NvcGUpO1xuICAgICAgICBpZiAodGhpcy5zdGFjay5hY2NvdW50ICE9PSBjb25zdW1pbmdTdGFjay5hY2NvdW50IHx8XG4gICAgICAgICAgKHRoaXMuc3RhY2sucmVnaW9uICE9PSBjb25zdW1pbmdTdGFjay5yZWdpb24gJiZcbiAgICAgICAgICAgICFjb25zdW1pbmdTdGFjay5fY3Jvc3NSZWdpb25SZWZlcmVuY2VzKSkge1xuICAgICAgICAgIHRoaXMuX2VuYWJsZUNyb3NzRW52aXJvbm1lbnQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdGFjay5mb3JtYXRBcm4oYXJuQ29tcG9uZW50cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGFybkF0dHI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9kdWNlIGEgTGF6eSB0aGF0IGlzIGFsc28gYSBSZWZlcmVuY2UgKGlmIHRoZSBiYXNlIHZhbHVlIGlzIGEgUmVmZXJlbmNlKS5cbiAqXG4gKiBJZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgYSBSZWZlcmVuY2UgKG9yIHJlc29sdmVzIHRvIGEgUmVmZXJlbmNlKSwgcmV0dXJuIGEgbmV3XG4gKiBSZWZlcmVuY2UgdGhhdCBtaW1pY3MgdGhlIHNhbWUgdGFyZ2V0IGFuZCBkaXNwbGF5IG5hbWUsIGJ1dCByZXNvbHZlcyB1c2luZ1xuICogdGhlIGxvZ2ljIG9mIHRoZSBwYXNzZWQgbGF6eS5cbiAqXG4gKiBJZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgTk9UIGEgUmVmZXJlbmNlLCBqdXN0IHJldHVybiBhIHNpbXBsZSBMYXp5LlxuICovXG5mdW5jdGlvbiBtaW1pY1JlZmVyZW5jZShyZWZTb3VyY2U6IGFueSwgcHJvZHVjZXI6IElTdHJpbmdQcm9kdWNlcik6IHN0cmluZyB7XG4gIGNvbnN0IHJlZmVyZW5jZSA9IFRva2VuaXphdGlvbi5yZXZlcnNlKHJlZlNvdXJjZSwge1xuICAgIC8vIElmIHRoaXMgaXMgYW4gQVJOIGNvbmNhdGVuYXRpb24sIGp1c3QgZmFpbCB0byBleHRyYWN0IGEgcmVmZXJlbmNlLlxuICAgIGZhaWxDb25jYXQ6IGZhbHNlLFxuICB9KTtcbiAgaWYgKCFSZWZlcmVuY2UuaXNSZWZlcmVuY2UocmVmZXJlbmNlKSkge1xuICAgIHJldHVybiBMYXp5LnVuY2FjaGVkU3RyaW5nKHByb2R1Y2VyKTtcbiAgfVxuXG4gIHJldHVybiBUb2tlbi5hc1N0cmluZyhuZXcgY2xhc3MgZXh0ZW5kcyBSZWZlcmVuY2Uge1xuICAgIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgICByZXR1cm4gcHJvZHVjZXIucHJvZHVjZShjb250ZXh0KTtcbiAgICB9XG4gIH0ocmVmZXJlbmNlLCByZWZlcmVuY2UudGFyZ2V0LCByZWZlcmVuY2UuZGlzcGxheU5hbWUpKTtcbn1cbiJdfQ==