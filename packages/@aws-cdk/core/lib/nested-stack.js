"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedStack = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const crypto = require("crypto");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const assets_1 = require("./assets");
const cfn_fn_1 = require("./cfn-fn");
const cfn_pseudo_1 = require("./cfn-pseudo");
const cloudformation_generated_1 = require("./cloudformation.generated");
const lazy_1 = require("./lazy");
const names_1 = require("./names");
const removal_policy_1 = require("./removal-policy");
const stack_1 = require("./stack");
const stack_synthesizers_1 = require("./stack-synthesizers");
const token_1 = require("./token");
const NESTED_STACK_SYMBOL = Symbol.for('@aws-cdk/core.NestedStack');
/**
 * A CloudFormation nested stack.
 *
 * When you apply template changes to update a top-level stack, CloudFormation
 * updates the top-level stack and initiates an update to its nested stacks.
 * CloudFormation updates the resources of modified nested stacks, but does not
 * update the resources of unmodified nested stacks.
 *
 * Furthermore, this stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template and uploaded as an asset to S3.
 *
 * Cross references of resource attributes between the parent stack and the
 * nested stack will automatically be translated to stack parameters and
 * outputs.
 *
 */
class NestedStack extends stack_1.Stack {
    constructor(scope, id, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_NestedStackProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NestedStack);
            }
            throw error;
        }
        const parentStack = findParentStack(scope);
        super(scope, id, {
            env: { account: parentStack.account, region: parentStack.region },
            synthesizer: new stack_synthesizers_1.NestedStackSynthesizer(parentStack.synthesizer),
            description: props.description,
            crossRegionReferences: parentStack._crossRegionReferences,
        });
        this._parentStack = parentStack;
        const parentScope = new constructs_1.Construct(scope, id + '.NestedStack');
        Object.defineProperty(this, NESTED_STACK_SYMBOL, { value: true });
        // this is the file name of the synthesized template file within the cloud assembly
        this.templateFile = `${names_1.Names.uniqueId(this)}.nested.template.json`;
        this.parameters = props.parameters || {};
        this.resource = new cloudformation_generated_1.CfnStack(parentScope, `${id}.NestedStackResource`, {
            // This value cannot be cached since it changes during the synthesis phase
            templateUrl: lazy_1.Lazy.uncachedString({ produce: () => this._templateUrl || '<unresolved>' }),
            parameters: lazy_1.Lazy.any({ produce: () => Object.keys(this.parameters).length > 0 ? this.parameters : undefined }),
            notificationArns: props.notificationArns,
            timeoutInMinutes: props.timeout ? props.timeout.toMinutes() : undefined,
        });
        this.resource.applyRemovalPolicy(props.removalPolicy ?? removal_policy_1.RemovalPolicy.DESTROY);
        this.nestedStackResource = this.resource;
        this.node.defaultChild = this.resource;
        // context-aware stack name: if resolved from within this stack, return AWS::StackName
        // if resolved from the outer stack, use the { Ref } of the AWS::CloudFormation::Stack resource
        // which resolves the ARN of the stack. We need to extract the stack name, which is the second
        // component after splitting by "/"
        this._contextualStackName = this.contextualAttribute(cfn_pseudo_1.Aws.STACK_NAME, cfn_fn_1.Fn.select(1, cfn_fn_1.Fn.split('/', this.resource.ref)));
        this._contextualStackId = this.contextualAttribute(cfn_pseudo_1.Aws.STACK_ID, this.resource.ref);
    }
    /**
     * Checks if `x` is an object of type `NestedStack`.
     */
    static isNestedStack(x) {
        return x != null && typeof (x) === 'object' && NESTED_STACK_SYMBOL in x;
    }
    /**
     * An attribute that represents the name of the nested stack.
     *
     * This is a context aware attribute:
     * - If this is referenced from the parent stack, it will return a token that parses the name from the stack ID.
     * - If this is referenced from the context of the nested stack, it will return `{ "Ref": "AWS::StackName" }`
     *
     * Example value: `mystack-mynestedstack-sggfrhxhum7w`
     * @attribute
     */
    get stackName() {
        return this._contextualStackName;
    }
    /**
     * An attribute that represents the ID of the stack.
     *
     * This is a context aware attribute:
     * - If this is referenced from the parent stack, it will return `{ "Ref": "LogicalIdOfNestedStackResource" }`.
     * - If this is referenced from the context of the nested stack, it will return `{ "Ref": "AWS::StackId" }`
     *
     * Example value: `arn:aws:cloudformation:us-east-2:123456789012:stack/mystack-mynestedstack-sggfrhxhum7w/f449b250-b969-11e0-a185-5081d0136786`
     * @attribute
     */
    get stackId() {
        return this._contextualStackId;
    }
    /**
     * Assign a value to one of the nested stack parameters.
     * @param name The parameter name (ID)
     * @param value The value to assign
     */
    setParameter(name, value) {
        this.parameters[name] = value;
    }
    /**
     * Defines an asset at the parent stack which represents the template of this
     * nested stack.
     *
     * This private API is used by `App.prepare()` within a loop that rectifies
     * references every time an asset is added. This is because (at the moment)
     * assets are addressed using CloudFormation parameters.
     *
     * @returns `true` if a new asset was added or `false` if an asset was
     * previously added. When this returns `true`, App will do another reference
     * rectification cycle.
     *
     * @internal
     */
    _prepareTemplateAsset() {
        if (this._templateUrl) {
            return false;
        }
        // When adding tags to nested stack, the tags need to be added to all the resources in
        // in nested stack, which is handled by the `tags` property, But to tag the
        //  tags have to be added in the parent stack CfnStack resource. The CfnStack resource created
        // by this class dont share the same TagManager as that of the one exposed by the `tag` property of the
        //  class, all the tags need to be copied to the CfnStack resource before synthesizing the resource.
        // See https://github.com/aws/aws-cdk/pull/19128
        Object.entries(this.tags.tagValues()).forEach(([key, value]) => {
            this.resource.tags.setTag(key, value);
        });
        const cfn = JSON.stringify(this._toCloudFormation());
        const templateHash = crypto.createHash('sha256').update(cfn).digest('hex');
        const templateLocation = this._parentStack.synthesizer.addFileAsset({
            packaging: assets_1.FileAssetPackaging.FILE,
            sourceHash: templateHash,
            fileName: this.templateFile,
        });
        this.addResourceMetadata(this.resource, 'TemplateURL');
        // if bucketName/objectKey are cfn parameters from a stack other than the parent stack, they will
        // be resolved as cross-stack references like any other (see "multi" tests).
        this._templateUrl = `https://s3.${this._parentStack.region}.${this._parentStack.urlSuffix}/${templateLocation.bucketName}/${templateLocation.objectKey}`;
        return true;
    }
    contextualAttribute(innerValue, outerValue) {
        return token_1.Token.asString({
            resolve: (context) => {
                if (stack_1.Stack.of(context.scope) === this) {
                    return innerValue;
                }
                else {
                    return outerValue;
                }
            },
        });
    }
    addResourceMetadata(resource, resourceProperty) {
        if (!this.node.tryGetContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT)) {
            return; // not enabled
        }
        // tell tools such as SAM CLI that the "TemplateURL" property of this resource
        // points to the nested stack template for local emulation
        resource.cfnOptions.metadata = resource.cfnOptions.metadata || {};
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_PATH_KEY] = this.templateFile;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY] = resourceProperty;
    }
}
exports.NestedStack = NestedStack;
_a = JSII_RTTI_SYMBOL_1;
NestedStack[_a] = { fqn: "@aws-cdk/core.NestedStack", version: "0.0.0" };
/**
 * Validates the scope for a nested stack. Nested stacks must be defined within the scope of another `Stack`.
 */
