"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedCloudAssemblyArtifact = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const cloud_artifact_1 = require("../cloud-artifact");
const NESTED_CLOUD_ASSEMBLY_SYM = Symbol.for('@aws-cdk/cx-api.NestedCloudAssemblyArtifact');
/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
class NestedCloudAssemblyArtifact extends cloud_artifact_1.CloudArtifact {
    /**
     * Checks if `art` is an instance of this class.
     *
     * Use this method instead of `instanceof` to properly detect `NestedCloudAssemblyArtifact`
     * instances, even when the construct library is symlinked.
     *
     * Explanation: in JavaScript, multiple copies of the `cx-api` library on
     * disk are seen as independent, completely different libraries. As a
     * consequence, the class `NestedCloudAssemblyArtifact` in each copy of the `cx-api` library
     * is seen as a different class, and an instance of one class will not test as
     * `instanceof` the other class. `npm install` will not create installations
     * like this, but users may manually symlink construct libraries together or
     * use a monorepo tool: in those cases, multiple copies of the `cx-api`
     * library can be accidentally installed, and `instanceof` will behave
     * unpredictably. It is safest to avoid using `instanceof`, and using
     * this type-testing method instead.
     */
    static isNestedCloudAssemblyArtifact(art) {
        return art && typeof art === 'object' && art[NESTED_CLOUD_ASSEMBLY_SYM];
    }
    constructor(assembly, name, artifact) {
        super(assembly, name, artifact);
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_CloudAssembly(assembly);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NestedCloudAssemblyArtifact);
            }
            throw error;
        }
        const properties = (this.manifest.properties || {});
        this.directoryName = properties.directoryName;
        this.displayName = properties.displayName ?? name;
    }
    /**
     * Full path to the nested assembly directory
     */
    get fullPath() {
        return path.join(this.assembly.directory, this.directoryName);
    }
}
_a = JSII_RTTI_SYMBOL_1;
NestedCloudAssemblyArtifact[_a] = { fqn: "@aws-cdk/cx-api.NestedCloudAssemblyArtifact", version: "0.0.0" };
exports.NestedCloudAssemblyArtifact = NestedCloudAssemblyArtifact;
/**
 * Mark all instances of 'NestedCloudAssemblyArtifact'
 *
 * Why not put this in the constructor? Because this is a class property,
 * not an instance property. It applies to all instances of the class.
 */
