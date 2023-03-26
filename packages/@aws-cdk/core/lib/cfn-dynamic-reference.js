"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnDynamicReferenceService = exports.CfnDynamicReference = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const intrinsic_1 = require("./private/intrinsic");
/**
 * References a dynamically retrieved value
 *
 * This is a Construct so that subclasses will (eventually) be able to attach
 * metadata to themselves without having to change call signatures.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 */
class CfnDynamicReference extends intrinsic_1.Intrinsic {
    constructor(service, key) {
        super('{{resolve:' + service + ':' + key + '}}');
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnDynamicReferenceService(service);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnDynamicReference);
            }
            throw error;
        }
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnDynamicReference[_a] = { fqn: "@aws-cdk/core.CfnDynamicReference", version: "0.0.0" };
exports.CfnDynamicReference = CfnDynamicReference;
/**
 * The service to retrieve the dynamic reference from
 */
var CfnDynamicReferenceService;
(function (CfnDynamicReferenceService) {
    /**
     * Plaintext value stored in AWS Systems Manager Parameter Store
     */
    CfnDynamicReferenceService["SSM"] = "ssm";
    /**
     * Secure string stored in AWS Systems Manager Parameter Store
     */
    CfnDynamicReferenceService["SSM_SECURE"] = "ssm-secure";
    /**
     * Secret stored in AWS Secrets Manager
     */
    CfnDynamicReferenceService["SECRETS_MANAGER"] = "secretsmanager";
})(CfnDynamicReferenceService = exports.CfnDynamicReferenceService || (exports.CfnDynamicReferenceService = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWR5bmFtaWMtcmVmZXJlbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWR5bmFtaWMtcmVmZXJlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG1EQUFnRDtBQWlCaEQ7Ozs7Ozs7R0FPRztBQUNILE1BQWEsbUJBQW9CLFNBQVEscUJBQVM7SUFDaEQsWUFBWSxPQUFtQyxFQUFFLEdBQVc7UUFDMUQsS0FBSyxDQUFDLFlBQVksR0FBRyxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQzs7Ozs7OytDQUZ4QyxtQkFBbUI7Ozs7S0FHN0I7Ozs7QUFIVSxrREFBbUI7QUFNaEM7O0dBRUc7QUFDSCxJQUFZLDBCQWVYO0FBZkQsV0FBWSwwQkFBMEI7SUFDcEM7O09BRUc7SUFDSCx5Q0FBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCx1REFBeUIsQ0FBQTtJQUV6Qjs7T0FFRztJQUNILGdFQUFrQyxDQUFBO0FBQ3BDLENBQUMsRUFmVywwQkFBMEIsR0FBMUIsa0NBQTBCLEtBQTFCLGtDQUEwQixRQWVyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4vcHJpdmF0ZS9pbnRyaW5zaWMnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgRHluYW1pYyBSZWZlcmVuY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5EeW5hbWljUmVmZXJlbmNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIHNlcnZpY2UgdG8gcmV0cmlldmUgdGhlIGR5bmFtaWMgcmVmZXJlbmNlIGZyb21cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2U6IENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVmZXJlbmNlIGtleSBvZiB0aGUgZHluYW1pYyByZWZlcmVuY2VcbiAgICovXG4gIHJlYWRvbmx5IHJlZmVyZW5jZUtleTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlZmVyZW5jZXMgYSBkeW5hbWljYWxseSByZXRyaWV2ZWQgdmFsdWVcbiAqXG4gKiBUaGlzIGlzIGEgQ29uc3RydWN0IHNvIHRoYXQgc3ViY2xhc3NlcyB3aWxsIChldmVudHVhbGx5KSBiZSBhYmxlIHRvIGF0dGFjaFxuICogbWV0YWRhdGEgdG8gdGhlbXNlbHZlcyB3aXRob3V0IGhhdmluZyB0byBjaGFuZ2UgY2FsbCBzaWduYXR1cmVzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvZHluYW1pYy1yZWZlcmVuY2VzLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkR5bmFtaWNSZWZlcmVuY2UgZXh0ZW5kcyBJbnRyaW5zaWMge1xuICBjb25zdHJ1Y3RvcihzZXJ2aWNlOiBDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZSwga2V5OiBzdHJpbmcpIHtcbiAgICBzdXBlcigne3tyZXNvbHZlOicgKyBzZXJ2aWNlICsgJzonICsga2V5ICsgJ319Jyk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgc2VydmljZSB0byByZXRyaWV2ZSB0aGUgZHluYW1pYyByZWZlcmVuY2UgZnJvbVxuICovXG5leHBvcnQgZW51bSBDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZSB7XG4gIC8qKlxuICAgKiBQbGFpbnRleHQgdmFsdWUgc3RvcmVkIGluIEFXUyBTeXN0ZW1zIE1hbmFnZXIgUGFyYW1ldGVyIFN0b3JlXG4gICAqL1xuICBTU00gPSAnc3NtJyxcblxuICAvKipcbiAgICogU2VjdXJlIHN0cmluZyBzdG9yZWQgaW4gQVdTIFN5c3RlbXMgTWFuYWdlciBQYXJhbWV0ZXIgU3RvcmVcbiAgICovXG4gIFNTTV9TRUNVUkUgPSAnc3NtLXNlY3VyZScsXG5cbiAgLyoqXG4gICAqIFNlY3JldCBzdG9yZWQgaW4gQVdTIFNlY3JldHMgTWFuYWdlclxuICAgKi9cbiAgU0VDUkVUU19NQU5BR0VSID0gJ3NlY3JldHNtYW5hZ2VyJyxcbn1cbiJdfQ==