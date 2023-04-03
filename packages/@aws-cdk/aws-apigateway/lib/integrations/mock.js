"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockIntegration = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const integration_1 = require("../integration");
/**
 * This type of integration lets API Gateway return a response without sending
 * the request further to the backend. This is useful for API testing because it
 * can be used to test the integration set up without incurring charges for
 * using the backend and to enable collaborative development of an API. In
 * collaborative development, a team can isolate their development effort by
 * setting up simulations of API components owned by other teams by using the
 * MOCK integrations. It is also used to return CORS-related headers to ensure
 * that the API method permits CORS access. In fact, the API Gateway console
 * integrates the OPTIONS method to support CORS with a mock integration.
 * Gateway responses are other examples of mock integrations.
 */
class MockIntegration extends integration_1.Integration {
    constructor(options) {
        super({
            type: integration_1.IntegrationType.MOCK,
            options,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IntegrationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, MockIntegration);
            }
            throw error;
        }
    }
}
exports.MockIntegration = MockIntegration;
_a = JSII_RTTI_SYMBOL_1;
MockIntegration[_a] = { fqn: "@aws-cdk/aws-apigateway.MockIntegration", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQWtGO0FBRWxGOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLHlCQUFXO0lBQzlDLFlBQVksT0FBNEI7UUFDdEMsS0FBSyxDQUFDO1lBQ0osSUFBSSxFQUFFLDZCQUFlLENBQUMsSUFBSTtZQUMxQixPQUFPO1NBQ1IsQ0FBQyxDQUFDOzs7Ozs7K0NBTE0sZUFBZTs7OztLQU16Qjs7QUFOSCwwQ0FPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEludGVncmF0aW9uLCBJbnRlZ3JhdGlvbk9wdGlvbnMsIEludGVncmF0aW9uVHlwZSB9IGZyb20gJy4uL2ludGVncmF0aW9uJztcblxuLyoqXG4gKiBUaGlzIHR5cGUgb2YgaW50ZWdyYXRpb24gbGV0cyBBUEkgR2F0ZXdheSByZXR1cm4gYSByZXNwb25zZSB3aXRob3V0IHNlbmRpbmdcbiAqIHRoZSByZXF1ZXN0IGZ1cnRoZXIgdG8gdGhlIGJhY2tlbmQuIFRoaXMgaXMgdXNlZnVsIGZvciBBUEkgdGVzdGluZyBiZWNhdXNlIGl0XG4gKiBjYW4gYmUgdXNlZCB0byB0ZXN0IHRoZSBpbnRlZ3JhdGlvbiBzZXQgdXAgd2l0aG91dCBpbmN1cnJpbmcgY2hhcmdlcyBmb3JcbiAqIHVzaW5nIHRoZSBiYWNrZW5kIGFuZCB0byBlbmFibGUgY29sbGFib3JhdGl2ZSBkZXZlbG9wbWVudCBvZiBhbiBBUEkuIEluXG4gKiBjb2xsYWJvcmF0aXZlIGRldmVsb3BtZW50LCBhIHRlYW0gY2FuIGlzb2xhdGUgdGhlaXIgZGV2ZWxvcG1lbnQgZWZmb3J0IGJ5XG4gKiBzZXR0aW5nIHVwIHNpbXVsYXRpb25zIG9mIEFQSSBjb21wb25lbnRzIG93bmVkIGJ5IG90aGVyIHRlYW1zIGJ5IHVzaW5nIHRoZVxuICogTU9DSyBpbnRlZ3JhdGlvbnMuIEl0IGlzIGFsc28gdXNlZCB0byByZXR1cm4gQ09SUy1yZWxhdGVkIGhlYWRlcnMgdG8gZW5zdXJlXG4gKiB0aGF0IHRoZSBBUEkgbWV0aG9kIHBlcm1pdHMgQ09SUyBhY2Nlc3MuIEluIGZhY3QsIHRoZSBBUEkgR2F0ZXdheSBjb25zb2xlXG4gKiBpbnRlZ3JhdGVzIHRoZSBPUFRJT05TIG1ldGhvZCB0byBzdXBwb3J0IENPUlMgd2l0aCBhIG1vY2sgaW50ZWdyYXRpb24uXG4gKiBHYXRld2F5IHJlc3BvbnNlcyBhcmUgb3RoZXIgZXhhbXBsZXMgb2YgbW9jayBpbnRlZ3JhdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2NrSW50ZWdyYXRpb24gZXh0ZW5kcyBJbnRlZ3JhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBJbnRlZ3JhdGlvbk9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICB0eXBlOiBJbnRlZ3JhdGlvblR5cGUuTU9DSyxcbiAgICAgIG9wdGlvbnMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==