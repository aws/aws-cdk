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
     * This would have been suitable for the JSON-encoding of abitrary structures, however:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXV0aWxzLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXV0aWxzLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUF1QztBQUV2Qyx3REFBb0Q7QUFDcEQsMEVBQW9HO0FBRXBHOztHQUVHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxzQkFBUztJQUN0QyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQWdCO1FBQ3hDLE9BQU8saURBQXNCLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBRTtZQUN6RSxPQUFPLEVBQUUsd0RBQTZCLENBQUMsV0FBVztZQUNsRCxhQUFhLEVBQUUsR0FBRyxTQUFTLHFCQUFxQjtTQUNqRCxDQUFDLENBQUM7S0FDSjtDQUNGO0FBUEQsNENBT0M7QUFFRDs7R0FFRztBQUNILE1BQXNCLFFBQVE7SUFDNUI7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBVTtRQUM5RCxNQUFNLFFBQVEsR0FBRyxJQUFJLGdDQUFjLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUM3QyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNqRCxZQUFZLGdGQUF5QztZQUNyRCxVQUFVLEVBQUU7Z0JBQ1YsS0FBSyxFQUFFLEtBQUs7YUFDYjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN2QztDQUNGO0FBMUJELDRCQTBCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuVXRpbHNSZXNvdXJjZVR5cGUgfSBmcm9tICcuL2Nmbi11dGlscy1wcm92aWRlci9jb25zdHMnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UgfSBmcm9tICcuLi9jdXN0b20tcmVzb3VyY2UnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUgfSBmcm9tICcuLi9jdXN0b20tcmVzb3VyY2UtcHJvdmlkZXInO1xuXG4vKipcbiAqIEEgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIGZvciBDRk4gdXRpbGl0aWVzIHN1Y2ggYXMgYENmbkpzb25gLlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuVXRpbHNQcm92aWRlciBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGUoc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIHJldHVybiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHNjb3BlLCAnQVdTQ0RLQ2ZuVXRpbHNQcm92aWRlcicsIHtcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZURpcmVjdG9yeTogYCR7X19kaXJuYW1lfS9jZm4tdXRpbHMtcHJvdmlkZXJgLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnMgcHJvdmlkZWQgYnkgdGhlIENmblV0aWxzUHJvdmlkZXJcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENmblV0aWxzIHtcbiAgLyoqXG4gICAqIEVuY29kZSBhIHN0cnVjdHVyZSB0byBKU09OIGF0IENsb3VkRm9ybWF0aW9uIGRlcGxveW1lbnQgdGltZVxuICAgKlxuICAgKiBUaGlzIHdvdWxkIGhhdmUgYmVlbiBzdWl0YWJsZSBmb3IgdGhlIEpTT04tZW5jb2Rpbmcgb2YgYWJpdHJhcnkgc3RydWN0dXJlcywgaG93ZXZlcjpcbiAgICpcbiAgICogLSBJdCB1c2VzIGEgY3VzdG9tIHJlc291cmNlIHRvIGRvIHRoZSBlbmNvZGluZywgYW5kIHdlJ2QgcmF0aGVyIG5vdCB1c2UgYSBjdXN0b21cbiAgICogICByZXNvdXJjZSBpZiB3ZSBjYW4gYXZvaWQgaXQuXG4gICAqIC0gSXQgY2Fubm90IGJlIHVzZWQgdG8gZW5jb2RlIG9iamVjdHMgd2hlcmUgdGhlIGtleXMgb2YgdGhlIG9iamVjdHMgY2FuIGNvbnRhaW5cbiAgICogICB0b2tlbnMtLWJlY2F1c2UgdGhvc2UgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIHRoZSBKU09OIGVuY29kaW5nIHRoYXQgQ2xvdWRGb3JtYXRpb25cbiAgICogICB0ZW1wbGF0ZXMgdXNlLlxuICAgKlxuICAgKiBUaGlzIGhlbHBlciBpcyB1c2VkIGJ5IGBDbG91ZEZvcm1hdGlvbkxhbmcudG9KU09OKClgIGlmIGFuZCBvbmx5IGlmIGl0IGVuY291bnRlcnNcbiAgICogb2JqZWN0cyB0aGF0IGNhbm5vdCBiZSBzdHJpbmdpZmllZCBhbnkgb3RoZXIgd2F5LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdpZnkoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2Uoc2NvcGUsIGlkLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46IENmblV0aWxzUHJvdmlkZXIuZ2V0T3JDcmVhdGUoc2NvcGUpLFxuICAgICAgcmVzb3VyY2VUeXBlOiBDZm5VdGlsc1Jlc291cmNlVHlwZS5DRk5fSlNPTl9TVFJJTkdJRlksXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFZhbHVlOiB2YWx1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzb3VyY2UuZ2V0QXR0U3RyaW5nKCdWYWx1ZScpO1xuICB9XG59XG4iXX0=