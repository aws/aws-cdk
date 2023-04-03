"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FargatePlatformVersion = exports.FargateService = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const base_service_1 = require("../base/base-service");
const from_service_attributes_1 = require("../base/from-service-attributes");
/**
 * This creates a service using the Fargate launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
class FargateService extends base_service_1.BaseService {
    /**
     * Constructs a new instance of the FargateService class.
     */
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_FargateServiceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, FargateService);
            }
            throw error;
        }
        if (!props.taskDefinition.isFargateCompatible) {
            throw new Error('Supplied TaskDefinition is not configured for compatibility with Fargate');
        }
        if (props.securityGroup !== undefined && props.securityGroups !== undefined) {
            throw new Error('Only one of SecurityGroup or SecurityGroups can be populated.');
        }
        super(scope, id, {
            ...props,
            desiredCount: props.desiredCount,
            launchType: base_service_1.LaunchType.FARGATE,
            capacityProviderStrategies: props.capacityProviderStrategies,
            enableECSManagedTags: props.enableECSManagedTags,
        }, {
            cluster: props.cluster.clusterName,
            taskDefinition: props.deploymentController?.type === base_service_1.DeploymentControllerType.EXTERNAL ? undefined : props.taskDefinition.taskDefinitionArn,
            platformVersion: props.platformVersion,
        }, props.taskDefinition);
        let securityGroups;
        if (props.securityGroup !== undefined) {
            securityGroups = [props.securityGroup];
        }
        else if (props.securityGroups !== undefined) {
            securityGroups = props.securityGroups;
        }
        this.configureAwsVpcNetworkingWithSecurityGroups(props.cluster.vpc, props.assignPublicIp, props.vpcSubnets, securityGroups);
        this.node.addValidation({
            validate: () => this.taskDefinition.referencesSecretJsonField
                && props.platformVersion
                && SECRET_JSON_FIELD_UNSUPPORTED_PLATFORM_VERSIONS.includes(props.platformVersion)
                ? [`The task definition of this service uses at least one container that references a secret JSON field. This feature requires platform version ${FargatePlatformVersion.VERSION1_4} or later.`]
                : [],
        });
        this.node.addValidation({
            validate: () => !this.taskDefinition.defaultContainer ? ['A TaskDefinition must have at least one essential container'] : [],
        });
    }
    /**
     * Imports from the specified service ARN.
     */
    static fromFargateServiceArn(scope, id, fargateServiceArn) {
        class Import extends cdk.Resource {
            constructor() {
                super(...arguments);
                this.serviceArn = fargateServiceArn;
                this.serviceName = from_service_attributes_1.extractServiceNameFromArn(this, fargateServiceArn);
            }
        }
        return new Import(scope, id);
    }
    /**
     * Imports from the specified service attributes.
     */
    static fromFargateServiceAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_FargateServiceAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromFargateServiceAttributes);
            }
            throw error;
        }
        return from_service_attributes_1.fromServiceAttributes(scope, id, attrs);
    }
}
exports.FargateService = FargateService;
_a = JSII_RTTI_SYMBOL_1;
FargateService[_a] = { fqn: "@aws-cdk/aws-ecs.FargateService", version: "0.0.0" };
/**
 * The platform version on which to run your service.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
 */
