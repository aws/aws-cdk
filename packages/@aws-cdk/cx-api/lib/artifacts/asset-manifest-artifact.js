"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManifestArtifact = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const cloud_artifact_1 = require("../cloud-artifact");
const ASSET_MANIFEST_ARTIFACT_SYM = Symbol.for('@aws-cdk/cx-api.AssetManifestArtifact');
/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
class AssetManifestArtifact extends cloud_artifact_1.CloudArtifact {
    /**
     * Checks if `art` is an instance of this class.
     *
     * Use this method instead of `instanceof` to properly detect `AssetManifestArtifact`
     * instances, even when the construct library is symlinked.
     *
     * Explanation: in JavaScript, multiple copies of the `cx-api` library on
     * disk are seen as independent, completely different libraries. As a
     * consequence, the class `AssetManifestArtifact` in each copy of the `cx-api` library
     * is seen as a different class, and an instance of one class will not test as
     * `instanceof` the other class. `npm install` will not create installations
     * like this, but users may manually symlink construct libraries together or
     * use a monorepo tool: in those cases, multiple copies of the `cx-api`
     * library can be accidentally installed, and `instanceof` will behave
     * unpredictably. It is safest to avoid using `instanceof`, and using
     * this type-testing method instead.
     */
    static isAssetManifestArtifact(art) {
        return art && typeof art === 'object' && art[ASSET_MANIFEST_ARTIFACT_SYM];
    }
    constructor(assembly, name, artifact) {
        super(assembly, name, artifact);
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_CloudAssembly(assembly);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AssetManifestArtifact);
            }
            throw error;
        }
        const properties = (this.manifest.properties || {});
        if (!properties.file) {
            throw new Error('Invalid AssetManifestArtifact. Missing "file" property');
        }
        this.file = path.resolve(this.assembly.directory, properties.file);
        this.requiresBootstrapStackVersion = properties.requiresBootstrapStackVersion;
        this.bootstrapStackVersionSsmParameter = properties.bootstrapStackVersionSsmParameter;
    }
    /**
     * The Asset Manifest contents
     */
    get contents() {
        if (this._contents !== undefined) {
            return this._contents;
        }
        const contents = this._contents = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
        return contents;
    }
}
_a = JSII_RTTI_SYMBOL_1;
AssetManifestArtifact[_a] = { fqn: "@aws-cdk/cx-api.AssetManifestArtifact", version: "0.0.0" };
exports.AssetManifestArtifact = AssetManifestArtifact;
/**
 * Mark all instances of 'AssetManifestArtifact'
 *
 * Why not put this in the constructor? Because this is a class property,
 * not an instance property. It applies to all instances of the class.
 */
