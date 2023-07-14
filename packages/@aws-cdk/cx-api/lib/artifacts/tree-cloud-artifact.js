"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeCloudArtifact = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloud_artifact_1 = require("../cloud-artifact");
const TREE_CLOUD_ARTIFACT_SYM = Symbol.for('@aws-cdk/cx-api.TreeCloudArtifact');
class TreeCloudArtifact extends cloud_artifact_1.CloudArtifact {
    /**
     * Checks if `art` is an instance of this class.
     *
     * Use this method instead of `instanceof` to properly detect `TreeCloudArtifact`
     * instances, even when the construct library is symlinked.
     *
     * Explanation: in JavaScript, multiple copies of the `cx-api` library on
     * disk are seen as independent, completely different libraries. As a
     * consequence, the class `TreeCloudArtifact` in each copy of the `cx-api` library
     * is seen as a different class, and an instance of one class will not test as
     * `instanceof` the other class. `npm install` will not create installations
     * like this, but users may manually symlink construct libraries together or
     * use a monorepo tool: in those cases, multiple copies of the `cx-api`
     * library can be accidentally installed, and `instanceof` will behave
     * unpredictably. It is safest to avoid using `instanceof`, and using
     * this type-testing method instead.
     */
    static isTreeCloudArtifact(art) {
        return art && typeof art === 'object' && art[TREE_CLOUD_ARTIFACT_SYM];
    }
    constructor(assembly, name, artifact) {
        super(assembly, name, artifact);
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_CloudAssembly(assembly);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TreeCloudArtifact);
            }
            throw error;
        }
        const properties = (this.manifest.properties || {});
        if (!properties.file) {
            throw new Error('Invalid TreeCloudArtifact. Missing "file" property');
        }
        this.file = properties.file;
    }
}
_a = JSII_RTTI_SYMBOL_1;
TreeCloudArtifact[_a] = { fqn: "@aws-cdk/cx-api.TreeCloudArtifact", version: "0.0.0" };
exports.TreeCloudArtifact = TreeCloudArtifact;
/**
 * Mark all instances of 'TreeCloudArtifact'
 *
 * Why not put this in the constructor? Because this is a class property,
 * not an instance property. It applies to all instances of the class.
 */
