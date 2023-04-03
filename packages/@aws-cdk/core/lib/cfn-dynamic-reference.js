"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnDynamicReferenceService = exports.CfnDynamicReference = void 0;
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
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWR5bmFtaWMtcmVmZXJlbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWR5bmFtaWMtcmVmZXJlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUFnRDtBQWlCaEQ7Ozs7Ozs7R0FPRztBQUNILE1BQWEsbUJBQW9CLFNBQVEscUJBQVM7SUFDaEQsWUFBWSxPQUFtQyxFQUFFLEdBQVc7UUFDMUQsS0FBSyxDQUFDLFlBQVksR0FBRyxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0Y7QUFKRCxrREFJQztBQUVEOztHQUVHO0FBQ0gsSUFBWSwwQkFlWDtBQWZELFdBQVksMEJBQTBCO0lBQ3BDOztPQUVHO0lBQ0gseUNBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsdURBQXlCLENBQUE7SUFFekI7O09BRUc7SUFDSCxnRUFBa0MsQ0FBQTtBQUNwQyxDQUFDLEVBZlcsMEJBQTBCLEdBQTFCLGtDQUEwQixLQUExQixrQ0FBMEIsUUFlckMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnRyaW5zaWMgfSBmcm9tICcuL3ByaXZhdGUvaW50cmluc2ljJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIER5bmFtaWMgUmVmZXJlbmNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuRHluYW1pY1JlZmVyZW5jZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzZXJ2aWNlIHRvIHJldHJpZXZlIHRoZSBkeW5hbWljIHJlZmVyZW5jZSBmcm9tXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlOiBDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZTtcblxuICAvKipcbiAgICogVGhlIHJlZmVyZW5jZSBrZXkgb2YgdGhlIGR5bmFtaWMgcmVmZXJlbmNlXG4gICAqL1xuICByZWFkb25seSByZWZlcmVuY2VLZXk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBSZWZlcmVuY2VzIGEgZHluYW1pY2FsbHkgcmV0cmlldmVkIHZhbHVlXG4gKlxuICogVGhpcyBpcyBhIENvbnN0cnVjdCBzbyB0aGF0IHN1YmNsYXNzZXMgd2lsbCAoZXZlbnR1YWxseSkgYmUgYWJsZSB0byBhdHRhY2hcbiAqIG1ldGFkYXRhIHRvIHRoZW1zZWx2ZXMgd2l0aG91dCBoYXZpbmcgdG8gY2hhbmdlIGNhbGwgc2lnbmF0dXJlcy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2R5bmFtaWMtcmVmZXJlbmNlcy5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5EeW5hbWljUmVmZXJlbmNlIGV4dGVuZHMgSW50cmluc2ljIHtcbiAgY29uc3RydWN0b3Ioc2VydmljZTogQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UsIGtleTogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ3t7cmVzb2x2ZTonICsgc2VydmljZSArICc6JyArIGtleSArICd9fScpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIHNlcnZpY2UgdG8gcmV0cmlldmUgdGhlIGR5bmFtaWMgcmVmZXJlbmNlIGZyb21cbiAqL1xuZXhwb3J0IGVudW0gQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2Uge1xuICAvKipcbiAgICogUGxhaW50ZXh0IHZhbHVlIHN0b3JlZCBpbiBBV1MgU3lzdGVtcyBNYW5hZ2VyIFBhcmFtZXRlciBTdG9yZVxuICAgKi9cbiAgU1NNID0gJ3NzbScsXG5cbiAgLyoqXG4gICAqIFNlY3VyZSBzdHJpbmcgc3RvcmVkIGluIEFXUyBTeXN0ZW1zIE1hbmFnZXIgUGFyYW1ldGVyIFN0b3JlXG4gICAqL1xuICBTU01fU0VDVVJFID0gJ3NzbS1zZWN1cmUnLFxuXG4gIC8qKlxuICAgKiBTZWNyZXQgc3RvcmVkIGluIEFXUyBTZWNyZXRzIE1hbmFnZXJcbiAgICovXG4gIFNFQ1JFVFNfTUFOQUdFUiA9ICdzZWNyZXRzbWFuYWdlcicsXG59XG4iXX0=