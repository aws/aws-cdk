"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLambdaDeploymentConfig = exports.CustomLambdaDeploymentConfigType = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const custom_resources_1 = require("@aws-cdk/custom-resources");
const utils_1 = require("../private/utils");
/**
 * Lambda Deployment config type
 * @deprecated Use `LambdaDeploymentConfig`
 */
var CustomLambdaDeploymentConfigType;
(function (CustomLambdaDeploymentConfigType) {
    /**
     * Canary deployment type
     * @deprecated Use `LambdaDeploymentConfig`
     */
    CustomLambdaDeploymentConfigType["CANARY"] = "Canary";
    /**
     * Linear deployment type
     * @deprecated Use `LambdaDeploymentConfig`
     */
    CustomLambdaDeploymentConfigType["LINEAR"] = "Linear";
})(CustomLambdaDeploymentConfigType = exports.CustomLambdaDeploymentConfigType || (exports.CustomLambdaDeploymentConfigType = {}));
/**
 * A custom Deployment Configuration for a Lambda Deployment Group.
 * @resource AWS::CodeDeploy::DeploymentGroup
 * @deprecated CloudFormation now supports Lambda deployment configurations without custom resources. Use `LambdaDeploymentConfig`.
 */
class CustomLambdaDeploymentConfig extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfig", "CloudFormation now supports Lambda deployment configurations without custom resources. Use `LambdaDeploymentConfig`.");
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_CustomLambdaDeploymentConfigProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CustomLambdaDeploymentConfig);
            }
            throw error;
        }
        this.validateParameters(props);
        // In this section we make the argument for the AWS API call
        const deploymentType = 'TimeBased' + props.type.toString();
        const intervalMinutes = props.interval.toMinutes().toString();
        const percentage = props.percentage.toString();
        let routingConfig; // The argument to the AWS API call
        if (props.type == CustomLambdaDeploymentConfigType.CANARY) {
            routingConfig = {
                type: deploymentType,
                timeBasedCanary: {
                    canaryInterval: intervalMinutes,
                    canaryPercentage: percentage,
                },
            };
        }
        else if (props.type == CustomLambdaDeploymentConfigType.LINEAR) {
            routingConfig = {
                type: deploymentType,
                timeBasedLinear: {
                    linearInterval: intervalMinutes,
                    linearPercentage: percentage,
                },
            };
        }
        // Generates the name of the deployment config. It's also what you'll see in the AWS console
        // The name of the config is <construct unique id>.Lambda<deployment type><percentage>Percent<interval>Minutes
        // Unless the user provides an explicit name
        this.deploymentConfigName = props.deploymentConfigName
            ?? `${core_1.Names.uniqueId(this)}.Lambda${props.type}${props.percentage}Percent${props.type === CustomLambdaDeploymentConfigType.LINEAR
                ? 'Every'
                : ''}${props.interval.toMinutes()}Minutes`;
        this.deploymentConfigArn = utils_1.arnForDeploymentConfig(this.deploymentConfigName);
        // The AWS Custom Resource that calls CodeDeploy to create and delete the resource
        new custom_resources_1.AwsCustomResource(this, 'DeploymentConfig', {
            onCreate: {
                service: 'CodeDeploy',
                action: 'createDeploymentConfig',
                parameters: {
                    deploymentConfigName: this.deploymentConfigName,
                    computePlatform: 'Lambda',
                    trafficRoutingConfig: routingConfig,
                },
                // This `resourceName` is the initial physical ID of the config
                physicalResourceId: custom_resources_1.PhysicalResourceId.of(this.deploymentConfigName),
            },
            onUpdate: {
                service: 'CodeDeploy',
                action: 'createDeploymentConfig',
                parameters: {
                    deploymentConfigName: this.deploymentConfigName,
                    computePlatform: 'Lambda',
                    trafficRoutingConfig: routingConfig,
                },
                // If `resourceName` is different from the last stack update (or creation),
                // the old config gets deleted and the new one is created
                physicalResourceId: custom_resources_1.PhysicalResourceId.of(this.deploymentConfigName),
            },
            onDelete: {
                service: 'CodeDeploy',
                action: 'deleteDeploymentConfig',
                parameters: {
                    deploymentConfigName: this.deploymentConfigName,
                },
            },
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
            // APIs are available in 2.1055.0
            installLatestAwsSdk: false,
        });
        this.node.addValidation({ validate: () => utils_1.validateName('Deployment config', this.deploymentConfigName) });
    }
    // Validate the inputs. The percentage/interval limits come from CodeDeploy
    validateParameters(props) {
        if (!(1 <= props.percentage && props.percentage <= 99)) {
            throw new Error(`Invalid deployment config percentage "${props.percentage.toString()}". \
        Step percentage must be an integer between 1 and 99.`);
        }
        if (props.interval.toMinutes() > 2880) {
            throw new Error(`Invalid deployment config interval "${props.interval.toString()}". \
        Traffic shifting intervals must be positive integers up to 2880 (2 days).`);
        }
    }
}
exports.CustomLambdaDeploymentConfig = CustomLambdaDeploymentConfig;
_a = JSII_RTTI_SYMBOL_1;
CustomLambdaDeploymentConfig[_a] = { fqn: "@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfig", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWRlcGxveW1lbnQtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLWRlcGxveW1lbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUEwRDtBQUMxRCxnRUFBMkc7QUFHM0csNENBQXdFO0FBRXhFOzs7R0FHRztBQUNILElBQVksZ0NBWVg7QUFaRCxXQUFZLGdDQUFnQztJQUMxQzs7O09BR0c7SUFDSCxxREFBaUIsQ0FBQTtJQUVqQjs7O09BR0c7SUFDSCxxREFBaUIsQ0FBQTtBQUNuQixDQUFDLEVBWlcsZ0NBQWdDLEdBQWhDLHdDQUFnQyxLQUFoQyx3Q0FBZ0MsUUFZM0M7QUF1Q0Q7Ozs7R0FJRztBQUNILE1BQWEsNEJBQTZCLFNBQVEsZUFBUTtJQWdCeEQsWUFBbUIsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0M7UUFDdkYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OzsrQ0FqQlIsNEJBQTRCOzs7O1FBa0JyQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0IsNERBQTREO1FBQzVELE1BQU0sY0FBYyxHQUFHLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNELE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUQsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMvQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLG1DQUFtQztRQUN0RCxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksZ0NBQWdDLENBQUMsTUFBTSxFQUFFO1lBQ3pELGFBQWEsR0FBRztnQkFDZCxJQUFJLEVBQUUsY0FBYztnQkFDcEIsZUFBZSxFQUFFO29CQUNmLGNBQWMsRUFBRSxlQUFlO29CQUMvQixn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SUFBSSxLQUFLLENBQ2IsdUNBQXVDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO2tGQUNVLENBQUMsQ0FBQztTQUMvRTtLQUNGOztBQTFHSCxvRUEyR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiwgTmFtZXMsIFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBd3NDdXN0b21SZXNvdXJjZSwgQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3ksIFBoeXNpY2FsUmVzb3VyY2VJZCB9IGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJTGFtYmRhRGVwbG95bWVudENvbmZpZyB9IGZyb20gJy4vZGVwbG95bWVudC1jb25maWcnO1xuaW1wb3J0IHsgYXJuRm9yRGVwbG95bWVudENvbmZpZywgdmFsaWRhdGVOYW1lIH0gZnJvbSAnLi4vcHJpdmF0ZS91dGlscyc7XG5cbi8qKlxuICogTGFtYmRhIERlcGxveW1lbnQgY29uZmlnIHR5cGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgTGFtYmRhRGVwbG95bWVudENvbmZpZ2BcbiAqL1xuZXhwb3J0IGVudW0gQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZ1R5cGUge1xuICAvKipcbiAgICogQ2FuYXJ5IGRlcGxveW1lbnQgdHlwZVxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhbWJkYURlcGxveW1lbnRDb25maWdgXG4gICAqL1xuICBDQU5BUlkgPSAnQ2FuYXJ5JyxcblxuICAvKipcbiAgICogTGluZWFyIGRlcGxveW1lbnQgdHlwZVxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhbWJkYURlcGxveW1lbnRDb25maWdgXG4gICAqL1xuICBMSU5FQVIgPSAnTGluZWFyJ1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgb2YgYSByZWZlcmVuY2UgdG8gYSBDb2RlRGVwbG95IExhbWJkYSBEZXBsb3ltZW50IENvbmZpZ3VyYXRpb24uXG4gKiBAZGVwcmVjYXRlZCBVc2UgYExhbWJkYURlcGxveW1lbnRDb25maWdgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZ1Byb3BzIHtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgZGVwbG95bWVudCBjb25maWcsIGVpdGhlciBDQU5BUlkgb3IgTElORUFSXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTGFtYmRhRGVwbG95bWVudENvbmZpZ2BcbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IEN1c3RvbUxhbWJkYURlcGxveW1lbnRDb25maWdUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgaW50ZWdlciBwZXJjZW50YWdlIG9mIHRyYWZmaWMgdG8gc2hpZnQ6XG4gICAqIC0gRm9yIExJTkVBUiwgdGhlIHBlcmNlbnRhZ2UgdG8gc2hpZnQgZXZlcnkgaW50ZXJ2YWxcbiAgICogLSBGb3IgQ0FOQVJZLCB0aGUgcGVyY2VudGFnZSB0byBzaGlmdCB1bnRpbCB0aGUgaW50ZXJ2YWwgcGFzc2VzLCBiZWZvcmUgdGhlIGZ1bGwgZGVwbG95bWVudFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhbWJkYURlcGxveW1lbnRDb25maWdgXG4gICAqL1xuICByZWFkb25seSBwZXJjZW50YWdlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcnZhbCwgaW4gbnVtYmVyIG9mIG1pbnV0ZXM6XG4gICAqIC0gRm9yIExJTkVBUiwgaG93IGZyZXF1ZW50bHkgYWRkaXRpb25hbCB0cmFmZmljIGlzIHNoaWZ0ZWRcbiAgICogLSBGb3IgQ0FOQVJZLCBob3cgbG9uZyB0byBzaGlmdCB0cmFmZmljIGJlZm9yZSB0aGUgZnVsbCBkZXBsb3ltZW50XG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTGFtYmRhRGVwbG95bWVudENvbmZpZ2BcbiAgICovXG4gIHJlYWRvbmx5IGludGVydmFsOiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHZlcmJhdGltIG5hbWUgb2YgdGhlIGRlcGxveW1lbnQgY29uZmlnLiBNdXN0IGJlIHVuaXF1ZSBwZXIgYWNjb3VudC9yZWdpb24uXG4gICAqIE90aGVyIHBhcmFtZXRlcnMgY2Fubm90IGJlIHVwZGF0ZWQgaWYgdGhpcyBuYW1lIGlzIHByb3ZpZGVkLlxuICAgKiBAZGVmYXVsdCAtIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIG5hbWVcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBMYW1iZGFEZXBsb3ltZW50Q29uZmlnYFxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudENvbmZpZ05hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBjdXN0b20gRGVwbG95bWVudCBDb25maWd1cmF0aW9uIGZvciBhIExhbWJkYSBEZXBsb3ltZW50IEdyb3VwLlxuICogQHJlc291cmNlIEFXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwXG4gKiBAZGVwcmVjYXRlZCBDbG91ZEZvcm1hdGlvbiBub3cgc3VwcG9ydHMgTGFtYmRhIGRlcGxveW1lbnQgY29uZmlndXJhdGlvbnMgd2l0aG91dCBjdXN0b20gcmVzb3VyY2VzLiBVc2UgYExhbWJkYURlcGxveW1lbnRDb25maWdgLlxuICovXG5leHBvcnQgY2xhc3MgQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZyBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUxhbWJkYURlcGxveW1lbnRDb25maWcge1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZGVwbG95bWVudCBjb25maWdcbiAgICogQGF0dHJpYnV0ZVxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhbWJkYURlcGxveW1lbnRDb25maWdgXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95bWVudENvbmZpZ05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGFybiBvZiB0aGUgZGVwbG95bWVudCBjb25maWdcbiAgICogQGF0dHJpYnV0ZVxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYExhbWJkYURlcGxveW1lbnRDb25maWdgXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95bWVudENvbmZpZ0Fybjogc3RyaW5nO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZ1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICB0aGlzLnZhbGlkYXRlUGFyYW1ldGVycyhwcm9wcyk7XG5cbiAgICAvLyBJbiB0aGlzIHNlY3Rpb24gd2UgbWFrZSB0aGUgYXJndW1lbnQgZm9yIHRoZSBBV1MgQVBJIGNhbGxcbiAgICBjb25zdCBkZXBsb3ltZW50VHlwZSA9ICdUaW1lQmFzZWQnICsgcHJvcHMudHlwZS50b1N0cmluZygpO1xuICAgIGNvbnN0IGludGVydmFsTWludXRlcyA9IHByb3BzLmludGVydmFsLnRvTWludXRlcygpLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHByb3BzLnBlcmNlbnRhZ2UudG9TdHJpbmcoKTtcbiAgICBsZXQgcm91dGluZ0NvbmZpZzsgLy8gVGhlIGFyZ3VtZW50IHRvIHRoZSBBV1MgQVBJIGNhbGxcbiAgICBpZiAocHJvcHMudHlwZSA9PSBDdXN0b21MYW1iZGFEZXBsb3ltZW50Q29uZmlnVHlwZS5DQU5BUlkpIHtcbiAgICAgIHJvdXRpbmdDb25maWcgPSB7XG4gICAgICAgIHR5cGU6IGRlcGxveW1lbnRUeXBlLFxuICAgICAgICB0aW1lQmFzZWRDYW5hcnk6IHtcbiAgICAgICAgICBjYW5hcnlJbnRlcnZhbDogaW50ZXJ2YWxNaW51dGVzLFxuICAgICAgICAgIGNhbmFyeVBlcmNlbnRhZ2U6IHBlcmNlbnRhZ2UsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAocHJvcHMudHlwZSA9PSBDdXN0b21MYW1iZGFEZXBsb3ltZW50Q29uZmlnVHlwZS5MSU5FQVIpIHtcbiAgICAgIHJvdXRpbmdDb25maWcgPSB7XG4gICAgICAgIHR5cGU6IGRlcGxveW1lbnRUeXBlLFxuICAgICAgICB0aW1lQmFzZWRMaW5lYXI6IHtcbiAgICAgICAgICBsaW5lYXJJbnRlcnZhbDogaW50ZXJ2YWxNaW51dGVzLFxuICAgICAgICAgIGxpbmVhclBlcmNlbnRhZ2U6IHBlcmNlbnRhZ2UsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlcyB0aGUgbmFtZSBvZiB0aGUgZGVwbG95bWVudCBjb25maWcuIEl0J3MgYWxzbyB3aGF0IHlvdSdsbCBzZWUgaW4gdGhlIEFXUyBjb25zb2xlXG4gICAgLy8gVGhlIG5hbWUgb2YgdGhlIGNvbmZpZyBpcyA8Y29uc3RydWN0IHVuaXF1ZSBpZD4uTGFtYmRhPGRlcGxveW1lbnQgdHlwZT48cGVyY2VudGFnZT5QZXJjZW50PGludGVydmFsPk1pbnV0ZXNcbiAgICAvLyBVbmxlc3MgdGhlIHVzZXIgcHJvdmlkZXMgYW4gZXhwbGljaXQgbmFtZVxuICAgIHRoaXMuZGVwbG95bWVudENvbmZpZ05hbWUgPSBwcm9wcy5kZXBsb3ltZW50Q29uZmlnTmFtZVxuICAgICAgPz8gYCR7TmFtZXMudW5pcXVlSWQodGhpcyl9LkxhbWJkYSR7cHJvcHMudHlwZX0ke3Byb3BzLnBlcmNlbnRhZ2V9UGVyY2VudCR7cHJvcHMudHlwZSA9PT0gQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZ1R5cGUuTElORUFSXG4gICAgICAgID8gJ0V2ZXJ5J1xuICAgICAgICA6ICcnfSR7cHJvcHMuaW50ZXJ2YWwudG9NaW51dGVzKCl9TWludXRlc2A7XG4gICAgdGhpcy5kZXBsb3ltZW50Q29uZmlnQXJuID0gYXJuRm9yRGVwbG95bWVudENvbmZpZyh0aGlzLmRlcGxveW1lbnRDb25maWdOYW1lKTtcblxuICAgIC8vIFRoZSBBV1MgQ3VzdG9tIFJlc291cmNlIHRoYXQgY2FsbHMgQ29kZURlcGxveSB0byBjcmVhdGUgYW5kIGRlbGV0ZSB0aGUgcmVzb3VyY2VcbiAgICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2UodGhpcywgJ0RlcGxveW1lbnRDb25maWcnLCB7XG4gICAgICBvbkNyZWF0ZTogeyAvLyBSdW4gb24gY3JlYXRpb24gb25seSwgdG8gbWFrZSB0aGUgcmVzb3VyY2VcbiAgICAgICAgc2VydmljZTogJ0NvZGVEZXBsb3knLFxuICAgICAgICBhY3Rpb246ICdjcmVhdGVEZXBsb3ltZW50Q29uZmlnJyxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIGRlcGxveW1lbnRDb25maWdOYW1lOiB0aGlzLmRlcGxveW1lbnRDb25maWdOYW1lLFxuICAgICAgICAgIGNvbXB1dGVQbGF0Zm9ybTogJ0xhbWJkYScsXG4gICAgICAgICAgdHJhZmZpY1JvdXRpbmdDb25maWc6IHJvdXRpbmdDb25maWcsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFRoaXMgYHJlc291cmNlTmFtZWAgaXMgdGhlIGluaXRpYWwgcGh5c2ljYWwgSUQgb2YgdGhlIGNvbmZpZ1xuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZih0aGlzLmRlcGxveW1lbnRDb25maWdOYW1lKSxcbiAgICAgIH0sXG4gICAgICBvblVwZGF0ZTogeyAvLyBSdW4gb24gc3RhY2sgdXBkYXRlXG4gICAgICAgIHNlcnZpY2U6ICdDb2RlRGVwbG95JyxcbiAgICAgICAgYWN0aW9uOiAnY3JlYXRlRGVwbG95bWVudENvbmZpZycsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBkZXBsb3ltZW50Q29uZmlnTmFtZTogdGhpcy5kZXBsb3ltZW50Q29uZmlnTmFtZSxcbiAgICAgICAgICBjb21wdXRlUGxhdGZvcm06ICdMYW1iZGEnLFxuICAgICAgICAgIHRyYWZmaWNSb3V0aW5nQ29uZmlnOiByb3V0aW5nQ29uZmlnLFxuICAgICAgICB9LFxuICAgICAgICAvLyBJZiBgcmVzb3VyY2VOYW1lYCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbGFzdCBzdGFjayB1cGRhdGUgKG9yIGNyZWF0aW9uKSxcbiAgICAgICAgLy8gdGhlIG9sZCBjb25maWcgZ2V0cyBkZWxldGVkIGFuZCB0aGUgbmV3IG9uZSBpcyBjcmVhdGVkXG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKHRoaXMuZGVwbG95bWVudENvbmZpZ05hbWUpLFxuICAgICAgfSxcbiAgICAgIG9uRGVsZXRlOiB7IC8vIFJ1biBvbiBkZWxldGlvbiwgb3Igb24gcmVzb3VyY2UgcmVwbGFjZW1lbnRcbiAgICAgICAgc2VydmljZTogJ0NvZGVEZXBsb3knLFxuICAgICAgICBhY3Rpb246ICdkZWxldGVEZXBsb3ltZW50Q29uZmlnJyxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIGRlcGxveW1lbnRDb25maWdOYW1lOiB0aGlzLmRlcGxveW1lbnRDb25maWdOYW1lLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHtcbiAgICAgICAgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UsXG4gICAgICB9KSxcbiAgICAgIC8vIEFQSXMgYXJlIGF2YWlsYWJsZSBpbiAyLjEwNTUuMFxuICAgICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgfSk7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB2YWxpZGF0ZU5hbWUoJ0RlcGxveW1lbnQgY29uZmlnJywgdGhpcy5kZXBsb3ltZW50Q29uZmlnTmFtZSkgfSk7XG4gIH1cblxuICAvLyBWYWxpZGF0ZSB0aGUgaW5wdXRzLiBUaGUgcGVyY2VudGFnZS9pbnRlcnZhbCBsaW1pdHMgY29tZSBmcm9tIENvZGVEZXBsb3lcbiAgcHJpdmF0ZSB2YWxpZGF0ZVBhcmFtZXRlcnMocHJvcHM6IEN1c3RvbUxhbWJkYURlcGxveW1lbnRDb25maWdQcm9wcyk6IHZvaWQge1xuICAgIGlmICggISgxIDw9IHByb3BzLnBlcmNlbnRhZ2UgJiYgcHJvcHMucGVyY2VudGFnZSA8PSA5OSkgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIGRlcGxveW1lbnQgY29uZmlnIHBlcmNlbnRhZ2UgXCIke3Byb3BzLnBlcmNlbnRhZ2UudG9TdHJpbmcoKX1cIi4gXFxcbiAgICAgICAgU3RlcCBwZXJjZW50YWdlIG11c3QgYmUgYW4gaW50ZWdlciBiZXR3ZWVuIDEgYW5kIDk5LmApO1xuICAgIH1cbiAgICBpZiAocHJvcHMuaW50ZXJ2YWwudG9NaW51dGVzKCkgPiAyODgwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIGRlcGxveW1lbnQgY29uZmlnIGludGVydmFsIFwiJHtwcm9wcy5pbnRlcnZhbC50b1N0cmluZygpfVwiLiBcXFxuICAgICAgICBUcmFmZmljIHNoaWZ0aW5nIGludGVydmFscyBtdXN0IGJlIHBvc2l0aXZlIGludGVnZXJzIHVwIHRvIDI4ODAgKDIgZGF5cykuYCk7XG4gICAgfVxuICB9XG59XG4iXX0=