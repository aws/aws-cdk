"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuiltInAttributes = exports.Ec2Service = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
const base_service_1 = require("../base/base-service");
const from_service_attributes_1 = require("../base/from-service-attributes");
const task_definition_1 = require("../base/task-definition");
/**
 * This creates a service using the EC2 launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
class Ec2Service extends base_service_1.BaseService {
    /**
     * Constructs a new instance of the Ec2Service class.
     */
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Ec2ServiceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Ec2Service);
            }
            throw error;
        }
        if (props.daemon && props.desiredCount !== undefined) {
            throw new Error('Daemon mode launches one task on every instance. Don\'t supply desiredCount.');
        }
        if (props.daemon && props.maxHealthyPercent !== undefined && props.maxHealthyPercent !== 100) {
            throw new Error('Maximum percent must be 100 for daemon mode.');
        }
        if (props.minHealthyPercent !== undefined && props.maxHealthyPercent !== undefined && props.minHealthyPercent >= props.maxHealthyPercent) {
            throw new Error('Minimum healthy percent must be less than maximum healthy percent.');
        }
        if (!props.taskDefinition.isEc2Compatible) {
            throw new Error('Supplied TaskDefinition is not configured for compatibility with EC2');
        }
        if (props.securityGroup !== undefined && props.securityGroups !== undefined) {
            throw new Error('Only one of SecurityGroup or SecurityGroups can be populated.');
        }
        super(scope, id, {
            ...props,
            desiredCount: props.desiredCount,
            maxHealthyPercent: props.daemon && props.maxHealthyPercent === undefined ? 100 : props.maxHealthyPercent,
            minHealthyPercent: props.daemon && props.minHealthyPercent === undefined ? 0 : props.minHealthyPercent,
            launchType: base_service_1.LaunchType.EC2,
            enableECSManagedTags: props.enableECSManagedTags,
        }, {
            cluster: props.cluster.clusterName,
            taskDefinition: props.deploymentController?.type === base_service_1.DeploymentControllerType.EXTERNAL ? undefined : props.taskDefinition.taskDefinitionArn,
            placementConstraints: core_1.Lazy.any({ produce: () => this.constraints }, { omitEmptyArray: true }),
            placementStrategies: core_1.Lazy.any({ produce: () => this.strategies }, { omitEmptyArray: true }),
            schedulingStrategy: props.daemon ? 'DAEMON' : 'REPLICA',
        }, props.taskDefinition);
        this.constraints = [];
        this.strategies = [];
        this.daemon = props.daemon || false;
        let securityGroups;
        if (props.securityGroup !== undefined) {
            securityGroups = [props.securityGroup];
        }
        else if (props.securityGroups !== undefined) {
            securityGroups = props.securityGroups;
        }
        if (props.taskDefinition.networkMode === task_definition_1.NetworkMode.AWS_VPC) {
            this.configureAwsVpcNetworkingWithSecurityGroups(props.cluster.vpc, props.assignPublicIp, props.vpcSubnets, securityGroups);
        }
        else {
            // Either None, Bridge or Host networking. Copy SecurityGroups from ASG.
            // We have to be smart here -- by default future Security Group rules would be created
            // in the Cluster stack. However, if the Cluster is in a different stack than us,
            // that will lead to a cyclic reference (we point to that stack for the cluster name,
            // but that stack will point to the ALB probably created right next to us).
            //
            // In that case, reference the same security groups but make sure new rules are
            // created in the current scope (i.e., this stack)
            validateNoNetworkingProps(props);
            this.connections.addSecurityGroup(...securityGroupsInThisStack(this, props.cluster.connections.securityGroups));
        }
        this.addPlacementConstraints(...props.placementConstraints || []);
        this.addPlacementStrategies(...props.placementStrategies || []);
        this.node.addValidation({
            validate: () => !this.taskDefinition.defaultContainer ? ['A TaskDefinition must have at least one essential container'] : [],
        });
        this.node.addValidation({ validate: this.validateEc2Service.bind(this) });
    }
    /**
     * Imports from the specified service ARN.
     */
    static fromEc2ServiceArn(scope, id, ec2ServiceArn) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.serviceArn = ec2ServiceArn;
                this.serviceName = from_service_attributes_1.extractServiceNameFromArn(this, ec2ServiceArn);
            }
        }
        return new Import(scope, id);
    }
    /**
     * Imports from the specified service attributes.
     */
    static fromEc2ServiceAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Ec2ServiceAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEc2ServiceAttributes);
            }
            throw error;
        }
        return from_service_attributes_1.fromServiceAttributes(scope, id, attrs);
    }
    /**
     * Adds one or more placement strategies to use for tasks in the service. For more information, see
     * [Amazon ECS Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html).
     */
    addPlacementStrategies(...strategies) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_PlacementStrategy(strategies);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addPlacementStrategies);
            }
            throw error;
        }
        if (strategies.length > 0 && this.daemon) {
            throw new Error("Can't configure placement strategies when daemon=true");
        }
        for (const strategy of strategies) {
            this.strategies.push(...strategy.toJson());
        }
    }
    /**
     * Adds one or more placement constraints to use for tasks in the service. For more information, see
     * [Amazon ECS Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html).
     */
    addPlacementConstraints(...constraints) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_PlacementConstraint(constraints);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addPlacementConstraints);
            }
            throw error;
        }
        for (const constraint of constraints) {
            this.constraints.push(...constraint.toJson());
        }
    }
    /**
     * Validates this Ec2Service.
     */
    validateEc2Service() {
        const ret = new Array();
        if (!this.cluster.hasEc2Capacity) {
            ret.push('Cluster for this service needs Ec2 capacity. Call addXxxCapacity() on the cluster.');
        }
        return ret;
    }
}
exports.Ec2Service = Ec2Service;
_a = JSII_RTTI_SYMBOL_1;
Ec2Service[_a] = { fqn: "@aws-cdk/aws-ecs.Ec2Service", version: "0.0.0" };
/**
 * Validate combinations of networking arguments.
 */
