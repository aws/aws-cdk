"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlags = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
/**
 * Features that are implemented behind a flag in order to preserve backwards
 * compatibility for existing apps. The list of flags are available in the
 * `@aws-cdk/cx-api` module.
 *
 * The state of the flag for this application is stored as a CDK context variable.
 */
class FeatureFlags {
    /**
     * Inspect feature flags on the construct node's context.
     */
    static of(scope) {
        return new FeatureFlags(scope);
    }
    constructor(construct) {
        this.construct = construct;
    }
    /**
     * Check whether a feature flag is enabled. If configured, the flag is present in
     * the construct node context. Falls back to the defaults defined in the `cx-api`
     * module.
     */
    isEnabled(featureFlag) {
        const context = constructs_1.Node.of(this.construct).tryGetContext(featureFlag);
        if (cxapi.CURRENT_VERSION_EXPIRED_FLAGS.includes(featureFlag)) {
            if (context !== undefined) {
                throw new Error(`Unsupported feature flag '${featureFlag}'. This flag existed on CDKv1 but has been removed in CDKv2.`
                    + ' CDK will now behave as the same as when the flag is enabled.');
            }
            return true;
        }
        return context !== undefined ? Boolean(context) : cxapi.futureFlagDefault(featureFlag);
    }
}
_a = JSII_RTTI_SYMBOL_1;
FeatureFlags[_a] = { fqn: "@aws-cdk/core.FeatureFlags", version: "0.0.0" };
exports.FeatureFlags = FeatureFlags;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZS1mbGFncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZlYXR1cmUtZmxhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5Q0FBeUM7QUFDekMsMkNBQThDO0FBRTlDOzs7Ozs7R0FNRztBQUNILE1BQWEsWUFBWTtJQUN2Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBaUI7UUFDaEMsT0FBTyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQztJQUVELFlBQXFDLFNBQXFCO1FBQXJCLGNBQVMsR0FBVCxTQUFTLENBQVk7S0FBSTtJQUU5RDs7OztPQUlHO0lBQ0ksU0FBUyxDQUFDLFdBQW1CO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLGlCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkUsSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzdELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsV0FBVyw4REFBOEQ7c0JBQ2xILCtEQUErRCxDQUFDLENBQUM7YUFDdEU7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUN4Rjs7OztBQXpCVSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogRmVhdHVyZXMgdGhhdCBhcmUgaW1wbGVtZW50ZWQgYmVoaW5kIGEgZmxhZyBpbiBvcmRlciB0byBwcmVzZXJ2ZSBiYWNrd2FyZHNcbiAqIGNvbXBhdGliaWxpdHkgZm9yIGV4aXN0aW5nIGFwcHMuIFRoZSBsaXN0IG9mIGZsYWdzIGFyZSBhdmFpbGFibGUgaW4gdGhlXG4gKiBgQGF3cy1jZGsvY3gtYXBpYCBtb2R1bGUuXG4gKlxuICogVGhlIHN0YXRlIG9mIHRoZSBmbGFnIGZvciB0aGlzIGFwcGxpY2F0aW9uIGlzIHN0b3JlZCBhcyBhIENESyBjb250ZXh0IHZhcmlhYmxlLlxuICovXG5leHBvcnQgY2xhc3MgRmVhdHVyZUZsYWdzIHtcbiAgLyoqXG4gICAqIEluc3BlY3QgZmVhdHVyZSBmbGFncyBvbiB0aGUgY29uc3RydWN0IG5vZGUncyBjb250ZXh0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZihzY29wZTogSUNvbnN0cnVjdCkge1xuICAgIHJldHVybiBuZXcgRmVhdHVyZUZsYWdzKHNjb3BlKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpIHt9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYSBmZWF0dXJlIGZsYWcgaXMgZW5hYmxlZC4gSWYgY29uZmlndXJlZCwgdGhlIGZsYWcgaXMgcHJlc2VudCBpblxuICAgKiB0aGUgY29uc3RydWN0IG5vZGUgY29udGV4dC4gRmFsbHMgYmFjayB0byB0aGUgZGVmYXVsdHMgZGVmaW5lZCBpbiB0aGUgYGN4LWFwaWBcbiAgICogbW9kdWxlLlxuICAgKi9cbiAgcHVibGljIGlzRW5hYmxlZChmZWF0dXJlRmxhZzogc3RyaW5nKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY29udGV4dCA9IE5vZGUub2YodGhpcy5jb25zdHJ1Y3QpLnRyeUdldENvbnRleHQoZmVhdHVyZUZsYWcpO1xuICAgIGlmIChjeGFwaS5DVVJSRU5UX1ZFUlNJT05fRVhQSVJFRF9GTEFHUy5pbmNsdWRlcyhmZWF0dXJlRmxhZykpIHtcbiAgICAgIGlmIChjb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBmZWF0dXJlIGZsYWcgJyR7ZmVhdHVyZUZsYWd9Jy4gVGhpcyBmbGFnIGV4aXN0ZWQgb24gQ0RLdjEgYnV0IGhhcyBiZWVuIHJlbW92ZWQgaW4gQ0RLdjIuYFxuICAgICAgICAgICsgJyBDREsgd2lsbCBub3cgYmVoYXZlIGFzIHRoZSBzYW1lIGFzIHdoZW4gdGhlIGZsYWcgaXMgZW5hYmxlZC4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dCAhPT0gdW5kZWZpbmVkID8gQm9vbGVhbihjb250ZXh0KSA6IGN4YXBpLmZ1dHVyZUZsYWdEZWZhdWx0KGZlYXR1cmVGbGFnKTtcbiAgfVxufVxuIl19