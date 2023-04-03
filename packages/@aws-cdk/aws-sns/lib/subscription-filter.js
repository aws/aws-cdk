"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionFilter = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * A subscription filter for an attribute.
 */
class SubscriptionFilter {
    /**
     *
     * @param conditions conditions that specify the message attributes that should be included, excluded, matched, etc.
     */
    constructor(conditions = []) {
        this.conditions = conditions;
    }
    /**
     * Returns a subscription filter for a string attribute.
     */
    static stringFilter(stringConditions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_StringConditions(stringConditions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.stringFilter);
            }
            throw error;
        }
        const conditions = new Array();
        if (stringConditions.whitelist && stringConditions.allowlist) {
            throw new Error('`whitelist` is deprecated; please use `allowlist` instead');
        }
        if (stringConditions.blacklist && stringConditions.denylist) {
            throw new Error('`blacklist` is deprecated; please use `denylist` instead');
        }
        const allowlist = stringConditions.allowlist ?? stringConditions.whitelist;
        const denylist = stringConditions.denylist ?? stringConditions.blacklist;
        if (allowlist) {
            conditions.push(...allowlist);
        }
        if (denylist) {
            conditions.push({ 'anything-but': denylist });
        }
        if (stringConditions.matchPrefixes) {
            conditions.push(...stringConditions.matchPrefixes.map(p => ({ prefix: p })));
        }
        return new SubscriptionFilter(conditions);
    }
    /**
     * Returns a subscription filter for a numeric attribute.
     */
    static numericFilter(numericConditions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_NumericConditions(numericConditions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.numericFilter);
            }
            throw error;
        }
        const conditions = new Array();
        if (numericConditions.whitelist && numericConditions.allowlist) {
            throw new Error('`whitelist` is deprecated; please use `allowlist` instead');
        }
        const allowlist = numericConditions.allowlist ?? numericConditions.whitelist;
        if (allowlist) {
            conditions.push(...allowlist.map(v => ({ numeric: ['=', v] })));
        }
        if (numericConditions.greaterThan !== undefined) {
            conditions.push({ numeric: ['>', numericConditions.greaterThan] });
        }
        if (numericConditions.greaterThanOrEqualTo !== undefined) {
            conditions.push({ numeric: ['>=', numericConditions.greaterThanOrEqualTo] });
        }
        if (numericConditions.lessThan !== undefined) {
            conditions.push({ numeric: ['<', numericConditions.lessThan] });
        }
        if (numericConditions.lessThanOrEqualTo !== undefined) {
            conditions.push({ numeric: ['<=', numericConditions.lessThanOrEqualTo] });
        }
        if (numericConditions.between) {
            conditions.push({ numeric: ['>=', numericConditions.between.start, '<=', numericConditions.between.stop] });
        }
        if (numericConditions.betweenStrict) {
            conditions.push({ numeric: ['>', numericConditions.betweenStrict.start, '<', numericConditions.betweenStrict.stop] });
        }
        return new SubscriptionFilter(conditions);
    }
    /**
     * Returns a subscription filter for attribute key matching.
     */
    static existsFilter() {
        return new SubscriptionFilter([{ exists: true }]);
    }
}
exports.SubscriptionFilter = SubscriptionFilter;
_a = JSII_RTTI_SYMBOL_1;
SubscriptionFilter[_a] = { fqn: "@aws-cdk/aws-sns.SubscriptionFilter", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN1YnNjcmlwdGlvbi1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBbUhBOztHQUVHO0FBQ0gsTUFBYSxrQkFBa0I7SUFnRjdCOzs7T0FHRztJQUNILFlBQTRCLGFBQW9CLEVBQUU7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtLQUFJO0lBbkZ0RDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQWtDOzs7Ozs7Ozs7O1FBQzNELE1BQU0sVUFBVSxHQUFHLElBQUksS0FBSyxFQUFPLENBQUM7UUFFcEMsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksZ0JBQWdCLENBQUMsU0FBUyxFQUFFO1lBQzVELE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztTQUM5RTtRQUNELElBQUksZ0JBQWdCLENBQUMsU0FBUyxJQUFJLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtZQUMzRCxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7U0FDN0U7UUFDRCxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1FBQzNFLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLFFBQVEsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7UUFFekUsSUFBSSxTQUFTLEVBQUU7WUFDYixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7U0FDL0I7UUFFRCxJQUFJLFFBQVEsRUFBRTtZQUNaLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUMvQztRQUVELElBQUksZ0JBQWdCLENBQUMsYUFBYSxFQUFFO1lBQ2xDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5RTtRQUVELE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMzQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBb0M7Ozs7Ozs7Ozs7UUFDOUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLEVBQU8sQ0FBQztRQUVwQyxJQUFJLGlCQUFpQixDQUFDLFNBQVMsSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLEVBQUU7WUFDOUQsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsTUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxJQUFJLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztRQUU3RSxJQUFJLFNBQVMsRUFBRTtZQUNiLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsSUFBSSxpQkFBaUIsQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQy9DLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3BFO1FBRUQsSUFBSSxpQkFBaUIsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7WUFDeEQsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM5RTtRQUVELElBQUksaUJBQWlCLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM1QyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNqRTtRQUVELElBQUksaUJBQWlCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxFQUFFO1lBQ3JELFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDM0U7UUFFRCxJQUFJLGlCQUFpQixDQUFDLE9BQU8sRUFBRTtZQUM3QixVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0c7UUFFRCxJQUFJLGlCQUFpQixDQUFDLGFBQWEsRUFBRTtZQUNuQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdkg7UUFFRCxPQUFPLElBQUksa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDM0M7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZQUFZO1FBQ3hCLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNuRDs7QUE5RUgsZ0RBcUZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb25kaXRpb25zIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gc3RyaW5nIGF0dHJpYnV0ZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nQ29uZGl0aW9ucyB7XG4gIC8qKlxuICAgKiBNYXRjaCBvbmUgb3IgbW9yZSB2YWx1ZXMuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgYWxsb3dsaXN0YFxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHdoaXRlbGlzdD86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBNYXRjaCBhbnkgdmFsdWUgdGhhdCBkb2Vzbid0IGluY2x1ZGUgYW55IG9mIHRoZSBzcGVjaWZpZWQgdmFsdWVzLlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGRlbnlsaXN0YFxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGJsYWNrbGlzdD86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBNYXRjaCBvbmUgb3IgbW9yZSB2YWx1ZXMuXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dsaXN0Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIE1hdGNoIGFueSB2YWx1ZSB0aGF0IGRvZXNuJ3QgaW5jbHVkZSBhbnkgb2YgdGhlIHNwZWNpZmllZCB2YWx1ZXMuXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVueWxpc3Q/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTWF0Y2hlcyB2YWx1ZXMgdGhhdCBiZWdpbnMgd2l0aCB0aGUgc3BlY2lmaWVkIHByZWZpeGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IG1hdGNoUHJlZml4ZXM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBCZXR3ZWVuIGNvbmRpdGlvbiBmb3IgYSBudW1lcmljIGF0dHJpYnV0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCZXR3ZWVuQ29uZGl0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBzdGFydCB2YWx1ZS5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXJ0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzdG9wIHZhbHVlLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RvcDogbnVtYmVyO1xufVxuXG4vKipcbiAqIENvbmRpdGlvbnMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBudW1lcmljIGF0dHJpYnV0ZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTnVtZXJpY0NvbmRpdGlvbnMge1xuICAvKipcbiAgICogTWF0Y2ggb25lIG9yIG1vcmUgdmFsdWVzLlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGFsbG93bGlzdGBcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSB3aGl0ZWxpc3Q/OiBudW1iZXJbXTtcblxuICAvKipcbiAgICogTWF0Y2ggb25lIG9yIG1vcmUgdmFsdWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93bGlzdD86IG51bWJlcltdO1xuXG4gIC8qKlxuICAgKiBNYXRjaCB2YWx1ZXMgdGhhdCBhcmUgZ3JlYXRlciB0aGFuIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZ3JlYXRlclRoYW4/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIE1hdGNoIHZhbHVlcyB0aGF0IGFyZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSBncmVhdGVyVGhhbk9yRXF1YWxUbz86IG51bWJlcjtcblxuICAvKipcbiAgICogTWF0Y2ggdmFsdWVzIHRoYXQgYXJlIGxlc3MgdGhhbiB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGxlc3NUaGFuPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBNYXRjaCB2YWx1ZXMgdGhhdCBhcmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgbGVzc1RoYW5PckVxdWFsVG8/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIE1hdGNoIHZhbHVlcyB0aGF0IGFyZSBiZXR3ZWVuIHRoZSBzcGVjaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGJldHdlZW4/OiBCZXR3ZWVuQ29uZGl0aW9uO1xuXG4gIC8qKlxuICAgKiBNYXRjaCB2YWx1ZXMgdGhhdCBhcmUgc3RyaWN0bHkgYmV0d2VlbiB0aGUgc3BlY2lmaWVkIHZhbHVlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSBiZXR3ZWVuU3RyaWN0PzogQmV0d2VlbkNvbmRpdGlvbjtcbn1cblxuLyoqXG4gKiBBIHN1YnNjcmlwdGlvbiBmaWx0ZXIgZm9yIGFuIGF0dHJpYnV0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbkZpbHRlciB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3Vic2NyaXB0aW9uIGZpbHRlciBmb3IgYSBzdHJpbmcgYXR0cmlidXRlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdGaWx0ZXIoc3RyaW5nQ29uZGl0aW9uczogU3RyaW5nQ29uZGl0aW9ucykge1xuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBuZXcgQXJyYXk8YW55PigpO1xuXG4gICAgaWYgKHN0cmluZ0NvbmRpdGlvbnMud2hpdGVsaXN0ICYmIHN0cmluZ0NvbmRpdGlvbnMuYWxsb3dsaXN0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B3aGl0ZWxpc3RgIGlzIGRlcHJlY2F0ZWQ7IHBsZWFzZSB1c2UgYGFsbG93bGlzdGAgaW5zdGVhZCcpO1xuICAgIH1cbiAgICBpZiAoc3RyaW5nQ29uZGl0aW9ucy5ibGFja2xpc3QgJiYgc3RyaW5nQ29uZGl0aW9ucy5kZW55bGlzdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgYmxhY2tsaXN0YCBpcyBkZXByZWNhdGVkOyBwbGVhc2UgdXNlIGBkZW55bGlzdGAgaW5zdGVhZCcpO1xuICAgIH1cbiAgICBjb25zdCBhbGxvd2xpc3QgPSBzdHJpbmdDb25kaXRpb25zLmFsbG93bGlzdCA/PyBzdHJpbmdDb25kaXRpb25zLndoaXRlbGlzdDtcbiAgICBjb25zdCBkZW55bGlzdCA9IHN0cmluZ0NvbmRpdGlvbnMuZGVueWxpc3QgPz8gc3RyaW5nQ29uZGl0aW9ucy5ibGFja2xpc3Q7XG5cbiAgICBpZiAoYWxsb3dsaXN0KSB7XG4gICAgICBjb25kaXRpb25zLnB1c2goLi4uYWxsb3dsaXN0KTtcbiAgICB9XG5cbiAgICBpZiAoZGVueWxpc3QpIHtcbiAgICAgIGNvbmRpdGlvbnMucHVzaCh7ICdhbnl0aGluZy1idXQnOiBkZW55bGlzdCB9KTtcbiAgICB9XG5cbiAgICBpZiAoc3RyaW5nQ29uZGl0aW9ucy5tYXRjaFByZWZpeGVzKSB7XG4gICAgICBjb25kaXRpb25zLnB1c2goLi4uc3RyaW5nQ29uZGl0aW9ucy5tYXRjaFByZWZpeGVzLm1hcChwID0+ICh7IHByZWZpeDogcCB9KSkpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uRmlsdGVyKGNvbmRpdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdWJzY3JpcHRpb24gZmlsdGVyIGZvciBhIG51bWVyaWMgYXR0cmlidXRlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBudW1lcmljRmlsdGVyKG51bWVyaWNDb25kaXRpb25zOiBOdW1lcmljQ29uZGl0aW9ucykge1xuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBuZXcgQXJyYXk8YW55PigpO1xuXG4gICAgaWYgKG51bWVyaWNDb25kaXRpb25zLndoaXRlbGlzdCAmJiBudW1lcmljQ29uZGl0aW9ucy5hbGxvd2xpc3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHdoaXRlbGlzdGAgaXMgZGVwcmVjYXRlZDsgcGxlYXNlIHVzZSBgYWxsb3dsaXN0YCBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIGNvbnN0IGFsbG93bGlzdCA9IG51bWVyaWNDb25kaXRpb25zLmFsbG93bGlzdCA/PyBudW1lcmljQ29uZGl0aW9ucy53aGl0ZWxpc3Q7XG5cbiAgICBpZiAoYWxsb3dsaXN0KSB7XG4gICAgICBjb25kaXRpb25zLnB1c2goLi4uYWxsb3dsaXN0Lm1hcCh2ID0+ICh7IG51bWVyaWM6IFsnPScsIHZdIH0pKSk7XG4gICAgfVxuXG4gICAgaWYgKG51bWVyaWNDb25kaXRpb25zLmdyZWF0ZXJUaGFuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbmRpdGlvbnMucHVzaCh7IG51bWVyaWM6IFsnPicsIG51bWVyaWNDb25kaXRpb25zLmdyZWF0ZXJUaGFuXSB9KTtcbiAgICB9XG5cbiAgICBpZiAobnVtZXJpY0NvbmRpdGlvbnMuZ3JlYXRlclRoYW5PckVxdWFsVG8gIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uZGl0aW9ucy5wdXNoKHsgbnVtZXJpYzogWyc+PScsIG51bWVyaWNDb25kaXRpb25zLmdyZWF0ZXJUaGFuT3JFcXVhbFRvXSB9KTtcbiAgICB9XG5cbiAgICBpZiAobnVtZXJpY0NvbmRpdGlvbnMubGVzc1RoYW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uZGl0aW9ucy5wdXNoKHsgbnVtZXJpYzogWyc8JywgbnVtZXJpY0NvbmRpdGlvbnMubGVzc1RoYW5dIH0pO1xuICAgIH1cblxuICAgIGlmIChudW1lcmljQ29uZGl0aW9ucy5sZXNzVGhhbk9yRXF1YWxUbyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25kaXRpb25zLnB1c2goeyBudW1lcmljOiBbJzw9JywgbnVtZXJpY0NvbmRpdGlvbnMubGVzc1RoYW5PckVxdWFsVG9dIH0pO1xuICAgIH1cblxuICAgIGlmIChudW1lcmljQ29uZGl0aW9ucy5iZXR3ZWVuKSB7XG4gICAgICBjb25kaXRpb25zLnB1c2goeyBudW1lcmljOiBbJz49JywgbnVtZXJpY0NvbmRpdGlvbnMuYmV0d2Vlbi5zdGFydCwgJzw9JywgbnVtZXJpY0NvbmRpdGlvbnMuYmV0d2Vlbi5zdG9wXSB9KTtcbiAgICB9XG5cbiAgICBpZiAobnVtZXJpY0NvbmRpdGlvbnMuYmV0d2VlblN0cmljdCkge1xuICAgICAgY29uZGl0aW9ucy5wdXNoKHsgbnVtZXJpYzogWyc+JywgbnVtZXJpY0NvbmRpdGlvbnMuYmV0d2VlblN0cmljdC5zdGFydCwgJzwnLCBudW1lcmljQ29uZGl0aW9ucy5iZXR3ZWVuU3RyaWN0LnN0b3BdIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uRmlsdGVyKGNvbmRpdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdWJzY3JpcHRpb24gZmlsdGVyIGZvciBhdHRyaWJ1dGUga2V5IG1hdGNoaW5nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBleGlzdHNGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25GaWx0ZXIoW3sgZXhpc3RzOiB0cnVlIH1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gY29uZGl0aW9ucyBjb25kaXRpb25zIHRoYXQgc3BlY2lmeSB0aGUgbWVzc2FnZSBhdHRyaWJ1dGVzIHRoYXQgc2hvdWxkIGJlIGluY2x1ZGVkLCBleGNsdWRlZCwgbWF0Y2hlZCwgZXRjLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGNvbmRpdGlvbnM6IGFueVtdID0gW10pIHt9XG59XG4iXX0=