function validateNoNetworkingProps(props) {
    if (props.vpcSubnets !== undefined
        || props.securityGroup !== undefined
        || props.securityGroups !== undefined
        || props.assignPublicIp) {
        throw new Error('vpcSubnets, securityGroup(s) and assignPublicIp can only be used in AwsVpc networking mode');
    }
}
/**
 * Force security group rules to be created in this stack.
 *
 * For every security group, if the scope and the group are in different stacks, return
 * a fake "imported" security group instead. This will behave as the original security group,
 * but new Ingress and Egress rule resources will be added in the current stack instead of the
 * other one.
 */
function securityGroupsInThisStack(scope, groups) {
    const thisStack = core_1.Stack.of(scope);
    let i = 1;
    return groups.map(group => {
        if (thisStack === core_1.Stack.of(group)) {
            return group;
        } // Simple case, just return the original one
        return ec2.SecurityGroup.fromSecurityGroupId(scope, `SecurityGroup${i++}`, group.securityGroupId, {
            allowAllOutbound: group.allowAllOutbound,
            mutable: true,
        });
    });
}
/**
 * The built-in container instance attributes
 */
class BuiltInAttributes {
}
exports.BuiltInAttributes = BuiltInAttributes;
_b = JSII_RTTI_SYMBOL_1;
BuiltInAttributes[_b] = { fqn: "@aws-cdk/aws-ecs.BuiltInAttributes", version: "0.0.0" };
/**
 * The id of the instance.
 */
BuiltInAttributes.INSTANCE_ID = 'instanceId';
/**
 * The AvailabilityZone where the instance is running in.
 */
BuiltInAttributes.AVAILABILITY_ZONE = 'attribute:ecs.availability-zone';
/**
 * The AMI id the instance is using.
 */
BuiltInAttributes.AMI_ID = 'attribute:ecs.ami-id';
/**
 * The EC2 instance type.
 */
BuiltInAttributes.INSTANCE_TYPE = 'attribute:ecs.instance-type';
/**
 * The operating system of the instance.
 *
 * Either 'linux' or 'windows'.
 */
