"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpIntegration = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const integration_1 = require("../integration");
/**
 * You can integrate an API method with an HTTP endpoint using the HTTP proxy
 * integration or the HTTP custom integration,.
 *
 * With the proxy integration, the setup is simple. You only need to set the
 * HTTP method and the HTTP endpoint URI, according to the backend requirements,
 * if you are not concerned with content encoding or caching.
 *
 * With the custom integration, the setup is more involved. In addition to the
 * proxy integration setup steps, you need to specify how the incoming request
 * data is mapped to the integration request and how the resulting integration
 * response data is mapped to the method response.
 */
class HttpIntegration extends integration_1.Integration {
    constructor(url, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_HttpIntegrationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, HttpIntegration);
            }
            throw error;
        }
        const proxy = props.proxy ?? true;
        const method = props.httpMethod || 'GET';
        super({
            type: proxy ? integration_1.IntegrationType.HTTP_PROXY : integration_1.IntegrationType.HTTP,
            integrationHttpMethod: method,
            uri: url,
            options: props.options,
        });
    }
}
exports.HttpIntegration = HttpIntegration;
_a = JSII_RTTI_SYMBOL_1;
HttpIntegration[_a] = { fqn: "@aws-cdk/aws-apigateway.HttpIntegration", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQWtGO0FBeUJsRjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEseUJBQVc7SUFDOUMsWUFBWSxHQUFXLEVBQUUsUUFBOEIsRUFBRzs7Ozs7OytDQUQvQyxlQUFlOzs7O1FBRXhCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO1FBQ3pDLEtBQUssQ0FBQztZQUNKLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLDZCQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyw2QkFBZSxDQUFDLElBQUk7WUFDL0QscUJBQXFCLEVBQUUsTUFBTTtZQUM3QixHQUFHLEVBQUUsR0FBRztZQUNSLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztTQUN2QixDQUFDLENBQUM7S0FDSjs7QUFWSCwwQ0FXQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEludGVncmF0aW9uLCBJbnRlZ3JhdGlvbk9wdGlvbnMsIEludGVncmF0aW9uVHlwZSB9IGZyb20gJy4uL2ludGVncmF0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBIdHRwSW50ZWdyYXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gdXNlIHByb3h5IGludGVncmF0aW9uIG9yIGN1c3RvbSBpbnRlZ3JhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJveHk/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBIVFRQIG1ldGhvZCB0byB1c2Ugd2hlbiBpbnZva2luZyB0aGUgYmFja2VuZCBVUkwuXG4gICAqIEBkZWZhdWx0IEdFVFxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cE1ldGhvZD86IHN0cmluZztcblxuICAvKipcbiAgICogSW50ZWdyYXRpb24gb3B0aW9ucywgc3VjaCBhcyByZXF1ZXN0L3Jlc29wbnNlIG1hcHBpbmcsIGNvbnRlbnQgaGFuZGxpbmcsXG4gICAqIGV0Yy5cbiAgICpcbiAgICogQGRlZmF1bHQgZGVmYXVsdHMgYmFzZWQgb24gYEludGVncmF0aW9uT3B0aW9uc2AgZGVmYXVsdHNcbiAgICovXG4gIHJlYWRvbmx5IG9wdGlvbnM/OiBJbnRlZ3JhdGlvbk9wdGlvbnM7XG59XG5cbi8qKlxuICogWW91IGNhbiBpbnRlZ3JhdGUgYW4gQVBJIG1ldGhvZCB3aXRoIGFuIEhUVFAgZW5kcG9pbnQgdXNpbmcgdGhlIEhUVFAgcHJveHlcbiAqIGludGVncmF0aW9uIG9yIHRoZSBIVFRQIGN1c3RvbSBpbnRlZ3JhdGlvbiwuXG4gKlxuICogV2l0aCB0aGUgcHJveHkgaW50ZWdyYXRpb24sIHRoZSBzZXR1cCBpcyBzaW1wbGUuIFlvdSBvbmx5IG5lZWQgdG8gc2V0IHRoZVxuICogSFRUUCBtZXRob2QgYW5kIHRoZSBIVFRQIGVuZHBvaW50IFVSSSwgYWNjb3JkaW5nIHRvIHRoZSBiYWNrZW5kIHJlcXVpcmVtZW50cyxcbiAqIGlmIHlvdSBhcmUgbm90IGNvbmNlcm5lZCB3aXRoIGNvbnRlbnQgZW5jb2Rpbmcgb3IgY2FjaGluZy5cbiAqXG4gKiBXaXRoIHRoZSBjdXN0b20gaW50ZWdyYXRpb24sIHRoZSBzZXR1cCBpcyBtb3JlIGludm9sdmVkLiBJbiBhZGRpdGlvbiB0byB0aGVcbiAqIHByb3h5IGludGVncmF0aW9uIHNldHVwIHN0ZXBzLCB5b3UgbmVlZCB0byBzcGVjaWZ5IGhvdyB0aGUgaW5jb21pbmcgcmVxdWVzdFxuICogZGF0YSBpcyBtYXBwZWQgdG8gdGhlIGludGVncmF0aW9uIHJlcXVlc3QgYW5kIGhvdyB0aGUgcmVzdWx0aW5nIGludGVncmF0aW9uXG4gKiByZXNwb25zZSBkYXRhIGlzIG1hcHBlZCB0byB0aGUgbWV0aG9kIHJlc3BvbnNlLlxuICovXG5leHBvcnQgY2xhc3MgSHR0cEludGVncmF0aW9uIGV4dGVuZHMgSW50ZWdyYXRpb24ge1xuICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgcHJvcHM6IEh0dHBJbnRlZ3JhdGlvblByb3BzID0geyB9KSB7XG4gICAgY29uc3QgcHJveHkgPSBwcm9wcy5wcm94eSA/PyB0cnVlO1xuICAgIGNvbnN0IG1ldGhvZCA9IHByb3BzLmh0dHBNZXRob2QgfHwgJ0dFVCc7XG4gICAgc3VwZXIoe1xuICAgICAgdHlwZTogcHJveHkgPyBJbnRlZ3JhdGlvblR5cGUuSFRUUF9QUk9YWSA6IEludGVncmF0aW9uVHlwZS5IVFRQLFxuICAgICAgaW50ZWdyYXRpb25IdHRwTWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmk6IHVybCxcbiAgICAgIG9wdGlvbnM6IHByb3BzLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==