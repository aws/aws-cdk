"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerDeploymentGroup = exports.InstanceTagSet = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const application_1 = require("./application");
const deployment_config_1 = require("./deployment-config");
const load_balancer_1 = require("./load-balancer");
const codedeploy_generated_1 = require("../codedeploy.generated");
const base_deployment_group_1 = require("../private/base-deployment-group");
const utils_1 = require("../private/utils");
class ImportedServerDeploymentGroup extends base_deployment_group_1.ImportedDeploymentGroupBase {
    constructor(scope, id, props) {
        super(scope, id, {
            application: props.application,
            deploymentGroupName: props.deploymentGroupName,
        });
        this.role = undefined;
        this.autoScalingGroups = undefined;
        this.application = props.application;
        this.deploymentConfig = this._bindDeploymentConfig(props.deploymentConfig || deployment_config_1.ServerDeploymentConfig.ONE_AT_A_TIME);
    }
}
/**
 * Represents a set of instance tag groups.
 * An instance will match a set if it matches all of the groups in the set -
 * in other words, sets follow 'and' semantics.
 * You can have a maximum of 3 tag groups inside a set.
 */
class InstanceTagSet {
    constructor(...instanceTagGroups) {
        if (instanceTagGroups.length > 3) {
            throw new Error('An instance tag set can have a maximum of 3 instance tag groups, ' +
                `but ${instanceTagGroups.length} were provided`);
        }
        this._instanceTagGroups = instanceTagGroups;
    }
    get instanceTagGroups() {
        return this._instanceTagGroups.slice();
    }
}
exports.InstanceTagSet = InstanceTagSet;
_a = JSII_RTTI_SYMBOL_1;
InstanceTagSet[_a] = { fqn: "@aws-cdk/aws-codedeploy.InstanceTagSet", version: "0.0.0" };
/**
 * A CodeDeploy Deployment Group that deploys to EC2/on-premise instances.
 * @resource AWS::CodeDeploy::DeploymentGroup
 */