var FargatePlatformVersion;
(function (FargatePlatformVersion) {
    /**
     * The latest, recommended platform version.
     */
    FargatePlatformVersion["LATEST"] = "LATEST";
    /**
     * Version 1.4.0
     *
     * Supports EFS endpoints, CAP_SYS_PTRACE Linux capability,
     * network performance metrics in CloudWatch Container Insights,
     * consolidated 20 GB ephemeral volume.
     */
    FargatePlatformVersion["VERSION1_4"] = "1.4.0";
    /**
     * Version 1.3.0
     *
     * Supports secrets, task recycling.
     */
    FargatePlatformVersion["VERSION1_3"] = "1.3.0";
    /**
     * Version 1.2.0
     *
     * Supports private registries.
     */
    FargatePlatformVersion["VERSION1_2"] = "1.2.0";
    /**
     * Version 1.1.0
     *
     * Supports task metadata, health checks, service discovery.
     */
    FargatePlatformVersion["VERSION1_1"] = "1.1.0";
    /**
     * Initial release
     *
     * Based on Amazon Linux 2017.09.
     */
    FargatePlatformVersion["VERSION1_0"] = "1.0.0";
})(FargatePlatformVersion = exports.FargatePlatformVersion || (exports.FargatePlatformVersion = {}));
const SECRET_JSON_FIELD_UNSUPPORTED_PLATFORM_VERSIONS = [
    FargatePlatformVersion.VERSION1_0,
    FargatePlatformVersion.VERSION1_1,
    FargatePlatformVersion.VERSION1_2,
    FargatePlatformVersion.VERSION1_3,
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFyZ2F0ZS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHFDQUFxQztBQUVyQyx1REFBcUk7QUFDckksNkVBQW1HO0FBeUZuRzs7OztHQUlHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsMEJBQVc7SUFvQjdDOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjs7Ozs7OytDQXZCekQsY0FBYzs7OztRQXdCdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUU7WUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO1NBQzdGO1FBRUQsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtZQUMzRSxNQUFNLElBQUksS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7U0FDbEY7UUFFRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLEdBQUcsS0FBSztZQUNSLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxVQUFVLEVBQUUseUJBQVUsQ0FBQyxPQUFPO1lBQzlCLDBCQUEwQixFQUFFLEtBQUssQ0FBQywwQkFBMEI7WUFDNUQsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLG9CQUFvQjtTQUNqRCxFQUFFO1lBQ0QsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNsQyxjQUFjLEVBQUUsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksS0FBSyx1Q0FBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUI7WUFDM0ksZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO1NBQ3ZDLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXpCLElBQUksY0FBYyxDQUFDO1FBQ25CLElBQUksS0FBSyxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUU7WUFDckMsY0FBYyxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3hDO2FBQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtZQUM3QyxjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztTQUN2QztRQUVELElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFNUgsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDdEIsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMseUJBQXlCO21CQUMxRCxLQUFLLENBQUMsZUFBZTttQkFDckIsK0NBQStDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7Z0JBQ2hGLENBQUMsQ0FBQyxDQUFDLCtJQUErSSxzQkFBc0IsQ0FBQyxVQUFVLFlBQVksQ0FBQztnQkFDaE0sQ0FBQyxDQUFDLEVBQUU7U0FDUCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUN0QixRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLDZEQUE2RCxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDN0gsQ0FBQyxDQUFDO0tBQ0o7SUE5REQ7O09BRUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsaUJBQXlCO1FBQ3pGLE1BQU0sTUFBTyxTQUFRLEdBQUcsQ0FBQyxRQUFRO1lBQWpDOztnQkFDa0IsZUFBVSxHQUFHLGlCQUFpQixDQUFDO2dCQUMvQixnQkFBVyxHQUFHLG1EQUF5QixDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ25GLENBQUM7U0FBQTtRQUNELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsNEJBQTRCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBK0I7Ozs7Ozs7Ozs7UUFDdEcsT0FBTywrQ0FBcUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2hEOztBQWxCSCx3Q0FpRUM7OztBQUVEOzs7O0dBSUc7QUFDSCxJQUFZLHNCQTBDWDtBQTFDRCxXQUFZLHNCQUFzQjtJQUNoQzs7T0FFRztJQUNILDJDQUFpQixDQUFBO0lBRWpCOzs7Ozs7T0FNRztJQUNILDhDQUFvQixDQUFBO0lBRXBCOzs7O09BSUc7SUFDSCw4Q0FBb0IsQ0FBQTtJQUVwQjs7OztPQUlHO0lBQ0gsOENBQW9CLENBQUE7SUFFcEI7Ozs7T0FJRztJQUNILDhDQUFvQixDQUFBO0lBRXBCOzs7O09BSUc7SUFDSCw4Q0FBb0IsQ0FBQTtBQUN0QixDQUFDLEVBMUNXLHNCQUFzQixHQUF0Qiw4QkFBc0IsS0FBdEIsOEJBQXNCLFFBMENqQztBQUVELE1BQU0sK0NBQStDLEdBQUc7SUFDdEQsc0JBQXNCLENBQUMsVUFBVTtJQUNqQyxzQkFBc0IsQ0FBQyxVQUFVO0lBQ2pDLHNCQUFzQixDQUFDLFVBQVU7SUFDakMsc0JBQXNCLENBQUMsVUFBVTtDQUNsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCYXNlU2VydmljZSwgQmFzZVNlcnZpY2VPcHRpb25zLCBEZXBsb3ltZW50Q29udHJvbGxlclR5cGUsIElCYXNlU2VydmljZSwgSVNlcnZpY2UsIExhdW5jaFR5cGUgfSBmcm9tICcuLi9iYXNlL2Jhc2Utc2VydmljZSc7XG5pbXBvcnQgeyBmcm9tU2VydmljZUF0dHJpYnV0ZXMsIGV4dHJhY3RTZXJ2aWNlTmFtZUZyb21Bcm4gfSBmcm9tICcuLi9iYXNlL2Zyb20tc2VydmljZS1hdHRyaWJ1dGVzJztcbmltcG9ydCB7IFRhc2tEZWZpbml0aW9uIH0gZnJvbSAnLi4vYmFzZS90YXNrLWRlZmluaXRpb24nO1xuaW1wb3J0IHsgSUNsdXN0ZXIgfSBmcm9tICcuLi9jbHVzdGVyJztcblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBzZXJ2aWNlIHVzaW5nIHRoZSBGYXJnYXRlIGxhdW5jaCB0eXBlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZhcmdhdGVTZXJ2aWNlUHJvcHMgZXh0ZW5kcyBCYXNlU2VydmljZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHRhc2sgZGVmaW5pdGlvbiB0byB1c2UgZm9yIHRhc2tzIGluIHRoZSBzZXJ2aWNlLlxuICAgKlxuICAgKiBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXVxuICAgKi9cbiAgcmVhZG9ubHkgdGFza0RlZmluaXRpb246IFRhc2tEZWZpbml0aW9uO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0aGUgdGFzaydzIGVsYXN0aWMgbmV0d29yayBpbnRlcmZhY2UgcmVjZWl2ZXMgYSBwdWJsaWMgSVAgYWRkcmVzcy5cbiAgICpcbiAgICogSWYgdHJ1ZSwgZWFjaCB0YXNrIHdpbGwgcmVjZWl2ZSBhIHB1YmxpYyBJUCBhZGRyZXNzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYXNzaWduUHVibGljSXA/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgc3VibmV0cyB0byBhc3NvY2lhdGUgd2l0aCB0aGUgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBQdWJsaWMgc3VibmV0cyBpZiBgYXNzaWduUHVibGljSXBgIGlzIHNldCwgb3RoZXJ3aXNlIHRoZSBmaXJzdCBhdmFpbGFibGUgb25lIG9mIFByaXZhdGUsIElzb2xhdGVkLCBQdWJsaWMsIGluIHRoYXQgb3JkZXIuXG4gICAqL1xuICByZWFkb25seSB2cGNTdWJuZXRzPzogZWMyLlN1Ym5ldFNlbGVjdGlvbjtcblxuICAvKipcbiAgICogVGhlIHNlY3VyaXR5IGdyb3VwcyB0byBhc3NvY2lhdGUgd2l0aCB0aGUgc2VydmljZS4gSWYgeW91IGRvIG5vdCBzcGVjaWZ5IGEgc2VjdXJpdHkgZ3JvdXAsIGEgbmV3IHNlY3VyaXR5IGdyb3VwIGlzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuZXcgc2VjdXJpdHkgZ3JvdXAgaXMgY3JlYXRlZC5cbiAgICogQGRlcHJlY2F0ZWQgdXNlIHNlY3VyaXR5R3JvdXBzIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwPzogZWMyLklTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VjdXJpdHkgZ3JvdXBzIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBzZXJ2aWNlLiBJZiB5b3UgZG8gbm90IHNwZWNpZnkgYSBzZWN1cml0eSBncm91cCwgYSBuZXcgc2VjdXJpdHkgZ3JvdXAgaXMgY3JlYXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyBzZWN1cml0eSBncm91cCBpcyBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBlYzIuSVNlY3VyaXR5R3JvdXBbXTtcblxuICAvKipcbiAgICogVGhlIHBsYXRmb3JtIHZlcnNpb24gb24gd2hpY2ggdG8gcnVuIHlvdXIgc2VydmljZS5cbiAgICpcbiAgICogSWYgb25lIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBMQVRFU1QgcGxhdGZvcm0gdmVyc2lvbiBpcyB1c2VkIGJ5IGRlZmF1bHQuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAgICogW0FXUyBGYXJnYXRlIFBsYXRmb3JtIFZlcnNpb25zXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9wbGF0Zm9ybV92ZXJzaW9ucy5odG1sKVxuICAgKiBpbiB0aGUgQW1hem9uIEVsYXN0aWMgQ29udGFpbmVyIFNlcnZpY2UgRGV2ZWxvcGVyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBMYXRlc3RcbiAgICovXG4gIHJlYWRvbmx5IHBsYXRmb3JtVmVyc2lvbj86IEZhcmdhdGVQbGF0Zm9ybVZlcnNpb247XG59XG5cbi8qKlxuICogVGhlIGludGVyZmFjZSBmb3IgYSBzZXJ2aWNlIHVzaW5nIHRoZSBGYXJnYXRlIGxhdW5jaCB0eXBlIG9uIGFuIEVDUyBjbHVzdGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGYXJnYXRlU2VydmljZSBleHRlbmRzIElTZXJ2aWNlIHtcblxufVxuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIHRvIGltcG9ydCBmcm9tIHRoZSBzZXJ2aWNlIHVzaW5nIHRoZSBGYXJnYXRlIGxhdW5jaCB0eXBlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZhcmdhdGVTZXJ2aWNlQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciB0aGF0IGhvc3RzIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlcjogSUNsdXN0ZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzZXJ2aWNlIEFSTi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBlaXRoZXIgdGhpcywgb3IgYHNlcnZpY2VOYW1lYCwgaXMgcmVxdWlyZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VBcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGVpdGhlciB0aGlzLCBvciBgc2VydmljZUFybmAsIGlzIHJlcXVpcmVkXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlTmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGlzIGNyZWF0ZXMgYSBzZXJ2aWNlIHVzaW5nIHRoZSBGYXJnYXRlIGxhdW5jaCB0eXBlIG9uIGFuIEVDUyBjbHVzdGVyLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkVDUzo6U2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgRmFyZ2F0ZVNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSBpbXBsZW1lbnRzIElGYXJnYXRlU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgZnJvbSB0aGUgc3BlY2lmaWVkIHNlcnZpY2UgQVJOLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRmFyZ2F0ZVNlcnZpY2VBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZmFyZ2F0ZVNlcnZpY2VBcm46IHN0cmluZyk6IElGYXJnYXRlU2VydmljZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgSUZhcmdhdGVTZXJ2aWNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlQXJuID0gZmFyZ2F0ZVNlcnZpY2VBcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZU5hbWUgPSBleHRyYWN0U2VydmljZU5hbWVGcm9tQXJuKHRoaXMsIGZhcmdhdGVTZXJ2aWNlQXJuKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGZyb20gdGhlIHNwZWNpZmllZCBzZXJ2aWNlIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21GYXJnYXRlU2VydmljZUF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IEZhcmdhdGVTZXJ2aWNlQXR0cmlidXRlcyk6IElCYXNlU2VydmljZSB7XG4gICAgcmV0dXJuIGZyb21TZXJ2aWNlQXR0cmlidXRlcyhzY29wZSwgaWQsIGF0dHJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBGYXJnYXRlU2VydmljZSBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGYXJnYXRlU2VydmljZVByb3BzKSB7XG4gICAgaWYgKCFwcm9wcy50YXNrRGVmaW5pdGlvbi5pc0ZhcmdhdGVDb21wYXRpYmxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBsaWVkIFRhc2tEZWZpbml0aW9uIGlzIG5vdCBjb25maWd1cmVkIGZvciBjb21wYXRpYmlsaXR5IHdpdGggRmFyZ2F0ZScpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5zZWN1cml0eUdyb3VwICE9PSB1bmRlZmluZWQgJiYgcHJvcHMuc2VjdXJpdHlHcm91cHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBvZiBTZWN1cml0eUdyb3VwIG9yIFNlY3VyaXR5R3JvdXBzIGNhbiBiZSBwb3B1bGF0ZWQuJyk7XG4gICAgfVxuXG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGRlc2lyZWRDb3VudDogcHJvcHMuZGVzaXJlZENvdW50LFxuICAgICAgbGF1bmNoVHlwZTogTGF1bmNoVHlwZS5GQVJHQVRFLFxuICAgICAgY2FwYWNpdHlQcm92aWRlclN0cmF0ZWdpZXM6IHByb3BzLmNhcGFjaXR5UHJvdmlkZXJTdHJhdGVnaWVzLFxuICAgICAgZW5hYmxlRUNTTWFuYWdlZFRhZ3M6IHByb3BzLmVuYWJsZUVDU01hbmFnZWRUYWdzLFxuICAgIH0sIHtcbiAgICAgIGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICB0YXNrRGVmaW5pdGlvbjogcHJvcHMuZGVwbG95bWVudENvbnRyb2xsZXI/LnR5cGUgPT09IERlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FWFRFUk5BTCA/IHVuZGVmaW5lZCA6IHByb3BzLnRhc2tEZWZpbml0aW9uLnRhc2tEZWZpbml0aW9uQXJuLFxuICAgICAgcGxhdGZvcm1WZXJzaW9uOiBwcm9wcy5wbGF0Zm9ybVZlcnNpb24sXG4gICAgfSwgcHJvcHMudGFza0RlZmluaXRpb24pO1xuXG4gICAgbGV0IHNlY3VyaXR5R3JvdXBzO1xuICAgIGlmIChwcm9wcy5zZWN1cml0eUdyb3VwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlY3VyaXR5R3JvdXBzID0gW3Byb3BzLnNlY3VyaXR5R3JvdXBdO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuc2VjdXJpdHlHcm91cHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc2VjdXJpdHlHcm91cHMgPSBwcm9wcy5zZWN1cml0eUdyb3VwcztcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZUF3c1ZwY05ldHdvcmtpbmdXaXRoU2VjdXJpdHlHcm91cHMocHJvcHMuY2x1c3Rlci52cGMsIHByb3BzLmFzc2lnblB1YmxpY0lwLCBwcm9wcy52cGNTdWJuZXRzLCBzZWN1cml0eUdyb3Vwcyk7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7XG4gICAgICB2YWxpZGF0ZTogKCkgPT4gdGhpcy50YXNrRGVmaW5pdGlvbi5yZWZlcmVuY2VzU2VjcmV0SnNvbkZpZWxkXG4gICAgICAmJiBwcm9wcy5wbGF0Zm9ybVZlcnNpb25cbiAgICAgICYmIFNFQ1JFVF9KU09OX0ZJRUxEX1VOU1VQUE9SVEVEX1BMQVRGT1JNX1ZFUlNJT05TLmluY2x1ZGVzKHByb3BzLnBsYXRmb3JtVmVyc2lvbilcbiAgICAgICAgPyBbYFRoZSB0YXNrIGRlZmluaXRpb24gb2YgdGhpcyBzZXJ2aWNlIHVzZXMgYXQgbGVhc3Qgb25lIGNvbnRhaW5lciB0aGF0IHJlZmVyZW5jZXMgYSBzZWNyZXQgSlNPTiBmaWVsZC4gVGhpcyBmZWF0dXJlIHJlcXVpcmVzIHBsYXRmb3JtIHZlcnNpb24gJHtGYXJnYXRlUGxhdGZvcm1WZXJzaW9uLlZFUlNJT04xXzR9IG9yIGxhdGVyLmBdXG4gICAgICAgIDogW10sXG4gICAgfSk7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7XG4gICAgICB2YWxpZGF0ZTogKCkgPT4gIXRoaXMudGFza0RlZmluaXRpb24uZGVmYXVsdENvbnRhaW5lciA/IFsnQSBUYXNrRGVmaW5pdGlvbiBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGVzc2VudGlhbCBjb250YWluZXInXSA6IFtdLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIHBsYXRmb3JtIHZlcnNpb24gb24gd2hpY2ggdG8gcnVuIHlvdXIgc2VydmljZS5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3BsYXRmb3JtX3ZlcnNpb25zLmh0bWxcbiAqL1xuZXhwb3J0IGVudW0gRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbiB7XG4gIC8qKlxuICAgKiBUaGUgbGF0ZXN0LCByZWNvbW1lbmRlZCBwbGF0Zm9ybSB2ZXJzaW9uLlxuICAgKi9cbiAgTEFURVNUID0gJ0xBVEVTVCcsXG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMS40LjBcbiAgICpcbiAgICogU3VwcG9ydHMgRUZTIGVuZHBvaW50cywgQ0FQX1NZU19QVFJBQ0UgTGludXggY2FwYWJpbGl0eSxcbiAgICogbmV0d29yayBwZXJmb3JtYW5jZSBtZXRyaWNzIGluIENsb3VkV2F0Y2ggQ29udGFpbmVyIEluc2lnaHRzLFxuICAgKiBjb25zb2xpZGF0ZWQgMjAgR0IgZXBoZW1lcmFsIHZvbHVtZS5cbiAgICovXG4gIFZFUlNJT04xXzQgPSAnMS40LjAnLFxuXG4gIC8qKlxuICAgKiBWZXJzaW9uIDEuMy4wXG4gICAqXG4gICAqIFN1cHBvcnRzIHNlY3JldHMsIHRhc2sgcmVjeWNsaW5nLlxuICAgKi9cbiAgVkVSU0lPTjFfMyA9ICcxLjMuMCcsXG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMS4yLjBcbiAgICpcbiAgICogU3VwcG9ydHMgcHJpdmF0ZSByZWdpc3RyaWVzLlxuICAgKi9cbiAgVkVSU0lPTjFfMiA9ICcxLjIuMCcsXG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMS4xLjBcbiAgICpcbiAgICogU3VwcG9ydHMgdGFzayBtZXRhZGF0YSwgaGVhbHRoIGNoZWNrcywgc2VydmljZSBkaXNjb3ZlcnkuXG4gICAqL1xuICBWRVJTSU9OMV8xID0gJzEuMS4wJyxcblxuICAvKipcbiAgICogSW5pdGlhbCByZWxlYXNlXG4gICAqXG4gICAqIEJhc2VkIG9uIEFtYXpvbiBMaW51eCAyMDE3LjA5LlxuICAgKi9cbiAgVkVSU0lPTjFfMCA9ICcxLjAuMCcsXG59XG5cbmNvbnN0IFNFQ1JFVF9KU09OX0ZJRUxEX1VOU1VQUE9SVEVEX1BMQVRGT1JNX1ZFUlNJT05TID0gW1xuICBGYXJnYXRlUGxhdGZvcm1WZXJzaW9uLlZFUlNJT04xXzAsXG4gIEZhcmdhdGVQbGF0Zm9ybVZlcnNpb24uVkVSU0lPTjFfMSxcbiAgRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbi5WRVJTSU9OMV8yLFxuICBGYXJnYXRlUGxhdGZvcm1WZXJzaW9uLlZFUlNJT04xXzMsXG5dO1xuIl19