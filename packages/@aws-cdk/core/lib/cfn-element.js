"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnRefElement = exports.CfnElement = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const debug_1 = require("./debug");
const lazy_1 = require("./lazy");
const CFN_ELEMENT_SYMBOL = Symbol.for('@aws-cdk/core.CfnElement');
/**
 * An element of a CloudFormation stack.
 */
class CfnElement extends constructs_1.Construct {
    /**
     * Creates an entity and binds it to a tree.
     * Note that the root of the tree must be a Stack object (not just any Root).
     *
     * @param scope The parent construct
     * @param props Construct properties
     */
    constructor(scope, id) {
        super(scope, id);
        Object.defineProperty(this, CFN_ELEMENT_SYMBOL, { value: true });
        this.stack = stack_1.Stack.of(this);
        this.logicalId = lazy_1.Lazy.uncachedString({ produce: () => this.synthesizeLogicalId() }, {
            displayHint: `${notTooLong(constructs_1.Node.of(this).path)}.LogicalID`,
        });
        if (!this.node.tryGetContext(cxapi.DISABLE_LOGICAL_ID_METADATA)) {
            constructs_1.Node.of(this).addMetadata(cxschema.ArtifactMetadataEntryType.LOGICAL_ID, this.logicalId, {
                stackTrace: debug_1.debugModeEnabled(),
                traceFromFunction: this.constructor,
            });
        }
    }
    /**
     * Returns `true` if a construct is a stack element (i.e. part of the
     * synthesized cloudformation template).
     *
     * Uses duck-typing instead of `instanceof` to allow stack elements from different
     * versions of this library to be included in the same stack.
     *
     * @returns The construct as a stack element or undefined if it is not a stack element.
     */
    static isCfnElement(x) {
        return CFN_ELEMENT_SYMBOL in x;
    }
    /**
     * Overrides the auto-generated logical ID with a specific ID.
     * @param newLogicalId The new logical ID to use for this stack element.
     */
    overrideLogicalId(newLogicalId) {
        if (this._logicalIdLocked) {
            throw new Error(`The logicalId for resource at path ${constructs_1.Node.of(this).path} has been locked and cannot be overridden\n` +
                'Make sure you are calling "overrideLogicalId" before Stack.exportValue');
        }
        else {
            this._logicalIdOverride = newLogicalId;
        }
    }
    /**
     * Lock the logicalId of the element and do not allow
     * any updates (e.g. via overrideLogicalId)
     *
     * This is needed in cases where you are consuming the LogicalID
     * of an element prior to synthesis and you need to not allow future
     * changes to the id since doing so would cause the value you just
     * consumed to differ from the synth time value of the logicalId.
     *
     * For example:
     *
     * const bucket = new Bucket(stack, 'Bucket');
     * stack.exportValue(bucket.bucketArn) <--- consuming the logicalId
     * bucket.overrideLogicalId('NewLogicalId') <--- updating logicalId
     *
     * You should most likely never need to use this method, and if
     * you are implementing a feature that requires this, make sure
     * you actually require it.
     *
     * @internal
     */
    _lockLogicalId() {
        this._logicalIdLocked = true;
    }
    /**
     * @returns the stack trace of the point where this Resource was created from, sourced
     *      from the +metadata+ entry typed +aws:cdk:logicalId+, and with the bottom-most
     *      node +internal+ entries filtered.
     */
    get creationStack() {
        const trace = constructs_1.Node.of(this).metadata.find(md => md.type === cxschema.ArtifactMetadataEntryType.LOGICAL_ID).trace;
        if (!trace) {
            return [];
        }
        return filterStackTrace(trace);
        function filterStackTrace(stack) {
            const result = Array.of(...stack);
            while (result.length > 0 && shouldFilter(result[result.length - 1])) {
                result.pop();
            }
            // It's weird if we filtered everything, so return the whole stack...
            return result.length === 0 ? stack : result;
        }
        function shouldFilter(str) {
            return str.match(/[^(]+\(internal\/.*/) !== null;
        }
    }
    /**
     * Called during synthesize to render the logical ID of this element. If
     * `overrideLogicalId` was it will be used, otherwise, we will allocate the
     * logical ID through the stack.
     */
    synthesizeLogicalId() {
        if (this._logicalIdOverride) {
            return this._logicalIdOverride;
        }
        else {
            return this.stack.getLogicalId(this);
        }
    }
}
exports.CfnElement = CfnElement;
_a = JSII_RTTI_SYMBOL_1;
CfnElement[_a] = { fqn: "@aws-cdk/core.CfnElement", version: "0.0.0" };
/**
 * Base class for referenceable CloudFormation constructs which are not Resources
 *
 * These constructs are things like Conditions and Parameters, can be
 * referenced by taking the `.ref` attribute.
 *
 * Resource constructs do not inherit from CfnRefElement because they have their
 * own, more specific types returned from the .ref attribute. Also, some
 * resources aren't referenceable at all (such as BucketPolicies or GatewayAttachments).
 */
class CfnRefElement extends CfnElement {
    /**
     * Return a string that will be resolved to a CloudFormation `{ Ref }` for this element.
     *
     * If, by any chance, the intrinsic reference of a resource is not a string, you could
     * coerce it to an IResolvable through `Lazy.any({ produce: resource.ref })`.
     */
    get ref() {
        return token_1.Token.asString(cfn_reference_1.CfnReference.for(this, 'Ref'));
    }
}
exports.CfnRefElement = CfnRefElement;
_b = JSII_RTTI_SYMBOL_1;
CfnRefElement[_b] = { fqn: "@aws-cdk/core.CfnRefElement", version: "0.0.0" };
function notTooLong(x) {
    if (x.length < 100) {
        return x;
    }
    return x.slice(0, 47) + '...' + x.slice(-47);
}
const cfn_reference_1 = require("./private/cfn-reference");
const stack_1 = require("./stack");
const token_1 = require("./token");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJEQUEyRDtBQUMzRCx5Q0FBeUM7QUFDekMsMkNBQTZDO0FBQzdDLG1DQUEyQztBQUMzQyxpQ0FBOEI7QUFFOUIsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFbEU7O0dBRUc7QUFDSCxNQUFzQixVQUFXLFNBQVEsc0JBQVM7SUEyQ2hEOzs7Ozs7T0FNRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLEVBQUU7WUFDbEYsV0FBVyxFQUFFLEdBQUcsVUFBVSxDQUFDLGlCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZO1NBQzNELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsRUFBRTtZQUMvRCxpQkFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUN2RixVQUFVLEVBQUUs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c0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IGRlYnVnTW9kZUVuYWJsZWQgfSBmcm9tICcuL2RlYnVnJztcbmltcG9ydCB7IExhenkgfSBmcm9tICcuL2xhenknO1xuXG5jb25zdCBDRk5fRUxFTUVOVF9TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9jb3JlLkNmbkVsZW1lbnQnKTtcblxuLyoqXG4gKiBBbiBlbGVtZW50IG9mIGEgQ2xvdWRGb3JtYXRpb24gc3RhY2suXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDZm5FbGVtZW50IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIGEgY29uc3RydWN0IGlzIGEgc3RhY2sgZWxlbWVudCAoaS5lLiBwYXJ0IG9mIHRoZVxuICAgKiBzeW50aGVzaXplZCBjbG91ZGZvcm1hdGlvbiB0ZW1wbGF0ZSkuXG4gICAqXG4gICAqIFVzZXMgZHVjay10eXBpbmcgaW5zdGVhZCBvZiBgaW5zdGFuY2VvZmAgdG8gYWxsb3cgc3RhY2sgZWxlbWVudHMgZnJvbSBkaWZmZXJlbnRcbiAgICogdmVyc2lvbnMgb2YgdGhpcyBsaWJyYXJ5IHRvIGJlIGluY2x1ZGVkIGluIHRoZSBzYW1lIHN0YWNrLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgY29uc3RydWN0IGFzIGEgc3RhY2sgZWxlbWVudCBvciB1bmRlZmluZWQgaWYgaXQgaXMgbm90IGEgc3RhY2sgZWxlbWVudC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNDZm5FbGVtZW50KHg6IGFueSk6IHggaXMgQ2ZuRWxlbWVudCB7XG4gICAgcmV0dXJuIENGTl9FTEVNRU5UX1NZTUJPTCBpbiB4O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsb2dpY2FsIElEIGZvciB0aGlzIENsb3VkRm9ybWF0aW9uIHN0YWNrIGVsZW1lbnQuIFRoZSBsb2dpY2FsIElEIG9mIHRoZSBlbGVtZW50XG4gICAqIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgcGF0aCBvZiB0aGUgcmVzb3VyY2Ugbm9kZSBpbiB0aGUgY29uc3RydWN0IHRyZWUuXG4gICAqXG4gICAqIFRvIG92ZXJyaWRlIHRoaXMgdmFsdWUsIHVzZSBgb3ZlcnJpZGVMb2dpY2FsSWQobmV3TG9naWNhbElkKWAuXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBsb2dpY2FsIElEIGFzIGEgc3RyaW5naWZpZWQgdG9rZW4uIFRoaXMgdmFsdWUgd2lsbCBvbmx5IGdldFxuICAgKiByZXNvbHZlZCBkdXJpbmcgc3ludGhlc2lzLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxvZ2ljYWxJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhY2sgaW4gd2hpY2ggdGhpcyBlbGVtZW50IGlzIGRlZmluZWQuIENmbkVsZW1lbnRzIG11c3QgYmUgZGVmaW5lZCB3aXRoaW4gYSBzdGFjayBzY29wZSAoZGlyZWN0bHkgb3IgaW5kaXJlY3RseSkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhY2s6IFN0YWNrO1xuXG4gIC8qKlxuICAgKiBBbiBleHBsaWNpdCBsb2dpY2FsIElEIHByb3ZpZGVkIGJ5IGBvdmVycmlkZUxvZ2ljYWxJZGAuXG4gICAqL1xuICBwcml2YXRlIF9sb2dpY2FsSWRPdmVycmlkZT86IHN0cmluZztcblxuICAvKipcbiAgICogSWYgdGhlIGxvZ2ljYWxJZCBpcyBsb2NrZWQgdGhlbiBpdCBjYW4gbm8gbG9uZ2VyIGJlIG92ZXJyaWRkZW4uXG4gICAqIFRoaXMgaXMgbmVlZGVkIGZvciBjYXNlcyB3aGVyZSB0aGUgbG9naWNhbElkIGlzIGNvbnN1bWVkIHByaW9yIHRvIHN5bnRoZXNpc1xuICAgKiAoaS5lLiBTdGFjay5leHBvcnRWYWx1ZSkuXG4gICAqL1xuICBwcml2YXRlIF9sb2dpY2FsSWRMb2NrZWQ/OiBib29sZWFuO1xuXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gZW50aXR5IGFuZCBiaW5kcyBpdCB0byBhIHRyZWUuXG4gICAqIE5vdGUgdGhhdCB0aGUgcm9vdCBvZiB0aGUgdHJlZSBtdXN0IGJlIGEgU3RhY2sgb2JqZWN0IChub3QganVzdCBhbnkgUm9vdCkuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gcHJvcHMgQ29uc3RydWN0IHByb3BlcnRpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIENGTl9FTEVNRU5UX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuICAgIHRoaXMuc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIHRoaXMubG9naWNhbElkID0gTGF6eS51bmNhY2hlZFN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHRoaXMuc3ludGhlc2l6ZUxvZ2ljYWxJZCgpIH0sIHtcbiAgICAgIGRpc3BsYXlIaW50OiBgJHtub3RUb29Mb25nKE5vZGUub2YodGhpcykucGF0aCl9LkxvZ2ljYWxJRGAsXG4gICAgfSk7XG5cbiAgICBpZiAoIXRoaXMubm9kZS50cnlHZXRDb250ZXh0KGN4YXBpLkRJU0FCTEVfTE9HSUNBTF9JRF9NRVRBREFUQSkpIHtcbiAgICAgIE5vZGUub2YodGhpcykuYWRkTWV0YWRhdGEoY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5MT0dJQ0FMX0lELCB0aGlzLmxvZ2ljYWxJZCwge1xuICAgICAgICBzdGFja1RyYWNlOiBkZWJ1Z01vZGVFbmFibGVkKCksXG4gICAgICAgIHRyYWNlRnJvbUZ1bmN0aW9uOiB0aGlzLmNvbnN0cnVjdG9yLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgYXV0by1nZW5lcmF0ZWQgbG9naWNhbCBJRCB3aXRoIGEgc3BlY2lmaWMgSUQuXG4gICAqIEBwYXJhbSBuZXdMb2dpY2FsSWQgVGhlIG5ldyBsb2dpY2FsIElEIHRvIHVzZSBmb3IgdGhpcyBzdGFjayBlbGVtZW50LlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlTG9naWNhbElkKG5ld0xvZ2ljYWxJZDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2ljYWxJZExvY2tlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgbG9naWNhbElkIGZvciByZXNvdXJjZSBhdCBwYXRoICR7Tm9kZS5vZih0aGlzKS5wYXRofSBoYXMgYmVlbiBsb2NrZWQgYW5kIGNhbm5vdCBiZSBvdmVycmlkZGVuXFxuYCArXG4gICAgICAgICdNYWtlIHN1cmUgeW91IGFyZSBjYWxsaW5nIFwib3ZlcnJpZGVMb2dpY2FsSWRcIiBiZWZvcmUgU3RhY2suZXhwb3J0VmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbG9naWNhbElkT3ZlcnJpZGUgPSBuZXdMb2dpY2FsSWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvY2sgdGhlIGxvZ2ljYWxJZCBvZiB0aGUgZWxlbWVudCBhbmQgZG8gbm90IGFsbG93XG4gICAqIGFueSB1cGRhdGVzIChlLmcuIHZpYSBvdmVycmlkZUxvZ2ljYWxJZClcbiAgICpcbiAgICogVGhpcyBpcyBuZWVkZWQgaW4gY2FzZXMgd2hlcmUgeW91IGFyZSBjb25zdW1pbmcgdGhlIExvZ2ljYWxJRFxuICAgKiBvZiBhbiBlbGVtZW50IHByaW9yIHRvIHN5bnRoZXNpcyBhbmQgeW91IG5lZWQgdG8gbm90IGFsbG93IGZ1dHVyZVxuICAgKiBjaGFuZ2VzIHRvIHRoZSBpZCBzaW5jZSBkb2luZyBzbyB3b3VsZCBjYXVzZSB0aGUgdmFsdWUgeW91IGp1c3RcbiAgICogY29uc3VtZWQgdG8gZGlmZmVyIGZyb20gdGhlIHN5bnRoIHRpbWUgdmFsdWUgb2YgdGhlIGxvZ2ljYWxJZC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcbiAgICogc3RhY2suZXhwb3J0VmFsdWUoYnVja2V0LmJ1Y2tldEFybikgPC0tLSBjb25zdW1pbmcgdGhlIGxvZ2ljYWxJZFxuICAgKiBidWNrZXQub3ZlcnJpZGVMb2dpY2FsSWQoJ05ld0xvZ2ljYWxJZCcpIDwtLS0gdXBkYXRpbmcgbG9naWNhbElkXG4gICAqXG4gICAqIFlvdSBzaG91bGQgbW9zdCBsaWtlbHkgbmV2ZXIgbmVlZCB0byB1c2UgdGhpcyBtZXRob2QsIGFuZCBpZlxuICAgKiB5b3UgYXJlIGltcGxlbWVudGluZyBhIGZlYXR1cmUgdGhhdCByZXF1aXJlcyB0aGlzLCBtYWtlIHN1cmVcbiAgICogeW91IGFjdHVhbGx5IHJlcXVpcmUgaXQuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9sb2NrTG9naWNhbElkKCk6IHZvaWQge1xuICAgIHRoaXMuX2xvZ2ljYWxJZExvY2tlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgdGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBwb2ludCB3aGVyZSB0aGlzIFJlc291cmNlIHdhcyBjcmVhdGVkIGZyb20sIHNvdXJjZWRcbiAgICogICAgICBmcm9tIHRoZSArbWV0YWRhdGErIGVudHJ5IHR5cGVkICthd3M6Y2RrOmxvZ2ljYWxJZCssIGFuZCB3aXRoIHRoZSBib3R0b20tbW9zdFxuICAgKiAgICAgIG5vZGUgK2ludGVybmFsKyBlbnRyaWVzIGZpbHRlcmVkLlxuICAgKi9cbiAgcHVibGljIGdldCBjcmVhdGlvblN0YWNrKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB0cmFjZSA9IE5vZGUub2YodGhpcykubWV0YWRhdGEuZmluZChtZCA9PiBtZC50eXBlID09PSBjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLkxPR0lDQUxfSUQpIS50cmFjZTtcbiAgICBpZiAoIXRyYWNlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlclN0YWNrVHJhY2UodHJhY2UpO1xuXG4gICAgZnVuY3Rpb24gZmlsdGVyU3RhY2tUcmFjZShzdGFjazogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBBcnJheS5vZiguLi5zdGFjayk7XG4gICAgICB3aGlsZSAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgc2hvdWxkRmlsdGVyKHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0pKSB7XG4gICAgICAgIHJlc3VsdC5wb3AoKTtcbiAgICAgIH1cbiAgICAgIC8vIEl0J3Mgd2VpcmQgaWYgd2UgZmlsdGVyZWQgZXZlcnl0aGluZywgc28gcmV0dXJuIHRoZSB3aG9sZSBzdGFjay4uLlxuICAgICAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPT09IDAgPyBzdGFjayA6IHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG91bGRGaWx0ZXIoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBzdHIubWF0Y2goL1teKF0rXFwoaW50ZXJuYWxcXC8uKi8pICE9PSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDbG91ZEZvcm1hdGlvbiAnc25pcHBldCcgZm9yIHRoaXMgZW50aXR5LiBUaGUgc25pcHBldCB3aWxsIG9ubHkgYmUgbWVyZ2VkXG4gICAqIGF0IHRoZSByb290IGxldmVsIHRvIGVuc3VyZSB0aGVyZSBhcmUgbm8gaWRlbnRpdHkgY29uZmxpY3RzLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYSBSZXNvdXJjZSBjbGFzcyB3aWxsIHJldHVybiBzb21ldGhpbmcgbGlrZTpcbiAgICoge1xuICAgKiAgIFJlc291cmNlczoge1xuICAgKiAgICAgW3RoaXMubG9naWNhbElkXToge1xuICAgKiAgICAgICBUeXBlOiB0aGlzLnJlc291cmNlVHlwZSxcbiAgICogICAgICAgUHJvcGVydGllczogdGhpcy5wcm9wcyxcbiAgICogICAgICAgQ29uZGl0aW9uOiB0aGlzLmNvbmRpdGlvblxuICAgKiAgICAgfVxuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfdG9DbG91ZEZvcm1hdGlvbigpOiBvYmplY3Q7XG5cbiAgLyoqXG4gICAqIENhbGxlZCBkdXJpbmcgc3ludGhlc2l6ZSB0byByZW5kZXIgdGhlIGxvZ2ljYWwgSUQgb2YgdGhpcyBlbGVtZW50LiBJZlxuICAgKiBgb3ZlcnJpZGVMb2dpY2FsSWRgIHdhcyBpdCB3aWxsIGJlIHVzZWQsIG90aGVyd2lzZSwgd2Ugd2lsbCBhbGxvY2F0ZSB0aGVcbiAgICogbG9naWNhbCBJRCB0aHJvdWdoIHRoZSBzdGFjay5cbiAgICovXG4gIHByaXZhdGUgc3ludGhlc2l6ZUxvZ2ljYWxJZCgpIHtcbiAgICBpZiAodGhpcy5fbG9naWNhbElkT3ZlcnJpZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9sb2dpY2FsSWRPdmVycmlkZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhY2suZ2V0TG9naWNhbElkKHRoaXMpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHJlZmVyZW5jZWFibGUgQ2xvdWRGb3JtYXRpb24gY29uc3RydWN0cyB3aGljaCBhcmUgbm90IFJlc291cmNlc1xuICpcbiAqIFRoZXNlIGNvbnN0cnVjdHMgYXJlIHRoaW5ncyBsaWtlIENvbmRpdGlvbnMgYW5kIFBhcmFtZXRlcnMsIGNhbiBiZVxuICogcmVmZXJlbmNlZCBieSB0YWtpbmcgdGhlIGAucmVmYCBhdHRyaWJ1dGUuXG4gKlxuICogUmVzb3VyY2UgY29uc3RydWN0cyBkbyBub3QgaW5oZXJpdCBmcm9tIENmblJlZkVsZW1lbnQgYmVjYXVzZSB0aGV5IGhhdmUgdGhlaXJcbiAqIG93biwgbW9yZSBzcGVjaWZpYyB0eXBlcyByZXR1cm5lZCBmcm9tIHRoZSAucmVmIGF0dHJpYnV0ZS4gQWxzbywgc29tZVxuICogcmVzb3VyY2VzIGFyZW4ndCByZWZlcmVuY2VhYmxlIGF0IGFsbCAoc3VjaCBhcyBCdWNrZXRQb2xpY2llcyBvciBHYXRld2F5QXR0YWNobWVudHMpLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2ZuUmVmRWxlbWVudCBleHRlbmRzIENmbkVsZW1lbnQge1xuICAvKipcbiAgICogUmV0dXJuIGEgc3RyaW5nIHRoYXQgd2lsbCBiZSByZXNvbHZlZCB0byBhIENsb3VkRm9ybWF0aW9uIGB7IFJlZiB9YCBmb3IgdGhpcyBlbGVtZW50LlxuICAgKlxuICAgKiBJZiwgYnkgYW55IGNoYW5jZSwgdGhlIGludHJpbnNpYyByZWZlcmVuY2Ugb2YgYSByZXNvdXJjZSBpcyBub3QgYSBzdHJpbmcsIHlvdSBjb3VsZFxuICAgKiBjb2VyY2UgaXQgdG8gYW4gSVJlc29sdmFibGUgdGhyb3VnaCBgTGF6eS5hbnkoeyBwcm9kdWNlOiByZXNvdXJjZS5yZWYgfSlgLlxuICAgKi9cbiAgcHVibGljIGdldCByZWYoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcoQ2ZuUmVmZXJlbmNlLmZvcih0aGlzLCAnUmVmJykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vdFRvb0xvbmcoeDogc3RyaW5nKSB7XG4gIGlmICh4Lmxlbmd0aCA8IDEwMCkgeyByZXR1cm4geDsgfVxuICByZXR1cm4geC5zbGljZSgwLCA0NykgKyAnLi4uJyArIHguc2xpY2UoLTQ3KTtcbn1cblxuaW1wb3J0IHsgQ2ZuUmVmZXJlbmNlIH0gZnJvbSAnLi9wcml2YXRlL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbiJdfQ==