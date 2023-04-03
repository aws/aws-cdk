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
            blockDeviceMappings: props.blockDevices !== undefined ? ebs_util_1.instanceBlockDeviceMappings(this, props.blockDevices) : undefined,
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
                const digest = helpers_internal_1.md5hash(fragments.join('')).slice(0, 16);
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
exports.Instance = Instance;
_a = JSII_RTTI_SYMBOL_1;
Instance[_a] = { fqn: "@aws-cdk/aws-ec2.Instance", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFFeEMsd0NBQTJHO0FBQzNHLHlFQUE2RDtBQUU3RCx1Q0FBd0Q7QUFFeEQsK0NBQTBEO0FBQzFELG1EQUE4QztBQUc5QyxpREFBaUU7QUFDakUscURBQWlFO0FBR2pFLCtCQUFzRDtBQUV0RDs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQztBQThPaEM7O0dBRUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxlQUFRO0lBMkRwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIRixtQkFBYyxHQUFxQixFQUFFLENBQUM7Ozs7OzsrQ0F6RDVDLFFBQVE7Ozs7UUE4RGpCLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztTQUMxQzthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDhCQUFhLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO2dCQUNwRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7Z0JBQ2QsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixLQUFLLEtBQUs7YUFDbkQsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUkseUJBQVcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLGNBQWMs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QUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBYyxHQUFHO2dCQUN4QyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGNBQWM7Z0JBQzFDLGNBQWMsRUFBRTtvQkFDZCxPQUFPLEVBQUUsS0FBSyxDQUFDLHFCQUFxQixJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUU7aUJBQ2xGO2FBQ0YsQ0FBQztTQUNIO0tBQ0Y7O0FBdFFILDRCQXVRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcblxuaW1wb3J0IHsgQW5ub3RhdGlvbnMsIEFzcGVjdHMsIER1cmF0aW9uLCBGbiwgSVJlc291cmNlLCBMYXp5LCBSZXNvdXJjZSwgU3RhY2ssIFRhZ3MgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IG1kNWhhc2ggfSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSW5zdGFuY2VSZXF1aXJlSW1kc3YyQXNwZWN0IH0gZnJvbSAnLi9hc3BlY3RzJztcbmltcG9ydCB7IENsb3VkRm9ybWF0aW9uSW5pdCB9IGZyb20gJy4vY2ZuLWluaXQnO1xuaW1wb3J0IHsgQ29ubmVjdGlvbnMsIElDb25uZWN0YWJsZSB9IGZyb20gJy4vY29ubmVjdGlvbnMnO1xuaW1wb3J0IHsgQ2ZuSW5zdGFuY2UgfSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSW5zdGFuY2VUeXBlIH0gZnJvbSAnLi9pbnN0YW5jZS10eXBlcyc7XG5pbXBvcnQgeyBJTWFjaGluZUltYWdlLCBPcGVyYXRpbmdTeXN0ZW1UeXBlIH0gZnJvbSAnLi9tYWNoaW5lLWltYWdlJztcbmltcG9ydCB7IGluc3RhbmNlQmxvY2tEZXZpY2VNYXBwaW5ncyB9IGZyb20gJy4vcHJpdmF0ZS9lYnMtdXRpbCc7XG5pbXBvcnQgeyBJU2VjdXJpdHlHcm91cCwgU2VjdXJpdHlHcm91cCB9IGZyb20gJy4vc2VjdXJpdHktZ3JvdXAnO1xuaW1wb3J0IHsgVXNlckRhdGEgfSBmcm9tICcuL3VzZXItZGF0YSc7XG5pbXBvcnQgeyBCbG9ja0RldmljZSB9IGZyb20gJy4vdm9sdW1lJztcbmltcG9ydCB7IElWcGMsIFN1Ym5ldCwgU3VibmV0U2VsZWN0aW9uIH0gZnJvbSAnLi92cGMnO1xuXG4vKipcbiAqIE5hbWUgdGFnIGNvbnN0YW50XG4gKi9cbmNvbnN0IE5BTUVfVEFHOiBzdHJpbmcgPSAnTmFtZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUluc3RhbmNlIGV4dGVuZHMgSVJlc291cmNlLCBJQ29ubmVjdGFibGUsIGlhbS5JR3JhbnRhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSdzIElEXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGF2YWlsYWJpbGl0eSB6b25lIHRoZSBpbnN0YW5jZSB3YXMgbGF1bmNoZWQgaW5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VBdmFpbGFiaWxpdHlab25lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgRE5TIG5hbWUgZm9yIHRoaXMgaW5zdGFuY2VcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VQcml2YXRlRG5zTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcml2YXRlIElQIGZvciB0aGlzIGluc3RhbmNlXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlUHJpdmF0ZUlwOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFB1YmxpY2x5LXJvdXRhYmxlIEROUyBuYW1lIGZvciB0aGlzIGluc3RhbmNlLlxuICAgKlxuICAgKiAoTWF5IGJlIGFuIGVtcHR5IHN0cmluZyBpZiB0aGUgaW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBhIHB1YmxpYyBuYW1lKS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VQdWJsaWNEbnNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFB1YmxpY2x5LXJvdXRhYmxlIElQICBhZGRyZXNzIGZvciB0aGlzIGluc3RhbmNlLlxuICAgKlxuICAgKiAoTWF5IGJlIGFuIGVtcHR5IHN0cmluZyBpZiB0aGUgaW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBhIHB1YmxpYyBJUCkuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlUHVibGljSXA6IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG9mIGFuIEVDMiBJbnN0YW5jZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluc3RhbmNlUHJvcHMge1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIFNTSCBrZXlwYWlyIHRvIGdyYW50IGFjY2VzcyB0byBpbnN0YW5jZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIFNTSCBhY2Nlc3Mgd2lsbCBiZSBwb3NzaWJsZS5cbiAgICovXG4gIHJlYWRvbmx5IGtleU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRvIHBsYWNlIHRoZSBpbnN0YW5jZSB3aXRoaW4gdGhlIFZQQ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFByaXZhdGUgc3VibmV0cy5cbiAgICovXG4gIHJlYWRvbmx5IHZwY1N1Ym5ldHM/OiBTdWJuZXRTZWxlY3Rpb247XG5cbiAgLyoqXG4gICAqIEluIHdoaWNoIEFaIHRvIHBsYWNlIHRoZSBpbnN0YW5jZSB3aXRoaW4gdGhlIFZQQ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFJhbmRvbSB6b25lLlxuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZT86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgaW5zdGFuY2UgY291bGQgaW5pdGlhdGUgY29ubmVjdGlvbnMgdG8gYW55d2hlcmUgYnkgZGVmYXVsdC5cbiAgICogVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IHVzZWQgd2hlbiB5b3UgZG8gbm90IHByb3ZpZGUgYSBzZWN1cml0eSBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxPdXRib3VuZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBsZW5ndGggb2YgdGltZSB0byB3YWl0IGZvciB0aGUgcmVzb3VyY2VTaWduYWxDb3VudFxuICAgKlxuICAgKiBUaGUgbWF4aW11bSB2YWx1ZSBpcyA0MzIwMCAoMTIgaG91cnMpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZVNpZ25hbFRpbWVvdXQ/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVlBDIHRvIGxhdW5jaCB0aGUgaW5zdGFuY2UgaW4uXG4gICAqL1xuICByZWFkb25seSB2cGM6IElWcGM7XG5cbiAgLyoqXG4gICAqIFNlY3VyaXR5IEdyb3VwIHRvIGFzc2lnbiB0byB0aGlzIGluc3RhbmNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gY3JlYXRlIG5ldyBzZWN1cml0eSBncm91cFxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cD86IElTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGluc3RhbmNlIHRvIGxhdW5jaFxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGU7XG5cbiAgLyoqXG4gICAqIEFNSSB0byBsYXVuY2hcbiAgICovXG4gIHJlYWRvbmx5IG1hY2hpbmVJbWFnZTogSU1hY2hpbmVJbWFnZTtcblxuICAvKipcbiAgICogU3BlY2lmaWMgVXNlckRhdGEgdG8gdXNlXG4gICAqXG4gICAqIFRoZSBVc2VyRGF0YSBtYXkgc3RpbGwgYmUgbXV0YXRlZCBhZnRlciBjcmVhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIFVzZXJEYXRhIG9iamVjdCBhcHByb3ByaWF0ZSBmb3IgdGhlIE1hY2hpbmVJbWFnZSdzXG4gICAqIE9wZXJhdGluZyBTeXN0ZW0gaXMgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHVzZXJEYXRhPzogVXNlckRhdGE7XG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdG8gdGhlIFVzZXJEYXRhIGZvcmNlIHJlcGxhY2VtZW50XG4gICAqXG4gICAqIERlcGVuZGluZyB0aGUgRUMyIGluc3RhbmNlIHR5cGUsIGNoYW5naW5nIFVzZXJEYXRhIGVpdGhlclxuICAgKiByZXN0YXJ0cyB0aGUgaW5zdGFuY2Ugb3IgcmVwbGFjZXMgdGhlIGluc3RhbmNlLlxuICAgKlxuICAgKiAtIEluc3RhbmNlIHN0b3JlLWJhY2tlZCBpbnN0YW5jZXMgYXJlIHJlcGxhY2VkLlxuICAgKiAtIEVCUy1iYWNrZWQgaW5zdGFuY2VzIGFyZSByZXN0YXJ0ZWQuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIHJlc3RhcnRpbmcgZG9lcyBub3QgZXhlY3V0ZSB0aGUgbmV3IFVzZXJEYXRhIHNvIHlvdVxuICAgKiB3aWxsIG5lZWQgYSBkaWZmZXJlbnQgbWVjaGFuaXNtIHRvIGVuc3VyZSB0aGUgaW5zdGFuY2UgaXMgcmVzdGFydGVkLlxuICAgKlxuICAgKiBTZXR0aW5nIHRoaXMgdG8gYHRydWVgIHdpbGwgbWFrZSB0aGUgaW5zdGFuY2UncyBMb2dpY2FsIElEIGRlcGVuZCBvbiB0aGVcbiAgICogVXNlckRhdGEsIHdoaWNoIHdpbGwgY2F1c2UgQ2xvdWRGb3JtYXRpb24gdG8gcmVwbGFjZSBpdCBpZiB0aGUgVXNlckRhdGFcbiAgICogY2hhbmdlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0cnVlIGlmZiBgaW5pdE9wdGlvbnNgIGlzIHNwZWNpZmllZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgcmVhZG9ubHkgdXNlckRhdGFDYXVzZXNSZXBsYWNlbWVudD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFuIElBTSByb2xlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBpbnN0YW5jZSBwcm9maWxlIGFzc2lnbmVkIHRvIHRoaXMgQXV0byBTY2FsaW5nIEdyb3VwLlxuICAgKlxuICAgKiBUaGUgcm9sZSBtdXN0IGJlIGFzc3VtYWJsZSBieSB0aGUgc2VydmljZSBwcmluY2lwYWwgYGVjMi5hbWF6b25hd3MuY29tYDpcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnTXlSb2xlJywge1xuICAgKiAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcm9sZSB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY3JlYXRlZCwgaXQgY2FuIGJlIGFjY2Vzc2VkIHZpYSB0aGUgYHJvbGVgIHByb3BlcnR5XG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgaW5zdGFuY2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBDREsgZ2VuZXJhdGVkIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdG8gZW5hYmxlIGFuIGluc3RhbmNlIGxhdW5jaGVkIGluIGEgVlBDIHRvIHBlcmZvcm0gTkFULlxuICAgKiBUaGlzIGNvbnRyb2xzIHdoZXRoZXIgc291cmNlL2Rlc3RpbmF0aW9uIGNoZWNraW5nIGlzIGVuYWJsZWQgb24gdGhlIGluc3RhbmNlLlxuICAgKiBBIHZhbHVlIG9mIHRydWUgbWVhbnMgdGhhdCBjaGVja2luZyBpcyBlbmFibGVkLCBhbmQgZmFsc2UgbWVhbnMgdGhhdCBjaGVja2luZyBpcyBkaXNhYmxlZC5cbiAgICogVGhlIHZhbHVlIG11c3QgYmUgZmFsc2UgZm9yIHRoZSBpbnN0YW5jZSB0byBwZXJmb3JtIE5BVC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlRGVzdENoZWNrPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGhvdyBibG9jayBkZXZpY2VzIGFyZSBleHBvc2VkIHRvIHRoZSBpbnN0YW5jZS4gWW91IGNhbiBzcGVjaWZ5IHZpcnR1YWwgZGV2aWNlcyBhbmQgRUJTIHZvbHVtZXMuXG4gICAqXG4gICAqIEVhY2ggaW5zdGFuY2UgdGhhdCBpcyBsYXVuY2hlZCBoYXMgYW4gYXNzb2NpYXRlZCByb290IGRldmljZSB2b2x1bWUsXG4gICAqIGVpdGhlciBhbiBBbWF6b24gRUJTIHZvbHVtZSBvciBhbiBpbnN0YW5jZSBzdG9yZSB2b2x1bWUuXG4gICAqIFlvdSBjYW4gdXNlIGJsb2NrIGRldmljZSBtYXBwaW5ncyB0byBzcGVjaWZ5IGFkZGl0aW9uYWwgRUJTIHZvbHVtZXMgb3JcbiAgICogaW5zdGFuY2Ugc3RvcmUgdm9sdW1lcyB0byBhdHRhY2ggdG8gYW4gaW5zdGFuY2Ugd2hlbiBpdCBpcyBsYXVuY2hlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvYmxvY2stZGV2aWNlLW1hcHBpbmctY29uY2VwdHMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFVzZXMgdGhlIGJsb2NrIGRldmljZSBtYXBwaW5nIG9mIHRoZSBBTUlcbiAgICovXG4gIHJlYWRvbmx5IGJsb2NrRGV2aWNlcz86IEJsb2NrRGV2aWNlW107XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBwcml2YXRlIElQIGFkZHJlc3MgdG8gYXNzb2NpYXRlIHdpdGggYW4gaW5zdGFuY2UuXG4gICAqXG4gICAqIFByaXZhdGUgSVAgc2hvdWxkIGJlIGF2YWlsYWJsZSB3aXRoaW4gdGhlIFZQQyB0aGF0IHRoZSBpbnN0YW5jZSBpcyBidWlsZCB3aXRoaW4uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYXNzb2NpYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IHByaXZhdGVJcEFkZHJlc3M/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgRUMyIGluc3RhbmNlIHRhZ3MgdG8gdGhlIEVCUyB2b2x1bWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwcm9wYWdhdGVUYWdzVG9Wb2x1bWVPbkNyZWF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQXBwbHkgdGhlIGdpdmVuIENsb3VkRm9ybWF0aW9uIEluaXQgY29uZmlndXJhdGlvbiB0byB0aGUgaW5zdGFuY2UgYXQgc3RhcnR1cFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIENsb3VkRm9ybWF0aW9uIGluaXRcbiAgICovXG4gIHJlYWRvbmx5IGluaXQ/OiBDbG91ZEZvcm1hdGlvbkluaXQ7XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgZ2l2ZW4gb3B0aW9ucyBmb3IgYXBwbHlpbmcgQ2xvdWRGb3JtYXRpb24gSW5pdFxuICAgKlxuICAgKiBEZXNjcmliZXMgdGhlIGNvbmZpZ3NldHMgdG8gdXNlIGFuZCB0aGUgdGltZW91dCB0byB3YWl0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZGVmYXVsdCBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBpbml0T3B0aW9ucz86IEFwcGx5Q2xvdWRGb3JtYXRpb25Jbml0T3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciBJTURTdjIgc2hvdWxkIGJlIHJlcXVpcmVkIG9uIHRoaXMgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVpcmVJbWRzdjI/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIFwiRGV0YWlsZWQgTW9uaXRvcmluZ1wiIGlzIGVuYWJsZWQgZm9yIHRoaXMgaW5zdGFuY2VcbiAgICogS2VlcCBpbiBtaW5kIHRoYXQgRGV0YWlsZWQgTW9uaXRvcmluZyByZXN1bHRzIGluIGV4dHJhIGNoYXJnZXNcbiAgICpcbiAgICogQHNlZSBodHRwOi8vYXdzLmFtYXpvbi5jb20vY2xvdWR3YXRjaC9wcmljaW5nL1xuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBkZXRhaWxlZE1vbml0b3Jpbmc/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRoaXMgcmVwcmVzZW50cyBhIHNpbmdsZSBFQzIgaW5zdGFuY2VcbiAqL1xuZXhwb3J0IGNsYXNzIEluc3RhbmNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJSW5zdGFuY2Uge1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBPUyB0aGUgaW5zdGFuY2UgaXMgcnVubmluZy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBvc1R5cGU6IE9wZXJhdGluZ1N5c3RlbVR5cGU7XG5cbiAgLyoqXG4gICAqIEFsbG93cyBzcGVjaWZ5IHNlY3VyaXR5IGdyb3VwIGNvbm5lY3Rpb25zIGZvciB0aGUgaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IENvbm5lY3Rpb25zO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHJvbGUgYXNzdW1lZCBieSB0aGUgaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZTogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJpbmNpcGFsIHRvIGdyYW50IHBlcm1pc3Npb25zIHRvXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsO1xuXG4gIC8qKlxuICAgKiBVc2VyRGF0YSBmb3IgdGhlIGluc3RhbmNlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdXNlckRhdGE6IFVzZXJEYXRhO1xuXG4gIC8qKlxuICAgKiB0aGUgdW5kZXJseWluZyBpbnN0YW5jZSByZXNvdXJjZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGluc3RhbmNlOiBDZm5JbnN0YW5jZTtcbiAgLyoqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBpbnN0YW5jZUlkOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VBdmFpbGFiaWxpdHlab25lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VQcml2YXRlRG5zTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGluc3RhbmNlUHJpdmF0ZUlwOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VQdWJsaWNEbnNOYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VQdWJsaWNJcDogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc2VjdXJpdHlHcm91cDogSVNlY3VyaXR5R3JvdXA7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM6IElTZWN1cml0eUdyb3VwW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSW5zdGFuY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAocHJvcHMuaW5pdE9wdGlvbnMgJiYgIXByb3BzLmluaXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2V0dGluZyBcXCdpbml0T3B0aW9uc1xcJyByZXF1aXJlcyB0aGF0IFxcJ2luaXRcXCcgaXMgYWxzbyBzZXQnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cCkge1xuICAgICAgdGhpcy5zZWN1cml0eUdyb3VwID0gcHJvcHMuc2VjdXJpdHlHcm91cDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWN1cml0eUdyb3VwID0gbmV3IFNlY3VyaXR5R3JvdXAodGhpcywgJ0luc3RhbmNlU2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHByb3BzLmFsbG93QWxsT3V0Ym91bmQgIT09IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbnMoeyBzZWN1cml0eUdyb3VwczogW3RoaXMuc2VjdXJpdHlHcm91cF0gfSk7XG4gICAgdGhpcy5zZWN1cml0eUdyb3Vwcy5wdXNoKHRoaXMuc2VjdXJpdHlHcm91cCk7XG4gICAgVGFncy5vZih0aGlzKS5hZGQoTkFNRV9UQUcsIHByb3BzLmluc3RhbmNlTmFtZSB8fCB0aGlzLm5vZGUucGF0aCk7XG5cbiAgICB0aGlzLnJvbGUgPSBwcm9wcy5yb2xlIHx8IG5ldyBpYW0uUm9sZSh0aGlzLCAnSW5zdGFuY2VSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgdGhpcy5ncmFudFByaW5jaXBhbCA9IHRoaXMucm9sZTtcblxuICAgIGNvbnN0IGlhbVByb2ZpbGUgPSBuZXcgaWFtLkNmbkluc3RhbmNlUHJvZmlsZSh0aGlzLCAnSW5zdGFuY2VQcm9maWxlJywge1xuICAgICAgcm9sZXM6IFt0aGlzLnJvbGUucm9sZU5hbWVdLFxuICAgIH0pO1xuXG4gICAgLy8gdXNlIGRlbGF5ZWQgZXZhbHVhdGlvblxuICAgIGNvbnN0IGltYWdlQ29uZmlnID0gcHJvcHMubWFjaGluZUltYWdlLmdldEltYWdlKHRoaXMpO1xuICAgIHRoaXMudXNlckRhdGEgPSBwcm9wcy51c2VyRGF0YSA/PyBpbWFnZUNvbmZpZy51c2VyRGF0YTtcbiAgICBjb25zdCB1c2VyRGF0YVRva2VuID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBGbi5iYXNlNjQodGhpcy51c2VyRGF0YS5yZW5kZXIoKSkgfSk7XG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cHNUb2tlbiA9IExhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMuc2VjdXJpdHlHcm91cHMubWFwKHNnID0+IHNnLnNlY3VyaXR5R3JvdXBJZCkgfSk7XG5cbiAgICBjb25zdCB7IHN1Ym5ldHMgfSA9IHByb3BzLnZwYy5zZWxlY3RTdWJuZXRzKHByb3BzLnZwY1N1Ym5ldHMpO1xuICAgIGxldCBzdWJuZXQ7XG4gICAgaWYgKHByb3BzLmF2YWlsYWJpbGl0eVpvbmUpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gc3VibmV0cy5maWx0ZXIoc24gPT4gc24uYXZhaWxhYmlsaXR5Wm9uZSA9PT0gcHJvcHMuYXZhaWxhYmlsaXR5Wm9uZSk7XG4gICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHN1Ym5ldCA9IHNlbGVjdGVkWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkRXJyb3IoYE5lZWQgZXhhY3RseSAxIHN1Ym5ldCB0byBtYXRjaCBBWiAnJHtwcm9wcy5hdmFpbGFiaWxpdHlab25lfScsIGZvdW5kICR7c2VsZWN0ZWQubGVuZ3RofS4gVXNlIGEgZGlmZmVyZW50IGF2YWlsYWJpbGl0eVpvbmUuYCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdWJuZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3VibmV0ID0gc3VibmV0c1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZEVycm9yKGBEaWQgbm90IGZpbmQgYW55IHN1Ym5ldHMgbWF0Y2hpbmcgJyR7SlNPTi5zdHJpbmdpZnkocHJvcHMudnBjU3VibmV0cyl9JywgcGxlYXNlIHVzZSBhIGRpZmZlcmVudCBzZWxlY3Rpb24uYCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghc3VibmV0KSB7XG4gICAgICAvLyBXZSBnb3QgaGVyZSBhbmQgd2UgZG9uJ3QgaGF2ZSBhIHN1Ym5ldCBiZWNhdXNlIG9mIHZhbGlkYXRpb24gZXJyb3JzLlxuICAgICAgLy8gSW52ZW50IG9uZSBvbiB0aGUgc3BvdCBzbyB0aGUgY29kZSBiZWxvdyBkb2Vzbid0IGZhaWwuXG4gICAgICBzdWJuZXQgPSBTdWJuZXQuZnJvbVN1Ym5ldEF0dHJpYnV0ZXModGhpcywgJ0R1bW15U3VibmV0Jywge1xuICAgICAgICBzdWJuZXRJZDogJ3Mtbm90Zm91bmQnLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAnYXotbm90Zm91bmQnLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBDZm5JbnN0YW5jZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBpbWFnZUlkOiBpbWFnZUNvbmZpZy5pbWFnZUlkLFxuICAgICAga2V5TmFtZTogcHJvcHMua2V5TmFtZSxcbiAgICAgIGluc3RhbmNlVHlwZTogcHJvcHMuaW5zdGFuY2VUeXBlLnRvU3RyaW5nKCksXG4gICAgICBzZWN1cml0eUdyb3VwSWRzOiBzZWN1cml0eUdyb3Vwc1Rva2VuLFxuICAgICAgaWFtSW5zdGFuY2VQcm9maWxlOiBpYW1Qcm9maWxlLnJlZixcbiAgICAgIHVzZXJEYXRhOiB1c2VyRGF0YVRva2VuLFxuICAgICAgc3VibmV0SWQ6IHN1Ym5ldC5zdWJuZXRJZCxcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6IHN1Ym5ldC5hdmFpbGFiaWxpdHlab25lLFxuICAgICAgc291cmNlRGVzdENoZWNrOiBwcm9wcy5zb3VyY2VEZXN0Q2hlY2ssXG4gICAgICBibG9ja0RldmljZU1hcHBpbmdzOiBwcm9wcy5ibG9ja0RldmljZXMgIT09IHVuZGVmaW5lZCA/IGluc3RhbmNlQmxvY2tEZXZpY2VNYXBwaW5ncyh0aGlzLCBwcm9wcy5ibG9ja0RldmljZXMpIDogdW5kZWZpbmVkLFxuICAgICAgcHJpdmF0ZUlwQWRkcmVzczogcHJvcHMucHJpdmF0ZUlwQWRkcmVzcyxcbiAgICAgIHByb3BhZ2F0ZVRhZ3NUb1ZvbHVtZU9uQ3JlYXRpb246IHByb3BzLnByb3BhZ2F0ZVRhZ3NUb1ZvbHVtZU9uQ3JlYXRpb24sXG4gICAgICBtb25pdG9yaW5nOiBwcm9wcy5kZXRhaWxlZE1vbml0b3JpbmcsXG4gICAgfSk7XG4gICAgdGhpcy5pbnN0YW5jZS5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5yb2xlKTtcblxuICAgIHRoaXMub3NUeXBlID0gaW1hZ2VDb25maWcub3NUeXBlO1xuICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSB0aGlzLmluc3RhbmNlO1xuXG4gICAgdGhpcy5pbnN0YW5jZUlkID0gdGhpcy5pbnN0YW5jZS5yZWY7XG4gICAgdGhpcy5pbnN0YW5jZUF2YWlsYWJpbGl0eVpvbmUgPSB0aGlzLmluc3RhbmNlLmF0dHJBdmFpbGFiaWxpdHlab25lO1xuICAgIHRoaXMuaW5zdGFuY2VQcml2YXRlRG5zTmFtZSA9IHRoaXMuaW5zdGFuY2UuYXR0clByaXZhdGVEbnNOYW1lO1xuICAgIHRoaXMuaW5zdGFuY2VQcml2YXRlSXAgPSB0aGlzLmluc3RhbmNlLmF0dHJQcml2YXRlSXA7XG4gICAgdGhpcy5pbnN0YW5jZVB1YmxpY0Ruc05hbWUgPSB0aGlzLmluc3RhbmNlLmF0dHJQdWJsaWNEbnNOYW1lO1xuICAgIHRoaXMuaW5zdGFuY2VQdWJsaWNJcCA9IHRoaXMuaW5zdGFuY2UuYXR0clB1YmxpY0lwO1xuXG4gICAgaWYgKHByb3BzLmluaXQpIHtcbiAgICAgIHRoaXMuYXBwbHlDbG91ZEZvcm1hdGlvbkluaXQocHJvcHMuaW5pdCwgcHJvcHMuaW5pdE9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuYXBwbHlVcGRhdGVQb2xpY2llcyhwcm9wcyk7XG5cbiAgICAvLyBUcmlnZ2VyIHJlcGxhY2VtZW50ICh2aWEgbmV3IGxvZ2ljYWwgSUQpIG9uIHVzZXIgZGF0YSBjaGFuZ2UsIGlmIHNwZWNpZmllZCBvciBjZm4taW5pdCBpcyBiZWluZyB1c2VkLlxuICAgIC8vXG4gICAgLy8gVGhpcyBpcyBzbGlnaHRseSB0cmlja3kgLS0gd2UgbmVlZCB0byByZXNvbHZlIHRoZSBVc2VyRGF0YSBzdHJpbmcgKGluIG9yZGVyIHRvIGdldCBhdCBhY3R1YWwgQXNzZXQgaGFzaGVzLFxuICAgIC8vIGluc3RlYWQgb2YgdGhlIFRva2VuIHN0cmluZ2lmaWNhdGlvbnMgb2YgdGhlbSAoJyR7VG9rZW5bMTIzNF19JykuIEhvd2V2ZXIsIGluIHRoZSBjYXNlIG9mIENGTiBJbml0IHVzYWdlLFxuICAgIC8vIGEgVXNlckRhdGEgaXMgZ29pbmcgdG8gY29udGFpbiB0aGUgbG9naWNhbElEIG9mIHRoZSByZXNvdXJjZSBpdHNlbGYsIHdoaWNoIG1lYW5zIGluZmluaXRlIHJlY3Vyc2lvbiBpZiB3ZVxuICAgIC8vIHRyeSB0byBuYWl2ZWx5IHJlc29sdmUuIFdlIG5lZWQgYSByZWN1cnNpb24gYnJlYWtlciBpbiB0aGlzLlxuICAgIGNvbnN0IG9yaWdpbmFsTG9naWNhbElkID0gU3RhY2sub2YodGhpcykuZ2V0TG9naWNhbElkKHRoaXMuaW5zdGFuY2UpO1xuICAgIGxldCByZWN1cnNpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmluc3RhbmNlLm92ZXJyaWRlTG9naWNhbElkKExhenkudW5jYWNoZWRTdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKGNvbnRleHQpID0+IHtcbiAgICAgICAgaWYgKHJlY3Vyc2luZykgeyByZXR1cm4gb3JpZ2luYWxMb2dpY2FsSWQ7IH1cbiAgICAgICAgaWYgKCEocHJvcHMudXNlckRhdGFDYXVzZXNSZXBsYWNlbWVudCA/PyBwcm9wcy5pbml0T3B0aW9ucykpIHsgcmV0dXJuIG9yaWdpbmFsTG9naWNhbElkOyB9XG5cbiAgICAgICAgY29uc3QgZnJhZ21lbnRzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICAgICAgcmVjdXJzaW5nID0gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmcmFnbWVudHMucHVzaChKU09OLnN0cmluZ2lmeShjb250ZXh0LnJlc29sdmUodGhpcy51c2VyRGF0YS5yZW5kZXIoKSkpKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICByZWN1cnNpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaWdlc3QgPSBtZDVoYXNoKGZyYWdtZW50cy5qb2luKCcnKSkuc2xpY2UoMCwgMTYpO1xuICAgICAgICByZXR1cm4gYCR7b3JpZ2luYWxMb2dpY2FsSWR9JHtkaWdlc3R9YDtcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgaWYgKHByb3BzLnJlcXVpcmVJbWRzdjIpIHtcbiAgICAgIEFzcGVjdHMub2YodGhpcykuYWRkKG5ldyBJbnN0YW5jZVJlcXVpcmVJbWRzdjJBc3BlY3QoKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgc2VjdXJpdHkgZ3JvdXAgdG8gdGhlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gc2VjdXJpdHlHcm91cDogVGhlIHNlY3VyaXR5IGdyb3VwIHRvIGFkZFxuICAgKi9cbiAgcHVibGljIGFkZFNlY3VyaXR5R3JvdXAoc2VjdXJpdHlHcm91cDogSVNlY3VyaXR5R3JvdXApOiB2b2lkIHtcbiAgICB0aGlzLnNlY3VyaXR5R3JvdXBzLnB1c2goc2VjdXJpdHlHcm91cCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGNvbW1hbmQgdG8gdGhlIHN0YXJ0dXAgc2NyaXB0IG9mIHRoZSBpbnN0YW5jZS5cbiAgICogVGhlIGNvbW1hbmQgbXVzdCBiZSBpbiB0aGUgc2NyaXB0aW5nIGxhbmd1YWdlIHN1cHBvcnRlZCBieSB0aGUgaW5zdGFuY2UncyBPUyAoaS5lLiBMaW51eC9XaW5kb3dzKS5cbiAgICovXG4gIHB1YmxpYyBhZGRVc2VyRGF0YSguLi5jb21tYW5kczogc3RyaW5nW10pIHtcbiAgICB0aGlzLnVzZXJEYXRhLmFkZENvbW1hbmRzKC4uLmNvbW1hbmRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc3RhdGVtZW50IHRvIHRoZSBJQU0gcm9sZSBhc3N1bWVkIGJ5IHRoZSBpbnN0YW5jZS5cbiAgICovXG4gIHB1YmxpYyBhZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgdGhpcy5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgQ2xvdWRGb3JtYXRpb24gSW5pdCBjb25maWd1cmF0aW9uIGF0IGluc3RhbmNlIHN0YXJ0dXBcbiAgICpcbiAgICogVGhpcyBkb2VzIHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIC0gQXR0YWNoZXMgdGhlIENsb3VkRm9ybWF0aW9uIEluaXQgbWV0YWRhdGEgdG8gdGhlIEluc3RhbmNlIHJlc291cmNlLlxuICAgKiAtIEFkZCBjb21tYW5kcyB0byB0aGUgaW5zdGFuY2UgVXNlckRhdGEgdG8gcnVuIGBjZm4taW5pdGAgYW5kIGBjZm4tc2lnbmFsYC5cbiAgICogLSBVcGRhdGUgdGhlIGluc3RhbmNlJ3MgQ3JlYXRpb25Qb2xpY3kgdG8gd2FpdCBmb3IgdGhlIGBjZm4tc2lnbmFsYCBjb21tYW5kcy5cbiAgICovXG4gIHByaXZhdGUgYXBwbHlDbG91ZEZvcm1hdGlvbkluaXQoaW5pdDogQ2xvdWRGb3JtYXRpb25Jbml0LCBvcHRpb25zOiBBcHBseUNsb3VkRm9ybWF0aW9uSW5pdE9wdGlvbnMgPSB7fSkge1xuICAgIGluaXQuYXR0YWNoKHRoaXMuaW5zdGFuY2UsIHtcbiAgICAgIHBsYXRmb3JtOiB0aGlzLm9zVHlwZSxcbiAgICAgIGluc3RhbmNlUm9sZTogdGhpcy5yb2xlLFxuICAgICAgdXNlckRhdGE6IHRoaXMudXNlckRhdGEsXG4gICAgICBjb25maWdTZXRzOiBvcHRpb25zLmNvbmZpZ1NldHMsXG4gICAgICBlbWJlZEZpbmdlcnByaW50OiBvcHRpb25zLmVtYmVkRmluZ2VycHJpbnQsXG4gICAgICBwcmludExvZzogb3B0aW9ucy5wcmludExvZyxcbiAgICAgIGlnbm9yZUZhaWx1cmVzOiBvcHRpb25zLmlnbm9yZUZhaWx1cmVzLFxuICAgICAgaW5jbHVkZVJvbGU6IG9wdGlvbnMuaW5jbHVkZVJvbGUsXG4gICAgICBpbmNsdWRlVXJsOiBvcHRpb25zLmluY2x1ZGVVcmwsXG4gICAgfSk7XG4gICAgdGhpcy53YWl0Rm9yUmVzb3VyY2VTaWduYWwob3B0aW9ucy50aW1lb3V0ID8/IER1cmF0aW9uLm1pbnV0ZXMoNSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXQgZm9yIGEgc2luZ2xlIGFkZGl0aW9uYWwgcmVzb3VyY2Ugc2lnbmFsXG4gICAqXG4gICAqIEFkZCAxIHRvIHRoZSBjdXJyZW50IFJlc291cmNlU2lnbmFsIENvdW50IGFuZCBhZGQgdGhlIGdpdmVuIHRpbWVvdXQgdG8gdGhlIGN1cnJlbnQgdGltZW91dC5cbiAgICpcbiAgICogVXNlIHRoaXMgdG8gcGF1c2UgdGhlIENsb3VkRm9ybWF0aW9uIGRlcGxveW1lbnQgdG8gd2FpdCBmb3IgdGhlIGluc3RhbmNlc1xuICAgKiBpbiB0aGUgQXV0b1NjYWxpbmdHcm91cCB0byByZXBvcnQgc3VjY2Vzc2Z1bCBzdGFydHVwIGR1cmluZ1xuICAgKiBjcmVhdGlvbiBhbmQgdXBkYXRlcy4gVGhlIFVzZXJEYXRhIHNjcmlwdCBuZWVkcyB0byBpbnZva2UgYGNmbi1zaWduYWxgXG4gICAqIHdpdGggYSBzdWNjZXNzIG9yIGZhaWx1cmUgY29kZSBhZnRlciBpdCBpcyBkb25lIHNldHRpbmcgdXAgdGhlIGluc3RhbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSB3YWl0Rm9yUmVzb3VyY2VTaWduYWwodGltZW91dDogRHVyYXRpb24pIHtcbiAgICBjb25zdCBvbGRSZXNvdXJjZVNpZ25hbCA9IHRoaXMuaW5zdGFuY2UuY2ZuT3B0aW9ucy5jcmVhdGlvblBvbGljeT8ucmVzb3VyY2VTaWduYWw7XG4gICAgdGhpcy5pbnN0YW5jZS5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5ID0ge1xuICAgICAgLi4udGhpcy5pbnN0YW5jZS5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5LFxuICAgICAgcmVzb3VyY2VTaWduYWw6IHtcbiAgICAgICAgY291bnQ6IChvbGRSZXNvdXJjZVNpZ25hbD8uY291bnQgPz8gMCkgKyAxLFxuICAgICAgICB0aW1lb3V0OiAob2xkUmVzb3VyY2VTaWduYWw/LnRpbWVvdXQgPyBEdXJhdGlvbi5wYXJzZShvbGRSZXNvdXJjZVNpZ25hbD8udGltZW91dCkucGx1cyh0aW1lb3V0KSA6IHRpbWVvdXQpLnRvSXNvU3RyaW5nKCksXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgQ2xvdWRGb3JtYXRpb24gdXBkYXRlIHBvbGljaWVzIGZvciB0aGUgaW5zdGFuY2VcbiAgICovXG4gIHByaXZhdGUgYXBwbHlVcGRhdGVQb2xpY2llcyhwcm9wczogSW5zdGFuY2VQcm9wcykge1xuICAgIGlmIChwcm9wcy5yZXNvdXJjZVNpZ25hbFRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5ID0ge1xuICAgICAgICAuLi50aGlzLmluc3RhbmNlLmNmbk9wdGlvbnMuY3JlYXRpb25Qb2xpY3ksXG4gICAgICAgIHJlc291cmNlU2lnbmFsOiB7XG4gICAgICAgICAgdGltZW91dDogcHJvcHMucmVzb3VyY2VTaWduYWxUaW1lb3V0ICYmIHByb3BzLnJlc291cmNlU2lnbmFsVGltZW91dC50b0lzb1N0cmluZygpLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhcHBseWluZyBDbG91ZEZvcm1hdGlvbiBpbml0IHRvIGFuIGluc3RhbmNlIG9yIGluc3RhbmNlIGdyb3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBwbHlDbG91ZEZvcm1hdGlvbkluaXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIENvbmZpZ1NldCB0byBhY3RpdmF0ZVxuICAgKlxuICAgKiBAZGVmYXVsdCBbJ2RlZmF1bHQnXVxuICAgKi9cbiAgcmVhZG9ubHkgY29uZmlnU2V0cz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaW1lb3V0IHdhaXRpbmcgZm9yIHRoZSBjb25maWd1cmF0aW9uIHRvIGJlIGFwcGxpZWRcbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg1KVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBGb3JjZSBpbnN0YW5jZSByZXBsYWNlbWVudCBieSBlbWJlZGRpbmcgYSBjb25maWcgZmluZ2VycHJpbnRcbiAgICpcbiAgICogSWYgYHRydWVgICh0aGUgZGVmYXVsdCksIGEgaGFzaCBvZiB0aGUgY29uZmlnIHdpbGwgYmUgZW1iZWRkZWQgaW50byB0aGVcbiAgICogVXNlckRhdGEsIHNvIHRoYXQgaWYgdGhlIGNvbmZpZyBjaGFuZ2VzLCB0aGUgVXNlckRhdGEgY2hhbmdlcy5cbiAgICpcbiAgICogLSBJZiB0aGUgRUMyIGluc3RhbmNlIGlzIGluc3RhbmNlLXN0b3JlIGJhY2tlZCBvclxuICAgKiAgIGB1c2VyRGF0YUNhdXNlc1JlcGxhY2VtZW50YCBpcyBzZXQsIHRoaXMgd2lsbCBjYXVzZSB0aGUgaW5zdGFuY2UgdG8gYmVcbiAgICogICByZXBsYWNlZCBhbmQgdGhlIG5ldyBjb25maWd1cmF0aW9uIHRvIGJlIGFwcGxpZWQuXG4gICAqIC0gSWYgdGhlIGluc3RhbmNlIGlzIEVCUy1iYWNrZWQgYW5kIGB1c2VyRGF0YUNhdXNlc1JlcGxhY2VtZW50YCBpcyBub3RcbiAgICogICBzZXQsIHRoZSBjaGFuZ2Ugb2YgVXNlckRhdGEgd2lsbCBtYWtlIHRoZSBpbnN0YW5jZSByZXN0YXJ0IGJ1dCBub3QgYmVcbiAgICogICByZXBsYWNlZCwgYW5kIHRoZSBjb25maWd1cmF0aW9uIHdpbGwgbm90IGJlIGFwcGxpZWQgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogSWYgYGZhbHNlYCwgbm8gaGFzaCB3aWxsIGJlIGVtYmVkZGVkLCBhbmQgaWYgdGhlIENsb3VkRm9ybWF0aW9uIEluaXRcbiAgICogY29uZmlnIGNoYW5nZXMgbm90aGluZyB3aWxsIGhhcHBlbiB0byB0aGUgcnVubmluZyBpbnN0YW5jZS4gSWYgYVxuICAgKiBjb25maWcgdXBkYXRlIGludHJvZHVjZXMgZXJyb3JzLCB5b3Ugd2lsbCBub3Qgbm90aWNlIHVudGlsIGFmdGVyIHRoZVxuICAgKiBDbG91ZEZvcm1hdGlvbiBkZXBsb3ltZW50IHN1Y2Nlc3NmdWxseSBmaW5pc2hlcyBhbmQgdGhlIG5leHQgaW5zdGFuY2VcbiAgICogZmFpbHMgdG8gbGF1bmNoLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBlbWJlZEZpbmdlcnByaW50PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogUHJpbnQgdGhlIHJlc3VsdHMgb2YgcnVubmluZyBjZm4taW5pdCB0byB0aGUgSW5zdGFuY2UgU3lzdGVtIExvZ1xuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgb3V0cHV0IG9mIHJ1bm5pbmcgY2ZuLWluaXQgaXMgd3JpdHRlbiB0byBhIGxvZyBmaWxlXG4gICAqIG9uIHRoZSBpbnN0YW5jZS4gU2V0IHRoaXMgdG8gYHRydWVgIHRvIHByaW50IGl0IHRvIHRoZSBTeXN0ZW0gTG9nXG4gICAqICh2aXNpYmxlIGZyb20gdGhlIEVDMiBDb25zb2xlKSwgYGZhbHNlYCB0byBub3QgcHJpbnQgaXQuXG4gICAqXG4gICAqIChCZSBhd2FyZSB0aGF0IHRoZSBzeXN0ZW0gbG9nIGlzIHJlZnJlc2hlZCBhdCBjZXJ0YWluIHBvaW50cyBpblxuICAgKiB0aW1lIG9mIHRoZSBpbnN0YW5jZSBsaWZlIGN5Y2xlLCBhbmQgc3VjY2Vzc2Z1bCBleGVjdXRpb24gbWF5XG4gICAqIG5vdCBhbHdheXMgc2hvdyB1cCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHByaW50TG9nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRG9uJ3QgZmFpbCB0aGUgaW5zdGFuY2UgY3JlYXRpb24gd2hlbiBjZm4taW5pdCBmYWlsc1xuICAgKlxuICAgKiBZb3UgY2FuIHVzZSB0aGlzIHRvIHByZXZlbnQgQ2xvdWRGb3JtYXRpb24gZnJvbSByb2xsaW5nIGJhY2sgd2hlblxuICAgKiBpbnN0YW5jZXMgZmFpbCB0byBzdGFydCB1cCwgdG8gaGVscCBpbiBkZWJ1Z2dpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpZ25vcmVGYWlsdXJlcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluY2x1ZGUgLS11cmwgYXJndW1lbnQgd2hlbiBydW5uaW5nIGNmbi1pbml0IGFuZCBjZm4tc2lnbmFsIGNvbW1hbmRzXG4gICAqXG4gICAqIFRoaXMgd2lsbCBiZSB0aGUgY2xvdWRmb3JtYXRpb24gZW5kcG9pbnQgaW4gdGhlIGRlcGxveWVkIHJlZ2lvblxuICAgKiBlLmcuIGh0dHBzOi8vY2xvdWRmb3JtYXRpb24udXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGluY2x1ZGVVcmw/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbmNsdWRlIC0tcm9sZSBhcmd1bWVudCB3aGVuIHJ1bm5pbmcgY2ZuLWluaXQgYW5kIGNmbi1zaWduYWwgY29tbWFuZHNcbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIHRoZSBJQU0gaW5zdGFuY2UgcHJvZmlsZSBhdHRhY2hlZCB0byB0aGUgRUMyIGluc3RhbmNlXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlUm9sZT86IGJvb2xlYW47XG59XG4iXX0=