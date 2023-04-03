"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnReference = exports.ReferenceRendering = void 0;
/* eslint-disable import/order */
const reference_1 = require("../reference");
const CFN_REFERENCE_SYMBOL = Symbol.for('@aws-cdk/core.CfnReference');
/**
 * An enum that allows controlling how will the created reference
 * be rendered in the resulting CloudFormation template.
 */
var ReferenceRendering;
(function (ReferenceRendering) {
    /**
     * Used for rendering a reference inside Fn::Sub expressions,
     * which mean these must resolve to "${Sth}" instead of { Ref: "Sth" }.
     */
    ReferenceRendering[ReferenceRendering["FN_SUB"] = 0] = "FN_SUB";
    /**
     * Used for rendering Fn::GetAtt with its arguments in string form
     * (as opposed to the more common arguments in array form, which we render by default).
     */
    ReferenceRendering[ReferenceRendering["GET_ATT_STRING"] = 1] = "GET_ATT_STRING";
})(ReferenceRendering = exports.ReferenceRendering || (exports.ReferenceRendering = {}));
/**
 * A Token that represents a CloudFormation reference to another resource
 *
 * If these references are used in a different stack from where they are
 * defined, appropriate CloudFormation `Export`s and `Fn::ImportValue`s will be
 * synthesized automatically instead of the regular CloudFormation references.
 *
 * Additionally, the dependency between the stacks will be recorded, and the toolkit
 * will make sure to deploy producing stack before the consuming stack.
 *
 * This magic happens in the prepare() phase, where consuming stacks will call
 * `consumeFromStack` on these Tokens and if they happen to be exported by a different
 * Stack, we'll register the dependency.
 */
class CfnReference extends reference_1.Reference {
    /**
     * Check whether this is actually a Reference
     */
    static isCfnReference(x) {
        return CFN_REFERENCE_SYMBOL in x;
    }
    /**
     * Return the CfnReference for the indicated target
     *
     * Will make sure that multiple invocations for the same target and intrinsic
     * return the same CfnReference. Because CfnReferences accumulate state in
     * the prepare() phase (for the purpose of cross-stack references), it's
     * important that the state isn't lost if it's lazily created, like so:
     *
     *     Lazy.string({ produce: () => new CfnReference(...) })
     *
     */
    static for(target, attribute, refRender, typeHint) {
        return CfnReference.singletonReference(target, attribute, refRender, () => {
            const cfnIntrinsic = refRender === ReferenceRendering.FN_SUB
                ? ('${' + target.logicalId + (attribute === 'Ref' ? '' : `.${attribute}`) + '}')
                : (attribute === 'Ref'
                    ? { Ref: target.logicalId }
                    : {
                        'Fn::GetAtt': refRender === ReferenceRendering.GET_ATT_STRING
                            ? `${target.logicalId}.${attribute}`
                            : [target.logicalId, attribute],
                    });
            return new CfnReference(cfnIntrinsic, attribute, target, typeHint);
        });
    }
    /**
     * Return a CfnReference that references a pseudo referenced
     */
    static forPseudo(pseudoName, scope) {
        return CfnReference.singletonReference(scope, `Pseudo:${pseudoName}`, undefined, () => {
            const cfnIntrinsic = { Ref: pseudoName };
            return new CfnReference(cfnIntrinsic, pseudoName, scope);
        });
    }
    /**
     * Get or create the table.
     * Passing fnSub = true allows cloudformation-include to correctly handle Fn::Sub.
     */
    static singletonReference(target, attribKey, refRender, fresh) {
        let attribs = CfnReference.referenceTable.get(target);
        if (!attribs) {
            attribs = new Map();
            CfnReference.referenceTable.set(target, attribs);
        }
        let cacheKey = attribKey;
        switch (refRender) {
            case ReferenceRendering.FN_SUB:
                cacheKey += 'Fn::Sub';
                break;
            case ReferenceRendering.GET_ATT_STRING:
                cacheKey += 'Fn::GetAtt::String';
                break;
        }
        let ref = attribs.get(cacheKey);
        if (!ref) {
            ref = fresh();
            attribs.set(cacheKey, ref);
        }
        return ref;
    }
    constructor(value, displayName, target, typeHint) {
        // prepend scope path to display name
        super(value, target, displayName, typeHint);
        this.target = target;
        this.replacementTokens = new Map();
        this.targetStack = stack_1.Stack.of(target);
        Object.defineProperty(this, CFN_REFERENCE_SYMBOL, { value: true });
    }
    resolve(context) {
        // If we have a special token for this consuming stack, resolve that. Otherwise resolve as if
        // we are in the same stack.
        const consumingStack = stack_1.Stack.of(context.scope);
        const token = this.replacementTokens.get(consumingStack);
        // if (!token && this.isCrossStackReference(consumingStack) && !context.preparing) {
        // eslint-disable-next-line max-len
        //   throw new Error(`Cross-stack reference (${context.scope.node.path} -> ${this.target.node.path}) has not been assigned a value--call prepare() first`);
        // }
        if (token) {
            return token.resolve(context);
        }
        else {
            return super.resolve(context);
        }
    }
    hasValueForStack(stack) {
        if (stack === this.targetStack) {
            return true;
        }
        return this.replacementTokens.has(stack);
    }
    assignValueForStack(stack, value) {
        if (stack === this.targetStack) {
            throw new Error('cannot assign a value for the same stack');
        }
        if (this.hasValueForStack(stack)) {
            throw new Error('Cannot assign a reference value twice to the same stack. Use hasValueForStack to check first');
        }
        this.replacementTokens.set(stack, value);
    }
    /**
     * Implementation of toString() that will use the display name
     */
    toString() {
        return token_1.Token.asString(this, {
            displayHint: `${this.target.node.id}.${this.displayName}`,
        });
    }
}
exports.CfnReference = CfnReference;
/**
 * Static table where we keep singleton CfnReference instances
 */