Object.defineProperty(TreeCloudArtifact.prototype, TREE_CLOUD_ARTIFACT_SYM, {
    value: true,
    enumerable: false,
    writable: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1jbG91ZC1hcnRpZmFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUtY2xvdWQtYXJ0aWZhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esc0RBQWtEO0FBR2xELE1BQU0sdUJBQXVCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBRWhGLE1BQWEsaUJBQWtCLFNBQVEsOEJBQWE7SUFDbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsR0FBUTtRQUN4QyxPQUFPLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDdkU7SUFJRCxZQUFZLFFBQXVCLEVBQUUsSUFBWSxFQUFFLFFBQW1DO1FBQ3BGLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7K0NBekJ2QixpQkFBaUI7Ozs7UUEyQjFCLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFvQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN2RTtRQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztLQUM3Qjs7OztBQWhDVSw4Q0FBaUI7QUFtQzlCOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLEVBQUU7SUFDMUUsS0FBSyxFQUFFLElBQUk7SUFDWCxVQUFVLEVBQUUsS0FBSztJQUNqQixRQUFRLEVBQUUsS0FBSztDQUNoQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQ2xvdWRBcnRpZmFjdCB9IGZyb20gJy4uL2Nsb3VkLWFydGlmYWN0JztcbmltcG9ydCB7IENsb3VkQXNzZW1ibHkgfSBmcm9tICcuLi9jbG91ZC1hc3NlbWJseSc7XG5cbmNvbnN0IFRSRUVfQ0xPVURfQVJUSUZBQ1RfU1lNID0gU3ltYm9sLmZvcignQGF3cy1jZGsvY3gtYXBpLlRyZWVDbG91ZEFydGlmYWN0Jyk7XG5cbmV4cG9ydCBjbGFzcyBUcmVlQ2xvdWRBcnRpZmFjdCBleHRlbmRzIENsb3VkQXJ0aWZhY3Qge1xuICAvKipcbiAgICogQ2hlY2tzIGlmIGBhcnRgIGlzIGFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3MuXG4gICAqXG4gICAqIFVzZSB0aGlzIG1ldGhvZCBpbnN0ZWFkIG9mIGBpbnN0YW5jZW9mYCB0byBwcm9wZXJseSBkZXRlY3QgYFRyZWVDbG91ZEFydGlmYWN0YFxuICAgKiBpbnN0YW5jZXMsIGV2ZW4gd2hlbiB0aGUgY29uc3RydWN0IGxpYnJhcnkgaXMgc3ltbGlua2VkLlxuICAgKlxuICAgKiBFeHBsYW5hdGlvbjogaW4gSmF2YVNjcmlwdCwgbXVsdGlwbGUgY29waWVzIG9mIHRoZSBgY3gtYXBpYCBsaWJyYXJ5IG9uXG4gICAqIGRpc2sgYXJlIHNlZW4gYXMgaW5kZXBlbmRlbnQsIGNvbXBsZXRlbHkgZGlmZmVyZW50IGxpYnJhcmllcy4gQXMgYVxuICAgKiBjb25zZXF1ZW5jZSwgdGhlIGNsYXNzIGBUcmVlQ2xvdWRBcnRpZmFjdGAgaW4gZWFjaCBjb3B5IG9mIHRoZSBgY3gtYXBpYCBsaWJyYXJ5XG4gICAqIGlzIHNlZW4gYXMgYSBkaWZmZXJlbnQgY2xhc3MsIGFuZCBhbiBpbnN0YW5jZSBvZiBvbmUgY2xhc3Mgd2lsbCBub3QgdGVzdCBhc1xuICAgKiBgaW5zdGFuY2VvZmAgdGhlIG90aGVyIGNsYXNzLiBgbnBtIGluc3RhbGxgIHdpbGwgbm90IGNyZWF0ZSBpbnN0YWxsYXRpb25zXG4gICAqIGxpa2UgdGhpcywgYnV0IHVzZXJzIG1heSBtYW51YWxseSBzeW1saW5rIGNvbnN0cnVjdCBsaWJyYXJpZXMgdG9nZXRoZXIgb3JcbiAgICogdXNlIGEgbW9ub3JlcG8gdG9vbDogaW4gdGhvc2UgY2FzZXMsIG11bHRpcGxlIGNvcGllcyBvZiB0aGUgYGN4LWFwaWBcbiAgICogbGlicmFyeSBjYW4gYmUgYWNjaWRlbnRhbGx5IGluc3RhbGxlZCwgYW5kIGBpbnN0YW5jZW9mYCB3aWxsIGJlaGF2ZVxuICAgKiB1bnByZWRpY3RhYmx5LiBJdCBpcyBzYWZlc3QgdG8gYXZvaWQgdXNpbmcgYGluc3RhbmNlb2ZgLCBhbmQgdXNpbmdcbiAgICogdGhpcyB0eXBlLXRlc3RpbmcgbWV0aG9kIGluc3RlYWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzVHJlZUNsb3VkQXJ0aWZhY3QoYXJ0OiBhbnkpOiBhcnQgaXMgVHJlZUNsb3VkQXJ0aWZhY3Qge1xuICAgIHJldHVybiBhcnQgJiYgdHlwZW9mIGFydCA9PT0gJ29iamVjdCcgJiYgYXJ0W1RSRUVfQ0xPVURfQVJUSUZBQ1RfU1lNXTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBmaWxlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoYXNzZW1ibHk6IENsb3VkQXNzZW1ibHksIG5hbWU6IHN0cmluZywgYXJ0aWZhY3Q6IGN4c2NoZW1hLkFydGlmYWN0TWFuaWZlc3QpIHtcbiAgICBzdXBlcihhc3NlbWJseSwgbmFtZSwgYXJ0aWZhY3QpO1xuXG4gICAgY29uc3QgcHJvcGVydGllcyA9ICh0aGlzLm1hbmlmZXN0LnByb3BlcnRpZXMgfHwge30pIGFzIGN4c2NoZW1hLlRyZWVBcnRpZmFjdFByb3BlcnRpZXM7XG4gICAgaWYgKCFwcm9wZXJ0aWVzLmZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUcmVlQ2xvdWRBcnRpZmFjdC4gTWlzc2luZyBcImZpbGVcIiBwcm9wZXJ0eScpO1xuICAgIH1cbiAgICB0aGlzLmZpbGUgPSBwcm9wZXJ0aWVzLmZpbGU7XG4gIH1cbn1cblxuLyoqXG4gKiBNYXJrIGFsbCBpbnN0YW5jZXMgb2YgJ1RyZWVDbG91ZEFydGlmYWN0J1xuICpcbiAqIFdoeSBub3QgcHV0IHRoaXMgaW4gdGhlIGNvbnN0cnVjdG9yPyBCZWNhdXNlIHRoaXMgaXMgYSBjbGFzcyBwcm9wZXJ0eSxcbiAqIG5vdCBhbiBpbnN0YW5jZSBwcm9wZXJ0eS4gSXQgYXBwbGllcyB0byBhbGwgaW5zdGFuY2VzIG9mIHRoZSBjbGFzcy5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyZWVDbG91ZEFydGlmYWN0LnByb3RvdHlwZSwgVFJFRV9DTE9VRF9BUlRJRkFDVF9TWU0sIHtcbiAgdmFsdWU6IHRydWUsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG59KTsiXX0=