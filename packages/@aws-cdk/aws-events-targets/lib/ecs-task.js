"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsTask = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const util_1 = require("./util");
/**
 * Start a task on an ECS cluster
 */
class EcsTask {
    constructor(props) {
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_EcsTaskProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcsTask);
            }
            throw error;
        }
        if (props.securityGroup !== undefined && props.securityGroups !== undefined) {
            throw new Error('Only one of SecurityGroup or SecurityGroups can be populated.');
        }
        this.cluster = props.cluster;
        this.taskDefinition = props.taskDefinition;
        this.taskCount = props.taskCount ?? 1;
        this.platformVersion = props.platformVersion;
        this.role = props.role ?? util_1.singletonEventRole(this.taskDefinition);
        for (const stmt of this.createEventRolePolicyStatements()) {
            this.role.addToPrincipalPolicy(stmt);
        }
        // Security groups are only configurable with the "awsvpc" network mode.
        if (this.taskDefinition.networkMode !== ecs.NetworkMode.AWS_VPC) {
            if (props.securityGroup !== undefined || props.securityGroups !== undefined) {
                cdk.Annotations.of(this.taskDefinition).addWarning('security groups are ignored when network mode is not awsvpc');
            }
            return;
        }
        if (props.securityGroups) {
            this.securityGroups = props.securityGroups;
            return;
        }
        if (!constructs_1.Construct.isConstruct(this.taskDefinition)) {
            throw new Error('Cannot create a security group for ECS task. ' +
                'The task definition in ECS task is not a Construct. ' +
                'Please pass a taskDefinition as a Construct in EcsTaskProps.');
        }
        let securityGroup = props.securityGroup || this.taskDefinition.node.tryFindChild('SecurityGroup');
        securityGroup = securityGroup || new ec2.SecurityGroup(this.taskDefinition, 'SecurityGroup', { vpc: this.props.cluster.vpc });
        this.securityGroup = securityGroup; // Maintain backwards-compatibility for customers that read the generated security group.
        this.securityGroups = [securityGroup];
    }
    /**
     * Allows using tasks as target of EventBridge events
     */
    bind(_rule, _id) {
        const arn = this.cluster.clusterArn;
        const role = this.role;
        const containerOverrides = this.props.containerOverrides && this.props.containerOverrides
            .map(({ containerName, ...overrides }) => ({ name: containerName, ...overrides }));
        const input = { containerOverrides };
        const taskCount = this.taskCount;
        const taskDefinitionArn = this.taskDefinition.taskDefinitionArn;
        const subnetSelection = this.props.subnetSelection || { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS };
        const assignPublicIp = subnetSelection.subnetType === ec2.SubnetType.PUBLIC ? 'ENABLED' : 'DISABLED';
        const baseEcsParameters = { taskCount, taskDefinitionArn };
        const ecsParameters = this.taskDefinition.networkMode === ecs.NetworkMode.AWS_VPC
            ? {
                ...baseEcsParameters,
                launchType: this.taskDefinition.isEc2Compatible ? 'EC2' : 'FARGATE',
                platformVersion: this.platformVersion,
                networkConfiguration: {
                    awsVpcConfiguration: {
                        subnets: this.props.cluster.vpc.selectSubnets(subnetSelection).subnetIds,
                        assignPublicIp,
                        securityGroups: this.securityGroups && this.securityGroups.map(sg => sg.securityGroupId),
                    },
                },
            }
            : baseEcsParameters;
        if (this.props.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
        }
        return {
            ...util_1.bindBaseTargetConfig(this.props),
            arn,
            role,
            ecsParameters,
            input: events.RuleTargetInput.fromObject(input),
            targetResource: this.taskDefinition,
        };
    }
    createEventRolePolicyStatements() {
        const policyStatements = [new iam.PolicyStatement({
                actions: ['ecs:RunTask'],
                resources: [this.taskDefinition.taskDefinitionArn],
                conditions: {
                    ArnEquals: { 'ecs:cluster': this.cluster.clusterArn },
                },
            })];
        // If it so happens that a Task Execution Role was created for the TaskDefinition,
        // then the EventBridge Role must have permissions to pass it (otherwise it doesn't).
        if (this.taskDefinition.executionRole !== undefined) {
            policyStatements.push(new iam.PolicyStatement({
                actions: ['iam:PassRole'],
                resources: [this.taskDefinition.executionRole.roleArn],
            }));
        }
        // For Fargate task we need permission to pass the task role.
        if (this.taskDefinition.isFargateCompatible) {
            policyStatements.push(new iam.PolicyStatement({
                actions: ['iam:PassRole'],
                resources: [this.taskDefinition.taskRole.roleArn],
            }));
        }
        return policyStatements;
    }
}
exports.EcsTask = EcsTask;
_a = JSII_RTTI_SYMBOL_1;
EcsTask[_a] = { fqn: "@aws-cdk/aws-events-targets.EcsTask", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLXRhc2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlY3MtdGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLDJDQUF1QztBQUV2QyxpQ0FBdUg7QUE4RXZIOztHQUVHO0FBQ0gsTUFBYSxPQUFPO0lBdUJsQixZQUE2QixLQUFtQjtRQUFuQixVQUFLLEdBQUwsS0FBSyxDQUFjOzs7Ozs7K0NBdkJyQyxPQUFPOzs7O1FBd0JoQixJQUFJLEtBQUssQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFFO1lBQzNFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztTQUNsRjtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7UUFDM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7UUFFN0MsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLHlCQUFrQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNsRSxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQywrQkFBK0IsRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEM7UUFFRCx3RUFBd0U7UUFDeEUsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsS0FBSyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtZQUMvRCxJQUFJLEtBQUssQ0FB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QUFjLENBQUM7Z0JBQ3pCLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQzthQUN2RCxDQUFDLENBQUMsQ0FBQztTQUNMO1FBRUQsNkRBQTZEO1FBQzdELElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRTtZQUMzQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO2dCQUM1QyxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7Z0JBQ3pCLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUNsRCxDQUFDLENBQUMsQ0FBQztTQUNMO1FBRUQsT0FBTyxnQkFBZ0IsQ0FBQztLQUN6Qjs7QUF2SUgsMEJBd0lDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDb250YWluZXJPdmVycmlkZSB9IGZyb20gJy4vZWNzLXRhc2stcHJvcGVydGllcyc7XG5pbXBvcnQgeyBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5LCBiaW5kQmFzZVRhcmdldENvbmZpZywgc2luZ2xldG9uRXZlbnRSb2xlLCBUYXJnZXRCYXNlUHJvcHMgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gZGVmaW5lIGFuIEVDUyBFdmVudCBUYXNrXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWNzVGFza1Byb3BzIGV4dGVuZHMgVGFyZ2V0QmFzZVByb3BzIHtcbiAgLyoqXG4gICAqIENsdXN0ZXIgd2hlcmUgc2VydmljZSB3aWxsIGJlIGRlcGxveWVkXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBlY3MuSUNsdXN0ZXI7XG5cbiAgLyoqXG4gICAqIFRhc2sgRGVmaW5pdGlvbiBvZiB0aGUgdGFzayB0aGF0IHNob3VsZCBiZSBzdGFydGVkXG4gICAqL1xuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbjogZWNzLklUYXNrRGVmaW5pdGlvbjtcblxuICAvKipcbiAgICogSG93IG1hbnkgdGFza3Mgc2hvdWxkIGJlIHN0YXJ0ZWQgd2hlbiB0aGlzIGV2ZW50IGlzIHRyaWdnZXJlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICByZWFkb25seSB0YXNrQ291bnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENvbnRhaW5lciBzZXR0aW5nIG92ZXJyaWRlc1xuICAgKlxuICAgKiBLZXkgaXMgdGhlIG5hbWUgb2YgdGhlIGNvbnRhaW5lciB0byBvdmVycmlkZSwgdmFsdWUgaXMgdGhlXG4gICAqIHZhbHVlcyB5b3Ugd2FudCB0byBvdmVycmlkZS5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lck92ZXJyaWRlcz86IENvbnRhaW5lck92ZXJyaWRlW107XG5cbiAgLyoqXG4gICAqIEluIHdoYXQgc3VibmV0cyB0byBwbGFjZSB0aGUgdGFzaydzIEVOSXNcbiAgICpcbiAgICogKE9ubHkgYXBwbGljYWJsZSBpbiBjYXNlIHRoZSBUYXNrRGVmaW5pdGlvbiBpcyBjb25maWd1cmVkIGZvciBBd3NWcGMgbmV0d29ya2luZylcbiAgICpcbiAgICogQGRlZmF1bHQgUHJpdmF0ZSBzdWJuZXRzXG4gICAqL1xuICByZWFkb25seSBzdWJuZXRTZWxlY3Rpb24/OiBlYzIuU3VibmV0U2VsZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBFeGlzdGluZyBzZWN1cml0eSBncm91cCB0byB1c2UgZm9yIHRoZSB0YXNrJ3MgRU5Jc1xuICAgKlxuICAgKiAoT25seSBhcHBsaWNhYmxlIGluIGNhc2UgdGhlIFRhc2tEZWZpbml0aW9uIGlzIGNvbmZpZ3VyZWQgZm9yIEF3c1ZwYyBuZXR3b3JraW5nKVxuICAgKlxuICAgKiBAZGVmYXVsdCBBIG5ldyBzZWN1cml0eSBncm91cCBpcyBjcmVhdGVkXG4gICAqIEBkZXByZWNhdGVkIHVzZSBzZWN1cml0eUdyb3VwcyBpbnN0ZWFkXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwPzogZWMyLklTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBFeGlzdGluZyBzZWN1cml0eSBncm91cHMgdG8gdXNlIGZvciB0aGUgdGFzaydzIEVOSXNcbiAgICpcbiAgICogKE9ubHkgYXBwbGljYWJsZSBpbiBjYXNlIHRoZSBUYXNrRGVmaW5pdGlvbiBpcyBjb25maWd1cmVkIGZvciBBd3NWcGMgbmV0d29ya2luZylcbiAgICpcbiAgICogQGRlZmF1bHQgQSBuZXcgc2VjdXJpdHkgZ3JvdXAgaXMgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBlYzIuSVNlY3VyaXR5R3JvdXBbXTtcblxuICAvKipcbiAgICogRXhpc3RpbmcgSUFNIHJvbGUgdG8gcnVuIHRoZSBFQ1MgdGFza1xuICAgKlxuICAgKiBAZGVmYXVsdCBBIG5ldyBJQU0gcm9sZSBpcyBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgcGxhdGZvcm0gdmVyc2lvbiBvbiB3aGljaCB0byBydW4geW91ciB0YXNrXG4gICAqXG4gICAqIFVubGVzcyB5b3UgaGF2ZSBzcGVjaWZpYyBjb21wYXRpYmlsaXR5IHJlcXVpcmVtZW50cywgeW91IGRvbid0IG5lZWQgdG8gc3BlY2lmeSB0aGlzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3BsYXRmb3JtX3ZlcnNpb25zLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFQ1Mgd2lsbCBzZXQgdGhlIEZhcmdhdGUgcGxhdGZvcm0gdmVyc2lvbiB0byAnTEFURVNUJ1xuICAgKi9cbiAgcmVhZG9ubHkgcGxhdGZvcm1WZXJzaW9uPzogZWNzLkZhcmdhdGVQbGF0Zm9ybVZlcnNpb247XG59XG5cbi8qKlxuICogU3RhcnQgYSB0YXNrIG9uIGFuIEVDUyBjbHVzdGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3NUYXNrIGltcGxlbWVudHMgZXZlbnRzLklSdWxlVGFyZ2V0IHtcbiAgLy8gU2VjdXJpdHkgZ3JvdXAgZmllbGRzIGFyZSBwdWJsaWMgYmVjYXVzZSB3ZSBjYW4gZ2VuZXJhdGUgYSBuZXcgc2VjdXJpdHkgZ3JvdXAgaWYgbm9uZSBpcyBwcm92aWRlZC5cblxuICAvKipcbiAgICogVGhlIHNlY3VyaXR5IGdyb3VwIGFzc29jaWF0ZWQgd2l0aCB0aGUgdGFzay4gT25seSBhcHBsaWNhYmxlIHdpdGggYXdzdnBjIG5ldHdvcmsgbW9kZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyBzZWN1cml0eSBncm91cCBpcyBjcmVhdGVkLlxuICAgKiBAZGVwcmVjYXRlZCB1c2Ugc2VjdXJpdHlHcm91cHMgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZWN1cml0eUdyb3VwPzogZWMyLklTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VjdXJpdHkgZ3JvdXBzIGFzc29jaWF0ZWQgd2l0aCB0aGUgdGFzay4gT25seSBhcHBsaWNhYmxlIHdpdGggYXdzdnBjIG5ldHdvcmsgbW9kZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyBzZWN1cml0eSBncm91cCBpcyBjcmVhdGVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBzPzogZWMyLklTZWN1cml0eUdyb3VwW107XG4gIHByaXZhdGUgcmVhZG9ubHkgY2x1c3RlcjogZWNzLklDbHVzdGVyO1xuICBwcml2YXRlIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uOiBlY3MuSVRhc2tEZWZpbml0aW9uO1xuICBwcml2YXRlIHJlYWRvbmx5IHRhc2tDb3VudDogbnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IHJvbGU6IGlhbS5JUm9sZTtcbiAgcHJpdmF0ZSByZWFkb25seSBwbGF0Zm9ybVZlcnNpb24/OiBlY3MuRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBFY3NUYXNrUHJvcHMpIHtcbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cCAhPT0gdW5kZWZpbmVkICYmIHByb3BzLnNlY3VyaXR5R3JvdXBzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgb2YgU2VjdXJpdHlHcm91cCBvciBTZWN1cml0eUdyb3VwcyBjYW4gYmUgcG9wdWxhdGVkLicpO1xuICAgIH1cblxuICAgIHRoaXMuY2x1c3RlciA9IHByb3BzLmNsdXN0ZXI7XG4gICAgdGhpcy50YXNrRGVmaW5pdGlvbiA9IHByb3BzLnRhc2tEZWZpbml0aW9uO1xuICAgIHRoaXMudGFza0NvdW50ID0gcHJvcHMudGFza0NvdW50ID8/IDE7XG4gICAgdGhpcy5wbGF0Zm9ybVZlcnNpb24gPSBwcm9wcy5wbGF0Zm9ybVZlcnNpb247XG5cbiAgICB0aGlzLnJvbGUgPSBwcm9wcy5yb2xlID8/IHNpbmdsZXRvbkV2ZW50Um9sZSh0aGlzLnRhc2tEZWZpbml0aW9uKTtcbiAgICBmb3IgKGNvbnN0IHN0bXQgb2YgdGhpcy5jcmVhdGVFdmVudFJvbGVQb2xpY3lTdGF0ZW1lbnRzKCkpIHtcbiAgICAgIHRoaXMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdG10KTtcbiAgICB9XG5cbiAgICAvLyBTZWN1cml0eSBncm91cHMgYXJlIG9ubHkgY29uZmlndXJhYmxlIHdpdGggdGhlIFwiYXdzdnBjXCIgbmV0d29yayBtb2RlLlxuICAgIGlmICh0aGlzLnRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlICE9PSBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQykge1xuICAgICAgaWYgKHByb3BzLnNlY3VyaXR5R3JvdXAgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy5zZWN1cml0eUdyb3VwcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNkay5Bbm5vdGF0aW9ucy5vZih0aGlzLnRhc2tEZWZpbml0aW9uKS5hZGRXYXJuaW5nKCdzZWN1cml0eSBncm91cHMgYXJlIGlnbm9yZWQgd2hlbiBuZXR3b3JrIG1vZGUgaXMgbm90IGF3c3ZwYycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cHMpIHtcbiAgICAgIHRoaXMuc2VjdXJpdHlHcm91cHMgPSBwcm9wcy5zZWN1cml0eUdyb3VwcztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIUNvbnN0cnVjdC5pc0NvbnN0cnVjdCh0aGlzLnRhc2tEZWZpbml0aW9uKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgc2VjdXJpdHkgZ3JvdXAgZm9yIEVDUyB0YXNrLiAnICtcbiAgICAgICAgJ1RoZSB0YXNrIGRlZmluaXRpb24gaW4gRUNTIHRhc2sgaXMgbm90IGEgQ29uc3RydWN0LiAnICtcbiAgICAgICAgJ1BsZWFzZSBwYXNzIGEgdGFza0RlZmluaXRpb24gYXMgYSBDb25zdHJ1Y3QgaW4gRWNzVGFza1Byb3BzLicpO1xuICAgIH1cblxuICAgIGxldCBzZWN1cml0eUdyb3VwID0gcHJvcHMuc2VjdXJpdHlHcm91cCB8fCB0aGlzLnRhc2tEZWZpbml0aW9uLm5vZGUudHJ5RmluZENoaWxkKCdTZWN1cml0eUdyb3VwJykgYXMgZWMyLklTZWN1cml0eUdyb3VwO1xuICAgIHNlY3VyaXR5R3JvdXAgPSBzZWN1cml0eUdyb3VwIHx8IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLnRhc2tEZWZpbml0aW9uLCAnU2VjdXJpdHlHcm91cCcsIHsgdnBjOiB0aGlzLnByb3BzLmNsdXN0ZXIudnBjIH0pO1xuICAgIHRoaXMuc2VjdXJpdHlHcm91cCA9IHNlY3VyaXR5R3JvdXA7IC8vIE1haW50YWluIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciBjdXN0b21lcnMgdGhhdCByZWFkIHRoZSBnZW5lcmF0ZWQgc2VjdXJpdHkgZ3JvdXAuXG4gICAgdGhpcy5zZWN1cml0eUdyb3VwcyA9IFtzZWN1cml0eUdyb3VwXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdXNpbmcgdGFza3MgYXMgdGFyZ2V0IG9mIEV2ZW50QnJpZGdlIGV2ZW50c1xuICAgKi9cbiAgcHVibGljIGJpbmQoX3J1bGU6IGV2ZW50cy5JUnVsZSwgX2lkPzogc3RyaW5nKTogZXZlbnRzLlJ1bGVUYXJnZXRDb25maWcge1xuICAgIGNvbnN0IGFybiA9IHRoaXMuY2x1c3Rlci5jbHVzdGVyQXJuO1xuICAgIGNvbnN0IHJvbGUgPSB0aGlzLnJvbGU7XG4gICAgY29uc3QgY29udGFpbmVyT3ZlcnJpZGVzID0gdGhpcy5wcm9wcy5jb250YWluZXJPdmVycmlkZXMgJiYgdGhpcy5wcm9wcy5jb250YWluZXJPdmVycmlkZXNcbiAgICAgIC5tYXAoKHsgY29udGFpbmVyTmFtZSwgLi4ub3ZlcnJpZGVzIH0pID0+ICh7IG5hbWU6IGNvbnRhaW5lck5hbWUsIC4uLm92ZXJyaWRlcyB9KSk7XG4gICAgY29uc3QgaW5wdXQgPSB7IGNvbnRhaW5lck92ZXJyaWRlcyB9O1xuICAgIGNvbnN0IHRhc2tDb3VudCA9IHRoaXMudGFza0NvdW50O1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uQXJuID0gdGhpcy50YXNrRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbkFybjtcblxuICAgIGNvbnN0IHN1Ym5ldFNlbGVjdGlvbiA9IHRoaXMucHJvcHMuc3VibmV0U2VsZWN0aW9uIHx8IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyB9O1xuICAgIGNvbnN0IGFzc2lnblB1YmxpY0lwID0gc3VibmV0U2VsZWN0aW9uLnN1Ym5ldFR5cGUgPT09IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyA/ICdFTkFCTEVEJyA6ICdESVNBQkxFRCc7XG5cbiAgICBjb25zdCBiYXNlRWNzUGFyYW1ldGVycyA9IHsgdGFza0NvdW50LCB0YXNrRGVmaW5pdGlvbkFybiB9O1xuXG4gICAgY29uc3QgZWNzUGFyYW1ldGVyczogZXZlbnRzLkNmblJ1bGUuRWNzUGFyYW1ldGVyc1Byb3BlcnR5ID0gdGhpcy50YXNrRGVmaW5pdGlvbi5uZXR3b3JrTW9kZSA9PT0gZWNzLk5ldHdvcmtNb2RlLkFXU19WUENcbiAgICAgID8ge1xuICAgICAgICAuLi5iYXNlRWNzUGFyYW1ldGVycyxcbiAgICAgICAgbGF1bmNoVHlwZTogdGhpcy50YXNrRGVmaW5pdGlvbi5pc0VjMkNvbXBhdGlibGUgPyAnRUMyJyA6ICdGQVJHQVRFJyxcbiAgICAgICAgcGxhdGZvcm1WZXJzaW9uOiB0aGlzLnBsYXRmb3JtVmVyc2lvbixcbiAgICAgICAgbmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBhd3NWcGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBzdWJuZXRzOiB0aGlzLnByb3BzLmNsdXN0ZXIudnBjLnNlbGVjdFN1Ym5ldHMoc3VibmV0U2VsZWN0aW9uKS5zdWJuZXRJZHMsXG4gICAgICAgICAgICBhc3NpZ25QdWJsaWNJcCxcbiAgICAgICAgICAgIHNlY3VyaXR5R3JvdXBzOiB0aGlzLnNlY3VyaXR5R3JvdXBzICYmIHRoaXMuc2VjdXJpdHlHcm91cHMubWFwKHNnID0+IHNnLnNlY3VyaXR5R3JvdXBJZCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIDogYmFzZUVjc1BhcmFtZXRlcnM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5kZWFkTGV0dGVyUXVldWUpIHtcbiAgICAgIGFkZFRvRGVhZExldHRlclF1ZXVlUmVzb3VyY2VQb2xpY3koX3J1bGUsIHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uYmluZEJhc2VUYXJnZXRDb25maWcodGhpcy5wcm9wcyksXG4gICAgICBhcm4sXG4gICAgICByb2xlLFxuICAgICAgZWNzUGFyYW1ldGVycyxcbiAgICAgIGlucHV0OiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoaW5wdXQpLFxuICAgICAgdGFyZ2V0UmVzb3VyY2U6IHRoaXMudGFza0RlZmluaXRpb24sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRSb2xlUG9saWN5U3RhdGVtZW50cygpOiBpYW0uUG9saWN5U3RhdGVtZW50W10ge1xuICAgIGNvbnN0IHBvbGljeVN0YXRlbWVudHMgPSBbbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydlY3M6UnVuVGFzayddLFxuICAgICAgcmVzb3VyY2VzOiBbdGhpcy50YXNrRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbkFybl0sXG4gICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgIEFybkVxdWFsczogeyAnZWNzOmNsdXN0ZXInOiB0aGlzLmNsdXN0ZXIuY2x1c3RlckFybiB9LFxuICAgICAgfSxcbiAgICB9KV07XG5cbiAgICAvLyBJZiBpdCBzbyBoYXBwZW5zIHRoYXQgYSBUYXNrIEV4ZWN1dGlvbiBSb2xlIHdhcyBjcmVhdGVkIGZvciB0aGUgVGFza0RlZmluaXRpb24sXG4gICAgLy8gdGhlbiB0aGUgRXZlbnRCcmlkZ2UgUm9sZSBtdXN0IGhhdmUgcGVybWlzc2lvbnMgdG8gcGFzcyBpdCAob3RoZXJ3aXNlIGl0IGRvZXNuJ3QpLlxuICAgIGlmICh0aGlzLnRhc2tEZWZpbml0aW9uLmV4ZWN1dGlvblJvbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcG9saWN5U3RhdGVtZW50cy5wdXNoKG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydpYW06UGFzc1JvbGUnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy50YXNrRGVmaW5pdGlvbi5leGVjdXRpb25Sb2xlLnJvbGVBcm5dLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8vIEZvciBGYXJnYXRlIHRhc2sgd2UgbmVlZCBwZXJtaXNzaW9uIHRvIHBhc3MgdGhlIHRhc2sgcm9sZS5cbiAgICBpZiAodGhpcy50YXNrRGVmaW5pdGlvbi5pc0ZhcmdhdGVDb21wYXRpYmxlKSB7XG4gICAgICBwb2xpY3lTdGF0ZW1lbnRzLnB1c2gobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ2lhbTpQYXNzUm9sZSddLFxuICAgICAgICByZXNvdXJjZXM6IFt0aGlzLnRhc2tEZWZpbml0aW9uLnRhc2tSb2xlLnJvbGVBcm5dLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJldHVybiBwb2xpY3lTdGF0ZW1lbnRzO1xuICB9XG59XG4iXX0=