Object.defineProperty(AssetManifestArtifact.prototype, ASSET_MANIFEST_ARTIFACT_SYM, {
    value: true,
    enumerable: false,
    writable: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtbWFuaWZlc3QtYXJ0aWZhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhc3NldC1tYW5pZmVzdC1hcnRpZmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBRTdCLHNEQUFrRDtBQUdsRCxNQUFNLDJCQUEyQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUV4Rjs7R0FFRztBQUNILE1BQWEscUJBQXNCLFNBQVEsOEJBQWE7SUFDdEQ7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSSxNQUFNLENBQUMsdUJBQXVCLENBQUMsR0FBUTtRQUM1QyxPQUFPLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FDM0U7SUFxQkQsWUFBWSxRQUF1QixFQUFFLElBQVksRUFBRSxRQUFtQztRQUNwRixLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzs7Ozs7OytDQTFDdkIscUJBQXFCOzs7O1FBNEM5QixNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBcUMsQ0FBQztRQUN4RixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtZQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7U0FDM0U7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyw2QkFBNkIsR0FBRyxVQUFVLENBQUMsNkJBQTZCLENBQUM7UUFDOUUsSUFBSSxDQUFDLGlDQUFpQyxHQUFHLFVBQVUsQ0FBQyxpQ0FBaUMsQ0FBQztLQUN2RjtJQUVEOztPQUVHO0lBQ0gsSUFBVyxRQUFRO1FBQ2pCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3ZCO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLE9BQU8sUUFBUSxDQUFDO0tBQ2pCOzs7O0FBL0RVLHNEQUFxQjtBQW1FbEM7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSwyQkFBMkIsRUFBRTtJQUNsRixLQUFLLEVBQUUsSUFBSTtJQUNYLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFFBQVEsRUFBRSxLQUFLO0NBQ2hCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQ2xvdWRBcnRpZmFjdCB9IGZyb20gJy4uL2Nsb3VkLWFydGlmYWN0JztcbmltcG9ydCB7IENsb3VkQXNzZW1ibHkgfSBmcm9tICcuLi9jbG91ZC1hc3NlbWJseSc7XG5cbmNvbnN0IEFTU0VUX01BTklGRVNUX0FSVElGQUNUX1NZTSA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2N4LWFwaS5Bc3NldE1hbmlmZXN0QXJ0aWZhY3QnKTtcblxuLyoqXG4gKiBBc3NldCBtYW5pZmVzdCBpcyBhIGRlc2NyaXB0aW9uIG9mIGEgc2V0IG9mIGFzc2V0cyB3aGljaCBuZWVkIHRvIGJlIGJ1aWx0IGFuZCBwdWJsaXNoZWRcbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2V0TWFuaWZlc3RBcnRpZmFjdCBleHRlbmRzIENsb3VkQXJ0aWZhY3Qge1xuICAvKipcbiAgICogQ2hlY2tzIGlmIGBhcnRgIGlzIGFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3MuXG4gICAqXG4gICAqIFVzZSB0aGlzIG1ldGhvZCBpbnN0ZWFkIG9mIGBpbnN0YW5jZW9mYCB0byBwcm9wZXJseSBkZXRlY3QgYEFzc2V0TWFuaWZlc3RBcnRpZmFjdGBcbiAgICogaW5zdGFuY2VzLCBldmVuIHdoZW4gdGhlIGNvbnN0cnVjdCBsaWJyYXJ5IGlzIHN5bWxpbmtlZC5cbiAgICpcbiAgICogRXhwbGFuYXRpb246IGluIEphdmFTY3JpcHQsIG11bHRpcGxlIGNvcGllcyBvZiB0aGUgYGN4LWFwaWAgbGlicmFyeSBvblxuICAgKiBkaXNrIGFyZSBzZWVuIGFzIGluZGVwZW5kZW50LCBjb21wbGV0ZWx5IGRpZmZlcmVudCBsaWJyYXJpZXMuIEFzIGFcbiAgICogY29uc2VxdWVuY2UsIHRoZSBjbGFzcyBgQXNzZXRNYW5pZmVzdEFydGlmYWN0YCBpbiBlYWNoIGNvcHkgb2YgdGhlIGBjeC1hcGlgIGxpYnJhcnlcbiAgICogaXMgc2VlbiBhcyBhIGRpZmZlcmVudCBjbGFzcywgYW5kIGFuIGluc3RhbmNlIG9mIG9uZSBjbGFzcyB3aWxsIG5vdCB0ZXN0IGFzXG4gICAqIGBpbnN0YW5jZW9mYCB0aGUgb3RoZXIgY2xhc3MuIGBucG0gaW5zdGFsbGAgd2lsbCBub3QgY3JlYXRlIGluc3RhbGxhdGlvbnNcbiAgICogbGlrZSB0aGlzLCBidXQgdXNlcnMgbWF5IG1hbnVhbGx5IHN5bWxpbmsgY29uc3RydWN0IGxpYnJhcmllcyB0b2dldGhlciBvclxuICAgKiB1c2UgYSBtb25vcmVwbyB0b29sOiBpbiB0aG9zZSBjYXNlcywgbXVsdGlwbGUgY29waWVzIG9mIHRoZSBgY3gtYXBpYFxuICAgKiBsaWJyYXJ5IGNhbiBiZSBhY2NpZGVudGFsbHkgaW5zdGFsbGVkLCBhbmQgYGluc3RhbmNlb2ZgIHdpbGwgYmVoYXZlXG4gICAqIHVucHJlZGljdGFibHkuIEl0IGlzIHNhZmVzdCB0byBhdm9pZCB1c2luZyBgaW5zdGFuY2VvZmAsIGFuZCB1c2luZ1xuICAgKiB0aGlzIHR5cGUtdGVzdGluZyBtZXRob2QgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNBc3NldE1hbmlmZXN0QXJ0aWZhY3QoYXJ0OiBhbnkpOiBhcnQgaXMgQXNzZXRNYW5pZmVzdEFydGlmYWN0IHtcbiAgICByZXR1cm4gYXJ0ICYmIHR5cGVvZiBhcnQgPT09ICdvYmplY3QnICYmIGFydFtBU1NFVF9NQU5JRkVTVF9BUlRJRkFDVF9TWU1dO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBmaWxlIG5hbWUgb2YgdGhlIGFzc2V0IG1hbmlmZXN0XG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZmlsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBWZXJzaW9uIG9mIGJvb3RzdHJhcCBzdGFjayByZXF1aXJlZCB0byBkZXBsb3kgdGhpcyBzdGFja1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJlcXVpcmVzQm9vdHN0cmFwU3RhY2tWZXJzaW9uOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgU1NNIHBhcmFtZXRlciB3aXRoIGJvb3RzdHJhcCBzdGFjayB2ZXJzaW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGlzY292ZXIgU1NNIHBhcmFtZXRlciBieSByZWFkaW5nIHN0YWNrXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyPzogc3RyaW5nO1xuXG4gIHByaXZhdGUgX2NvbnRlbnRzPzogY3hzY2hlbWEuQXNzZXRNYW5pZmVzdDtcblxuICBjb25zdHJ1Y3Rvcihhc3NlbWJseTogQ2xvdWRBc3NlbWJseSwgbmFtZTogc3RyaW5nLCBhcnRpZmFjdDogY3hzY2hlbWEuQXJ0aWZhY3RNYW5pZmVzdCkge1xuICAgIHN1cGVyKGFzc2VtYmx5LCBuYW1lLCBhcnRpZmFjdCk7XG5cbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gKHRoaXMubWFuaWZlc3QucHJvcGVydGllcyB8fCB7fSkgYXMgY3hzY2hlbWEuQXNzZXRNYW5pZmVzdFByb3BlcnRpZXM7XG4gICAgaWYgKCFwcm9wZXJ0aWVzLmZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBBc3NldE1hbmlmZXN0QXJ0aWZhY3QuIE1pc3NpbmcgXCJmaWxlXCIgcHJvcGVydHknKTtcbiAgICB9XG4gICAgdGhpcy5maWxlID0gcGF0aC5yZXNvbHZlKHRoaXMuYXNzZW1ibHkuZGlyZWN0b3J5LCBwcm9wZXJ0aWVzLmZpbGUpO1xuICAgIHRoaXMucmVxdWlyZXNCb290c3RyYXBTdGFja1ZlcnNpb24gPSBwcm9wZXJ0aWVzLnJlcXVpcmVzQm9vdHN0cmFwU3RhY2tWZXJzaW9uO1xuICAgIHRoaXMuYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyID0gcHJvcGVydGllcy5ib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXI7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFzc2V0IE1hbmlmZXN0IGNvbnRlbnRzXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbnRlbnRzKCk6IGN4c2NoZW1hLkFzc2V0TWFuaWZlc3Qge1xuICAgIGlmICh0aGlzLl9jb250ZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29udGVudHM7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGVudHMgPSB0aGlzLl9jb250ZW50cyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHRoaXMuZmlsZSwgJ3V0Zi04JykpO1xuICAgIHJldHVybiBjb250ZW50cztcbiAgfVxuXG59XG5cbi8qKlxuICogTWFyayBhbGwgaW5zdGFuY2VzIG9mICdBc3NldE1hbmlmZXN0QXJ0aWZhY3QnXG4gKlxuICogV2h5IG5vdCBwdXQgdGhpcyBpbiB0aGUgY29uc3RydWN0b3I/IEJlY2F1c2UgdGhpcyBpcyBhIGNsYXNzIHByb3BlcnR5LFxuICogbm90IGFuIGluc3RhbmNlIHByb3BlcnR5LiBJdCBhcHBsaWVzIHRvIGFsbCBpbnN0YW5jZXMgb2YgdGhlIGNsYXNzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQXNzZXRNYW5pZmVzdEFydGlmYWN0LnByb3RvdHlwZSwgQVNTRVRfTUFOSUZFU1RfQVJUSUZBQ1RfU1lNLCB7XG4gIHZhbHVlOiB0cnVlLFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgd3JpdGFibGU6IGZhbHNlLFxufSk7XG4iXX0=