class ServerDeploymentGroup extends base_deployment_group_1.DeploymentGroupBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            deploymentGroupName: props.deploymentGroupName,
            role: props.role,
            roleConstructId: 'Role',
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_ServerDeploymentGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ServerDeploymentGroup);
            }
            throw error;
        }
        this.role = this._role;
        this.application = props.application || new application_1.ServerApplication(this, 'Application', {
            applicationName: props.deploymentGroupName === cdk.PhysicalName.GENERATE_IF_NEEDED ? cdk.PhysicalName.GENERATE_IF_NEEDED : undefined,
        });
        this.deploymentConfig = this._bindDeploymentConfig(props.deploymentConfig || deployment_config_1.ServerDeploymentConfig.ONE_AT_A_TIME);
        this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSCodeDeployRole'));
        this._autoScalingGroups = props.autoScalingGroups || [];
        this.installAgent = props.installAgent ?? true;
        this.codeDeployBucket = s3.Bucket.fromBucketName(this, 'Bucket', `aws-codedeploy-${cdk.Stack.of(this).region}`);
        for (const asg of this._autoScalingGroups) {
            this.addCodeDeployAgentInstallUserData(asg);
        }
        this.alarms = props.alarms || [];
        const removeAlarmsFromDeploymentGroup = cdk.FeatureFlags.of(this).isEnabled(cx_api_1.CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP);
        const resource = new codedeploy_generated_1.CfnDeploymentGroup(this, 'Resource', {
            applicationName: this.application.applicationName,
            deploymentGroupName: this.physicalName,
            serviceRoleArn: this.role.roleArn,
            deploymentConfigName: props.deploymentConfig &&
                props.deploymentConfig.deploymentConfigName,
            autoScalingGroups: cdk.Lazy.list({ produce: () => this._autoScalingGroups.map(asg => asg.autoScalingGroupName) }, { omitEmpty: true }),
            loadBalancerInfo: this.loadBalancerInfo(props.loadBalancer),
            deploymentStyle: props.loadBalancer === undefined
                ? undefined
                : {
                    deploymentOption: 'WITH_TRAFFIC_CONTROL',
                },
            ec2TagSet: this.ec2TagSet(props.ec2InstanceTags),
            onPremisesTagSet: this.onPremiseTagSet(props.onPremiseInstanceTags),
            alarmConfiguration: cdk.Lazy.any({
                produce: () => utils_1.renderAlarmConfiguration(this.alarms, props.ignorePollAlarmsFailure, removeAlarmsFromDeploymentGroup),
            }),
            autoRollbackConfiguration: cdk.Lazy.any({ produce: () => utils_1.renderAutoRollbackConfiguration(this.alarms, props.autoRollback) }),
        });
        this._setNameAndArn(resource, this.application);
    }
    /**
     * Import an EC2/on-premise Deployment Group defined either outside the CDK app,
     * or in a different region.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param attrs the properties of the referenced Deployment Group
     * @returns a Construct representing a reference to an existing Deployment Group
     */
    static fromServerDeploymentGroupAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_ServerDeploymentGroupAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromServerDeploymentGroupAttributes);
            }
            throw error;
        }
        return new ImportedServerDeploymentGroup(scope, id, attrs);
    }
    /**
     * Adds an additional auto-scaling group to this Deployment Group.
     *
     * @param asg the auto-scaling group to add to this Deployment Group.
     * [disable-awslint:ref-via-interface] is needed in order to install the code
     * deploy agent by updating the ASGs user data.
     */
    addAutoScalingGroup(asg) {
        this._autoScalingGroups.push(asg);
        this.addCodeDeployAgentInstallUserData(asg);
    }
    /**
     * Associates an additional alarm with this Deployment Group.
     *
     * @param alarm the alarm to associate with this Deployment Group
     */
    addAlarm(alarm) {
        this.alarms.push(alarm);
    }
    get autoScalingGroups() {
        return this._autoScalingGroups.slice();
    }
    addCodeDeployAgentInstallUserData(asg) {
        if (!this.installAgent) {
            return;
        }
        this.codeDeployBucket.grantRead(asg, 'latest/*');
        switch (asg.osType) {
            case ec2.OperatingSystemType.LINUX:
                asg.addUserData('set +e', // make sure we don't exit on the `which` failing
                'PKG_CMD=`which yum 2>/dev/null`', 'set -e', // continue with failing on error
                'if [ -z "$PKG_CMD" ]; then', 'PKG_CMD=apt-get', 'else', 'PKG_CMD=yum', 'fi', '$PKG_CMD update -y', 'set +e', // make sure we don't exit on the next command failing (we check its exit code below)
                '$PKG_CMD install -y ruby2.0', 'RUBY2_INSTALL=$?', 'set -e', // continue with failing on error
                'if [ $RUBY2_INSTALL -ne 0 ]; then', '$PKG_CMD install -y ruby', 'fi', 'AWS_CLI_PACKAGE_NAME=awscli', 'if [ "$PKG_CMD" = "yum" ]; then', 'AWS_CLI_PACKAGE_NAME=aws-cli', 'fi', '$PKG_CMD install -y $AWS_CLI_PACKAGE_NAME', 'TMP_DIR=`mktemp -d`', 'cd $TMP_DIR', `aws s3 cp s3://aws-codedeploy-${cdk.Stack.of(this).region}/latest/install . --region ${cdk.Stack.of(this).region}`, 'chmod +x ./install', './install auto', 'rm -fr $TMP_DIR');
                break;
            case ec2.OperatingSystemType.WINDOWS:
                asg.addUserData('Set-Variable -Name TEMPDIR -Value (New-TemporaryFile).DirectoryName', `aws s3 cp s3://aws-codedeploy-${cdk.Stack.of(this).region}/latest/codedeploy-agent.msi $TEMPDIR\\codedeploy-agent.msi`, 'cd $TEMPDIR', '.\\codedeploy-agent.msi /quiet /l c:\\temp\\host-agent-install-log.txt');
                break;
        }
    }
    loadBalancerInfo(loadBalancer) {
        if (!loadBalancer) {
            return undefined;
        }
        switch (loadBalancer.generation) {
            case load_balancer_1.LoadBalancerGeneration.FIRST:
                return {
                    elbInfoList: [
                        { name: loadBalancer.name },
                    ],
                };
            case load_balancer_1.LoadBalancerGeneration.SECOND:
                return {
                    targetGroupInfoList: [
                        { name: loadBalancer.name },
                    ],
                };
        }
    }
    ec2TagSet(tagSet) {
        if (!tagSet || tagSet.instanceTagGroups.length === 0) {
            return undefined;
        }
        return {
            ec2TagSetList: tagSet.instanceTagGroups.map(tagGroup => {
                return {
                    ec2TagGroup: this.tagGroup2TagsArray(tagGroup),
                };
            }),
        };
    }
    onPremiseTagSet(tagSet) {
        if (!tagSet || tagSet.instanceTagGroups.length === 0) {
            return undefined;
        }
        return {
            onPremisesTagSetList: tagSet.instanceTagGroups.map(tagGroup => {
                return {
                    onPremisesTagGroup: this.tagGroup2TagsArray(tagGroup),
                };
            }),
        };
    }
    tagGroup2TagsArray(tagGroup) {
        const tagsInGroup = new Array();
        for (const tagKey in tagGroup) {
            if (tagGroup.hasOwnProperty(tagKey)) {
                const tagValues = tagGroup[tagKey];
                if (tagKey.length > 0) {
                    if (tagValues.length > 0) {
                        for (const tagValue of tagValues) {
                            tagsInGroup.push({
                                key: tagKey,
                                value: tagValue,
                                type: 'KEY_AND_VALUE',
                            });
                        }
                    }
                    else {
                        tagsInGroup.push({
                            key: tagKey,
                            type: 'KEY_ONLY',
                        });
                    }
                }
                else {
                    if (tagValues.length > 0) {
                        for (const tagValue of tagValues) {
                            tagsInGroup.push({
                                value: tagValue,
                                type: 'VALUE_ONLY',
                            });
                        }
                    }
                    else {
                        throw new Error('Cannot specify both an empty key and no values for an instance tag filter');
                    }
                }
            }
        }
        return tagsInGroup;
    }
}
exports.ServerDeploymentGroup = ServerDeploymentGroup;
_b = JSII_RTTI_SYMBOL_1;
ServerDeploymentGroup[_b] = { fqn: "@aws-cdk/aws-codedeploy.ServerDeploymentGroup", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1ncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveW1lbnQtZ3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLDRDQUFpRjtBQUVqRiwrQ0FBc0U7QUFDdEUsMkRBQXNGO0FBQ3RGLG1EQUF1RTtBQUN2RSxrRUFBNkQ7QUFDN0QsNEVBQW9HO0FBQ3BHLDRDQUE2RjtBQTZDN0YsTUFBTSw2QkFBOEIsU0FBUSxtREFBMkI7SUFNckUsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQztRQUM5RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixtQkFBbUIsRUFBRSxLQUFLLENBQUMsbUJBQW1CO1NBQy9DLENBQUMsQ0FBQztRQVJXLFNBQUksR0FBYyxTQUFTLENBQUM7UUFDNUIsc0JBQWlCLEdBQW9DLFNBQVMsQ0FBQztRQVM3RSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLElBQUksMENBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDcEg7Q0FDRjtBQWVEOzs7OztHQUtHO0FBQ0gsTUFBYSxjQUFjO0lBR3pCLFlBQVksR0FBRyxpQkFBcUM7UUFDbEQsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUVBQW1FO2dCQUNqRixPQUFPLGlCQUFpQixDQUFDLE1BQU0sZ0JBQWdCLENBQUMsQ0FBQztTQUNwRDtRQUNELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQztLQUM3QztJQUVELElBQVcsaUJBQWlC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WTs2QkFDbkIsQ0FBQyxDQUFDO3lCQUNKO3FCQUNGO3lCQUFNO3dCQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsMkVBQTJFLENBQUMsQ0FBQztxQkFDOUY7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0QsT0FBTyxXQUFXLENBQUM7S0FDcEI7O0FBalBILHNEQWtQQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDT0RFREVQTE9ZX1JFTU9WRV9BTEFSTVNfRlJPTV9ERVBMT1lNRU5UX0dST1VQIH0gZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSVNlcnZlckFwcGxpY2F0aW9uLCBTZXJ2ZXJBcHBsaWNhdGlvbiB9IGZyb20gJy4vYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgSVNlcnZlckRlcGxveW1lbnRDb25maWcsIFNlcnZlckRlcGxveW1lbnRDb25maWcgfSBmcm9tICcuL2RlcGxveW1lbnQtY29uZmlnJztcbmltcG9ydCB7IExvYWRCYWxhbmNlciwgTG9hZEJhbGFuY2VyR2VuZXJhdGlvbiB9IGZyb20gJy4vbG9hZC1iYWxhbmNlcic7XG5pbXBvcnQgeyBDZm5EZXBsb3ltZW50R3JvdXAgfSBmcm9tICcuLi9jb2RlZGVwbG95LmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJbXBvcnRlZERlcGxveW1lbnRHcm91cEJhc2UsIERlcGxveW1lbnRHcm91cEJhc2UgfSBmcm9tICcuLi9wcml2YXRlL2Jhc2UtZGVwbG95bWVudC1ncm91cCc7XG5pbXBvcnQgeyByZW5kZXJBbGFybUNvbmZpZ3VyYXRpb24sIHJlbmRlckF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9wcml2YXRlL3V0aWxzJztcbmltcG9ydCB7IEF1dG9Sb2xsYmFja0NvbmZpZyB9IGZyb20gJy4uL3JvbGxiYWNrLWNvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNlcnZlckRlcGxveW1lbnRHcm91cCBleHRlbmRzIGNkay5JUmVzb3VyY2Uge1xuICByZWFkb25seSBhcHBsaWNhdGlvbjogSVNlcnZlckFwcGxpY2F0aW9uO1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudEdyb3VwTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50R3JvdXBBcm46IHN0cmluZztcbiAgcmVhZG9ubHkgZGVwbG95bWVudENvbmZpZzogSVNlcnZlckRlcGxveW1lbnRDb25maWc7XG4gIHJlYWRvbmx5IGF1dG9TY2FsaW5nR3JvdXBzPzogYXV0b3NjYWxpbmcuSUF1dG9TY2FsaW5nR3JvdXBbXTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG9mIGEgcmVmZXJlbmNlIHRvIGEgQ29kZURlcGxveSBFQzIvb24tcHJlbWlzZSBEZXBsb3ltZW50IEdyb3VwLlxuICpcbiAqIEBzZWUgU2VydmVyRGVwbG95bWVudEdyb3VwI2ltcG9ydFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZlckRlcGxveW1lbnRHcm91cEF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIHJlZmVyZW5jZSB0byB0aGUgQ29kZURlcGxveSBFQzIvb24tcHJlbWlzZSBBcHBsaWNhdGlvblxuICAgKiB0aGF0IHRoaXMgRGVwbG95bWVudCBHcm91cCBiZWxvbmdzIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb246IElTZXJ2ZXJBcHBsaWNhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHBoeXNpY2FsLCBodW1hbi1yZWFkYWJsZSBuYW1lIG9mIHRoZSBDb2RlRGVwbG95IEVDMi9vbi1wcmVtaXNlIERlcGxveW1lbnQgR3JvdXBcbiAgICogdGhhdCB3ZSBhcmUgcmVmZXJlbmNpbmcuXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50R3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBEZXBsb3ltZW50IENvbmZpZ3VyYXRpb24gdGhpcyBEZXBsb3ltZW50IEdyb3VwIHVzZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFNlcnZlckRlcGxveW1lbnRDb25maWcjT25lQXRBVGltZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudENvbmZpZz86IElTZXJ2ZXJEZXBsb3ltZW50Q29uZmlnO1xufVxuXG5jbGFzcyBJbXBvcnRlZFNlcnZlckRlcGxveW1lbnRHcm91cCBleHRlbmRzIEltcG9ydGVkRGVwbG95bWVudEdyb3VwQmFzZSBpbXBsZW1lbnRzIElTZXJ2ZXJEZXBsb3ltZW50R3JvdXAge1xuICBwdWJsaWMgcmVhZG9ubHkgYXBwbGljYXRpb246IElTZXJ2ZXJBcHBsaWNhdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IHJvbGU/OiBpYW0uUm9sZSA9IHVuZGVmaW5lZDtcbiAgcHVibGljIHJlYWRvbmx5IGF1dG9TY2FsaW5nR3JvdXBzPzogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cFtdID0gdW5kZWZpbmVkO1xuICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95bWVudENvbmZpZzogSVNlcnZlckRlcGxveW1lbnRDb25maWc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNlcnZlckRlcGxveW1lbnRHcm91cEF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIGFwcGxpY2F0aW9uOiBwcm9wcy5hcHBsaWNhdGlvbixcbiAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6IHByb3BzLmRlcGxveW1lbnRHcm91cE5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFwcGxpY2F0aW9uID0gcHJvcHMuYXBwbGljYXRpb247XG4gICAgdGhpcy5kZXBsb3ltZW50Q29uZmlnID0gdGhpcy5fYmluZERlcGxveW1lbnRDb25maWcocHJvcHMuZGVwbG95bWVudENvbmZpZyB8fCBTZXJ2ZXJEZXBsb3ltZW50Q29uZmlnLk9ORV9BVF9BX1RJTUUpO1xuICB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGdyb3VwIG9mIGluc3RhbmNlIHRhZ3MuXG4gKiBBbiBpbnN0YW5jZSB3aWxsIG1hdGNoIGEgZ3JvdXAgaWYgaXQgaGFzIGEgdGFnIG1hdGNoaW5nXG4gKiBhbnkgb2YgdGhlIGdyb3VwJ3MgdGFncyBieSBrZXkgYW5kIGFueSBvZiB0aGUgcHJvdmlkZWQgdmFsdWVzIC1cbiAqIGluIG90aGVyIHdvcmRzLCB0YWcgZ3JvdXBzIGZvbGxvdyAnb3InIHNlbWFudGljcy5cbiAqIElmIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBrZXkgaXMgYW4gZW1wdHkgYXJyYXksXG4gKiBhbiBpbnN0YW5jZSB3aWxsIG1hdGNoIHdoZW4gaXQgaGFzIGEgdGFnIHdpdGggdGhlIGdpdmVuIGtleSxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlIHZhbHVlLlxuICogSWYgdGhlIGtleSBpcyBhbiBlbXB0eSBzdHJpbmcsIGFueSB0YWcsXG4gKiByZWdhcmRsZXNzIG9mIGl0cyBrZXksIHdpdGggYW55IG9mIHRoZSBnaXZlbiB2YWx1ZXMsIHdpbGwgbWF0Y2guXG4gKi9cbmV4cG9ydCB0eXBlIEluc3RhbmNlVGFnR3JvdXAgPSB7W2tleTogc3RyaW5nXTogc3RyaW5nW119O1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBzZXQgb2YgaW5zdGFuY2UgdGFnIGdyb3Vwcy5cbiAqIEFuIGluc3RhbmNlIHdpbGwgbWF0Y2ggYSBzZXQgaWYgaXQgbWF0Y2hlcyBhbGwgb2YgdGhlIGdyb3VwcyBpbiB0aGUgc2V0IC1cbiAqIGluIG90aGVyIHdvcmRzLCBzZXRzIGZvbGxvdyAnYW5kJyBzZW1hbnRpY3MuXG4gKiBZb3UgY2FuIGhhdmUgYSBtYXhpbXVtIG9mIDMgdGFnIGdyb3VwcyBpbnNpZGUgYSBzZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnN0YW5jZVRhZ1NldCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2luc3RhbmNlVGFnR3JvdXBzOiBJbnN0YW5jZVRhZ0dyb3VwW107XG5cbiAgY29uc3RydWN0b3IoLi4uaW5zdGFuY2VUYWdHcm91cHM6IEluc3RhbmNlVGFnR3JvdXBbXSkge1xuICAgIGlmIChpbnN0YW5jZVRhZ0dyb3Vwcy5sZW5ndGggPiAzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIGluc3RhbmNlIHRhZyBzZXQgY2FuIGhhdmUgYSBtYXhpbXVtIG9mIDMgaW5zdGFuY2UgdGFnIGdyb3VwcywgJyArXG4gICAgICAgIGBidXQgJHtpbnN0YW5jZVRhZ0dyb3Vwcy5sZW5ndGh9IHdlcmUgcHJvdmlkZWRgKTtcbiAgICB9XG4gICAgdGhpcy5faW5zdGFuY2VUYWdHcm91cHMgPSBpbnN0YW5jZVRhZ0dyb3VwcztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaW5zdGFuY2VUYWdHcm91cHMoKTogSW5zdGFuY2VUYWdHcm91cFtdIHtcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2VUYWdHcm91cHMuc2xpY2UoKTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBgU2VydmVyRGVwbG95bWVudEdyb3VwYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXJ2ZXJEZXBsb3ltZW50R3JvdXBQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgQ29kZURlcGxveSBFQzIvb24tcHJlbWlzZSBBcHBsaWNhdGlvbiB0aGlzIERlcGxveW1lbnQgR3JvdXAgYmVsb25ncyB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyBBcHBsaWNhdGlvbiB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSBhcHBsaWNhdGlvbj86IElTZXJ2ZXJBcHBsaWNhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHNlcnZpY2UgUm9sZSBvZiB0aGlzIERlcGxveW1lbnQgR3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuZXcgUm9sZSB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwsIGh1bWFuLXJlYWRhYmxlIG5hbWUgb2YgdGhlIENvZGVEZXBsb3kgRGVwbG95bWVudCBHcm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBbiBhdXRvLWdlbmVyYXRlZCBuYW1lIHdpbGwgYmUgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveW1lbnRHcm91cE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBFQzIvb24tcHJlbWlzZSBEZXBsb3ltZW50IENvbmZpZ3VyYXRpb24gdG8gdXNlIGZvciB0aGlzIERlcGxveW1lbnQgR3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IFNlcnZlckRlcGxveW1lbnRDb25maWcjT25lQXRBVGltZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudENvbmZpZz86IElTZXJ2ZXJEZXBsb3ltZW50Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBUaGUgYXV0by1zY2FsaW5nIGdyb3VwcyBiZWxvbmdpbmcgdG8gdGhpcyBEZXBsb3ltZW50IEdyb3VwLlxuICAgKlxuICAgKiBBdXRvLXNjYWxpbmcgZ3JvdXBzIGNhbiBhbHNvIGJlIGFkZGVkIGFmdGVyIHRoZSBEZXBsb3ltZW50IEdyb3VwIGlzIGNyZWF0ZWRcbiAgICogdXNpbmcgdGhlIGAjYWRkQXV0b1NjYWxpbmdHcm91cGAgbWV0aG9kLlxuICAgKlxuICAgKiBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXSBpcyBuZWVkZWQgYmVjYXVzZSB3ZSB1cGRhdGUgdXNlcmRhdGFcbiAgICogZm9yIEFTR3MgdG8gaW5zdGFsbCB0aGUgY29kZWRlcGxveSBhZ2VudC5cbiAgICpcbiAgICogQGRlZmF1bHQgW11cbiAgICovXG4gIHJlYWRvbmx5IGF1dG9TY2FsaW5nR3JvdXBzPzogYXV0b3NjYWxpbmcuSUF1dG9TY2FsaW5nR3JvdXBbXTtcblxuICAvKipcbiAgICogSWYgeW91J3ZlIHByb3ZpZGVkIGFueSBhdXRvLXNjYWxpbmcgZ3JvdXBzIHdpdGggdGhlIGAjYXV0b1NjYWxpbmdHcm91cHNgIHByb3BlcnR5LFxuICAgKiB5b3UgY2FuIHNldCB0aGlzIHByb3BlcnR5IHRvIGFkZCBVc2VyIERhdGEgdGhhdCBpbnN0YWxscyB0aGUgQ29kZURlcGxveSBhZ2VudCBvbiB0aGUgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVkZXBsb3kvbGF0ZXN0L3VzZXJndWlkZS9jb2RlZGVwbG95LWFnZW50LW9wZXJhdGlvbnMtaW5zdGFsbC5odG1sXG4gICAqL1xuICByZWFkb25seSBpbnN0YWxsQWdlbnQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbG9hZCBiYWxhbmNlciB0byBwbGFjZSBpbiBmcm9udCBvZiB0aGlzIERlcGxveW1lbnQgR3JvdXAuXG4gICAqIENhbiBiZSBjcmVhdGVkIGZyb20gZWl0aGVyIGEgY2xhc3NpYyBFbGFzdGljIExvYWQgQmFsYW5jZXIsXG4gICAqIG9yIGFuIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXIgLyBOZXR3b3JrIExvYWQgQmFsYW5jZXIgVGFyZ2V0IEdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlcGxveW1lbnQgR3JvdXAgd2lsbCBub3QgaGF2ZSBhIGxvYWQgYmFsYW5jZXIgZGVmaW5lZC5cbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlcj86IExvYWRCYWxhbmNlcjtcblxuICAvKipcbiAgICogQWxsIEVDMiBpbnN0YW5jZXMgbWF0Y2hpbmcgdGhlIGdpdmVuIHNldCBvZiB0YWdzIHdoZW4gYSBkZXBsb3ltZW50IG9jY3VycyB3aWxsIGJlIGFkZGVkIHRvIHRoaXMgRGVwbG95bWVudCBHcm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIEVDMiBpbnN0YW5jZXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgRGVwbG95bWVudCBHcm91cC5cbiAgICovXG4gIHJlYWRvbmx5IGVjMkluc3RhbmNlVGFncz86IEluc3RhbmNlVGFnU2V0O1xuXG4gIC8qKlxuICAgKiBBbGwgb24tcHJlbWlzZSBpbnN0YW5jZXMgbWF0Y2hpbmcgdGhlIGdpdmVuIHNldCBvZiB0YWdzIHdoZW4gYSBkZXBsb3ltZW50IG9jY3VycyB3aWxsIGJlIGFkZGVkIHRvIHRoaXMgRGVwbG95bWVudCBHcm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIG9uLXByZW1pc2UgaW5zdGFuY2VzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIERlcGxveW1lbnQgR3JvdXAuXG4gICAqL1xuICByZWFkb25seSBvblByZW1pc2VJbnN0YW5jZVRhZ3M/OiBJbnN0YW5jZVRhZ1NldDtcblxuICAvKipcbiAgICogVGhlIENsb3VkV2F0Y2ggYWxhcm1zIGFzc29jaWF0ZWQgd2l0aCB0aGlzIERlcGxveW1lbnQgR3JvdXAuXG4gICAqIENvZGVEZXBsb3kgd2lsbCBzdG9wIChhbmQgb3B0aW9uYWxseSByb2xsIGJhY2spXG4gICAqIGEgZGVwbG95bWVudCBpZiBkdXJpbmcgaXQgYW55IG9mIHRoZSBhbGFybXMgdHJpZ2dlci5cbiAgICpcbiAgICogQWxhcm1zIGNhbiBhbHNvIGJlIGFkZGVkIGFmdGVyIHRoZSBEZXBsb3ltZW50IEdyb3VwIGlzIGNyZWF0ZWQgdXNpbmcgdGhlIGAjYWRkQWxhcm1gIG1ldGhvZC5cbiAgICpcbiAgICogQGRlZmF1bHQgW11cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWRlcGxveS9sYXRlc3QvdXNlcmd1aWRlL21vbml0b3JpbmctY3JlYXRlLWFsYXJtcy5odG1sXG4gICAqL1xuICByZWFkb25seSBhbGFybXM/OiBjbG91ZHdhdGNoLklBbGFybVtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNvbnRpbnVlIGEgZGVwbG95bWVudCBldmVuIGlmIGZldGNoaW5nIHRoZSBhbGFybSBzdGF0dXMgZnJvbSBDbG91ZFdhdGNoIGZhaWxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGlnbm9yZVBvbGxBbGFybXNGYWlsdXJlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGF1dG8tcm9sbGJhY2sgY29uZmlndXJhdGlvbiBmb3IgdGhpcyBEZXBsb3ltZW50IEdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHQgQXV0b1JvbGxiYWNrQ29uZmlnLlxuICAgKi9cbiAgcmVhZG9ubHkgYXV0b1JvbGxiYWNrPzogQXV0b1JvbGxiYWNrQ29uZmlnO1xufVxuXG4vKipcbiAqIEEgQ29kZURlcGxveSBEZXBsb3ltZW50IEdyb3VwIHRoYXQgZGVwbG95cyB0byBFQzIvb24tcHJlbWlzZSBpbnN0YW5jZXMuXG4gKiBAcmVzb3VyY2UgQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXBcbiAqL1xuZXhwb3J0IGNsYXNzIFNlcnZlckRlcGxveW1lbnRHcm91cCBleHRlbmRzIERlcGxveW1lbnRHcm91cEJhc2UgaW1wbGVtZW50cyBJU2VydmVyRGVwbG95bWVudEdyb3VwIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBFQzIvb24tcHJlbWlzZSBEZXBsb3ltZW50IEdyb3VwIGRlZmluZWQgZWl0aGVyIG91dHNpZGUgdGhlIENESyBhcHAsXG4gICAqIG9yIGluIGEgZGlmZmVyZW50IHJlZ2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIHRoZSBwYXJlbnQgQ29uc3RydWN0IGZvciB0aGlzIG5ldyBDb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIHRoZSBsb2dpY2FsIElEIG9mIHRoaXMgbmV3IENvbnN0cnVjdFxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIHByb3BlcnRpZXMgb2YgdGhlIHJlZmVyZW5jZWQgRGVwbG95bWVudCBHcm91cFxuICAgKiBAcmV0dXJucyBhIENvbnN0cnVjdCByZXByZXNlbnRpbmcgYSByZWZlcmVuY2UgdG8gYW4gZXhpc3RpbmcgRGVwbG95bWVudCBHcm91cFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU2VydmVyRGVwbG95bWVudEdyb3VwQXR0cmlidXRlcyhcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgYXR0cnM6IFNlcnZlckRlcGxveW1lbnRHcm91cEF0dHJpYnV0ZXMpOiBJU2VydmVyRGVwbG95bWVudEdyb3VwIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkU2VydmVyRGVwbG95bWVudEdyb3VwKHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uOiBJU2VydmVyQXBwbGljYXRpb247XG4gIHB1YmxpYyByZWFkb25seSBkZXBsb3ltZW50Q29uZmlnOiBJU2VydmVyRGVwbG95bWVudENvbmZpZztcbiAgLyoqXG4gICAqIFRoZSBzZXJ2aWNlIFJvbGUgb2YgdGhpcyBEZXBsb3ltZW50IEdyb3VwLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfYXV0b1NjYWxpbmdHcm91cHM6IGF1dG9zY2FsaW5nLklBdXRvU2NhbGluZ0dyb3VwW107XG4gIHByaXZhdGUgcmVhZG9ubHkgaW5zdGFsbEFnZW50OiBib29sZWFuO1xuICBwcml2YXRlIHJlYWRvbmx5IGNvZGVEZXBsb3lCdWNrZXQ6IHMzLklCdWNrZXQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgYWxhcm1zOiBjbG91ZHdhdGNoLklBbGFybVtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTZXJ2ZXJEZXBsb3ltZW50R3JvdXBQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBkZXBsb3ltZW50R3JvdXBOYW1lOiBwcm9wcy5kZXBsb3ltZW50R3JvdXBOYW1lLFxuICAgICAgcm9sZTogcHJvcHMucm9sZSxcbiAgICAgIHJvbGVDb25zdHJ1Y3RJZDogJ1JvbGUnLFxuICAgIH0pO1xuICAgIHRoaXMucm9sZSA9IHRoaXMuX3JvbGU7XG5cbiAgICB0aGlzLmFwcGxpY2F0aW9uID0gcHJvcHMuYXBwbGljYXRpb24gfHwgbmV3IFNlcnZlckFwcGxpY2F0aW9uKHRoaXMsICdBcHBsaWNhdGlvbicsIHtcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogcHJvcHMuZGVwbG95bWVudEdyb3VwTmFtZSA9PT0gY2RrLlBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQgPyBjZGsuUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgICB0aGlzLmRlcGxveW1lbnRDb25maWcgPSB0aGlzLl9iaW5kRGVwbG95bWVudENvbmZpZyhwcm9wcy5kZXBsb3ltZW50Q29uZmlnIHx8IFNlcnZlckRlcGxveW1lbnRDb25maWcuT05FX0FUX0FfVElNRSk7XG5cbiAgICB0aGlzLnJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BV1NDb2RlRGVwbG95Um9sZScpKTtcbiAgICB0aGlzLl9hdXRvU2NhbGluZ0dyb3VwcyA9IHByb3BzLmF1dG9TY2FsaW5nR3JvdXBzIHx8IFtdO1xuICAgIHRoaXMuaW5zdGFsbEFnZW50ID0gcHJvcHMuaW5zdGFsbEFnZW50ID8/IHRydWU7XG4gICAgdGhpcy5jb2RlRGVwbG95QnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHRoaXMsICdCdWNrZXQnLCBgYXdzLWNvZGVkZXBsb3ktJHtjZGsuU3RhY2sub2YodGhpcykucmVnaW9ufWApO1xuICAgIGZvciAoY29uc3QgYXNnIG9mIHRoaXMuX2F1dG9TY2FsaW5nR3JvdXBzKSB7XG4gICAgICB0aGlzLmFkZENvZGVEZXBsb3lBZ2VudEluc3RhbGxVc2VyRGF0YShhc2cpO1xuICAgIH1cblxuICAgIHRoaXMuYWxhcm1zID0gcHJvcHMuYWxhcm1zIHx8IFtdO1xuXG4gICAgY29uc3QgcmVtb3ZlQWxhcm1zRnJvbURlcGxveW1lbnRHcm91cCA9IGNkay5GZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKENPREVERVBMT1lfUkVNT1ZFX0FMQVJNU19GUk9NX0RFUExPWU1FTlRfR1JPVVApO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuRGVwbG95bWVudEdyb3VwKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogdGhpcy5hcHBsaWNhdGlvbi5hcHBsaWNhdGlvbk5hbWUsXG4gICAgICBkZXBsb3ltZW50R3JvdXBOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHNlcnZpY2VSb2xlQXJuOiB0aGlzLnJvbGUucm9sZUFybixcbiAgICAgIGRlcGxveW1lbnRDb25maWdOYW1lOiBwcm9wcy5kZXBsb3ltZW50Q29uZmlnICYmXG4gICAgICAgIHByb3BzLmRlcGxveW1lbnRDb25maWcuZGVwbG95bWVudENvbmZpZ05hbWUsXG4gICAgICBhdXRvU2NhbGluZ0dyb3VwczogY2RrLkxhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMuX2F1dG9TY2FsaW5nR3JvdXBzLm1hcChhc2cgPT4gYXNnLmF1dG9TY2FsaW5nR3JvdXBOYW1lKSB9LCB7IG9taXRFbXB0eTogdHJ1ZSB9KSxcbiAgICAgIGxvYWRCYWxhbmNlckluZm86IHRoaXMubG9hZEJhbGFuY2VySW5mbyhwcm9wcy5sb2FkQmFsYW5jZXIpLFxuICAgICAgZGVwbG95bWVudFN0eWxlOiBwcm9wcy5sb2FkQmFsYW5jZXIgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICA6IHtcbiAgICAgICAgICBkZXBsb3ltZW50T3B0aW9uOiAnV0lUSF9UUkFGRklDX0NPTlRST0wnLFxuICAgICAgICB9LFxuICAgICAgZWMyVGFnU2V0OiB0aGlzLmVjMlRhZ1NldChwcm9wcy5lYzJJbnN0YW5jZVRhZ3MpLFxuICAgICAgb25QcmVtaXNlc1RhZ1NldDogdGhpcy5vblByZW1pc2VUYWdTZXQocHJvcHMub25QcmVtaXNlSW5zdGFuY2VUYWdzKSxcbiAgICAgIGFsYXJtQ29uZmlndXJhdGlvbjogY2RrLkxhenkuYW55KHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4gcmVuZGVyQWxhcm1Db25maWd1cmF0aW9uKHRoaXMuYWxhcm1zLCBwcm9wcy5pZ25vcmVQb2xsQWxhcm1zRmFpbHVyZSwgcmVtb3ZlQWxhcm1zRnJvbURlcGxveW1lbnRHcm91cCksXG4gICAgICB9KSxcbiAgICAgIGF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb246IGNkay5MYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHJlbmRlckF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb24odGhpcy5hbGFybXMsIHByb3BzLmF1dG9Sb2xsYmFjaykgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZXROYW1lQW5kQXJuKHJlc291cmNlLCB0aGlzLmFwcGxpY2F0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGFkZGl0aW9uYWwgYXV0by1zY2FsaW5nIGdyb3VwIHRvIHRoaXMgRGVwbG95bWVudCBHcm91cC5cbiAgICpcbiAgICogQHBhcmFtIGFzZyB0aGUgYXV0by1zY2FsaW5nIGdyb3VwIHRvIGFkZCB0byB0aGlzIERlcGxveW1lbnQgR3JvdXAuXG4gICAqIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdIGlzIG5lZWRlZCBpbiBvcmRlciB0byBpbnN0YWxsIHRoZSBjb2RlXG4gICAqIGRlcGxveSBhZ2VudCBieSB1cGRhdGluZyB0aGUgQVNHcyB1c2VyIGRhdGEuXG4gICAqL1xuICBwdWJsaWMgYWRkQXV0b1NjYWxpbmdHcm91cChhc2c6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXApOiB2b2lkIHtcbiAgICB0aGlzLl9hdXRvU2NhbGluZ0dyb3Vwcy5wdXNoKGFzZyk7XG4gICAgdGhpcy5hZGRDb2RlRGVwbG95QWdlbnRJbnN0YWxsVXNlckRhdGEoYXNnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NvY2lhdGVzIGFuIGFkZGl0aW9uYWwgYWxhcm0gd2l0aCB0aGlzIERlcGxveW1lbnQgR3JvdXAuXG4gICAqXG4gICAqIEBwYXJhbSBhbGFybSB0aGUgYWxhcm0gdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBEZXBsb3ltZW50IEdyb3VwXG4gICAqL1xuICBwdWJsaWMgYWRkQWxhcm0oYWxhcm06IGNsb3Vkd2F0Y2guSUFsYXJtKTogdm9pZCB7XG4gICAgdGhpcy5hbGFybXMucHVzaChhbGFybSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGF1dG9TY2FsaW5nR3JvdXBzKCk6IGF1dG9zY2FsaW5nLklBdXRvU2NhbGluZ0dyb3VwW10gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9hdXRvU2NhbGluZ0dyb3Vwcy5zbGljZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRDb2RlRGVwbG95QWdlbnRJbnN0YWxsVXNlckRhdGEoYXNnOiBhdXRvc2NhbGluZy5JQXV0b1NjYWxpbmdHcm91cCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pbnN0YWxsQWdlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvZGVEZXBsb3lCdWNrZXQuZ3JhbnRSZWFkKGFzZywgJ2xhdGVzdC8qJyk7XG5cbiAgICBzd2l0Y2ggKGFzZy5vc1R5cGUpIHtcbiAgICAgIGNhc2UgZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVg6XG4gICAgICAgIGFzZy5hZGRVc2VyRGF0YShcbiAgICAgICAgICAnc2V0ICtlJywgLy8gbWFrZSBzdXJlIHdlIGRvbid0IGV4aXQgb24gdGhlIGB3aGljaGAgZmFpbGluZ1xuICAgICAgICAgICdQS0dfQ01EPWB3aGljaCB5dW0gMj4vZGV2L251bGxgJyxcbiAgICAgICAgICAnc2V0IC1lJywgLy8gY29udGludWUgd2l0aCBmYWlsaW5nIG9uIGVycm9yXG4gICAgICAgICAgJ2lmIFsgLXogXCIkUEtHX0NNRFwiIF07IHRoZW4nLFxuICAgICAgICAgICdQS0dfQ01EPWFwdC1nZXQnLFxuICAgICAgICAgICdlbHNlJyxcbiAgICAgICAgICAnUEtHX0NNRD15dW0nLFxuICAgICAgICAgICdmaScsXG4gICAgICAgICAgJyRQS0dfQ01EIHVwZGF0ZSAteScsXG4gICAgICAgICAgJ3NldCArZScsIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBleGl0IG9uIHRoZSBuZXh0IGNvbW1hbmQgZmFpbGluZyAod2UgY2hlY2sgaXRzIGV4aXQgY29kZSBiZWxvdylcbiAgICAgICAgICAnJFBLR19DTUQgaW5zdGFsbCAteSBydWJ5Mi4wJyxcbiAgICAgICAgICAnUlVCWTJfSU5TVEFMTD0kPycsXG4gICAgICAgICAgJ3NldCAtZScsIC8vIGNvbnRpbnVlIHdpdGggZmFpbGluZyBvbiBlcnJvclxuICAgICAgICAgICdpZiBbICRSVUJZMl9JTlNUQUxMIC1uZSAwIF07IHRoZW4nLFxuICAgICAgICAgICckUEtHX0NNRCBpbnN0YWxsIC15IHJ1YnknLFxuICAgICAgICAgICdmaScsXG4gICAgICAgICAgJ0FXU19DTElfUEFDS0FHRV9OQU1FPWF3c2NsaScsXG4gICAgICAgICAgJ2lmIFsgXCIkUEtHX0NNRFwiID0gXCJ5dW1cIiBdOyB0aGVuJyxcbiAgICAgICAgICAnQVdTX0NMSV9QQUNLQUdFX05BTUU9YXdzLWNsaScsXG4gICAgICAgICAgJ2ZpJyxcbiAgICAgICAgICAnJFBLR19DTUQgaW5zdGFsbCAteSAkQVdTX0NMSV9QQUNLQUdFX05BTUUnLFxuICAgICAgICAgICdUTVBfRElSPWBta3RlbXAgLWRgJyxcbiAgICAgICAgICAnY2QgJFRNUF9ESVInLFxuICAgICAgICAgIGBhd3MgczMgY3AgczM6Ly9hd3MtY29kZWRlcGxveS0ke2Nkay5TdGFjay5vZih0aGlzKS5yZWdpb259L2xhdGVzdC9pbnN0YWxsIC4gLS1yZWdpb24gJHtjZGsuU3RhY2sub2YodGhpcykucmVnaW9ufWAsXG4gICAgICAgICAgJ2NobW9kICt4IC4vaW5zdGFsbCcsXG4gICAgICAgICAgJy4vaW5zdGFsbCBhdXRvJyxcbiAgICAgICAgICAncm0gLWZyICRUTVBfRElSJyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1M6XG4gICAgICAgIGFzZy5hZGRVc2VyRGF0YShcbiAgICAgICAgICAnU2V0LVZhcmlhYmxlIC1OYW1lIFRFTVBESVIgLVZhbHVlIChOZXctVGVtcG9yYXJ5RmlsZSkuRGlyZWN0b3J5TmFtZScsXG4gICAgICAgICAgYGF3cyBzMyBjcCBzMzovL2F3cy1jb2RlZGVwbG95LSR7Y2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbn0vbGF0ZXN0L2NvZGVkZXBsb3ktYWdlbnQubXNpICRURU1QRElSXFxcXGNvZGVkZXBsb3ktYWdlbnQubXNpYCxcbiAgICAgICAgICAnY2QgJFRFTVBESVInLFxuICAgICAgICAgICcuXFxcXGNvZGVkZXBsb3ktYWdlbnQubXNpIC9xdWlldCAvbCBjOlxcXFx0ZW1wXFxcXGhvc3QtYWdlbnQtaW5zdGFsbC1sb2cudHh0JyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkQmFsYW5jZXJJbmZvKGxvYWRCYWxhbmNlcj86IExvYWRCYWxhbmNlcik6XG4gIENmbkRlcGxveW1lbnRHcm91cC5Mb2FkQmFsYW5jZXJJbmZvUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghbG9hZEJhbGFuY2VyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN3aXRjaCAobG9hZEJhbGFuY2VyLmdlbmVyYXRpb24pIHtcbiAgICAgIGNhc2UgTG9hZEJhbGFuY2VyR2VuZXJhdGlvbi5GSVJTVDpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlbGJJbmZvTGlzdDogW1xuICAgICAgICAgICAgeyBuYW1lOiBsb2FkQmFsYW5jZXIubmFtZSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH07XG4gICAgICBjYXNlIExvYWRCYWxhbmNlckdlbmVyYXRpb24uU0VDT05EOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRhcmdldEdyb3VwSW5mb0xpc3Q6IFtcbiAgICAgICAgICAgIHsgbmFtZTogbG9hZEJhbGFuY2VyLm5hbWUgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZWMyVGFnU2V0KHRhZ1NldD86IEluc3RhbmNlVGFnU2V0KTpcbiAgQ2ZuRGVwbG95bWVudEdyb3VwLkVDMlRhZ1NldFByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRhZ1NldCB8fCB0YWdTZXQuaW5zdGFuY2VUYWdHcm91cHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlYzJUYWdTZXRMaXN0OiB0YWdTZXQuaW5zdGFuY2VUYWdHcm91cHMubWFwKHRhZ0dyb3VwID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlYzJUYWdHcm91cDogdGhpcy50YWdHcm91cDJUYWdzQXJyYXkodGFnR3JvdXApIGFzXG4gICAgICAgICAgICBDZm5EZXBsb3ltZW50R3JvdXAuRUMyVGFnRmlsdGVyUHJvcGVydHlbXSxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIG9uUHJlbWlzZVRhZ1NldCh0YWdTZXQ/OiBJbnN0YW5jZVRhZ1NldCk6XG4gIENmbkRlcGxveW1lbnRHcm91cC5PblByZW1pc2VzVGFnU2V0UHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGFnU2V0IHx8IHRhZ1NldC5pbnN0YW5jZVRhZ0dyb3Vwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9uUHJlbWlzZXNUYWdTZXRMaXN0OiB0YWdTZXQuaW5zdGFuY2VUYWdHcm91cHMubWFwKHRhZ0dyb3VwID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvblByZW1pc2VzVGFnR3JvdXA6IHRoaXMudGFnR3JvdXAyVGFnc0FycmF5KHRhZ0dyb3VwKSxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHRhZ0dyb3VwMlRhZ3NBcnJheSh0YWdHcm91cDogSW5zdGFuY2VUYWdHcm91cCk6IENmbkRlcGxveW1lbnRHcm91cC5UYWdGaWx0ZXJQcm9wZXJ0eVtdIHtcbiAgICBjb25zdCB0YWdzSW5Hcm91cCA9IG5ldyBBcnJheTxDZm5EZXBsb3ltZW50R3JvdXAuVGFnRmlsdGVyUHJvcGVydHk+KCk7XG4gICAgZm9yIChjb25zdCB0YWdLZXkgaW4gdGFnR3JvdXApIHtcbiAgICAgIGlmICh0YWdHcm91cC5oYXNPd25Qcm9wZXJ0eSh0YWdLZXkpKSB7XG4gICAgICAgIGNvbnN0IHRhZ1ZhbHVlcyA9IHRhZ0dyb3VwW3RhZ0tleV07XG4gICAgICAgIGlmICh0YWdLZXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmICh0YWdWYWx1ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0YWdWYWx1ZSBvZiB0YWdWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgdGFnc0luR3JvdXAucHVzaCh7XG4gICAgICAgICAgICAgICAga2V5OiB0YWdLZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRhZ1ZhbHVlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdLRVlfQU5EX1ZBTFVFJyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZ3NJbkdyb3VwLnB1c2goe1xuICAgICAgICAgICAgICBrZXk6IHRhZ0tleSxcbiAgICAgICAgICAgICAgdHlwZTogJ0tFWV9PTkxZJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGFnVmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFnVmFsdWUgb2YgdGFnVmFsdWVzKSB7XG4gICAgICAgICAgICAgIHRhZ3NJbkdyb3VwLnB1c2goe1xuICAgICAgICAgICAgICAgIHZhbHVlOiB0YWdWYWx1ZSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnVkFMVUVfT05MWScsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzcGVjaWZ5IGJvdGggYW4gZW1wdHkga2V5IGFuZCBubyB2YWx1ZXMgZm9yIGFuIGluc3RhbmNlIHRhZyBmaWx0ZXInKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhZ3NJbkdyb3VwO1xuICB9XG59XG4iXX0=