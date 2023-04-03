"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitedApiKey = exports.ApiKey = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const apigateway_generated_1 = require("./apigateway.generated");
const usage_plan_1 = require("./usage-plan");
/**
 * Base implementation that is common to the various implementations of IApiKey
 */
class ApiKeyBase extends core_1.Resource {
    /**
     * Permits the IAM principal all read operations through this key
     *
     * @param grantee The principal to grant access to
     */
    grantRead(grantee) {
        return iam.Grant.addToPrincipal({
            grantee,
            actions: readPermissions,
            resourceArns: [this.keyArn],
        });
    }
    /**
     * Permits the IAM principal all write operations through this key
     *
     * @param grantee The principal to grant access to
     */
    grantWrite(grantee) {
        return iam.Grant.addToPrincipal({
            grantee,
            actions: writePermissions,
            resourceArns: [this.keyArn],
        });
    }
    /**
     * Permits the IAM principal all read and write operations through this key
     *
     * @param grantee The principal to grant access to
     */
    grantReadWrite(grantee) {
        return iam.Grant.addToPrincipal({
            grantee,
            actions: [...readPermissions, ...writePermissions],
            resourceArns: [this.keyArn],
        });
    }
}
/**
 * An API Gateway ApiKey.
 *
 * An ApiKey can be distributed to API clients that are executing requests
 * for Method resources that require an Api Key.
 */
class ApiKey extends ApiKeyBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.apiKeyName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ApiKeyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ApiKey);
            }
            throw error;
        }
        const resource = new apigateway_generated_1.CfnApiKey(this, 'Resource', {
            customerId: props.customerId,
            description: props.description,
            enabled: props.enabled ?? true,
            generateDistinctId: props.generateDistinctId,
            name: this.physicalName,
            stageKeys: this.renderStageKeys(props.resources, props.stages),
            value: props.value,
        });
        this.keyId = resource.ref;
        this.keyArn = core_1.Stack.of(this).formatArn({
            service: 'apigateway',
            account: '',
            resource: '/apikeys',
            arnFormat: core_1.ArnFormat.SLASH_RESOURCE_NAME,
            resourceName: this.keyId,
        });
    }
    /**
     * Import an ApiKey by its Id
     */
    static fromApiKeyId(scope, id, apiKeyId) {
        class Import extends ApiKeyBase {
            constructor() {
                super(...arguments);
                this.keyId = apiKeyId;
                this.keyArn = core_1.Stack.of(this).formatArn({
                    service: 'apigateway',
                    account: '',
                    resource: '/apikeys',
                    arnFormat: core_1.ArnFormat.SLASH_RESOURCE_NAME,
                    resourceName: apiKeyId,
                });
            }
        }
        return new Import(scope, id);
    }
    renderStageKeys(resources, stages) {
        if (!resources && !stages) {
            return undefined;
        }
        if (resources && stages) {
            throw new Error('Only one of "resources" or "stages" should be provided');
        }
        return resources
            ? resources.map((resource) => {
                const restApi = resource;
                if (!restApi.deploymentStage) {
                    throw new Error('Cannot add an ApiKey to a RestApi that does not contain a "deploymentStage".\n' +
                        'Either set the RestApi.deploymentStage or create an ApiKey from a Stage');
                }
                const restApiId = restApi.restApiId;
                const stageName = restApi.deploymentStage.stageName.toString();
                return { restApiId, stageName };
            })
            : stages ? stages.map((stage => {
                return { restApiId: stage.restApi.restApiId, stageName: stage.stageName };
            })) : undefined;
    }
}
exports.ApiKey = ApiKey;
_a = JSII_RTTI_SYMBOL_1;
ApiKey[_a] = { fqn: "@aws-cdk/aws-apigateway.ApiKey", version: "0.0.0" };
/**
 * An API Gateway ApiKey, for which a rate limiting configuration can be specified.
 *
 * @resource AWS::ApiGateway::ApiKey
 */
