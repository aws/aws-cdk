"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnUtils = exports.CfnUtilsProvider = void 0;
const constructs_1 = require("constructs");
const custom_resource_1 = require("../custom-resource");
const custom_resource_provider_1 = require("../custom-resource-provider");
/**
 * A custom resource provider for CFN utilities such as `CfnJson`.
 */
class CfnUtilsProvider extends constructs_1.Construct {
    static getOrCreate(scope) {
        return custom_resource_provider_1.CustomResourceProvider.getOrCreate(scope, 'AWSCDKCfnUtilsProvider', {
            runtime: custom_resource_provider_1.CustomResourceProviderRuntime.NODEJS_14_X,
            codeDirectory: `${__dirname}/cfn-utils-provider`,
        });
    }
}
exports.CfnUtilsProvider = CfnUtilsProvider;
/**
 * Utility functions provided by the CfnUtilsProvider
 */
class CfnUtils {
    /**
     * Encode a structure to JSON at CloudFormation deployment time
     *
     * This would have been suitable for the JSON-encoding of arbitrary structures, however:
     *
     * - It uses a custom resource to do the encoding, and we'd rather not use a custom
     *   resource if we can avoid it.
     * - It cannot be used to encode objects where the keys of the objects can contain
     *   tokens--because those cannot be represented in the JSON encoding that CloudFormation
     *   templates use.
     *
     * This helper is used by `CloudFormationLang.toJSON()` if and only if it encounters
     * objects that cannot be stringified any other way.
     */
    static stringify(scope, id, value) {
        const resource = new custom_resource_1.CustomResource(scope, id, {
            serviceToken: CfnUtilsProvider.getOrCreate(scope),
            resourceType: "Custom::AWSCDKCfnJsonStringify" /* CfnUtilsResourceType.CFN_JSON_STRINGIFY */,
            properties: {
                Value: value,
            },
        });
        return resource.getAttString('Value');
    }
}
exports.CfnUtils = CfnUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXV0aWxzLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXV0aWxzLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUF1QztBQUV2Qyx3REFBb0Q7QUFDcEQsMEVBQW9HO0FBRXBHOztHQUVHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxzQkFBUztJQUN0QyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQWdCO1FBQ3hDLE9BQU8saURBQXNCLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBRTtZQUN6RSxPQUFPLEVBQUUsd0RBQTZCLENBQUMsV0FBVztZQUNsRCxhQUFhLEVBQUUsR0FBRyxTQUFTLHFCQUFxQjtTQUNqRCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFQRCw0Q0FPQztBQUVEOztHQUVHO0FBQ0gsTUFBc0IsUUFBUTtJQUM1Qjs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFVO1FBQzlELE1BQU0sUUFBUSxHQUFHLElBQUksZ0NBQWMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQzdDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ2pELFlBQVksZ0ZBQXlDO1lBQ3JELFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsS0FBSzthQUNiO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDRjtBQTFCRCw0QkEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblV0aWxzUmVzb3VyY2VUeXBlIH0gZnJvbSAnLi9jZm4tdXRpbHMtcHJvdmlkZXIvY29uc3RzJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlIH0gZnJvbSAnLi4vY3VzdG9tLXJlc291cmNlJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlUHJvdmlkZXIsIEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lIH0gZnJvbSAnLi4vY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyJztcblxuLyoqXG4gKiBBIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlciBmb3IgQ0ZOIHV0aWxpdGllcyBzdWNoIGFzIGBDZm5Kc29uYC5cbiAqL1xuZXhwb3J0IGNsYXNzIENmblV0aWxzUHJvdmlkZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICByZXR1cm4gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZShzY29wZSwgJ0FXU0NES0NmblV0aWxzUHJvdmlkZXInLCB7XG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IGAke19fZGlybmFtZX0vY2ZuLXV0aWxzLXByb3ZpZGVyYCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb25zIHByb3ZpZGVkIGJ5IHRoZSBDZm5VdGlsc1Byb3ZpZGVyXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDZm5VdGlscyB7XG4gIC8qKlxuICAgKiBFbmNvZGUgYSBzdHJ1Y3R1cmUgdG8gSlNPTiBhdCBDbG91ZEZvcm1hdGlvbiBkZXBsb3ltZW50IHRpbWVcbiAgICpcbiAgICogVGhpcyB3b3VsZCBoYXZlIGJlZW4gc3VpdGFibGUgZm9yIHRoZSBKU09OLWVuY29kaW5nIG9mIGFyYml0cmFyeSBzdHJ1Y3R1cmVzLCBob3dldmVyOlxuICAgKlxuICAgKiAtIEl0IHVzZXMgYSBjdXN0b20gcmVzb3VyY2UgdG8gZG8gdGhlIGVuY29kaW5nLCBhbmQgd2UnZCByYXRoZXIgbm90IHVzZSBhIGN1c3RvbVxuICAgKiAgIHJlc291cmNlIGlmIHdlIGNhbiBhdm9pZCBpdC5cbiAgICogLSBJdCBjYW5ub3QgYmUgdXNlZCB0byBlbmNvZGUgb2JqZWN0cyB3aGVyZSB0aGUga2V5cyBvZiB0aGUgb2JqZWN0cyBjYW4gY29udGFpblxuICAgKiAgIHRva2Vucy0tYmVjYXVzZSB0aG9zZSBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gdGhlIEpTT04gZW5jb2RpbmcgdGhhdCBDbG91ZEZvcm1hdGlvblxuICAgKiAgIHRlbXBsYXRlcyB1c2UuXG4gICAqXG4gICAqIFRoaXMgaGVscGVyIGlzIHVzZWQgYnkgYENsb3VkRm9ybWF0aW9uTGFuZy50b0pTT04oKWAgaWYgYW5kIG9ubHkgaWYgaXQgZW5jb3VudGVyc1xuICAgKiBvYmplY3RzIHRoYXQgY2Fubm90IGJlIHN0cmluZ2lmaWVkIGFueSBvdGhlciB3YXkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ2lmeShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCB2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDdXN0b21SZXNvdXJjZShzY29wZSwgaWQsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogQ2ZuVXRpbHNQcm92aWRlci5nZXRPckNyZWF0ZShzY29wZSksXG4gICAgICByZXNvdXJjZVR5cGU6IENmblV0aWxzUmVzb3VyY2VUeXBlLkNGTl9KU09OX1NUUklOR0lGWSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgVmFsdWU6IHZhbHVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXNvdXJjZS5nZXRBdHRTdHJpbmcoJ1ZhbHVlJyk7XG4gIH1cbn1cbiJdfQ==