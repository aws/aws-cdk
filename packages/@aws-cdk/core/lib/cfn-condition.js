"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnCondition = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_element_1 = require("./cfn-element");
/**
 * Represents a CloudFormation condition, for resources which must be conditionally created and
 * the determination must be made at deploy time.
 */
class CfnCondition extends cfn_element_1.CfnElement {
    /**
     * Build a new condition. The condition must be constructed with a condition token,
     * that the condition is based on.
     */
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnConditionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnCondition);
            }
            throw error;
        }
        this.expression = props && props.expression;
    }
    /**
     * @internal
     */
    _toCloudFormation() {
        if (!this.expression) {
            return {};
        }
        return {
            Conditions: {
                [this.logicalId]: this.expression,
            },
        };
    }
    /**
     * Synthesizes the condition.
     */
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
        return { Condition: this.logicalId };
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnCondition[_a] = { fqn: "@aws-cdk/core.CfnCondition", version: "0.0.0" };
exports.CfnCondition = CfnCondition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWNvbmRpdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1jb25kaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsK0NBQTJDO0FBWTNDOzs7R0FHRztBQUNILE1BQWEsWUFBYSxTQUFRLHdCQUFVO0lBTTFDOzs7T0FHRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQVhSLFlBQVk7Ozs7UUFZckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUM3QztJQUVEOztPQUVHO0lBQ0ksaUJBQWlCO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLE9BQU8sRUFBRyxDQUFDO1NBQ1o7UUFFRCxPQUFPO1lBQ0wsVUFBVSxFQUFFO2dCQUNWLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVO2FBQ2xDO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7O09BRUc7SUFDSSxPQUFPLENBQUMsUUFBeUI7Ozs7Ozs7Ozs7UUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDdEM7Ozs7QUFuQ1Usb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkVsZW1lbnQgfSBmcm9tICcuL2Nmbi1lbGVtZW50JztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENmbkNvbmRpdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBleHByZXNzaW9uIHRoYXQgdGhlIGNvbmRpdGlvbiB3aWxsIGV2YWx1YXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBleHByZXNzaW9uPzogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb247XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIENsb3VkRm9ybWF0aW9uIGNvbmRpdGlvbiwgZm9yIHJlc291cmNlcyB3aGljaCBtdXN0IGJlIGNvbmRpdGlvbmFsbHkgY3JlYXRlZCBhbmRcbiAqIHRoZSBkZXRlcm1pbmF0aW9uIG11c3QgYmUgbWFkZSBhdCBkZXBsb3kgdGltZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENmbkNvbmRpdGlvbiBleHRlbmRzIENmbkVsZW1lbnQgaW1wbGVtZW50cyBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbiwgSVJlc29sdmFibGUge1xuICAvKipcbiAgICogVGhlIGNvbmRpdGlvbiBzdGF0ZW1lbnQuXG4gICAqL1xuICBwdWJsaWMgZXhwcmVzc2lvbj86IElDZm5Db25kaXRpb25FeHByZXNzaW9uO1xuXG4gIC8qKlxuICAgKiBCdWlsZCBhIG5ldyBjb25kaXRpb24uIFRoZSBjb25kaXRpb24gbXVzdCBiZSBjb25zdHJ1Y3RlZCB3aXRoIGEgY29uZGl0aW9uIHRva2VuLFxuICAgKiB0aGF0IHRoZSBjb25kaXRpb24gaXMgYmFzZWQgb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IENmbkNvbmRpdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICB0aGlzLmV4cHJlc3Npb24gPSBwcm9wcyAmJiBwcm9wcy5leHByZXNzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCk6IG9iamVjdCB7XG4gICAgaWYgKCF0aGlzLmV4cHJlc3Npb24pIHtcbiAgICAgIHJldHVybiB7IH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIENvbmRpdGlvbnM6IHtcbiAgICAgICAgW3RoaXMubG9naWNhbElkXTogdGhpcy5leHByZXNzaW9uLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bnRoZXNpemVzIHRoZSBjb25kaXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVzb2x2ZShfY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICByZXR1cm4geyBDb25kaXRpb246IHRoaXMubG9naWNhbElkIH07XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ2xvdWRGb3JtYXRpb24gZWxlbWVudCB0aGF0IGNhbiBiZSB1c2VkIHdpdGhpbiBhIENvbmRpdGlvbi5cbiAqXG4gKiBZb3UgY2FuIHVzZSBpbnRyaW5zaWMgZnVuY3Rpb25zLCBzdWNoIGFzIGBgRm4uY29uZGl0aW9uSWZgYCxcbiAqIGBgRm4uY29uZGl0aW9uRXF1YWxzYGAsIGFuZCBgYEZuLmNvbmRpdGlvbk5vdGBgLCB0byBjb25kaXRpb25hbGx5IGNyZWF0ZVxuICogc3RhY2sgcmVzb3VyY2VzLiBUaGVzZSBjb25kaXRpb25zIGFyZSBldmFsdWF0ZWQgYmFzZWQgb24gaW5wdXQgcGFyYW1ldGVyc1xuICogdGhhdCB5b3UgZGVjbGFyZSB3aGVuIHlvdSBjcmVhdGUgb3IgdXBkYXRlIGEgc3RhY2suIEFmdGVyIHlvdSBkZWZpbmUgYWxsIHlvdXJcbiAqIGNvbmRpdGlvbnMsIHlvdSBjYW4gYXNzb2NpYXRlIHRoZW0gd2l0aCByZXNvdXJjZXMgb3IgcmVzb3VyY2UgcHJvcGVydGllcyBpblxuICogdGhlIFJlc291cmNlcyBhbmQgT3V0cHV0cyBzZWN0aW9ucyBvZiBhIHRlbXBsYXRlLlxuICpcbiAqIFlvdSBkZWZpbmUgYWxsIGNvbmRpdGlvbnMgaW4gdGhlIENvbmRpdGlvbnMgc2VjdGlvbiBvZiBhIHRlbXBsYXRlIGV4Y2VwdCBmb3JcbiAqIGBgRm4uY29uZGl0aW9uSWZgYCBjb25kaXRpb25zLiBZb3UgY2FuIHVzZSB0aGUgYGBGbi5jb25kaXRpb25JZmBgIGNvbmRpdGlvblxuICogaW4gdGhlIG1ldGFkYXRhIGF0dHJpYnV0ZSwgdXBkYXRlIHBvbGljeSBhdHRyaWJ1dGUsIGFuZCBwcm9wZXJ0eSB2YWx1ZXMgaW5cbiAqIHRoZSBSZXNvdXJjZXMgc2VjdGlvbiBhbmQgT3V0cHV0cyBzZWN0aW9ucyBvZiBhIHRlbXBsYXRlLlxuICpcbiAqIFlvdSBtaWdodCB1c2UgY29uZGl0aW9ucyB3aGVuIHlvdSB3YW50IHRvIHJldXNlIGEgdGVtcGxhdGUgdGhhdCBjYW4gY3JlYXRlXG4gKiByZXNvdXJjZXMgaW4gZGlmZmVyZW50IGNvbnRleHRzLCBzdWNoIGFzIGEgdGVzdCBlbnZpcm9ubWVudCB2ZXJzdXMgYVxuICogcHJvZHVjdGlvbiBlbnZpcm9ubWVudC4gSW4geW91ciB0ZW1wbGF0ZSwgeW91IGNhbiBhZGQgYW4gRW52aXJvbm1lbnRUeXBlXG4gKiBpbnB1dCBwYXJhbWV0ZXIsIHdoaWNoIGFjY2VwdHMgZWl0aGVyIHByb2Qgb3IgdGVzdCBhcyBpbnB1dHMuIEZvciB0aGVcbiAqIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQsIHlvdSBtaWdodCBpbmNsdWRlIEFtYXpvbiBFQzIgaW5zdGFuY2VzIHdpdGggY2VydGFpblxuICogY2FwYWJpbGl0aWVzOyBob3dldmVyLCBmb3IgdGhlIHRlc3QgZW52aXJvbm1lbnQsIHlvdSB3YW50IHRvIHVzZSBsZXNzXG4gKiBjYXBhYmlsaXRpZXMgdG8gc2F2ZSBjb3N0cy4gV2l0aCBjb25kaXRpb25zLCB5b3UgY2FuIGRlZmluZSB3aGljaCByZXNvdXJjZXNcbiAqIGFyZSBjcmVhdGVkIGFuZCBob3cgdGhleSdyZSBjb25maWd1cmVkIGZvciBlYWNoIGVudmlyb25tZW50IHR5cGUuXG4gKlxuICogWW91IGNhbiB1c2UgYHRvU3RyaW5nYCB3aGVuIHlvdSB3aXNoIHRvIGVtYmVkIGEgY29uZGl0aW9uIGV4cHJlc3Npb25cbiAqIGluIGEgcHJvcGVydHkgdmFsdWUgdGhhdCBhY2NlcHRzIGEgYHN0cmluZ2AuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiBuZXcgc3FzLlF1ZXVlKHRoaXMsICdNeVF1ZXVlJywge1xuICogICBxdWV1ZU5hbWU6IEZuLmNvbmRpdGlvbklmKCdDb25kaXRpb24nLCAnSGVsbG8nLCAnV29ybGQnKS50b1N0cmluZygpXG4gKiB9KTtcbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElDZm5Db25kaXRpb25FeHByZXNzaW9uIGV4dGVuZHMgSVJlc29sdmFibGUge31cblxuLyoqXG4gKiBJbnRlcmZhY2UgdG8gc3BlY2lmeSBjZXJ0YWluIGZ1bmN0aW9ucyBhcyBTZXJ2aWNlIENhdGFsb2cgcnVsZS1zcGVjaWZjLlxuICogVGhlc2UgZnVuY3Rpb25zIGNhbiBvbmx5IGJlIHVzZWQgaW4gYGBSdWxlc2BgIHNlY3Rpb24gb2YgdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIGV4dGVuZHMgSUNmbkNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAvKipcbiAgICogVGhpcyBmaWVsZCBpcyBvbmx5IG5lZWRlZCB0byBkZWZlYXQgVHlwZVNjcmlwdCdzIHN0cnVjdHVyYWwgdHlwaW5nLlxuICAgKiBJdCBpcyBuZXZlciB1c2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgZGlzYW1iaWd1YXRvcjogYm9vbGVhbjtcbn1cbiJdfQ==