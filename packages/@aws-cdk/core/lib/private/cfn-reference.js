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
    constructor(value, displayName, target, typeHint) {
        // prepend scope path to display name
        super(value, target, displayName, typeHint);
        this.target = target;
        this.replacementTokens = new Map();
        this.targetStack = stack_1.Stack.of(target);
        Object.defineProperty(this, CFN_REFERENCE_SYMBOL, { value: true });
    }
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
     * Return a CfnReference that references a pseudo referencd
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlZmVyZW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1yZWZlcmVuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlDO0FBQ2pDLDRDQUF5QztBQUV6QyxNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV0RTs7O0dBR0c7QUFDSCxJQUFZLGtCQVlYO0FBWkQsV0FBWSxrQkFBa0I7SUFDNUI7OztPQUdHO0lBQ0gsK0RBQU0sQ0FBQTtJQUVOOzs7T0FHRztJQUNILCtFQUFjLENBQUE7QUFDaEIsQ0FBQyxFQVpXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBWTdCO0FBRUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQWEsWUFBYSxTQUFRLHFCQUFTO0lBbUZ6QyxZQUFzQixLQUFVLEVBQUUsV0FBbUIsRUFBa0IsTUFBa0IsRUFBRSxRQUE2QjtRQUN0SCxxQ0FBcUM7UUFDckMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRnlCLFdBQU0sR0FBTixNQUFNLENBQVk7UUFJdkYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1FBQ3ZELElBQUksQ0FBQyxXQUFXLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3BFO0lBMUZEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFjO1FBQ3pDLE9BQU8sb0JBQW9CLElBQUksQ0FBQyxDQUFDO0tBQ2xDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBa0IsRUFBRSxTQUFpQixFQUFF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M0osSUFBSTtRQUVKLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQy9CO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0I7S0FDRjtJQUVNLGdCQUFnQixDQUFDLEtBQVk7UUFDbEMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFDO0lBRU0sbUJBQW1CLENBQUMsS0FBWSxFQUFFLEtBQWtCO1FBQ3pELElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1NBQzdEO1FBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4RkFBOEYsQ0FBQyxDQUFDO1NBQ2pIO1FBRUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDMUM7SUFDRDs7T0FFRztJQUNJLFFBQVE7UUFDYixPQUFPLGFBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzFCLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1NBQzFELENBQUMsQ0FBQztLQUNKOztBQXpJSCxvQ0EwSUM7QUE3RkM7O0dBRUc7QUFDWSwyQkFBYyxHQUFHLElBQUksR0FBRyxFQUF3QyxDQUFDO0FBK0ZsRixvQ0FBaUM7QUFDakMsb0NBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L29yZGVyICovXG5pbXBvcnQgeyBSZWZlcmVuY2UgfSBmcm9tICcuLi9yZWZlcmVuY2UnO1xuXG5jb25zdCBDRk5fUkVGRVJFTkNFX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuQ2ZuUmVmZXJlbmNlJyk7XG5cbi8qKlxuICogQW4gZW51bSB0aGF0IGFsbG93cyBjb250cm9sbGluZyBob3cgd2lsbCB0aGUgY3JlYXRlZCByZWZlcmVuY2VcbiAqIGJlIHJlbmRlcmVkIGluIHRoZSByZXN1bHRpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBlbnVtIFJlZmVyZW5jZVJlbmRlcmluZyB7XG4gIC8qKlxuICAgKiBVc2VkIGZvciByZW5kZXJpbmcgYSByZWZlcmVuY2UgaW5zaWRlIEZuOjpTdWIgZXhwcmVzc2lvbnMsXG4gICAqIHdoaWNoIG1lYW4gdGhlc2UgbXVzdCByZXNvbHZlIHRvIFwiJHtTdGh9XCIgaW5zdGVhZCBvZiB7IFJlZjogXCJTdGhcIiB9LlxuICAgKi9cbiAgRk5fU1VCLFxuXG4gIC8qKlxuICAgKiBVc2VkIGZvciByZW5kZXJpbmcgRm46OkdldEF0dCB3aXRoIGl0cyBhcmd1bWVudHMgaW4gc3RyaW5nIGZvcm1cbiAgICogKGFzIG9wcG9zZWQgdG8gdGhlIG1vcmUgY29tbW9uIGFyZ3VtZW50cyBpbiBhcnJheSBmb3JtLCB3aGljaCB3ZSByZW5kZXIgYnkgZGVmYXVsdCkuXG4gICAqL1xuICBHRVRfQVRUX1NUUklORyxcbn1cblxuLyoqXG4gKiBBIFRva2VuIHRoYXQgcmVwcmVzZW50cyBhIENsb3VkRm9ybWF0aW9uIHJlZmVyZW5jZSB0byBhbm90aGVyIHJlc291cmNlXG4gKlxuICogSWYgdGhlc2UgcmVmZXJlbmNlcyBhcmUgdXNlZCBpbiBhIGRpZmZlcmVudCBzdGFjayBmcm9tIHdoZXJlIHRoZXkgYXJlXG4gKiBkZWZpbmVkLCBhcHByb3ByaWF0ZSBDbG91ZEZvcm1hdGlvbiBgRXhwb3J0YHMgYW5kIGBGbjo6SW1wb3J0VmFsdWVgcyB3aWxsIGJlXG4gKiBzeW50aGVzaXplZCBhdXRvbWF0aWNhbGx5IGluc3RlYWQgb2YgdGhlIHJlZ3VsYXIgQ2xvdWRGb3JtYXRpb24gcmVmZXJlbmNlcy5cbiAqXG4gKiBBZGRpdGlvbmFsbHksIHRoZSBkZXBlbmRlbmN5IGJldHdlZW4gdGhlIHN0YWNrcyB3aWxsIGJlIHJlY29yZGVkLCBhbmQgdGhlIHRvb2xraXRcbiAqIHdpbGwgbWFrZSBzdXJlIHRvIGRlcGxveSBwcm9kdWNpbmcgc3RhY2sgYmVmb3JlIHRoZSBjb25zdW1pbmcgc3RhY2suXG4gKlxuICogVGhpcyBtYWdpYyBoYXBwZW5zIGluIHRoZSBwcmVwYXJlKCkgcGhhc2UsIHdoZXJlIGNvbnN1bWluZyBzdGFja3Mgd2lsbCBjYWxsXG4gKiBgY29uc3VtZUZyb21TdGFja2Agb24gdGhlc2UgVG9rZW5zIGFuZCBpZiB0aGV5IGhhcHBlbiB0byBiZSBleHBvcnRlZCBieSBhIGRpZmZlcmVudFxuICogU3RhY2ssIHdlJ2xsIHJlZ2lzdGVyIHRoZSBkZXBlbmRlbmN5LlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUmVmZXJlbmNlIGV4dGVuZHMgUmVmZXJlbmNlIHtcbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhpcyBpcyBhY3R1YWxseSBhIFJlZmVyZW5jZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0NmblJlZmVyZW5jZSh4OiBJUmVzb2x2YWJsZSk6IHggaXMgQ2ZuUmVmZXJlbmNlIHtcbiAgICByZXR1cm4gQ0ZOX1JFRkVSRU5DRV9TWU1CT0wgaW4geDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIENmblJlZmVyZW5jZSBmb3IgdGhlIGluZGljYXRlZCB0YXJnZXRcbiAgICpcbiAgICogV2lsbCBtYWtlIHN1cmUgdGhhdCBtdWx0aXBsZSBpbnZvY2F0aW9ucyBmb3IgdGhlIHNhbWUgdGFyZ2V0IGFuZCBpbnRyaW5zaWNcbiAgICogcmV0dXJuIHRoZSBzYW1lIENmblJlZmVyZW5jZS4gQmVjYXVzZSBDZm5SZWZlcmVuY2VzIGFjY3VtdWxhdGUgc3RhdGUgaW5cbiAgICogdGhlIHByZXBhcmUoKSBwaGFzZSAoZm9yIHRoZSBwdXJwb3NlIG9mIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMpLCBpdCdzXG4gICAqIGltcG9ydGFudCB0aGF0IHRoZSBzdGF0ZSBpc24ndCBsb3N0IGlmIGl0J3MgbGF6aWx5IGNyZWF0ZWQsIGxpa2Ugc286XG4gICAqXG4gICAqICAgICBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IG5ldyBDZm5SZWZlcmVuY2UoLi4uKSB9KVxuICAgKlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3IodGFyZ2V0OiBDZm5FbGVtZW50LCBhdHRyaWJ1dGU6IHN0cmluZywgcmVmUmVuZGVyPzogUmVmZXJlbmNlUmVuZGVyaW5nLCB0eXBlSGludD86IFJlc29sdXRpb25UeXBlSGludCkge1xuICAgIHJldHVybiBDZm5SZWZlcmVuY2Uuc2luZ2xldG9uUmVmZXJlbmNlKHRhcmdldCwgYXR0cmlidXRlLCByZWZSZW5kZXIsICgpID0+IHtcbiAgICAgIGNvbnN0IGNmbkludHJpbnNpYyA9IHJlZlJlbmRlciA9PT0gUmVmZXJlbmNlUmVuZGVyaW5nLkZOX1NVQlxuICAgICAgICA/ICgnJHsnICsgdGFyZ2V0LmxvZ2ljYWxJZCArIChhdHRyaWJ1dGUgPT09ICdSZWYnID8gJycgOiBgLiR7YXR0cmlidXRlfWApICsgJ30nKVxuICAgICAgICA6IChhdHRyaWJ1dGUgPT09ICdSZWYnXG4gICAgICAgICAgPyB7IFJlZjogdGFyZ2V0LmxvZ2ljYWxJZCB9XG4gICAgICAgICAgOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IHJlZlJlbmRlciA9PT0gUmVmZXJlbmNlUmVuZGVyaW5nLkdFVF9BVFRfU1RSSU5HXG4gICAgICAgICAgICAgID8gYCR7dGFyZ2V0LmxvZ2ljYWxJZH0uJHthdHRyaWJ1dGV9YFxuICAgICAgICAgICAgICA6IFt0YXJnZXQubG9naWNhbElkLCBhdHRyaWJ1dGVdLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIHJldHVybiBuZXcgQ2ZuUmVmZXJlbmNlKGNmbkludHJpbnNpYywgYXR0cmlidXRlLCB0YXJnZXQsIHR5cGVIaW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBDZm5SZWZlcmVuY2UgdGhhdCByZWZlcmVuY2VzIGEgcHNldWRvIHJlZmVyZW5jZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3JQc2V1ZG8ocHNldWRvTmFtZTogc3RyaW5nLCBzY29wZTogQ29uc3RydWN0KSB7XG4gICAgcmV0dXJuIENmblJlZmVyZW5jZS5zaW5nbGV0b25SZWZlcmVuY2Uoc2NvcGUsIGBQc2V1ZG86JHtwc2V1ZG9OYW1lfWAsIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgY29uc3QgY2ZuSW50cmluc2ljID0geyBSZWY6IHBzZXVkb05hbWUgfTtcbiAgICAgIHJldHVybiBuZXcgQ2ZuUmVmZXJlbmNlKGNmbkludHJpbnNpYywgcHNldWRvTmFtZSwgc2NvcGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXRpYyB0YWJsZSB3aGVyZSB3ZSBrZWVwIHNpbmdsZXRvbiBDZm5SZWZlcmVuY2UgaW5zdGFuY2VzXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyByZWZlcmVuY2VUYWJsZSA9IG5ldyBNYXA8Q29uc3RydWN0LCBNYXA8c3RyaW5nLCBDZm5SZWZlcmVuY2U+PigpO1xuXG4gIC8qKlxuICAgKiBHZXQgb3IgY3JlYXRlIHRoZSB0YWJsZS5cbiAgICogUGFzc2luZyBmblN1YiA9IHRydWUgYWxsb3dzIGNsb3VkZm9ybWF0aW9uLWluY2x1ZGUgdG8gY29ycmVjdGx5IGhhbmRsZSBGbjo6U3ViLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgc2luZ2xldG9uUmVmZXJlbmNlKHRhcmdldDogQ29uc3RydWN0LCBhdHRyaWJLZXk6IHN0cmluZywgcmVmUmVuZGVyOiBSZWZlcmVuY2VSZW5kZXJpbmcgfCB1bmRlZmluZWQsIGZyZXNoOiAoKSA9PiBDZm5SZWZlcmVuY2UpIHtcbiAgICBsZXQgYXR0cmlicyA9IENmblJlZmVyZW5jZS5yZWZlcmVuY2VUYWJsZS5nZXQodGFyZ2V0KTtcbiAgICBpZiAoIWF0dHJpYnMpIHtcbiAgICAgIGF0dHJpYnMgPSBuZXcgTWFwKCk7XG4gICAgICBDZm5SZWZlcmVuY2UucmVmZXJlbmNlVGFibGUuc2V0KHRhcmdldCwgYXR0cmlicyk7XG4gICAgfVxuICAgIGxldCBjYWNoZUtleSA9IGF0dHJpYktleTtcbiAgICBzd2l0Y2ggKHJlZlJlbmRlcikge1xuICAgICAgY2FzZSBSZWZlcmVuY2VSZW5kZXJpbmcuRk5fU1VCOlxuICAgICAgICBjYWNoZUtleSArPSAnRm46OlN1Yic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSZWZlcmVuY2VSZW5kZXJpbmcuR0VUX0FUVF9TVFJJTkc6XG4gICAgICAgIGNhY2hlS2V5ICs9ICdGbjo6R2V0QXR0OjpTdHJpbmcnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgbGV0IHJlZiA9IGF0dHJpYnMuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoIXJlZikge1xuICAgICAgcmVmID0gZnJlc2goKTtcbiAgICAgIGF0dHJpYnMuc2V0KGNhY2hlS2V5LCByZWYpO1xuICAgIH1cbiAgICByZXR1cm4gcmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBUb2tlbnMgdGhhdCBzaG91bGQgYmUgcmV0dXJuZWQgZm9yIGVhY2ggY29uc3VtaW5nIHN0YWNrIChhcyBkZWNpZGVkIGJ5IHRoZSBwcm9kdWNpbmcgU3RhY2spXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHJlcGxhY2VtZW50VG9rZW5zOiBNYXA8U3RhY2ssIElSZXNvbHZhYmxlPjtcbiAgcHJpdmF0ZSByZWFkb25seSB0YXJnZXRTdGFjazogU3RhY2s7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIGRpc3BsYXlOYW1lOiBzdHJpbmcsIHB1YmxpYyByZWFkb25seSB0YXJnZXQ6IElDb25zdHJ1Y3QsIHR5cGVIaW50PzogUmVzb2x1dGlvblR5cGVIaW50KSB7XG4gICAgLy8gcHJlcGVuZCBzY29wZSBwYXRoIHRvIGRpc3BsYXkgbmFtZVxuICAgIHN1cGVyKHZhbHVlLCB0YXJnZXQsIGRpc3BsYXlOYW1lLCB0eXBlSGludCk7XG5cbiAgICB0aGlzLnJlcGxhY2VtZW50VG9rZW5zID0gbmV3IE1hcDxTdGFjaywgSVJlc29sdmFibGU+KCk7XG4gICAgdGhpcy50YXJnZXRTdGFjayA9IFN0YWNrLm9mKHRhcmdldCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgQ0ZOX1JFRkVSRU5DRV9TWU1CT0wsIHsgdmFsdWU6IHRydWUgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIC8vIElmIHdlIGhhdmUgYSBzcGVjaWFsIHRva2VuIGZvciB0aGlzIGNvbnN1bWluZyBzdGFjaywgcmVzb2x2ZSB0aGF0LiBPdGhlcndpc2UgcmVzb2x2ZSBhcyBpZlxuICAgIC8vIHdlIGFyZSBpbiB0aGUgc2FtZSBzdGFjay5cbiAgICBjb25zdCBjb25zdW1pbmdTdGFjayA9IFN0YWNrLm9mKGNvbnRleHQuc2NvcGUpO1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5yZXBsYWNlbWVudFRva2Vucy5nZXQoY29uc3VtaW5nU3RhY2spO1xuXG4gICAgLy8gaWYgKCF0b2tlbiAmJiB0aGlzLmlzQ3Jvc3NTdGFja1JlZmVyZW5jZShjb25zdW1pbmdTdGFjaykgJiYgIWNvbnRleHQucHJlcGFyaW5nKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcihgQ3Jvc3Mtc3RhY2sgcmVmZXJlbmNlICgke2NvbnRleHQuc2NvcGUubm9kZS5wYXRofSAtPiAke3RoaXMudGFyZ2V0Lm5vZGUucGF0aH0pIGhhcyBub3QgYmVlbiBhc3NpZ25lZCBhIHZhbHVlLS1jYWxsIHByZXBhcmUoKSBmaXJzdGApO1xuICAgIC8vIH1cblxuICAgIGlmICh0b2tlbikge1xuICAgICAgcmV0dXJuIHRva2VuLnJlc29sdmUoY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdXBlci5yZXNvbHZlKGNvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBoYXNWYWx1ZUZvclN0YWNrKHN0YWNrOiBTdGFjaykge1xuICAgIGlmIChzdGFjayA9PT0gdGhpcy50YXJnZXRTdGFjaykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZW1lbnRUb2tlbnMuaGFzKHN0YWNrKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NpZ25WYWx1ZUZvclN0YWNrKHN0YWNrOiBTdGFjaywgdmFsdWU6IElSZXNvbHZhYmxlKSB7XG4gICAgaWYgKHN0YWNrID09PSB0aGlzLnRhcmdldFN0YWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBhc3NpZ24gYSB2YWx1ZSBmb3IgdGhlIHNhbWUgc3RhY2snKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNWYWx1ZUZvclN0YWNrKHN0YWNrKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYXNzaWduIGEgcmVmZXJlbmNlIHZhbHVlIHR3aWNlIHRvIHRoZSBzYW1lIHN0YWNrLiBVc2UgaGFzVmFsdWVGb3JTdGFjayB0byBjaGVjayBmaXJzdCcpO1xuICAgIH1cblxuICAgIHRoaXMucmVwbGFjZW1lbnRUb2tlbnMuc2V0KHN0YWNrLCB2YWx1ZSk7XG4gIH1cbiAgLyoqXG4gICAqIEltcGxlbWVudGF0aW9uIG9mIHRvU3RyaW5nKCkgdGhhdCB3aWxsIHVzZSB0aGUgZGlzcGxheSBuYW1lXG4gICAqL1xuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcywge1xuICAgICAgZGlzcGxheUhpbnQ6IGAke3RoaXMudGFyZ2V0Lm5vZGUuaWR9LiR7dGhpcy5kaXNwbGF5TmFtZX1gLFxuICAgIH0pO1xuICB9XG59XG5cbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCB9IGZyb20gJy4uL2Nmbi1lbGVtZW50JztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuLi90b2tlbic7XG5pbXBvcnQgeyBSZXNvbHV0aW9uVHlwZUhpbnQgfSBmcm9tICcuLi90eXBlLWhpbnRzJztcbiJdfQ==