BuiltInAttributes.OS_TYPE = 'attribute:ecs.os-type';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWMyLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlYzItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFDeEMsd0NBQXNEO0FBRXRELHVEQUFxSTtBQUNySSw2RUFBbUc7QUFDbkcsNkRBQXNFO0FBZ0h0RTs7OztHQUlHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsMEJBQVc7SUF3QnpDOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7Ozs7OytDQTNCckQsVUFBVTs7OztRQTRCbkIsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLEtBQUssU0FBUyxFQUFFO1lBQ3BELE1BQU0sSUFBSSxLQUFLLENBQUMsOEVBQThFLENBQUMsQ0FBQztTQUNqRztRQUVELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxHQUFHLEVBQUU7WUFDNUYsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLGlCQUFpQixJQUFJLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtZQUN4SSxNQUFNLElBQUksS0FBSyxDQUFDLG9FQUFvRSxDQUFDLENBQUM7U0FDdkY7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUU7WUFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO1NBQ3pGO1FBRUQsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtZQUMzRSxNQUFNLElBQUksS0FBSyxDQUFDLCtE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QyxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDO1NBQUUsQ0FBQyw0Q0FBNEM7UUFFakcsT0FBTyxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQ2hHLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7WUFDeEMsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQWEsaUJBQWlCOztBQUE5Qiw4Q0EyQkM7OztBQTFCQzs7R0FFRztBQUNvQiw2QkFBVyxHQUFHLFlBQVksQ0FBQztBQUVsRDs7R0FFRztBQUNvQixtQ0FBaUIsR0FBRyxpQ0FBaUMsQ0FBQztBQUU3RTs7R0FFRztBQUNvQix3QkFBTSxHQUFHLHNCQUFzQixDQUFDO0FBRXZEOztHQUVHO0FBQ29CLCtCQUFhLEdBQUcsNkJBQTZCLENBQUM7QUFFckU7Ozs7R0FJRztBQUNvQix5QkFBTyxHQUFHLHVCQUF1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgTGF6eSwgUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEJhc2VTZXJ2aWNlLCBCYXNlU2VydmljZU9wdGlvbnMsIERlcGxveW1lbnRDb250cm9sbGVyVHlwZSwgSUJhc2VTZXJ2aWNlLCBJU2VydmljZSwgTGF1bmNoVHlwZSB9IGZyb20gJy4uL2Jhc2UvYmFzZS1zZXJ2aWNlJztcbmltcG9ydCB7IGZyb21TZXJ2aWNlQXR0cmlidXRlcywgZXh0cmFjdFNlcnZpY2VOYW1lRnJvbUFybiB9IGZyb20gJy4uL2Jhc2UvZnJvbS1zZXJ2aWNlLWF0dHJpYnV0ZXMnO1xuaW1wb3J0IHsgTmV0d29ya01vZGUsIFRhc2tEZWZpbml0aW9uIH0gZnJvbSAnLi4vYmFzZS90YXNrLWRlZmluaXRpb24nO1xuaW1wb3J0IHsgSUNsdXN0ZXIgfSBmcm9tICcuLi9jbHVzdGVyJztcbmltcG9ydCB7IENmblNlcnZpY2UgfSBmcm9tICcuLi9lY3MuZ2VuZXJhdGVkJztcbmltcG9ydCB7IFBsYWNlbWVudENvbnN0cmFpbnQsIFBsYWNlbWVudFN0cmF0ZWd5IH0gZnJvbSAnLi4vcGxhY2VtZW50JztcblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBzZXJ2aWNlIHVzaW5nIHRoZSBFQzIgbGF1bmNoIHR5cGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWMyU2VydmljZVByb3BzIGV4dGVuZHMgQmFzZVNlcnZpY2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB0YXNrIGRlZmluaXRpb24gdG8gdXNlIGZvciB0YXNrcyBpbiB0aGUgc2VydmljZS5cbiAgICpcbiAgICogW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICovXG4gIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uOiBUYXNrRGVmaW5pdGlvbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIHRhc2sncyBlbGFzdGljIG5ldHdvcmsgaW50ZXJmYWNlIHJlY2VpdmVzIGEgcHVibGljIElQIGFkZHJlc3MuXG4gICAqIElmIHRydWUsIGVhY2ggdGFzayB3aWxsIHJlY2VpdmUgYSBwdWJsaWMgSVAgYWRkcmVzcy5cbiAgICpcbiAgICogVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IHVzZWQgZm9yIHRhc2tzIHRoYXQgdXNlIHRoZSBhd3N2cGMgbmV0d29yayBtb2RlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYXNzaWduUHVibGljSXA/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgc3VibmV0cyB0byBhc3NvY2lhdGUgd2l0aCB0aGUgc2VydmljZS5cbiAgICpcbiAgICogVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IHVzZWQgZm9yIHRhc2tzIHRoYXQgdXNlIHRoZSBhd3N2cGMgbmV0d29yayBtb2RlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFB1YmxpYyBzdWJuZXRzIGlmIGBhc3NpZ25QdWJsaWNJcGAgaXMgc2V0LCBvdGhlcndpc2UgdGhlIGZpcnN0IGF2YWlsYWJsZSBvbmUgb2YgUHJpdmF0ZSwgSXNvbGF0ZWQsIFB1YmxpYywgaW4gdGhhdCBvcmRlci5cbiAgICovXG4gIHJlYWRvbmx5IHZwY1N1Ym5ldHM/OiBlYzIuU3VibmV0U2VsZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VjdXJpdHkgZ3JvdXBzIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBzZXJ2aWNlLiBJZiB5b3UgZG8gbm90IHNwZWNpZnkgYSBzZWN1cml0eSBncm91cCwgYSBuZXcgc2VjdXJpdHkgZ3JvdXAgaXMgY3JlYXRlZC5cbiAgICpcbiAgICogVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IHVzZWQgZm9yIHRhc2tzIHRoYXQgdXNlIHRoZSBhd3N2cGMgbmV0d29yayBtb2RlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmV3IHNlY3VyaXR5IGdyb3VwIGlzIGNyZWF0ZWQuXG4gICAqIEBkZXByZWNhdGVkIHVzZSBzZWN1cml0eUdyb3VwcyBpbnN0ZWFkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cD86IGVjMi5JU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogVGhlIHNlY3VyaXR5IGdyb3VwcyB0byBhc3NvY2lhdGUgd2l0aCB0aGUgc2VydmljZS4gSWYgeW91IGRvIG5vdCBzcGVjaWZ5IGEgc2VjdXJpdHkgZ3JvdXAsIGEgbmV3IHNlY3VyaXR5IGdyb3VwIGlzIGNyZWF0ZWQuXG4gICAqXG4gICAqIFRoaXMgcHJvcGVydHkgaXMgb25seSB1c2VkIGZvciB0YXNrcyB0aGF0IHVzZSB0aGUgYXdzdnBjIG5ldHdvcmsgbW9kZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyBzZWN1cml0eSBncm91cCBpcyBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBlYzIuSVNlY3VyaXR5R3JvdXBbXTtcblxuICAvKipcbiAgICogVGhlIHBsYWNlbWVudCBjb25zdHJhaW50cyB0byB1c2UgZm9yIHRhc2tzIGluIHRoZSBzZXJ2aWNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gICAqIFtBbWF6b24gRUNTIFRhc2sgUGxhY2VtZW50IENvbnN0cmFpbnRzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS90YXNrLXBsYWNlbWVudC1jb25zdHJhaW50cy5odG1sKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25zdHJhaW50cy5cbiAgICovXG4gIHJlYWRvbmx5IHBsYWNlbWVudENvbnN0cmFpbnRzPzogUGxhY2VtZW50Q29uc3RyYWludFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgcGxhY2VtZW50IHN0cmF0ZWdpZXMgdG8gdXNlIGZvciB0YXNrcyBpbiB0aGUgc2VydmljZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBbQW1hem9uIEVDUyBUYXNrIFBsYWNlbWVudCBTdHJhdGVnaWVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS90YXNrLXBsYWNlbWVudC1zdHJhdGVnaWVzLmh0bWwpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHN0cmF0ZWdpZXMuXG4gICAqL1xuICByZWFkb25seSBwbGFjZW1lbnRTdHJhdGVnaWVzPzogUGxhY2VtZW50U3RyYXRlZ3lbXTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIHNlcnZpY2Ugd2lsbCB1c2UgdGhlIGRhZW1vbiBzY2hlZHVsaW5nIHN0cmF0ZWd5LlxuICAgKiBJZiB0cnVlLCB0aGUgc2VydmljZSBzY2hlZHVsZXIgZGVwbG95cyBleGFjdGx5IG9uZSB0YXNrIG9uIGVhY2ggY29udGFpbmVyIGluc3RhbmNlIGluIHlvdXIgY2x1c3Rlci5cbiAgICpcbiAgICogV2hlbiB5b3UgYXJlIHVzaW5nIHRoaXMgc3RyYXRlZ3ksIGRvIG5vdCBzcGVjaWZ5IGEgZGVzaXJlZCBudW1iZXIgb2YgdGFza3Mgb3JhbnkgdGFzayBwbGFjZW1lbnQgc3RyYXRlZ2llcy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGRhZW1vbj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIGludGVyZmFjZSBmb3IgYSBzZXJ2aWNlIHVzaW5nIHRoZSBFQzIgbGF1bmNoIHR5cGUgb24gYW4gRUNTIGNsdXN0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUVjMlNlcnZpY2UgZXh0ZW5kcyBJU2VydmljZSB7XG5cbn1cblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyB0byBpbXBvcnQgZnJvbSB0aGUgc2VydmljZSB1c2luZyB0aGUgRUMyIGxhdW5jaCB0eXBlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjMlNlcnZpY2VBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIHRoYXQgaG9zdHMgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3RlcjtcblxuICAvKipcbiAgICogVGhlIHNlcnZpY2UgQVJOLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGVpdGhlciB0aGlzLCBvciBgc2VydmljZU5hbWVgLCBpcyByZXF1aXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlcnZpY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZWl0aGVyIHRoaXMsIG9yIGBzZXJ2aWNlQXJuYCwgaXMgcmVxdWlyZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoaXMgY3JlYXRlcyBhIHNlcnZpY2UgdXNpbmcgdGhlIEVDMiBsYXVuY2ggdHlwZSBvbiBhbiBFQ1MgY2x1c3Rlci5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpFQ1M6OlNlcnZpY2VcbiAqL1xuZXhwb3J0IGNsYXNzIEVjMlNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSBpbXBsZW1lbnRzIElFYzJTZXJ2aWNlIHtcblxuICAvKipcbiAgICogSW1wb3J0cyBmcm9tIHRoZSBzcGVjaWZpZWQgc2VydmljZSBBUk4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FYzJTZXJ2aWNlQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGVjMlNlcnZpY2VBcm46IHN0cmluZyk6IElFYzJTZXJ2aWNlIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElFYzJTZXJ2aWNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlQXJuID0gZWMyU2VydmljZUFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlTmFtZSA9IGV4dHJhY3RTZXJ2aWNlTmFtZUZyb21Bcm4odGhpcywgZWMyU2VydmljZUFybik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0cyBmcm9tIHRoZSBzcGVjaWZpZWQgc2VydmljZSBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRWMyU2VydmljZUF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IEVjMlNlcnZpY2VBdHRyaWJ1dGVzKTogSUJhc2VTZXJ2aWNlIHtcbiAgICByZXR1cm4gZnJvbVNlcnZpY2VBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBjb25zdHJhaW50czogQ2ZuU2VydmljZS5QbGFjZW1lbnRDb25zdHJhaW50UHJvcGVydHlbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBzdHJhdGVnaWVzOiBDZm5TZXJ2aWNlLlBsYWNlbWVudFN0cmF0ZWd5UHJvcGVydHlbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBkYWVtb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEVjMlNlcnZpY2UgY2xhc3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRWMyU2VydmljZVByb3BzKSB7XG4gICAgaWYgKHByb3BzLmRhZW1vbiAmJiBwcm9wcy5kZXNpcmVkQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYWVtb24gbW9kZSBsYXVuY2hlcyBvbmUgdGFzayBvbiBldmVyeSBpbnN0YW5jZS4gRG9uXFwndCBzdXBwbHkgZGVzaXJlZENvdW50LicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5kYWVtb24gJiYgcHJvcHMubWF4SGVhbHRoeVBlcmNlbnQgIT09IHVuZGVmaW5lZCAmJiBwcm9wcy5tYXhIZWFsdGh5UGVyY2VudCAhPT0gMTAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01heGltdW0gcGVyY2VudCBtdXN0IGJlIDEwMCBmb3IgZGFlbW9uIG1vZGUuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLm1pbkhlYWx0aHlQZXJjZW50ICE9PSB1bmRlZmluZWQgJiYgcHJvcHMubWF4SGVhbHRoeVBlcmNlbnQgIT09IHVuZGVmaW5lZCAmJiBwcm9wcy5taW5IZWFsdGh5UGVyY2VudCA+PSBwcm9wcy5tYXhIZWFsdGh5UGVyY2VudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaW5pbXVtIGhlYWx0aHkgcGVyY2VudCBtdXN0IGJlIGxlc3MgdGhhbiBtYXhpbXVtIGhlYWx0aHkgcGVyY2VudC4nKTtcbiAgICB9XG5cbiAgICBpZiAoIXByb3BzLnRhc2tEZWZpbml0aW9uLmlzRWMyQ29tcGF0aWJsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdXBwbGllZCBUYXNrRGVmaW5pdGlvbiBpcyBub3QgY29uZmlndXJlZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEVDMicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5zZWN1cml0eUdyb3VwICE9PSB1bmRlZmluZWQgJiYgcHJvcHMuc2VjdXJpdHlHcm91cHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBvZiBTZWN1cml0eUdyb3VwIG9yIFNlY3VyaXR5R3JvdXBzIGNhbiBiZSBwb3B1bGF0ZWQuJyk7XG4gICAgfVxuXG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGRlc2lyZWRDb3VudDogcHJvcHMuZGVzaXJlZENvdW50LFxuICAgICAgbWF4SGVhbHRoeVBlcmNlbnQ6IHByb3BzLmRhZW1vbiAmJiBwcm9wcy5tYXhIZWFsdGh5UGVyY2VudCA9PT0gdW5kZWZpbmVkID8gMTAwIDogcHJvcHMubWF4SGVhbHRoeVBlcmNlbnQsXG4gICAgICBtaW5IZWFsdGh5UGVyY2VudDogcHJvcHMuZGFlbW9uICYmIHByb3BzLm1pbkhlYWx0aHlQZXJjZW50ID09PSB1bmRlZmluZWQgPyAwIDogcHJvcHMubWluSGVhbHRoeVBlcmNlbnQsXG4gICAgICBsYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkVDMixcbiAgICAgIGVuYWJsZUVDU01hbmFnZWRUYWdzOiBwcm9wcy5lbmFibGVFQ1NNYW5hZ2VkVGFncyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICB0YXNrRGVmaW5pdGlvbjogcHJvcHMuZGVwbG95bWVudENvbnRyb2xsZXI/LnR5cGUgPT09IERlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FWFRFUk5BTCA/IHVuZGVmaW5lZCA6IHByb3BzLnRhc2tEZWZpbml0aW9uLnRhc2tEZWZpbml0aW9uQXJuLFxuICAgICAgcGxhY2VtZW50Q29uc3RyYWludHM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5jb25zdHJhaW50cyB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pLFxuICAgICAgcGxhY2VtZW50U3RyYXRlZ2llczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnN0cmF0ZWdpZXMgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIHNjaGVkdWxpbmdTdHJhdGVneTogcHJvcHMuZGFlbW9uID8gJ0RBRU1PTicgOiAnUkVQTElDQScsXG4gICAgfSwgcHJvcHMudGFza0RlZmluaXRpb24pO1xuXG4gICAgdGhpcy5jb25zdHJhaW50cyA9IFtdO1xuICAgIHRoaXMuc3RyYXRlZ2llcyA9IFtdO1xuICAgIHRoaXMuZGFlbW9uID0gcHJvcHMuZGFlbW9uIHx8IGZhbHNlO1xuXG4gICAgbGV0IHNlY3VyaXR5R3JvdXBzO1xuICAgIGlmIChwcm9wcy5zZWN1cml0eUdyb3VwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlY3VyaXR5R3JvdXBzID0gW3Byb3BzLnNlY3VyaXR5R3JvdXBdO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuc2VjdXJpdHlHcm91cHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc2VjdXJpdHlHcm91cHMgPSBwcm9wcy5zZWN1cml0eUdyb3VwcztcbiAgICB9XG5cbiAgICBpZiAocHJvcHMudGFza0RlZmluaXRpb24ubmV0d29ya01vZGUgPT09IE5ldHdvcmtNb2RlLkFXU19WUEMpIHtcbiAgICAgIHRoaXMuY29uZmlndXJlQXdzVnBjTmV0d29ya2luZ1dpdGhTZWN1cml0eUdyb3Vwcyhwcm9wcy5jbHVzdGVyLnZwYywgcHJvcHMuYXNzaWduUHVibGljSXAsIHByb3BzLnZwY1N1Ym5ldHMsIHNlY3VyaXR5R3JvdXBzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRWl0aGVyIE5vbmUsIEJyaWRnZSBvciBIb3N0IG5ldHdvcmtpbmcuIENvcHkgU2VjdXJpdHlHcm91cHMgZnJvbSBBU0cuXG4gICAgICAvLyBXZSBoYXZlIHRvIGJlIHNtYXJ0IGhlcmUgLS0gYnkgZGVmYXVsdCBmdXR1cmUgU2VjdXJpdHkgR3JvdXAgcnVsZXMgd291bGQgYmUgY3JlYXRlZFxuICAgICAgLy8gaW4gdGhlIENsdXN0ZXIgc3RhY2suIEhvd2V2ZXIsIGlmIHRoZSBDbHVzdGVyIGlzIGluIGEgZGlmZmVyZW50IHN0YWNrIHRoYW4gdXMsXG4gICAgICAvLyB0aGF0IHdpbGwgbGVhZCB0byBhIGN5Y2xpYyByZWZlcmVuY2UgKHdlIHBvaW50IHRvIHRoYXQgc3RhY2sgZm9yIHRoZSBjbHVzdGVyIG5hbWUsXG4gICAgICAvLyBidXQgdGhhdCBzdGFjayB3aWxsIHBvaW50IHRvIHRoZSBBTEIgcHJvYmFibHkgY3JlYXRlZCByaWdodCBuZXh0IHRvIHVzKS5cbiAgICAgIC8vXG4gICAgICAvLyBJbiB0aGF0IGNhc2UsIHJlZmVyZW5jZSB0aGUgc2FtZSBzZWN1cml0eSBncm91cHMgYnV0IG1ha2Ugc3VyZSBuZXcgcnVsZXMgYXJlXG4gICAgICAvLyBjcmVhdGVkIGluIHRoZSBjdXJyZW50IHNjb3BlIChpLmUuLCB0aGlzIHN0YWNrKVxuICAgICAgdmFsaWRhdGVOb05ldHdvcmtpbmdQcm9wcyhwcm9wcyk7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZFNlY3VyaXR5R3JvdXAoLi4uc2VjdXJpdHlHcm91cHNJblRoaXNTdGFjayh0aGlzLCBwcm9wcy5jbHVzdGVyLmNvbm5lY3Rpb25zLnNlY3VyaXR5R3JvdXBzKSk7XG4gICAgfVxuXG4gICAgdGhpcy5hZGRQbGFjZW1lbnRDb25zdHJhaW50cyguLi5wcm9wcy5wbGFjZW1lbnRDb25zdHJhaW50cyB8fCBbXSk7XG4gICAgdGhpcy5hZGRQbGFjZW1lbnRTdHJhdGVnaWVzKC4uLnByb3BzLnBsYWNlbWVudFN0cmF0ZWdpZXMgfHwgW10pO1xuXG4gICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oe1xuICAgICAgdmFsaWRhdGU6ICgpID0+ICF0aGlzLnRhc2tEZWZpbml0aW9uLmRlZmF1bHRDb250YWluZXIgPyBbJ0EgVGFza0RlZmluaXRpb24gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBlc3NlbnRpYWwgY29udGFpbmVyJ10gOiBbXSxcbiAgICB9KTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6IHRoaXMudmFsaWRhdGVFYzJTZXJ2aWNlLmJpbmQodGhpcykgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBvbmUgb3IgbW9yZSBwbGFjZW1lbnQgc3RyYXRlZ2llcyB0byB1c2UgZm9yIHRhc2tzIGluIHRoZSBzZXJ2aWNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gICAqIFtBbWF6b24gRUNTIFRhc2sgUGxhY2VtZW50IFN0cmF0ZWdpZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3Rhc2stcGxhY2VtZW50LXN0cmF0ZWdpZXMuaHRtbCkuXG4gICAqL1xuICBwdWJsaWMgYWRkUGxhY2VtZW50U3RyYXRlZ2llcyguLi5zdHJhdGVnaWVzOiBQbGFjZW1lbnRTdHJhdGVneVtdKSB7XG4gICAgaWYgKHN0cmF0ZWdpZXMubGVuZ3RoID4gMCAmJiB0aGlzLmRhZW1vbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY29uZmlndXJlIHBsYWNlbWVudCBzdHJhdGVnaWVzIHdoZW4gZGFlbW9uPXRydWVcIik7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBzdHJhdGVneSBvZiBzdHJhdGVnaWVzKSB7XG4gICAgICB0aGlzLnN0cmF0ZWdpZXMucHVzaCguLi5zdHJhdGVneS50b0pzb24oKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgb25lIG9yIG1vcmUgcGxhY2VtZW50IGNvbnN0cmFpbnRzIHRvIHVzZSBmb3IgdGFza3MgaW4gdGhlIHNlcnZpY2UuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAgICogW0FtYXpvbiBFQ1MgVGFzayBQbGFjZW1lbnQgQ29uc3RyYWludHNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3Rhc2stcGxhY2VtZW50LWNvbnN0cmFpbnRzLmh0bWwpLlxuICAgKi9cbiAgcHVibGljIGFkZFBsYWNlbWVudENvbnN0cmFpbnRzKC4uLmNvbnN0cmFpbnRzOiBQbGFjZW1lbnRDb25zdHJhaW50W10pIHtcbiAgICBmb3IgKGNvbnN0IGNvbnN0cmFpbnQgb2YgY29uc3RyYWludHMpIHtcbiAgICAgIHRoaXMuY29uc3RyYWludHMucHVzaCguLi5jb25zdHJhaW50LnRvSnNvbigpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIHRoaXMgRWMyU2VydmljZS5cbiAgICovXG4gIHByaXZhdGUgdmFsaWRhdGVFYzJTZXJ2aWNlKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIGlmICghdGhpcy5jbHVzdGVyLmhhc0VjMkNhcGFjaXR5KSB7XG4gICAgICByZXQucHVzaCgnQ2x1c3RlciBmb3IgdGhpcyBzZXJ2aWNlIG5lZWRzIEVjMiBjYXBhY2l0eS4gQ2FsbCBhZGRYeHhDYXBhY2l0eSgpIG9uIHRoZSBjbHVzdGVyLicpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbi8qKlxuICogVmFsaWRhdGUgY29tYmluYXRpb25zIG9mIG5ldHdvcmtpbmcgYXJndW1lbnRzLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZU5vTmV0d29ya2luZ1Byb3BzKHByb3BzOiBFYzJTZXJ2aWNlUHJvcHMpIHtcbiAgaWYgKHByb3BzLnZwY1N1Ym5ldHMgIT09IHVuZGVmaW5lZFxuICAgIHx8IHByb3BzLnNlY3VyaXR5R3JvdXAgIT09IHVuZGVmaW5lZFxuICAgIHx8IHByb3BzLnNlY3VyaXR5R3JvdXBzICE9PSB1bmRlZmluZWRcbiAgICB8fCBwcm9wcy5hc3NpZ25QdWJsaWNJcCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndnBjU3VibmV0cywgc2VjdXJpdHlHcm91cChzKSBhbmQgYXNzaWduUHVibGljSXAgY2FuIG9ubHkgYmUgdXNlZCBpbiBBd3NWcGMgbmV0d29ya2luZyBtb2RlJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBGb3JjZSBzZWN1cml0eSBncm91cCBydWxlcyB0byBiZSBjcmVhdGVkIGluIHRoaXMgc3RhY2suXG4gKlxuICogRm9yIGV2ZXJ5IHNlY3VyaXR5IGdyb3VwLCBpZiB0aGUgc2NvcGUgYW5kIHRoZSBncm91cCBhcmUgaW4gZGlmZmVyZW50IHN0YWNrcywgcmV0dXJuXG4gKiBhIGZha2UgXCJpbXBvcnRlZFwiIHNlY3VyaXR5IGdyb3VwIGluc3RlYWQuIFRoaXMgd2lsbCBiZWhhdmUgYXMgdGhlIG9yaWdpbmFsIHNlY3VyaXR5IGdyb3VwLFxuICogYnV0IG5ldyBJbmdyZXNzIGFuZCBFZ3Jlc3MgcnVsZSByZXNvdXJjZXMgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY3VycmVudCBzdGFjayBpbnN0ZWFkIG9mIHRoZVxuICogb3RoZXIgb25lLlxuICovXG5mdW5jdGlvbiBzZWN1cml0eUdyb3Vwc0luVGhpc1N0YWNrKHNjb3BlOiBDb25zdHJ1Y3QsIGdyb3VwczogZWMyLklTZWN1cml0eUdyb3VwW10pOiBlYzIuSVNlY3VyaXR5R3JvdXBbXSB7XG4gIGNvbnN0IHRoaXNTdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcblxuICBsZXQgaSA9IDE7XG4gIHJldHVybiBncm91cHMubWFwKGdyb3VwID0+IHtcbiAgICBpZiAodGhpc1N0YWNrID09PSBTdGFjay5vZihncm91cCkpIHsgcmV0dXJuIGdyb3VwOyB9IC8vIFNpbXBsZSBjYXNlLCBqdXN0IHJldHVybiB0aGUgb3JpZ2luYWwgb25lXG5cbiAgICByZXR1cm4gZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzY29wZSwgYFNlY3VyaXR5R3JvdXAke2krK31gLCBncm91cC5zZWN1cml0eUdyb3VwSWQsIHtcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGdyb3VwLmFsbG93QWxsT3V0Ym91bmQsXG4gICAgICBtdXRhYmxlOiB0cnVlLFxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaGUgYnVpbHQtaW4gY29udGFpbmVyIGluc3RhbmNlIGF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IGNsYXNzIEJ1aWx0SW5BdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBpZCBvZiB0aGUgaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IElOU1RBTkNFX0lEID0gJ2luc3RhbmNlSWQnO1xuXG4gIC8qKlxuICAgKiBUaGUgQXZhaWxhYmlsaXR5Wm9uZSB3aGVyZSB0aGUgaW5zdGFuY2UgaXMgcnVubmluZyBpbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQVZBSUxBQklMSVRZX1pPTkUgPSAnYXR0cmlidXRlOmVjcy5hdmFpbGFiaWxpdHktem9uZSc7XG5cbiAgLyoqXG4gICAqIFRoZSBBTUkgaWQgdGhlIGluc3RhbmNlIGlzIHVzaW5nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTUlfSUQgPSAnYXR0cmlidXRlOmVjcy5hbWktaWQnO1xuXG4gIC8qKlxuICAgKiBUaGUgRUMyIGluc3RhbmNlIHR5cGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IElOU1RBTkNFX1RZUEUgPSAnYXR0cmlidXRlOmVjcy5pbnN0YW5jZS10eXBlJztcblxuICAvKipcbiAgICogVGhlIG9wZXJhdGluZyBzeXN0ZW0gb2YgdGhlIGluc3RhbmNlLlxuICAgKlxuICAgKiBFaXRoZXIgJ2xpbnV4JyBvciAnd2luZG93cycuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE9TX1RZUEUgPSAnYXR0cmlidXRlOmVjcy5vcy10eXBlJztcbn1cbiJdfQ==