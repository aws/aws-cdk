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
                stackTrace: (0, debug_1.debugModeEnabled)(),
                traceFromFunction: this.constructor,
            });
        }
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
_a = JSII_RTTI_SYMBOL_1;
CfnElement[_a] = { fqn: "@aws-cdk/core.CfnElement", version: "0.0.0" };
exports.CfnElement = CfnElement;
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
_b = JSII_RTTI_SYMBOL_1;
CfnRefElement[_b] = { fqn: "@aws-cdk/core.CfnRefElement", version: "0.0.0" };
exports.CfnRefElement = CfnRefElement;
function notTooLong(x) {
    if (x.length < 100) {
        return x;
    }
    return x.slice(0, 47) + '...' + x.slice(-47);
}
const cfn_reference_1 = require("./private/cfn-reference");
const stack_1 = require("./stack");
const token_1 = require("./token");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJEQUEyRDtBQUMzRCx5Q0FBeUM7QUFDekMsMkNBQTZDO0FBQzdDLG1DQUEyQztBQUMzQyxpQ0FBOEI7QUFFOUIsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFbEU7O0dBRUc7QUFDSCxNQUFzQixVQUFXLFNBQVEsc0JBQVM7SUFDaEQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQU07UUFDL0IsT0FBTyxrQkFBa0IsSUFBSSxDQUFDLENBQUM7S0FDaEM7SUErQkQ7Ozs7OztPQU1HO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRWpFLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsRUFBRTtZQUNsRixXQUFXLEVBQUUsR0FBRyxVQUFVLENBQUMsaUJBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVk7U0FDM0QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO1lBQy9ELGlCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBkZWJ1Z01vZGVFbmFibGVkIH0gZnJvbSAnLi9kZWJ1Zyc7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi9sYXp5JztcblxuY29uc3QgQ0ZOX0VMRU1FTlRfU1lNQk9MID0gU3ltYm9sLmZvcignQGF3cy1jZGsvY29yZS5DZm5FbGVtZW50Jyk7XG5cbi8qKlxuICogQW4gZWxlbWVudCBvZiBhIENsb3VkRm9ybWF0aW9uIHN0YWNrLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2ZuRWxlbWVudCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBhIGNvbnN0cnVjdCBpcyBhIHN0YWNrIGVsZW1lbnQgKGkuZS4gcGFydCBvZiB0aGVcbiAgICogc3ludGhlc2l6ZWQgY2xvdWRmb3JtYXRpb24gdGVtcGxhdGUpLlxuICAgKlxuICAgKiBVc2VzIGR1Y2stdHlwaW5nIGluc3RlYWQgb2YgYGluc3RhbmNlb2ZgIHRvIGFsbG93IHN0YWNrIGVsZW1lbnRzIGZyb20gZGlmZmVyZW50XG4gICAqIHZlcnNpb25zIG9mIHRoaXMgbGlicmFyeSB0byBiZSBpbmNsdWRlZCBpbiB0aGUgc2FtZSBzdGFjay5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGNvbnN0cnVjdCBhcyBhIHN0YWNrIGVsZW1lbnQgb3IgdW5kZWZpbmVkIGlmIGl0IGlzIG5vdCBhIHN0YWNrIGVsZW1lbnQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzQ2ZuRWxlbWVudCh4OiBhbnkpOiB4IGlzIENmbkVsZW1lbnQge1xuICAgIHJldHVybiBDRk5fRUxFTUVOVF9TWU1CT0wgaW4geDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbG9naWNhbCBJRCBmb3IgdGhpcyBDbG91ZEZvcm1hdGlvbiBzdGFjayBlbGVtZW50LiBUaGUgbG9naWNhbCBJRCBvZiB0aGUgZWxlbWVudFxuICAgKiBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIHBhdGggb2YgdGhlIHJlc291cmNlIG5vZGUgaW4gdGhlIGNvbnN0cnVjdCB0cmVlLlxuICAgKlxuICAgKiBUbyBvdmVycmlkZSB0aGlzIHZhbHVlLCB1c2UgYG92ZXJyaWRlTG9naWNhbElkKG5ld0xvZ2ljYWxJZClgLlxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgbG9naWNhbCBJRCBhcyBhIHN0cmluZ2lmaWVkIHRva2VuLiBUaGlzIHZhbHVlIHdpbGwgb25seSBnZXRcbiAgICogcmVzb2x2ZWQgZHVyaW5nIHN5bnRoZXNpcy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsb2dpY2FsSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHN0YWNrIGluIHdoaWNoIHRoaXMgZWxlbWVudCBpcyBkZWZpbmVkLiBDZm5FbGVtZW50cyBtdXN0IGJlIGRlZmluZWQgd2l0aGluIGEgc3RhY2sgc2NvcGUgKGRpcmVjdGx5IG9yIGluZGlyZWN0bHkpLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YWNrOiBTdGFjaztcblxuICAvKipcbiAgICogQW4gZXhwbGljaXQgbG9naWNhbCBJRCBwcm92aWRlZCBieSBgb3ZlcnJpZGVMb2dpY2FsSWRgLlxuICAgKi9cbiAgcHJpdmF0ZSBfbG9naWNhbElkT3ZlcnJpZGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBsb2dpY2FsSWQgaXMgbG9ja2VkIHRoZW4gaXQgY2FuIG5vIGxvbmdlciBiZSBvdmVycmlkZGVuLlxuICAgKiBUaGlzIGlzIG5lZWRlZCBmb3IgY2FzZXMgd2hlcmUgdGhlIGxvZ2ljYWxJZCBpcyBjb25zdW1lZCBwcmlvciB0byBzeW50aGVzaXNcbiAgICogKGkuZS4gU3RhY2suZXhwb3J0VmFsdWUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfbG9naWNhbElkTG9ja2VkPzogYm9vbGVhbjtcblxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGVudGl0eSBhbmQgYmluZHMgaXQgdG8gYSB0cmVlLlxuICAgKiBOb3RlIHRoYXQgdGhlIHJvb3Qgb2YgdGhlIHRyZWUgbXVzdCBiZSBhIFN0YWNrIG9iamVjdCAobm90IGp1c3QgYW55IFJvb3QpLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIHByb3BzIENvbnN0cnVjdCBwcm9wZXJ0aWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBDRk5fRUxFTUVOVF9TWU1CT0wsIHsgdmFsdWU6IHRydWUgfSk7XG5cbiAgICB0aGlzLnN0YWNrID0gU3RhY2sub2YodGhpcyk7XG5cbiAgICB0aGlzLmxvZ2ljYWxJZCA9IExhenkudW5jYWNoZWRTdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnN5bnRoZXNpemVMb2dpY2FsSWQoKSB9LCB7XG4gICAgICBkaXNwbGF5SGludDogYCR7bm90VG9vTG9uZyhOb2RlLm9mKHRoaXMpLnBhdGgpfS5Mb2dpY2FsSURgLFxuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChjeGFwaS5ESVNBQkxFX0xPR0lDQUxfSURfTUVUQURBVEEpKSB7XG4gICAgICBOb2RlLm9mKHRoaXMpLmFkZE1ldGFkYXRhKGN4c2NoZW1hLkFydGlmYWN0TWV0YWRhdGFFbnRyeVR5cGUuTE9HSUNBTF9JRCwgdGhpcy5sb2dpY2FsSWQsIHtcbiAgICAgICAgc3RhY2tUcmFjZTogZGVidWdNb2RlRW5hYmxlZCgpLFxuICAgICAgICB0cmFjZUZyb21GdW5jdGlvbjogdGhpcy5jb25zdHJ1Y3RvcixcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgdGhlIGF1dG8tZ2VuZXJhdGVkIGxvZ2ljYWwgSUQgd2l0aCBhIHNwZWNpZmljIElELlxuICAgKiBAcGFyYW0gbmV3TG9naWNhbElkIFRoZSBuZXcgbG9naWNhbCBJRCB0byB1c2UgZm9yIHRoaXMgc3RhY2sgZWxlbWVudC5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZUxvZ2ljYWxJZChuZXdMb2dpY2FsSWQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9sb2dpY2FsSWRMb2NrZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGxvZ2ljYWxJZCBmb3IgcmVzb3VyY2UgYXQgcGF0aCAke05vZGUub2YodGhpcykucGF0aH0gaGFzIGJlZW4gbG9ja2VkIGFuZCBjYW5ub3QgYmUgb3ZlcnJpZGRlblxcbmAgK1xuICAgICAgICAnTWFrZSBzdXJlIHlvdSBhcmUgY2FsbGluZyBcIm92ZXJyaWRlTG9naWNhbElkXCIgYmVmb3JlIFN0YWNrLmV4cG9ydFZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xvZ2ljYWxJZE92ZXJyaWRlID0gbmV3TG9naWNhbElkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NrIHRoZSBsb2dpY2FsSWQgb2YgdGhlIGVsZW1lbnQgYW5kIGRvIG5vdCBhbGxvd1xuICAgKiBhbnkgdXBkYXRlcyAoZS5nLiB2aWEgb3ZlcnJpZGVMb2dpY2FsSWQpXG4gICAqXG4gICAqIFRoaXMgaXMgbmVlZGVkIGluIGNhc2VzIHdoZXJlIHlvdSBhcmUgY29uc3VtaW5nIHRoZSBMb2dpY2FsSURcbiAgICogb2YgYW4gZWxlbWVudCBwcmlvciB0byBzeW50aGVzaXMgYW5kIHlvdSBuZWVkIHRvIG5vdCBhbGxvdyBmdXR1cmVcbiAgICogY2hhbmdlcyB0byB0aGUgaWQgc2luY2UgZG9pbmcgc28gd291bGQgY2F1c2UgdGhlIHZhbHVlIHlvdSBqdXN0XG4gICAqIGNvbnN1bWVkIHRvIGRpZmZlciBmcm9tIHRoZSBzeW50aCB0aW1lIHZhbHVlIG9mIHRoZSBsb2dpY2FsSWQuXG4gICAqXG4gICAqIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBjb25zdCBidWNrZXQgPSBuZXcgQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAqIHN0YWNrLmV4cG9ydFZhbHVlKGJ1Y2tldC5idWNrZXRBcm4pIDwtLS0gY29uc3VtaW5nIHRoZSBsb2dpY2FsSWRcbiAgICogYnVja2V0Lm92ZXJyaWRlTG9naWNhbElkKCdOZXdMb2dpY2FsSWQnKSA8LS0tIHVwZGF0aW5nIGxvZ2ljYWxJZFxuICAgKlxuICAgKiBZb3Ugc2hvdWxkIG1vc3QgbGlrZWx5IG5ldmVyIG5lZWQgdG8gdXNlIHRoaXMgbWV0aG9kLCBhbmQgaWZcbiAgICogeW91IGFyZSBpbXBsZW1lbnRpbmcgYSBmZWF0dXJlIHRoYXQgcmVxdWlyZXMgdGhpcywgbWFrZSBzdXJlXG4gICAqIHlvdSBhY3R1YWxseSByZXF1aXJlIGl0LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfbG9ja0xvZ2ljYWxJZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9sb2dpY2FsSWRMb2NrZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHRoZSBzdGFjayB0cmFjZSBvZiB0aGUgcG9pbnQgd2hlcmUgdGhpcyBSZXNvdXJjZSB3YXMgY3JlYXRlZCBmcm9tLCBzb3VyY2VkXG4gICAqICAgICAgZnJvbSB0aGUgK21ldGFkYXRhKyBlbnRyeSB0eXBlZCArYXdzOmNkazpsb2dpY2FsSWQrLCBhbmQgd2l0aCB0aGUgYm90dG9tLW1vc3RcbiAgICogICAgICBub2RlICtpbnRlcm5hbCsgZW50cmllcyBmaWx0ZXJlZC5cbiAgICovXG4gIHB1YmxpYyBnZXQgY3JlYXRpb25TdGFjaygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgdHJhY2UgPSBOb2RlLm9mKHRoaXMpLm1ldGFkYXRhLmZpbmQobWQgPT4gbWQudHlwZSA9PT0gY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5MT0dJQ0FMX0lEKSEudHJhY2U7XG4gICAgaWYgKCF0cmFjZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXJTdGFja1RyYWNlKHRyYWNlKTtcblxuICAgIGZ1bmN0aW9uIGZpbHRlclN0YWNrVHJhY2Uoc3RhY2s6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gQXJyYXkub2YoLi4uc3RhY2spO1xuICAgICAgd2hpbGUgKHJlc3VsdC5sZW5ndGggPiAwICYmIHNob3VsZEZpbHRlcihyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdKSkge1xuICAgICAgICByZXN1bHQucG9wKCk7XG4gICAgICB9XG4gICAgICAvLyBJdCdzIHdlaXJkIGlmIHdlIGZpbHRlcmVkIGV2ZXJ5dGhpbmcsIHNvIHJldHVybiB0aGUgd2hvbGUgc3RhY2suLi5cbiAgICAgIHJldHVybiByZXN1bHQubGVuZ3RoID09PSAwID8gc3RhY2sgOiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvdWxkRmlsdGVyKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gc3RyLm1hdGNoKC9bXihdK1xcKGludGVybmFsXFwvLiovKSAhPT0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQ2xvdWRGb3JtYXRpb24gJ3NuaXBwZXQnIGZvciB0aGlzIGVudGl0eS4gVGhlIHNuaXBwZXQgd2lsbCBvbmx5IGJlIG1lcmdlZFxuICAgKiBhdCB0aGUgcm9vdCBsZXZlbCB0byBlbnN1cmUgdGhlcmUgYXJlIG5vIGlkZW50aXR5IGNvbmZsaWN0cy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGEgUmVzb3VyY2UgY2xhc3Mgd2lsbCByZXR1cm4gc29tZXRoaW5nIGxpa2U6XG4gICAqIHtcbiAgICogICBSZXNvdXJjZXM6IHtcbiAgICogICAgIFt0aGlzLmxvZ2ljYWxJZF06IHtcbiAgICogICAgICAgVHlwZTogdGhpcy5yZXNvdXJjZVR5cGUsXG4gICAqICAgICAgIFByb3BlcnRpZXM6IHRoaXMucHJvcHMsXG4gICAqICAgICAgIENvbmRpdGlvbjogdGhpcy5jb25kaXRpb25cbiAgICogICAgIH1cbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgX3RvQ2xvdWRGb3JtYXRpb24oKTogb2JqZWN0O1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgZHVyaW5nIHN5bnRoZXNpemUgdG8gcmVuZGVyIHRoZSBsb2dpY2FsIElEIG9mIHRoaXMgZWxlbWVudC4gSWZcbiAgICogYG92ZXJyaWRlTG9naWNhbElkYCB3YXMgaXQgd2lsbCBiZSB1c2VkLCBvdGhlcndpc2UsIHdlIHdpbGwgYWxsb2NhdGUgdGhlXG4gICAqIGxvZ2ljYWwgSUQgdGhyb3VnaCB0aGUgc3RhY2suXG4gICAqL1xuICBwcml2YXRlIHN5bnRoZXNpemVMb2dpY2FsSWQoKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2ljYWxJZE92ZXJyaWRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbG9naWNhbElkT3ZlcnJpZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YWNrLmdldExvZ2ljYWxJZCh0aGlzKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciByZWZlcmVuY2VhYmxlIENsb3VkRm9ybWF0aW9uIGNvbnN0cnVjdHMgd2hpY2ggYXJlIG5vdCBSZXNvdXJjZXNcbiAqXG4gKiBUaGVzZSBjb25zdHJ1Y3RzIGFyZSB0aGluZ3MgbGlrZSBDb25kaXRpb25zIGFuZCBQYXJhbWV0ZXJzLCBjYW4gYmVcbiAqIHJlZmVyZW5jZWQgYnkgdGFraW5nIHRoZSBgLnJlZmAgYXR0cmlidXRlLlxuICpcbiAqIFJlc291cmNlIGNvbnN0cnVjdHMgZG8gbm90IGluaGVyaXQgZnJvbSBDZm5SZWZFbGVtZW50IGJlY2F1c2UgdGhleSBoYXZlIHRoZWlyXG4gKiBvd24sIG1vcmUgc3BlY2lmaWMgdHlwZXMgcmV0dXJuZWQgZnJvbSB0aGUgLnJlZiBhdHRyaWJ1dGUuIEFsc28sIHNvbWVcbiAqIHJlc291cmNlcyBhcmVuJ3QgcmVmZXJlbmNlYWJsZSBhdCBhbGwgKHN1Y2ggYXMgQnVja2V0UG9saWNpZXMgb3IgR2F0ZXdheUF0dGFjaG1lbnRzKS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENmblJlZkVsZW1lbnQgZXh0ZW5kcyBDZm5FbGVtZW50IHtcbiAgLyoqXG4gICAqIFJldHVybiBhIHN0cmluZyB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgdG8gYSBDbG91ZEZvcm1hdGlvbiBgeyBSZWYgfWAgZm9yIHRoaXMgZWxlbWVudC5cbiAgICpcbiAgICogSWYsIGJ5IGFueSBjaGFuY2UsIHRoZSBpbnRyaW5zaWMgcmVmZXJlbmNlIG9mIGEgcmVzb3VyY2UgaXMgbm90IGEgc3RyaW5nLCB5b3UgY291bGRcbiAgICogY29lcmNlIGl0IHRvIGFuIElSZXNvbHZhYmxlIHRocm91Z2ggYExhenkuYW55KHsgcHJvZHVjZTogcmVzb3VyY2UucmVmIH0pYC5cbiAgICovXG4gIHB1YmxpYyBnZXQgcmVmKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKENmblJlZmVyZW5jZS5mb3IodGhpcywgJ1JlZicpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBub3RUb29Mb25nKHg6IHN0cmluZykge1xuICBpZiAoeC5sZW5ndGggPCAxMDApIHsgcmV0dXJuIHg7IH1cbiAgcmV0dXJuIHguc2xpY2UoMCwgNDcpICsgJy4uLicgKyB4LnNsaWNlKC00Nyk7XG59XG5cbmltcG9ydCB7IENmblJlZmVyZW5jZSB9IGZyb20gJy4vcHJpdmF0ZS9jZm4tcmVmZXJlbmNlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4iXX0=