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
    constructor(construct) {
        this.construct = construct;
    }
    /**
     * Inspect feature flags on the construct node's context.
     */
    static of(scope) {
        return new FeatureFlags(scope);
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
exports.FeatureFlags = FeatureFlags;
_a = JSII_RTTI_SYMBOL_1;
FeatureFlags[_a] = { fqn: "@aws-cdk/core.FeatureFlags", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZS1mbGFncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZlYXR1cmUtZmxhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5Q0FBeUM7QUFDekMsMkNBQThDO0FBRTlDOzs7Ozs7R0FNRztBQUNILE1BQWEsWUFBWTtJQVF2QixZQUFxQyxTQUFxQjtRQUFyQixjQUFTLEdBQVQsU0FBUyxDQUFZO0tBQUk7SUFQOUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQWlCO1FBQ2hDLE9BQU8sSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEM7SUFJRDs7OztPQUlHO0lBQ0ksU0FBUyxDQUFDLFdBQW1CO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLGlCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkUsSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzdELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsV0FBVyw4REFBOEQ7c0JBQ2xILCtEQUErRCxDQUFDLENBQUM7YUFDdEU7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUN4Rjs7QUF6Qkgsb0NBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IElDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBGZWF0dXJlcyB0aGF0IGFyZSBpbXBsZW1lbnRlZCBiZWhpbmQgYSBmbGFnIGluIG9yZGVyIHRvIHByZXNlcnZlIGJhY2t3YXJkc1xuICogY29tcGF0aWJpbGl0eSBmb3IgZXhpc3RpbmcgYXBwcy4gVGhlIGxpc3Qgb2YgZmxhZ3MgYXJlIGF2YWlsYWJsZSBpbiB0aGVcbiAqIGBAYXdzLWNkay9jeC1hcGlgIG1vZHVsZS5cbiAqXG4gKiBUaGUgc3RhdGUgb2YgdGhlIGZsYWcgZm9yIHRoaXMgYXBwbGljYXRpb24gaXMgc3RvcmVkIGFzIGEgQ0RLIGNvbnRleHQgdmFyaWFibGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBGZWF0dXJlRmxhZ3Mge1xuICAvKipcbiAgICogSW5zcGVjdCBmZWF0dXJlIGZsYWdzIG9uIHRoZSBjb25zdHJ1Y3Qgbm9kZSdzIGNvbnRleHQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9mKHNjb3BlOiBJQ29uc3RydWN0KSB7XG4gICAgcmV0dXJuIG5ldyBGZWF0dXJlRmxhZ3Moc2NvcGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbnN0cnVjdDogSUNvbnN0cnVjdCkge31cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBhIGZlYXR1cmUgZmxhZyBpcyBlbmFibGVkLiBJZiBjb25maWd1cmVkLCB0aGUgZmxhZyBpcyBwcmVzZW50IGluXG4gICAqIHRoZSBjb25zdHJ1Y3Qgbm9kZSBjb250ZXh0LiBGYWxscyBiYWNrIHRvIHRoZSBkZWZhdWx0cyBkZWZpbmVkIGluIHRoZSBgY3gtYXBpYFxuICAgKiBtb2R1bGUuXG4gICAqL1xuICBwdWJsaWMgaXNFbmFibGVkKGZlYXR1cmVGbGFnOiBzdHJpbmcpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjb250ZXh0ID0gTm9kZS5vZih0aGlzLmNvbnN0cnVjdCkudHJ5R2V0Q29udGV4dChmZWF0dXJlRmxhZyk7XG4gICAgaWYgKGN4YXBpLkNVUlJFTlRfVkVSU0lPTl9FWFBJUkVEX0ZMQUdTLmluY2x1ZGVzKGZlYXR1cmVGbGFnKSkge1xuICAgICAgaWYgKGNvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZlYXR1cmUgZmxhZyAnJHtmZWF0dXJlRmxhZ30nLiBUaGlzIGZsYWcgZXhpc3RlZCBvbiBDREt2MSBidXQgaGFzIGJlZW4gcmVtb3ZlZCBpbiBDREt2Mi5gXG4gICAgICAgICAgKyAnIENESyB3aWxsIG5vdyBiZWhhdmUgYXMgdGhlIHNhbWUgYXMgd2hlbiB0aGUgZmxhZyBpcyBlbmFibGVkLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0ICE9PSB1bmRlZmluZWQgPyBCb29sZWFuKGNvbnRleHQpIDogY3hhcGkuZnV0dXJlRmxhZ0RlZmF1bHQoZmVhdHVyZUZsYWcpO1xuICB9XG59XG4iXX0=