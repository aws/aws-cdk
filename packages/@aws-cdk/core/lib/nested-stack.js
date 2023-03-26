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
    /**
     * Checks if `x` is an object of type `NestedStack`.
     */
    static isNestedStack(x) {
        return x != null && typeof (x) === 'object' && NESTED_STACK_SYMBOL in x;
    }
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
_a = JSII_RTTI_SYMBOL_1;
NestedStack[_a] = { fqn: "@aws-cdk/core.NestedStack", version: "0.0.0" };
exports.NestedStack = NestedStack;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmVzdGVkLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlDQUFpQztBQUNqQyx5Q0FBeUM7QUFDekMsMkNBQTZDO0FBQzdDLHFDQUE4QztBQUM5QyxxQ0FBOEI7QUFDOUIsNkNBQW1DO0FBRW5DLHlFQUFzRDtBQUV0RCxpQ0FBOEI7QUFDOUIsbUNBQWdDO0FBQ2hDLHFEQUFpRDtBQUVqRCxtQ0FBZ0M7QUFDaEMsNkRBQThEO0FBQzlELG1DQUFnQztBQUVoQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQThEcEU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFhLFdBQVksU0FBUSxhQUFLO0lBRXBDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFNO1FBQ2hDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxPQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLG1CQUFtQixJQUFJLENBQUMsQ0FBQztLQUN4RTtJQVlELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBMEIsRUFBRzs7Ozs7OytDQW5CNUQsV0FBVzs7OztRQW9CcEIsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDakUsV0FBVyxFQUFFLElBQUksMkNBQXNCLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztZQUNoRSxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIscUJBQXFCLEVBQUUsV0FBVyxDQUFDLHNCQUFzQjtTQUMxRCxDQUFDLENBQUM7UUFFSCxJQUFJ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QUMzRjtJQUVELE9BQU8sV0FBb0IsQ0FBQztBQUM5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBGaWxlQXNzZXRQYWNrYWdpbmcgfSBmcm9tICcuL2Fzc2V0cyc7XG5pbXBvcnQgeyBGbiB9IGZyb20gJy4vY2ZuLWZuJztcbmltcG9ydCB7IEF3cyB9IGZyb20gJy4vY2ZuLXBzZXVkbyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IENmblN0YWNrIH0gZnJvbSAnLi9jbG91ZGZvcm1hdGlvbi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICcuL2R1cmF0aW9uJztcbmltcG9ydCB7IExhenkgfSBmcm9tICcuL2xhenknO1xuaW1wb3J0IHsgTmFtZXMgfSBmcm9tICcuL25hbWVzJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3kgfSBmcm9tICcuL3JlbW92YWwtcG9saWN5JztcbmltcG9ydCB7IElSZXNvbHZlQ29udGV4dCB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHsgTmVzdGVkU3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vc3RhY2stc3ludGhlc2l6ZXJzJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbmNvbnN0IE5FU1RFRF9TVEFDS19TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9jb3JlLk5lc3RlZFN0YWNrJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6YXRpb24gcHJvcHMgZm9yIHRoZSBgTmVzdGVkU3RhY2tgIGNvbnN0cnVjdC5cbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmVzdGVkU3RhY2tQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgc2V0IHZhbHVlIHBhaXJzIHRoYXQgcmVwcmVzZW50IHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byBDbG91ZEZvcm1hdGlvblxuICAgKiB3aGVuIHRoaXMgbmVzdGVkIHN0YWNrIGlzIGNyZWF0ZWQuIEVhY2ggcGFyYW1ldGVyIGhhcyBhIG5hbWUgY29ycmVzcG9uZGluZ1xuICAgKiB0byBhIHBhcmFtZXRlciBkZWZpbmVkIGluIHRoZSBlbWJlZGRlZCB0ZW1wbGF0ZSBhbmQgYSB2YWx1ZSByZXByZXNlbnRpbmdcbiAgICogdGhlIHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gc2V0IGZvciB0aGUgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBUaGUgbmVzdGVkIHN0YWNrIGNvbnN0cnVjdCB3aWxsIGF1dG9tYXRpY2FsbHkgc3ludGhlc2l6ZSBwYXJhbWV0ZXJzIGluIG9yZGVyXG4gICAqIHRvIGJpbmQgcmVmZXJlbmNlcyBmcm9tIHRoZSBwYXJlbnQgc3RhY2socykgaW50byB0aGUgbmVzdGVkIHN0YWNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHVzZXItZGVmaW5lZCBwYXJhbWV0ZXJzIGFyZSBwYXNzZWQgdG8gdGhlIG5lc3RlZCBzdGFja1xuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVycz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIFRoZSBsZW5ndGggb2YgdGltZSB0aGF0IENsb3VkRm9ybWF0aW9uIHdhaXRzIGZvciB0aGUgbmVzdGVkIHN0YWNrIHRvIHJlYWNoXG4gICAqIHRoZSBDUkVBVEVfQ09NUExFVEUgc3RhdGUuXG4gICAqXG4gICAqIFdoZW4gQ2xvdWRGb3JtYXRpb24gZGV0ZWN0cyB0aGF0IHRoZSBuZXN0ZWQgc3RhY2sgaGFzIHJlYWNoZWQgdGhlXG4gICAqIENSRUFURV9DT01QTEVURSBzdGF0ZSwgaXQgbWFya3MgdGhlIG5lc3RlZCBzdGFjayByZXNvdXJjZSBhc1xuICAgKiBDUkVBVEVfQ09NUExFVEUgaW4gdGhlIHBhcmVudCBzdGFjayBhbmQgcmVzdW1lcyBjcmVhdGluZyB0aGUgcGFyZW50IHN0YWNrLlxuICAgKiBJZiB0aGUgdGltZW91dCBwZXJpb2QgZXhwaXJlcyBiZWZvcmUgdGhlIG5lc3RlZCBzdGFjayByZWFjaGVzXG4gICAqIENSRUFURV9DT01QTEVURSwgQ2xvdWRGb3JtYXRpb24gbWFya3MgdGhlIG5lc3RlZCBzdGFjayBhcyBmYWlsZWQgYW5kIHJvbGxzXG4gICAqIGJhY2sgYm90aCB0aGUgbmVzdGVkIHN0YWNrIGFuZCBwYXJlbnQgc3RhY2suXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gdGltZW91dFxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgU2ltcGxlIE5vdGlmaWNhdGlvbiBTZXJ2aWNlIChTTlMpIHRvcGljcyB0byBwdWJsaXNoIHN0YWNrIHJlbGF0ZWRcbiAgICogZXZlbnRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vdGlmaWNhdGlvbnMgYXJlIG5vdCBzZW50IGZvciB0aGlzIHN0YWNrLlxuICAgKi9cbiAgcmVhZG9ubHkgbm90aWZpY2F0aW9uQXJucz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBQb2xpY3kgdG8gYXBwbHkgd2hlbiB0aGUgbmVzdGVkIHN0YWNrIGlzIHJlbW92ZWRcbiAgICpcbiAgICogVGhlIGRlZmF1bHQgaXMgYERlc3Ryb3lgLCBiZWNhdXNlIGFsbCBSZW1vdmFsIFBvbGljaWVzIG9mIHJlc291cmNlcyBpbnNpZGUgdGhlXG4gICAqIE5lc3RlZCBTdGFjayBzaG91bGQgYWxyZWFkeSBoYXZlIGJlZW4gc2V0IGNvcnJlY3RseS4gWW91IG5vcm1hbGx5IHNob3VsZFxuICAgKiBub3QgbmVlZCB0byBzZXQgdGhpcyB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgUmVtb3ZhbFBvbGljeS5ERVNUUk9ZXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcblxuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiBvZiB0aGUgc3RhY2suXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIG5lc3RlZCBzdGFjay5cbiAqXG4gKiBXaGVuIHlvdSBhcHBseSB0ZW1wbGF0ZSBjaGFuZ2VzIHRvIHVwZGF0ZSBhIHRvcC1sZXZlbCBzdGFjaywgQ2xvdWRGb3JtYXRpb25cbiAqIHVwZGF0ZXMgdGhlIHRvcC1sZXZlbCBzdGFjayBhbmQgaW5pdGlhdGVzIGFuIHVwZGF0ZSB0byBpdHMgbmVzdGVkIHN0YWNrcy5cbiAqIENsb3VkRm9ybWF0aW9uIHVwZGF0ZXMgdGhlIHJlc291cmNlcyBvZiBtb2RpZmllZCBuZXN0ZWQgc3RhY2tzLCBidXQgZG9lcyBub3RcbiAqIHVwZGF0ZSB0aGUgcmVzb3VyY2VzIG9mIHVubW9kaWZpZWQgbmVzdGVkIHN0YWNrcy5cbiAqXG4gKiBGdXJ0aGVybW9yZSwgdGhpcyBzdGFjayB3aWxsIG5vdCBiZSB0cmVhdGVkIGFzIGFuIGluZGVwZW5kZW50IGRlcGxveW1lbnRcbiAqIGFydGlmYWN0ICh3b24ndCBiZSBsaXN0ZWQgaW4gXCJjZGsgbGlzdFwiIG9yIGRlcGxveWFibGUgdGhyb3VnaCBcImNkayBkZXBsb3lcIiksXG4gKiBidXQgcmF0aGVyIG9ubHkgc3ludGhlc2l6ZWQgYXMgYSB0ZW1wbGF0ZSBhbmQgdXBsb2FkZWQgYXMgYW4gYXNzZXQgdG8gUzMuXG4gKlxuICogQ3Jvc3MgcmVmZXJlbmNlcyBvZiByZXNvdXJjZSBhdHRyaWJ1dGVzIGJldHdlZW4gdGhlIHBhcmVudCBzdGFjayBhbmQgdGhlXG4gKiBuZXN0ZWQgc3RhY2sgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIHRyYW5zbGF0ZWQgdG8gc3RhY2sgcGFyYW1ldGVycyBhbmRcbiAqIG91dHB1dHMuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgTmVzdGVkU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgeGAgaXMgYW4gb2JqZWN0IG9mIHR5cGUgYE5lc3RlZFN0YWNrYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNOZXN0ZWRTdGFjayh4OiBhbnkpOiB4IGlzIE5lc3RlZFN0YWNrIHtcbiAgICByZXR1cm4geCAhPSBudWxsICYmIHR5cGVvZih4KSA9PT0gJ29iamVjdCcgJiYgTkVTVEVEX1NUQUNLX1NZTUJPTCBpbiB4O1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHRlbXBsYXRlRmlsZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgbmVzdGVkU3RhY2tSZXNvdXJjZT86IENmblJlc291cmNlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgcGFyYW1ldGVyczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG4gIHByaXZhdGUgcmVhZG9ubHkgcmVzb3VyY2U6IENmblN0YWNrO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jb250ZXh0dWFsU3RhY2tJZDogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jb250ZXh0dWFsU3RhY2tOYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgX3RlbXBsYXRlVXJsPzogc3RyaW5nO1xuICBwcml2YXRlIF9wYXJlbnRTdGFjazogU3RhY2s7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE5lc3RlZFN0YWNrUHJvcHMgPSB7IH0pIHtcbiAgICBjb25zdCBwYXJlbnRTdGFjayA9IGZpbmRQYXJlbnRTdGFjayhzY29wZSk7XG5cbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiBwYXJlbnRTdGFjay5hY2NvdW50LCByZWdpb246IHBhcmVudFN0YWNrLnJlZ2lvbiB9LFxuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBOZXN0ZWRTdGFja1N5bnRoZXNpemVyKHBhcmVudFN0YWNrLnN5bnRoZXNpemVyKSxcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogcGFyZW50U3RhY2suX2Nyb3NzUmVnaW9uUmVmZXJlbmNlcyxcbiAgICB9KTtcblxuICAgIHRoaXMuX3BhcmVudFN0YWNrID0gcGFyZW50U3RhY2s7XG5cbiAgICBjb25zdCBwYXJlbnRTY29wZSA9IG5ldyBDb25zdHJ1Y3Qoc2NvcGUsIGlkICsgJy5OZXN0ZWRTdGFjaycpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIE5FU1RFRF9TVEFDS19TWU1CT0wsIHsgdmFsdWU6IHRydWUgfSk7XG5cbiAgICAvLyB0aGlzIGlzIHRoZSBmaWxlIG5hbWUgb2YgdGhlIHN5bnRoZXNpemVkIHRlbXBsYXRlIGZpbGUgd2l0aGluIHRoZSBjbG91ZCBhc3NlbWJseVxuICAgIHRoaXMudGVtcGxhdGVGaWxlID0gYCR7TmFtZXMudW5pcXVlSWQodGhpcyl9Lm5lc3RlZC50ZW1wbGF0ZS5qc29uYDtcblxuICAgIHRoaXMucGFyYW1ldGVycyA9IHByb3BzLnBhcmFtZXRlcnMgfHwge307XG5cbiAgICB0aGlzLnJlc291cmNlID0gbmV3IENmblN0YWNrKHBhcmVudFNjb3BlLCBgJHtpZH0uTmVzdGVkU3RhY2tSZXNvdXJjZWAsIHtcbiAgICAgIC8vIFRoaXMgdmFsdWUgY2Fubm90IGJlIGNhY2hlZCBzaW5jZSBpdCBjaGFuZ2VzIGR1cmluZyB0aGUgc3ludGhlc2lzIHBoYXNlXG4gICAgICB0ZW1wbGF0ZVVybDogTGF6eS51bmNhY2hlZFN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHRoaXMuX3RlbXBsYXRlVXJsIHx8ICc8dW5yZXNvbHZlZD4nIH0pLFxuICAgICAgcGFyYW1ldGVyczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiBPYmplY3Qua2V5cyh0aGlzLnBhcmFtZXRlcnMpLmxlbmd0aCA+IDAgPyB0aGlzLnBhcmFtZXRlcnMgOiB1bmRlZmluZWQgfSksXG4gICAgICBub3RpZmljYXRpb25Bcm5zOiBwcm9wcy5ub3RpZmljYXRpb25Bcm5zLFxuICAgICAgdGltZW91dEluTWludXRlczogcHJvcHMudGltZW91dCA/IHByb3BzLnRpbWVvdXQudG9NaW51dGVzKCkgOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gICAgdGhpcy5yZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3kocHJvcHMucmVtb3ZhbFBvbGljeSA/PyBSZW1vdmFsUG9saWN5LkRFU1RST1kpO1xuXG4gICAgdGhpcy5uZXN0ZWRTdGFja1Jlc291cmNlID0gdGhpcy5yZXNvdXJjZTtcbiAgICB0aGlzLm5vZGUuZGVmYXVsdENoaWxkID0gdGhpcy5yZXNvdXJjZTtcblxuICAgIC8vIGNvbnRleHQtYXdhcmUgc3RhY2sgbmFtZTogaWYgcmVzb2x2ZWQgZnJvbSB3aXRoaW4gdGhpcyBzdGFjaywgcmV0dXJuIEFXUzo6U3RhY2tOYW1lXG4gICAgLy8gaWYgcmVzb2x2ZWQgZnJvbSB0aGUgb3V0ZXIgc3RhY2ssIHVzZSB0aGUgeyBSZWYgfSBvZiB0aGUgQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2sgcmVzb3VyY2VcbiAgICAvLyB3aGljaCByZXNvbHZlcyB0aGUgQVJOIG9mIHRoZSBzdGFjay4gV2UgbmVlZCB0byBleHRyYWN0IHRoZSBzdGFjayBuYW1lLCB3aGljaCBpcyB0aGUgc2Vjb25kXG4gICAgLy8gY29tcG9uZW50IGFmdGVyIHNwbGl0dGluZyBieSBcIi9cIlxuICAgIHRoaXMuX2NvbnRleHR1YWxTdGFja05hbWUgPSB0aGlzLmNvbnRleHR1YWxBdHRyaWJ1dGUoQXdzLlNUQUNLX05BTUUsIEZuLnNlbGVjdCgxLCBGbi5zcGxpdCgnLycsIHRoaXMucmVzb3VyY2UucmVmKSkpO1xuICAgIHRoaXMuX2NvbnRleHR1YWxTdGFja0lkID0gdGhpcy5jb250ZXh0dWFsQXR0cmlidXRlKEF3cy5TVEFDS19JRCwgdGhpcy5yZXNvdXJjZS5yZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGF0dHJpYnV0ZSB0aGF0IHJlcHJlc2VudHMgdGhlIG5hbWUgb2YgdGhlIG5lc3RlZCBzdGFjay5cbiAgICpcbiAgICogVGhpcyBpcyBhIGNvbnRleHQgYXdhcmUgYXR0cmlidXRlOlxuICAgKiAtIElmIHRoaXMgaXMgcmVmZXJlbmNlZCBmcm9tIHRoZSBwYXJlbnQgc3RhY2ssIGl0IHdpbGwgcmV0dXJuIGEgdG9rZW4gdGhhdCBwYXJzZXMgdGhlIG5hbWUgZnJvbSB0aGUgc3RhY2sgSUQuXG4gICAqIC0gSWYgdGhpcyBpcyByZWZlcmVuY2VkIGZyb20gdGhlIGNvbnRleHQgb2YgdGhlIG5lc3RlZCBzdGFjaywgaXQgd2lsbCByZXR1cm4gYHsgXCJSZWZcIjogXCJBV1M6OlN0YWNrTmFtZVwiIH1gXG4gICAqXG4gICAqIEV4YW1wbGUgdmFsdWU6IGBteXN0YWNrLW15bmVzdGVkc3RhY2stc2dnZnJoeGh1bTd3YFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgZ2V0IHN0YWNrTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dHVhbFN0YWNrTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhdHRyaWJ1dGUgdGhhdCByZXByZXNlbnRzIHRoZSBJRCBvZiB0aGUgc3RhY2suXG4gICAqXG4gICAqIFRoaXMgaXMgYSBjb250ZXh0IGF3YXJlIGF0dHJpYnV0ZTpcbiAgICogLSBJZiB0aGlzIGlzIHJlZmVyZW5jZWQgZnJvbSB0aGUgcGFyZW50IHN0YWNrLCBpdCB3aWxsIHJldHVybiBgeyBcIlJlZlwiOiBcIkxvZ2ljYWxJZE9mTmVzdGVkU3RhY2tSZXNvdXJjZVwiIH1gLlxuICAgKiAtIElmIHRoaXMgaXMgcmVmZXJlbmNlZCBmcm9tIHRoZSBjb250ZXh0IG9mIHRoZSBuZXN0ZWQgc3RhY2ssIGl0IHdpbGwgcmV0dXJuIGB7IFwiUmVmXCI6IFwiQVdTOjpTdGFja0lkXCIgfWBcbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYGFybjphd3M6Y2xvdWRmb3JtYXRpb246dXMtZWFzdC0yOjEyMzQ1Njc4OTAxMjpzdGFjay9teXN0YWNrLW15bmVzdGVkc3RhY2stc2dnZnJoeGh1bTd3L2Y0NDliMjUwLWI5NjktMTFlMC1hMTg1LTUwODFkMDEzNjc4NmBcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIGdldCBzdGFja0lkKCkge1xuICAgIHJldHVybiB0aGlzLl9jb250ZXh0dWFsU3RhY2tJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSB2YWx1ZSB0byBvbmUgb2YgdGhlIG5lc3RlZCBzdGFjayBwYXJhbWV0ZXJzLlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgcGFyYW1ldGVyIG5hbWUgKElEKVxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnblxuICAgKi9cbiAgcHVibGljIHNldFBhcmFtZXRlcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhcmFtZXRlcnNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIGFzc2V0IGF0IHRoZSBwYXJlbnQgc3RhY2sgd2hpY2ggcmVwcmVzZW50cyB0aGUgdGVtcGxhdGUgb2YgdGhpc1xuICAgKiBuZXN0ZWQgc3RhY2suXG4gICAqXG4gICAqIFRoaXMgcHJpdmF0ZSBBUEkgaXMgdXNlZCBieSBgQXBwLnByZXBhcmUoKWAgd2l0aGluIGEgbG9vcCB0aGF0IHJlY3RpZmllc1xuICAgKiByZWZlcmVuY2VzIGV2ZXJ5IHRpbWUgYW4gYXNzZXQgaXMgYWRkZWQuIFRoaXMgaXMgYmVjYXVzZSAoYXQgdGhlIG1vbWVudClcbiAgICogYXNzZXRzIGFyZSBhZGRyZXNzZWQgdXNpbmcgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHJldHVybnMgYHRydWVgIGlmIGEgbmV3IGFzc2V0IHdhcyBhZGRlZCBvciBgZmFsc2VgIGlmIGFuIGFzc2V0IHdhc1xuICAgKiBwcmV2aW91c2x5IGFkZGVkLiBXaGVuIHRoaXMgcmV0dXJucyBgdHJ1ZWAsIEFwcCB3aWxsIGRvIGFub3RoZXIgcmVmZXJlbmNlXG4gICAqIHJlY3RpZmljYXRpb24gY3ljbGUuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9wcmVwYXJlVGVtcGxhdGVBc3NldCgpIHtcbiAgICBpZiAodGhpcy5fdGVtcGxhdGVVcmwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIGFkZGluZyB0YWdzIHRvIG5lc3RlZCBzdGFjaywgdGhlIHRhZ3MgbmVlZCB0byBiZSBhZGRlZCB0byBhbGwgdGhlIHJlc291cmNlcyBpblxuICAgIC8vIGluIG5lc3RlZCBzdGFjaywgd2hpY2ggaXMgaGFuZGxlZCBieSB0aGUgYHRhZ3NgIHByb3BlcnR5LCBCdXQgdG8gdGFnIHRoZVxuICAgIC8vICB0YWdzIGhhdmUgdG8gYmUgYWRkZWQgaW4gdGhlIHBhcmVudCBzdGFjayBDZm5TdGFjayByZXNvdXJjZS4gVGhlIENmblN0YWNrIHJlc291cmNlIGNyZWF0ZWRcbiAgICAvLyBieSB0aGlzIGNsYXNzIGRvbnQgc2hhcmUgdGhlIHNhbWUgVGFnTWFuYWdlciBhcyB0aGF0IG9mIHRoZSBvbmUgZXhwb3NlZCBieSB0aGUgYHRhZ2AgcHJvcGVydHkgb2YgdGhlXG4gICAgLy8gIGNsYXNzLCBhbGwgdGhlIHRhZ3MgbmVlZCB0byBiZSBjb3BpZWQgdG8gdGhlIENmblN0YWNrIHJlc291cmNlIGJlZm9yZSBzeW50aGVzaXppbmcgdGhlIHJlc291cmNlLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvcHVsbC8xOTEyOFxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMudGFncy50YWdWYWx1ZXMoKSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICB0aGlzLnJlc291cmNlLnRhZ3Muc2V0VGFnKGtleSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgY2ZuID0gSlNPTi5zdHJpbmdpZnkodGhpcy5fdG9DbG91ZEZvcm1hdGlvbigpKTtcbiAgICBjb25zdCB0ZW1wbGF0ZUhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGNmbikuZGlnZXN0KCdoZXgnKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlTG9jYXRpb24gPSB0aGlzLl9wYXJlbnRTdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgIHNvdXJjZUhhc2g6IHRlbXBsYXRlSGFzaCxcbiAgICAgIGZpbGVOYW1lOiB0aGlzLnRlbXBsYXRlRmlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkUmVzb3VyY2VNZXRhZGF0YSh0aGlzLnJlc291cmNlLCAnVGVtcGxhdGVVUkwnKTtcblxuICAgIC8vIGlmIGJ1Y2tldE5hbWUvb2JqZWN0S2V5IGFyZSBjZm4gcGFyYW1ldGVycyBmcm9tIGEgc3RhY2sgb3RoZXIgdGhhbiB0aGUgcGFyZW50IHN0YWNrLCB0aGV5IHdpbGxcbiAgICAvLyBiZSByZXNvbHZlZCBhcyBjcm9zcy1zdGFjayByZWZlcmVuY2VzIGxpa2UgYW55IG90aGVyIChzZWUgXCJtdWx0aVwiIHRlc3RzKS5cbiAgICB0aGlzLl90ZW1wbGF0ZVVybCA9IGBodHRwczovL3MzLiR7dGhpcy5fcGFyZW50U3RhY2sucmVnaW9ufS4ke3RoaXMuX3BhcmVudFN0YWNrLnVybFN1ZmZpeH0vJHt0ZW1wbGF0ZUxvY2F0aW9uLmJ1Y2tldE5hbWV9LyR7dGVtcGxhdGVMb2NhdGlvbi5vYmplY3RLZXl9YDtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgY29udGV4dHVhbEF0dHJpYnV0ZShpbm5lclZhbHVlOiBzdHJpbmcsIG91dGVyVmFsdWU6IHN0cmluZykge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh7XG4gICAgICByZXNvbHZlOiAoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSA9PiB7XG4gICAgICAgIGlmIChTdGFjay5vZihjb250ZXh0LnNjb3BlKSA9PT0gdGhpcykge1xuICAgICAgICAgIHJldHVybiBpbm5lclZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvdXRlclZhbHVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRSZXNvdXJjZU1ldGFkYXRhKHJlc291cmNlOiBDZm5SZXNvdXJjZSwgcmVzb3VyY2VQcm9wZXJ0eTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQpKSB7XG4gICAgICByZXR1cm47IC8vIG5vdCBlbmFibGVkXG4gICAgfVxuXG4gICAgLy8gdGVsbCB0b29scyBzdWNoIGFzIFNBTSBDTEkgdGhhdCB0aGUgXCJUZW1wbGF0ZVVSTFwiIHByb3BlcnR5IG9mIHRoaXMgcmVzb3VyY2VcbiAgICAvLyBwb2ludHMgdG8gdGhlIG5lc3RlZCBzdGFjayB0ZW1wbGF0ZSBmb3IgbG9jYWwgZW11bGF0aW9uXG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YSA9IHJlc291cmNlLmNmbk9wdGlvbnMubWV0YWRhdGEgfHwgeyB9O1xuICAgIHJlc291cmNlLmNmbk9wdGlvbnMubWV0YWRhdGFbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUEFUSF9LRVldID0gdGhpcy50ZW1wbGF0ZUZpbGU7XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QUk9QRVJUWV9LRVldID0gcmVzb3VyY2VQcm9wZXJ0eTtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGUgc2NvcGUgZm9yIGEgbmVzdGVkIHN0YWNrLiBOZXN0ZWQgc3RhY2tzIG11c3QgYmUgZGVmaW5lZCB3aXRoaW4gdGhlIHNjb3BlIG9mIGFub3RoZXIgYFN0YWNrYC5cbiAqL1xuZnVuY3Rpb24gZmluZFBhcmVudFN0YWNrKHNjb3BlOiBDb25zdHJ1Y3QpOiBTdGFjayB7XG4gIGlmICghc2NvcGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lc3RlZCBzdGFja3MgY2Fubm90IGJlIGRlZmluZWQgYXMgYSByb290IGNvbnN0cnVjdCcpO1xuICB9XG5cbiAgY29uc3QgcGFyZW50U3RhY2sgPSBOb2RlLm9mKHNjb3BlKS5zY29wZXMucmV2ZXJzZSgpLmZpbmQocCA9PiBTdGFjay5pc1N0YWNrKHApKTtcbiAgaWYgKCFwYXJlbnRTdGFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVzdGVkIHN0YWNrcyBtdXN0IGJlIGRlZmluZWQgd2l0aGluIHNjb3BlIG9mIGFub3RoZXIgbm9uLW5lc3RlZCBzdGFjaycpO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudFN0YWNrIGFzIFN0YWNrO1xufVxuIl19