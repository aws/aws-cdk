"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lazy = void 0;
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
        return new LazyAny(producer, false, options);
    }
    constructor() {
    }
}
exports.Lazy = Lazy;
class LazyBase {
    constructor(producer, cache) {
        this.producer = producer;
        this.cache = cache;
        // Stack trace capture is conditioned to `debugModeEnabled()`, because
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhenkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXNEO0FBRXRELCtDQUFrRDtBQUNsRCxtQ0FBZ0M7QUFvSWhDOzs7OztHQUtHO0FBQ0gsTUFBYSxJQUFJO0lBQ2Y7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBeUIsRUFBRSxVQUFrQyxFQUFFO1FBQ3ZGLE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUErQixFQUFFLFVBQWtDLEVBQUU7UUFDeEYsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQXlCLEVBQUUsVUFBa0MsRUFBRTtRQUMxRixPQUFPLGFBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUF5QjtRQUNqRCxPQUFPLGFBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUErQjtRQUNsRCxPQUFPLGFBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUF5QjtRQUNwRCxPQUFPLGFBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQXVCLEVBQUUsVUFBZ0MsRUFBRTtRQUNqRixPQUFPLGFBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQXVCLEVBQUUsVUFBZ0MsRUFBRTtRQUNwRixPQUFPLGFBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQTZCLEVBQUUsVUFBZ0MsRUFBRTtRQUNsRixPQUFPLGFBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBc0IsRUFBRSxVQUErQixFQUFFO1FBQzlFLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQTRCLEVBQUUsVUFBK0IsRUFBRTtRQUMvRSxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFzQixFQUFFLFVBQStCLEVBQUU7UUFDakYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDtJQUNBLENBQUM7Q0FDRjtBQXpMRCxvQkF5TEM7QUFPRCxNQUFlLFFBQVE7SUFJckIsWUFBNkIsUUFBMEIsRUFBbUIsS0FBYztRQUEzRCxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUFTO1FBQ3RGLHNFQUFzRTtRQUN0RSwwRUFBMEU7UUFDMUUsd0VBQXdFO1FBQ3hFLG9CQUFvQjtRQUNwQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUU7WUFDckMsQ0FBQyxDQUFDLElBQUEsK0JBQWlCLEVBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsaUJBQVMsK0JBQStCLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU0sT0FBTyxDQUFDLE9BQXdCO1FBQ3JDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUN4RTthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTTtRQUNYLE9BQU8sbUJBQW1CLENBQUM7SUFDN0IsQ0FBQztDQUVGO0FBRUQsTUFBTSxVQUFXLFNBQVEsUUFBZ0I7Q0FDeEM7QUFFRCxNQUFNLFVBQVcsU0FBUSxRQUFnQjtDQUN4QztBQUVELE1BQU0sUUFBUyxTQUFRLFFBQXVCO0lBQzVDLFlBQVksUUFBdUIsRUFBRSxLQUFjLEVBQW1CLFVBQWdDLEVBQUU7UUFDdEcsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUQ2QyxZQUFPLEdBQVAsT0FBTyxDQUEyQjtJQUV4RyxDQUFDO0lBRU0sT0FBTyxDQUFDLE9BQXdCO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEMsSUFBSSxRQUFRLEVBQUUsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNwRCxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBUSxTQUFRLFFBQWE7SUFDakMsWUFBWSxRQUFzQixFQUFFLEtBQWMsRUFBbUIsVUFBK0IsRUFBRTtRQUNwRyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRDRDLFlBQU8sR0FBUCxPQUFPLENBQTBCO0lBRXRHLENBQUM7SUFFTSxPQUFPLENBQUMsT0FBd0I7UUFDckMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUU7WUFDbkYsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDREtfREVCVUcsIGRlYnVnTW9kZUVuYWJsZWQgfSBmcm9tICcuL2RlYnVnJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgY2FwdHVyZVN0YWNrVHJhY2UgfSBmcm9tICcuL3N0YWNrLXRyYWNlJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBsYXp5IHN0cmluZyBwcm9kdWNlcnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU3RyaW5nUHJvZHVjZXIge1xuICAvKipcbiAgICogUHJvZHVjZSB0aGUgc3RyaW5nIHZhbHVlXG4gICAqL1xuICBwcm9kdWNlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IHN0cmluZyB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIChzdGFibGUpIGxhenkgc3RyaW5nIHByb2R1Y2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElTdGFibGVTdHJpbmdQcm9kdWNlciB7XG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSBzdHJpbmcgdmFsdWVcbiAgICovXG4gIHByb2R1Y2UoKTogc3RyaW5nIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgbGF6eSBsaXN0IHByb2R1Y2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElMaXN0UHJvZHVjZXIge1xuICAvKipcbiAgICogUHJvZHVjZSB0aGUgbGlzdCB2YWx1ZVxuICAgKi9cbiAgcHJvZHVjZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIChzdGFibGUpIGxhenkgbGlzdCBwcm9kdWNlcnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU3RhYmxlTGlzdFByb2R1Y2VyIHtcbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIGxpc3QgdmFsdWVcbiAgICovXG4gIHByb2R1Y2UoKTogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBsYXp5IG51bWJlciBwcm9kdWNlcnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTnVtYmVyUHJvZHVjZXIge1xuICAvKipcbiAgICogUHJvZHVjZSB0aGUgbnVtYmVyIHZhbHVlXG4gICAqL1xuICBwcm9kdWNlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IG51bWJlciB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIChzdGFibGUpIGxhenkgbnVtYmVyIHByb2R1Y2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElTdGFibGVOdW1iZXJQcm9kdWNlciB7XG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSBudW1iZXIgdmFsdWVcbiAgICovXG4gIHByb2R1Y2UoKTogbnVtYmVyIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgbGF6eSB1bnR5cGVkIHZhbHVlIHByb2R1Y2Vyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElBbnlQcm9kdWNlciB7XG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSB2YWx1ZVxuICAgKi9cbiAgcHJvZHVjZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnk7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciAoc3RhYmxlKSBsYXp5IHVudHlwZWQgdmFsdWUgcHJvZHVjZXJzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVN0YWJsZUFueVByb2R1Y2VyIHtcbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIHZhbHVlXG4gICAqL1xuICBwcm9kdWNlKCk6IGFueTtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBjcmVhdGluZyBhIGxhenkgc3RyaW5nIHRva2VuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF6eVN0cmluZ1ZhbHVlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBVc2UgdGhlIGdpdmVuIG5hbWUgYXMgYSBkaXNwbGF5IGhpbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBoaW50XG4gICAqL1xuICByZWFkb25seSBkaXNwbGF5SGludD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBjcmVhdGluZyBhIGxhenkgbGlzdCB0b2tlblxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhenlMaXN0VmFsdWVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFVzZSB0aGUgZ2l2ZW4gbmFtZSBhcyBhIGRpc3BsYXkgaGludFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGhpbnRcbiAgICovXG4gIHJlYWRvbmx5IGRpc3BsYXlIaW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgcHJvZHVjZWQgbGlzdCBpcyBlbXB0eSwgcmV0dXJuICd1bmRlZmluZWQnIGluc3RlYWRcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG9taXRFbXB0eT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY3JlYXRpbmcgbGF6eSB1bnR5cGVkIHRva2Vuc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIExhenlBbnlWYWx1ZU9wdGlvbnMge1xuICAvKipcbiAgICogVXNlIHRoZSBnaXZlbiBuYW1lIGFzIGEgZGlzcGxheSBoaW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaGludFxuICAgKi9cbiAgcmVhZG9ubHkgZGlzcGxheUhpbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBwcm9kdWNlZCB2YWx1ZSBpcyBhbiBhcnJheSBhbmQgaXQgaXMgZW1wdHksIHJldHVybiAndW5kZWZpbmVkJyBpbnN0ZWFkXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBvbWl0RW1wdHlBcnJheT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogTGF6aWx5IHByb2R1Y2UgYSB2YWx1ZVxuICpcbiAqIENhbiBiZSB1c2VkIHRvIHJldHVybiBhIHN0cmluZywgbGlzdCBvciBudW1lcmljIHZhbHVlIHdob3NlIGFjdHVhbCB2YWx1ZVxuICogd2lsbCBvbmx5IGJlIGNhbGN1bGF0ZWQgbGF0ZXIsIGR1cmluZyBzeW50aGVzaXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXp5IHtcbiAgLyoqXG4gICAqIERlZmVyIHRoZSBjYWxjdWxhdGlvbiBvZiBhIHN0cmluZyB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYSBzdHJpbmcgdG8gYSB0ZW1wbGF0ZSB3aG9zZSBhY3R1YWwgdmFsdWUgZGVwZW5kcyBvblxuICAgKiBzb21lIHN0YXRlIG11dGF0aW9uIHRoYXQgbWF5IGhhcHBlbiBhZnRlciB0aGUgY29uc3RydWN0IGhhcyBiZWVuIGNyZWF0ZWQuXG4gICAqXG4gICAqIElmIHlvdSBhcmUgc2ltcGx5IGxvb2tpbmcgdG8gZm9yY2UgYSB2YWx1ZSB0byBhIGBzdHJpbmdgIHR5cGUgYW5kIGRvbid0IG5lZWRcbiAgICogdGhlIGNhbGN1bGF0aW9uIHRvIGJlIGRlZmVycmVkLCB1c2UgYFRva2VuLmFzU3RyaW5nKClgIGluc3RlYWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTGF6eS5zdHJpbmcoKWAgb3IgYExhenkudW5jYWNoZWRTdHJpbmcoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nVmFsdWUocHJvZHVjZXI6IElTdHJpbmdQcm9kdWNlciwgb3B0aW9uczogTGF6eVN0cmluZ1ZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKG5ldyBMYXp5U3RyaW5nKHByb2R1Y2VyLCBmYWxzZSksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmVyIHRoZSBvbmUtdGltZSBjYWxjdWxhdGlvbiBvZiBhIHN0cmluZyB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYSBzdHJpbmcgdG8gYSB0ZW1wbGF0ZSB3aG9zZSBhY3R1YWwgdmFsdWUgZGVwZW5kcyBvblxuICAgKiBzb21lIHN0YXRlIG11dGF0aW9uIHRoYXQgbWF5IGhhcHBlbiBhZnRlciB0aGUgY29uc3RydWN0IGhhcyBiZWVuIGNyZWF0ZWQuXG4gICAqXG4gICAqIElmIHlvdSBhcmUgc2ltcGx5IGxvb2tpbmcgdG8gZm9yY2UgYSB2YWx1ZSB0byBhIGBzdHJpbmdgIHR5cGUgYW5kIGRvbid0IG5lZWRcbiAgICogdGhlIGNhbGN1bGF0aW9uIHRvIGJlIGRlZmVycmVkLCB1c2UgYFRva2VuLmFzU3RyaW5nKClgIGluc3RlYWQuXG4gICAqXG4gICAqIFRoZSBpbm5lciBmdW5jdGlvbiB3aWxsIG9ubHkgYmUgaW52b2tlZCBvbmNlLCBhbmQgdGhlIHJlc29sdmVkIHZhbHVlXG4gICAqIGNhbm5vdCBkZXBlbmQgb24gdGhlIFN0YWNrIHRoZSBUb2tlbiBpcyB1c2VkIGluLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmcocHJvZHVjZXI6IElTdGFibGVTdHJpbmdQcm9kdWNlciwgb3B0aW9uczogTGF6eVN0cmluZ1ZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKG5ldyBMYXp5U3RyaW5nKHByb2R1Y2VyLCB0cnVlKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIGNhbGN1bGF0aW9uIG9mIGEgc3RyaW5nIHZhbHVlIHRvIHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIFVzZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIG5vdCByZWNvbW1lbmRlZDsgdW5sZXNzIHlvdSBrbm93IHlvdSBuZWVkIGl0IGZvciBzdXJlLCB5b3VcbiAgICogcHJvYmFibHkgZG9uJ3QuIFVzZSBgTGF6eS5zdHJpbmcoKWAgaW5zdGVhZC5cbiAgICpcbiAgICogVGhlIGlubmVyIGZ1bmN0aW9uIG1heSBiZSBpbnZva2VkIG11bHRpcGxlIHRpbWVzIGR1cmluZyBzeW50aGVzaXMuIFlvdVxuICAgKiBzaG91bGQgb25seSB1c2UgdGhpcyBtZXRob2QgaWYgdGhlIHJldHVybmVkIHZhbHVlIGRlcGVuZHMgb24gdmFyaWFibGVzXG4gICAqIHRoYXQgbWF5IGNoYW5nZSBkdXJpbmcgdGhlIEFzcGVjdCBhcHBsaWNhdGlvbiBwaGFzZSBvZiBzeW50aGVzaXMsIG9yIGlmXG4gICAqIHRoZSB2YWx1ZSBkZXBlbmRzIG9uIHRoZSBTdGFjayB0aGUgdmFsdWUgaXMgYmVpbmcgdXNlZCBpbi4gQm90aCBvZiB0aGVzZVxuICAgKiBjYXNlcyBhcmUgcmFyZSwgYW5kIG9ubHkgZXZlciBvY2N1ciBmb3IgQVdTIENvbnN0cnVjdCBMaWJyYXJ5IGF1dGhvcnMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHVuY2FjaGVkU3RyaW5nKHByb2R1Y2VyOiBJU3RyaW5nUHJvZHVjZXIsIG9wdGlvbnM6IExhenlTdHJpbmdWYWx1ZU9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyhuZXcgTGF6eVN0cmluZyhwcm9kdWNlciwgZmFsc2UpLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZlciB0aGUgb25lLXRpbWUgY2FsY3VsYXRpb24gb2YgYSBudW1iZXIgdmFsdWUgdG8gc3ludGhlc2lzIHRpbWVcbiAgICpcbiAgICogVXNlIHRoaXMgaWYgeW91IHdhbnQgdG8gcmVuZGVyIGEgbnVtYmVyIHRvIGEgdGVtcGxhdGUgd2hvc2UgYWN0dWFsIHZhbHVlIGRlcGVuZHMgb25cbiAgICogc29tZSBzdGF0ZSBtdXRhdGlvbiB0aGF0IG1heSBoYXBwZW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdCBoYXMgYmVlbiBjcmVhdGVkLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHNpbXBseSBsb29raW5nIHRvIGZvcmNlIGEgdmFsdWUgdG8gYSBgbnVtYmVyYCB0eXBlIGFuZCBkb24ndCBuZWVkXG4gICAqIHRoZSBjYWxjdWxhdGlvbiB0byBiZSBkZWZlcnJlZCwgdXNlIGBUb2tlbi5hc051bWJlcigpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhenkubnVtYmVyKClgIG9yIGBMYXp5LnVuY2FjaGVkTnVtYmVyKClgIGluc3RlYWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG51bWJlclZhbHVlKHByb2R1Y2VyOiBJTnVtYmVyUHJvZHVjZXIpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNOdW1iZXIobmV3IExhenlOdW1iZXIocHJvZHVjZXIsIGZhbHNlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIG9uZS10aW1lIGNhbGN1bGF0aW9uIG9mIGEgbnVtYmVyIHZhbHVlIHRvIHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIFVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHJlbmRlciBhIG51bWJlciB0byBhIHRlbXBsYXRlIHdob3NlIGFjdHVhbCB2YWx1ZSBkZXBlbmRzIG9uXG4gICAqIHNvbWUgc3RhdGUgbXV0YXRpb24gdGhhdCBtYXkgaGFwcGVuIGFmdGVyIHRoZSBjb25zdHJ1Y3QgaGFzIGJlZW4gY3JlYXRlZC5cbiAgICpcbiAgICogSWYgeW91IGFyZSBzaW1wbHkgbG9va2luZyB0byBmb3JjZSBhIHZhbHVlIHRvIGEgYG51bWJlcmAgdHlwZSBhbmQgZG9uJ3QgbmVlZFxuICAgKiB0aGUgY2FsY3VsYXRpb24gdG8gYmUgZGVmZXJyZWQsIHVzZSBgVG9rZW4uYXNOdW1iZXIoKWAgaW5zdGVhZC5cbiAgICpcbiAgICogVGhlIGlubmVyIGZ1bmN0aW9uIHdpbGwgb25seSBiZSBpbnZva2VkIG9uY2UsIGFuZCB0aGUgcmVzb2x2ZWQgdmFsdWVcbiAgICogY2Fubm90IGRlcGVuZCBvbiB0aGUgU3RhY2sgdGhlIFRva2VuIGlzIHVzZWQgaW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG51bWJlcihwcm9kdWNlcjogSVN0YWJsZU51bWJlclByb2R1Y2VyKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTnVtYmVyKG5ldyBMYXp5TnVtYmVyKHByb2R1Y2VyLCB0cnVlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIGNhbGN1bGF0aW9uIG9mIGEgbnVtYmVyIHZhbHVlIHRvIHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIFVzZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIG5vdCByZWNvbW1lbmRlZDsgdW5sZXNzIHlvdSBrbm93IHlvdSBuZWVkIGl0IGZvciBzdXJlLCB5b3VcbiAgICogcHJvYmFibHkgZG9uJ3QuIFVzZSBgTGF6eS5udW1iZXIoKWAgaW5zdGVhZC5cbiAgICpcbiAgICogVGhlIGlubmVyIGZ1bmN0aW9uIG1heSBiZSBpbnZva2VkIG11bHRpcGxlIHRpbWVzIGR1cmluZyBzeW50aGVzaXMuIFlvdVxuICAgKiBzaG91bGQgb25seSB1c2UgdGhpcyBtZXRob2QgaWYgdGhlIHJldHVybmVkIHZhbHVlIGRlcGVuZHMgb24gdmFyaWFibGVzXG4gICAqIHRoYXQgbWF5IGNoYW5nZSBkdXJpbmcgdGhlIEFzcGVjdCBhcHBsaWNhdGlvbiBwaGFzZSBvZiBzeW50aGVzaXMsIG9yIGlmXG4gICAqIHRoZSB2YWx1ZSBkZXBlbmRzIG9uIHRoZSBTdGFjayB0aGUgdmFsdWUgaXMgYmVpbmcgdXNlZCBpbi4gQm90aCBvZiB0aGVzZVxuICAgKiBjYXNlcyBhcmUgcmFyZSwgYW5kIG9ubHkgZXZlciBvY2N1ciBmb3IgQVdTIENvbnN0cnVjdCBMaWJyYXJ5IGF1dGhvcnMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHVuY2FjaGVkTnVtYmVyKHByb2R1Y2VyOiBJTnVtYmVyUHJvZHVjZXIpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNOdW1iZXIobmV3IExhenlOdW1iZXIocHJvZHVjZXIsIGZhbHNlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIG9uZS10aW1lIGNhbGN1bGF0aW9uIG9mIGEgbGlzdCB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYSBsaXN0IHRvIGEgdGVtcGxhdGUgd2hvc2UgYWN0dWFsIHZhbHVlIGRlcGVuZHMgb25cbiAgICogc29tZSBzdGF0ZSBtdXRhdGlvbiB0aGF0IG1heSBoYXBwZW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdCBoYXMgYmVlbiBjcmVhdGVkLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHNpbXBseSBsb29raW5nIHRvIGZvcmNlIGEgdmFsdWUgdG8gYSBgc3RyaW5nW11gIHR5cGUgYW5kIGRvbid0IG5lZWRcbiAgICogdGhlIGNhbGN1bGF0aW9uIHRvIGJlIGRlZmVycmVkLCB1c2UgYFRva2VuLmFzTGlzdCgpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhenkubGlzdCgpYCBvciBgTGF6eS51bmNhY2hlZExpc3QoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbGlzdFZhbHVlKHByb2R1Y2VyOiBJTGlzdFByb2R1Y2VyLCBvcHRpb25zOiBMYXp5TGlzdFZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgTGF6eUxpc3QocHJvZHVjZXIsIGZhbHNlLCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIGNhbGN1bGF0aW9uIG9mIGEgbGlzdCB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyBub3QgcmVjb21tZW5kZWQ7IHVubGVzcyB5b3Uga25vdyB5b3UgbmVlZCBpdCBmb3Igc3VyZSwgeW91XG4gICAqIHByb2JhYmx5IGRvbid0LiBVc2UgYExhenkubGlzdCgpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBUaGUgaW5uZXIgZnVuY3Rpb24gbWF5IGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXMgZHVyaW5nIHN5bnRoZXNpcy4gWW91XG4gICAqIHNob3VsZCBvbmx5IHVzZSB0aGlzIG1ldGhvZCBpZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB2YXJpYWJsZXNcbiAgICogdGhhdCBtYXkgY2hhbmdlIGR1cmluZyB0aGUgQXNwZWN0IGFwcGxpY2F0aW9uIHBoYXNlIG9mIHN5bnRoZXNpcywgb3IgaWZcbiAgICogdGhlIHZhbHVlIGRlcGVuZHMgb24gdGhlIFN0YWNrIHRoZSB2YWx1ZSBpcyBiZWluZyB1c2VkIGluLiBCb3RoIG9mIHRoZXNlXG4gICAqIGNhc2VzIGFyZSByYXJlLCBhbmQgb25seSBldmVyIG9jY3VyIGZvciBBV1MgQ29uc3RydWN0IExpYnJhcnkgYXV0aG9ycy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdW5jYWNoZWRMaXN0KHByb2R1Y2VyOiBJTGlzdFByb2R1Y2VyLCBvcHRpb25zOiBMYXp5TGlzdFZhbHVlT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgTGF6eUxpc3QocHJvZHVjZXIsIGZhbHNlLCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIG9uZS10aW1lIGNhbGN1bGF0aW9uIG9mIGEgbGlzdCB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYSBsaXN0IHRvIGEgdGVtcGxhdGUgd2hvc2UgYWN0dWFsIHZhbHVlIGRlcGVuZHMgb25cbiAgICogc29tZSBzdGF0ZSBtdXRhdGlvbiB0aGF0IG1heSBoYXBwZW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdCBoYXMgYmVlbiBjcmVhdGVkLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHNpbXBseSBsb29raW5nIHRvIGZvcmNlIGEgdmFsdWUgdG8gYSBgc3RyaW5nW11gIHR5cGUgYW5kIGRvbid0IG5lZWRcbiAgICogdGhlIGNhbGN1bGF0aW9uIHRvIGJlIGRlZmVycmVkLCB1c2UgYFRva2VuLmFzTGlzdCgpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBUaGUgaW5uZXIgZnVuY3Rpb24gd2lsbCBvbmx5IGJlIGludm9rZWQgb25jZSwgYW5kIHRoZSByZXNvbHZlZCB2YWx1ZVxuICAgKiBjYW5ub3QgZGVwZW5kIG9uIHRoZSBTdGFjayB0aGUgVG9rZW4gaXMgdXNlZCBpbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbGlzdChwcm9kdWNlcjogSVN0YWJsZUxpc3RQcm9kdWNlciwgb3B0aW9uczogTGF6eUxpc3RWYWx1ZU9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QobmV3IExhenlMaXN0KHByb2R1Y2VyLCB0cnVlLCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIG9uZS10aW1lIGNhbGN1bGF0aW9uIG9mIGFuIGFyYml0cmFyaWx5IHR5cGVkIHZhbHVlIHRvIHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIFVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHJlbmRlciBhbiBvYmplY3QgdG8gYSB0ZW1wbGF0ZSB3aG9zZSBhY3R1YWwgdmFsdWUgZGVwZW5kcyBvblxuICAgKiBzb21lIHN0YXRlIG11dGF0aW9uIHRoYXQgbWF5IGhhcHBlbiBhZnRlciB0aGUgY29uc3RydWN0IGhhcyBiZWVuIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTGF6eS5hbnkoKWAgb3IgYExhenkudW5jYWNoZWRBbnkoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW55VmFsdWUocHJvZHVjZXI6IElBbnlQcm9kdWNlciwgb3B0aW9uczogTGF6eUFueVZhbHVlT3B0aW9ucyA9IHt9KTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgTGF6eUFueShwcm9kdWNlciwgZmFsc2UsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmVyIHRoZSBvbmUtdGltZSBjYWxjdWxhdGlvbiBvZiBhbiBhcmJpdHJhcmlseSB0eXBlZCB2YWx1ZSB0byBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byByZW5kZXIgYW4gb2JqZWN0IHRvIGEgdGVtcGxhdGUgd2hvc2UgYWN0dWFsIHZhbHVlIGRlcGVuZHMgb25cbiAgICogc29tZSBzdGF0ZSBtdXRhdGlvbiB0aGF0IG1heSBoYXBwZW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdCBoYXMgYmVlbiBjcmVhdGVkLlxuICAgKlxuICAgKiBUaGUgaW5uZXIgZnVuY3Rpb24gd2lsbCBvbmx5IGJlIGludm9rZWQgb25lIHRpbWUgYW5kIGNhbm5vdCBkZXBlbmQgb25cbiAgICogcmVzb2x1dGlvbiBjb250ZXh0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnkocHJvZHVjZXI6IElTdGFibGVBbnlQcm9kdWNlciwgb3B0aW9uczogTGF6eUFueVZhbHVlT3B0aW9ucyA9IHt9KTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgTGF6eUFueShwcm9kdWNlciwgdHJ1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmZXIgdGhlIGNhbGN1bGF0aW9uIG9mIGFuIHVudHlwZWQgdmFsdWUgdG8gc3ludGhlc2lzIHRpbWVcbiAgICpcbiAgICogVXNlIG9mIHRoaXMgZnVuY3Rpb24gaXMgbm90IHJlY29tbWVuZGVkOyB1bmxlc3MgeW91IGtub3cgeW91IG5lZWQgaXQgZm9yIHN1cmUsIHlvdVxuICAgKiBwcm9iYWJseSBkb24ndC4gVXNlIGBMYXp5LmFueSgpYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBUaGUgaW5uZXIgZnVuY3Rpb24gbWF5IGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXMgZHVyaW5nIHN5bnRoZXNpcy4gWW91XG4gICAqIHNob3VsZCBvbmx5IHVzZSB0aGlzIG1ldGhvZCBpZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB2YXJpYWJsZXNcbiAgICogdGhhdCBtYXkgY2hhbmdlIGR1cmluZyB0aGUgQXNwZWN0IGFwcGxpY2F0aW9uIHBoYXNlIG9mIHN5bnRoZXNpcywgb3IgaWZcbiAgICogdGhlIHZhbHVlIGRlcGVuZHMgb24gdGhlIFN0YWNrIHRoZSB2YWx1ZSBpcyBiZWluZyB1c2VkIGluLiBCb3RoIG9mIHRoZXNlXG4gICAqIGNhc2VzIGFyZSByYXJlLCBhbmQgb25seSBldmVyIG9jY3VyIGZvciBBV1MgQ29uc3RydWN0IExpYnJhcnkgYXV0aG9ycy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdW5jYWNoZWRBbnkocHJvZHVjZXI6IElBbnlQcm9kdWNlciwgb3B0aW9uczogTGF6eUFueVZhbHVlT3B0aW9ucyA9IHt9KTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgTGF6eUFueShwcm9kdWNlciwgZmFsc2UsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgfVxufVxuXG5cbmludGVyZmFjZSBJTGF6eVByb2R1Y2VyPEE+IHtcbiAgcHJvZHVjZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBBIHwgdW5kZWZpbmVkO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBMYXp5QmFzZTxBPiBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuICBwcml2YXRlIF9jYWNoZWQ/OiBBO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvZHVjZXI6IElMYXp5UHJvZHVjZXI8QT4sIHByaXZhdGUgcmVhZG9ubHkgY2FjaGU6IGJvb2xlYW4pIHtcbiAgICAvLyBTdGFjayB0cmFjZSBjYXB0dXJlIGlzIGNvbmRpdGlvbmVkIHRvIGBkZWJ1Z01vZGVFbmFibGVkKClgLCBiZWNhdXNlXG4gICAgLy8gbGF6aWVzIGNhbiBiZSBjcmVhdGVkIGluIGEgZmFpcmx5IHRocmFzaHkgd2F5LCBhbmQgdGhlIHN0YWNrIHRyYWNlcyBhcmVcbiAgICAvLyBsYXJnZSBhbmQgc2xvdyB0byBvYnRhaW47IGJ1dCBhcmUgbW9zdGx5IHVzZWZ1bCBvbmx5IHdoZW4gZGVidWdnaW5nIGFcbiAgICAvLyByZXNvbHV0aW9uIGlzc3VlLlxuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGRlYnVnTW9kZUVuYWJsZWQoKVxuICAgICAgPyBjYXB0dXJlU3RhY2tUcmFjZSh0aGlzLmNvbnN0cnVjdG9yKVxuICAgICAgOiBbYEV4ZWN1dGUgYWdhaW4gd2l0aCAke0NES19ERUJVR309dHJ1ZSB0byBjYXB0dXJlIHN0YWNrIHRyYWNlc2BdO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuY2FjaGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZWQgPz8gKHRoaXMuX2NhY2hlZCA9IHRoaXMucHJvZHVjZXIucHJvZHVjZShjb250ZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2R1Y2VyLnByb2R1Y2UoY29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUdXJuIHRoaXMgVG9rZW4gaW50byBKU09OXG4gICAqXG4gICAqIENhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gSlNPTi5zdHJpbmdpZnkoKSBpcyBjYWxsZWQgb24gYSBUb2tlbi5cbiAgICovXG4gIHB1YmxpYyB0b0pTT04oKTogYW55IHtcbiAgICByZXR1cm4gJzx1bnJlc29sdmVkLWxhenk+JztcbiAgfVxuXG59XG5cbmNsYXNzIExhenlTdHJpbmcgZXh0ZW5kcyBMYXp5QmFzZTxzdHJpbmc+IHtcbn1cblxuY2xhc3MgTGF6eU51bWJlciBleHRlbmRzIExhenlCYXNlPG51bWJlcj4ge1xufVxuXG5jbGFzcyBMYXp5TGlzdCBleHRlbmRzIExhenlCYXNlPEFycmF5PHN0cmluZz4+IHtcbiAgY29uc3RydWN0b3IocHJvZHVjZXI6IElMaXN0UHJvZHVjZXIsIGNhY2hlOiBib29sZWFuLCBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IExhenlMaXN0VmFsdWVPcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwcm9kdWNlciwgY2FjaGUpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdXBlci5yZXNvbHZlKGNvbnRleHQpO1xuICAgIGlmIChyZXNvbHZlZD8ubGVuZ3RoID09PSAwICYmIHRoaXMub3B0aW9ucy5vbWl0RW1wdHkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXNvbHZlZDtcbiAgfVxufVxuXG5jbGFzcyBMYXp5QW55IGV4dGVuZHMgTGF6eUJhc2U8YW55PiB7XG4gIGNvbnN0cnVjdG9yKHByb2R1Y2VyOiBJQW55UHJvZHVjZXIsIGNhY2hlOiBib29sZWFuLCBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IExhenlBbnlWYWx1ZU9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHByb2R1Y2VyLCBjYWNoZSk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgICBjb25zdCByZXNvbHZlZCA9IHN1cGVyLnJlc29sdmUoY29udGV4dCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVzb2x2ZWQpICYmIHJlc29sdmVkLmxlbmd0aCA9PT0gMCAmJiB0aGlzLm9wdGlvbnMub21pdEVtcHR5QXJyYXkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXNvbHZlZDtcbiAgfVxufVxuIl19