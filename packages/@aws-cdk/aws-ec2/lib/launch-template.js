"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaunchTemplate = exports.LaunchTemplateSpecialVersions = exports.LaunchTemplateHttpTokens = exports.SpotRequestType = exports.SpotInstanceInterruption = exports.InstanceInitiatedShutdownBehavior = exports.CpuCredits = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const connections_1 = require("./connections");
const ec2_generated_1 = require("./ec2.generated");
const ebs_util_1 = require("./private/ebs-util");
/**
 * Name tag constant
 */
const NAME_TAG = 'Name';
/**
 * Provides the options for specifying the CPU credit type for burstable EC2 instance types (T2, T3, T3a, etc).
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-how-to.html
 */
// dev-note: This could be used in the Instance L2
var CpuCredits;
(function (CpuCredits) {
    /**
     * Standard bursting mode.
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-standard-mode.html
     */
    CpuCredits["STANDARD"] = "standard";
    /**
     * Unlimited bursting mode.
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-unlimited-mode.html
     */
    CpuCredits["UNLIMITED"] = "unlimited";
})(CpuCredits = exports.CpuCredits || (exports.CpuCredits = {}));
;
/**
 * Provides the options for specifying the instance initiated shutdown behavior.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html#Using_ChangingInstanceInitiatedShutdownBehavior
 */
// dev-note: This could be used in the Instance L2
var InstanceInitiatedShutdownBehavior;
(function (InstanceInitiatedShutdownBehavior) {
    /**
     * The instance will stop when it initiates a shutdown.
     */
    InstanceInitiatedShutdownBehavior["STOP"] = "stop";
    /**
     * The instance will be terminated when it initiates a shutdown.
     */
    InstanceInitiatedShutdownBehavior["TERMINATE"] = "terminate";
})(InstanceInitiatedShutdownBehavior = exports.InstanceInitiatedShutdownBehavior || (exports.InstanceInitiatedShutdownBehavior = {}));
;
/**
 * Provides the options for the types of interruption for spot instances.
 */
// dev-note: This could be used in a SpotFleet L2 if one gets developed.
var SpotInstanceInterruption;
(function (SpotInstanceInterruption) {
    /**
     * The instance will stop when interrupted.
     */
    SpotInstanceInterruption["STOP"] = "stop";
    /**
     * The instance will be terminated when interrupted.
     */
    SpotInstanceInterruption["TERMINATE"] = "terminate";
    /**
     * The instance will hibernate when interrupted.
     */
    SpotInstanceInterruption["HIBERNATE"] = "hibernate";
})(SpotInstanceInterruption = exports.SpotInstanceInterruption || (exports.SpotInstanceInterruption = {}));
/**
 * The Spot Instance request type.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html
 */
var SpotRequestType;
(function (SpotRequestType) {
    /**
     * A one-time Spot Instance request remains active until Amazon EC2 launches the Spot Instance,
     * the request expires, or you cancel the request. If the Spot price exceeds your maximum price
     * or capacity is not available, your Spot Instance is terminated and the Spot Instance request
     * is closed.
     */
    SpotRequestType["ONE_TIME"] = "one-time";
    /**
     * A persistent Spot Instance request remains active until it expires or you cancel it, even if
     * the request is fulfilled. If the Spot price exceeds your maximum price or capacity is not available,
     * your Spot Instance is interrupted. After your instance is interrupted, when your maximum price exceeds
     * the Spot price or capacity becomes available again, the Spot Instance is started if stopped or resumed
     * if hibernated.
     */
    SpotRequestType["PERSISTENT"] = "persistent";
})(SpotRequestType = exports.SpotRequestType || (exports.SpotRequestType = {}));
;
/**
 * The state of token usage for your instance metadata requests.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-httptokens
 */
var LaunchTemplateHttpTokens;
(function (LaunchTemplateHttpTokens) {
    /**
     * If the state is optional, you can choose to retrieve instance metadata with or without a signed token header on your request.
     */
    LaunchTemplateHttpTokens["OPTIONAL"] = "optional";
    /**
     * If the state is required, you must send a signed token header with any instance metadata retrieval requests. In this state,
     * retrieving the IAM role credentials always returns the version 2.0 credentials; the version 1.0 credentials are not available.
     */
    LaunchTemplateHttpTokens["REQUIRED"] = "required";
})(LaunchTemplateHttpTokens = exports.LaunchTemplateHttpTokens || (exports.LaunchTemplateHttpTokens = {}));
/**
 * A class that provides convenient access to special version tokens for LaunchTemplate
 * versions.
 */
class LaunchTemplateSpecialVersions {
}
_a = JSII_RTTI_SYMBOL_1;
LaunchTemplateSpecialVersions[_a] = { fqn: "@aws-cdk/aws-ec2.LaunchTemplateSpecialVersions", version: "0.0.0" };
/**
 * The special value that denotes that users of a Launch Template should
 * reference the LATEST version of the template.
 */
LaunchTemplateSpecialVersions.LATEST_VERSION = '$Latest';
/**
 * The special value that denotes that users of a Launch Template should
 * reference the DEFAULT version of the template.
 */
LaunchTemplateSpecialVersions.DEFAULT_VERSION = '$Default';
exports.LaunchTemplateSpecialVersions = LaunchTemplateSpecialVersions;
/**
 * This represents an EC2 LaunchTemplate.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html
 */
