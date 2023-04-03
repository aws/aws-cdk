"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlags = void 0;
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
exports.FeatureFlags = FeatureFlags;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZS1mbGFncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZlYXR1cmUtZmxhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQXlDO0FBQ3pDLDJDQUE4QztBQUU5Qzs7Ozs7O0dBTUc7QUFDSCxNQUFhLFlBQVk7SUFDdkI7O09BRUc7SUFDSSxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQWlCO1FBQ2hDLE9BQU8sSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELFlBQXFDLFNBQXFCO1FBQXJCLGNBQVMsR0FBVCxTQUFTLENBQVk7SUFBRyxDQUFDO0lBRTlEOzs7O09BSUc7SUFDSSxTQUFTLENBQUMsV0FBbUI7UUFDbEMsTUFBTSxPQUFPLEdBQUcsaUJBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNuRSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDN0QsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO2dCQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixXQUFXLDhEQUE4RDtzQkFDbEgsK0RBQStELENBQUMsQ0FBQzthQUN0RTtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7Q0FDRjtBQTFCRCxvQ0EwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIEZlYXR1cmVzIHRoYXQgYXJlIGltcGxlbWVudGVkIGJlaGluZCBhIGZsYWcgaW4gb3JkZXIgdG8gcHJlc2VydmUgYmFja3dhcmRzXG4gKiBjb21wYXRpYmlsaXR5IGZvciBleGlzdGluZyBhcHBzLiBUaGUgbGlzdCBvZiBmbGFncyBhcmUgYXZhaWxhYmxlIGluIHRoZVxuICogYEBhd3MtY2RrL2N4LWFwaWAgbW9kdWxlLlxuICpcbiAqIFRoZSBzdGF0ZSBvZiB0aGUgZmxhZyBmb3IgdGhpcyBhcHBsaWNhdGlvbiBpcyBzdG9yZWQgYXMgYSBDREsgY29udGV4dCB2YXJpYWJsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEZlYXR1cmVGbGFncyB7XG4gIC8qKlxuICAgKiBJbnNwZWN0IGZlYXR1cmUgZmxhZ3Mgb24gdGhlIGNvbnN0cnVjdCBub2RlJ3MgY29udGV4dC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2Yoc2NvcGU6IElDb25zdHJ1Y3QpIHtcbiAgICByZXR1cm4gbmV3IEZlYXR1cmVGbGFncyhzY29wZSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29uc3RydWN0OiBJQ29uc3RydWN0KSB7fVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGEgZmVhdHVyZSBmbGFnIGlzIGVuYWJsZWQuIElmIGNvbmZpZ3VyZWQsIHRoZSBmbGFnIGlzIHByZXNlbnQgaW5cbiAgICogdGhlIGNvbnN0cnVjdCBub2RlIGNvbnRleHQuIEZhbGxzIGJhY2sgdG8gdGhlIGRlZmF1bHRzIGRlZmluZWQgaW4gdGhlIGBjeC1hcGlgXG4gICAqIG1vZHVsZS5cbiAgICovXG4gIHB1YmxpYyBpc0VuYWJsZWQoZmVhdHVyZUZsYWc6IHN0cmluZyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGNvbnRleHQgPSBOb2RlLm9mKHRoaXMuY29uc3RydWN0KS50cnlHZXRDb250ZXh0KGZlYXR1cmVGbGFnKTtcbiAgICBpZiAoY3hhcGkuQ1VSUkVOVF9WRVJTSU9OX0VYUElSRURfRkxBR1MuaW5jbHVkZXMoZmVhdHVyZUZsYWcpKSB7XG4gICAgICBpZiAoY29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZmVhdHVyZSBmbGFnICcke2ZlYXR1cmVGbGFnfScuIFRoaXMgZmxhZyBleGlzdGVkIG9uIENES3YxIGJ1dCBoYXMgYmVlbiByZW1vdmVkIGluIENES3YyLmBcbiAgICAgICAgICArICcgQ0RLIHdpbGwgbm93IGJlaGF2ZSBhcyB0aGUgc2FtZSBhcyB3aGVuIHRoZSBmbGFnIGlzIGVuYWJsZWQuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHQgIT09IHVuZGVmaW5lZCA/IEJvb2xlYW4oY29udGV4dCkgOiBjeGFwaS5mdXR1cmVGbGFnRGVmYXVsdChmZWF0dXJlRmxhZyk7XG4gIH1cbn1cbiJdfQ==