function findParentStack(scope) {
    if (!scope) {
        throw new Error('Nested stacks cannot be defined as a root construct');
    }
    const parentStack = constructs_1.Node.of(scope).scopes.reverse().find(p => stack_1.Stack.isStack(p));
    if (!parentStack) {
        throw new Error('Nested stacks must be defined within scope of another non-nested stack');
    }
    return parentStack;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmVzdGVkLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlDQUFpQztBQUNqQyx5Q0FBeUM7QUFDekMsMkNBQTZDO0FBQzdDLHFDQUE4QztBQUM5QyxxQ0FBOEI7QUFDOUIsNkNBQW1DO0FBRW5DLHlFQUFzRDtBQUV0RCxpQ0FBOEI7QUFDOUIsbUNBQWdDO0FBQ2hDLHFEQUFpRDtBQUVqRCxtQ0FBZ0M7QUFDaEMsNkRBQThEO0FBQzlELG1DQUFnQztBQUVoQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQThEcEU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFhLFdBQVksU0FBUSxhQUFLO0lBbUJwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQTBCLEVBQUc7Ozs7OzsrQ0FuQjVELFdBQVc7Ozs7UUFvQnBCLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUzQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ2pFLFdBQVcsRUFBRSxJQUFJLDJDQUFzQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7WUFDaEUsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLHFCQUFxQixFQUFFLFdBQVcsQ0FBQyxzQkFBc0I7U0FDMUQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFFaEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxzQkFBUyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUM7UUFFOUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUs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O0tBQzNGO0lBRUQsT0FBTyxXQUFvQixDQUFDO0FBQzlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEZpbGVBc3NldFBhY2thZ2luZyB9IGZyb20gJy4vYXNzZXRzJztcbmltcG9ydCB7IEZuIH0gZnJvbSAnLi9jZm4tZm4nO1xuaW1wb3J0IHsgQXdzIH0gZnJvbSAnLi9jZm4tcHNldWRvJztcbmltcG9ydCB7IENmblJlc291cmNlIH0gZnJvbSAnLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgQ2ZuU3RhY2sgfSBmcm9tICcuL2Nsb3VkZm9ybWF0aW9uLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJy4vZHVyYXRpb24nO1xuaW1wb3J0IHsgTGF6eSB9IGZyb20gJy4vbGF6eSc7XG5pbXBvcnQgeyBOYW1lcyB9IGZyb20gJy4vbmFtZXMnO1xuaW1wb3J0IHsgUmVtb3ZhbFBvbGljeSB9IGZyb20gJy4vcmVtb3ZhbC1wb2xpY3knO1xuaW1wb3J0IHsgSVJlc29sdmVDb250ZXh0IH0gZnJvbSAnLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQgeyBOZXN0ZWRTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnLi9zdGFjay1zeW50aGVzaXplcnMnO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuL3Rva2VuJztcblxuY29uc3QgTkVTVEVEX1NUQUNLX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuTmVzdGVkU3RhY2snKTtcblxuLyoqXG4gKiBJbml0aWFsaXphdGlvbiBwcm9wcyBmb3IgdGhlIGBOZXN0ZWRTdGFja2AgY29uc3RydWN0LlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZXN0ZWRTdGFja1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzZXQgdmFsdWUgcGFpcnMgdGhhdCByZXByZXNlbnQgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvIENsb3VkRm9ybWF0aW9uXG4gICAqIHdoZW4gdGhpcyBuZXN0ZWQgc3RhY2sgaXMgY3JlYXRlZC4gRWFjaCBwYXJhbWV0ZXIgaGFzIGEgbmFtZSBjb3JyZXNwb25kaW5nXG4gICAqIHRvIGEgcGFyYW1ldGVyIGRlZmluZWQgaW4gdGhlIGVtYmVkZGVkIHRlbXBsYXRlIGFuZCBhIHZhbHVlIHJlcHJlc2VudGluZ1xuICAgKiB0aGUgdmFsdWUgdGhhdCB5b3Ugd2FudCB0byBzZXQgZm9yIHRoZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFRoZSBuZXN0ZWQgc3RhY2sgY29uc3RydWN0IHdpbGwgYXV0b21hdGljYWxseSBzeW50aGVzaXplIHBhcmFtZXRlcnMgaW4gb3JkZXJcbiAgICogdG8gYmluZCByZWZlcmVuY2VzIGZyb20gdGhlIHBhcmVudCBzdGFjayhzKSBpbnRvIHRoZSBuZXN0ZWQgc3RhY2suXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gdXNlci1kZWZpbmVkIHBhcmFtZXRlcnMgYXJlIHBhc3NlZCB0byB0aGUgbmVzdGVkIHN0YWNrXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogVGhlIGxlbmd0aCBvZiB0aW1lIHRoYXQgQ2xvdWRGb3JtYXRpb24gd2FpdHMgZm9yIHRoZSBuZXN0ZWQgc3RhY2sgdG8gcmVhY2hcbiAgICogdGhlIENSRUFURV9DT01QTEVURSBzdGF0ZS5cbiAgICpcbiAgICogV2hlbiBDbG91ZEZvcm1hdGlvbiBkZXRlY3RzIHRoYXQgdGhlIG5lc3RlZCBzdGFjayBoYXMgcmVhY2hlZCB0aGVcbiAgICogQ1JFQVRFX0NPTVBMRVRFIHN0YXRlLCBpdCBtYXJrcyB0aGUgbmVzdGVkIHN0YWNrIHJlc291cmNlIGFzXG4gICAqIENSRUFURV9DT01QTEVURSBpbiB0aGUgcGFyZW50IHN0YWNrIGFuZCByZXN1bWVzIGNyZWF0aW5nIHRoZSBwYXJlbnQgc3RhY2suXG4gICAqIElmIHRoZSB0aW1lb3V0IHBlcmlvZCBleHBpcmVzIGJlZm9yZSB0aGUgbmVzdGVkIHN0YWNrIHJlYWNoZXNcbiAgICogQ1JFQVRFX0NPTVBMRVRFLCBDbG91ZEZvcm1hdGlvbiBtYXJrcyB0aGUgbmVzdGVkIHN0YWNrIGFzIGZhaWxlZCBhbmQgcm9sbHNcbiAgICogYmFjayBib3RoIHRoZSBuZXN0ZWQgc3RhY2sgYW5kIHBhcmVudCBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyB0aW1lb3V0XG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBTaW1wbGUgTm90aWZpY2F0aW9uIFNlcnZpY2UgKFNOUykgdG9waWNzIHRvIHB1Ymxpc2ggc3RhY2sgcmVsYXRlZFxuICAgKiBldmVudHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm90aWZpY2F0aW9ucyBhcmUgbm90IHNlbnQgZm9yIHRoaXMgc3RhY2suXG4gICAqL1xuICByZWFkb25seSBub3RpZmljYXRpb25Bcm5zPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFBvbGljeSB0byBhcHBseSB3aGVuIHRoZSBuZXN0ZWQgc3RhY2sgaXMgcmVtb3ZlZFxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBpcyBgRGVzdHJveWAsIGJlY2F1c2UgYWxsIFJlbW92YWwgUG9saWNpZXMgb2YgcmVzb3VyY2VzIGluc2lkZSB0aGVcbiAgICogTmVzdGVkIFN0YWNrIHNob3VsZCBhbHJlYWR5IGhhdmUgYmVlbiBzZXQgY29ycmVjdGx5LiBZb3Ugbm9ybWFsbHkgc2hvdWxkXG4gICAqIG5vdCBuZWVkIHRvIHNldCB0aGlzIHZhbHVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBSZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBSZW1vdmFsUG9saWN5O1xuXG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gbmVzdGVkIHN0YWNrLlxuICpcbiAqIFdoZW4geW91IGFwcGx5IHRlbXBsYXRlIGNoYW5nZXMgdG8gdXBkYXRlIGEgdG9wLWxldmVsIHN0YWNrLCBDbG91ZEZvcm1hdGlvblxuICogdXBkYXRlcyB0aGUgdG9wLWxldmVsIHN0YWNrIGFuZCBpbml0aWF0ZXMgYW4gdXBkYXRlIHRvIGl0cyBuZXN0ZWQgc3RhY2tzLlxuICogQ2xvdWRGb3JtYXRpb24gdXBkYXRlcyB0aGUgcmVzb3VyY2VzIG9mIG1vZGlmaWVkIG5lc3RlZCBzdGFja3MsIGJ1dCBkb2VzIG5vdFxuICogdXBkYXRlIHRoZSByZXNvdXJjZXMgb2YgdW5tb2RpZmllZCBuZXN0ZWQgc3RhY2tzLlxuICpcbiAqIEZ1cnRoZXJtb3JlLCB0aGlzIHN0YWNrIHdpbGwgbm90IGJlIHRyZWF0ZWQgYXMgYW4gaW5kZXBlbmRlbnQgZGVwbG95bWVudFxuICogYXJ0aWZhY3QgKHdvbid0IGJlIGxpc3RlZCBpbiBcImNkayBsaXN0XCIgb3IgZGVwbG95YWJsZSB0aHJvdWdoIFwiY2RrIGRlcGxveVwiKSxcbiAqIGJ1dCByYXRoZXIgb25seSBzeW50aGVzaXplZCBhcyBhIHRlbXBsYXRlIGFuZCB1cGxvYWRlZCBhcyBhbiBhc3NldCB0byBTMy5cbiAqXG4gKiBDcm9zcyByZWZlcmVuY2VzIG9mIHJlc291cmNlIGF0dHJpYnV0ZXMgYmV0d2VlbiB0aGUgcGFyZW50IHN0YWNrIGFuZCB0aGVcbiAqIG5lc3RlZCBzdGFjayB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgdHJhbnNsYXRlZCB0byBzdGFjayBwYXJhbWV0ZXJzIGFuZFxuICogb3V0cHV0cy5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXN0ZWRTdGFjayBleHRlbmRzIFN0YWNrIHtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB4YCBpcyBhbiBvYmplY3Qgb2YgdHlwZSBgTmVzdGVkU3RhY2tgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc05lc3RlZFN0YWNrKHg6IGFueSk6IHggaXMgTmVzdGVkU3RhY2sge1xuICAgIHJldHVybiB4ICE9IG51bGwgJiYgdHlwZW9mKHgpID09PSAnb2JqZWN0JyAmJiBORVNURURfU1RBQ0tfU1lNQk9MIGluIHg7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgdGVtcGxhdGVGaWxlOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBuZXN0ZWRTdGFja1Jlc291cmNlPzogQ2ZuUmVzb3VyY2U7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBwYXJhbWV0ZXJzOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgcHJpdmF0ZSByZWFkb25seSByZXNvdXJjZTogQ2ZuU3RhY2s7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbnRleHR1YWxTdGFja0lkOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbnRleHR1YWxTdGFja05hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBfdGVtcGxhdGVVcmw/OiBzdHJpbmc7XG4gIHByaXZhdGUgX3BhcmVudFN0YWNrOiBTdGFjaztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTmVzdGVkU3RhY2tQcm9wcyA9IHsgfSkge1xuICAgIGNvbnN0IHBhcmVudFN0YWNrID0gZmluZFBhcmVudFN0YWNrKHNjb3BlKTtcblxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgZW52OiB7IGFjY291bnQ6IHBhcmVudFN0YWNrLmFjY291bnQsIHJlZ2lvbjogcGFyZW50U3RhY2sucmVnaW9uIH0sXG4gICAgICBzeW50aGVzaXplcjogbmV3IE5lc3RlZFN0YWNrU3ludGhlc2l6ZXIocGFyZW50U3RhY2suc3ludGhlc2l6ZXIpLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiBwYXJlbnRTdGFjay5fY3Jvc3NSZWdpb25SZWZlcmVuY2VzLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fcGFyZW50U3RhY2sgPSBwYXJlbnRTdGFjaztcblxuICAgIGNvbnN0IHBhcmVudFNjb3BlID0gbmV3IENvbnN0cnVjdChzY29wZSwgaWQgKyAnLk5lc3RlZFN0YWNrJyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgTkVTVEVEX1NUQUNLX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuICAgIC8vIHRoaXMgaXMgdGhlIGZpbGUgbmFtZSBvZiB0aGUgc3ludGhlc2l6ZWQgdGVtcGxhdGUgZmlsZSB3aXRoaW4gdGhlIGNsb3VkIGFzc2VtYmx5XG4gICAgdGhpcy50ZW1wbGF0ZUZpbGUgPSBgJHtOYW1lcy51bmlxdWVJZCh0aGlzKX0ubmVzdGVkLnRlbXBsYXRlLmpzb25gO1xuXG4gICAgdGhpcy5wYXJhbWV0ZXJzID0gcHJvcHMucGFyYW1ldGVycyB8fCB7fTtcblxuICAgIHRoaXMucmVzb3VyY2UgPSBuZXcgQ2ZuU3RhY2socGFyZW50U2NvcGUsIGAke2lkfS5OZXN0ZWRTdGFja1Jlc291cmNlYCwge1xuICAgICAgLy8gVGhpcyB2YWx1ZSBjYW5ub3QgYmUgY2FjaGVkIHNpbmNlIGl0IGNoYW5nZXMgZHVyaW5nIHRoZSBzeW50aGVzaXMgcGhhc2VcbiAgICAgIHRlbXBsYXRlVXJsOiBMYXp5LnVuY2FjaGVkU3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gdGhpcy5fdGVtcGxhdGVVcmwgfHwgJzx1bnJlc29sdmVkPicgfSksXG4gICAgICBwYXJhbWV0ZXJzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IE9iamVjdC5rZXlzKHRoaXMucGFyYW1ldGVycykubGVuZ3RoID4gMCA/IHRoaXMucGFyYW1ldGVycyA6IHVuZGVmaW5lZCB9KSxcbiAgICAgIG5vdGlmaWNhdGlvbkFybnM6IHByb3BzLm5vdGlmaWNhdGlvbkFybnMsXG4gICAgICB0aW1lb3V0SW5NaW51dGVzOiBwcm9wcy50aW1lb3V0ID8gcHJvcHMudGltZW91dC50b01pbnV0ZXMoKSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgICB0aGlzLnJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5ID8/IFJlbW92YWxQb2xpY3kuREVTVFJPWSk7XG5cbiAgICB0aGlzLm5lc3RlZFN0YWNrUmVzb3VyY2UgPSB0aGlzLnJlc291cmNlO1xuICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSB0aGlzLnJlc291cmNlO1xuXG4gICAgLy8gY29udGV4dC1hd2FyZSBzdGFjayBuYW1lOiBpZiByZXNvbHZlZCBmcm9tIHdpdGhpbiB0aGlzIHN0YWNrLCByZXR1cm4gQVdTOjpTdGFja05hbWVcbiAgICAvLyBpZiByZXNvbHZlZCBmcm9tIHRoZSBvdXRlciBzdGFjaywgdXNlIHRoZSB7IFJlZiB9IG9mIHRoZSBBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjayByZXNvdXJjZVxuICAgIC8vIHdoaWNoIHJlc29sdmVzIHRoZSBBUk4gb2YgdGhlIHN0YWNrLiBXZSBuZWVkIHRvIGV4dHJhY3QgdGhlIHN0YWNrIG5hbWUsIHdoaWNoIGlzIHRoZSBzZWNvbmRcbiAgICAvLyBjb21wb25lbnQgYWZ0ZXIgc3BsaXR0aW5nIGJ5IFwiL1wiXG4gICAgdGhpcy5fY29udGV4dHVhbFN0YWNrTmFtZSA9IHRoaXMuY29udGV4dHVhbEF0dHJpYnV0ZShBd3MuU1RBQ0tfTkFNRSwgRm4uc2VsZWN0KDEsIEZuLnNwbGl0KCcvJywgdGhpcy5yZXNvdXJjZS5yZWYpKSk7XG4gICAgdGhpcy5fY29udGV4dHVhbFN0YWNrSWQgPSB0aGlzLmNvbnRleHR1YWxBdHRyaWJ1dGUoQXdzLlNUQUNLX0lELCB0aGlzLnJlc291cmNlLnJlZik7XG4gIH1cblxuICAvKipcbiAgICogQW4gYXR0cmlidXRlIHRoYXQgcmVwcmVzZW50cyB0aGUgbmFtZSBvZiB0aGUgbmVzdGVkIHN0YWNrLlxuICAgKlxuICAgKiBUaGlzIGlzIGEgY29udGV4dCBhd2FyZSBhdHRyaWJ1dGU6XG4gICAqIC0gSWYgdGhpcyBpcyByZWZlcmVuY2VkIGZyb20gdGhlIHBhcmVudCBzdGFjaywgaXQgd2lsbCByZXR1cm4gYSB0b2tlbiB0aGF0IHBhcnNlcyB0aGUgbmFtZSBmcm9tIHRoZSBzdGFjayBJRC5cbiAgICogLSBJZiB0aGlzIGlzIHJlZmVyZW5jZWQgZnJvbSB0aGUgY29udGV4dCBvZiB0aGUgbmVzdGVkIHN0YWNrLCBpdCB3aWxsIHJldHVybiBgeyBcIlJlZlwiOiBcIkFXUzo6U3RhY2tOYW1lXCIgfWBcbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYG15c3RhY2stbXluZXN0ZWRzdGFjay1zZ2dmcmh4aHVtN3dgXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyBnZXQgc3RhY2tOYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9jb250ZXh0dWFsU3RhY2tOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGF0dHJpYnV0ZSB0aGF0IHJlcHJlc2VudHMgdGhlIElEIG9mIHRoZSBzdGFjay5cbiAgICpcbiAgICogVGhpcyBpcyBhIGNvbnRleHQgYXdhcmUgYXR0cmlidXRlOlxuICAgKiAtIElmIHRoaXMgaXMgcmVmZXJlbmNlZCBmcm9tIHRoZSBwYXJlbnQgc3RhY2ssIGl0IHdpbGwgcmV0dXJuIGB7IFwiUmVmXCI6IFwiTG9naWNhbElkT2ZOZXN0ZWRTdGFja1Jlc291cmNlXCIgfWAuXG4gICAqIC0gSWYgdGhpcyBpcyByZWZlcmVuY2VkIGZyb20gdGhlIGNvbnRleHQgb2YgdGhlIG5lc3RlZCBzdGFjaywgaXQgd2lsbCByZXR1cm4gYHsgXCJSZWZcIjogXCJBV1M6OlN0YWNrSWRcIiB9YFxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgYXJuOmF3czpjbG91ZGZvcm1hdGlvbjp1cy1lYXN0LTI6MTIzNDU2Nzg5MDEyOnN0YWNrL215c3RhY2stbXluZXN0ZWRzdGFjay1zZ2dmcmh4aHVtN3cvZjQ0OWIyNTAtYjk2OS0xMWUwLWExODUtNTA4MWQwMTM2Nzg2YFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgZ2V0IHN0YWNrSWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRleHR1YWxTdGFja0lkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbiBhIHZhbHVlIHRvIG9uZSBvZiB0aGUgbmVzdGVkIHN0YWNrIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBwYXJhbWV0ZXIgbmFtZSAoSUQpXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduXG4gICAqL1xuICBwdWJsaWMgc2V0UGFyYW1ldGVyKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMucGFyYW1ldGVyc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gYXNzZXQgYXQgdGhlIHBhcmVudCBzdGFjayB3aGljaCByZXByZXNlbnRzIHRoZSB0ZW1wbGF0ZSBvZiB0aGlzXG4gICAqIG5lc3RlZCBzdGFjay5cbiAgICpcbiAgICogVGhpcyBwcml2YXRlIEFQSSBpcyB1c2VkIGJ5IGBBcHAucHJlcGFyZSgpYCB3aXRoaW4gYSBsb29wIHRoYXQgcmVjdGlmaWVzXG4gICAqIHJlZmVyZW5jZXMgZXZlcnkgdGltZSBhbiBhc3NldCBpcyBhZGRlZC4gVGhpcyBpcyBiZWNhdXNlIChhdCB0aGUgbW9tZW50KVxuICAgKiBhc3NldHMgYXJlIGFkZHJlc3NlZCB1c2luZyBDbG91ZEZvcm1hdGlvbiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgYSBuZXcgYXNzZXQgd2FzIGFkZGVkIG9yIGBmYWxzZWAgaWYgYW4gYXNzZXQgd2FzXG4gICAqIHByZXZpb3VzbHkgYWRkZWQuIFdoZW4gdGhpcyByZXR1cm5zIGB0cnVlYCwgQXBwIHdpbGwgZG8gYW5vdGhlciByZWZlcmVuY2VcbiAgICogcmVjdGlmaWNhdGlvbiBjeWNsZS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3ByZXBhcmVUZW1wbGF0ZUFzc2V0KCkge1xuICAgIGlmICh0aGlzLl90ZW1wbGF0ZVVybCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFdoZW4gYWRkaW5nIHRhZ3MgdG8gbmVzdGVkIHN0YWNrLCB0aGUgdGFncyBuZWVkIHRvIGJlIGFkZGVkIHRvIGFsbCB0aGUgcmVzb3VyY2VzIGluXG4gICAgLy8gaW4gbmVzdGVkIHN0YWNrLCB3aGljaCBpcyBoYW5kbGVkIGJ5IHRoZSBgdGFnc2AgcHJvcGVydHksIEJ1dCB0byB0YWcgdGhlXG4gICAgLy8gIHRhZ3MgaGF2ZSB0byBiZSBhZGRlZCBpbiB0aGUgcGFyZW50IHN0YWNrIENmblN0YWNrIHJlc291cmNlLiBUaGUgQ2ZuU3RhY2sgcmVzb3VyY2UgY3JlYXRlZFxuICAgIC8vIGJ5IHRoaXMgY2xhc3MgZG9udCBzaGFyZSB0aGUgc2FtZSBUYWdNYW5hZ2VyIGFzIHRoYXQgb2YgdGhlIG9uZSBleHBvc2VkIGJ5IHRoZSBgdGFnYCBwcm9wZXJ0eSBvZiB0aGVcbiAgICAvLyAgY2xhc3MsIGFsbCB0aGUgdGFncyBuZWVkIHRvIGJlIGNvcGllZCB0byB0aGUgQ2ZuU3RhY2sgcmVzb3VyY2UgYmVmb3JlIHN5bnRoZXNpemluZyB0aGUgcmVzb3VyY2UuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9wdWxsLzE5MTI4XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy50YWdzLnRhZ1ZhbHVlcygpKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIHRoaXMucmVzb3VyY2UudGFncy5zZXRUYWcoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjZm4gPSBKU09OLnN0cmluZ2lmeSh0aGlzLl90b0Nsb3VkRm9ybWF0aW9uKCkpO1xuICAgIGNvbnN0IHRlbXBsYXRlSGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoY2ZuKS5kaWdlc3QoJ2hleCcpO1xuXG4gICAgY29uc3QgdGVtcGxhdGVMb2NhdGlvbiA9IHRoaXMuX3BhcmVudFN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCh7XG4gICAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgICAgc291cmNlSGFzaDogdGVtcGxhdGVIYXNoLFxuICAgICAgZmlsZU5hbWU6IHRoaXMudGVtcGxhdGVGaWxlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRSZXNvdXJjZU1ldGFkYXRhKHRoaXMucmVzb3VyY2UsICdUZW1wbGF0ZVVSTCcpO1xuXG4gICAgLy8gaWYgYnVja2V0TmFtZS9vYmplY3RLZXkgYXJlIGNmbiBwYXJhbWV0ZXJzIGZyb20gYSBzdGFjayBvdGhlciB0aGFuIHRoZSBwYXJlbnQgc3RhY2ssIHRoZXkgd2lsbFxuICAgIC8vIGJlIHJlc29sdmVkIGFzIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMgbGlrZSBhbnkgb3RoZXIgKHNlZSBcIm11bHRpXCIgdGVzdHMpLlxuICAgIHRoaXMuX3RlbXBsYXRlVXJsID0gYGh0dHBzOi8vczMuJHt0aGlzLl9wYXJlbnRTdGFjay5yZWdpb259LiR7dGhpcy5fcGFyZW50U3RhY2sudXJsU3VmZml4fS8ke3RlbXBsYXRlTG9jYXRpb24uYnVja2V0TmFtZX0vJHt0ZW1wbGF0ZUxvY2F0aW9uLm9iamVjdEtleX1gO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb250ZXh0dWFsQXR0cmlidXRlKGlubmVyVmFsdWU6IHN0cmluZywgb3V0ZXJWYWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHtcbiAgICAgIHJlc29sdmU6IChjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpID0+IHtcbiAgICAgICAgaWYgKFN0YWNrLm9mKGNvbnRleHQuc2NvcGUpID09PSB0aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGlubmVyVmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG91dGVyVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFkZFJlc291cmNlTWV0YWRhdGEocmVzb3VyY2U6IENmblJlc291cmNlLCByZXNvdXJjZVByb3BlcnR5OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMubm9kZS50cnlHZXRDb250ZXh0KGN4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0VOQUJMRURfQ09OVEVYVCkpIHtcbiAgICAgIHJldHVybjsgLy8gbm90IGVuYWJsZWRcbiAgICB9XG5cbiAgICAvLyB0ZWxsIHRvb2xzIHN1Y2ggYXMgU0FNIENMSSB0aGF0IHRoZSBcIlRlbXBsYXRlVVJMXCIgcHJvcGVydHkgb2YgdGhpcyByZXNvdXJjZVxuICAgIC8vIHBvaW50cyB0byB0aGUgbmVzdGVkIHN0YWNrIHRlbXBsYXRlIGZvciBsb2NhbCBlbXVsYXRpb25cbiAgICByZXNvdXJjZS5jZm5PcHRpb25zLm1ldGFkYXRhID0gcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YSB8fCB7IH07XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QQVRIX0tFWV0gPSB0aGlzLnRlbXBsYXRlRmlsZTtcbiAgICByZXNvdXJjZS5jZm5PcHRpb25zLm1ldGFkYXRhW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BST1BFUlRZX0tFWV0gPSByZXNvdXJjZVByb3BlcnR5O1xuICB9XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIHRoZSBzY29wZSBmb3IgYSBuZXN0ZWQgc3RhY2suIE5lc3RlZCBzdGFja3MgbXVzdCBiZSBkZWZpbmVkIHdpdGhpbiB0aGUgc2NvcGUgb2YgYW5vdGhlciBgU3RhY2tgLlxuICovXG5mdW5jdGlvbiBmaW5kUGFyZW50U3RhY2soc2NvcGU6IENvbnN0cnVjdCk6IFN0YWNrIHtcbiAgaWYgKCFzY29wZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVzdGVkIHN0YWNrcyBjYW5ub3QgYmUgZGVmaW5lZCBhcyBhIHJvb3QgY29uc3RydWN0Jyk7XG4gIH1cblxuICBjb25zdCBwYXJlbnRTdGFjayA9IE5vZGUub2Yoc2NvcGUpLnNjb3Blcy5yZXZlcnNlKCkuZmluZChwID0+IFN0YWNrLmlzU3RhY2socCkpO1xuICBpZiAoIXBhcmVudFN0YWNrKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0ZWQgc3RhY2tzIG11c3QgYmUgZGVmaW5lZCB3aXRoaW4gc2NvcGUgb2YgYW5vdGhlciBub24tbmVzdGVkIHN0YWNrJyk7XG4gIH1cblxuICByZXR1cm4gcGFyZW50U3RhY2sgYXMgU3RhY2s7XG59XG4iXX0=