"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalService = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const base_service_1 = require("../base/base-service");
const from_service_attributes_1 = require("../base/from-service-attributes");
const task_definition_1 = require("../base/task-definition");
/**
 * This creates a service using the External launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
class ExternalService extends base_service_1.BaseService {
    /**
     * Constructs a new instance of the ExternalService class.
     */
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ExternalServiceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ExternalService);
            }
            throw error;
        }
        if (props.minHealthyPercent !== undefined && props.maxHealthyPercent !== undefined && props.minHealthyPercent >= props.maxHealthyPercent) {
            throw new Error('Minimum healthy percent must be less than maximum healthy percent.');
        }
        if (props.taskDefinition.compatibility !== task_definition_1.Compatibility.EXTERNAL) {
            throw new Error('Supplied TaskDefinition is not configured for compatibility with ECS Anywhere cluster');
        }
        if (props.cluster.defaultCloudMapNamespace !== undefined) {
            throw new Error(`Cloud map integration is not supported for External service ${props.cluster.defaultCloudMapNamespace}`);
        }
        if (props.cloudMapOptions !== undefined) {
            throw new Error('Cloud map options are not supported for External service');
        }
        if (props.enableExecuteCommand !== undefined) {
            throw new Error('Enable Execute Command options are not supported for External service');
        }
        if (props.capacityProviderStrategies !== undefined) {
            throw new Error('Capacity Providers are not supported for External service');
        }
        const propagateTagsFromSource = props.propagateTags ?? base_service_1.PropagatedTagSource.NONE;
        super(scope, id, {
            ...props,
            desiredCount: props.desiredCount,
            maxHealthyPercent: props.maxHealthyPercent === undefined ? 100 : props.maxHealthyPercent,
            minHealthyPercent: props.minHealthyPercent === undefined ? 0 : props.minHealthyPercent,
            launchType: base_service_1.LaunchType.EXTERNAL,
            propagateTags: propagateTagsFromSource,
            enableECSManagedTags: props.enableECSManagedTags,
        }, {
            cluster: props.cluster.clusterName,
            taskDefinition: props.deploymentController?.type === base_service_1.DeploymentControllerType.EXTERNAL ? undefined : props.taskDefinition.taskDefinitionArn,
        }, props.taskDefinition);
        this.node.addValidation({
            validate: () => !this.taskDefinition.defaultContainer ? ['A TaskDefinition must have at least one essential container'] : [],
        });
        this.node.addValidation({
            validate: () => this.networkConfiguration !== undefined ? ['Network configurations not supported for an external service'] : [],
        });
    }
    /**
     * Imports from the specified service ARN.
     */
    static fromExternalServiceArn(scope, id, externalServiceArn) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.serviceArn = externalServiceArn;
                this.serviceName = core_1.Stack.of(scope).splitArn(externalServiceArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Imports from the specified service attributes.
     */
    static fromExternalServiceAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ExternalServiceAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromExternalServiceAttributes);
            }
            throw error;
        }
        return from_service_attributes_1.fromServiceAttributes(scope, id, attrs);
    }
    /**
     * Overriden method to throw error as `attachToApplicationTargetGroup` is not supported for external service
     */
    attachToApplicationTargetGroup(_targetGroup) {
        throw new Error('Application load balancer cannot be attached to an external service');
    }
    /**
     * Overriden method to throw error as `loadBalancerTarget` is not supported for external service
     */
    loadBalancerTarget(_options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_LoadBalancerTargetOptions(_options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.loadBalancerTarget);
            }
            throw error;
        }
        throw new Error('External service cannot be attached as load balancer targets');
    }
    /**
     * Overriden method to throw error as `registerLoadBalancerTargets` is not supported for external service
     */
    registerLoadBalancerTargets(..._targets) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_EcsTarget(_targets);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerLoadBalancerTargets);
            }
            throw error;
        }
        throw new Error('External service cannot be registered as load balancer targets');
    }
    /**
     * Overriden method to throw error as `configureAwsVpcNetworkingWithSecurityGroups` is not supported for external service
     */
    // eslint-disable-next-line max-len, no-unused-vars
    configureAwsVpcNetworkingWithSecurityGroups(_vpc, _assignPublicIp, _vpcSubnets, _securityGroups) {
        throw new Error('Only Bridge network mode is supported for external service');
    }
    /**
     * Overriden method to throw error as `autoScaleTaskCount` is not supported for external service
     */
    autoScaleTaskCount(_props) {
        throw new Error('Autoscaling not supported for external service');
    }
    /**
     * Overriden method to throw error as `enableCloudMap` is not supported for external service
     */
    enableCloudMap(_options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_CloudMapOptions(_options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.enableCloudMap);
            }
            throw error;
        }
        throw new Error('Cloud map integration not supported for an external service');
    }
    /**
     * Overriden method to throw error as `associateCloudMapService` is not supported for external service
     */
    associateCloudMapService(_options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AssociateCloudMapServiceOptions(_options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.associateCloudMapService);
            }
            throw error;
        }
        throw new Error('Cloud map service association is not supported for an external service');
    }
}
exports.ExternalService = ExternalService;
_a = JSII_RTTI_SYMBOL_1;
ExternalService[_a] = { fqn: "@aws-cdk/aws-ecs.ExternalService", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJuYWwtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4dGVybmFsLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsd0NBQTJEO0FBRTNELHVEQUErTztBQUMvTyw2RUFBd0U7QUFFeEUsNkRBQW1HO0FBcURuRzs7OztHQUlHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLDBCQUFXO0lBb0I5Qzs7T0FFRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7Ozs7OzsrQ0F2QjFELGVBQWU7Ozs7UUF3QnhCLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEVBQUU7WUFDeEksTUFBTSxJQUFJLEtBQUssQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO1NBQ3ZGO1FBRUQsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLGFBQWEsS0FBSywrQkFBYSxDQUFDLFFBQVEsRUFBRTtZQUNqRSxNQUFNLElBQUksS0FBSyxDQUFDLHVGQUF1RixDQUFDLENBQUM7U0FDMUc7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEtBQUssU0FBUyxFQUFFO1lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUUsK0RBQStELEtBQUssQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDO1NBQzNIO1FBRUQsSUFBSSxLQUFLLENBQUMsZUFBZSxLQUFLLFNBQVMsRUFBRTtZQUN2QyxNQUFNLElBQUksS0FBSyxDQUFFLDBEQUEwRCxDQUFDLENBQUM7U0FDOUU7UUFFRCxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7WUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBRSx1RUFBdUUsQ0FBQyxDQUFDO1NBQzNGO1FBRUQsSUFBSSxLQUFLLENBQUMsMEJB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Q0FBMkMsQ0FBQyxJQUFjLEVBQUUsZUFBeUIsRUFBRSxXQUFpQyxFQUFFLGVBQXNDO1FBQ3hLLE1BQU0sSUFBSSxLQUFLLENBQUUsNERBQTRELENBQUMsQ0FBQztLQUNoRjtJQUVEOztPQUVHO0lBQ0ksa0JBQWtCLENBQUMsTUFBcUM7UUFDN0QsTUFBTSxJQUFJLEtBQUssQ0FBRSxnREFBZ0QsQ0FBQyxDQUFDO0tBQ3BFO0lBRUQ7O09BRUc7SUFDSSxjQUFjLENBQUMsUUFBeUI7Ozs7Ozs7Ozs7UUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBRSw2REFBNkQsQ0FBQyxDQUFDO0tBQ2pGO0lBRUQ7O09BRUc7SUFDSSx3QkFBd0IsQ0FBQyxRQUF5Qzs7Ozs7Ozs7OztRQUN2RSxNQUFNLElBQUksS0FBSyxDQUFFLHdFQUF3RSxDQUFDLENBQUM7S0FDNUY7O0FBekhILDBDQTBIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHNjYWxpbmcgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcGxpY2F0aW9uYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0ICogYXMgY2xvdWRtYXAgZnJvbSAnQGF3cy1jZGsvYXdzLXNlcnZpY2VkaXNjb3ZlcnknO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBSZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQXNzb2NpYXRlQ2xvdWRNYXBTZXJ2aWNlT3B0aW9ucywgQmFzZVNlcnZpY2UsIEJhc2VTZXJ2aWNlT3B0aW9ucywgQ2xvdWRNYXBPcHRpb25zLCBEZXBsb3ltZW50Q29udHJvbGxlclR5cGUsIEVjc1RhcmdldCwgSUJhc2VTZXJ2aWNlLCBJRWNzTG9hZEJhbGFuY2VyVGFyZ2V0LCBJU2VydmljZSwgTGF1bmNoVHlwZSwgUHJvcGFnYXRlZFRhZ1NvdXJjZSB9IGZyb20gJy4uL2Jhc2UvYmFzZS1zZXJ2aWNlJztcbmltcG9ydCB7IGZyb21TZXJ2aWNlQXR0cmlidXRlcyB9IGZyb20gJy4uL2Jhc2UvZnJvbS1zZXJ2aWNlLWF0dHJpYnV0ZXMnO1xuaW1wb3J0IHsgU2NhbGFibGVUYXNrQ291bnQgfSBmcm9tICcuLi9iYXNlL3NjYWxhYmxlLXRhc2stY291bnQnO1xuaW1wb3J0IHsgQ29tcGF0aWJpbGl0eSwgTG9hZEJhbGFuY2VyVGFyZ2V0T3B0aW9ucywgVGFza0RlZmluaXRpb24gfSBmcm9tICcuLi9iYXNlL3Rhc2stZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBJQ2x1c3RlciB9IGZyb20gJy4uL2NsdXN0ZXInO1xuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBzZXJ2aWNlIHVzaW5nIHRoZSBFeHRlcm5hbCBsYXVuY2ggdHlwZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFeHRlcm5hbFNlcnZpY2VQcm9wcyBleHRlbmRzIEJhc2VTZXJ2aWNlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgdGFzayBkZWZpbml0aW9uIHRvIHVzZSBmb3IgdGFza3MgaW4gdGhlIHNlcnZpY2UuXG4gICAqXG4gICAqIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdXG4gICAqL1xuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbjogVGFza0RlZmluaXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBzZWN1cml0eSBncm91cHMgdG8gYXNzb2NpYXRlIHdpdGggdGhlIHNlcnZpY2UuIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhIHNlY3VyaXR5IGdyb3VwLCBhIG5ldyBzZWN1cml0eSBncm91cCBpcyBjcmVhdGVkLlxuICAgKlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmV3IHNlY3VyaXR5IGdyb3VwIGlzIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3Vwcz86IGVjMi5JU2VjdXJpdHlHcm91cFtdO1xufVxuXG4vKipcbiAqIFRoZSBpbnRlcmZhY2UgZm9yIGEgc2VydmljZSB1c2luZyB0aGUgRXh0ZXJuYWwgbGF1bmNoIHR5cGUgb24gYW4gRUNTIGNsdXN0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUV4dGVybmFsU2VydmljZSBleHRlbmRzIElTZXJ2aWNlIHtcblxufVxuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIHRvIGltcG9ydCBmcm9tIHRoZSBzZXJ2aWNlIHVzaW5nIHRoZSBFeHRlcm5hbCBsYXVuY2ggdHlwZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFeHRlcm5hbFNlcnZpY2VBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIHRoYXQgaG9zdHMgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3RlcjtcblxuICAvKipcbiAgICogVGhlIHNlcnZpY2UgQVJOLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGVpdGhlciB0aGlzLCBvciBgc2VydmljZU5hbWVgLCBpcyByZXF1aXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlcnZpY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZWl0aGVyIHRoaXMsIG9yIGBzZXJ2aWNlQXJuYCwgaXMgcmVxdWlyZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoaXMgY3JlYXRlcyBhIHNlcnZpY2UgdXNpbmcgdGhlIEV4dGVybmFsIGxhdW5jaCB0eXBlIG9uIGFuIEVDUyBjbHVzdGVyLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkVDUzo6U2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2UgaW1wbGVtZW50cyBJRXh0ZXJuYWxTZXJ2aWNlIHtcblxuICAvKipcbiAgICogSW1wb3J0cyBmcm9tIHRoZSBzcGVjaWZpZWQgc2VydmljZSBBUk4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FeHRlcm5hbFNlcnZpY2VBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZXh0ZXJuYWxTZXJ2aWNlQXJuOiBzdHJpbmcpOiBJRXh0ZXJuYWxTZXJ2aWNlIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElFeHRlcm5hbFNlcnZpY2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VBcm4gPSBleHRlcm5hbFNlcnZpY2VBcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZU5hbWUgPSBTdGFjay5vZihzY29wZSkuc3BsaXRBcm4oZXh0ZXJuYWxTZXJ2aWNlQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lIGFzIHN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGZyb20gdGhlIHNwZWNpZmllZCBzZXJ2aWNlIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FeHRlcm5hbFNlcnZpY2VBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBFeHRlcm5hbFNlcnZpY2VBdHRyaWJ1dGVzKTogSUJhc2VTZXJ2aWNlIHtcbiAgICByZXR1cm4gZnJvbVNlcnZpY2VBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEV4dGVybmFsU2VydmljZSBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFeHRlcm5hbFNlcnZpY2VQcm9wcykge1xuICAgIGlmIChwcm9wcy5taW5IZWFsdGh5UGVyY2VudCAhPT0gdW5kZWZpbmVkICYmIHByb3BzLm1heEhlYWx0aHlQZXJjZW50ICE9PSB1bmRlZmluZWQgJiYgcHJvcHMubWluSGVhbHRoeVBlcmNlbnQgPj0gcHJvcHMubWF4SGVhbHRoeVBlcmNlbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWluaW11bSBoZWFsdGh5IHBlcmNlbnQgbXVzdCBiZSBsZXNzIHRoYW4gbWF4aW11bSBoZWFsdGh5IHBlcmNlbnQuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnRhc2tEZWZpbml0aW9uLmNvbXBhdGliaWxpdHkgIT09IENvbXBhdGliaWxpdHkuRVhURVJOQUwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3VwcGxpZWQgVGFza0RlZmluaXRpb24gaXMgbm90IGNvbmZpZ3VyZWQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBFQ1MgQW55d2hlcmUgY2x1c3RlcicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5jbHVzdGVyLmRlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgKGBDbG91ZCBtYXAgaW50ZWdyYXRpb24gaXMgbm90IHN1cHBvcnRlZCBmb3IgRXh0ZXJuYWwgc2VydmljZSAke3Byb3BzLmNsdXN0ZXIuZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlfWApO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5jbG91ZE1hcE9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yICgnQ2xvdWQgbWFwIG9wdGlvbnMgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIEV4dGVybmFsIHNlcnZpY2UnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZW5hYmxlRXhlY3V0ZUNvbW1hbmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yICgnRW5hYmxlIEV4ZWN1dGUgQ29tbWFuZCBvcHRpb25zIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBFeHRlcm5hbCBzZXJ2aWNlJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmNhcGFjaXR5UHJvdmlkZXJTdHJhdGVnaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciAoJ0NhcGFjaXR5IFByb3ZpZGVycyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgRXh0ZXJuYWwgc2VydmljZScpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3BhZ2F0ZVRhZ3NGcm9tU291cmNlID0gcHJvcHMucHJvcGFnYXRlVGFncyA/PyBQcm9wYWdhdGVkVGFnU291cmNlLk5PTkU7XG5cbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgZGVzaXJlZENvdW50OiBwcm9wcy5kZXNpcmVkQ291bnQsXG4gICAgICBtYXhIZWFsdGh5UGVyY2VudDogcHJvcHMubWF4SGVhbHRoeVBlcmNlbnQgPT09IHVuZGVmaW5lZCA/IDEwMCA6IHByb3BzLm1heEhlYWx0aHlQZXJjZW50LFxuICAgICAgbWluSGVhbHRoeVBlcmNlbnQ6IHByb3BzLm1pbkhlYWx0aHlQZXJjZW50ID09PSB1bmRlZmluZWQgPyAwIDogcHJvcHMubWluSGVhbHRoeVBlcmNlbnQsXG4gICAgICBsYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkVYVEVSTkFMLFxuICAgICAgcHJvcGFnYXRlVGFnczogcHJvcGFnYXRlVGFnc0Zyb21Tb3VyY2UsXG4gICAgICBlbmFibGVFQ1NNYW5hZ2VkVGFnczogcHJvcHMuZW5hYmxlRUNTTWFuYWdlZFRhZ3MsXG4gICAgfSxcbiAgICB7XG4gICAgICBjbHVzdGVyOiBwcm9wcy5jbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgdGFza0RlZmluaXRpb246IHByb3BzLmRlcGxveW1lbnRDb250cm9sbGVyPy50eXBlID09PSBEZXBsb3ltZW50Q29udHJvbGxlclR5cGUuRVhURVJOQUwgPyB1bmRlZmluZWQgOiBwcm9wcy50YXNrRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbkFybixcbiAgICB9LCBwcm9wcy50YXNrRGVmaW5pdGlvbik7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7XG4gICAgICB2YWxpZGF0ZTogKCkgPT4gIXRoaXMudGFza0RlZmluaXRpb24uZGVmYXVsdENvbnRhaW5lciA/IFsnQSBUYXNrRGVmaW5pdGlvbiBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGVzc2VudGlhbCBjb250YWluZXInXSA6IFtdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oe1xuICAgICAgdmFsaWRhdGU6ICgpID0+IHRoaXMubmV0d29ya0NvbmZpZ3VyYXRpb24gIT09IHVuZGVmaW5lZCA/IFsnTmV0d29yayBjb25maWd1cmF0aW9ucyBub3Qgc3VwcG9ydGVkIGZvciBhbiBleHRlcm5hbCBzZXJ2aWNlJ10gOiBbXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZW4gbWV0aG9kIHRvIHRocm93IGVycm9yIGFzIGBhdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXBgIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIGV4dGVybmFsIHNlcnZpY2VcbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoX3RhcmdldEdyb3VwOiBlbGJ2Mi5JQXBwbGljYXRpb25UYXJnZXRHcm91cCk6IGVsYnYyLkxvYWRCYWxhbmNlclRhcmdldFByb3BzIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IgKCdBcHBsaWNhdGlvbiBsb2FkIGJhbGFuY2VyIGNhbm5vdCBiZSBhdHRhY2hlZCB0byBhbiBleHRlcm5hbCBzZXJ2aWNlJyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVuIG1ldGhvZCB0byB0aHJvdyBlcnJvciBhcyBgbG9hZEJhbGFuY2VyVGFyZ2V0YCBpcyBub3Qgc3VwcG9ydGVkIGZvciBleHRlcm5hbCBzZXJ2aWNlXG4gICAqL1xuICBwdWJsaWMgbG9hZEJhbGFuY2VyVGFyZ2V0KF9vcHRpb25zOiBMb2FkQmFsYW5jZXJUYXJnZXRPcHRpb25zKTogSUVjc0xvYWRCYWxhbmNlclRhcmdldCB7XG4gICAgdGhyb3cgbmV3IEVycm9yICgnRXh0ZXJuYWwgc2VydmljZSBjYW5ub3QgYmUgYXR0YWNoZWQgYXMgbG9hZCBiYWxhbmNlciB0YXJnZXRzJyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVuIG1ldGhvZCB0byB0aHJvdyBlcnJvciBhcyBgcmVnaXN0ZXJMb2FkQmFsYW5jZXJUYXJnZXRzYCBpcyBub3Qgc3VwcG9ydGVkIGZvciBleHRlcm5hbCBzZXJ2aWNlXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJMb2FkQmFsYW5jZXJUYXJnZXRzKC4uLl90YXJnZXRzOiBFY3NUYXJnZXRbXSkge1xuICAgIHRocm93IG5ldyBFcnJvciAoJ0V4dGVybmFsIHNlcnZpY2UgY2Fubm90IGJlIHJlZ2lzdGVyZWQgYXMgbG9hZCBiYWxhbmNlciB0YXJnZXRzJyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVuIG1ldGhvZCB0byB0aHJvdyBlcnJvciBhcyBgY29uZmlndXJlQXdzVnBjTmV0d29ya2luZ1dpdGhTZWN1cml0eUdyb3Vwc2AgaXMgbm90IHN1cHBvcnRlZCBmb3IgZXh0ZXJuYWwgc2VydmljZVxuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW4sIG5vLXVudXNlZC12YXJzXG4gIHByb3RlY3RlZCBjb25maWd1cmVBd3NWcGNOZXR3b3JraW5nV2l0aFNlY3VyaXR5R3JvdXBzKF92cGM6IGVjMi5JVnBjLCBfYXNzaWduUHVibGljSXA/OiBib29sZWFuLCBfdnBjU3VibmV0cz86IGVjMi5TdWJuZXRTZWxlY3Rpb24sIF9zZWN1cml0eUdyb3Vwcz86IGVjMi5JU2VjdXJpdHlHcm91cFtdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yICgnT25seSBCcmlkZ2UgbmV0d29yayBtb2RlIGlzIHN1cHBvcnRlZCBmb3IgZXh0ZXJuYWwgc2VydmljZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlbiBtZXRob2QgdG8gdGhyb3cgZXJyb3IgYXMgYGF1dG9TY2FsZVRhc2tDb3VudGAgaXMgbm90IHN1cHBvcnRlZCBmb3IgZXh0ZXJuYWwgc2VydmljZVxuICAgKi9cbiAgcHVibGljIGF1dG9TY2FsZVRhc2tDb3VudChfcHJvcHM6IGFwcHNjYWxpbmcuRW5hYmxlU2NhbGluZ1Byb3BzKTogU2NhbGFibGVUYXNrQ291bnQge1xuICAgIHRocm93IG5ldyBFcnJvciAoJ0F1dG9zY2FsaW5nIG5vdCBzdXBwb3J0ZWQgZm9yIGV4dGVybmFsIHNlcnZpY2UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZW4gbWV0aG9kIHRvIHRocm93IGVycm9yIGFzIGBlbmFibGVDbG91ZE1hcGAgaXMgbm90IHN1cHBvcnRlZCBmb3IgZXh0ZXJuYWwgc2VydmljZVxuICAgKi9cbiAgcHVibGljIGVuYWJsZUNsb3VkTWFwKF9vcHRpb25zOiBDbG91ZE1hcE9wdGlvbnMpOiBjbG91ZG1hcC5TZXJ2aWNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IgKCdDbG91ZCBtYXAgaW50ZWdyYXRpb24gbm90IHN1cHBvcnRlZCBmb3IgYW4gZXh0ZXJuYWwgc2VydmljZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlbiBtZXRob2QgdG8gdGhyb3cgZXJyb3IgYXMgYGFzc29jaWF0ZUNsb3VkTWFwU2VydmljZWAgaXMgbm90IHN1cHBvcnRlZCBmb3IgZXh0ZXJuYWwgc2VydmljZVxuICAgKi9cbiAgcHVibGljIGFzc29jaWF0ZUNsb3VkTWFwU2VydmljZShfb3B0aW9uczogQXNzb2NpYXRlQ2xvdWRNYXBTZXJ2aWNlT3B0aW9ucyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvciAoJ0Nsb3VkIG1hcCBzZXJ2aWNlIGFzc29jaWF0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIGFuIGV4dGVybmFsIHNlcnZpY2UnKTtcbiAgfVxufVxuIl19