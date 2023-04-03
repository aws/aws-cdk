"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const helpers_internal_1 = require("@aws-cdk/core/lib/helpers-internal");
const aspects_1 = require("./aspects");
const connections_1 = require("./connections");
const ec2_generated_1 = require("./ec2.generated");
const ebs_util_1 = require("./private/ebs-util");
const security_group_1 = require("./security-group");
const vpc_1 = require("./vpc");
/**
 * Name tag constant
 */
const NAME_TAG = 'Name';
/**
 * This represents a single EC2 instance
 */
class Instance extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.securityGroups = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InstanceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Instance);
            }
            throw error;
        }
        if (props.initOptions && !props.init) {
            throw new Error('Setting \'initOptions\' requires that \'init\' is also set');
        }
        if (props.securityGroup) {
            this.securityGroup = props.securityGroup;
        }
        else {
            this.securityGroup = new security_group_1.SecurityGroup(this, 'InstanceSecurityGroup', {
                vpc: props.vpc,
                allowAllOutbound: props.allowAllOutbound !== false,
            });
        }
        this.connections = new connections_1.Connections({ securityGroups: [this.securityGroup] });
        this.securityGroups.push(this.securityGroup);
        core_1.Tags.of(this).add(NAME_TAG, props.instanceName || this.node.path);
        this.role = props.role || new iam.Role(this, 'InstanceRole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        });
        this.grantPrincipal = this.role;
        if (props.ssmSessionPermissions) {
            this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
        }
        const iamProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
            roles: [this.role.roleName],
        });
        // use delayed evaluation
        const imageConfig = props.machineImage.getImage(this);
        this.userData = props.userData ?? imageConfig.userData;
        const userDataToken = core_1.Lazy.string({ produce: () => core_1.Fn.base64(this.userData.render()) });
        const securityGroupsToken = core_1.Lazy.list({ produce: () => this.securityGroups.map(sg => sg.securityGroupId) });
        const { subnets } = props.vpc.selectSubnets(props.vpcSubnets);
        let subnet;
        if (props.availabilityZone) {
            const selected = subnets.filter(sn => sn.availabilityZone === props.availabilityZone);
            if (selected.length === 1) {
                subnet = selected[0];
            }
            else {
                core_1.Annotations.of(this).addError(`Need exactly 1 subnet to match AZ '${props.availabilityZone}', found ${selected.length}. Use a different availabilityZone.`);
            }
        }
        else {
            if (subnets.length > 0) {
                subnet = subnets[0];
            }
            else {
                core_1.Annotations.of(this).addError(`Did not find any subnets matching '${JSON.stringify(props.vpcSubnets)}', please use a different selection.`);
            }
        }
        if (!subnet) {
            // We got here and we don't have a subnet because of validation errors.
            // Invent one on the spot so the code below doesn't fail.
            subnet = vpc_1.Subnet.fromSubnetAttributes(this, 'DummySubnet', {
                subnetId: 's-notfound',
                availabilityZone: 'az-notfound',
            });
        }
        this.instance = new ec2_generated_1.CfnInstance(this, 'Resource', {
            imageId: imageConfig.imageId,
            keyName: props.keyName,
            instanceType: props.instanceType.toString(),
            securityGroupIds: securityGroupsToken,
            iamInstanceProfile: iamProfile.ref,
            userData: userDataToken,
            subnetId: subnet.subnetId,
            availabilityZone: subnet.availabilityZone,
            sourceDestCheck: props.sourceDestCheck,
            blockDeviceMappings: props.blockDevices !== undefined ? (0, ebs_util_1.instanceBlockDeviceMappings)(this, props.blockDevices) : undefined,
            privateIpAddress: props.privateIpAddress,
            propagateTagsToVolumeOnCreation: props.propagateTagsToVolumeOnCreation,
            monitoring: props.detailedMonitoring,
        });
        this.instance.node.addDependency(this.role);
        this.osType = imageConfig.osType;
        this.node.defaultChild = this.instance;
        this.instanceId = this.instance.ref;
        this.instanceAvailabilityZone = this.instance.attrAvailabilityZone;
        this.instancePrivateDnsName = this.instance.attrPrivateDnsName;
        this.instancePrivateIp = this.instance.attrPrivateIp;
        this.instancePublicDnsName = this.instance.attrPublicDnsName;
        this.instancePublicIp = this.instance.attrPublicIp;
        if (props.init) {
            this.applyCloudFormationInit(props.init, props.initOptions);
        }
        this.applyUpdatePolicies(props);
        // Trigger replacement (via new logical ID) on user data change, if specified or cfn-init is being used.
        //
        // This is slightly tricky -- we need to resolve the UserData string (in order to get at actual Asset hashes,
        // instead of the Token stringifications of them ('${Token[1234]}'). However, in the case of CFN Init usage,
        // a UserData is going to contain the logicalID of the resource itself, which means infinite recursion if we
        // try to naively resolve. We need a recursion breaker in this.
        const originalLogicalId = core_1.Stack.of(this).getLogicalId(this.instance);
        let recursing = false;
        this.instance.overrideLogicalId(core_1.Lazy.uncachedString({
            produce: (context) => {
                if (recursing) {
                    return originalLogicalId;
                }
                if (!(props.userDataCausesReplacement ?? props.initOptions)) {
                    return originalLogicalId;
                }
                const fragments = new Array();
                recursing = true;
                try {
                    fragments.push(JSON.stringify(context.resolve(this.userData.render())));
                }
                finally {
                    recursing = false;
                }
                const digest = (0, helpers_internal_1.md5hash)(fragments.join('')).slice(0, 16);
                return `${originalLogicalId}${digest}`;
            },
        }));
        if (props.requireImdsv2) {
            core_1.Aspects.of(this).add(new aspects_1.InstanceRequireImdsv2Aspect());
        }
    }
    /**
     * Add the security group to the instance.
     *
     * @param securityGroup: The security group to add
     */
    addSecurityGroup(securityGroup) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ISecurityGroup(securityGroup);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addSecurityGroup);
            }
            throw error;
        }
        this.securityGroups.push(securityGroup);
    }
    /**
     * Add command to the startup script of the instance.
     * The command must be in the scripting language supported by the instance's OS (i.e. Linux/Windows).
     */
    addUserData(...commands) {
        this.userData.addCommands(...commands);
    }
    /**
     * Adds a statement to the IAM role assumed by the instance.
     */
    addToRolePolicy(statement) {
        this.role.addToPrincipalPolicy(statement);
    }
    /**
     * Use a CloudFormation Init configuration at instance startup
     *
     * This does the following:
     *
     * - Attaches the CloudFormation Init metadata to the Instance resource.
     * - Add commands to the instance UserData to run `cfn-init` and `cfn-signal`.
     * - Update the instance's CreationPolicy to wait for the `cfn-signal` commands.
     */
    applyCloudFormationInit(init, options = {}) {
        init.attach(this.instance, {
            platform: this.osType,
            instanceRole: this.role,
            userData: this.userData,
            configSets: options.configSets,
            embedFingerprint: options.embedFingerprint,
            printLog: options.printLog,
            ignoreFailures: options.ignoreFailures,
            includeRole: options.includeRole,
            includeUrl: options.includeUrl,
        });
        this.waitForResourceSignal(options.timeout ?? core_1.Duration.minutes(5));
    }
    /**
     * Wait for a single additional resource signal
     *
     * Add 1 to the current ResourceSignal Count and add the given timeout to the current timeout.
     *
     * Use this to pause the CloudFormation deployment to wait for the instances
     * in the AutoScalingGroup to report successful startup during
     * creation and updates. The UserData script needs to invoke `cfn-signal`
     * with a success or failure code after it is done setting up the instance.
     */
    waitForResourceSignal(timeout) {
        const oldResourceSignal = this.instance.cfnOptions.creationPolicy?.resourceSignal;
        this.instance.cfnOptions.creationPolicy = {
            ...this.instance.cfnOptions.creationPolicy,
            resourceSignal: {
                count: (oldResourceSignal?.count ?? 0) + 1,
                timeout: (oldResourceSignal?.timeout ? core_1.Duration.parse(oldResourceSignal?.timeout).plus(timeout) : timeout).toIsoString(),
            },
        };
    }
    /**
     * Apply CloudFormation update policies for the instance
     */
    applyUpdatePolicies(props) {
        if (props.resourceSignalTimeout !== undefined) {
            this.instance.cfnOptions.creationPolicy = {
                ...this.instance.cfnOptions.creationPolicy,
                resourceSignal: {
                    timeout: props.resourceSignalTimeout && props.resourceSignalTimeout.toIsoString(),
                },
            };
        }
    }
}
_a = JSII_RTTI_SYMBOL_1;
Instance[_a] = { fqn: "@aws-cdk/aws-ec2.Instance", version: "0.0.0" };
exports.Instance = Instance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFFeEMsd0NBQTJHO0FBQzNHLHlFQUE2RDtBQUU3RCx1Q0FBd0Q7QUFFeEQsK0NBQTBEO0FBQzFELG1EQUE4QztBQUc5QyxpREFBaUU7QUFDakUscURBQWlFO0FBR2pFLCtCQUFzRDtBQUV0RDs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQztBQStQaEM7O0dBRUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxlQUFRO0lBMkRwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIRixtQkFBYyxHQUFxQixFQUFFLENBQUM7Ozs7OzsrQ0F6RDVDLFFBQVE7Ozs7UUE4RGpCLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztTQUMxQzthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDhCQUFhLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO2dCQUNwRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7Z0JBQ2QsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixLQUFLLEtBQUs7YUFDbkQsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUkseUJBQVcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLGNBQWMs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Q0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUU7YUFDekg7U0FDRixDQUFDO0tBQ0g7SUFFRDs7T0FFRztJQUNLLG1CQUFtQixDQUFDLEtBQW9CO1FBQzlDLElBQUksS0FBSyxDQUFDLHFCQUFxQixLQUFLLFNBQVMsRUFBRTtZQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEdBQUc7Z0JBQ3hDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBYztnQkFDMUMsY0FBYyxFQUFFO29CQUNkLE9BQU8sRUFBRSxLQUFLLENBQUMscUJBQXFCLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRTtpQkFDbEY7YUFDRixDQUFDO1NBQ0g7S0FDRjs7OztBQTFRVSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcblxuaW1wb3J0IHsgQW5ub3RhdGlvbnMsIEFzcGVjdHMsIER1cmF0aW9uLCBGbiwgSVJlc291cmNlLCBMYXp5LCBSZXNvdXJjZSwgU3RhY2ssIFRhZ3MgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IG1kNWhhc2ggfSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSW5zdGFuY2VSZXF1aXJlSW1kc3YyQXNwZWN0IH0gZnJvbSAnLi9hc3BlY3RzJztcbmltcG9ydCB7IENsb3VkRm9ybWF0aW9uSW5pdCB9IGZyb20gJy4vY2ZuLWluaXQnO1xuaW1wb3J0IHsgQ29ubmVjdGlvbnMsIElDb25uZWN0YWJsZSB9IGZyb20gJy4vY29ubmVjdGlvbnMnO1xuaW1wb3J0IHsgQ2ZuSW5zdGFuY2UgfSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSW5zdGFuY2VUeXBlIH0gZnJvbSAnLi9pbnN0YW5jZS10eXBlcyc7XG5pbXBvcnQgeyBJTWFjaGluZUltYWdlLCBPcGVyYXRpbmdTeXN0ZW1UeXBlIH0gZnJvbSAnLi9tYWNoaW5lLWltYWdlJztcbmltcG9ydCB7IGluc3RhbmNlQmxvY2tEZXZpY2VNYXBwaW5ncyB9IGZyb20gJy4vcHJpdmF0ZS9lYnMtdXRpbCc7XG5pbXBvcnQgeyBJU2VjdXJpdHlHcm91cCwgU2VjdXJpdHlHcm91cCB9IGZyb20gJy4vc2VjdXJpdHktZ3JvdXAnO1xuaW1wb3J0IHsgVXNlckRhdGEgfSBmcm9tICcuL3VzZXItZGF0YSc7XG5pbXBvcnQgeyBCbG9ja0RldmljZSB9IGZyb20gJy4vdm9sdW1lJztcbmltcG9ydCB7IElWcGMsIFN1Ym5ldCwgU3VibmV0U2VsZWN0aW9uIH0gZnJvbSAnLi92cGMnO1xuXG4vKipcbiAqIE5hbWUgdGFnIGNvbnN0YW50XG4gKi9cbmNvbnN0IE5BTUVfVEFHOiBzdHJpbmcgPSAnTmFtZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUluc3RhbmNlIGV4dGVuZHMgSVJlc291cmNlLCBJQ29ubmVjdGFibGUsIGlhbS5JR3JhbnRhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSdzIElEXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGF2YWlsYWJpbGl0eSB6b25lIHRoZSBpbnN0YW5jZSB3YXMgbGF1bmNoZWQgaW5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VBdmFpbGFiaWxpdHlab25lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgRE5TIG5hbWUgZm9yIHRoaXMgaW5zdGFuY2VcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VQcml2YXRlRG5zTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcml2YXRlIElQIGZvciB0aGlzIGluc3RhbmNlXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlUHJpdmF0ZUlwOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFB1YmxpY2x5LXJvdXRhYmxlIEROUyBuYW1lIGZvciB0aGlzIGluc3RhbmNlLlxuICAgKlxuICAgKiAoTWF5IGJlIGFuIGVtcHR5IHN0cmluZyBpZiB0aGUgaW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBhIHB1YmxpYyBuYW1lKS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VQdWJsaWNEbnNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFB1YmxpY2x5LXJvdXRhYmxlIElQICBhZGRyZXNzIGZvciB0aGlzIGluc3RhbmNlLlxuICAgKlxuICAgKiAoTWF5IGJlIGFuIGVtcHR5IHN0cmluZyBpZiB0aGUgaW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBhIHB1YmxpYyBJUCkuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlUHVibGljSXA6IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG9mIGFuIEVDMiBJbnN0YW5jZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluc3RhbmNlUHJvcHMge1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIFNTSCBrZXlwYWlyIHRvIGdyYW50IGFjY2VzcyB0byBpbnN0YW5jZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIFNTSCBhY2Nlc3Mgd2lsbCBiZSBwb3NzaWJsZS5cbiAgICovXG4gIHJlYWRvbmx5IGtleU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRvIHBsYWNlIHRoZSBpbnN0YW5jZSB3aXRoaW4gdGhlIFZQQ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFByaXZhdGUgc3VibmV0cy5cbiAgICovXG4gIHJlYWRvbmx5IHZwY1N1Ym5ldHM/OiBTdWJuZXRTZWxlY3Rpb247XG5cbiAgLyoqXG4gICAqIEluIHdoaWNoIEFaIHRvIHBsYWNlIHRoZSBpbnN0YW5jZSB3aXRoaW4gdGhlIFZQQ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFJhbmRvbSB6b25lLlxuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZT86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgaW5zdGFuY2UgY291bGQgaW5pdGlhdGUgY29ubmVjdGlvbnMgdG8gYW55d2hlcmUgYnkgZGVmYXVsdC5cbiAgICogVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IHVzZWQgd2hlbiB5b3UgZG8gbm90IHByb3ZpZGUgYSBzZWN1cml0eSBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxPdXRib3VuZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBsZW5ndGggb2YgdGltZSB0byB3YWl0IGZvciB0aGUgcmVzb3VyY2VTaWduYWxDb3VudFxuICAgKlxuICAgKiBUaGUgbWF4aW11bSB2YWx1ZSBpcyA0MzIwMCAoMTIgaG91cnMpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZVNpZ25hbFRpbWVvdXQ/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVlBDIHRvIGxhdW5jaCB0aGUgaW5zdGFuY2UgaW4uXG4gICAqL1xuICByZWFkb25seSB2cGM6IElWcGM7XG5cbiAgLyoqXG4gICAqIFNlY3VyaXR5IEdyb3VwIHRvIGFzc2lnbiB0byB0aGlzIGluc3RhbmNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gY3JlYXRlIG5ldyBzZWN1cml0eSBncm91cFxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cD86IElTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGluc3RhbmNlIHRvIGxhdW5jaFxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGU7XG5cbiAgLyoqXG4gICAqIEFNSSB0byBsYXVuY2hcbiAgICovXG4gIHJlYWRvbmx5IG1hY2hpbmVJbWFnZTogSU1hY2hpbmVJbWFnZTtcblxuICAvKipcbiAgICogU3BlY2lmaWMgVXNlckRhdGEgdG8gdXNlXG4gICAqXG4gICAqIFRoZSBVc2VyRGF0YSBtYXkgc3RpbGwgYmUgbXV0YXRlZCBhZnRlciBjcmVhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIFVzZXJEYXRhIG9iamVjdCBhcHByb3ByaWF0ZSBmb3IgdGhlIE1hY2hpbmVJbWFnZSdzXG4gICAqIE9wZXJhdGluZyBTeXN0ZW0gaXMgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHVzZXJEYXRhPzogVXNlckRhdGE7XG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdG8gdGhlIFVzZXJEYXRhIGZvcmNlIHJlcGxhY2VtZW50XG4gICAqXG4gICAqIERlcGVuZGluZyB0aGUgRUMyIGluc3RhbmNlIHR5cGUsIGNoYW5naW5nIFVzZXJEYXRhIGVpdGhlclxuICAgKiByZXN0YXJ0cyB0aGUgaW5zdGFuY2Ugb3IgcmVwbGFjZXMgdGhlIGluc3RhbmNlLlxuICAgKlxuICAgKiAtIEluc3RhbmNlIHN0b3JlLWJhY2tlZCBpbnN0YW5jZXMgYXJlIHJlcGxhY2VkLlxuICAgKiAtIEVCUy1iYWNrZWQgaW5zdGFuY2VzIGFyZSByZXN0YXJ0ZWQuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIHJlc3RhcnRpbmcgZG9lcyBub3QgZXhlY3V0ZSB0aGUgbmV3IFVzZXJEYXRhIHNvIHlvdVxuICAgKiB3aWxsIG5lZWQgYSBkaWZmZXJlbnQgbWVjaGFuaXNtIHRvIGVuc3VyZSB0aGUgaW5zdGFuY2UgaXMgcmVzdGFydGVkLlxuICAgKlxuICAgKiBTZXR0aW5nIHRoaXMgdG8gYHRydWVgIHdpbGwgbWFrZSB0aGUgaW5zdGFuY2UncyBMb2dpY2FsIElEIGRlcGVuZCBvbiB0aGVcbiAgICogVXNlckRhdGEsIHdoaWNoIHdpbGwgY2F1c2UgQ2xvdWRGb3JtYXRpb24gdG8gcmVwbGFjZSBpdCBpZiB0aGUgVXNlckRhdGFcbiAgICogY2hhbmdlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0cnVlIGlmZiBgaW5pdE9wdGlvbnNgIGlzIHNwZWNpZmllZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgcmVhZG9ubHkgdXNlckRhdGFDYXVzZXNSZXBsYWNlbWVudD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFuIElBTSByb2xlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBpbnN0YW5jZSBwcm9maWxlIGFzc2lnbmVkIHRvIHRoaXMgQXV0byBTY2FsaW5nIEdyb3VwLlxuICAgKlxuICAgKiBUaGUgcm9sZSBtdXN0IGJlIGFzc3VtYWJsZSBieSB0aGUgc2VydmljZSBwcmluY2lwYWwgYGVjMi5hbWF6b25hd3MuY29tYDpcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnTXlSb2xlJywge1xuICAgKiAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcm9sZSB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY3JlYXRlZCwgaXQgY2FuIGJlIGFjY2Vzc2VkIHZpYSB0aGUgYHJvbGVgIHByb3BlcnR5XG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgaW5zdGFuY2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBDREsgZ2VuZXJhdGVkIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdG8gZW5hYmxlIGFuIGluc3RhbmNlIGxhdW5jaGVkIGluIGEgVlBDIHRvIHBlcmZvcm0gTkFULlxuICAgKiBUaGlzIGNvbnRyb2xzIHdoZXRoZXIgc291cmNlL2Rlc3RpbmF0aW9uIGNoZWNraW5nIGlzIGVuYWJsZWQgb24gdGhlIGluc3RhbmNlLlxuICAgKiBBIHZhbHVlIG9mIHRydWUgbWVhbnMgdGhhdCBjaGVja2luZyBpcyBlbmFibGVkLCBhbmQgZmFsc2UgbWVhbnMgdGhhdCBjaGVja2luZyBpcyBkaXNhYmxlZC5cbiAgICogVGhlIHZhbHVlIG11c3QgYmUgZmFsc2UgZm9yIHRoZSBpbnN0YW5jZSB0byBwZXJmb3JtIE5BVC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlRGVzdENoZWNrPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGhvdyBibG9jayBkZXZpY2VzIGFyZSBleHBvc2VkIHRvIHRoZSBpbnN0YW5jZS4gWW91IGNhbiBzcGVjaWZ5IHZpcnR1YWwgZGV2aWNlcyBhbmQgRUJTIHZvbHVtZXMuXG4gICAqXG4gICAqIEVhY2ggaW5zdGFuY2UgdGhhdCBpcyBsYXVuY2hlZCBoYXMgYW4gYXNzb2NpYXRlZCByb290IGRldmljZSB2b2x1bWUsXG4gICAqIGVpdGhlciBhbiBBbWF6b24gRUJTIHZvbHVtZSBvciBhbiBpbnN0YW5jZSBzdG9yZSB2b2x1bWUuXG4gICAqIFlvdSBjYW4gdXNlIGJsb2NrIGRldmljZSBtYXBwaW5ncyB0byBzcGVjaWZ5IGFkZGl0aW9uYWwgRUJTIHZvbHVtZXMgb3JcbiAgICogaW5zdGFuY2Ugc3RvcmUgdm9sdW1lcyB0byBhdHRhY2ggdG8gYW4gaW5zdGFuY2Ugd2hlbiBpdCBpcyBsYXVuY2hlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvYmxvY2stZGV2aWNlLW1hcHBpbmctY29uY2VwdHMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFVzZXMgdGhlIGJsb2NrIGRldmljZSBtYXBwaW5nIG9mIHRoZSBBTUlcbiAgICovXG4gIHJlYWRvbmx5IGJsb2NrRGV2aWNlcz86IEJsb2NrRGV2aWNlW107XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBwcml2YXRlIElQIGFkZHJlc3MgdG8gYXNzb2NpYXRlIHdpdGggYW4gaW5zdGFuY2UuXG4gICAqXG4gICAqIFByaXZhdGUgSVAgc2hvdWxkIGJlIGF2YWlsYWJsZSB3aXRoaW4gdGhlIFZQQyB0aGF0IHRoZSBpbnN0YW5jZSBpcyBidWlsZCB3aXRoaW4uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYXNzb2NpYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IHByaXZhdGVJcEFkZHJlc3M/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgRUMyIGluc3RhbmNlIHRhZ3MgdG8gdGhlIEVCUyB2b2x1bWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwcm9wYWdhdGVUYWdzVG9Wb2x1bWVPbkNyZWF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQXBwbHkgdGhlIGdpdmVuIENsb3VkRm9ybWF0aW9uIEluaXQgY29uZmlndXJhdGlvbiB0byB0aGUgaW5zdGFuY2UgYXQgc3RhcnR1cFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIENsb3VkRm9ybWF0aW9uIGluaXRcbiAgICovXG4gIHJlYWRvbmx5IGluaXQ/OiBDbG91ZEZvcm1hdGlvbkluaXQ7XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgZ2l2ZW4gb3B0aW9ucyBmb3IgYXBwbHlpbmcgQ2xvdWRGb3JtYXRpb24gSW5pdFxuICAgKlxuICAgKiBEZXNjcmliZXMgdGhlIGNvbmZpZ3NldHMgdG8gdXNlIGFuZCB0aGUgdGltZW91dCB0byB3YWl0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZGVmYXVsdCBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBpbml0T3B0aW9ucz86IEFwcGx5Q2xvdWRGb3JtYXRpb25Jbml0T3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciBJTURTdjIgc2hvdWxkIGJlIHJlcXVpcmVkIG9uIHRoaXMgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVpcmVJbWRzdjI/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIFwiRGV0YWlsZWQgTW9uaXRvcmluZ1wiIGlzIGVuYWJsZWQgZm9yIHRoaXMgaW5zdGFuY2VcbiAgICogS2VlcCBpbiBtaW5kIHRoYXQgRGV0YWlsZWQgTW9uaXRvcmluZyByZXN1bHRzIGluIGV4dHJhIGNoYXJnZXNcbiAgICpcbiAgICogQHNlZSBodHRwOi8vYXdzLmFtYXpvbi5jb20vY2xvdWR3YXRjaC9wcmljaW5nL1xuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBkZXRhaWxlZE1vbml0b3Jpbmc/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBZGQgU1NNIHNlc3Npb24gcGVybWlzc2lvbnMgdG8gdGhlIGluc3RhbmNlIHJvbGVcbiAgICpcbiAgICogU2V0dGluZyB0aGlzIHRvIGB0cnVlYCBhZGRzIHRoZSBuZWNlc3NhcnkgcGVybWlzc2lvbnMgdG8gY29ubmVjdFxuICAgKiB0byB0aGUgaW5zdGFuY2UgdXNpbmcgU1NNIFNlc3Npb24gTWFuYWdlci4gWW91IGNhbiBkbyB0aGlzXG4gICAqIGZyb20gdGhlIEFXUyBDb25zb2xlLlxuICAgKlxuICAgKiBOT1RFOiBTZXR0aW5nIHRoaXMgZmxhZyB0byBgdHJ1ZWAgbWF5IG5vdCBiZSBlbm91Z2ggYnkgaXRzZWxmLlxuICAgKiBZb3UgbXVzdCBhbHNvIHVzZSBhbiBBTUkgdGhhdCBjb21lcyB3aXRoIHRoZSBTU00gQWdlbnQsIG9yIGluc3RhbGxcbiAgICogdGhlIFNTTSBBZ2VudCB5b3Vyc2VsZi4gU2VlXG4gICAqIFtXb3JraW5nIHdpdGggU1NNIEFnZW50XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3lzdGVtcy1tYW5hZ2VyL2xhdGVzdC91c2VyZ3VpZGUvc3NtLWFnZW50Lmh0bWwpXG4gICAqIGluIHRoZSBTU00gRGV2ZWxvcGVyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgc3NtU2Vzc2lvblBlcm1pc3Npb25zPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGlzIHJlcHJlc2VudHMgYSBzaW5nbGUgRUMyIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnN0YW5jZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUluc3RhbmNlIHtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgT1MgdGhlIGluc3RhbmNlIGlzIHJ1bm5pbmcuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgb3NUeXBlOiBPcGVyYXRpbmdTeXN0ZW1UeXBlO1xuXG4gIC8qKlxuICAgKiBBbGxvd3Mgc3BlY2lmeSBzZWN1cml0eSBncm91cCBjb25uZWN0aW9ucyBmb3IgdGhlIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBDb25uZWN0aW9ucztcblxuICAvKipcbiAgICogVGhlIElBTSByb2xlIGFzc3VtZWQgYnkgdGhlIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGU6IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIHByaW5jaXBhbCB0byBncmFudCBwZXJtaXNzaW9ucyB0b1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbDtcblxuICAvKipcbiAgICogVXNlckRhdGEgZm9yIHRoZSBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHVzZXJEYXRhOiBVc2VyRGF0YTtcblxuICAvKipcbiAgICogdGhlIHVuZGVybHlpbmcgaW5zdGFuY2UgcmVzb3VyY2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBpbnN0YW5jZTogQ2ZuSW5zdGFuY2U7XG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VJZDogc3RyaW5nO1xuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGluc3RhbmNlQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nO1xuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGluc3RhbmNlUHJpdmF0ZURuc05hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBpbnN0YW5jZVByaXZhdGVJcDogc3RyaW5nO1xuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGluc3RhbmNlUHVibGljRG5zTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGluc3RhbmNlUHVibGljSXA6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA6IElTZWN1cml0eUdyb3VwO1xuICBwcml2YXRlIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBzOiBJU2VjdXJpdHlHcm91cFtdID0gW107XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEluc3RhbmNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKHByb3BzLmluaXRPcHRpb25zICYmICFwcm9wcy5pbml0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnaW5pdE9wdGlvbnNcXCcgcmVxdWlyZXMgdGhhdCBcXCdpbml0XFwnIGlzIGFsc28gc2V0Jyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnNlY3VyaXR5R3JvdXApIHtcbiAgICAgIHRoaXMuc2VjdXJpdHlHcm91cCA9IHByb3BzLnNlY3VyaXR5R3JvdXA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VjdXJpdHlHcm91cCA9IG5ldyBTZWN1cml0eUdyb3VwKHRoaXMsICdJbnN0YW5jZVNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiBwcm9wcy5hbGxvd0FsbE91dGJvdW5kICE9PSBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25zKHsgc2VjdXJpdHlHcm91cHM6IFt0aGlzLnNlY3VyaXR5R3JvdXBdIH0pO1xuICAgIHRoaXMuc2VjdXJpdHlHcm91cHMucHVzaCh0aGlzLnNlY3VyaXR5R3JvdXApO1xuICAgIFRhZ3Mub2YodGhpcykuYWRkKE5BTUVfVEFHLCBwcm9wcy5pbnN0YW5jZU5hbWUgfHwgdGhpcy5ub2RlLnBhdGgpO1xuXG4gICAgdGhpcy5yb2xlID0gcHJvcHMucm9sZSB8fCBuZXcgaWFtLlJvbGUodGhpcywgJ0luc3RhbmNlUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuICAgIHRoaXMuZ3JhbnRQcmluY2lwYWwgPSB0aGlzLnJvbGU7XG5cbiAgICBpZiAocHJvcHMuc3NtU2Vzc2lvblBlcm1pc3Npb25zKSB7XG4gICAgICB0aGlzLnJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvblNTTU1hbmFnZWRJbnN0YW5jZUNvcmUnKSk7XG4gICAgfVxuXG4gICAgY29uc3QgaWFtUHJvZmlsZSA9IG5ldyBpYW0uQ2ZuSW5zdGFuY2VQcm9maWxlKHRoaXMsICdJbnN0YW5jZVByb2ZpbGUnLCB7XG4gICAgICByb2xlczogW3RoaXMucm9sZS5yb2xlTmFtZV0sXG4gICAgfSk7XG5cbiAgICAvLyB1c2UgZGVsYXllZCBldmFsdWF0aW9uXG4gICAgY29uc3QgaW1hZ2VDb25maWcgPSBwcm9wcy5tYWNoaW5lSW1hZ2UuZ2V0SW1hZ2UodGhpcyk7XG4gICAgdGhpcy51c2VyRGF0YSA9IHByb3BzLnVzZXJEYXRhID8/IGltYWdlQ29uZmlnLnVzZXJEYXRhO1xuICAgIGNvbnN0IHVzZXJEYXRhVG9rZW4gPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IEZuLmJhc2U2NCh0aGlzLnVzZXJEYXRhLnJlbmRlcigpKSB9KTtcbiAgICBjb25zdCBzZWN1cml0eUdyb3Vwc1Rva2VuID0gTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5zZWN1cml0eUdyb3Vwcy5tYXAoc2cgPT4gc2cuc2VjdXJpdHlHcm91cElkKSB9KTtcblxuICAgIGNvbnN0IHsgc3VibmV0cyB9ID0gcHJvcHMudnBjLnNlbGVjdFN1Ym5ldHMocHJvcHMudnBjU3VibmV0cyk7XG4gICAgbGV0IHN1Ym5ldDtcbiAgICBpZiAocHJvcHMuYXZhaWxhYmlsaXR5Wm9uZSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBzdWJuZXRzLmZpbHRlcihzbiA9PiBzbi5hdmFpbGFiaWxpdHlab25lID09PSBwcm9wcy5hdmFpbGFiaWxpdHlab25lKTtcbiAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgc3VibmV0ID0gc2VsZWN0ZWRbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRFcnJvcihgTmVlZCBleGFjdGx5IDEgc3VibmV0IHRvIG1hdGNoIEFaICcke3Byb3BzLmF2YWlsYWJpbGl0eVpvbmV9JywgZm91bmQgJHtzZWxlY3RlZC5sZW5ndGh9LiBVc2UgYSBkaWZmZXJlbnQgYXZhaWxhYmlsaXR5Wm9uZS5gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN1Ym5ldHMubGVuZ3RoID4gMCkge1xuICAgICAgICBzdWJuZXQgPSBzdWJuZXRzWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkRXJyb3IoYERpZCBub3QgZmluZCBhbnkgc3VibmV0cyBtYXRjaGluZyAnJHtKU09OLnN0cmluZ2lmeShwcm9wcy52cGNTdWJuZXRzKX0nLCBwbGVhc2UgdXNlIGEgZGlmZmVyZW50IHNlbGVjdGlvbi5gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFzdWJuZXQpIHtcbiAgICAgIC8vIFdlIGdvdCBoZXJlIGFuZCB3ZSBkb24ndCBoYXZlIGEgc3VibmV0IGJlY2F1c2Ugb2YgdmFsaWRhdGlvbiBlcnJvcnMuXG4gICAgICAvLyBJbnZlbnQgb25lIG9uIHRoZSBzcG90IHNvIHRoZSBjb2RlIGJlbG93IGRvZXNuJ3QgZmFpbC5cbiAgICAgIHN1Ym5ldCA9IFN1Ym5ldC5mcm9tU3VibmV0QXR0cmlidXRlcyh0aGlzLCAnRHVtbXlTdWJuZXQnLCB7XG4gICAgICAgIHN1Ym5ldElkOiAncy1ub3Rmb3VuZCcsXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICdhei1ub3Rmb3VuZCcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmluc3RhbmNlID0gbmV3IENmbkluc3RhbmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGltYWdlSWQ6IGltYWdlQ29uZmlnLmltYWdlSWQsXG4gICAgICBrZXlOYW1lOiBwcm9wcy5rZXlOYW1lLFxuICAgICAgaW5zdGFuY2VUeXBlOiBwcm9wcy5pbnN0YW5jZVR5cGUudG9TdHJpbmcoKSxcbiAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IHNlY3VyaXR5R3JvdXBzVG9rZW4sXG4gICAgICBpYW1JbnN0YW5jZVByb2ZpbGU6IGlhbVByb2ZpbGUucmVmLFxuICAgICAgdXNlckRhdGE6IHVzZXJEYXRhVG9rZW4sXG4gICAgICBzdWJuZXRJZDogc3VibmV0LnN1Ym5ldElkLFxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogc3VibmV0LmF2YWlsYWJpbGl0eVpvbmUsXG4gICAgICBzb3VyY2VEZXN0Q2hlY2s6IHByb3BzLnNvdXJjZURlc3RDaGVjayxcbiAgICAgIGJsb2NrRGV2aWNlTWFwcGluZ3M6IHByb3BzLmJsb2NrRGV2aWNlcyAhPT0gdW5kZWZpbmVkID8gaW5zdGFuY2VCbG9ja0RldmljZU1hcHBpbmdzKHRoaXMsIHByb3BzLmJsb2NrRGV2aWNlcykgOiB1bmRlZmluZWQsXG4gICAgICBwcml2YXRlSXBBZGRyZXNzOiBwcm9wcy5wcml2YXRlSXBBZGRyZXNzLFxuICAgICAgcHJvcGFnYXRlVGFnc1RvVm9sdW1lT25DcmVhdGlvbjogcHJvcHMucHJvcGFnYXRlVGFnc1RvVm9sdW1lT25DcmVhdGlvbixcbiAgICAgIG1vbml0b3Jpbmc6IHByb3BzLmRldGFpbGVkTW9uaXRvcmluZyxcbiAgICB9KTtcbiAgICB0aGlzLmluc3RhbmNlLm5vZGUuYWRkRGVwZW5kZW5jeSh0aGlzLnJvbGUpO1xuXG4gICAgdGhpcy5vc1R5cGUgPSBpbWFnZUNvbmZpZy5vc1R5cGU7XG4gICAgdGhpcy5ub2RlLmRlZmF1bHRDaGlsZCA9IHRoaXMuaW5zdGFuY2U7XG5cbiAgICB0aGlzLmluc3RhbmNlSWQgPSB0aGlzLmluc3RhbmNlLnJlZjtcbiAgICB0aGlzLmluc3RhbmNlQXZhaWxhYmlsaXR5Wm9uZSA9IHRoaXMuaW5zdGFuY2UuYXR0ckF2YWlsYWJpbGl0eVpvbmU7XG4gICAgdGhpcy5pbnN0YW5jZVByaXZhdGVEbnNOYW1lID0gdGhpcy5pbnN0YW5jZS5hdHRyUHJpdmF0ZURuc05hbWU7XG4gICAgdGhpcy5pbnN0YW5jZVByaXZhdGVJcCA9IHRoaXMuaW5zdGFuY2UuYXR0clByaXZhdGVJcDtcbiAgICB0aGlzLmluc3RhbmNlUHVibGljRG5zTmFtZSA9IHRoaXMuaW5zdGFuY2UuYXR0clB1YmxpY0Ruc05hbWU7XG4gICAgdGhpcy5pbnN0YW5jZVB1YmxpY0lwID0gdGhpcy5pbnN0YW5jZS5hdHRyUHVibGljSXA7XG5cbiAgICBpZiAocHJvcHMuaW5pdCkge1xuICAgICAgdGhpcy5hcHBseUNsb3VkRm9ybWF0aW9uSW5pdChwcm9wcy5pbml0LCBwcm9wcy5pbml0T3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseVVwZGF0ZVBvbGljaWVzKHByb3BzKTtcblxuICAgIC8vIFRyaWdnZXIgcmVwbGFjZW1lbnQgKHZpYSBuZXcgbG9naWNhbCBJRCkgb24gdXNlciBkYXRhIGNoYW5nZSwgaWYgc3BlY2lmaWVkIG9yIGNmbi1pbml0IGlzIGJlaW5nIHVzZWQuXG4gICAgLy9cbiAgICAvLyBUaGlzIGlzIHNsaWdodGx5IHRyaWNreSAtLSB3ZSBuZWVkIHRvIHJlc29sdmUgdGhlIFVzZXJEYXRhIHN0cmluZyAoaW4gb3JkZXIgdG8gZ2V0IGF0IGFjdHVhbCBBc3NldCBoYXNoZXMsXG4gICAgLy8gaW5zdGVhZCBvZiB0aGUgVG9rZW4gc3RyaW5naWZpY2F0aW9ucyBvZiB0aGVtICgnJHtUb2tlblsxMjM0XX0nKS4gSG93ZXZlciwgaW4gdGhlIGNhc2Ugb2YgQ0ZOIEluaXQgdXNhZ2UsXG4gICAgLy8gYSBVc2VyRGF0YSBpcyBnb2luZyB0byBjb250YWluIHRoZSBsb2dpY2FsSUQgb2YgdGhlIHJlc291cmNlIGl0c2VsZiwgd2hpY2ggbWVhbnMgaW5maW5pdGUgcmVjdXJzaW9uIGlmIHdlXG4gICAgLy8gdHJ5IHRvIG5haXZlbHkgcmVzb2x2ZS4gV2UgbmVlZCBhIHJlY3Vyc2lvbiBicmVha2VyIGluIHRoaXMuXG4gICAgY29uc3Qgb3JpZ2luYWxMb2dpY2FsSWQgPSBTdGFjay5vZih0aGlzKS5nZXRMb2dpY2FsSWQodGhpcy5pbnN0YW5jZSk7XG4gICAgbGV0IHJlY3Vyc2luZyA9IGZhbHNlO1xuICAgIHRoaXMuaW5zdGFuY2Uub3ZlcnJpZGVMb2dpY2FsSWQoTGF6eS51bmNhY2hlZFN0cmluZyh7XG4gICAgICBwcm9kdWNlOiAoY29udGV4dCkgPT4ge1xuICAgICAgICBpZiAocmVjdXJzaW5nKSB7IHJldHVybiBvcmlnaW5hbExvZ2ljYWxJZDsgfVxuICAgICAgICBpZiAoIShwcm9wcy51c2VyRGF0YUNhdXNlc1JlcGxhY2VtZW50ID8/IHByb3BzLmluaXRPcHRpb25zKSkgeyByZXR1cm4gb3JpZ2luYWxMb2dpY2FsSWQ7IH1cblxuICAgICAgICBjb25zdCBmcmFnbWVudHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgICAgICByZWN1cnNpbmcgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZyYWdtZW50cy5wdXNoKEpTT04uc3RyaW5naWZ5KGNvbnRleHQucmVzb2x2ZSh0aGlzLnVzZXJEYXRhLnJlbmRlcigpKSkpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHJlY3Vyc2luZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpZ2VzdCA9IG1kNWhhc2goZnJhZ21lbnRzLmpvaW4oJycpKS5zbGljZSgwLCAxNik7XG4gICAgICAgIHJldHVybiBgJHtvcmlnaW5hbExvZ2ljYWxJZH0ke2RpZ2VzdH1gO1xuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBpZiAocHJvcHMucmVxdWlyZUltZHN2Mikge1xuICAgICAgQXNwZWN0cy5vZih0aGlzKS5hZGQobmV3IEluc3RhbmNlUmVxdWlyZUltZHN2MkFzcGVjdCgpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBzZWN1cml0eSBncm91cCB0byB0aGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBzZWN1cml0eUdyb3VwOiBUaGUgc2VjdXJpdHkgZ3JvdXAgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkU2VjdXJpdHlHcm91cChzZWN1cml0eUdyb3VwOiBJU2VjdXJpdHlHcm91cCk6IHZvaWQge1xuICAgIHRoaXMuc2VjdXJpdHlHcm91cHMucHVzaChzZWN1cml0eUdyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgY29tbWFuZCB0byB0aGUgc3RhcnR1cCBzY3JpcHQgb2YgdGhlIGluc3RhbmNlLlxuICAgKiBUaGUgY29tbWFuZCBtdXN0IGJlIGluIHRoZSBzY3JpcHRpbmcgbGFuZ3VhZ2Ugc3VwcG9ydGVkIGJ5IHRoZSBpbnN0YW5jZSdzIE9TIChpLmUuIExpbnV4L1dpbmRvd3MpLlxuICAgKi9cbiAgcHVibGljIGFkZFVzZXJEYXRhKC4uLmNvbW1hbmRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMudXNlckRhdGEuYWRkQ29tbWFuZHMoLi4uY29tbWFuZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIElBTSByb2xlIGFzc3VtZWQgYnkgdGhlIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIGFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpIHtcbiAgICB0aGlzLnJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgYSBDbG91ZEZvcm1hdGlvbiBJbml0IGNvbmZpZ3VyYXRpb24gYXQgaW5zdGFuY2Ugc3RhcnR1cFxuICAgKlxuICAgKiBUaGlzIGRvZXMgdGhlIGZvbGxvd2luZzpcbiAgICpcbiAgICogLSBBdHRhY2hlcyB0aGUgQ2xvdWRGb3JtYXRpb24gSW5pdCBtZXRhZGF0YSB0byB0aGUgSW5zdGFuY2UgcmVzb3VyY2UuXG4gICAqIC0gQWRkIGNvbW1hbmRzIHRvIHRoZSBpbnN0YW5jZSBVc2VyRGF0YSB0byBydW4gYGNmbi1pbml0YCBhbmQgYGNmbi1zaWduYWxgLlxuICAgKiAtIFVwZGF0ZSB0aGUgaW5zdGFuY2UncyBDcmVhdGlvblBvbGljeSB0byB3YWl0IGZvciB0aGUgYGNmbi1zaWduYWxgIGNvbW1hbmRzLlxuICAgKi9cbiAgcHJpdmF0ZSBhcHBseUNsb3VkRm9ybWF0aW9uSW5pdChpbml0OiBDbG91ZEZvcm1hdGlvbkluaXQsIG9wdGlvbnM6IEFwcGx5Q2xvdWRGb3JtYXRpb25Jbml0T3B0aW9ucyA9IHt9KSB7XG4gICAgaW5pdC5hdHRhY2godGhpcy5pbnN0YW5jZSwge1xuICAgICAgcGxhdGZvcm06IHRoaXMub3NUeXBlLFxuICAgICAgaW5zdGFuY2VSb2xlOiB0aGlzLnJvbGUsXG4gICAgICB1c2VyRGF0YTogdGhpcy51c2VyRGF0YSxcbiAgICAgIGNvbmZpZ1NldHM6IG9wdGlvbnMuY29uZmlnU2V0cyxcbiAgICAgIGVtYmVkRmluZ2VycHJpbnQ6IG9wdGlvbnMuZW1iZWRGaW5nZXJwcmludCxcbiAgICAgIHByaW50TG9nOiBvcHRpb25zLnByaW50TG9nLFxuICAgICAgaWdub3JlRmFpbHVyZXM6IG9wdGlvbnMuaWdub3JlRmFpbHVyZXMsXG4gICAgICBpbmNsdWRlUm9sZTogb3B0aW9ucy5pbmNsdWRlUm9sZSxcbiAgICAgIGluY2x1ZGVVcmw6IG9wdGlvbnMuaW5jbHVkZVVybCxcbiAgICB9KTtcbiAgICB0aGlzLndhaXRGb3JSZXNvdXJjZVNpZ25hbChvcHRpb25zLnRpbWVvdXQgPz8gRHVyYXRpb24ubWludXRlcyg1KSk7XG4gIH1cblxuICAvKipcbiAgICogV2FpdCBmb3IgYSBzaW5nbGUgYWRkaXRpb25hbCByZXNvdXJjZSBzaWduYWxcbiAgICpcbiAgICogQWRkIDEgdG8gdGhlIGN1cnJlbnQgUmVzb3VyY2VTaWduYWwgQ291bnQgYW5kIGFkZCB0aGUgZ2l2ZW4gdGltZW91dCB0byB0aGUgY3VycmVudCB0aW1lb3V0LlxuICAgKlxuICAgKiBVc2UgdGhpcyB0byBwYXVzZSB0aGUgQ2xvdWRGb3JtYXRpb24gZGVwbG95bWVudCB0byB3YWl0IGZvciB0aGUgaW5zdGFuY2VzXG4gICAqIGluIHRoZSBBdXRvU2NhbGluZ0dyb3VwIHRvIHJlcG9ydCBzdWNjZXNzZnVsIHN0YXJ0dXAgZHVyaW5nXG4gICAqIGNyZWF0aW9uIGFuZCB1cGRhdGVzLiBUaGUgVXNlckRhdGEgc2NyaXB0IG5lZWRzIHRvIGludm9rZSBgY2ZuLXNpZ25hbGBcbiAgICogd2l0aCBhIHN1Y2Nlc3Mgb3IgZmFpbHVyZSBjb2RlIGFmdGVyIGl0IGlzIGRvbmUgc2V0dGluZyB1cCB0aGUgaW5zdGFuY2UuXG4gICAqL1xuICBwcml2YXRlIHdhaXRGb3JSZXNvdXJjZVNpZ25hbCh0aW1lb3V0OiBEdXJhdGlvbikge1xuICAgIGNvbnN0IG9sZFJlc291cmNlU2lnbmFsID0gdGhpcy5pbnN0YW5jZS5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5Py5yZXNvdXJjZVNpZ25hbDtcbiAgICB0aGlzLmluc3RhbmNlLmNmbk9wdGlvbnMuY3JlYXRpb25Qb2xpY3kgPSB7XG4gICAgICAuLi50aGlzLmluc3RhbmNlLmNmbk9wdGlvbnMuY3JlYXRpb25Qb2xpY3ksXG4gICAgICByZXNvdXJjZVNpZ25hbDoge1xuICAgICAgICBjb3VudDogKG9sZFJlc291cmNlU2lnbmFsPy5jb3VudCA/PyAwKSArIDEsXG4gICAgICAgIHRpbWVvdXQ6IChvbGRSZXNvdXJjZVNpZ25hbD8udGltZW91dCA/IER1cmF0aW9uLnBhcnNlKG9sZFJlc291cmNlU2lnbmFsPy50aW1lb3V0KS5wbHVzKHRpbWVvdXQpIDogdGltZW91dCkudG9Jc29TdHJpbmcoKSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBDbG91ZEZvcm1hdGlvbiB1cGRhdGUgcG9saWNpZXMgZm9yIHRoZSBpbnN0YW5jZVxuICAgKi9cbiAgcHJpdmF0ZSBhcHBseVVwZGF0ZVBvbGljaWVzKHByb3BzOiBJbnN0YW5jZVByb3BzKSB7XG4gICAgaWYgKHByb3BzLnJlc291cmNlU2lnbmFsVGltZW91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmNmbk9wdGlvbnMuY3JlYXRpb25Qb2xpY3kgPSB7XG4gICAgICAgIC4uLnRoaXMuaW5zdGFuY2UuY2ZuT3B0aW9ucy5jcmVhdGlvblBvbGljeSxcbiAgICAgICAgcmVzb3VyY2VTaWduYWw6IHtcbiAgICAgICAgICB0aW1lb3V0OiBwcm9wcy5yZXNvdXJjZVNpZ25hbFRpbWVvdXQgJiYgcHJvcHMucmVzb3VyY2VTaWduYWxUaW1lb3V0LnRvSXNvU3RyaW5nKCksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGFwcGx5aW5nIENsb3VkRm9ybWF0aW9uIGluaXQgdG8gYW4gaW5zdGFuY2Ugb3IgaW5zdGFuY2UgZ3JvdXBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcHBseUNsb3VkRm9ybWF0aW9uSW5pdE9wdGlvbnMge1xuICAvKipcbiAgICogQ29uZmlnU2V0IHRvIGFjdGl2YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IFsnZGVmYXVsdCddXG4gICAqL1xuICByZWFkb25seSBjb25maWdTZXRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRpbWVvdXQgd2FpdGluZyBmb3IgdGhlIGNvbmZpZ3VyYXRpb24gdG8gYmUgYXBwbGllZFxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIEZvcmNlIGluc3RhbmNlIHJlcGxhY2VtZW50IGJ5IGVtYmVkZGluZyBhIGNvbmZpZyBmaW5nZXJwcmludFxuICAgKlxuICAgKiBJZiBgdHJ1ZWAgKHRoZSBkZWZhdWx0KSwgYSBoYXNoIG9mIHRoZSBjb25maWcgd2lsbCBiZSBlbWJlZGRlZCBpbnRvIHRoZVxuICAgKiBVc2VyRGF0YSwgc28gdGhhdCBpZiB0aGUgY29uZmlnIGNoYW5nZXMsIHRoZSBVc2VyRGF0YSBjaGFuZ2VzLlxuICAgKlxuICAgKiAtIElmIHRoZSBFQzIgaW5zdGFuY2UgaXMgaW5zdGFuY2Utc3RvcmUgYmFja2VkIG9yXG4gICAqICAgYHVzZXJEYXRhQ2F1c2VzUmVwbGFjZW1lbnRgIGlzIHNldCwgdGhpcyB3aWxsIGNhdXNlIHRoZSBpbnN0YW5jZSB0byBiZVxuICAgKiAgIHJlcGxhY2VkIGFuZCB0aGUgbmV3IGNvbmZpZ3VyYXRpb24gdG8gYmUgYXBwbGllZC5cbiAgICogLSBJZiB0aGUgaW5zdGFuY2UgaXMgRUJTLWJhY2tlZCBhbmQgYHVzZXJEYXRhQ2F1c2VzUmVwbGFjZW1lbnRgIGlzIG5vdFxuICAgKiAgIHNldCwgdGhlIGNoYW5nZSBvZiBVc2VyRGF0YSB3aWxsIG1ha2UgdGhlIGluc3RhbmNlIHJlc3RhcnQgYnV0IG5vdCBiZVxuICAgKiAgIHJlcGxhY2VkLCBhbmQgdGhlIGNvbmZpZ3VyYXRpb24gd2lsbCBub3QgYmUgYXBwbGllZCBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBJZiBgZmFsc2VgLCBubyBoYXNoIHdpbGwgYmUgZW1iZWRkZWQsIGFuZCBpZiB0aGUgQ2xvdWRGb3JtYXRpb24gSW5pdFxuICAgKiBjb25maWcgY2hhbmdlcyBub3RoaW5nIHdpbGwgaGFwcGVuIHRvIHRoZSBydW5uaW5nIGluc3RhbmNlLiBJZiBhXG4gICAqIGNvbmZpZyB1cGRhdGUgaW50cm9kdWNlcyBlcnJvcnMsIHlvdSB3aWxsIG5vdCBub3RpY2UgdW50aWwgYWZ0ZXIgdGhlXG4gICAqIENsb3VkRm9ybWF0aW9uIGRlcGxveW1lbnQgc3VjY2Vzc2Z1bGx5IGZpbmlzaGVzIGFuZCB0aGUgbmV4dCBpbnN0YW5jZVxuICAgKiBmYWlscyB0byBsYXVuY2guXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGVtYmVkRmluZ2VycHJpbnQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBQcmludCB0aGUgcmVzdWx0cyBvZiBydW5uaW5nIGNmbi1pbml0IHRvIHRoZSBJbnN0YW5jZSBTeXN0ZW0gTG9nXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBvdXRwdXQgb2YgcnVubmluZyBjZm4taW5pdCBpcyB3cml0dGVuIHRvIGEgbG9nIGZpbGVcbiAgICogb24gdGhlIGluc3RhbmNlLiBTZXQgdGhpcyB0byBgdHJ1ZWAgdG8gcHJpbnQgaXQgdG8gdGhlIFN5c3RlbSBMb2dcbiAgICogKHZpc2libGUgZnJvbSB0aGUgRUMyIENvbnNvbGUpLCBgZmFsc2VgIHRvIG5vdCBwcmludCBpdC5cbiAgICpcbiAgICogKEJlIGF3YXJlIHRoYXQgdGhlIHN5c3RlbSBsb2cgaXMgcmVmcmVzaGVkIGF0IGNlcnRhaW4gcG9pbnRzIGluXG4gICAqIHRpbWUgb2YgdGhlIGluc3RhbmNlIGxpZmUgY3ljbGUsIGFuZCBzdWNjZXNzZnVsIGV4ZWN1dGlvbiBtYXlcbiAgICogbm90IGFsd2F5cyBzaG93IHVwKS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJpbnRMb2c/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBEb24ndCBmYWlsIHRoZSBpbnN0YW5jZSBjcmVhdGlvbiB3aGVuIGNmbi1pbml0IGZhaWxzXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIHRoaXMgdG8gcHJldmVudCBDbG91ZEZvcm1hdGlvbiBmcm9tIHJvbGxpbmcgYmFjayB3aGVuXG4gICAqIGluc3RhbmNlcyBmYWlsIHRvIHN0YXJ0IHVwLCB0byBoZWxwIGluIGRlYnVnZ2luZy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGlnbm9yZUZhaWx1cmVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5jbHVkZSAtLXVybCBhcmd1bWVudCB3aGVuIHJ1bm5pbmcgY2ZuLWluaXQgYW5kIGNmbi1zaWduYWwgY29tbWFuZHNcbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIHRoZSBjbG91ZGZvcm1hdGlvbiBlbmRwb2ludCBpbiB0aGUgZGVwbG95ZWQgcmVnaW9uXG4gICAqIGUuZy4gaHR0cHM6Ly9jbG91ZGZvcm1hdGlvbi51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZVVybD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluY2x1ZGUgLS1yb2xlIGFyZ3VtZW50IHdoZW4gcnVubmluZyBjZm4taW5pdCBhbmQgY2ZuLXNpZ25hbCBjb21tYW5kc1xuICAgKlxuICAgKiBUaGlzIHdpbGwgYmUgdGhlIElBTSBpbnN0YW5jZSBwcm9maWxlIGF0dGFjaGVkIHRvIHRoZSBFQzIgaW5zdGFuY2VcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGluY2x1ZGVSb2xlPzogYm9vbGVhbjtcbn1cbiJdfQ==