CfnReference.referenceTable = new Map();
const stack_1 = require("../stack");
const token_1 = require("../token");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlZmVyZW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1yZWZlcmVuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlDO0FBQ2pDLDRDQUF5QztBQUV6QyxNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV0RTs7O0dBR0c7QUFDSCxJQUFZLGtCQVlYO0FBWkQsV0FBWSxrQkFBa0I7SUFDNUI7OztPQUdHO0lBQ0gsK0RBQU0sQ0FBQTtJQUVOOzs7T0FHRztJQUNILCtFQUFjLENBQUE7QUFDaEIsQ0FBQyxFQVpXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBWTdCO0FBRUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQWEsWUFBYSxTQUFRLHFCQUFTO0lBQ3pDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFjO1FBQ3pDLE9BQU8sb0JBQW9CLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFrQixFQUFFLFNBQWlCLEVBQUUsU0FBOEIsRUFBRSxRQUE2QjtRQUNwSCxPQUFPLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDeEUsTUFBTSxZQUFZLEdBQUcsU0FBUyxLQUFLLGtCQUFrQixDQUFDLE1BQU07Z0JBQzFELENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNoRixDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssS0FBSztvQkFDcEIsQ0FBQyxDQUFDLEVBQUUsR0FBRyxF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aW50LWRpc2FibGUgaW1wb3J0L29yZGVyICovXG5pbXBvcnQgeyBSZWZlcmVuY2UgfSBmcm9tICcuLi9yZWZlcmVuY2UnO1xuXG5jb25zdCBDRk5fUkVGRVJFTkNFX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuQ2ZuUmVmZXJlbmNlJyk7XG5cbi8qKlxuICogQW4gZW51bSB0aGF0IGFsbG93cyBjb250cm9sbGluZyBob3cgd2lsbCB0aGUgY3JlYXRlZCByZWZlcmVuY2VcbiAqIGJlIHJlbmRlcmVkIGluIHRoZSByZXN1bHRpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBlbnVtIFJlZmVyZW5jZVJlbmRlcmluZyB7XG4gIC8qKlxuICAgKiBVc2VkIGZvciByZW5kZXJpbmcgYSByZWZlcmVuY2UgaW5zaWRlIEZuOjpTdWIgZXhwcmVzc2lvbnMsXG4gICAqIHdoaWNoIG1lYW4gdGhlc2UgbXVzdCByZXNvbHZlIHRvIFwiJHtTdGh9XCIgaW5zdGVhZCBvZiB7IFJlZjogXCJTdGhcIiB9LlxuICAgKi9cbiAgRk5fU1VCLFxuXG4gIC8qKlxuICAgKiBVc2VkIGZvciByZW5kZXJpbmcgRm46OkdldEF0dCB3aXRoIGl0cyBhcmd1bWVudHMgaW4gc3RyaW5nIGZvcm1cbiAgICogKGFzIG9wcG9zZWQgdG8gdGhlIG1vcmUgY29tbW9uIGFyZ3VtZW50cyBpbiBhcnJheSBmb3JtLCB3aGljaCB3ZSByZW5kZXIgYnkgZGVmYXVsdCkuXG4gICAqL1xuICBHRVRfQVRUX1NUUklORyxcbn1cblxuLyoqXG4gKiBBIFRva2VuIHRoYXQgcmVwcmVzZW50cyBhIENsb3VkRm9ybWF0aW9uIHJlZmVyZW5jZSB0byBhbm90aGVyIHJlc291cmNlXG4gKlxuICogSWYgdGhlc2UgcmVmZXJlbmNlcyBhcmUgdXNlZCBpbiBhIGRpZmZlcmVudCBzdGFjayBmcm9tIHdoZXJlIHRoZXkgYXJlXG4gKiBkZWZpbmVkLCBhcHByb3ByaWF0ZSBDbG91ZEZvcm1hdGlvbiBgRXhwb3J0YHMgYW5kIGBGbjo6SW1wb3J0VmFsdWVgcyB3aWxsIGJlXG4gKiBzeW50aGVzaXplZCBhdXRvbWF0aWNhbGx5IGluc3RlYWQgb2YgdGhlIHJlZ3VsYXIgQ2xvdWRGb3JtYXRpb24gcmVmZXJlbmNlcy5cbiAqXG4gKiBBZGRpdGlvbmFsbHksIHRoZSBkZXBlbmRlbmN5IGJldHdlZW4gdGhlIHN0YWNrcyB3aWxsIGJlIHJlY29yZGVkLCBhbmQgdGhlIHRvb2xraXRcbiAqIHdpbGwgbWFrZSBzdXJlIHRvIGRlcGxveSBwcm9kdWNpbmcgc3RhY2sgYmVmb3JlIHRoZSBjb25zdW1pbmcgc3RhY2suXG4gKlxuICogVGhpcyBtYWdpYyBoYXBwZW5zIGluIHRoZSBwcmVwYXJlKCkgcGhhc2UsIHdoZXJlIGNvbnN1bWluZyBzdGFja3Mgd2lsbCBjYWxsXG4gKiBgY29uc3VtZUZyb21TdGFja2Agb24gdGhlc2UgVG9rZW5zIGFuZCBpZiB0aGV5IGhhcHBlbiB0byBiZSBleHBvcnRlZCBieSBhIGRpZmZlcmVudFxuICogU3RhY2ssIHdlJ2xsIHJlZ2lzdGVyIHRoZSBkZXBlbmRlbmN5LlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUmVmZXJlbmNlIGV4dGVuZHMgUmVmZXJlbmNlIHtcbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhpcyBpcyBhY3R1YWxseSBhIFJlZmVyZW5jZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0NmblJlZmVyZW5jZSh4OiBJUmVzb2x2YWJsZSk6IHggaXMgQ2ZuUmVmZXJlbmNlIHtcbiAgICByZXR1cm4gQ0ZOX1JFRkVSRU5DRV9TWU1CT0wgaW4geDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIENmblJlZmVyZW5jZSBmb3IgdGhlIGluZGljYXRlZCB0YXJnZXRcbiAgICpcbiAgICogV2lsbCBtYWtlIHN1cmUgdGhhdCBtdWx0aXBsZSBpbnZvY2F0aW9ucyBmb3IgdGhlIHNhbWUgdGFyZ2V0IGFuZCBpbnRyaW5zaWNcbiAgICogcmV0dXJuIHRoZSBzYW1lIENmblJlZmVyZW5jZS4gQmVjYXVzZSBDZm5SZWZlcmVuY2VzIGFjY3VtdWxhdGUgc3RhdGUgaW5cbiAgICogdGhlIHByZXBhcmUoKSBwaGFzZSAoZm9yIHRoZSBwdXJwb3NlIG9mIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMpLCBpdCdzXG4gICAqIGltcG9ydGFudCB0aGF0IHRoZSBzdGF0ZSBpc24ndCBsb3N0IGlmIGl0J3MgbGF6aWx5IGNyZWF0ZWQsIGxpa2Ugc286XG4gICAqXG4gICAqICAgICBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IG5ldyBDZm5SZWZlcmVuY2UoLi4uKSB9KVxuICAgKlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3IodGFyZ2V0OiBDZm5FbGVtZW50LCBhdHRyaWJ1dGU6IHN0cmluZywgcmVmUmVuZGVyPzogUmVmZXJlbmNlUmVuZGVyaW5nLCB0eXBlSGludD86IFJlc29sdXRpb25UeXBlSGludCkge1xuICAgIHJldHVybiBDZm5SZWZlcmVuY2Uuc2luZ2xldG9uUmVmZXJlbmNlKHRhcmdldCwgYXR0cmlidXRlLCByZWZSZW5kZXIsICgpID0+IHtcbiAgICAgIGNvbnN0IGNmbkludHJpbnNpYyA9IHJlZlJlbmRlciA9PT0gUmVmZXJlbmNlUmVuZGVyaW5nLkZOX1NVQlxuICAgICAgICA/ICgnJHsnICsgdGFyZ2V0LmxvZ2ljYWxJZCArIChhdHRyaWJ1dGUgPT09ICdSZWYnID8gJycgOiBgLiR7YXR0cmlidXRlfWApICsgJ30nKVxuICAgICAgICA6IChhdHRyaWJ1dGUgPT09ICdSZWYnXG4gICAgICAgICAgPyB7IFJlZjogdGFyZ2V0LmxvZ2ljYWxJZCB9XG4gICAgICAgICAgOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IHJlZlJlbmRlciA9PT0gUmVmZXJlbmNlUmVuZGVyaW5nLkdFVF9BVFRfU1RSSU5HXG4gICAgICAgICAgICAgID8gYCR7dGFyZ2V0LmxvZ2ljYWxJZH0uJHthdHRyaWJ1dGV9YFxuICAgICAgICAgICAgICA6IFt0YXJnZXQubG9naWNhbElkLCBhdHRyaWJ1dGVdLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIHJldHVybiBuZXcgQ2ZuUmVmZXJlbmNlKGNmbkludHJpbnNpYywgYXR0cmlidXRlLCB0YXJnZXQsIHR5cGVIaW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBDZm5SZWZlcmVuY2UgdGhhdCByZWZlcmVuY2VzIGEgcHNldWRvIHJlZmVyZW5jZWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZm9yUHNldWRvKHBzZXVkb05hbWU6IHN0cmluZywgc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIHJldHVybiBDZm5SZWZlcmVuY2Uuc2luZ2xldG9uUmVmZXJlbmNlKHNjb3BlLCBgUHNldWRvOiR7cHNldWRvTmFtZX1gLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgIGNvbnN0IGNmbkludHJpbnNpYyA9IHsgUmVmOiBwc2V1ZG9OYW1lIH07XG4gICAgICByZXR1cm4gbmV3IENmblJlZmVyZW5jZShjZm5JbnRyaW5zaWMsIHBzZXVkb05hbWUsIHNjb3BlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGF0aWMgdGFibGUgd2hlcmUgd2Uga2VlcCBzaW5nbGV0b24gQ2ZuUmVmZXJlbmNlIGluc3RhbmNlc1xuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcmVmZXJlbmNlVGFibGUgPSBuZXcgTWFwPENvbnN0cnVjdCwgTWFwPHN0cmluZywgQ2ZuUmVmZXJlbmNlPj4oKTtcblxuICAvKipcbiAgICogR2V0IG9yIGNyZWF0ZSB0aGUgdGFibGUuXG4gICAqIFBhc3NpbmcgZm5TdWIgPSB0cnVlIGFsbG93cyBjbG91ZGZvcm1hdGlvbi1pbmNsdWRlIHRvIGNvcnJlY3RseSBoYW5kbGUgRm46OlN1Yi5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHNpbmdsZXRvblJlZmVyZW5jZSh0YXJnZXQ6IENvbnN0cnVjdCwgYXR0cmliS2V5OiBzdHJpbmcsIHJlZlJlbmRlcjogUmVmZXJlbmNlUmVuZGVyaW5nIHwgdW5kZWZpbmVkLCBmcmVzaDogKCkgPT4gQ2ZuUmVmZXJlbmNlKSB7XG4gICAgbGV0IGF0dHJpYnMgPSBDZm5SZWZlcmVuY2UucmVmZXJlbmNlVGFibGUuZ2V0KHRhcmdldCk7XG4gICAgaWYgKCFhdHRyaWJzKSB7XG4gICAgICBhdHRyaWJzID0gbmV3IE1hcCgpO1xuICAgICAgQ2ZuUmVmZXJlbmNlLnJlZmVyZW5jZVRhYmxlLnNldCh0YXJnZXQsIGF0dHJpYnMpO1xuICAgIH1cbiAgICBsZXQgY2FjaGVLZXkgPSBhdHRyaWJLZXk7XG4gICAgc3dpdGNoIChyZWZSZW5kZXIpIHtcbiAgICAgIGNhc2UgUmVmZXJlbmNlUmVuZGVyaW5nLkZOX1NVQjpcbiAgICAgICAgY2FjaGVLZXkgKz0gJ0ZuOjpTdWInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUmVmZXJlbmNlUmVuZGVyaW5nLkdFVF9BVFRfU1RSSU5HOlxuICAgICAgICBjYWNoZUtleSArPSAnRm46OkdldEF0dDo6U3RyaW5nJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCByZWYgPSBhdHRyaWJzLmdldChjYWNoZUtleSk7XG4gICAgaWYgKCFyZWYpIHtcbiAgICAgIHJlZiA9IGZyZXNoKCk7XG4gICAgICBhdHRyaWJzLnNldChjYWNoZUtleSwgcmVmKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgVG9rZW5zIHRoYXQgc2hvdWxkIGJlIHJldHVybmVkIGZvciBlYWNoIGNvbnN1bWluZyBzdGFjayAoYXMgZGVjaWRlZCBieSB0aGUgcHJvZHVjaW5nIFN0YWNrKVxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSByZXBsYWNlbWVudFRva2VuczogTWFwPFN0YWNrLCBJUmVzb2x2YWJsZT47XG4gIHByaXZhdGUgcmVhZG9ubHkgdGFyZ2V0U3RhY2s6IFN0YWNrO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCBkaXNwbGF5TmFtZTogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0OiBJQ29uc3RydWN0LCB0eXBlSGludD86IFJlc29sdXRpb25UeXBlSGludCkge1xuICAgIC8vIHByZXBlbmQgc2NvcGUgcGF0aCB0byBkaXNwbGF5IG5hbWVcbiAgICBzdXBlcih2YWx1ZSwgdGFyZ2V0LCBkaXNwbGF5TmFtZSwgdHlwZUhpbnQpO1xuXG4gICAgdGhpcy5yZXBsYWNlbWVudFRva2VucyA9IG5ldyBNYXA8U3RhY2ssIElSZXNvbHZhYmxlPigpO1xuICAgIHRoaXMudGFyZ2V0U3RhY2sgPSBTdGFjay5vZih0YXJnZXQpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIENGTl9SRUZFUkVOQ0VfU1lNQk9MLCB7IHZhbHVlOiB0cnVlIH0pO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICAvLyBJZiB3ZSBoYXZlIGEgc3BlY2lhbCB0b2tlbiBmb3IgdGhpcyBjb25zdW1pbmcgc3RhY2ssIHJlc29sdmUgdGhhdC4gT3RoZXJ3aXNlIHJlc29sdmUgYXMgaWZcbiAgICAvLyB3ZSBhcmUgaW4gdGhlIHNhbWUgc3RhY2suXG4gICAgY29uc3QgY29uc3VtaW5nU3RhY2sgPSBTdGFjay5vZihjb250ZXh0LnNjb3BlKTtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucmVwbGFjZW1lbnRUb2tlbnMuZ2V0KGNvbnN1bWluZ1N0YWNrKTtcblxuICAgIC8vIGlmICghdG9rZW4gJiYgdGhpcy5pc0Nyb3NzU3RhY2tSZWZlcmVuY2UoY29uc3VtaW5nU3RhY2spICYmICFjb250ZXh0LnByZXBhcmluZykge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgLy8gICB0aHJvdyBuZXcgRXJyb3IoYENyb3NzLXN0YWNrIHJlZmVyZW5jZSAoJHtjb250ZXh0LnNjb3BlLm5vZGUucGF0aH0gLT4gJHt0aGlzLnRhcmdldC5ub2RlLnBhdGh9KSBoYXMgbm90IGJlZW4gYXNzaWduZWQgYSB2YWx1ZS0tY2FsbCBwcmVwYXJlKCkgZmlyc3RgKTtcbiAgICAvLyB9XG5cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHJldHVybiB0b2tlbi5yZXNvbHZlKGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVzb2x2ZShjb250ZXh0KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGFzVmFsdWVGb3JTdGFjayhzdGFjazogU3RhY2spIHtcbiAgICBpZiAoc3RhY2sgPT09IHRoaXMudGFyZ2V0U3RhY2spIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlcGxhY2VtZW50VG9rZW5zLmhhcyhzdGFjayk7XG4gIH1cblxuICBwdWJsaWMgYXNzaWduVmFsdWVGb3JTdGFjayhzdGFjazogU3RhY2ssIHZhbHVlOiBJUmVzb2x2YWJsZSkge1xuICAgIGlmIChzdGFjayA9PT0gdGhpcy50YXJnZXRTdGFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgYXNzaWduIGEgdmFsdWUgZm9yIHRoZSBzYW1lIHN0YWNrJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzVmFsdWVGb3JTdGFjayhzdGFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFzc2lnbiBhIHJlZmVyZW5jZSB2YWx1ZSB0d2ljZSB0byB0aGUgc2FtZSBzdGFjay4gVXNlIGhhc1ZhbHVlRm9yU3RhY2sgdG8gY2hlY2sgZmlyc3QnKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcGxhY2VtZW50VG9rZW5zLnNldChzdGFjaywgdmFsdWUpO1xuICB9XG4gIC8qKlxuICAgKiBJbXBsZW1lbnRhdGlvbiBvZiB0b1N0cmluZygpIHRoYXQgd2lsbCB1c2UgdGhlIGRpc3BsYXkgbmFtZVxuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMsIHtcbiAgICAgIGRpc3BsYXlIaW50OiBgJHt0aGlzLnRhcmdldC5ub2RlLmlkfS4ke3RoaXMuZGlzcGxheU5hbWV9YCxcbiAgICB9KTtcbiAgfVxufVxuXG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkVsZW1lbnQgfSBmcm9tICcuLi9jZm4tZWxlbWVudCc7XG5pbXBvcnQgeyBJUmVzb2x2YWJsZSwgSVJlc29sdmVDb250ZXh0IH0gZnJvbSAnLi4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuaW1wb3J0IHsgUmVzb2x1dGlvblR5cGVIaW50IH0gZnJvbSAnLi4vdHlwZS1oaW50cyc7XG4iXX0=