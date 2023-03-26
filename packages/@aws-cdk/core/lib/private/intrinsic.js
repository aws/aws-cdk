"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intrinsic = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const stack_trace_1 = require("../stack-trace");
const token_1 = require("../token");
const type_hints_1 = require("../type-hints");
/**
 * Token subclass that represents values intrinsic to the target document language
 *
 * WARNING: this class should not be externally exposed, but is currently visible
 * because of a limitation of jsii (https://github.com/aws/jsii/issues/524).
 *
 * This class will disappear in a future release and should not be used.
 *
 */
class Intrinsic {
    constructor(value, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IntrinsicProps(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Intrinsic);
            }
            throw error;
        }
        if (isFunction(value)) {
            throw new Error(`Argument to Intrinsic must be a plain value object, got ${value}`);
        }
        this.creationStack = options.stackTrace ?? true ? (0, stack_trace_1.captureStackTrace)() : [];
        this.value = value;
        this.typeHint = options.typeHint ?? type_hints_1.ResolutionTypeHint.STRING;
    }
    resolve(_context) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IResolveContext(_context);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.resolve);
            }
            throw error;
        }
        return this.value;
    }
    /**
     * Convert an instance of this Token to a string
     *
     * This method will be called implicitly by language runtimes if the object
     * is embedded into a string. We treat it the same as an explicit
     * stringification.
     */
    toString() {
        return token_1.Token.asString(this);
    }
    /**
     * Convert an instance of this Token to a string list
     *
     * This method will be called implicitly by language runtimes if the object
     * is embedded into a list. We treat it the same as an explicit
     * stringification.
     */
    toStringList() {
        return token_1.Token.asList(this);
    }
    /**
     * Turn this Token into JSON
     *
     * Called automatically when JSON.stringify() is called on a Token.
     */
    toJSON() {
        // We can't do the right work here because in case we contain a function, we
        // won't know the type of value that function represents (in the simplest
        // case, string or number), and we can't know that without an
        // IResolveContext to actually do the resolution, which we don't have.
        // We used to throw an error, but since JSON.stringify() is often used in
        // error messages to produce a readable representation of an object, if we
        // throw here we'll obfuscate that descriptive error with something worse.
        // So return a string representation that indicates this thing is a token
        // and needs resolving.
        return '<unresolved-token>';
    }
    /**
     * Creates a throwable Error object that contains the token creation stack trace.
     * @param message Error message
     */
    newError(message) {
        return new Error(`${message}\nToken created:\n    at ${this.creationStack.join('\n    at ')}\nError thrown:`);
    }
}
_a = JSII_RTTI_SYMBOL_1;
Intrinsic[_a] = { fqn: "@aws-cdk/core.Intrinsic", version: "0.0.0" };
exports.Intrinsic = Intrinsic;
function isFunction(x) {
    return typeof x === 'function';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50cmluc2ljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50cmluc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLGdEQUFtRDtBQUNuRCxvQ0FBaUM7QUFDakMsOENBQW1EO0FBdUJuRDs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsU0FBUztJQWFwQixZQUFZLEtBQVUsRUFBRSxVQUEwQixFQUFFOzs7Ozs7K0NBYnpDLFNBQVM7Ozs7UUFjbEIsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNyRjtRQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUEsK0JBQWlCLEdBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSwrQkFBa0IsQ0FBQyxNQUFNLENBQUM7S0FDL0Q7SUFFTSxPQUFPLENBQUMsUUFBeUI7Ozs7Ozs7Ozs7UUFDdEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25CO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksUUFBUTtRQUNiLE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3QjtJQUVEOzs7Ozs7T0FNRztJQUNJLFlBQVk7UUFDakIsT0FBTyxhQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzNCO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU07UUFDWCw0RUFBNEU7UUFDNUUseUVBQXlFO1FBQ3pFLDZEQUE2RDtRQUM3RCxzRUFBc0U7UUFFdEUseUVBQXlFO1FBQ3pFLDBFQUEwRTtRQUMxRSwwRUFBMEU7UUFDMUUseUVBQXlFO1FBQ3pFLHVCQUF1QjtRQUN2QixPQUFPLG9CQUFvQixDQUFDO0tBQzdCO0lBRUQ7OztPQUdHO0lBQ08sUUFBUSxDQUFDLE9BQWU7UUFDaEMsT0FBTyxJQUFJLEtBQUssQ0FBQyxHQUFHLE9BQU8sNEJBQTRCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQy9HOzs7O0FBMUVVLDhCQUFTO0FBNkV0QixTQUFTLFVBQVUsQ0FBQyxDQUFNO0lBQ3hCLE9BQU8sT0FBTyxDQUFDLEtBQUssVUFBVSxDQUFDO0FBQ2pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb2x2YWJsZSwgSVJlc29sdmVDb250ZXh0IH0gZnJvbSAnLi4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBjYXB0dXJlU3RhY2tUcmFjZSB9IGZyb20gJy4uL3N0YWNrLXRyYWNlJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuaW1wb3J0IHsgUmVzb2x1dGlvblR5cGVIaW50IH0gZnJvbSAnLi4vdHlwZS1oaW50cyc7XG5cbi8qKlxuICogQ3VzdG9taXphdGlvbiBwcm9wZXJ0aWVzIGZvciBhbiBJbnRyaW5zaWMgdG9rZW5cbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW50cmluc2ljUHJvcHMge1xuICAvKipcbiAgICogQ2FwdHVyZSB0aGUgc3RhY2sgdHJhY2Ugb2Ygd2hlcmUgdGhpcyB0b2tlbiBpcyBjcmVhdGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHN0YWNrVHJhY2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKlxuICAgKiBUeXBlIHRoYXQgdGhpcyB0b2tlbiBpcyBleHBlY3RlZCB0byBldmFsdWF0ZSB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HXG4gICAqL1xuICByZWFkb25seSB0eXBlSGludD86IFJlc29sdXRpb25UeXBlSGludDtcbn1cblxuLyoqXG4gKiBUb2tlbiBzdWJjbGFzcyB0aGF0IHJlcHJlc2VudHMgdmFsdWVzIGludHJpbnNpYyB0byB0aGUgdGFyZ2V0IGRvY3VtZW50IGxhbmd1YWdlXG4gKlxuICogV0FSTklORzogdGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGV4dGVybmFsbHkgZXhwb3NlZCwgYnV0IGlzIGN1cnJlbnRseSB2aXNpYmxlXG4gKiBiZWNhdXNlIG9mIGEgbGltaXRhdGlvbiBvZiBqc2lpIChodHRwczovL2dpdGh1Yi5jb20vYXdzL2pzaWkvaXNzdWVzLzUyNCkuXG4gKlxuICogVGhpcyBjbGFzcyB3aWxsIGRpc2FwcGVhciBpbiBhIGZ1dHVyZSByZWxlYXNlIGFuZCBzaG91bGQgbm90IGJlIHVzZWQuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgSW50cmluc2ljIGltcGxlbWVudHMgSVJlc29sdmFibGUge1xuICAvKipcbiAgICogVGhlIGNhcHR1cmVkIHN0YWNrIHRyYWNlIHdoaWNoIHJlcHJlc2VudHMgdGhlIGxvY2F0aW9uIGluIHdoaWNoIHRoaXMgdG9rZW4gd2FzIGNyZWF0ZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFR5cGUgdGhhdCB0aGUgSW50cmluc2ljIGlzIGV4cGVjdGVkIHRvIGV2YWx1YXRlIHRvLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHR5cGVIaW50PzogUmVzb2x1dGlvblR5cGVIaW50O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCBvcHRpb25zOiBJbnRyaW5zaWNQcm9wcyA9IHt9KSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50IHRvIEludHJpbnNpYyBtdXN0IGJlIGEgcGxhaW4gdmFsdWUgb2JqZWN0LCBnb3QgJHt2YWx1ZX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBvcHRpb25zLnN0YWNrVHJhY2UgPz8gdHJ1ZSA/IGNhcHR1cmVTdGFja1RyYWNlKCkgOiBbXTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy50eXBlSGludCA9IG9wdGlvbnMudHlwZUhpbnQgPz8gUmVzb2x1dGlvblR5cGVIaW50LlNUUklORztcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKF9jb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGluc3RhbmNlIG9mIHRoaXMgVG9rZW4gdG8gYSBzdHJpbmdcbiAgICpcbiAgICogVGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgaW1wbGljaXRseSBieSBsYW5ndWFnZSBydW50aW1lcyBpZiB0aGUgb2JqZWN0XG4gICAqIGlzIGVtYmVkZGVkIGludG8gYSBzdHJpbmcuIFdlIHRyZWF0IGl0IHRoZSBzYW1lIGFzIGFuIGV4cGxpY2l0XG4gICAqIHN0cmluZ2lmaWNhdGlvbi5cbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGluc3RhbmNlIG9mIHRoaXMgVG9rZW4gdG8gYSBzdHJpbmcgbGlzdFxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBpbXBsaWNpdGx5IGJ5IGxhbmd1YWdlIHJ1bnRpbWVzIGlmIHRoZSBvYmplY3RcbiAgICogaXMgZW1iZWRkZWQgaW50byBhIGxpc3QuIFdlIHRyZWF0IGl0IHRoZSBzYW1lIGFzIGFuIGV4cGxpY2l0XG4gICAqIHN0cmluZ2lmaWNhdGlvbi5cbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZ0xpc3QoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVHVybiB0aGlzIFRva2VuIGludG8gSlNPTlxuICAgKlxuICAgKiBDYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIEpTT04uc3RyaW5naWZ5KCkgaXMgY2FsbGVkIG9uIGEgVG9rZW4uXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCk6IGFueSB7XG4gICAgLy8gV2UgY2FuJ3QgZG8gdGhlIHJpZ2h0IHdvcmsgaGVyZSBiZWNhdXNlIGluIGNhc2Ugd2UgY29udGFpbiBhIGZ1bmN0aW9uLCB3ZVxuICAgIC8vIHdvbid0IGtub3cgdGhlIHR5cGUgb2YgdmFsdWUgdGhhdCBmdW5jdGlvbiByZXByZXNlbnRzIChpbiB0aGUgc2ltcGxlc3RcbiAgICAvLyBjYXNlLCBzdHJpbmcgb3IgbnVtYmVyKSwgYW5kIHdlIGNhbid0IGtub3cgdGhhdCB3aXRob3V0IGFuXG4gICAgLy8gSVJlc29sdmVDb250ZXh0IHRvIGFjdHVhbGx5IGRvIHRoZSByZXNvbHV0aW9uLCB3aGljaCB3ZSBkb24ndCBoYXZlLlxuXG4gICAgLy8gV2UgdXNlZCB0byB0aHJvdyBhbiBlcnJvciwgYnV0IHNpbmNlIEpTT04uc3RyaW5naWZ5KCkgaXMgb2Z0ZW4gdXNlZCBpblxuICAgIC8vIGVycm9yIG1lc3NhZ2VzIHRvIHByb2R1Y2UgYSByZWFkYWJsZSByZXByZXNlbnRhdGlvbiBvZiBhbiBvYmplY3QsIGlmIHdlXG4gICAgLy8gdGhyb3cgaGVyZSB3ZSdsbCBvYmZ1c2NhdGUgdGhhdCBkZXNjcmlwdGl2ZSBlcnJvciB3aXRoIHNvbWV0aGluZyB3b3JzZS5cbiAgICAvLyBTbyByZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gdGhhdCBpbmRpY2F0ZXMgdGhpcyB0aGluZyBpcyBhIHRva2VuXG4gICAgLy8gYW5kIG5lZWRzIHJlc29sdmluZy5cbiAgICByZXR1cm4gJzx1bnJlc29sdmVkLXRva2VuPic7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHRocm93YWJsZSBFcnJvciBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgdG9rZW4gY3JlYXRpb24gc3RhY2sgdHJhY2UuXG4gICAqIEBwYXJhbSBtZXNzYWdlIEVycm9yIG1lc3NhZ2VcbiAgICovXG4gIHByb3RlY3RlZCBuZXdFcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoYCR7bWVzc2FnZX1cXG5Ub2tlbiBjcmVhdGVkOlxcbiAgICBhdCAke3RoaXMuY3JlYXRpb25TdGFjay5qb2luKCdcXG4gICAgYXQgJyl9XFxuRXJyb3IgdGhyb3duOmApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeDogYW55KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cbiJdfQ==