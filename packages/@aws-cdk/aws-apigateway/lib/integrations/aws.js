"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsIntegration = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const integration_1 = require("../integration");
const util_1 = require("../util");
/**
 * This type of integration lets an API expose AWS service actions. It is
 * intended for calling all AWS service actions, but is not recommended for
 * calling a Lambda function, because the Lambda custom integration is a legacy
 * technology.
 */
class AwsIntegration extends integration_1.Integration {
    constructor(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_AwsIntegrationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AwsIntegration);
            }
            throw error;
        }
        const backend = props.subdomain ? `${props.subdomain}.${props.service}` : props.service;
        const type = props.proxy ? integration_1.IntegrationType.AWS_PROXY : integration_1.IntegrationType.AWS;
        const { apiType, apiValue } = util_1.parseAwsApiCall(props.path, props.action, props.actionParameters);
        super({
            type,
            integrationHttpMethod: props.integrationHttpMethod || 'POST',
            uri: cdk.Lazy.string({
                produce: () => {
                    if (!this.scope) {
                        throw new Error('AwsIntegration must be used in API');
                    }
                    return cdk.Stack.of(this.scope).formatArn({
                        service: 'apigateway',
                        account: backend,
                        resource: apiType,
                        arnFormat: core_1.ArnFormat.SLASH_RESOURCE_NAME,
                        resourceName: apiValue,
                        region: props.region,
                    });
                },
            }),
            options: props.options,
        });
    }
    bind(method) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_Method(method);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        const bindResult = super.bind(method);
        this.scope = method;
        return bindResult;
    }
}
exports.AwsIntegration = AwsIntegration;
_a = JSII_RTTI_SYMBOL_1;
AwsIntegration[_a] = { fqn: "@aws-cdk/aws-apigateway.AwsIntegration", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyx3Q0FBMEM7QUFFMUMsZ0RBQXFHO0FBRXJHLGtDQUEwQztBQW9FMUM7Ozs7O0dBS0c7QUFDSCxNQUFhLGNBQWUsU0FBUSx5QkFBVztJQUc3QyxZQUFZLEtBQTBCOzs7Ozs7K0NBSDNCLGNBQWM7Ozs7UUFJdkIsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUN4RixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw2QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsNkJBQWUsQ0FBQyxHQUFHLENBQUM7UUFDM0UsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxzQkFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNoRyxLQUFLLENBQUM7WUFDSixJQUFJO1lBQ0oscUJBQXFCLEVBQUUsS0FBSyxDQUFDLHFCQUFxQixJQUFJLE1BQU07WUFDNUQsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztxQkFBRTtvQkFDM0UsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDO3dCQUN4QyxPQUFPLEVBQUUsWUFBWTt3QkFDckIsT0FBTyxFQUFFLE9BQU87d0JBQ2hCLFFBQVEsRUFBRSxPQUFPO3dCQUNqQixTQUFTLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUI7d0JBQ3hDLFlBQVksRUFBRSxRQUFRO3dCQUN0QixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07cUJBQ3JCLENBQUMsQ0FBQztnQkFDTCxDQUFDO2FBQ0YsQ0FBQztZQUNGLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztTQUN2QixDQUFDLENBQUM7S0FDSjtJQUVNLElBQUksQ0FBQyxNQUFjOzs7Ozs7Ozs7O1FBQ3hCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDcEIsT0FBTyxVQUFVLENBQUM7S0FDbkI7O0FBL0JILHdDQWdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEFybkZvcm1hdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSW50ZWdyYXRpb24sIEludGVncmF0aW9uQ29uZmlnLCBJbnRlZ3JhdGlvbk9wdGlvbnMsIEludGVncmF0aW9uVHlwZSB9IGZyb20gJy4uL2ludGVncmF0aW9uJztcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gJy4uL21ldGhvZCc7XG5pbXBvcnQgeyBwYXJzZUF3c0FwaUNhbGwgfSBmcm9tICcuLi91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBBd3NJbnRlZ3JhdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFVzZSBBV1NfUFJPWFkgaW50ZWdyYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwcm94eT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBpbnRlZ3JhdGVkIEFXUyBzZXJ2aWNlIChlLmcuIGBzM2ApXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZGVzaWduYXRlZCBzdWJkb21haW4gc3VwcG9ydGVkIGJ5IGNlcnRhaW4gQVdTIHNlcnZpY2UgZm9yIGZhc3RcbiAgICogaG9zdC1uYW1lIGxvb2t1cC5cbiAgICovXG4gIHJlYWRvbmx5IHN1YmRvbWFpbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBhdGggdG8gdXNlIGZvciBwYXRoLWJhc2UgQVBJcy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGZvciBTMyBHRVQsIHlvdSBjYW4gc2V0IHBhdGggdG8gYGJ1Y2tldC9rZXlgLlxuICAgKiBGb3IgbGFtYmRhLCB5b3UgY2FuIHNldCBwYXRoIHRvIGAyMDE1LTAzLTMxL2Z1bmN0aW9ucy8ke2Z1bmN0aW9uLWFybn0vaW52b2NhdGlvbnNgXG4gICAqXG4gICAqIE11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIHRoZSBgYWN0aW9uYCBvcHRpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFXUyBhY3Rpb24gdG8gcGVyZm9ybSBpbiB0aGUgaW50ZWdyYXRpb24uXG4gICAqXG4gICAqIFVzZSBgYWN0aW9uUGFyYW1zYCB0byBzcGVjaWZ5IGtleS12YWx1ZSBwYXJhbXMgZm9yIHRoZSBhY3Rpb24uXG4gICAqXG4gICAqIE11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIGBwYXRoYC5cbiAgICovXG4gIHJlYWRvbmx5IGFjdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogUGFyYW1ldGVycyBmb3IgdGhlIGFjdGlvbi5cbiAgICpcbiAgICogYGFjdGlvbmAgbXVzdCBiZSBzZXQsIGFuZCBgcGF0aGAgbXVzdCBiZSB1bmRlZmluZWQuXG4gICAqIFRoZSBhY3Rpb24gcGFyYW1zIHdpbGwgYmUgVVJMIGVuY29kZWQuXG4gICAqL1xuICByZWFkb25seSBhY3Rpb25QYXJhbWV0ZXJzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogVGhlIGludGVncmF0aW9uJ3MgSFRUUCBtZXRob2QgdHlwZS5cbiAgICpcbiAgICogQGRlZmF1bHQgUE9TVFxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZWdyYXRpb25IdHRwTWV0aG9kPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbnRlZ3JhdGlvbiBvcHRpb25zLCBzdWNoIGFzIGNvbnRlbnQgaGFuZGxpbmcsIHJlcXVlc3QvcmVzcG9uc2UgbWFwcGluZywgZXRjLlxuICAgKi9cbiAgcmVhZG9ubHkgb3B0aW9ucz86IEludGVncmF0aW9uT3B0aW9uc1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uIG9mIHRoZSBpbnRlZ3JhdGVkIEFXUyBzZXJ2aWNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHNhbWUgcmVnaW9uIGFzIHRoZSBzdGFja1xuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoaXMgdHlwZSBvZiBpbnRlZ3JhdGlvbiBsZXRzIGFuIEFQSSBleHBvc2UgQVdTIHNlcnZpY2UgYWN0aW9ucy4gSXQgaXNcbiAqIGludGVuZGVkIGZvciBjYWxsaW5nIGFsbCBBV1Mgc2VydmljZSBhY3Rpb25zLCBidXQgaXMgbm90IHJlY29tbWVuZGVkIGZvclxuICogY2FsbGluZyBhIExhbWJkYSBmdW5jdGlvbiwgYmVjYXVzZSB0aGUgTGFtYmRhIGN1c3RvbSBpbnRlZ3JhdGlvbiBpcyBhIGxlZ2FjeVxuICogdGVjaG5vbG9neS5cbiAqL1xuZXhwb3J0IGNsYXNzIEF3c0ludGVncmF0aW9uIGV4dGVuZHMgSW50ZWdyYXRpb24ge1xuICBwcml2YXRlIHNjb3BlPzogSUNvbnN0cnVjdDtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogQXdzSW50ZWdyYXRpb25Qcm9wcykge1xuICAgIGNvbnN0IGJhY2tlbmQgPSBwcm9wcy5zdWJkb21haW4gPyBgJHtwcm9wcy5zdWJkb21haW59LiR7cHJvcHMuc2VydmljZX1gIDogcHJvcHMuc2VydmljZTtcbiAgICBjb25zdCB0eXBlID0gcHJvcHMucHJveHkgPyBJbnRlZ3JhdGlvblR5cGUuQVdTX1BST1hZIDogSW50ZWdyYXRpb25UeXBlLkFXUztcbiAgICBjb25zdCB7IGFwaVR5cGUsIGFwaVZhbHVlIH0gPSBwYXJzZUF3c0FwaUNhbGwocHJvcHMucGF0aCwgcHJvcHMuYWN0aW9uLCBwcm9wcy5hY3Rpb25QYXJhbWV0ZXJzKTtcbiAgICBzdXBlcih7XG4gICAgICB0eXBlLFxuICAgICAgaW50ZWdyYXRpb25IdHRwTWV0aG9kOiBwcm9wcy5pbnRlZ3JhdGlvbkh0dHBNZXRob2QgfHwgJ1BPU1QnLFxuICAgICAgdXJpOiBjZGsuTGF6eS5zdHJpbmcoe1xuICAgICAgICBwcm9kdWNlOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnNjb3BlKSB7IHRocm93IG5ldyBFcnJvcignQXdzSW50ZWdyYXRpb24gbXVzdCBiZSB1c2VkIGluIEFQSScpOyB9XG4gICAgICAgICAgcmV0dXJuIGNkay5TdGFjay5vZih0aGlzLnNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgICAgICAgc2VydmljZTogJ2FwaWdhdGV3YXknLFxuICAgICAgICAgICAgYWNjb3VudDogYmFja2VuZCxcbiAgICAgICAgICAgIHJlc291cmNlOiBhcGlUeXBlLFxuICAgICAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgICAgIHJlc291cmNlTmFtZTogYXBpVmFsdWUsXG4gICAgICAgICAgICByZWdpb246IHByb3BzLnJlZ2lvbixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgb3B0aW9uczogcHJvcHMub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKG1ldGhvZDogTWV0aG9kKTogSW50ZWdyYXRpb25Db25maWcge1xuICAgIGNvbnN0IGJpbmRSZXN1bHQgPSBzdXBlci5iaW5kKG1ldGhvZCk7XG4gICAgdGhpcy5zY29wZSA9IG1ldGhvZDtcbiAgICByZXR1cm4gYmluZFJlc3VsdDtcbiAgfVxufVxuIl19