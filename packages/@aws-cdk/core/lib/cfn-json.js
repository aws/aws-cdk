"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnJson = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const constructs_1 = require("constructs");
const custom_resource_1 = require("./custom-resource");
const cfn_utils_provider_1 = require("./private/cfn-utils-provider");
const stack_1 = require("./stack");
const stack_trace_1 = require("./stack-trace");
/**
 * Captures a synthesis-time JSON object a CloudFormation reference which
 * resolves during deployment to the resolved values of the JSON object.
 *
 * The main use case for this is to overcome a limitation in CloudFormation that
 * does not allow using intrinsic functions as dictionary keys (because
 * dictionary keys in JSON must be strings). Specifically this is common in IAM
 * conditions such as `StringEquals: { lhs: "rhs" }` where you want "lhs" to be
 * a reference.
 *
 * This object is resolvable, so it can be used as a value.
 *
 * This construct is backed by a custom resource.
 */
class CfnJson extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.creationStack = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnJsonProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnJson);
            }
            throw error;
        }
        this.creationStack = (0, stack_trace_1.captureStackTrace)();
        // stringify the JSON object in a token-aware way.
        this.jsonString = stack_1.Stack.of(this).toJsonString(props.value);
        const resource = new custom_resource_1.CustomResource(this, 'Resource', {
            serviceToken: cfn_utils_provider_1.CfnUtilsProvider.getOrCreate(this),
            resourceType: "Custom::AWSCDKCfnJson" /* CfnUtilsResourceType.CFN_JSON */,
            properties: {
                Value: this.jsonString,
            },
        });
        this.value = resource.getAtt('Value');
    }
    /**
     * This is required in case someone JSON.stringifys an object which refrences
     * this object. Otherwise, we'll get a cyclic JSON reference.
     */
    toJSON() {
        return this.jsonString;
    }
    resolve(_) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IResolveContext(_);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.resolve);
            }
            throw error;
        }
        return this.value;
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnJson[_a] = { fqn: "@aws-cdk/core.CfnJson", version: "0.0.0" };
exports.CfnJson = CfnJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQ0FBdUM7QUFDdkMsdURBQW1EO0FBQ25ELHFFQUFnRTtBQUloRSxtQ0FBZ0M7QUFDaEMsK0NBQWtEO0FBVWxEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFhLE9BQVEsU0FBUSxzQkFBUztJQWNwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1CO1FBQzNELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFkSCxrQkFBYSxHQUFhLEVBQUUsQ0FBQzs7Ozs7OytDQURsQyxPQUFPOzs7O1FBaUJoQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUEsK0JBQWlCLEdBQUUsQ0FBQztRQUV6QyxrREFBa0Q7UUFDbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsWUFBWSxFQUFFLHFDQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDaEQsWUFBWSw2REFBK0I7WUFDM0MsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVTthQUN2QjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN2QztJQUVEOzs7T0FHRztJQUNJLE1BQU07UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDeEI7SUFFTSxPQUFPLENBQUMsQ0FBa0I7Ozs7Ozs7Ozs7UUFDL0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7O0FBM0NVLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSB9IGZyb20gJy4vY3VzdG9tLXJlc291cmNlJztcbmltcG9ydCB7IENmblV0aWxzUHJvdmlkZXIgfSBmcm9tICcuL3ByaXZhdGUvY2ZuLXV0aWxzLXByb3ZpZGVyJztcbmltcG9ydCB7IENmblV0aWxzUmVzb3VyY2VUeXBlIH0gZnJvbSAnLi9wcml2YXRlL2Nmbi11dGlscy1wcm92aWRlci9jb25zdHMnO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHsgY2FwdHVyZVN0YWNrVHJhY2UgfSBmcm9tICcuL3N0YWNrLXRyYWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBDZm5Kc29uUHJvcHMge1xuICAvKipcbiAgICogVGhlIHZhbHVlIHRvIHJlc29sdmUuIENhbiBiZSBhbnkgSmF2YVNjcmlwdCBvYmplY3QsIGluY2x1ZGluZyB0b2tlbnMgYW5kXG4gICAqIHJlZmVyZW5jZXMgaW4ga2V5cyBvciB2YWx1ZXMuXG4gICAqL1xuICByZWFkb25seSB2YWx1ZTogYW55O1xufVxuXG4vKipcbiAqIENhcHR1cmVzIGEgc3ludGhlc2lzLXRpbWUgSlNPTiBvYmplY3QgYSBDbG91ZEZvcm1hdGlvbiByZWZlcmVuY2Ugd2hpY2hcbiAqIHJlc29sdmVzIGR1cmluZyBkZXBsb3ltZW50IHRvIHRoZSByZXNvbHZlZCB2YWx1ZXMgb2YgdGhlIEpTT04gb2JqZWN0LlxuICpcbiAqIFRoZSBtYWluIHVzZSBjYXNlIGZvciB0aGlzIGlzIHRvIG92ZXJjb21lIGEgbGltaXRhdGlvbiBpbiBDbG91ZEZvcm1hdGlvbiB0aGF0XG4gKiBkb2VzIG5vdCBhbGxvdyB1c2luZyBpbnRyaW5zaWMgZnVuY3Rpb25zIGFzIGRpY3Rpb25hcnkga2V5cyAoYmVjYXVzZVxuICogZGljdGlvbmFyeSBrZXlzIGluIEpTT04gbXVzdCBiZSBzdHJpbmdzKS4gU3BlY2lmaWNhbGx5IHRoaXMgaXMgY29tbW9uIGluIElBTVxuICogY29uZGl0aW9ucyBzdWNoIGFzIGBTdHJpbmdFcXVhbHM6IHsgbGhzOiBcInJoc1wiIH1gIHdoZXJlIHlvdSB3YW50IFwibGhzXCIgdG8gYmVcbiAqIGEgcmVmZXJlbmNlLlxuICpcbiAqIFRoaXMgb2JqZWN0IGlzIHJlc29sdmFibGUsIHNvIGl0IGNhbiBiZSB1c2VkIGFzIGEgdmFsdWUuXG4gKlxuICogVGhpcyBjb25zdHJ1Y3QgaXMgYmFja2VkIGJ5IGEgY3VzdG9tIHJlc291cmNlLlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuSnNvbiBleHRlbmRzIENvbnN0cnVjdCBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdID0gW107XG5cbiAgLyoqXG4gICAqIEFuIEZuOjpHZXRBdHQgdG8gdGhlIEpTT04gb2JqZWN0IHBhc3NlZCB0aHJvdWdoIGB2YWx1ZWAgYW5kIHJlc29sdmVkIGR1cmluZ1xuICAgKiBzeW50aGVzaXMuXG4gICAqXG4gICAqIE5vcm1hbGx5IHRoZXJlIGlzIG5vIG5lZWQgdG8gdXNlIHRoaXMgcHJvcGVydHkgc2luY2UgYENmbkpzb25gIGlzIGFuXG4gICAqIElSZXNvbHZhYmxlLCBzbyBpdCBjYW4gYmUgc2ltcGx5IHVzZWQgYXMgYSB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZTogUmVmZXJlbmNlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkganNvblN0cmluZzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5Kc29uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5jcmVhdGlvblN0YWNrID0gY2FwdHVyZVN0YWNrVHJhY2UoKTtcblxuICAgIC8vIHN0cmluZ2lmeSB0aGUgSlNPTiBvYmplY3QgaW4gYSB0b2tlbi1hd2FyZSB3YXkuXG4gICAgdGhpcy5qc29uU3RyaW5nID0gU3RhY2sub2YodGhpcykudG9Kc29uU3RyaW5nKHByb3BzLnZhbHVlKTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogQ2ZuVXRpbHNQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzKSxcbiAgICAgIHJlc291cmNlVHlwZTogQ2ZuVXRpbHNSZXNvdXJjZVR5cGUuQ0ZOX0pTT04sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFZhbHVlOiB0aGlzLmpzb25TdHJpbmcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy52YWx1ZSA9IHJlc291cmNlLmdldEF0dCgnVmFsdWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHJlcXVpcmVkIGluIGNhc2Ugc29tZW9uZSBKU09OLnN0cmluZ2lmeXMgYW4gb2JqZWN0IHdoaWNoIHJlZnJlbmNlc1xuICAgKiB0aGlzIG9iamVjdC4gT3RoZXJ3aXNlLCB3ZSdsbCBnZXQgYSBjeWNsaWMgSlNPTiByZWZlcmVuY2UuXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLmpzb25TdHJpbmc7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShfOiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG59XG4iXX0=