Object.defineProperty(NestedCloudAssemblyArtifact.prototype, NESTED_CLOUD_ASSEMBLY_SYM, {
    value: true,
    enumerable: false,
    writable: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLWNsb3VkLWFzc2VtYmx5LWFydGlmYWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmVzdGVkLWNsb3VkLWFzc2VtYmx5LWFydGlmYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDZCQUE2QjtBQUU3QixzREFBa0Q7QUFHbEQsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFFNUY7O0dBRUc7QUFDSCxNQUFhLDJCQUE0QixTQUFRLDhCQUFhO0lBQzVEOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0JHO0lBQ0ksTUFBTSxDQUFDLDZCQUE2QixDQUFDLEdBQVE7UUFDbEQsT0FBTyxHQUFHLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQ3pFO0lBWUQsWUFBWSxRQUF1QixFQUFFLElBQVksRUFBRSxRQUFtQztRQUNwRixLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzs7Ozs7OytDQWpDdkIsMkJBQTJCOzs7O1FBbUNwQyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBMkMsQ0FBQztRQUM5RixJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDOUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztLQUNuRDtJQUVEOztPQUVHO0lBQ0gsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDL0Q7Ozs7QUE3Q1Usa0VBQTJCO0FBeUR4Qzs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsMkJBQTJCLENBQUMsU0FBUyxFQUFFLHlCQUF5QixFQUFFO0lBQ3RGLEtBQUssRUFBRSxJQUFJO0lBQ1gsVUFBVSxFQUFFLEtBQUs7SUFDakIsUUFBUSxFQUFFLEtBQUs7Q0FDaEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBDbG91ZEFydGlmYWN0IH0gZnJvbSAnLi4vY2xvdWQtYXJ0aWZhY3QnO1xuaW1wb3J0IHR5cGUgeyBDbG91ZEFzc2VtYmx5IH0gZnJvbSAnLi4vY2xvdWQtYXNzZW1ibHknO1xuXG5jb25zdCBORVNURURfQ0xPVURfQVNTRU1CTFlfU1lNID0gU3ltYm9sLmZvcignQGF3cy1jZGsvY3gtYXBpLk5lc3RlZENsb3VkQXNzZW1ibHlBcnRpZmFjdCcpO1xuXG4vKipcbiAqIEFzc2V0IG1hbmlmZXN0IGlzIGEgZGVzY3JpcHRpb24gb2YgYSBzZXQgb2YgYXNzZXRzIHdoaWNoIG5lZWQgdG8gYmUgYnVpbHQgYW5kIHB1Ymxpc2hlZFxuICovXG5leHBvcnQgY2xhc3MgTmVzdGVkQ2xvdWRBc3NlbWJseUFydGlmYWN0IGV4dGVuZHMgQ2xvdWRBcnRpZmFjdCB7XG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYGFydGAgaXMgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcy5cbiAgICpcbiAgICogVXNlIHRoaXMgbWV0aG9kIGluc3RlYWQgb2YgYGluc3RhbmNlb2ZgIHRvIHByb3Blcmx5IGRldGVjdCBgTmVzdGVkQ2xvdWRBc3NlbWJseUFydGlmYWN0YFxuICAgKiBpbnN0YW5jZXMsIGV2ZW4gd2hlbiB0aGUgY29uc3RydWN0IGxpYnJhcnkgaXMgc3ltbGlua2VkLlxuICAgKlxuICAgKiBFeHBsYW5hdGlvbjogaW4gSmF2YVNjcmlwdCwgbXVsdGlwbGUgY29waWVzIG9mIHRoZSBgY3gtYXBpYCBsaWJyYXJ5IG9uXG4gICAqIGRpc2sgYXJlIHNlZW4gYXMgaW5kZXBlbmRlbnQsIGNvbXBsZXRlbHkgZGlmZmVyZW50IGxpYnJhcmllcy4gQXMgYVxuICAgKiBjb25zZXF1ZW5jZSwgdGhlIGNsYXNzIGBOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3RgIGluIGVhY2ggY29weSBvZiB0aGUgYGN4LWFwaWAgbGlicmFyeVxuICAgKiBpcyBzZWVuIGFzIGEgZGlmZmVyZW50IGNsYXNzLCBhbmQgYW4gaW5zdGFuY2Ugb2Ygb25lIGNsYXNzIHdpbGwgbm90IHRlc3QgYXNcbiAgICogYGluc3RhbmNlb2ZgIHRoZSBvdGhlciBjbGFzcy4gYG5wbSBpbnN0YWxsYCB3aWxsIG5vdCBjcmVhdGUgaW5zdGFsbGF0aW9uc1xuICAgKiBsaWtlIHRoaXMsIGJ1dCB1c2VycyBtYXkgbWFudWFsbHkgc3ltbGluayBjb25zdHJ1Y3QgbGlicmFyaWVzIHRvZ2V0aGVyIG9yXG4gICAqIHVzZSBhIG1vbm9yZXBvIHRvb2w6IGluIHRob3NlIGNhc2VzLCBtdWx0aXBsZSBjb3BpZXMgb2YgdGhlIGBjeC1hcGlgXG4gICAqIGxpYnJhcnkgY2FuIGJlIGFjY2lkZW50YWxseSBpbnN0YWxsZWQsIGFuZCBgaW5zdGFuY2VvZmAgd2lsbCBiZWhhdmVcbiAgICogdW5wcmVkaWN0YWJseS4gSXQgaXMgc2FmZXN0IHRvIGF2b2lkIHVzaW5nIGBpbnN0YW5jZW9mYCwgYW5kIHVzaW5nXG4gICAqIHRoaXMgdHlwZS10ZXN0aW5nIG1ldGhvZCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc05lc3RlZENsb3VkQXNzZW1ibHlBcnRpZmFjdChhcnQ6IGFueSk6IGFydCBpcyBOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3Qge1xuICAgIHJldHVybiBhcnQgJiYgdHlwZW9mIGFydCA9PT0gJ29iamVjdCcgJiYgYXJ0W05FU1RFRF9DTE9VRF9BU1NFTUJMWV9TWU1dO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZWxhdGl2ZSBkaXJlY3RvcnkgbmFtZSBvZiB0aGUgYXNzZXQgbWFuaWZlc3RcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkaXJlY3RvcnlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgbmFtZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRpc3BsYXlOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoYXNzZW1ibHk6IENsb3VkQXNzZW1ibHksIG5hbWU6IHN0cmluZywgYXJ0aWZhY3Q6IGN4c2NoZW1hLkFydGlmYWN0TWFuaWZlc3QpIHtcbiAgICBzdXBlcihhc3NlbWJseSwgbmFtZSwgYXJ0aWZhY3QpO1xuXG4gICAgY29uc3QgcHJvcGVydGllcyA9ICh0aGlzLm1hbmlmZXN0LnByb3BlcnRpZXMgfHwge30pIGFzIGN4c2NoZW1hLk5lc3RlZENsb3VkQXNzZW1ibHlQcm9wZXJ0aWVzO1xuICAgIHRoaXMuZGlyZWN0b3J5TmFtZSA9IHByb3BlcnRpZXMuZGlyZWN0b3J5TmFtZTtcbiAgICB0aGlzLmRpc3BsYXlOYW1lID0gcHJvcGVydGllcy5kaXNwbGF5TmFtZSA/PyBuYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bGwgcGF0aCB0byB0aGUgbmVzdGVkIGFzc2VtYmx5IGRpcmVjdG9yeVxuICAgKi9cbiAgcHVibGljIGdldCBmdWxsUGF0aCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5hc3NlbWJseS5kaXJlY3RvcnksIHRoaXMuZGlyZWN0b3J5TmFtZSk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3Qge1xuICAvKipcbiAgICogVGhlIG5lc3RlZCBBc3NlbWJseVxuICAgKi9cbiAgcmVhZG9ubHkgbmVzdGVkQXNzZW1ibHk6IENsb3VkQXNzZW1ibHk7XG5cbiAgLy8gRGVjbGFyZWQgaW4gYSBkaWZmZXJlbnQgZmlsZVxufVxuXG4vKipcbiAqIE1hcmsgYWxsIGluc3RhbmNlcyBvZiAnTmVzdGVkQ2xvdWRBc3NlbWJseUFydGlmYWN0J1xuICpcbiAqIFdoeSBub3QgcHV0IHRoaXMgaW4gdGhlIGNvbnN0cnVjdG9yPyBCZWNhdXNlIHRoaXMgaXMgYSBjbGFzcyBwcm9wZXJ0eSxcbiAqIG5vdCBhbiBpbnN0YW5jZSBwcm9wZXJ0eS4gSXQgYXBwbGllcyB0byBhbGwgaW5zdGFuY2VzIG9mIHRoZSBjbGFzcy5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KE5lc3RlZENsb3VkQXNzZW1ibHlBcnRpZmFjdC5wcm90b3R5cGUsIE5FU1RFRF9DTE9VRF9BU1NFTUJMWV9TWU0sIHtcbiAgdmFsdWU6IHRydWUsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG59KTsiXX0=