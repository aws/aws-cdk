"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lazy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const debug_1 = require("./debug");
const stack_trace_1 = require("./stack-trace");
const token_1 = require("./token");
/**
 * Lazily produce a value
 *
 * Can be used to return a string, list or numeric value whose actual value
 * will only be calculated later, during synthesis.
 */
class Lazy {
    /**
     * Defer the calculation of a string value to synthesis time
     *
     * Use this if you want to render a string to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `string` type and don't need
     * the calculation to be deferred, use `Token.asString()` instead.
     *
     * @deprecated Use `Lazy.string()` or `Lazy.uncachedString()` instead.
     */
    static stringValue(producer, options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Lazy#stringValue", "Use `Lazy.string()` or `Lazy.uncachedString()` instead.");
            jsiiDeprecationWarnings._aws_cdk_core_IStringProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyStringValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.stringValue);
            }
            throw error;
        }
        return token_1.Token.asString(new LazyString(producer, false), options);
    }
    /**
     * Defer the one-time calculation of a string value to synthesis time
     *
     * Use this if you want to render a string to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `string` type and don't need
     * the calculation to be deferred, use `Token.asString()` instead.
     *
     * The inner function will only be invoked once, and the resolved value
     * cannot depend on the Stack the Token is used in.
     */
    static string(producer, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IStableStringProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyStringValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.string);
            }
            throw error;
        }
        return token_1.Token.asString(new LazyString(producer, true), options);
    }
    /**
     * Defer the calculation of a string value to synthesis time
     *
     * Use of this function is not recommended; unless you know you need it for sure, you
     * probably don't. Use `Lazy.string()` instead.
     *
     * The inner function may be invoked multiple times during synthesis. You
     * should only use this method if the returned value depends on variables
     * that may change during the Aspect application phase of synthesis, or if
     * the value depends on the Stack the value is being used in. Both of these
     * cases are rare, and only ever occur for AWS Construct Library authors.
     */
    static uncachedString(producer, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IStringProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyStringValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.uncachedString);
            }
            throw error;
        }
        return token_1.Token.asString(new LazyString(producer, false), options);
    }
    /**
     * Defer the one-time calculation of a number value to synthesis time
     *
     * Use this if you want to render a number to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `number` type and don't need
     * the calculation to be deferred, use `Token.asNumber()` instead.
     *
     * @deprecated Use `Lazy.number()` or `Lazy.uncachedNumber()` instead.
     */
    static numberValue(producer) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Lazy#numberValue", "Use `Lazy.number()` or `Lazy.uncachedNumber()` instead.");
            jsiiDeprecationWarnings._aws_cdk_core_INumberProducer(producer);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.numberValue);
            }
            throw error;
        }
        return token_1.Token.asNumber(new LazyNumber(producer, false));
    }
    /**
     * Defer the one-time calculation of a number value to synthesis time
     *
     * Use this if you want to render a number to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `number` type and don't need
     * the calculation to be deferred, use `Token.asNumber()` instead.
     *
     * The inner function will only be invoked once, and the resolved value
     * cannot depend on the Stack the Token is used in.
     */
    static number(producer) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IStableNumberProducer(producer);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.number);
            }
            throw error;
        }
        return token_1.Token.asNumber(new LazyNumber(producer, true));
    }
    /**
     * Defer the calculation of a number value to synthesis time
     *
     * Use of this function is not recommended; unless you know you need it for sure, you
     * probably don't. Use `Lazy.number()` instead.
     *
     * The inner function may be invoked multiple times during synthesis. You
     * should only use this method if the returned value depends on variables
     * that may change during the Aspect application phase of synthesis, or if
     * the value depends on the Stack the value is being used in. Both of these
     * cases are rare, and only ever occur for AWS Construct Library authors.
     */
    static uncachedNumber(producer) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_INumberProducer(producer);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.uncachedNumber);
            }
            throw error;
        }
        return token_1.Token.asNumber(new LazyNumber(producer, false));
    }
    /**
     * Defer the one-time calculation of a list value to synthesis time
     *
     * Use this if you want to render a list to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `string[]` type and don't need
     * the calculation to be deferred, use `Token.asList()` instead.
     *
     * @deprecated Use `Lazy.list()` or `Lazy.uncachedList()` instead.
     */
    static listValue(producer, options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Lazy#listValue", "Use `Lazy.list()` or `Lazy.uncachedList()` instead.");
            jsiiDeprecationWarnings._aws_cdk_core_IListProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyListValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.listValue);
            }
            throw error;
        }
        return token_1.Token.asList(new LazyList(producer, false, options), options);
    }
    /**
     * Defer the calculation of a list value to synthesis time
     *
     * Use of this function is not recommended; unless you know you need it for sure, you
     * probably don't. Use `Lazy.list()` instead.
     *
     * The inner function may be invoked multiple times during synthesis. You
     * should only use this method if the returned value depends on variables
     * that may change during the Aspect application phase of synthesis, or if
     * the value depends on the Stack the value is being used in. Both of these
     * cases are rare, and only ever occur for AWS Construct Library authors.
     */
    static uncachedList(producer, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IListProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyListValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.uncachedList);
            }
            throw error;
        }
        return token_1.Token.asList(new LazyList(producer, false, options), options);
    }
    /**
     * Defer the one-time calculation of a list value to synthesis time
     *
     * Use this if you want to render a list to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `string[]` type and don't need
     * the calculation to be deferred, use `Token.asList()` instead.
     *
     * The inner function will only be invoked once, and the resolved value
     * cannot depend on the Stack the Token is used in.
     */
    static list(producer, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IStableListProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyListValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.list);
            }
            throw error;
        }
        return token_1.Token.asList(new LazyList(producer, true, options), options);
    }
    /**
     * Defer the one-time calculation of an arbitrarily typed value to synthesis time
     *
     * Use this if you want to render an object to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * @deprecated Use `Lazy.any()` or `Lazy.uncachedAny()` instead.
     */
    static anyValue(producer, options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Lazy#anyValue", "Use `Lazy.any()` or `Lazy.uncachedAny()` instead.");
            jsiiDeprecationWarnings._aws_cdk_core_IAnyProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyAnyValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.anyValue);
            }
            throw error;
        }
        return new LazyAny(producer, false, options);
    }
    /**
     * Defer the one-time calculation of an arbitrarily typed value to synthesis time
     *
     * Use this if you want to render an object to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * The inner function will only be invoked one time and cannot depend on
     * resolution context.
     */
    static any(producer, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IStableAnyProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyAnyValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.any);
            }
            throw error;
        }
        return new LazyAny(producer, true, options);
    }
    /**
     * Defer the calculation of an untyped value to synthesis time
     *
     * Use of this function is not recommended; unless you know you need it for sure, you
     * probably don't. Use `Lazy.any()` instead.
     *
     * The inner function may be invoked multiple times during synthesis. You
     * should only use this method if the returned value depends on variables
     * that may change during the Aspect application phase of synthesis, or if
     * the value depends on the Stack the value is being used in. Both of these
     * cases are rare, and only ever occur for AWS Construct Library authors.
     */
    static uncachedAny(producer, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IAnyProducer(producer);
            jsiiDeprecationWarnings._aws_cdk_core_LazyAnyValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.uncachedAny);
            }
            throw error;
        }
        return new LazyAny(producer, false, options);
    }
    constructor() {
    }
}
_a = JSII_RTTI_SYMBOL_1;
Lazy[_a] = { fqn: "@aws-cdk/core.Lazy", version: "0.0.0" };
exports.Lazy = Lazy;
class LazyBase {
    constructor(producer, cache) {
        this.producer = producer;
        this.cache = cache;
        // Stack trace capture is conditionned to `debugModeEnabled()`, because
        // lazies can be created in a fairly thrashy way, and the stack traces are
        // large and slow to obtain; but are mostly useful only when debugging a
        // resolution issue.
        this.creationStack = (0, debug_1.debugModeEnabled)()
            ? (0, stack_trace_1.captureStackTrace)(this.constructor)
            : [`Execute again with ${debug_1.CDK_DEBUG}=true to capture stack traces`];
    }
    resolve(context) {
        if (this.cache) {
            return this._cached ?? (this._cached = this.producer.produce(context));
        }
        else {
            return this.producer.produce(context);
        }
    }
    toString() {
        return token_1.Token.asString(this);
    }
    /**
     * Turn this Token into JSON
     *
     * Called automatically when JSON.stringify() is called on a Token.
     */
    toJSON() {
        return '<unresolved-lazy>';
    }
}
class LazyString extends LazyBase {
}
class LazyNumber extends LazyBase {
}
class LazyList extends LazyBase {
    constructor(producer, cache, options = {}) {
        super(producer, cache);
        this.options = options;
    }
    resolve(context) {
        const resolved = super.resolve(context);
        if (resolved?.length === 0 && this.options.omitEmpty) {
            return undefined;
        }
        return resolved;
    }
}
class LazyAny extends LazyBase {
    constructor(producer, cache, options = {}) {
        super(producer, cache);
        this.options = options;
    }
    resolve(context) {
        const resolved = super.resolve(context);
        if (Array.isArray(resolved) && resolved.length === 0 && this.options.omitEmptyArray) {
            return undefined;
        }
        return resolved;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhenkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsbUNBQXNEO0FBRXRELCtDQUFrRDtBQUNsRCxtQ0FBZ0M7QUFvSWhDOzs7OztHQUtHO0FBQ0gsTUFBYSxJQUFJO0lBQ2Y7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBeUIsRUFBRSxVQUFrQyxFQUFFOzs7Ozs7Ozs7Ozs7UUFDdkYsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNqRTtJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUErQixFQUFFLFVBQWtDLEVBQUU7Ozs7Ozs7Ozs7O1FBQ3hGLE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDaEU7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNJLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBeUIsRUFBRSxVQUFrQyxFQUFFOzs7Ozs7Ozs7OztRQUMxRixPQUFPLGFBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2pFO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBeUI7Ozs7Ozs7Ozs7O1FBQ2pELE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUN4RDtJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUErQjs7Ozs7Ozs7OztRQUNsRCxPQUFPLGFBQUssQ0FBQyxRQUFR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cm9tICcuL2RlYnVnJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgY2FwdHVyZVN0YWNrVHJhY2UgfSBmcm9tICcuL3N0YWNrLXRyYWNlJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBsYXp5IHN0cmluZyBwcm9kdWNlcnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU3RyaW5nUHJvZHVjZXIge1xuICAvKipcbiAgICogUHJvZHVjZSB0aGUgc3RyaW5nIHZhbHVlXG4gICAqL1xuICBwcm9kdWNlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IHN0cmluZyB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIChzdGFibGUpIGxhenkgc3RyaW5nIHByb2R1Y2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElTdGFibGVTdHJpbmdQcm9kdWNlciB7XG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSBzdHJpbmcgdmFsdWVcbiAgICovXG4gIHByb2R1Y2UoKTogc3RyaW5nIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgbGF6eSBsaXN0IHByb2R1Y2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElMaXN0UHJvZHVjZXIge1xuICAvKipcbiAgICogUHJvZHVjZSB0aGUgbGlzdCB2YWx1ZVxuICAgKi9cbiAgcHJvZHVjZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIChzdGFibGUpIGxhenkgbGlzdCBwcm9kdWNlcnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU3RhYmxlTGlzdFByb2R1Y2VyIHtcbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIGxpc3QgdmFsdWVcbiAgICovXG4gIHByb2R1Y2UoKTogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBsYXp5IG51bWJlciBwcm9kdWNlcnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTnVtYmVyUHJvZHVjZXIge1xuICAvKipcbiAgICogUHJvZHVjZSB0aGUgbnVtYmVyIHZhbHVlXG4gICAqL1xuICBwcm9kdWNlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IG51bWJlciB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIChzdGFibGUpIGxhenkgbnVtYmVyIHByb2R1Y2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElTdGFibGVOdW1iZXJQcm9kdWNlciB7XG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSBudW1iZXIgdmFsdWVcbiAgICovXG4gIHByb2R1Y2UoKTogbnVtYmVyIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgbGF6eSB1bnR5cGVkIHZhbHVlIHByb2R1Y2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElBbnlQcm9kdWNlciB7XG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSB2YWx1ZVxuICAgKi9cbiAgcHJvZHVjZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnk7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciAoc3RhYmxlKSBsYXp5IHVudHlwZWQgdmFsdWUgcHJvZHVjZXJzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVN0YWJsZUFueVByb2R1Y2VyIHtcbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIHZhbHVlXG4gICAqL1xuICBwcm9kdWNlKCk6IGFueTtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBjcmVhdGluZyBhIGxhenkgc3RyaW5nIHRva2VuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF6eVN0cmluZ1ZhbHVlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBVc2UgdGhlIGdpdmVuIG5hbWUgYXMgYSBkaXNwbGF5IGhpbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBoaW50XG4gICAqL1xuICByZWFkb25seSBkaXNwbGF5SGludD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBjcmVhdGluZyBhIGxhenkgbGlzdCB0b2tlblxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhenlMaXN0VmFsdWVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFVzZSB0aGUgZ2l2ZW4gbmFtZSBhcyBhIGRpc3BsYXkgaGludFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGhpbnRcbiAgICovXG4gIHJlYWRvbmx5IGRpc3BsYXlIaW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgcHJvZHVjZWQgbGlzdCBpcyBlbXB0eSwgcmV0dXJuICd1bmRlZmluZWQnIGluc3RlYWRcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG9taXRFbXB0eT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY3JlYXRpbmcgbGF6eSB1bnR5cGVkIHRva2Vuc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIExhenlBbnlWYWx1ZU9wdGlvbnMge1xuICAvKipcbiAgICogVXNlIHRoZSBnaXZlbiBuYW1lIGFzIGEgZGlzcGxheSBoaW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaGludFxuICAgKi9cbiAgcmVhZG9ubHkgZGlzcGxheUhpbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBwcm9kdWNlZCB2YWx1ZSBpcyBhbiBhcnJheSBhbmQgaXQgaXMgZW1wdHksIHJldHVybiAndW5kZWZpbmVkJyBpbnN0ZWFkXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBvbWl0RW1wdHlBcnJheT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogTGF6aWx5IHByb2R1Y2UgYSB2YWx1ZVxuICpcbiAqIENhbiBiZSB1c2VkIHRvIHJldHVybiBhIHN0cmluZywgbGlzdCBvciBudW1lcmljIHZhbHVlIHdob3NlIGFjdHVhbCB2YWx1ZVxuICogd2lsbCBvbmx5IGJlIGNhbGN1bGF0ZWQgbGF0ZXIsIGR1cmluZyBzeW50aGVzaXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXp5IHtcbiAgLyoqXG4gICAqIERlZmVyIHRoZSBjYWxjdWxhdGlvbiBvZiBhIHN0cmluZyB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYSBzdHJpbmcgdG8gYSB0ZW1wbGF0ZSB3aG9zZSBhY3R1YWwgdmFsdWUgZGVwZW5kcyBvblxuICAgKiBzb21lIHN0YXRlIG11dGF0aW9uIHRoYXQgbWF5IGhhcHBlbiBhZnRlciB0aGUgY29uc3RydWN0IGhhcyBiZWVuIGNyZWF0ZWQuXG4gICAqXG4gICAqIElmIHlvdSBhcmUgc2ltcGx5IGxvb2tpbmcgdG8gZm9yY2UgYSB2YWx1ZSB0byBhIGBzdHJpbmdgIHR5cGUgYW5kIGRvbid0IG5lZWRcbiAgICogdGhlIGNhbGN1bGF0aW9uIHRvIGJlIGRlZmVycmVkLCB1c2UgYFRva2VuLmFzU3RyaW5nKClgIGluc3RlYWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTGF6eS5zdHJpbmcoKWAgb3IgYExhenkudW5jYWNoZWRTdHJpbmcoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nVmFsdWUocHJvZHVjZXI6IElTdHJpbmdQcm9kdWNlciwgb3B0aW9uczogTGF6eVN0cmluZ1ZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKG5ldyBMYXp5U3RyaW5nKHByb2R1Y2VyLCBmYWxzZSksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmVyIHRoZSBvbmUtdGltZSBjYWxjdWxhdGlvbiBvZiBhIHN0cmluZyB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYSBzdHJpbmcgdG8gYSB0ZW1wbGF0ZSB3aG9zZSBhY3R1YWwgdmFsdWUgZGVwZW5kcyBvblxuICAgKiBzb21lIHN0YXRlIG11dGF0aW9uIHRoYXQgbWF5IGhhcHBlbiBhZnRlciB0aGUgY29uc3RydWN0IGhhcyBiZWVuIGNyZWF0ZWQuXG4gICAqXG4gICAqIElmIHlvdSBhcmUgc2ltcGx5IGxvb2tpbmcgdG8gZm9yY2UgYSB2YWx1ZSB0byBhIGBzdHJpbmdgIHR5cGUgYW5kIGRvbid0IG5lZWRcbiAgICogdGhlIGNhbGN1bGF0aW9uIHRvIGJlIGRlZmVycmVkLCB1c2UgYFRva2VuLmFzU3RyaW5nKClgIGluc3RlYWQuXG4gICAqXG4gICAqIFRoZSBpbm5lciBmdW5jdGlvbiB3aWxsIG9ubHkgYmUgaW52b2tlZCBvbmNlLCBhbmQgdGhlIHJlc29sdmVkIHZhbHVlXG4gICAqIGNhbm5vdCBkZXBlbmQgb24gdGhlIFN0YWNrIHRoZSBUb2tlbiBpcyB1c2VkIGluLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmcocHJvZHVjZXI6IElTdGFibGVTdHJpbmdQcm9kdWNlciwgb3B0aW9uczogTGF6eVN0cmluZ1ZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKG5ldyBMYXp5U3RyaW5nKHByb2R1Y2VyLCB0cnVlKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIGNhbGN1bGF0aW9uIG9mIGEgc3RyaW5nIHZhbHVlIHRvIHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIFVzZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIG5vdCByZWNvbW1lbmRlZDsgdW5sZXNzIHlvdSBrbm93IHlvdSBuZWVkIGl0IGZvciBzdXJlLCB5b3VcbiAgICogcHJvYmFibHkgZG9uJ3QuIFVzZSBgTGF6eS5zdHJpbmcoKWAgaW5zdGVhZC5cbiAgICpcbiAgICogVGhlIGlubmVyIGZ1bmN0aW9uIG1heSBiZSBpbnZva2VkIG11bHRpcGxlIHRpbWVzIGR1cmluZyBzeW50aGVzaXMuIFlvdVxuICAgKiBzaG91bGQgb25seSB1c2UgdGhpcyBtZXRob2QgaWYgdGhlIHJldHVybmVkIHZhbHVlIGRlcGVuZHMgb24gdmFyaWFibGVzXG4gICAqIHRoYXQgbWF5IGNoYW5nZSBkdXJpbmcgdGhlIEFzcGVjdCBhcHBsaWNhdGlvbiBwaGFzZSBvZiBzeW50aGVzaXMsIG9yIGlmXG4gICAqIHRoZSB2YWx1ZSBkZXBlbmRzIG9uIHRoZSBTdGFjayB0aGUgdmFsdWUgaXMgYmVpbmcgdXNlZCBpbi4gQm90aCBvZiB0aGVzZVxuICAgKiBjYXNlcyBhcmUgcmFyZSwgYW5kIG9ubHkgZXZlciBvY2N1ciBmb3IgQVdTIENvbnN0cnVjdCBMaWJyYXJ5IGF1dGhvcnMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHVuY2FjaGVkU3RyaW5nKHByb2R1Y2VyOiBJU3RyaW5nUHJvZHVjZXIsIG9wdGlvbnM6IExhenlTdHJpbmdWYWx1ZU9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyhuZXcgTGF6eVN0cmluZyhwcm9kdWNlciwgZmFsc2UpLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZlciB0aGUgb25lLXRpbWUgY2FsY3VsYXRpb24gb2YgYSBudW1iZXIgdmFsdWUgdG8gc3ludGhlc2lzIHRpbWVcbiAgICpcbiAgICogVXNlIHRoaXMgaWYgeW91IHdhbnQgdG8gcmVuZGVyIGEgbnVtYmVyIHRvIGEgdGVtcGxhdGUgd2hvc2UgYWN0dWFsIHZhbHVlIGRlcGVuZHMgb25cbiAgICogc29tZSBzdGF0ZSBtdXRhdGlvbiB0aGF0IG1heSBoYXBwZW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdCBoYXMgYmVlbiBjcmVhdGVkLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHNpbXBseSBsb29raW5nIHRvIGZvcmNlIGEgdmFsdWUgdG8gYSBgbnVtYmVyYCB0eXBlIGFuZCBkb24ndCBuZWVkXG4gICAqIHRoZSBjYWxjdWxhdGlvbiB0byBiZSBkZWZlcnJlZCwgdXNlIGBUb2tlbi5hc051bWJlcigpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhenkubnVtYmVyKClgIG9yIGBMYXp5LnVuY2FjaGVkTnVtYmVyKClgIGluc3RlYWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG51bWJlclZhbHVlKHByb2R1Y2VyOiBJTnVtYmVyUHJvZHVjZXIpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNOdW1iZXIobmV3IExhenlOdW1iZXIocHJvZHVjZXIsIGZhbHNlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIG9uZS10aW1lIGNhbGN1bGF0aW9uIG9mIGEgbnVtYmVyIHZhbHVlIHRvIHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIFVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHJlbmRlciBhIG51bWJlciB0byBhIHRlbXBsYXRlIHdob3NlIGFjdHVhbCB2YWx1ZSBkZXBlbmRzIG9uXG4gICAqIHNvbWUgc3RhdGUgbXV0YXRpb24gdGhhdCBtYXkgaGFwcGVuIGFmdGVyIHRoZSBjb25zdHJ1Y3QgaGFzIGJlZW4gY3JlYXRlZC5cbiAgICpcbiAgICogSWYgeW91IGFyZSBzaW1wbHkgbG9va2luZyB0byBmb3JjZSBhIHZhbHVlIHRvIGEgYG51bWJlcmAgdHlwZSBhbmQgZG9uJ3QgbmVlZFxuICAgKiB0aGUgY2FsY3VsYXRpb24gdG8gYmUgZGVmZXJyZWQsIHVzZSBgVG9rZW4uYXNOdW1iZXIoKWAgaW5zdGVhZC5cbiAgICpcbiAgICogVGhlIGlubmVyIGZ1bmN0aW9uIHdpbGwgb25seSBiZSBpbnZva2VkIG9uY2UsIGFuZCB0aGUgcmVzb2x2ZWQgdmFsdWVcbiAgICogY2Fubm90IGRlcGVuZCBvbiB0aGUgU3RhY2sgdGhlIFRva2VuIGlzIHVzZWQgaW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG51bWJlcihwcm9kdWNlcjogSVN0YWJsZU51bWJlclByb2R1Y2VyKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTnVtYmVyKG5ldyBMYXp5TnVtYmVyKHByb2R1Y2VyLCB0cnVlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIGNhbGN1bGF0aW9uIG9mIGEgbnVtYmVyIHZhbHVlIHRvIHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIFVzZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIG5vdCByZWNvbW1lbmRlZDsgdW5sZXNzIHlvdSBrbm93IHlvdSBuZWVkIGl0IGZvciBzdXJlLCB5b3VcbiAgICogcHJvYmFibHkgZG9uJ3QuIFVzZSBgTGF6eS5udW1iZXIoKWAgaW5zdGVhZC5cbiAgICpcbiAgICogVGhlIGlubmVyIGZ1bmN0aW9uIG1heSBiZSBpbnZva2VkIG11bHRpcGxlIHRpbWVzIGR1cmluZyBzeW50aGVzaXMuIFlvdVxuICAgKiBzaG91bGQgb25seSB1c2UgdGhpcyBtZXRob2QgaWYgdGhlIHJldHVybmVkIHZhbHVlIGRlcGVuZHMgb24gdmFyaWFibGVzXG4gICAqIHRoYXQgbWF5IGNoYW5nZSBkdXJpbmcgdGhlIEFzcGVjdCBhcHBsaWNhdGlvbiBwaGFzZSBvZiBzeW50aGVzaXMsIG9yIGlmXG4gICAqIHRoZSB2YWx1ZSBkZXBlbmRzIG9uIHRoZSBTdGFjayB0aGUgdmFsdWUgaXMgYmVpbmcgdXNlZCBpbi4gQm90aCBvZiB0aGVzZVxuICAgKiBjYXNlcyBhcmUgcmFyZSwgYW5kIG9ubHkgZXZlciBvY2N1ciBmb3IgQVdTIENvbnN0cnVjdCBMaWJyYXJ5IGF1dGhvcnMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHVuY2FjaGVkTnVtYmVyKHByb2R1Y2VyOiBJTnVtYmVyUHJvZHVjZXIpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNOdW1iZXIobmV3IExhenlOdW1iZXIocHJvZHVjZXIsIGZhbHNlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIG9uZS10aW1lIGNhbGN1bGF0aW9uIG9mIGEgbGlzdCB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYSBsaXN0IHRvIGEgdGVtcGxhdGUgd2hvc2UgYWN0dWFsIHZhbHVlIGRlcGVuZHMgb25cbiAgICogc29tZSBzdGF0ZSBtdXRhdGlvbiB0aGF0IG1heSBoYXBwZW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdCBoYXMgYmVlbiBjcmVhdGVkLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHNpbXBseSBsb29raW5nIHRvIGZvcmNlIGEgdmFsdWUgdG8gYSBgc3RyaW5nW11gIHR5cGUgYW5kIGRvbid0IG5lZWRcbiAgICogdGhlIGNhbGN1bGF0aW9uIHRvIGJlIGRlZmVycmVkLCB1c2UgYFRva2VuLmFzTGlzdCgpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhenkubGlzdCgpYCBvciBgTGF6eS51bmNhY2hlZExpc3QoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbGlzdFZhbHVlKHByb2R1Y2VyOiBJTGlzdFByb2R1Y2VyLCBvcHRpb25zOiBMYXp5TGlzdFZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgTGF6eUxpc3QocHJvZHVjZXIsIGZhbHNlLCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIGNhbGN1bGF0aW9uIG9mIGEgbGlzdCB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyBub3QgcmVjb21tZW5kZWQ7IHVubGVzcyB5b3Uga25vdyB5b3UgbmVlZCBpdCBmb3Igc3VyZSwgeW91XG4gICAqIHByb2JhYmx5IGRvbid0LiBVc2UgYExhenkubGlzdCgpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBUaGUgaW5uZXIgZnVuY3Rpb24gbWF5IGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXMgZHVyaW5nIHN5bnRoZXNpcy4gWW91XG4gICAqIHNob3VsZCBvbmx5IHVzZSB0aGlzIG1ldGhvZCBpZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB2YXJpYWJsZXNcbiAgICogdGhhdCBtYXkgY2hhbmdlIGR1cmluZyB0aGUgQXNwZWN0IGFwcGxpY2F0aW9uIHBoYXNlIG9mIHN5bnRoZXNpcywgb3IgaWZcbiAgICogdGhlIHZhbHVlIGRlcGVuZHMgb24gdGhlIFN0YWNrIHRoZSB2YWx1ZSBpcyBiZWluZyB1c2VkIGluLiBCb3RoIG9mIHRoZXNlXG4gICAqIGNhc2VzIGFyZSByYXJlLCBhbmQgb25seSBldmVyIG9jY3VyIGZvciBBV1MgQ29uc3RydWN0IExpYnJhcnkgYXV0aG9ycy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdW5jYWNoZWRMaXN0KHByb2R1Y2VyOiBJTGlzdFByb2R1Y2VyLCBvcHRpb25zOiBMYXp5TGlzdFZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgTGF6eUxpc3QocHJvZHVjZXIsIGZhbHNlLCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIG9uZS10aW1lIGNhbGN1bGF0aW9uIG9mIGEgbGlzdCB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYSBsaXN0IHRvIGEgdGVtcGxhdGUgd2hvc2UgYWN0dWFsIHZhbHVlIGRlcGVuZHMgb25cbiAgICogc29tZSBzdGF0ZSBtdXRhdGlvbiB0aGF0IG1heSBoYXBwZW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdCBoYXMgYmVlbiBjcmVhdGVkLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHNpbXBseSBsb29raW5nIHRvIGZvcmNlIGEgdmFsdWUgdG8gYSBgc3RyaW5nW11gIHR5cGUgYW5kIGRvbid0IG5lZWRcbiAgICogdGhlIGNhbGN1bGF0aW9uIHRvIGJlIGRlZmVycmVkLCB1c2UgYFRva2VuLmFzTGlzdCgpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBUaGUgaW5uZXIgZnVuY3Rpb24gd2lsbCBvbmx5IGJlIGludm9rZWQgb25jZSwgYW5kIHRoZSByZXNvbHZlZCB2YWx1ZVxuICAgKiBjYW5ub3QgZGVwZW5kIG9uIHRoZSBTdGFjayB0aGUgVG9rZW4gaXMgdXNlZCBpbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbGlzdChwcm9kdWNlcjogSVN0YWJsZUxpc3RQcm9kdWNlciwgb3B0aW9uczogTGF6eUxpc3RWYWx1ZU9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QobmV3IExhenlMaXN0KHByb2R1Y2VyLCB0cnVlLCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIG9uZS10aW1lIGNhbGN1bGF0aW9uIG9mIGFuIGFyYml0cmFyaWx5IHR5cGVkIHZhbHVlIHRvIHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIFVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHJlbmRlciBhbiBvYmplY3QgdG8gYSB0ZW1wbGF0ZSB3aG9zZSBhY3R1YWwgdmFsdWUgZGVwZW5kcyBvblxuICAgKiBzb21lIHN0YXRlIG11dGF0aW9uIHRoYXQgbWF5IGhhcHBlbiBhZnRlciB0aGUgY29uc3RydWN0IGhhcyBiZWVuIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTGF6eS5hbnkoKWAgb3IgYExhenkudW5jYWNoZWRBbnkoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW55VmFsdWUocHJvZHVjZXI6IElBbnlQcm9kdWNlciwgb3B0aW9uczogTGF6eUFueVZhbHVlT3B0aW9ucyA9IHt9KTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgTGF6eUFueShwcm9kdWNlciwgZmFsc2UsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmVyIHRoZSBvbmUtdGltZSBjYWxjdWxhdGlvbiBvZiBhbiBhcmJpdHJhcmlseSB0eXBlZCB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYW4gb2JqZWN0IHRvIGEgdGVtcGxhdGUgd2hvc2UgYWN0dWFsIHZhbHVlIGRlcGVuZHMgb25cbiAgICogc29tZSBzdGF0ZSBtdXRhdGlvbiB0aGF0IG1heSBoYXBwZW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdCBoYXMgYmVlbiBjcmVhdGVkLlxuICAgKlxuICAgKiBUaGUgaW5uZXIgZnVuY3Rpb24gd2lsbCBvbmx5IGJlIGludm9rZWQgb25lIHRpbWUgYW5kIGNhbm5vdCBkZXBlbmQgb25cbiAgICogcmVzb2x1dGlvbiBjb250ZXh0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnkocHJvZHVjZXI6IElTdGFibGVBbnlQcm9kdWNlciwgb3B0aW9uczogTGF6eUFueVZhbHVlT3B0aW9ucyA9IHt9KTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgTGF6eUFueShwcm9kdWNlciwgdHJ1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIGNhbGN1bGF0aW9uIG9mIGFuIHVudHlwZWQgdmFsdWUgdG8gc3ludGhlc2lzIHRpbWVcbiAgICpcbiAgICogVXNlIG9mIHRoaXMgZnVuY3Rpb24gaXMgbm90IHJlY29tbWVuZGVkOyB1bmxlc3MgeW91IGtub3cgeW91IG5lZWQgaXQgZm9yIHN1cmUsIHlvdVxuICAgKiBwcm9iYWJseSBkb24ndC4gVXNlIGBMYXp5LmFueSgpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBUaGUgaW5uZXIgZnVuY3Rpb24gbWF5IGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXMgZHVyaW5nIHN5bnRoZXNpcy4gWW91XG4gICAqIHNob3VsZCBvbmx5IHVzZSB0aGlzIG1ldGhvZCBpZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB2YXJpYWJsZXNcbiAgICogdGhhdCBtYXkgY2hhbmdlIGR1cmluZyB0aGUgQXNwZWN0IGFwcGxpY2F0aW9uIHBoYXNlIG9mIHN5bnRoZXNpcywgb3IgaWZcbiAgICogdGhlIHZhbHVlIGRlcGVuZHMgb24gdGhlIFN0YWNrIHRoZSB2YWx1ZSBpcyBiZWluZyB1c2VkIGluLiBCb3RoIG9mIHRoZXNlXG4gICAqIGNhc2VzIGFyZSByYXJlLCBhbmQgb25seSBldmVyIG9jY3VyIGZvciBBV1MgQ29uc3RydWN0IExpYnJhcnkgYXV0aG9ycy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdW5jYWNoZWRBbnkocHJvZHVjZXI6IElBbnlQcm9kdWNlciwgb3B0aW9uczogTGF6eUFueVZhbHVlT3B0aW9ucyA9IHt9KTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgTGF6eUFueShwcm9kdWNlciwgZmFsc2UsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgfVxufVxuXG5cbmludGVyZmFjZSBJTGF6eVByb2R1Y2VyPEE+IHtcbiAgcHJvZHVjZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBBIHwgdW5kZWZpbmVkO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBMYXp5QmFzZTxBPiBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuICBwcml2YXRlIF9jYWNoZWQ/OiBBO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvZHVjZXI6IElMYXp5UHJvZHVjZXI8QT4sIHByaXZhdGUgcmVhZG9ubHkgY2FjaGU6IGJvb2xlYW4pIHtcbiAgICAvLyBTdGFjayB0cmFjZSBjYXB0dXJlIGlzIGNvbmRpdGlvbm5lZCB0byBgZGVidWdNb2RlRW5hYmxlZCgpYCwgYmVjYXVzZVxuICAgIC8vIGxhemllcyBjYW4gYmUgY3JlYXRlZCBpbiBhIGZhaXJseSB0aHJhc2h5IHdheSwgYW5kIHRoZSBzdGFjayB0cmFjZXMgYXJlXG4gICAgLy8gbGFyZ2UgYW5kIHNsb3cgdG8gb2J0YWluOyBidXQgYXJlIG1vc3RseSB1c2VmdWwgb25seSB3aGVuIGRlYnVnZ2luZyBhXG4gICAgLy8gcmVzb2x1dGlvbiBpc3N1ZS5cbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBkZWJ1Z01vZGVFbmFibGVkKClcbiAgICAgID8gY2FwdHVyZVN0YWNrVHJhY2UodGhpcy5jb25zdHJ1Y3RvcilcbiAgICAgIDogW2BFeGVjdXRlIGFnYWluIHdpdGggJHtDREtfREVCVUd9PXRydWUgdG8gY2FwdHVyZSBzdGFjayB0cmFjZXNgXTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkge1xuICAgIGlmICh0aGlzLmNhY2hlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVkID8/ICh0aGlzLl9jYWNoZWQgPSB0aGlzLnByb2R1Y2VyLnByb2R1Y2UoY29udGV4dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9kdWNlci5wcm9kdWNlKGNvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVHVybiB0aGlzIFRva2VuIGludG8gSlNPTlxuICAgKlxuICAgKiBDYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIEpTT04uc3RyaW5naWZ5KCkgaXMgY2FsbGVkIG9uIGEgVG9rZW4uXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCk6IGFueSB7XG4gICAgcmV0dXJuICc8dW5yZXNvbHZlZC1sYXp5Pic7XG4gIH1cblxufVxuXG5jbGFzcyBMYXp5U3RyaW5nIGV4dGVuZHMgTGF6eUJhc2U8c3RyaW5nPiB7XG59XG5cbmNsYXNzIExhenlOdW1iZXIgZXh0ZW5kcyBMYXp5QmFzZTxudW1iZXI+IHtcbn1cblxuY2xhc3MgTGF6eUxpc3QgZXh0ZW5kcyBMYXp5QmFzZTxBcnJheTxzdHJpbmc+PiB7XG4gIGNvbnN0cnVjdG9yKHByb2R1Y2VyOiBJTGlzdFByb2R1Y2VyLCBjYWNoZTogYm9vbGVhbiwgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBMYXp5TGlzdFZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocHJvZHVjZXIsIGNhY2hlKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkge1xuICAgIGNvbnN0IHJlc29sdmVkID0gc3VwZXIucmVzb2x2ZShjb250ZXh0KTtcbiAgICBpZiAocmVzb2x2ZWQ/Lmxlbmd0aCA9PT0gMCAmJiB0aGlzLm9wdGlvbnMub21pdEVtcHR5KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gIH1cbn1cblxuY2xhc3MgTGF6eUFueSBleHRlbmRzIExhenlCYXNlPGFueT4ge1xuICBjb25zdHJ1Y3Rvcihwcm9kdWNlcjogSUFueVByb2R1Y2VyLCBjYWNoZTogYm9vbGVhbiwgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBMYXp5QW55VmFsdWVPcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwcm9kdWNlciwgY2FjaGUpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdXBlci5yZXNvbHZlKGNvbnRleHQpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlc29sdmVkKSAmJiByZXNvbHZlZC5sZW5ndGggPT09IDAgJiYgdGhpcy5vcHRpb25zLm9taXRFbXB0eUFycmF5KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gIH1cbn1cbiJdfQ==