class RateLimitedApiKey extends ApiKeyBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.apiKeyName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_RateLimitedApiKeyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RateLimitedApiKey);
            }
            throw error;
        }
        const resource = new ApiKey(this, 'Resource', props);
        if (props.apiStages || props.quota || props.throttle) {
            const usageplan = new usage_plan_1.UsagePlan(this, 'UsagePlanResource', {
                apiStages: props.apiStages,
                quota: props.quota,
                throttle: props.throttle,
            });
            usageplan.addApiKey(resource);
        }
        this.keyId = resource.keyId;
        this.keyArn = resource.keyArn;
    }
}
exports.RateLimitedApiKey = RateLimitedApiKey;
_b = JSII_RTTI_SYMBOL_1;
RateLimitedApiKey[_b] = { fqn: "@aws-cdk/aws-apigateway.RateLimitedApiKey", version: "0.0.0" };
const readPermissions = [
    'apigateway:GET',
];
const writePermissions = [
    'apigateway:POST',
    'apigateway:PUT',
    'apigateway:PATCH',
    'apigateway:DELETE',
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWtleS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaS1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLHdDQUF1RjtBQUV2RixpRUFBbUQ7QUFJbkQsNkNBQWdHO0FBcUZoRzs7R0FFRztBQUNILE1BQWUsVUFBVyxTQUFRLGVBQVE7SUFJeEM7Ozs7T0FJRztJQUNJLFNBQVMsQ0FBQyxPQUF1QjtRQUN0QyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1lBQzlCLE9BQU87WUFDUCxPQUFPLEVBQUUsZUFBZTtZQUN4QixZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzVCLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7T0FJRztJQUNJLFVBQVUsQ0FBQyxPQUF1QjtRQUN2QyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1lBQzlCLE9BQU87WUFDUCxPQUFPLEVBQUUsZ0JBQWdCO1lBQ3pCLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDNUIsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7OztPQUlHO0lBQ0ksY0FBYyxDQUFDLE9BQXVCO1FBQzNDLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7WUFDOUIsT0FBTztZQUNQLE9BQU8sRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7WUFDbEQsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUM1QixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFhLE1BQU8sU0FBUSxVQUFVO0lBdUJwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQXFCLEVBQUc7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFVBQVU7U0FDL0IsQ0FBQyxDQUFD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O0FBdkVILHdCQXdFQzs7O0FBeUJEOzs7O0dBSUc7QUFDSCxNQUFhLGlCQUFrQixTQUFRLFVBQVU7SUFJL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFnQyxFQUFHO1FBQzNFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxVQUFVO1NBQy9CLENBQUMsQ0FBQzs7Ozs7OytDQVBNLGlCQUFpQjs7OztRQVMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXJELElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDcEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtnQkFDekQsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO2dCQUMxQixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7Z0JBQ2xCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTthQUN6QixDQUFDLENBQUM7WUFDSCxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztLQUMvQjs7QUF0QkgsOENBdUJDOzs7QUFFRCxNQUFNLGVBQWUsR0FBRztJQUN0QixnQkFBZ0I7Q0FDakIsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUc7SUFDdkIsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsbUJBQW1CO0NBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcm5Gb3JtYXQsIElSZXNvdXJjZSBhcyBJUmVzb3VyY2VCYXNlLCBSZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuQXBpS2V5IH0gZnJvbSAnLi9hcGlnYXRld2F5LmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBSZXNvdXJjZU9wdGlvbnMgfSBmcm9tICcuL3Jlc291cmNlJztcbmltcG9ydCB7IElSZXN0QXBpIH0gZnJvbSAnLi9yZXN0YXBpJztcbmltcG9ydCB7IElTdGFnZSB9IGZyb20gJy4vc3RhZ2UnO1xuaW1wb3J0IHsgUXVvdGFTZXR0aW5ncywgVGhyb3R0bGVTZXR0aW5ncywgVXNhZ2VQbGFuLCBVc2FnZVBsYW5QZXJBcGlTdGFnZSB9IGZyb20gJy4vdXNhZ2UtcGxhbic7XG5cbi8qKlxuICogQVBJIGtleXMgYXJlIGFscGhhbnVtZXJpYyBzdHJpbmcgdmFsdWVzIHRoYXQgeW91IGRpc3RyaWJ1dGUgdG9cbiAqIGFwcCBkZXZlbG9wZXIgY3VzdG9tZXJzIHRvIGdyYW50IGFjY2VzcyB0byB5b3VyIEFQSVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElBcGlLZXkgZXh0ZW5kcyBJUmVzb3VyY2VCYXNlIHtcbiAgLyoqXG4gICAqIFRoZSBBUEkga2V5IElELlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBrZXlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVBJIGtleSBBUk4uXG4gICAqL1xuICByZWFkb25seSBrZXlBcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgb3B0aW9ucyBmb3IgY3JlYXRpbmcgYW4gQVBJIEtleS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcGlLZXlPcHRpb25zIGV4dGVuZHMgUmVzb3VyY2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIEFQSSBrZXkuIElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgbmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0IElEIGZvciB0aGUgQVBJIGtleSBuYW1lLlxuICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5LWFwaWtleS5odG1sI2Nmbi1hcGlnYXRld2F5LWFwaWtleS1uYW1lXG4gICAqIEBkZWZhdWx0IGF1dG9taWNhbGx5IGdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBhcGlLZXlOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgb2YgdGhlIEFQSSBrZXkuIE11c3QgYmUgYXQgbGVhc3QgMjAgY2hhcmFjdGVycyBsb25nLlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheS1hcGlrZXkuaHRtbCNjZm4tYXBpZ2F0ZXdheS1hcGlrZXktdmFsdWVcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHB1cnBvc2Ugb2YgdGhlIEFQSSBrZXkuXG4gICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXktYXBpa2V5Lmh0bWwjY2ZuLWFwaWdhdGV3YXktYXBpa2V5LWRlc2NyaXB0aW9uXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEFwaUtleSBQcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwaUtleVByb3BzIGV4dGVuZHMgQXBpS2V5T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgcmVzb3VyY2VzIHRoaXMgYXBpIGtleSBpcyBhc3NvY2lhdGVkIHdpdGguXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICogQGRlcHJlY2F0ZWQgLSB1c2UgYHN0YWdlc2AgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VzPzogSVJlc3RBcGlbXTtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIFN0YWdlcyB0aGlzIGFwaSBrZXkgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBhcGkga2V5IGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYW55IHN0YWdlc1xuICAgKi9cbiAgcmVhZG9ubHkgc3RhZ2VzPzogSVN0YWdlW107XG5cbiAgLyoqXG4gICAqIEFuIEFXUyBNYXJrZXRwbGFjZSBjdXN0b21lciBpZGVudGlmaWVyIHRvIHVzZSB3aGVuIGludGVncmF0aW5nIHdpdGggdGhlIEFXUyBTYWFTIE1hcmtldHBsYWNlLlxuICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5LWFwaWtleS5odG1sI2Nmbi1hcGlnYXRld2F5LWFwaWtleS1jdXN0b21lcmlkXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGN1c3RvbWVySWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBBUEkga2V5IGNhbiBiZSB1c2VkIGJ5IGNsaWVudHMuXG4gICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXktYXBpa2V5Lmh0bWwjY2ZuLWFwaWdhdGV3YXktYXBpa2V5LWVuYWJsZWRcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBrZXkgaWRlbnRpZmllciBpcyBkaXN0aW5jdCBmcm9tIHRoZSBjcmVhdGVkIEFQSSBrZXkgdmFsdWUuXG4gICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXktYXBpa2V5Lmh0bWwjY2ZuLWFwaWdhdGV3YXktYXBpa2V5LWdlbmVyYXRlZGlzdGluY3RpZFxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZ2VuZXJhdGVEaXN0aW5jdElkPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIHRoYXQgaXMgY29tbW9uIHRvIHRoZSB2YXJpb3VzIGltcGxlbWVudGF0aW9ucyBvZiBJQXBpS2V5XG4gKi9cbmFic3RyYWN0IGNsYXNzIEFwaUtleUJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElBcGlLZXkge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkga2V5SWQ6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGtleUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQZXJtaXRzIHRoZSBJQU0gcHJpbmNpcGFsIGFsbCByZWFkIG9wZXJhdGlvbnMgdGhyb3VnaCB0aGlzIGtleVxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSBUaGUgcHJpbmNpcGFsIHRvIGdyYW50IGFjY2VzcyB0b1xuICAgKi9cbiAgcHVibGljIGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogcmVhZFBlcm1pc3Npb25zLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5rZXlBcm5dLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcm1pdHMgdGhlIElBTSBwcmluY2lwYWwgYWxsIHdyaXRlIG9wZXJhdGlvbnMgdGhyb3VnaCB0aGlzIGtleVxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSBUaGUgcHJpbmNpcGFsIHRvIGdyYW50IGFjY2VzcyB0b1xuICAgKi9cbiAgcHVibGljIGdyYW50V3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IHdyaXRlUGVybWlzc2lvbnMsXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLmtleUFybl0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGVybWl0cyB0aGUgSUFNIHByaW5jaXBhbCBhbGwgcmVhZCBhbmQgd3JpdGUgb3BlcmF0aW9ucyB0aHJvdWdoIHRoaXMga2V5XG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFRoZSBwcmluY2lwYWwgdG8gZ3JhbnQgYWNjZXNzIHRvXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRSZWFkV3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFsuLi5yZWFkUGVybWlzc2lvbnMsIC4uLndyaXRlUGVybWlzc2lvbnNdLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5rZXlBcm5dLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQW4gQVBJIEdhdGV3YXkgQXBpS2V5LlxuICpcbiAqIEFuIEFwaUtleSBjYW4gYmUgZGlzdHJpYnV0ZWQgdG8gQVBJIGNsaWVudHMgdGhhdCBhcmUgZXhlY3V0aW5nIHJlcXVlc3RzXG4gKiBmb3IgTWV0aG9kIHJlc291cmNlcyB0aGF0IHJlcXVpcmUgYW4gQXBpIEtleS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwaUtleSBleHRlbmRzIEFwaUtleUJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gQXBpS2V5IGJ5IGl0cyBJZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXBpS2V5SWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXBpS2V5SWQ6IHN0cmluZyk6IElBcGlLZXkge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIEFwaUtleUJhc2Uge1xuICAgICAgcHVibGljIGtleUlkID0gYXBpS2V5SWQ7XG4gICAgICBwdWJsaWMga2V5QXJuID0gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgICAgc2VydmljZTogJ2FwaWdhdGV3YXknLFxuICAgICAgICBhY2NvdW50OiAnJyxcbiAgICAgICAgcmVzb3VyY2U6ICcvYXBpa2V5cycsXG4gICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUsXG4gICAgICAgIHJlc291cmNlTmFtZTogYXBpS2V5SWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGtleUlkOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBrZXlBcm46IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXBpS2V5UHJvcHMgPSB7IH0pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuYXBpS2V5TmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkFwaUtleSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBjdXN0b21lcklkOiBwcm9wcy5jdXN0b21lcklkLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgZW5hYmxlZDogcHJvcHMuZW5hYmxlZCA/PyB0cnVlLFxuICAgICAgZ2VuZXJhdGVEaXN0aW5jdElkOiBwcm9wcy5nZW5lcmF0ZURpc3RpbmN0SWQsXG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHN0YWdlS2V5czogdGhpcy5yZW5kZXJTdGFnZUtleXMocHJvcHMucmVzb3VyY2VzLCBwcm9wcy5zdGFnZXMpLFxuICAgICAgdmFsdWU6IHByb3BzLnZhbHVlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5rZXlJZCA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLmtleUFybiA9IFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnYXBpZ2F0ZXdheScsXG4gICAgICBhY2NvdW50OiAnJyxcbiAgICAgIHJlc291cmNlOiAnL2FwaWtleXMnLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5rZXlJZCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3RhZ2VLZXlzKHJlc291cmNlcz86IElSZXN0QXBpW10sIHN0YWdlcz86IElTdGFnZVtdKTogQ2ZuQXBpS2V5LlN0YWdlS2V5UHJvcGVydHlbXSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFyZXNvdXJjZXMgJiYgIXN0YWdlcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAocmVzb3VyY2VzICYmIHN0YWdlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBvZiBcInJlc291cmNlc1wiIG9yIFwic3RhZ2VzXCIgc2hvdWxkIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc291cmNlc1xuICAgICAgPyByZXNvdXJjZXMubWFwKChyZXNvdXJjZTogSVJlc3RBcGkpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdEFwaSA9IHJlc291cmNlO1xuICAgICAgICBpZiAoIXJlc3RBcGkuZGVwbG95bWVudFN0YWdlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIGFuIEFwaUtleSB0byBhIFJlc3RBcGkgdGhhdCBkb2VzIG5vdCBjb250YWluIGEgXCJkZXBsb3ltZW50U3RhZ2VcIi5cXG4nK1xuICAgICAgICAgICdFaXRoZXIgc2V0IHRoZSBSZXN0QXBpLmRlcGxveW1lbnRTdGFnZSBvciBjcmVhdGUgYW4gQXBpS2V5IGZyb20gYSBTdGFnZScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3RBcGlJZCA9IHJlc3RBcGkucmVzdEFwaUlkO1xuICAgICAgICBjb25zdCBzdGFnZU5hbWUgPSByZXN0QXBpLmRlcGxveW1lbnRTdGFnZSEuc3RhZ2VOYW1lLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiB7IHJlc3RBcGlJZCwgc3RhZ2VOYW1lIH07XG4gICAgICB9KVxuICAgICAgOiBzdGFnZXMgPyBzdGFnZXMubWFwKChzdGFnZSA9PiB7XG4gICAgICAgIHJldHVybiB7IHJlc3RBcGlJZDogc3RhZ2UucmVzdEFwaS5yZXN0QXBpSWQsIHN0YWdlTmFtZTogc3RhZ2Uuc3RhZ2VOYW1lIH07XG4gICAgICB9KSkgOiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBSYXRlTGltaXRlZEFwaUtleSBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJhdGVMaW1pdGVkQXBpS2V5UHJvcHMgZXh0ZW5kcyBBcGlLZXlQcm9wcyB7XG4gIC8qKlxuICAgKiBBUEkgU3RhZ2VzIHRvIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgUmF0ZUxpbWl0ZWRBcGlLZXkuXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGFwaVN0YWdlcz86IFVzYWdlUGxhblBlckFwaVN0YWdlW107XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiByZXF1ZXN0cyBjbGllbnRzIGNhbiBtYWtlIGluIGEgZ2l2ZW4gdGltZSBwZXJpb2QuXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHF1b3RhPzogUXVvdGFTZXR0aW5ncztcblxuICAvKipcbiAgICogT3ZlcmFsbCB0aHJvdHRsZSBzZXR0aW5ncyBmb3IgdGhlIEFQSS5cbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdGhyb3R0bGU/OiBUaHJvdHRsZVNldHRpbmdzO1xufVxuXG4vKipcbiAqIEFuIEFQSSBHYXRld2F5IEFwaUtleSwgZm9yIHdoaWNoIGEgcmF0ZSBsaW1pdGluZyBjb25maWd1cmF0aW9uIGNhbiBiZSBzcGVjaWZpZWQuXG4gKlxuICogQHJlc291cmNlIEFXUzo6QXBpR2F0ZXdheTo6QXBpS2V5XG4gKi9cbmV4cG9ydCBjbGFzcyBSYXRlTGltaXRlZEFwaUtleSBleHRlbmRzIEFwaUtleUJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkga2V5SWQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGtleUFybjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSYXRlTGltaXRlZEFwaUtleVByb3BzID0geyB9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmFwaUtleU5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBBcGlLZXkodGhpcywgJ1Jlc291cmNlJywgcHJvcHMpO1xuXG4gICAgaWYgKHByb3BzLmFwaVN0YWdlcyB8fCBwcm9wcy5xdW90YSB8fCBwcm9wcy50aHJvdHRsZSkge1xuICAgICAgY29uc3QgdXNhZ2VwbGFuID0gbmV3IFVzYWdlUGxhbih0aGlzLCAnVXNhZ2VQbGFuUmVzb3VyY2UnLCB7XG4gICAgICAgIGFwaVN0YWdlczogcHJvcHMuYXBpU3RhZ2VzLFxuICAgICAgICBxdW90YTogcHJvcHMucXVvdGEsXG4gICAgICAgIHRocm90dGxlOiBwcm9wcy50aHJvdHRsZSxcbiAgICAgIH0pO1xuICAgICAgdXNhZ2VwbGFuLmFkZEFwaUtleShyZXNvdXJjZSk7XG4gICAgfVxuXG4gICAgdGhpcy5rZXlJZCA9IHJlc291cmNlLmtleUlkO1xuICAgIHRoaXMua2V5QXJuID0gcmVzb3VyY2Uua2V5QXJuO1xuICB9XG59XG5cbmNvbnN0IHJlYWRQZXJtaXNzaW9ucyA9IFtcbiAgJ2FwaWdhdGV3YXk6R0VUJyxcbl07XG5cbmNvbnN0IHdyaXRlUGVybWlzc2lvbnMgPSBbXG4gICdhcGlnYXRld2F5OlBPU1QnLFxuICAnYXBpZ2F0ZXdheTpQVVQnLFxuICAnYXBpZ2F0ZXdheTpQQVRDSCcsXG4gICdhcGlnYXRld2F5OkRFTEVURScsXG5dO1xuIl19