class LaunchTemplate extends core_1.Resource {
    /**
     * Import an existing LaunchTemplate.
     */
    static fromLaunchTemplateAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_LaunchTemplateAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLaunchTemplateAttributes);
            }
            throw error;
        }
        const haveId = Boolean(attrs.launchTemplateId);
        const haveName = Boolean(attrs.launchTemplateName);
        if (haveId == haveName) {
            throw new Error('LaunchTemplate.fromLaunchTemplateAttributes() requires exactly one of launchTemplateId or launchTemplateName be provided.');
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.versionNumber = attrs.versionNumber ?? LaunchTemplateSpecialVersions.DEFAULT_VERSION;
                this.launchTemplateId = attrs.launchTemplateId;
                this.launchTemplateName = attrs.launchTemplateName;
            }
        }
        return new Import(scope, id);
    }
    // =============================================
    constructor(scope, id, props = {}) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_LaunchTemplateProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LaunchTemplate);
            }
            throw error;
        }
        // Basic validation of the provided spot block duration
        const spotDuration = props?.spotOptions?.blockDuration?.toHours({ integral: true });
        if (spotDuration !== undefined && (spotDuration < 1 || spotDuration > 6)) {
            // See: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html#fixed-duration-spot-instances
            core_1.Annotations.of(this).addError('Spot block duration must be exactly 1, 2, 3, 4, 5, or 6 hours.');
        }
        // Basic validation of the provided httpPutResponseHopLimit
        if (props.httpPutResponseHopLimit !== undefined && (props.httpPutResponseHopLimit < 1 || props.httpPutResponseHopLimit > 64)) {
            // See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-httpputresponsehoplimit
            core_1.Annotations.of(this).addError('HttpPutResponseHopLimit must between 1 and 64');
        }
        this.role = props.role;
        this._grantPrincipal = this.role;
        const iamProfile = this.role ? new iam.CfnInstanceProfile(this, 'Profile', {
            roles: [this.role.roleName],
        }) : undefined;
        if (props.securityGroup) {
            this._connections = new connections_1.Connections({ securityGroups: [props.securityGroup] });
        }
        const securityGroupsToken = core_1.Lazy.list({
            produce: () => {
                if (this._connections && this._connections.securityGroups.length > 0) {
                    return this._connections.securityGroups.map(sg => sg.securityGroupId);
                }
                return undefined;
            },
        });
        const imageConfig = props.machineImage?.getImage(this);
        if (imageConfig) {
            this.osType = imageConfig.osType;
            this.imageId = imageConfig.imageId;
        }
        if (core_1.FeatureFlags.of(this).isEnabled(cxapi.EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA)) {
            // priority: prop.userData -> userData from machineImage -> undefined
            this.userData = props.userData ?? imageConfig?.userData;
        }
        else {
            if (props.userData) {
                this.userData = props.userData;
            }
        }
        const userDataToken = core_1.Lazy.string({
            produce: () => {
                if (this.userData) {
                    return core_1.Fn.base64(this.userData.render());
                }
                return undefined;
            },
        });
        this.instanceType = props.instanceType;
        let marketOptions = undefined;
        if (props?.spotOptions) {
            marketOptions = {
                marketType: 'spot',
                spotOptions: {
                    blockDurationMinutes: spotDuration !== undefined ? spotDuration * 60 : undefined,
                    instanceInterruptionBehavior: props.spotOptions.interruptionBehavior,
                    maxPrice: props.spotOptions.maxPrice?.toString(),
                    spotInstanceType: props.spotOptions.requestType,
                    validUntil: props.spotOptions.validUntil?.date.toUTCString(),
                },
            };
            // Remove SpotOptions if there are none.
            if (Object.keys(marketOptions.spotOptions).filter(k => marketOptions.spotOptions[k]).length == 0) {
                marketOptions.spotOptions = undefined;
            }
        }
        this.tags = new core_1.TagManager(core_1.TagType.KEY_VALUE, 'AWS::EC2::LaunchTemplate');
        const tagsToken = core_1.Lazy.any({
            produce: () => {
                if (this.tags.hasTags()) {
                    const renderedTags = this.tags.renderTags();
                    const lowerCaseRenderedTags = renderedTags.map((tag) => {
                        return {
                            key: tag.Key,
                            value: tag.Value,
                        };
                    });
                    return [
                        {
                            resourceType: 'instance',
                            tags: lowerCaseRenderedTags,
                        },
                        {
                            resourceType: 'volume',
                            tags: lowerCaseRenderedTags,
                        },
                    ];
                }
                return undefined;
            },
        });
        const ltTagsToken = core_1.Lazy.any({
            produce: () => {
                if (this.tags.hasTags()) {
                    const renderedTags = this.tags.renderTags();
                    const lowerCaseRenderedTags = renderedTags.map((tag) => {
                        return {
                            key: tag.Key,
                            value: tag.Value,
                        };
                    });
                    return [
                        {
                            resourceType: 'launch-template',
                            tags: lowerCaseRenderedTags,
                        },
                    ];
                }
                return undefined;
            },
        });
        const resource = new ec2_generated_1.CfnLaunchTemplate(this, 'Resource', {
            launchTemplateName: props?.launchTemplateName,
            launchTemplateData: {
                blockDeviceMappings: props?.blockDevices !== undefined ? (0, ebs_util_1.launchTemplateBlockDeviceMappings)(this, props.blockDevices) : undefined,
                creditSpecification: props?.cpuCredits !== undefined ? {
                    cpuCredits: props.cpuCredits,
                } : undefined,
                disableApiTermination: props?.disableApiTermination,
                ebsOptimized: props?.ebsOptimized,
                enclaveOptions: props?.nitroEnclaveEnabled !== undefined ? {
                    enabled: props.nitroEnclaveEnabled,
                } : undefined,
                hibernationOptions: props?.hibernationConfigured !== undefined ? {
                    configured: props.hibernationConfigured,
                } : undefined,
                iamInstanceProfile: iamProfile !== undefined ? {
                    arn: iamProfile.getAtt('Arn').toString(),
                } : undefined,
                imageId: imageConfig?.imageId,
                instanceType: props?.instanceType?.toString(),
                instanceInitiatedShutdownBehavior: props?.instanceInitiatedShutdownBehavior,
                instanceMarketOptions: marketOptions,
                keyName: props?.keyName,
                monitoring: props?.detailedMonitoring !== undefined ? {
                    enabled: props.detailedMonitoring,
                } : undefined,
                securityGroupIds: securityGroupsToken,
                tagSpecifications: tagsToken,
                userData: userDataToken,
                metadataOptions: this.renderMetadataOptions(props),
                // Fields not yet implemented:
                // ==========================
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-capacityreservationspecification.html
                // Will require creating an L2 for AWS::EC2::CapacityReservation
                // capacityReservationSpecification: undefined,
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-cpuoptions.html
                // cpuOptions: undefined,
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-elasticgpuspecification.html
                // elasticGpuSpecifications: undefined,
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-elasticinferenceaccelerators
                // elasticInferenceAccelerators: undefined,
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-kernelid
                // kernelId: undefined,
                // ramDiskId: undefined,
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-licensespecifications
                // Also not implemented in Instance L2
                // licenseSpecifications: undefined,
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-tagspecifications
                // Should be implemented via the Tagging aspect in CDK core. Complication will be that this tagging interface is very unique to LaunchTemplates.
                // tagSpecification: undefined
                // CDK has no abstraction for Network Interfaces yet.
                // networkInterfaces: undefined,
                // CDK has no abstraction for Placement yet.
                // placement: undefined,
            },
            tagSpecifications: ltTagsToken,
        });
        core_1.Tags.of(this).add(NAME_TAG, this.node.path);
        this.defaultVersionNumber = resource.attrDefaultVersionNumber;
        this.latestVersionNumber = resource.attrLatestVersionNumber;
        this.launchTemplateId = resource.ref;
        this.versionNumber = core_1.Token.asString(resource.getAtt('LatestVersionNumber'));
    }
    renderMetadataOptions(props) {
        let requireMetadataOptions = false;
        // if requireImdsv2 is true, httpTokens must be required.
        if (props.requireImdsv2 === true && props.httpTokens === LaunchTemplateHttpTokens.OPTIONAL) {
            core_1.Annotations.of(this).addError('httpTokens must be required when requireImdsv2 is true');
        }
        if (props.httpEndpoint !== undefined || props.httpProtocolIpv6 !== undefined || props.httpPutResponseHopLimit !== undefined ||
            props.httpTokens !== undefined || props.instanceMetadataTags !== undefined || props.requireImdsv2 === true) {
            requireMetadataOptions = true;
        }
        if (requireMetadataOptions) {
            return {
                httpEndpoint: props.httpEndpoint === true ? 'enabled' :
                    props.httpEndpoint === false ? 'disabled' : undefined,
                httpProtocolIpv6: props.httpProtocolIpv6 === true ? 'enabled' :
                    props.httpProtocolIpv6 === false ? 'disabled' : undefined,
                httpPutResponseHopLimit: props.httpPutResponseHopLimit,
                httpTokens: props.requireImdsv2 === true ? LaunchTemplateHttpTokens.REQUIRED : props.httpTokens,
                instanceMetadataTags: props.instanceMetadataTags === true ? 'enabled' :
                    props.instanceMetadataTags === false ? 'disabled' : undefined,
            };
        }
        else {
            return undefined;
        }
    }
    /**
     * Allows specifying security group connections for the instance.
     *
     * @note Only available if you provide a securityGroup when constructing the LaunchTemplate.
     */
    get connections() {
        if (!this._connections) {
            throw new Error('LaunchTemplate can only be used as IConnectable if a securityGroup is provided when constructing it.');
        }
        return this._connections;
    }
    /**
     * Principal to grant permissions to.
     *
     * @note Only available if you provide a role when constructing the LaunchTemplate.
     */
    get grantPrincipal() {
        if (!this._grantPrincipal) {
            throw new Error('LaunchTemplate can only be used as IGrantable if a role is provided when constructing it.');
        }
        return this._grantPrincipal;
    }
}
_b = JSII_RTTI_SYMBOL_1;
LaunchTemplate[_b] = { fqn: "@aws-cdk/aws-ec2.LaunchTemplate", version: "0.0.0" };
exports.LaunchTemplate = LaunchTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF1bmNoLXRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF1bmNoLXRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUV4Qyx3Q0FhdUI7QUFDdkIseUNBQXlDO0FBRXpDLCtDQUEwRDtBQUMxRCxtREFBb0Q7QUFHcEQsaURBQXVFO0FBS3ZFOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDO0FBRWhDOzs7O0dBSUc7QUFDSCxrREFBa0Q7QUFDbEQsSUFBWSxVQVlYO0FBWkQsV0FBWSxVQUFVO0lBQ3BCOzs7T0FHRztJQUNILG1DQUFxQixDQUFBO0lBRXJCOzs7T0FHRztJQUNILHFDQUF1QixDQUFBO0FBQ3pCLENBQUMsRUFaVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQVlyQjtBQUFBLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsa0RBQWtEO0FBQ2xELElBQVksaUNBVVg7QUFWRCxXQUFZLGlDQUFpQztJQUMzQzs7T0FFRztJQUNILGtEQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILDREQUF1QixDQUFBO0FBQ3pCLENBQUMsRUFWVyxpQ0FBaUMsR0FBakMseUNBQWlDLEtBQWpDLHlDQUFpQyxRQVU1QztBQUFBLENBQUM7QUFnQ0Y7O0dBRUc7QUFDSCx3RUFBd0U7QUFDeEUsSUFBWSx3QkFlWDtBQWZELFdBQVksd0JBQXdCO0lBQ2xDOztPQUVHO0lBQ0gseUNBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsbURBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCxtREFBdUIsQ0FBQTtBQUN6QixDQUFDLEVBZlcsd0JBQXdCLEdBQXhCLGdDQUF3QixLQUF4QixnQ0FBd0IsUUFlbkM7QUFFRDs7OztHQUlHO0FBQ0gsSUFBWSxlQWlCWDtBQWpCRCxXQUFZLGVBQWU7SUFDekI7Ozs7O09BS0c7SUFDSCx3Q0FBcUIsQ0FBQTtJQUVyQjs7Ozs7O09BTUc7SUFDSCw0Q0FBeUIsQ0FB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dCB7XG4gIEFubm90YXRpb25zLFxuICBEdXJhdGlvbixcbiAgRXhwaXJhdGlvbixcbiAgRm4sXG4gIElSZXNvdXJjZSxcbiAgTGF6eSxcbiAgUmVzb3VyY2UsXG4gIFRhZ01hbmFnZXIsXG4gIFRhZ1R5cGUsXG4gIFRhZ3MsXG4gIFRva2VuLFxuICBGZWF0dXJlRmxhZ3MsXG59IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29ubmVjdGlvbnMsIElDb25uZWN0YWJsZSB9IGZyb20gJy4vY29ubmVjdGlvbnMnO1xuaW1wb3J0IHsgQ2ZuTGF1bmNoVGVtcGxhdGUgfSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSW5zdGFuY2VUeXBlIH0gZnJvbSAnLi9pbnN0YW5jZS10eXBlcyc7XG5pbXBvcnQgeyBJTWFjaGluZUltYWdlLCBNYWNoaW5lSW1hZ2VDb25maWcsIE9wZXJhdGluZ1N5c3RlbVR5cGUgfSBmcm9tICcuL21hY2hpbmUtaW1hZ2UnO1xuaW1wb3J0IHsgbGF1bmNoVGVtcGxhdGVCbG9ja0RldmljZU1hcHBpbmdzIH0gZnJvbSAnLi9wcml2YXRlL2Vicy11dGlsJztcbmltcG9ydCB7IElTZWN1cml0eUdyb3VwIH0gZnJvbSAnLi9zZWN1cml0eS1ncm91cCc7XG5pbXBvcnQgeyBVc2VyRGF0YSB9IGZyb20gJy4vdXNlci1kYXRhJztcbmltcG9ydCB7IEJsb2NrRGV2aWNlIH0gZnJvbSAnLi92b2x1bWUnO1xuXG4vKipcbiAqIE5hbWUgdGFnIGNvbnN0YW50XG4gKi9cbmNvbnN0IE5BTUVfVEFHOiBzdHJpbmcgPSAnTmFtZSc7XG5cbi8qKlxuICogUHJvdmlkZXMgdGhlIG9wdGlvbnMgZm9yIHNwZWNpZnlpbmcgdGhlIENQVSBjcmVkaXQgdHlwZSBmb3IgYnVyc3RhYmxlIEVDMiBpbnN0YW5jZSB0eXBlcyAoVDIsIFQzLCBUM2EsIGV0YykuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvYnVyc3RhYmxlLXBlcmZvcm1hbmNlLWluc3RhbmNlcy1ob3ctdG8uaHRtbFxuICovXG4vLyBkZXYtbm90ZTogVGhpcyBjb3VsZCBiZSB1c2VkIGluIHRoZSBJbnN0YW5jZSBMMlxuZXhwb3J0IGVudW0gQ3B1Q3JlZGl0cyB7XG4gIC8qKlxuICAgKiBTdGFuZGFyZCBidXJzdGluZyBtb2RlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9idXJzdGFibGUtcGVyZm9ybWFuY2UtaW5zdGFuY2VzLXN0YW5kYXJkLW1vZGUuaHRtbFxuICAgKi9cbiAgU1RBTkRBUkQgPSAnc3RhbmRhcmQnLFxuXG4gIC8qKlxuICAgKiBVbmxpbWl0ZWQgYnVyc3RpbmcgbW9kZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvYnVyc3RhYmxlLXBlcmZvcm1hbmNlLWluc3RhbmNlcy11bmxpbWl0ZWQtbW9kZS5odG1sXG4gICAqL1xuICBVTkxJTUlURUQgPSAndW5saW1pdGVkJyxcbn07XG5cbi8qKlxuICogUHJvdmlkZXMgdGhlIG9wdGlvbnMgZm9yIHNwZWNpZnlpbmcgdGhlIGluc3RhbmNlIGluaXRpYXRlZCBzaHV0ZG93biBiZWhhdmlvci5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS90ZXJtaW5hdGluZy1pbnN0YW5jZXMuaHRtbCNVc2luZ19DaGFuZ2luZ0luc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvclxuICovXG4vLyBkZXYtbm90ZTogVGhpcyBjb3VsZCBiZSB1c2VkIGluIHRoZSBJbnN0YW5jZSBMMlxuZXhwb3J0IGVudW0gSW5zdGFuY2VJbml0aWF0ZWRTaHV0ZG93bkJlaGF2aW9yIHtcbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSB3aWxsIHN0b3Agd2hlbiBpdCBpbml0aWF0ZXMgYSBzaHV0ZG93bi5cbiAgICovXG4gIFNUT1AgPSAnc3RvcCcsXG5cbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSB3aWxsIGJlIHRlcm1pbmF0ZWQgd2hlbiBpdCBpbml0aWF0ZXMgYSBzaHV0ZG93bi5cbiAgICovXG4gIFRFUk1JTkFURSA9ICd0ZXJtaW5hdGUnLFxufTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIExhdW5jaFRlbXBsYXRlLWxpa2Ugb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTGF1bmNoVGVtcGxhdGUgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIHZlcnNpb24gbnVtYmVyIG9mIHRoaXMgbGF1bmNoIHRlbXBsYXRlIHRvIHVzZVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uTnVtYmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBMYXVuY2ggVGVtcGxhdGVcbiAgICpcbiAgICogRXhhY3RseSBvbmUgb2YgYGxhdW5jaFRlbXBsYXRlSWRgIGFuZCBgbGF1bmNoVGVtcGxhdGVOYW1lYCB3aWxsIGJlIHNldC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbGF1bmNoVGVtcGxhdGVJZD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIExhdW5jaCBUZW1wbGF0ZVxuICAgKlxuICAgKiBFeGFjdGx5IG9uZSBvZiBgbGF1bmNoVGVtcGxhdGVJZGAgYW5kIGBsYXVuY2hUZW1wbGF0ZU5hbWVgIHdpbGwgYmUgc2V0LlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgdGhlIG9wdGlvbnMgZm9yIHRoZSB0eXBlcyBvZiBpbnRlcnJ1cHRpb24gZm9yIHNwb3QgaW5zdGFuY2VzLlxuICovXG4vLyBkZXYtbm90ZTogVGhpcyBjb3VsZCBiZSB1c2VkIGluIGEgU3BvdEZsZWV0IEwyIGlmIG9uZSBnZXRzIGRldmVsb3BlZC5cbmV4cG9ydCBlbnVtIFNwb3RJbnN0YW5jZUludGVycnVwdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugd2lsbCBzdG9wIHdoZW4gaW50ZXJydXB0ZWQuXG4gICAqL1xuICBTVE9QID0gJ3N0b3AnLFxuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugd2lsbCBiZSB0ZXJtaW5hdGVkIHdoZW4gaW50ZXJydXB0ZWQuXG4gICAqL1xuICBURVJNSU5BVEUgPSAndGVybWluYXRlJyxcblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlIHdpbGwgaGliZXJuYXRlIHdoZW4gaW50ZXJydXB0ZWQuXG4gICAqL1xuICBISUJFUk5BVEUgPSAnaGliZXJuYXRlJyxcbn1cblxuLyoqXG4gKiBUaGUgU3BvdCBJbnN0YW5jZSByZXF1ZXN0IHR5cGUuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvc3BvdC1yZXF1ZXN0cy5odG1sXG4gKi9cbmV4cG9ydCBlbnVtIFNwb3RSZXF1ZXN0VHlwZSB7XG4gIC8qKlxuICAgKiBBIG9uZS10aW1lIFNwb3QgSW5zdGFuY2UgcmVxdWVzdCByZW1haW5zIGFjdGl2ZSB1bnRpbCBBbWF6b24gRUMyIGxhdW5jaGVzIHRoZSBTcG90IEluc3RhbmNlLFxuICAgKiB0aGUgcmVxdWVzdCBleHBpcmVzLCBvciB5b3UgY2FuY2VsIHRoZSByZXF1ZXN0LiBJZiB0aGUgU3BvdCBwcmljZSBleGNlZWRzIHlvdXIgbWF4aW11bSBwcmljZVxuICAgKiBvciBjYXBhY2l0eSBpcyBub3QgYXZhaWxhYmxlLCB5b3VyIFNwb3QgSW5zdGFuY2UgaXMgdGVybWluYXRlZCBhbmQgdGhlIFNwb3QgSW5zdGFuY2UgcmVxdWVzdFxuICAgKiBpcyBjbG9zZWQuXG4gICAqL1xuICBPTkVfVElNRSA9ICdvbmUtdGltZScsXG5cbiAgLyoqXG4gICAqIEEgcGVyc2lzdGVudCBTcG90IEluc3RhbmNlIHJlcXVlc3QgcmVtYWlucyBhY3RpdmUgdW50aWwgaXQgZXhwaXJlcyBvciB5b3UgY2FuY2VsIGl0LCBldmVuIGlmXG4gICAqIHRoZSByZXF1ZXN0IGlzIGZ1bGZpbGxlZC4gSWYgdGhlIFNwb3QgcHJpY2UgZXhjZWVkcyB5b3VyIG1heGltdW0gcHJpY2Ugb3IgY2FwYWNpdHkgaXMgbm90IGF2YWlsYWJsZSxcbiAgICogeW91ciBTcG90IEluc3RhbmNlIGlzIGludGVycnVwdGVkLiBBZnRlciB5b3VyIGluc3RhbmNlIGlzIGludGVycnVwdGVkLCB3aGVuIHlvdXIgbWF4aW11bSBwcmljZSBleGNlZWRzXG4gICAqIHRoZSBTcG90IHByaWNlIG9yIGNhcGFjaXR5IGJlY29tZXMgYXZhaWxhYmxlIGFnYWluLCB0aGUgU3BvdCBJbnN0YW5jZSBpcyBzdGFydGVkIGlmIHN0b3BwZWQgb3IgcmVzdW1lZFxuICAgKiBpZiBoaWJlcm5hdGVkLlxuICAgKi9cbiAgUEVSU0lTVEVOVCA9ICdwZXJzaXN0ZW50Jyxcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBTcG90IG1hcmtldCBpbnN0YW5jZSBvcHRpb25zIHByb3ZpZGVkIGluIGEgTGF1bmNoVGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF1bmNoVGVtcGxhdGVTcG90T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTcG90IEluc3RhbmNlcyB3aXRoIGEgZGVmaW5lZCBkdXJhdGlvbiAoYWxzbyBrbm93biBhcyBTcG90IGJsb2NrcykgYXJlIGRlc2lnbmVkIG5vdCB0byBiZSBpbnRlcnJ1cHRlZCBhbmQgd2lsbCBydW4gY29udGludW91c2x5IGZvciB0aGUgZHVyYXRpb24geW91IHNlbGVjdC5cbiAgICogWW91IGNhbiB1c2UgYSBkdXJhdGlvbiBvZiAxLCAyLCAzLCA0LCA1LCBvciA2IGhvdXJzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9zcG90LXJlcXVlc3RzLmh0bWwjZml4ZWQtZHVyYXRpb24tc3BvdC1pbnN0YW5jZXNcbiAgICpcbiAgICogQGRlZmF1bHQgUmVxdWVzdGVkIHNwb3QgaW5zdGFuY2VzIGRvIG5vdCBoYXZlIGEgcHJlLWRlZmluZWQgZHVyYXRpb24uXG4gICAqL1xuICByZWFkb25seSBibG9ja0R1cmF0aW9uPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBiZWhhdmlvciB3aGVuIGEgU3BvdCBJbnN0YW5jZSBpcyBpbnRlcnJ1cHRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgU3BvdCBpbnN0YW5jZXMgd2lsbCB0ZXJtaW5hdGUgd2hlbiBpbnRlcnJ1cHRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGludGVycnVwdGlvbkJlaGF2aW9yPzogU3BvdEluc3RhbmNlSW50ZXJydXB0aW9uO1xuXG4gIC8qKlxuICAgKiBNYXhpbXVtIGhvdXJseSBwcmljZSB5b3UncmUgd2lsbGluZyB0byBwYXkgZm9yIGVhY2ggU3BvdCBpbnN0YW5jZS4gVGhlIHZhbHVlIGlzIGdpdmVuXG4gICAqIGluIGRvbGxhcnMuIGV4OiAwLjAxIGZvciAxIGNlbnQgcGVyIGhvdXIsIG9yIDAuMDAxIGZvciBvbmUtdGVudGggb2YgYSBjZW50IHBlciBob3VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBNYXhpbXVtIGhvdXJseSBwcmljZSB3aWxsIGRlZmF1bHQgdG8gdGhlIG9uLWRlbWFuZCBwcmljZSBmb3IgdGhlIGluc3RhbmNlIHR5cGUuXG4gICAqL1xuICByZWFkb25seSBtYXhQcmljZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIFNwb3QgSW5zdGFuY2UgcmVxdWVzdCB0eXBlLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHVzaW5nIFNwb3QgSW5zdGFuY2VzIHdpdGggYW4gQXV0byBTY2FsaW5nIGdyb3VwLCB1c2Ugb25lLXRpbWUgcmVxdWVzdHMsIGFzIHRoZVxuICAgKiBBbWF6b24gRUMyIEF1dG8gU2NhbGluZyBzZXJ2aWNlIGhhbmRsZXMgcmVxdWVzdGluZyBuZXcgU3BvdCBJbnN0YW5jZXMgd2hlbmV2ZXIgdGhlIGdyb3VwIGlzXG4gICAqIGJlbG93IGl0cyBkZXNpcmVkIGNhcGFjaXR5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBPbmUtdGltZSBzcG90IHJlcXVlc3QuXG4gICAqL1xuICByZWFkb25seSByZXF1ZXN0VHlwZT86IFNwb3RSZXF1ZXN0VHlwZTtcblxuICAvKipcbiAgICogVGhlIGVuZCBkYXRlIG9mIHRoZSByZXF1ZXN0LiBGb3IgYSBvbmUtdGltZSByZXF1ZXN0LCB0aGUgcmVxdWVzdCByZW1haW5zIGFjdGl2ZSB1bnRpbCBhbGwgaW5zdGFuY2VzXG4gICAqIGxhdW5jaCwgdGhlIHJlcXVlc3QgaXMgY2FuY2VsZWQsIG9yIHRoaXMgZGF0ZSBpcyByZWFjaGVkLiBJZiB0aGUgcmVxdWVzdCBpcyBwZXJzaXN0ZW50LCBpdCByZW1haW5zXG4gICAqIGFjdGl2ZSB1bnRpbCBpdCBpcyBjYW5jZWxlZCBvciB0aGlzIGRhdGUgYW5kIHRpbWUgaXMgcmVhY2hlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIGRlZmF1bHQgZW5kIGRhdGUgaXMgNyBkYXlzIGZyb20gdGhlIGN1cnJlbnQgZGF0ZS5cbiAgICovXG4gIHJlYWRvbmx5IHZhbGlkVW50aWw/OiBFeHBpcmF0aW9uO1xufTtcblxuLyoqXG4gKiBUaGUgc3RhdGUgb2YgdG9rZW4gdXNhZ2UgZm9yIHlvdXIgaW5zdGFuY2UgbWV0YWRhdGEgcmVxdWVzdHMuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy1odHRwdG9rZW5zXG4gKi9cbmV4cG9ydCBlbnVtIExhdW5jaFRlbXBsYXRlSHR0cFRva2VucyB7XG4gIC8qKlxuICAgKiBJZiB0aGUgc3RhdGUgaXMgb3B0aW9uYWwsIHlvdSBjYW4gY2hvb3NlIHRvIHJldHJpZXZlIGluc3RhbmNlIG1ldGFkYXRhIHdpdGggb3Igd2l0aG91dCBhIHNpZ25lZCB0b2tlbiBoZWFkZXIgb24geW91ciByZXF1ZXN0LlxuICAgKi9cbiAgT1BUSU9OQUwgPSAnb3B0aW9uYWwnLFxuICAvKipcbiAgICogSWYgdGhlIHN0YXRlIGlzIHJlcXVpcmVkLCB5b3UgbXVzdCBzZW5kIGEgc2lnbmVkIHRva2VuIGhlYWRlciB3aXRoIGFueSBpbnN0YW5jZSBtZXRhZGF0YSByZXRyaWV2YWwgcmVxdWVzdHMuIEluIHRoaXMgc3RhdGUsXG4gICAqIHJldHJpZXZpbmcgdGhlIElBTSByb2xlIGNyZWRlbnRpYWxzIGFsd2F5cyByZXR1cm5zIHRoZSB2ZXJzaW9uIDIuMCBjcmVkZW50aWFsczsgdGhlIHZlcnNpb24gMS4wIGNyZWRlbnRpYWxzIGFyZSBub3QgYXZhaWxhYmxlLlxuICAgKi9cbiAgUkVRVUlSRUQgPSAncmVxdWlyZWQnLFxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgb2YgYSBMYXVuY2hUZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYXVuY2hUZW1wbGF0ZVByb3BzIHtcbiAgLyoqXG4gICAqIE5hbWUgZm9yIHRoaXMgbGF1bmNoIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgaW5zdGFuY2UgdG8gbGF1bmNoLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoaXMgTGF1bmNoIFRlbXBsYXRlIGRvZXMgbm90IHNwZWNpZnkgYSBkZWZhdWx0IEluc3RhbmNlIFR5cGUuXG4gICAqL1xuICByZWFkb25seSBpbnN0YW5jZVR5cGU/OiBJbnN0YW5jZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBBTUkgdGhhdCB3aWxsIGJlIHVzZWQgYnkgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoaXMgTGF1bmNoIFRlbXBsYXRlIGRvZXMgbm90IHNwZWNpZnkgYSBkZWZhdWx0IEFNSS5cbiAgICovXG4gIHJlYWRvbmx5IG1hY2hpbmVJbWFnZT86IElNYWNoaW5lSW1hZ2U7XG5cbiAgLyoqXG4gICAqIFRoZSBBTUkgdGhhdCB3aWxsIGJlIHVzZWQgYnkgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoaXMgTGF1bmNoIFRlbXBsYXRlIGNyZWF0ZXMgYSBVc2VyRGF0YSBiYXNlZCBvbiB0aGUgdHlwZSBvZiBwcm92aWRlZFxuICAgKiBtYWNoaW5lSW1hZ2U7IG5vIFVzZXJEYXRhIGlzIGNyZWF0ZWQgaWYgYSBtYWNoaW5lSW1hZ2UgaXMgbm90IHByb3ZpZGVkXG4gICAqL1xuICByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhO1xuXG4gIC8qKlxuICAgKiBBbiBJQU0gcm9sZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgaW5zdGFuY2UgcHJvZmlsZSB0aGF0IGlzIHVzZWQgYnkgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBUaGUgcm9sZSBtdXN0IGJlIGFzc3VtYWJsZSBieSB0aGUgc2VydmljZSBwcmluY2lwYWwgYGVjMi5hbWF6b25hd3MuY29tYDpcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnTXlSb2xlJywge1xuICAgKiAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG5ldyByb2xlIGlzIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaG93IGJsb2NrIGRldmljZXMgYXJlIGV4cG9zZWQgdG8gdGhlIGluc3RhbmNlLiBZb3UgY2FuIHNwZWNpZnkgdmlydHVhbCBkZXZpY2VzIGFuZCBFQlMgdm9sdW1lcy5cbiAgICpcbiAgICogRWFjaCBpbnN0YW5jZSB0aGF0IGlzIGxhdW5jaGVkIGhhcyBhbiBhc3NvY2lhdGVkIHJvb3QgZGV2aWNlIHZvbHVtZSxcbiAgICogZWl0aGVyIGFuIEFtYXpvbiBFQlMgdm9sdW1lIG9yIGFuIGluc3RhbmNlIHN0b3JlIHZvbHVtZS5cbiAgICogWW91IGNhbiB1c2UgYmxvY2sgZGV2aWNlIG1hcHBpbmdzIHRvIHNwZWNpZnkgYWRkaXRpb25hbCBFQlMgdm9sdW1lcyBvclxuICAgKiBpbnN0YW5jZSBzdG9yZSB2b2x1bWVzIHRvIGF0dGFjaCB0byBhbiBpbnN0YW5jZSB3aGVuIGl0IGlzIGxhdW5jaGVkLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9ibG9jay1kZXZpY2UtbWFwcGluZy1jb25jZXB0cy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVXNlcyB0aGUgYmxvY2sgZGV2aWNlIG1hcHBpbmcgb2YgdGhlIEFNSVxuICAgKi9cbiAgcmVhZG9ubHkgYmxvY2tEZXZpY2VzPzogQmxvY2tEZXZpY2VbXTtcblxuICAvKipcbiAgICogQ1BVIGNyZWRpdCB0eXBlIGZvciBidXJzdGFibGUgRUMyIGluc3RhbmNlIHR5cGVzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9idXJzdGFibGUtcGVyZm9ybWFuY2UtaW5zdGFuY2VzLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjcmVkaXQgdHlwZSBpcyBzcGVjaWZpZWQgaW4gdGhlIExhdW5jaCBUZW1wbGF0ZS5cbiAgICovXG4gIHJlYWRvbmx5IGNwdUNyZWRpdHM/OiBDcHVDcmVkaXRzO1xuXG4gIC8qKlxuICAgKiBJZiB5b3Ugc2V0IHRoaXMgcGFyYW1ldGVyIHRvIHRydWUsIHlvdSBjYW5ub3QgdGVybWluYXRlIHRoZSBpbnN0YW5jZXMgbGF1bmNoZWQgd2l0aCB0aGlzIGxhdW5jaCB0ZW1wbGF0ZVxuICAgKiB1c2luZyB0aGUgQW1hem9uIEVDMiBjb25zb2xlLCBDTEksIG9yIEFQSTsgb3RoZXJ3aXNlLCB5b3UgY2FuLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBBUEkgdGVybWluYXRpb24gc2V0dGluZyBpcyBub3Qgc3BlY2lmaWVkIGluIHRoZSBMYXVuY2ggVGVtcGxhdGUuXG4gICAqL1xuICByZWFkb25seSBkaXNhYmxlQXBpVGVybWluYXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaW5zdGFuY2VzIGFyZSBvcHRpbWl6ZWQgZm9yIEFtYXpvbiBFQlMgSS9PLiBUaGlzIG9wdGltaXphdGlvbiBwcm92aWRlcyBkZWRpY2F0ZWQgdGhyb3VnaHB1dFxuICAgKiB0byBBbWF6b24gRUJTIGFuZCBhbiBvcHRpbWl6ZWQgY29uZmlndXJhdGlvbiBzdGFjayB0byBwcm92aWRlIG9wdGltYWwgQW1hem9uIEVCUyBJL08gcGVyZm9ybWFuY2UuIFRoaXMgb3B0aW1pemF0aW9uXG4gICAqIGlzbid0IGF2YWlsYWJsZSB3aXRoIGFsbCBpbnN0YW5jZSB0eXBlcy4gQWRkaXRpb25hbCB1c2FnZSBjaGFyZ2VzIGFwcGx5IHdoZW4gdXNpbmcgYW4gRUJTLW9wdGltaXplZCBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBFQlMgb3B0aW1pemF0aW9uIGlzIG5vdCBzcGVjaWZpZWQgaW4gdGhlIGxhdW5jaCB0ZW1wbGF0ZS5cbiAgICovXG4gIHJlYWRvbmx5IGVic09wdGltaXplZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgcGFyYW1ldGVyIGlzIHNldCB0byB0cnVlLCB0aGUgaW5zdGFuY2UgaXMgZW5hYmxlZCBmb3IgQVdTIE5pdHJvIEVuY2xhdmVzOyBvdGhlcndpc2UsIGl0IGlzIG5vdCBlbmFibGVkIGZvciBBV1MgTml0cm8gRW5jbGF2ZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRW5hYmxlbWVudCBvZiBOaXRybyBlbmNsYXZlcyBpcyBub3Qgc3BlY2lmaWVkIGluIHRoZSBsYXVuY2ggdGVtcGxhdGU7IGRlZmF1bHRpbmcgdG8gZmFsc2UuXG4gICAqL1xuICByZWFkb25seSBuaXRyb0VuY2xhdmVFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgeW91IHNldCB0aGlzIHBhcmFtZXRlciB0byB0cnVlLCB0aGUgaW5zdGFuY2UgaXMgZW5hYmxlZCBmb3IgaGliZXJuYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSGliZXJuYXRpb24gY29uZmlndXJhdGlvbiBpcyBub3Qgc3BlY2lmaWVkIGluIHRoZSBsYXVuY2ggdGVtcGxhdGU7IGRlZmF1bHRpbmcgdG8gZmFsc2UuXG4gICAqL1xuICByZWFkb25seSBoaWJlcm5hdGlvbkNvbmZpZ3VyZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBhbiBpbnN0YW5jZSBzdG9wcyBvciB0ZXJtaW5hdGVzIHdoZW4geW91IGluaXRpYXRlIHNodXRkb3duIGZyb20gdGhlIGluc3RhbmNlICh1c2luZyB0aGUgb3BlcmF0aW5nIHN5c3RlbSBjb21tYW5kIGZvciBzeXN0ZW0gc2h1dGRvd24pLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS90ZXJtaW5hdGluZy1pbnN0YW5jZXMuaHRtbCNVc2luZ19DaGFuZ2luZ0luc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFNodXRkb3duIGJlaGF2aW9yIGlzIG5vdCBzcGVjaWZpZWQgaW4gdGhlIGxhdW5jaCB0ZW1wbGF0ZTsgZGVmYXVsdHMgdG8gU1RPUC5cbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvcj86IEluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvcjtcblxuICAvKipcbiAgICogSWYgdGhpcyBwcm9wZXJ0eSBpcyBkZWZpbmVkLCB0aGVuIHRoZSBMYXVuY2ggVGVtcGxhdGUncyBJbnN0YW5jZU1hcmtldE9wdGlvbnMgd2lsbCBiZVxuICAgKiBzZXQgdG8gdXNlIFNwb3QgaW5zdGFuY2VzLCBhbmQgdGhlIG9wdGlvbnMgZm9yIHRoZSBTcG90IGluc3RhbmNlcyB3aWxsIGJlIGFzIGRlZmluZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSW5zdGFuY2UgbGF1bmNoZWQgd2l0aCB0aGlzIHRlbXBsYXRlIHdpbGwgbm90IGJlIHNwb3QgaW5zdGFuY2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgc3BvdE9wdGlvbnM/OiBMYXVuY2hUZW1wbGF0ZVNwb3RPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIFNTSCBrZXlwYWlyIHRvIGdyYW50IGFjY2VzcyB0byBpbnN0YW5jZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIFNTSCBhY2Nlc3Mgd2lsbCBiZSBwb3NzaWJsZS5cbiAgICovXG4gIHJlYWRvbmx5IGtleU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIHNldCB0byB0cnVlLCB0aGVuIGRldGFpbGVkIG1vbml0b3Jpbmcgd2lsbCBiZSBlbmFibGVkIG9uIGluc3RhbmNlcyBjcmVhdGVkIHdpdGggdGhpc1xuICAgKiBsYXVuY2ggdGVtcGxhdGUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL3VzaW5nLWNsb3Vkd2F0Y2gtbmV3Lmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgRmFsc2UgLSBEZXRhaWxlZCBtb25pdG9yaW5nIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZGV0YWlsZWRNb25pdG9yaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU2VjdXJpdHkgZ3JvdXAgdG8gYXNzaWduIHRvIGluc3RhbmNlcyBjcmVhdGVkIHdpdGggdGhlIGxhdW5jaCB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gc2VjdXJpdHkgZ3JvdXAgaXMgYXNzaWduZWQuXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwPzogSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgSU1EU3YyIHNob3VsZCBiZSByZXF1aXJlZCBvbiBsYXVuY2hlZCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVpcmVJbWRzdjI/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFbmFibGVzIG9yIGRpc2FibGVzIHRoZSBIVFRQIG1ldGFkYXRhIGVuZHBvaW50IG9uIHlvdXIgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLmh0bWwjY2ZuLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLWh0dHBlbmRwb2ludFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBodHRwRW5kcG9pbnQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFbmFibGVzIG9yIGRpc2FibGVzIHRoZSBJUHY2IGVuZHBvaW50IGZvciB0aGUgaW5zdGFuY2UgbWV0YWRhdGEgc2VydmljZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy1odHRwcHJvdG9jb2xpcHY2XG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGh0dHBQcm90b2NvbElwdjY/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzaXJlZCBIVFRQIFBVVCByZXNwb25zZSBob3AgbGltaXQgZm9yIGluc3RhbmNlIG1ldGFkYXRhIHJlcXVlc3RzLiBUaGUgbGFyZ2VyIHRoZSBudW1iZXIsIHRoZSBmdXJ0aGVyIGluc3RhbmNlIG1ldGFkYXRhIHJlcXVlc3RzIGNhbiB0cmF2ZWwuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMuaHRtbCNjZm4tZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMtaHR0cHB1dHJlc3BvbnNlaG9wbGltaXRcbiAgICpcbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cFB1dFJlc3BvbnNlSG9wTGltaXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZSBvZiB0b2tlbiB1c2FnZSBmb3IgeW91ciBpbnN0YW5jZSBtZXRhZGF0YSByZXF1ZXN0cy4gIFRoZSBkZWZhdWx0IHN0YXRlIGlzIGBvcHRpb25hbGAgaWYgbm90IHNwZWNpZmllZC4gSG93ZXZlcixcbiAgICogaWYgcmVxdWlyZUltZHN2MiBpcyB0cnVlLCB0aGUgc3RhdGUgbXVzdCBiZSBgcmVxdWlyZWRgLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLmh0bWwjY2ZuLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLWh0dHB0b2tlbnNcbiAgICpcbiAgICogQGRlZmF1bHQgTGF1bmNoVGVtcGxhdGVIdHRwVG9rZW5zLk9QVElPTkFMXG4gICAqL1xuICByZWFkb25seSBodHRwVG9rZW5zPzogTGF1bmNoVGVtcGxhdGVIdHRwVG9rZW5zO1xuXG4gIC8qKlxuICAgKiBTZXQgdG8gZW5hYmxlZCB0byBhbGxvdyBhY2Nlc3MgdG8gaW5zdGFuY2UgdGFncyBmcm9tIHRoZSBpbnN0YW5jZSBtZXRhZGF0YS4gU2V0IHRvIGRpc2FibGVkIHRvIHR1cm4gb2ZmIGFjY2VzcyB0byBpbnN0YW5jZSB0YWdzIGZyb20gdGhlIGluc3RhbmNlIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLmh0bWwjY2ZuLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLWluc3RhbmNlbWV0YWRhdGF0YWdzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpbnN0YW5jZU1ldGFkYXRhVGFncz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBjbGFzcyB0aGF0IHByb3ZpZGVzIGNvbnZlbmllbnQgYWNjZXNzIHRvIHNwZWNpYWwgdmVyc2lvbiB0b2tlbnMgZm9yIExhdW5jaFRlbXBsYXRlXG4gKiB2ZXJzaW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIExhdW5jaFRlbXBsYXRlU3BlY2lhbFZlcnNpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBzcGVjaWFsIHZhbHVlIHRoYXQgZGVub3RlcyB0aGF0IHVzZXJzIG9mIGEgTGF1bmNoIFRlbXBsYXRlIHNob3VsZFxuICAgKiByZWZlcmVuY2UgdGhlIExBVEVTVCB2ZXJzaW9uIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTEFURVNUX1ZFUlNJT046IHN0cmluZyA9ICckTGF0ZXN0JztcblxuICAvKipcbiAgICogVGhlIHNwZWNpYWwgdmFsdWUgdGhhdCBkZW5vdGVzIHRoYXQgdXNlcnMgb2YgYSBMYXVuY2ggVGVtcGxhdGUgc2hvdWxkXG4gICAqIHJlZmVyZW5jZSB0aGUgREVGQVVMVCB2ZXJzaW9uIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9WRVJTSU9OOiBzdHJpbmcgPSAnJERlZmF1bHQnO1xufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgZm9yIGFuIGltcG9ydGVkIExhdW5jaFRlbXBsYXRlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhdW5jaFRlbXBsYXRlQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBudW1iZXIgb2YgdGhpcyBsYXVuY2ggdGVtcGxhdGUgdG8gdXNlXG4gICAqXG4gICAqIEBkZWZhdWx0IFZlcnNpb246IFwiJERlZmF1bHRcIlxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbk51bWJlcj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGlkZW50aWZpZXIgb2YgdGhlIExhdW5jaCBUZW1wbGF0ZVxuICAgKlxuICAgKiBFeGFjdGx5IG9uZSBvZiBgbGF1bmNoVGVtcGxhdGVJZGAgYW5kIGBsYXVuY2hUZW1wbGF0ZU5hbWVgIG1heSBiZSBzZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBMYXVuY2ggVGVtcGxhdGVcbiAgICpcbiAgICogRXhhY3RseSBvbmUgb2YgYGxhdW5jaFRlbXBsYXRlSWRgIGFuZCBgbGF1bmNoVGVtcGxhdGVOYW1lYCBtYXkgYmUgc2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBOb25lXG4gICAqL1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhpcyByZXByZXNlbnRzIGFuIEVDMiBMYXVuY2hUZW1wbGF0ZS5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9lYzItbGF1bmNoLXRlbXBsYXRlcy5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXVuY2hUZW1wbGF0ZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUxhdW5jaFRlbXBsYXRlLCBpYW0uSUdyYW50YWJsZSwgSUNvbm5lY3RhYmxlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBMYXVuY2hUZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxhdW5jaFRlbXBsYXRlQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogTGF1bmNoVGVtcGxhdGVBdHRyaWJ1dGVzKTogSUxhdW5jaFRlbXBsYXRlIHtcbiAgICBjb25zdCBoYXZlSWQgPSBCb29sZWFuKGF0dHJzLmxhdW5jaFRlbXBsYXRlSWQpO1xuICAgIGNvbnN0IGhhdmVOYW1lID0gQm9vbGVhbihhdHRycy5sYXVuY2hUZW1wbGF0ZU5hbWUpO1xuICAgIGlmIChoYXZlSWQgPT0gaGF2ZU5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGF1bmNoVGVtcGxhdGUuZnJvbUxhdW5jaFRlbXBsYXRlQXR0cmlidXRlcygpIHJlcXVpcmVzIGV4YWN0bHkgb25lIG9mIGxhdW5jaFRlbXBsYXRlSWQgb3IgbGF1bmNoVGVtcGxhdGVOYW1lIGJlIHByb3ZpZGVkLicpO1xuICAgIH1cblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUxhdW5jaFRlbXBsYXRlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uTnVtYmVyID0gYXR0cnMudmVyc2lvbk51bWJlciA/PyBMYXVuY2hUZW1wbGF0ZVNwZWNpYWxWZXJzaW9ucy5ERUZBVUxUX1ZFUlNJT047XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbGF1bmNoVGVtcGxhdGVJZD8gPSBhdHRycy5sYXVuY2hUZW1wbGF0ZUlkO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlTmFtZT8gPSBhdHRycy5sYXVuY2hUZW1wbGF0ZU5hbWU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyAgIE1lbWJlcnMgZm9yIElMYXVuY2hUZW1wbGF0ZSBpbnRlcmZhY2VcblxuICBwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbk51bWJlcjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgbGF1bmNoVGVtcGxhdGVJZD86IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlTmFtZT86IHN0cmluZztcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gICBEYXRhIG1lbWJlcnNcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgdmVyc2lvbiBmb3IgdGhlIGxhdW5jaCB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRWZXJzaW9uTnVtYmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsYXRlc3QgdmVyc2lvbiBvZiB0aGUgbGF1bmNoIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbGF0ZXN0VmVyc2lvbk51bWJlcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBPUyB0aGUgaW5zdGFuY2UgaXMgcnVubmluZy5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG9zVHlwZT86IE9wZXJhdGluZ1N5c3RlbVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBBTUkgSUQgb2YgdGhlIGltYWdlIHRvIHVzZVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW1hZ2VJZD86IHN0cmluZztcblxuICAvKipcbiAgICogSUFNIFJvbGUgYXNzdW1lZCBieSBpbnN0YW5jZXMgdGhhdCBhcmUgbGF1bmNoZWQgZnJvbSB0aGlzIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVXNlckRhdGEgZXhlY3V0ZWQgYnkgaW5zdGFuY2VzIHRoYXQgYXJlIGxhdW5jaGVkIGZyb20gdGhpcyB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHVzZXJEYXRhPzogVXNlckRhdGE7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgaW5zdGFuY2UgdG8gbGF1bmNoLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VUeXBlPzogSW5zdGFuY2VUeXBlO1xuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyAgIFByaXZhdGUvcHJvdGVjdGVkIGRhdGEgbWVtYmVyc1xuXG4gIC8qKlxuICAgKiBQcmluY2lwYWwgdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG8uXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9ncmFudFByaW5jaXBhbD86IGlhbS5JUHJpbmNpcGFsO1xuXG4gIC8qKlxuICAgKiBBbGxvd3Mgc3BlY2lmeWluZyBzZWN1cml0eSBncm91cCBjb25uZWN0aW9ucyBmb3IgdGhlIGluc3RhbmNlLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfY29ubmVjdGlvbnM/OiBDb25uZWN0aW9ucztcblxuICAvKipcbiAgICogVGFnTWFuYWdlciBmb3IgdGFnZ2luZyBzdXBwb3J0LlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRhZ3M6IFRhZ01hbmFnZXI7XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExhdW5jaFRlbXBsYXRlUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBCYXNpYyB2YWxpZGF0aW9uIG9mIHRoZSBwcm92aWRlZCBzcG90IGJsb2NrIGR1cmF0aW9uXG4gICAgY29uc3Qgc3BvdER1cmF0aW9uID0gcHJvcHM/LnNwb3RPcHRpb25zPy5ibG9ja0R1cmF0aW9uPy50b0hvdXJzKHsgaW50ZWdyYWw6IHRydWUgfSk7XG4gICAgaWYgKHNwb3REdXJhdGlvbiAhPT0gdW5kZWZpbmVkICYmIChzcG90RHVyYXRpb24gPCAxIHx8IHNwb3REdXJhdGlvbiA+IDYpKSB7XG4gICAgICAvLyBTZWU6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9zcG90LXJlcXVlc3RzLmh0bWwjZml4ZWQtZHVyYXRpb24tc3BvdC1pbnN0YW5jZXNcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZEVycm9yKCdTcG90IGJsb2NrIGR1cmF0aW9uIG11c3QgYmUgZXhhY3RseSAxLCAyLCAzLCA0LCA1LCBvciA2IGhvdXJzLicpO1xuICAgIH1cblxuICAgIC8vIEJhc2ljIHZhbGlkYXRpb24gb2YgdGhlIHByb3ZpZGVkIGh0dHBQdXRSZXNwb25zZUhvcExpbWl0XG4gICAgaWYgKHByb3BzLmh0dHBQdXRSZXNwb25zZUhvcExpbWl0ICE9PSB1bmRlZmluZWQgJiYgKHByb3BzLmh0dHBQdXRSZXNwb25zZUhvcExpbWl0IDwgMSB8fCBwcm9wcy5odHRwUHV0UmVzcG9uc2VIb3BMaW1pdCA+IDY0KSkge1xuICAgICAgLy8gU2VlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy1odHRwcHV0cmVzcG9uc2Vob3BsaW1pdFxuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkRXJyb3IoJ0h0dHBQdXRSZXNwb25zZUhvcExpbWl0IG11c3QgYmV0d2VlbiAxIGFuZCA2NCcpO1xuICAgIH1cblxuICAgIHRoaXMucm9sZSA9IHByb3BzLnJvbGU7XG4gICAgdGhpcy5fZ3JhbnRQcmluY2lwYWwgPSB0aGlzLnJvbGU7XG4gICAgY29uc3QgaWFtUHJvZmlsZTogaWFtLkNmbkluc3RhbmNlUHJvZmlsZSB8IHVuZGVmaW5lZCA9IHRoaXMucm9sZSA/IG5ldyBpYW0uQ2ZuSW5zdGFuY2VQcm9maWxlKHRoaXMsICdQcm9maWxlJywge1xuICAgICAgcm9sZXM6IFt0aGlzLnJvbGUhLnJvbGVOYW1lXSxcbiAgICB9KSA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChwcm9wcy5zZWN1cml0eUdyb3VwKSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9ucyh7IHNlY3VyaXR5R3JvdXBzOiBbcHJvcHMuc2VjdXJpdHlHcm91cF0gfSk7XG4gICAgfVxuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXBzVG9rZW4gPSBMYXp5Lmxpc3Qoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvbnMgJiYgdGhpcy5fY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5zZWN1cml0eUdyb3Vwcy5tYXAoc2cgPT4gc2cuc2VjdXJpdHlHcm91cElkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGltYWdlQ29uZmlnOiBNYWNoaW5lSW1hZ2VDb25maWcgfCB1bmRlZmluZWQgPSBwcm9wcy5tYWNoaW5lSW1hZ2U/LmdldEltYWdlKHRoaXMpO1xuICAgIGlmIChpbWFnZUNvbmZpZykge1xuICAgICAgdGhpcy5vc1R5cGUgPSBpbWFnZUNvbmZpZy5vc1R5cGU7XG4gICAgICB0aGlzLmltYWdlSWQgPSBpbWFnZUNvbmZpZy5pbWFnZUlkO1xuICAgIH1cblxuICAgIGlmIChGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKGN4YXBpLkVDMl9MQVVOQ0hfVEVNUExBVEVfREVGQVVMVF9VU0VSX0RBVEEpKSB7XG4gICAgICAvLyBwcmlvcml0eTogcHJvcC51c2VyRGF0YSAtPiB1c2VyRGF0YSBmcm9tIG1hY2hpbmVJbWFnZSAtPiB1bmRlZmluZWRcbiAgICAgIHRoaXMudXNlckRhdGEgPSBwcm9wcy51c2VyRGF0YSA/PyBpbWFnZUNvbmZpZz8udXNlckRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcm9wcy51c2VyRGF0YSkge1xuICAgICAgICB0aGlzLnVzZXJEYXRhID0gcHJvcHMudXNlckRhdGE7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHVzZXJEYXRhVG9rZW4gPSBMYXp5LnN0cmluZyh7XG4gICAgICBwcm9kdWNlOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnVzZXJEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIEZuLmJhc2U2NCh0aGlzLnVzZXJEYXRhLnJlbmRlcigpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW5zdGFuY2VUeXBlID0gcHJvcHMuaW5zdGFuY2VUeXBlO1xuXG4gICAgbGV0IG1hcmtldE9wdGlvbnM6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBpZiAocHJvcHM/LnNwb3RPcHRpb25zKSB7XG4gICAgICBtYXJrZXRPcHRpb25zID0ge1xuICAgICAgICBtYXJrZXRUeXBlOiAnc3BvdCcsXG4gICAgICAgIHNwb3RPcHRpb25zOiB7XG4gICAgICAgICAgYmxvY2tEdXJhdGlvbk1pbnV0ZXM6IHNwb3REdXJhdGlvbiAhPT0gdW5kZWZpbmVkID8gc3BvdER1cmF0aW9uICogNjAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgaW5zdGFuY2VJbnRlcnJ1cHRpb25CZWhhdmlvcjogcHJvcHMuc3BvdE9wdGlvbnMuaW50ZXJydXB0aW9uQmVoYXZpb3IsXG4gICAgICAgICAgbWF4UHJpY2U6IHByb3BzLnNwb3RPcHRpb25zLm1heFByaWNlPy50b1N0cmluZygpLFxuICAgICAgICAgIHNwb3RJbnN0YW5jZVR5cGU6IHByb3BzLnNwb3RPcHRpb25zLnJlcXVlc3RUeXBlLFxuICAgICAgICAgIHZhbGlkVW50aWw6IHByb3BzLnNwb3RPcHRpb25zLnZhbGlkVW50aWw/LmRhdGUudG9VVENTdHJpbmcoKSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICAvLyBSZW1vdmUgU3BvdE9wdGlvbnMgaWYgdGhlcmUgYXJlIG5vbmUuXG4gICAgICBpZiAoT2JqZWN0LmtleXMobWFya2V0T3B0aW9ucy5zcG90T3B0aW9ucykuZmlsdGVyKGsgPT4gbWFya2V0T3B0aW9ucy5zcG90T3B0aW9uc1trXSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgbWFya2V0T3B0aW9ucy5zcG90T3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRhZ3MgPSBuZXcgVGFnTWFuYWdlcihUYWdUeXBlLktFWV9WQUxVRSwgJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScpO1xuXG4gICAgY29uc3QgdGFnc1Rva2VuID0gTGF6eS5hbnkoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy50YWdzLmhhc1RhZ3MoKSkge1xuICAgICAgICAgIGNvbnN0IHJlbmRlcmVkVGFncyA9IHRoaXMudGFncy5yZW5kZXJUYWdzKCk7XG4gICAgICAgICAgY29uc3QgbG93ZXJDYXNlUmVuZGVyZWRUYWdzID0gcmVuZGVyZWRUYWdzLm1hcCggKHRhZzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmd9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBrZXk6IHRhZy5LZXksXG4gICAgICAgICAgICAgIHZhbHVlOiB0YWcuVmFsdWUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJlc291cmNlVHlwZTogJ2luc3RhbmNlJyxcbiAgICAgICAgICAgICAgdGFnczogbG93ZXJDYXNlUmVuZGVyZWRUYWdzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmVzb3VyY2VUeXBlOiAndm9sdW1lJyxcbiAgICAgICAgICAgICAgdGFnczogbG93ZXJDYXNlUmVuZGVyZWRUYWdzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbHRUYWdzVG9rZW4gPSBMYXp5LmFueSh7XG4gICAgICBwcm9kdWNlOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnRhZ3MuaGFzVGFncygpKSB7XG4gICAgICAgICAgY29uc3QgcmVuZGVyZWRUYWdzID0gdGhpcy50YWdzLnJlbmRlclRhZ3MoKTtcbiAgICAgICAgICBjb25zdCBsb3dlckNhc2VSZW5kZXJlZFRhZ3MgPSByZW5kZXJlZFRhZ3MubWFwKCAodGFnOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZ30pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGtleTogdGFnLktleSxcbiAgICAgICAgICAgICAgdmFsdWU6IHRhZy5WYWx1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmVzb3VyY2VUeXBlOiAnbGF1bmNoLXRlbXBsYXRlJyxcbiAgICAgICAgICAgICAgdGFnczogbG93ZXJDYXNlUmVuZGVyZWRUYWdzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuTGF1bmNoVGVtcGxhdGUodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGVOYW1lOiBwcm9wcz8ubGF1bmNoVGVtcGxhdGVOYW1lLFxuICAgICAgbGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIGJsb2NrRGV2aWNlTWFwcGluZ3M6IHByb3BzPy5ibG9ja0RldmljZXMgIT09IHVuZGVmaW5lZCA/IGxhdW5jaFRlbXBsYXRlQmxvY2tEZXZpY2VNYXBwaW5ncyh0aGlzLCBwcm9wcy5ibG9ja0RldmljZXMpIDogdW5kZWZpbmVkLFxuICAgICAgICBjcmVkaXRTcGVjaWZpY2F0aW9uOiBwcm9wcz8uY3B1Q3JlZGl0cyAhPT0gdW5kZWZpbmVkID8ge1xuICAgICAgICAgIGNwdUNyZWRpdHM6IHByb3BzLmNwdUNyZWRpdHMsXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICAgIGRpc2FibGVBcGlUZXJtaW5hdGlvbjogcHJvcHM/LmRpc2FibGVBcGlUZXJtaW5hdGlvbixcbiAgICAgICAgZWJzT3B0aW1pemVkOiBwcm9wcz8uZWJzT3B0aW1pemVkLFxuICAgICAgICBlbmNsYXZlT3B0aW9uczogcHJvcHM/Lm5pdHJvRW5jbGF2ZUVuYWJsZWQgIT09IHVuZGVmaW5lZCA/IHtcbiAgICAgICAgICBlbmFibGVkOiBwcm9wcy5uaXRyb0VuY2xhdmVFbmFibGVkLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgICBoaWJlcm5hdGlvbk9wdGlvbnM6IHByb3BzPy5oaWJlcm5hdGlvbkNvbmZpZ3VyZWQgIT09IHVuZGVmaW5lZCA/IHtcbiAgICAgICAgICBjb25maWd1cmVkOiBwcm9wcy5oaWJlcm5hdGlvbkNvbmZpZ3VyZWQsXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICAgIGlhbUluc3RhbmNlUHJvZmlsZTogaWFtUHJvZmlsZSAhPT0gdW5kZWZpbmVkID8ge1xuICAgICAgICAgIGFybjogaWFtUHJvZmlsZS5nZXRBdHQoJ0FybicpLnRvU3RyaW5nKCksXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICAgIGltYWdlSWQ6IGltYWdlQ29uZmlnPy5pbWFnZUlkLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IHByb3BzPy5pbnN0YW5jZVR5cGU/LnRvU3RyaW5nKCksXG4gICAgICAgIGluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvcjogcHJvcHM/Lmluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvcixcbiAgICAgICAgaW5zdGFuY2VNYXJrZXRPcHRpb25zOiBtYXJrZXRPcHRpb25zLFxuICAgICAgICBrZXlOYW1lOiBwcm9wcz8ua2V5TmFtZSxcbiAgICAgICAgbW9uaXRvcmluZzogcHJvcHM/LmRldGFpbGVkTW9uaXRvcmluZyAhPT0gdW5kZWZpbmVkID8ge1xuICAgICAgICAgIGVuYWJsZWQ6IHByb3BzLmRldGFpbGVkTW9uaXRvcmluZyxcbiAgICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgc2VjdXJpdHlHcm91cElkczogc2VjdXJpdHlHcm91cHNUb2tlbixcbiAgICAgICAgdGFnU3BlY2lmaWNhdGlvbnM6IHRhZ3NUb2tlbixcbiAgICAgICAgdXNlckRhdGE6IHVzZXJEYXRhVG9rZW4sXG4gICAgICAgIG1ldGFkYXRhT3B0aW9uczogdGhpcy5yZW5kZXJNZXRhZGF0YU9wdGlvbnMocHJvcHMpLFxuXG4gICAgICAgIC8vIEZpZWxkcyBub3QgeWV0IGltcGxlbWVudGVkOlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLWNhcGFjaXR5cmVzZXJ2YXRpb25zcGVjaWZpY2F0aW9uLmh0bWxcbiAgICAgICAgLy8gV2lsbCByZXF1aXJlIGNyZWF0aW5nIGFuIEwyIGZvciBBV1M6OkVDMjo6Q2FwYWNpdHlSZXNlcnZhdGlvblxuICAgICAgICAvLyBjYXBhY2l0eVJlc2VydmF0aW9uU3BlY2lmaWNhdGlvbjogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtY3B1b3B0aW9ucy5odG1sXG4gICAgICAgIC8vIGNwdU9wdGlvbnM6IHVuZGVmaW5lZCxcblxuICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtZWxhc3RpY2dwdXNwZWNpZmljYXRpb24uaHRtbFxuICAgICAgICAvLyBlbGFzdGljR3B1U3BlY2lmaWNhdGlvbnM6IHVuZGVmaW5lZCxcblxuICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLmh0bWwjY2ZuLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtZWxhc3RpY2luZmVyZW5jZWFjY2VsZXJhdG9yc1xuICAgICAgICAvLyBlbGFzdGljSW5mZXJlbmNlQWNjZWxlcmF0b3JzOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLWtlcm5lbGlkXG4gICAgICAgIC8vIGtlcm5lbElkOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHJhbURpc2tJZDogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEuaHRtbCNjZm4tZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1saWNlbnNlc3BlY2lmaWNhdGlvbnNcbiAgICAgICAgLy8gQWxzbyBub3QgaW1wbGVtZW50ZWQgaW4gSW5zdGFuY2UgTDJcbiAgICAgICAgLy8gbGljZW5zZVNwZWNpZmljYXRpb25zOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLXRhZ3NwZWNpZmljYXRpb25zXG4gICAgICAgIC8vIFNob3VsZCBiZSBpbXBsZW1lbnRlZCB2aWEgdGhlIFRhZ2dpbmcgYXNwZWN0IGluIENESyBjb3JlLiBDb21wbGljYXRpb24gd2lsbCBiZSB0aGF0IHRoaXMgdGFnZ2luZyBpbnRlcmZhY2UgaXMgdmVyeSB1bmlxdWUgdG8gTGF1bmNoVGVtcGxhdGVzLlxuICAgICAgICAvLyB0YWdTcGVjaWZpY2F0aW9uOiB1bmRlZmluZWRcblxuICAgICAgICAvLyBDREsgaGFzIG5vIGFic3RyYWN0aW9uIGZvciBOZXR3b3JrIEludGVyZmFjZXMgeWV0LlxuICAgICAgICAvLyBuZXR3b3JrSW50ZXJmYWNlczogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8vIENESyBoYXMgbm8gYWJzdHJhY3Rpb24gZm9yIFBsYWNlbWVudCB5ZXQuXG4gICAgICAgIC8vIHBsYWNlbWVudDogdW5kZWZpbmVkLFxuXG4gICAgICB9LFxuICAgICAgdGFnU3BlY2lmaWNhdGlvbnM6IGx0VGFnc1Rva2VuLFxuICAgIH0pO1xuXG4gICAgVGFncy5vZih0aGlzKS5hZGQoTkFNRV9UQUcsIHRoaXMubm9kZS5wYXRoKTtcblxuICAgIHRoaXMuZGVmYXVsdFZlcnNpb25OdW1iZXIgPSByZXNvdXJjZS5hdHRyRGVmYXVsdFZlcnNpb25OdW1iZXI7XG4gICAgdGhpcy5sYXRlc3RWZXJzaW9uTnVtYmVyID0gcmVzb3VyY2UuYXR0ckxhdGVzdFZlcnNpb25OdW1iZXI7XG4gICAgdGhpcy5sYXVuY2hUZW1wbGF0ZUlkID0gcmVzb3VyY2UucmVmO1xuICAgIHRoaXMudmVyc2lvbk51bWJlciA9IFRva2VuLmFzU3RyaW5nKHJlc291cmNlLmdldEF0dCgnTGF0ZXN0VmVyc2lvbk51bWJlcicpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyTWV0YWRhdGFPcHRpb25zKHByb3BzOiBMYXVuY2hUZW1wbGF0ZVByb3BzKSB7XG4gICAgbGV0IHJlcXVpcmVNZXRhZGF0YU9wdGlvbnMgPSBmYWxzZTtcbiAgICAvLyBpZiByZXF1aXJlSW1kc3YyIGlzIHRydWUsIGh0dHBUb2tlbnMgbXVzdCBiZSByZXF1aXJlZC5cbiAgICBpZiAocHJvcHMucmVxdWlyZUltZHN2MiA9PT0gdHJ1ZSAmJiBwcm9wcy5odHRwVG9rZW5zID09PSBMYXVuY2hUZW1wbGF0ZUh0dHBUb2tlbnMuT1BUSU9OQUwpIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZEVycm9yKCdodHRwVG9rZW5zIG11c3QgYmUgcmVxdWlyZWQgd2hlbiByZXF1aXJlSW1kc3YyIGlzIHRydWUnKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmh0dHBFbmRwb2ludCAhPT0gdW5kZWZpbmVkIHx8IHByb3BzLmh0dHBQcm90b2NvbElwdjYgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy5odHRwUHV0UmVzcG9uc2VIb3BMaW1pdCAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICBwcm9wcy5odHRwVG9rZW5zICE9PSB1bmRlZmluZWQgfHwgcHJvcHMuaW5zdGFuY2VNZXRhZGF0YVRhZ3MgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy5yZXF1aXJlSW1kc3YyID09PSB0cnVlKSB7XG4gICAgICByZXF1aXJlTWV0YWRhdGFPcHRpb25zID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHJlcXVpcmVNZXRhZGF0YU9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGh0dHBFbmRwb2ludDogcHJvcHMuaHR0cEVuZHBvaW50ID09PSB0cnVlID8gJ2VuYWJsZWQnIDpcbiAgICAgICAgICBwcm9wcy5odHRwRW5kcG9pbnQgPT09IGZhbHNlID8gJ2Rpc2FibGVkJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgaHR0cFByb3RvY29sSXB2NjogcHJvcHMuaHR0cFByb3RvY29sSXB2NiA9PT0gdHJ1ZSA/ICdlbmFibGVkJyA6XG4gICAgICAgICAgcHJvcHMuaHR0cFByb3RvY29sSXB2NiA9PT0gZmFsc2UgPyAnZGlzYWJsZWQnIDogdW5kZWZpbmVkLFxuICAgICAgICBodHRwUHV0UmVzcG9uc2VIb3BMaW1pdDogcHJvcHMuaHR0cFB1dFJlc3BvbnNlSG9wTGltaXQsXG4gICAgICAgIGh0dHBUb2tlbnM6IHByb3BzLnJlcXVpcmVJbWRzdjIgPT09IHRydWUgPyBMYXVuY2hUZW1wbGF0ZUh0dHBUb2tlbnMuUkVRVUlSRUQgOiBwcm9wcy5odHRwVG9rZW5zLFxuICAgICAgICBpbnN0YW5jZU1ldGFkYXRhVGFnczogcHJvcHMuaW5zdGFuY2VNZXRhZGF0YVRhZ3MgPT09IHRydWUgPyAnZW5hYmxlZCcgOlxuICAgICAgICAgIHByb3BzLmluc3RhbmNlTWV0YWRhdGFUYWdzID09PSBmYWxzZSA/ICdkaXNhYmxlZCcgOiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3Mgc3BlY2lmeWluZyBzZWN1cml0eSBncm91cCBjb25uZWN0aW9ucyBmb3IgdGhlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAbm90ZSBPbmx5IGF2YWlsYWJsZSBpZiB5b3UgcHJvdmlkZSBhIHNlY3VyaXR5R3JvdXAgd2hlbiBjb25zdHJ1Y3RpbmcgdGhlIExhdW5jaFRlbXBsYXRlLlxuICAgKi9cbiAgcHVibGljIGdldCBjb25uZWN0aW9ucygpOiBDb25uZWN0aW9ucyB7XG4gICAgaWYgKCF0aGlzLl9jb25uZWN0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXVuY2hUZW1wbGF0ZSBjYW4gb25seSBiZSB1c2VkIGFzIElDb25uZWN0YWJsZSBpZiBhIHNlY3VyaXR5R3JvdXAgaXMgcHJvdmlkZWQgd2hlbiBjb25zdHJ1Y3RpbmcgaXQuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmluY2lwYWwgdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG8uXG4gICAqXG4gICAqIEBub3RlIE9ubHkgYXZhaWxhYmxlIGlmIHlvdSBwcm92aWRlIGEgcm9sZSB3aGVuIGNvbnN0cnVjdGluZyB0aGUgTGF1bmNoVGVtcGxhdGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGdyYW50UHJpbmNpcGFsKCk6IGlhbS5JUHJpbmNpcGFsIHtcbiAgICBpZiAoIXRoaXMuX2dyYW50UHJpbmNpcGFsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xhdW5jaFRlbXBsYXRlIGNhbiBvbmx5IGJlIHVzZWQgYXMgSUdyYW50YWJsZSBpZiBhIHJvbGUgaXMgcHJvdmlkZWQgd2hlbiBjb25zdHJ1Y3RpbmcgaXQuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9ncmFudFByaW5jaXBhbDtcbiAgfVxufVxuIl19