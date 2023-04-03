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
exports.LaunchTemplateSpecialVersions = LaunchTemplateSpecialVersions;
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
/**
 * This represents an EC2 LaunchTemplate.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html
 */
class LaunchTemplate extends core_1.Resource {
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
                blockDeviceMappings: props?.blockDevices !== undefined ? ebs_util_1.launchTemplateBlockDeviceMappings(this, props.blockDevices) : undefined,
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
            },
            tagSpecifications: ltTagsToken,
        });
        core_1.Tags.of(this).add(NAME_TAG, this.node.path);
        this.defaultVersionNumber = resource.attrDefaultVersionNumber;
        this.latestVersionNumber = resource.attrLatestVersionNumber;
        this.launchTemplateId = resource.ref;
        this.versionNumber = core_1.Token.asString(resource.getAtt('LatestVersionNumber'));
    }
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
exports.LaunchTemplate = LaunchTemplate;
_b = JSII_RTTI_SYMBOL_1;
LaunchTemplate[_b] = { fqn: "@aws-cdk/aws-ec2.LaunchTemplate", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF1bmNoLXRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF1bmNoLXRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUV4Qyx3Q0FhdUI7QUFDdkIseUNBQXlDO0FBRXpDLCtDQUEwRDtBQUMxRCxtREFBb0Q7QUFHcEQsaURBQXVFO0FBS3ZFOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDO0FBRWhDOzs7O0dBSUc7QUFDSCxrREFBa0Q7QUFDbEQsSUFBWSxVQVlYO0FBWkQsV0FBWSxVQUFVO0lBQ3BCOzs7T0FHRztJQUNILG1DQUFxQixDQUFBO0lBRXJCOzs7T0FHRztJQUNILHFDQUF1QixDQUFBO0FBQ3pCLENBQUMsRUFaVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQVlyQjtBQUFBLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsa0RBQWtEO0FBQ2xELElBQVksaUNBVVg7QUFWRCxXQUFZLGlDQUFpQztJQUMzQzs7T0FFRztJQUNILGtEQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILDREQUF1QixDQUFBO0FBQ3pCLENBQUMsRUFWVyxpQ0FBaUMsR0FBakMseUNBQWlDLEtBQWpDLHlDQUFpQyxRQVU1QztBQUFBLENBQUM7QUFnQ0Y7O0dBRUc7QUFDSCx3RUFBd0U7QUFDeEUsSUFBWSx3QkFlWDtBQWZELFdBQVksd0JBQXdCO0lBQ2xDOztPQUVHO0lBQ0gseUNBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsbURBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCxtREFBdUIsQ0FBQTtBQUN6QixDQUFDLEVBZlcsd0JBQXdCLEdBQXhCLGdDQUF3QixLQUF4QixnQ0FBd0IsUUFlbkM7QUFFRDs7OztHQUlHO0FBQ0gsSUFBWSxlQWlCWDtBQWpCRCxXQUFZLGVBQWU7SUFDekI7Ozs7O09BS0c7SUFDSCx3Q0FBcUIsQ0FBQTtJQUVyQjs7Ozs7O09BTUc7SUFDSCw0Q0FBeUIsQ0FBQTtBQUMzQixDQUFDLEVBakJXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBaUIxQjtBQWtEQSxDQUFDO0FBRUY7Ozs7R0FJRztBQUNILElBQVksd0JBVVg7QUFWRCxXQUFZLHdCQUF3QjtJQUNsQzs7T0FFRztJQUNILGlEQUFxQixDQUFBO0lBQ3JCOzs7T0FHRztJQUNILGlEQUFxQixDQUFBO0FBQ3ZCLENBQUMsRUFWVyx3QkFBd0IsR0FBeEIsZ0NBQXdCLEtBQXhCLGdDQUF3QixRQVVuQztBQXNNRDs7O0dBR0c7QUFDSCxNQUFhLDZCQUE2Qjs7QUFBMUMsc0VBWUM7OztBQVhDOzs7R0FHRztBQUNvQiw0Q0FBYyxHQUFXLFNBQVMsQ0FBQztBQUUxRDs7O0dBR0c7QUFDb0IsNkNBQWUsR0FBVyxVQUFVLENBQUM7QUFpQzlEOzs7O0dBSUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxlQUFRO0lBa0cxQyxnREFBZ0Q7SUFFaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUE2QixFQUFFO1FBQ3ZFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FyR1IsY0FBYzs7OztRQXVHdkIsdURBQXVEO1FBQ3ZELE1BQU0sWUFBWSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3BGLElBQUksWUFBWSxLQUFLLFNBQVMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3hFLDRHQUE0RztZQUM1RyxrQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztTQUNqRztRQUVELDJEQUEyRDtRQUMzRCxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUMsRUFBRTtZQUM1SCxrT0FBa087WUFDbE8sa0JBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDaEY7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sVUFBVSxHQUF1QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzdHLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFLLENBQUMsUUFBUSxDQUFDO1NBQzdCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRWYsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSx5QkFBVyxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNoRjtRQUNELE1BQU0sbUJBQW1CLEdBQUcsV0FBSSxDQUFDLElBQUksQ0FBQztZQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUNaLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNwRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDdkU7Z0JBQ0QsT0FBTyxTQUFTLENBQUM7WUFDbkIsQ0FBQztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFtQyxLQUFLLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RixJQUFJLFdBQVcsRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7U0FDcEM7UUFFRCxJQUFJLG1CQUFZLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMscUNBQXFDLENBQUMsRUFBRTtZQUNoRixxRUFBcUU7WUFDckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxJQUFJLFdBQVcsRUFBRSxRQUFRLENBQUM7U0FDekQ7YUFBTTtZQUNMLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO2FBQ2hDO1NBQ0Y7UUFDRCxNQUFNLGFBQWEsR0FBRyxXQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixPQUFPLFNBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2lCQUMxQztnQkFDRCxPQUFPLFNBQVMsQ0FBQztZQUNuQixDQUFDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBRXZDLElBQUksYUFBYSxHQUFRLFNBQVMsQ0FBQztRQUNuQyxJQUFJLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDdEIsYUFBYSxHQUFHO2dCQUNkLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixXQUFXLEVBQUU7b0JBQ1gsb0JBQW9CLEVBQUUsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDaEYsNEJBQTRCLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0I7b0JBQ3BFLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7b0JBQ2hELGdCQUFnQixFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVztvQkFDL0MsVUFBVSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUU7aUJBQzdEO2FBQ0YsQ0FBQztZQUNGLHdDQUF3QztZQUN4QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNoRyxhQUFhLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQzthQUN2QztTQUNGO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGlCQUFVLENBQUMsY0FBTyxDQUFDLFNBQVMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBRTFFLE1BQU0sU0FBUyxHQUFHLFdBQUksQ0FBQyxHQUFHLENBQUM7WUFDekIsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDWixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ3ZCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQzVDLE1BQU0scUJBQXFCLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQTZCLEVBQUUsRUFBRTt3QkFDaEYsT0FBTzs0QkFDTCxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUc7NEJBQ1osS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO3lCQUNqQixDQUFDO29CQUNKLENBQUMsQ0FBQyxDQUFDO29CQUNILE9BQU87d0JBQ0w7NEJBQ0UsWUFBWSxFQUFFLFVBQVU7NEJBQ3hCLElBQUksRUFBRSxxQkFBcUI7eUJBQzVCO3dCQUNEOzRCQUNFLFlBQVksRUFBRSxRQUFROzRCQUN0QixJQUFJLEVBQUUscUJBQXFCO3lCQUM1QjtxQkFDRixDQUFDO2lCQUNIO2dCQUNELE9BQU8sU0FBUyxDQUFDO1lBQ25CLENBQUM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsR0FBRyxXQUFJLENBQUMsR0FBRyxDQUFDO1lBQzNCLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO29CQUN2QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUM1QyxNQUFNLHFCQUFxQixHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUE2QixFQUFFLEVBQUU7d0JBQ2hGLE9BQU87NEJBQ0wsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHOzRCQUNaLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSzt5QkFDakIsQ0FBQztvQkFDSixDQUFDLENBQUMsQ0FBQztvQkFDSCxPQUFPO3dCQUNMOzRCQUNFLFlBQVksRUFBRSxpQkFBaUI7NEJBQy9CLElBQUksRUFBRSxxQkFBcUI7eUJBQzVCO3FCQUNGLENBQUM7aUJBQ0g7Z0JBQ0QsT0FBTyxTQUFTLENBQUM7WUFDbkIsQ0FBQztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksaUNBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN2RCxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsa0JBQWtCO1lBQzdDLGtCQUFrQixFQUFFO2dCQUNsQixtQkFBbUIsRUFBRSxLQUFLLEVBQUUsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsNENBQWlDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDaEksbUJBQW1CLEVBQUUsS0FBSyxFQUFFLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7aUJBQzdCLENBQUMsQ0FBQyxDQUFDLFNBQVM7Z0JBQ2IscUJBQXFCLEVBQUUsS0FBSyxFQUFFLHFCQUFxQjtnQkFDbkQsWUFBWSxFQUFFLEtBQUssRUFBRSxZQUFZO2dCQUNqQyxjQUFjLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pELE9BQU8sRUFBRSxLQUFLLENBQUMsbUJBQW1CO2lCQUNuQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUNiLGtCQUFrQixFQUFFLEtBQUssRUFBRSxxQkFBcUIsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxVQUFVLEVBQUUsS0FBSyxDQUFDLHFCQUFxQjtpQkFDeEMsQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDYixrQkFBa0IsRUFBRSxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsR0FBRyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFO2lCQUN6QyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUNiLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTztnQkFDN0IsWUFBWSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFO2dCQUM3QyxpQ0FBaUMsRUFBRSxLQUFLLEVBQUUsaUNBQWlDO2dCQUMzRSxxQkFBcUIsRUFBRSxhQUFhO2dCQUNwQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU87Z0JBQ3ZCLFVBQVUsRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDcEQsT0FBTyxFQUFFLEtBQUssQ0FBQyxrQkFBa0I7aUJBQ2xDLENBQUMsQ0FBQyxDQUFDLFNBQVM7Z0JBQ2IsZ0JBQWdCLEVBQUUsbUJBQW1CO2dCQUNyQyxpQkFBaUIsRUFBRSxTQUFTO2dCQUM1QixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsZUFBZSxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7YUFtQ25EO1lBQ0QsaUJBQWlCLEVBQUUsV0FBVztTQUMvQixDQUFDLENBQUM7UUFFSCxXQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsUUFBUSxDQUFDLHdCQUF3QixDQUFDO1FBQzlELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUM7UUFDNUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDckMsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0tBQzdFO0lBMVNEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLDRCQUE0QixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQStCOzs7Ozs7Ozs7O1FBQ3RHLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDbkQsSUFBSSxNQUFNLElBQUksUUFBUSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkhBQTJILENBQUMsQ0FBQztTQUM5STtRQUVELE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNrQixrQkFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksNkJBQTZCLENBQUMsZUFBZSxDQUFDO2dCQUNyRixxQkFBZ0IsR0FBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzNDLHVCQUFrQixHQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztZQUNqRSxDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQTRSTyxxQkFBcUIsQ0FBQyxLQUEwQjtRQUN0RCxJQUFJLHNCQUFzQixHQUFHLEtBQUssQ0FBQztRQUNuQyx5REFBeUQ7UUFDekQsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsVUFBVSxLQUFLLHdCQUF3QixDQUFDLFFBQVEsRUFBRTtZQUMxRixrQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsd0RBQXdELENBQUMsQ0FBQztTQUN6RjtRQUNELElBQUksS0FBSyxDQUFDLFlBQVksS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLGdCQUFnQixLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsdUJBQXVCLEtBQUssU0FBUztZQUN6SCxLQUFLLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxhQUFhLEtBQUssSUFBSSxFQUFFO1lBQzVHLHNCQUFzQixHQUFHLElBQUksQ0FBQztTQUMvQjtRQUNELElBQUksc0JBQXNCLEVBQUU7WUFDMUIsT0FBTztnQkFDTCxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNyRCxLQUFLLENBQUMsWUFBWSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUN2RCxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDN0QsS0FBSyxDQUFDLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUMzRCx1QkFBdUIsRUFBRSxLQUFLLENBQUMsdUJBQXVCO2dCQUN0RCxVQUFVLEVBQUUsS0FBSyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVU7Z0JBQy9GLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxvQkFBb0IsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNyRSxLQUFLLENBQUMsb0JBQW9CLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7YUFDaEUsQ0FBQztTQUNIO2FBQU07WUFDTCxPQUFPLFNBQVMsQ0FBQztTQUNsQjtLQUNGO0lBRUQ7Ozs7T0FJRztJQUNILElBQVcsV0FBVztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLHNHQUFzRyxDQUFDLENBQUM7U0FDekg7UUFDRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7S0FDMUI7SUFFRDs7OztPQUlHO0lBQ0gsSUFBVyxjQUFjO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkZBQTJGLENBQUMsQ0FBQztTQUM5RztRQUNELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztLQUM3Qjs7QUE3Vkgsd0NBOFZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuXG5pbXBvcnQge1xuICBBbm5vdGF0aW9ucyxcbiAgRHVyYXRpb24sXG4gIEV4cGlyYXRpb24sXG4gIEZuLFxuICBJUmVzb3VyY2UsXG4gIExhenksXG4gIFJlc291cmNlLFxuICBUYWdNYW5hZ2VyLFxuICBUYWdUeXBlLFxuICBUYWdzLFxuICBUb2tlbixcbiAgRmVhdHVyZUZsYWdzLFxufSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvbm5lY3Rpb25zLCBJQ29ubmVjdGFibGUgfSBmcm9tICcuL2Nvbm5lY3Rpb25zJztcbmltcG9ydCB7IENmbkxhdW5jaFRlbXBsYXRlIH0gZnJvbSAnLi9lYzIuZ2VuZXJhdGVkJztcbmltcG9ydCB7IEluc3RhbmNlVHlwZSB9IGZyb20gJy4vaW5zdGFuY2UtdHlwZXMnO1xuaW1wb3J0IHsgSU1hY2hpbmVJbWFnZSwgTWFjaGluZUltYWdlQ29uZmlnLCBPcGVyYXRpbmdTeXN0ZW1UeXBlIH0gZnJvbSAnLi9tYWNoaW5lLWltYWdlJztcbmltcG9ydCB7IGxhdW5jaFRlbXBsYXRlQmxvY2tEZXZpY2VNYXBwaW5ncyB9IGZyb20gJy4vcHJpdmF0ZS9lYnMtdXRpbCc7XG5pbXBvcnQgeyBJU2VjdXJpdHlHcm91cCB9IGZyb20gJy4vc2VjdXJpdHktZ3JvdXAnO1xuaW1wb3J0IHsgVXNlckRhdGEgfSBmcm9tICcuL3VzZXItZGF0YSc7XG5pbXBvcnQgeyBCbG9ja0RldmljZSB9IGZyb20gJy4vdm9sdW1lJztcblxuLyoqXG4gKiBOYW1lIHRhZyBjb25zdGFudFxuICovXG5jb25zdCBOQU1FX1RBRzogc3RyaW5nID0gJ05hbWUnO1xuXG4vKipcbiAqIFByb3ZpZGVzIHRoZSBvcHRpb25zIGZvciBzcGVjaWZ5aW5nIHRoZSBDUFUgY3JlZGl0IHR5cGUgZm9yIGJ1cnN0YWJsZSBFQzIgaW5zdGFuY2UgdHlwZXMgKFQyLCBUMywgVDNhLCBldGMpLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL2J1cnN0YWJsZS1wZXJmb3JtYW5jZS1pbnN0YW5jZXMtaG93LXRvLmh0bWxcbiAqL1xuLy8gZGV2LW5vdGU6IFRoaXMgY291bGQgYmUgdXNlZCBpbiB0aGUgSW5zdGFuY2UgTDJcbmV4cG9ydCBlbnVtIENwdUNyZWRpdHMge1xuICAvKipcbiAgICogU3RhbmRhcmQgYnVyc3RpbmcgbW9kZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvYnVyc3RhYmxlLXBlcmZvcm1hbmNlLWluc3RhbmNlcy1zdGFuZGFyZC1tb2RlLmh0bWxcbiAgICovXG4gIFNUQU5EQVJEID0gJ3N0YW5kYXJkJyxcblxuICAvKipcbiAgICogVW5saW1pdGVkIGJ1cnN0aW5nIG1vZGUuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL2J1cnN0YWJsZS1wZXJmb3JtYW5jZS1pbnN0YW5jZXMtdW5saW1pdGVkLW1vZGUuaHRtbFxuICAgKi9cbiAgVU5MSU1JVEVEID0gJ3VubGltaXRlZCcsXG59O1xuXG4vKipcbiAqIFByb3ZpZGVzIHRoZSBvcHRpb25zIGZvciBzcGVjaWZ5aW5nIHRoZSBpbnN0YW5jZSBpbml0aWF0ZWQgc2h1dGRvd24gYmVoYXZpb3IuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvdGVybWluYXRpbmctaW5zdGFuY2VzLmh0bWwjVXNpbmdfQ2hhbmdpbmdJbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3JcbiAqL1xuLy8gZGV2LW5vdGU6IFRoaXMgY291bGQgYmUgdXNlZCBpbiB0aGUgSW5zdGFuY2UgTDJcbmV4cG9ydCBlbnVtIEluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvciB7XG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugd2lsbCBzdG9wIHdoZW4gaXQgaW5pdGlhdGVzIGEgc2h1dGRvd24uXG4gICAqL1xuICBTVE9QID0gJ3N0b3AnLFxuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugd2lsbCBiZSB0ZXJtaW5hdGVkIHdoZW4gaXQgaW5pdGlhdGVzIGEgc2h1dGRvd24uXG4gICAqL1xuICBURVJNSU5BVEUgPSAndGVybWluYXRlJyxcbn07XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBMYXVuY2hUZW1wbGF0ZS1saWtlIG9iamVjdHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUxhdW5jaFRlbXBsYXRlIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGlzIGxhdW5jaCB0ZW1wbGF0ZSB0byB1c2VcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbk51bWJlcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWRlbnRpZmllciBvZiB0aGUgTGF1bmNoIFRlbXBsYXRlXG4gICAqXG4gICAqIEV4YWN0bHkgb25lIG9mIGBsYXVuY2hUZW1wbGF0ZUlkYCBhbmQgYGxhdW5jaFRlbXBsYXRlTmFtZWAgd2lsbCBiZSBzZXQuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBMYXVuY2ggVGVtcGxhdGVcbiAgICpcbiAgICogRXhhY3RseSBvbmUgb2YgYGxhdW5jaFRlbXBsYXRlSWRgIGFuZCBgbGF1bmNoVGVtcGxhdGVOYW1lYCB3aWxsIGJlIHNldC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbGF1bmNoVGVtcGxhdGVOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIHRoZSBvcHRpb25zIGZvciB0aGUgdHlwZXMgb2YgaW50ZXJydXB0aW9uIGZvciBzcG90IGluc3RhbmNlcy5cbiAqL1xuLy8gZGV2LW5vdGU6IFRoaXMgY291bGQgYmUgdXNlZCBpbiBhIFNwb3RGbGVldCBMMiBpZiBvbmUgZ2V0cyBkZXZlbG9wZWQuXG5leHBvcnQgZW51bSBTcG90SW5zdGFuY2VJbnRlcnJ1cHRpb24ge1xuICAvKipcbiAgICogVGhlIGluc3RhbmNlIHdpbGwgc3RvcCB3aGVuIGludGVycnVwdGVkLlxuICAgKi9cbiAgU1RPUCA9ICdzdG9wJyxcblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlIHdpbGwgYmUgdGVybWluYXRlZCB3aGVuIGludGVycnVwdGVkLlxuICAgKi9cbiAgVEVSTUlOQVRFID0gJ3Rlcm1pbmF0ZScsXG5cbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSB3aWxsIGhpYmVybmF0ZSB3aGVuIGludGVycnVwdGVkLlxuICAgKi9cbiAgSElCRVJOQVRFID0gJ2hpYmVybmF0ZScsXG59XG5cbi8qKlxuICogVGhlIFNwb3QgSW5zdGFuY2UgcmVxdWVzdCB0eXBlLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL3Nwb3QtcmVxdWVzdHMuaHRtbFxuICovXG5leHBvcnQgZW51bSBTcG90UmVxdWVzdFR5cGUge1xuICAvKipcbiAgICogQSBvbmUtdGltZSBTcG90IEluc3RhbmNlIHJlcXVlc3QgcmVtYWlucyBhY3RpdmUgdW50aWwgQW1hem9uIEVDMiBsYXVuY2hlcyB0aGUgU3BvdCBJbnN0YW5jZSxcbiAgICogdGhlIHJlcXVlc3QgZXhwaXJlcywgb3IgeW91IGNhbmNlbCB0aGUgcmVxdWVzdC4gSWYgdGhlIFNwb3QgcHJpY2UgZXhjZWVkcyB5b3VyIG1heGltdW0gcHJpY2VcbiAgICogb3IgY2FwYWNpdHkgaXMgbm90IGF2YWlsYWJsZSwgeW91ciBTcG90IEluc3RhbmNlIGlzIHRlcm1pbmF0ZWQgYW5kIHRoZSBTcG90IEluc3RhbmNlIHJlcXVlc3RcbiAgICogaXMgY2xvc2VkLlxuICAgKi9cbiAgT05FX1RJTUUgPSAnb25lLXRpbWUnLFxuXG4gIC8qKlxuICAgKiBBIHBlcnNpc3RlbnQgU3BvdCBJbnN0YW5jZSByZXF1ZXN0IHJlbWFpbnMgYWN0aXZlIHVudGlsIGl0IGV4cGlyZXMgb3IgeW91IGNhbmNlbCBpdCwgZXZlbiBpZlxuICAgKiB0aGUgcmVxdWVzdCBpcyBmdWxmaWxsZWQuIElmIHRoZSBTcG90IHByaWNlIGV4Y2VlZHMgeW91ciBtYXhpbXVtIHByaWNlIG9yIGNhcGFjaXR5IGlzIG5vdCBhdmFpbGFibGUsXG4gICAqIHlvdXIgU3BvdCBJbnN0YW5jZSBpcyBpbnRlcnJ1cHRlZC4gQWZ0ZXIgeW91ciBpbnN0YW5jZSBpcyBpbnRlcnJ1cHRlZCwgd2hlbiB5b3VyIG1heGltdW0gcHJpY2UgZXhjZWVkc1xuICAgKiB0aGUgU3BvdCBwcmljZSBvciBjYXBhY2l0eSBiZWNvbWVzIGF2YWlsYWJsZSBhZ2FpbiwgdGhlIFNwb3QgSW5zdGFuY2UgaXMgc3RhcnRlZCBpZiBzdG9wcGVkIG9yIHJlc3VtZWRcbiAgICogaWYgaGliZXJuYXRlZC5cbiAgICovXG4gIFBFUlNJU1RFTlQgPSAncGVyc2lzdGVudCcsXG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgU3BvdCBtYXJrZXQgaW5zdGFuY2Ugb3B0aW9ucyBwcm92aWRlZCBpbiBhIExhdW5jaFRlbXBsYXRlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhdW5jaFRlbXBsYXRlU3BvdE9wdGlvbnMge1xuICAvKipcbiAgICogU3BvdCBJbnN0YW5jZXMgd2l0aCBhIGRlZmluZWQgZHVyYXRpb24gKGFsc28ga25vd24gYXMgU3BvdCBibG9ja3MpIGFyZSBkZXNpZ25lZCBub3QgdG8gYmUgaW50ZXJydXB0ZWQgYW5kIHdpbGwgcnVuIGNvbnRpbnVvdXNseSBmb3IgdGhlIGR1cmF0aW9uIHlvdSBzZWxlY3QuXG4gICAqIFlvdSBjYW4gdXNlIGEgZHVyYXRpb24gb2YgMSwgMiwgMywgNCwgNSwgb3IgNiBob3Vycy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvc3BvdC1yZXF1ZXN0cy5odG1sI2ZpeGVkLWR1cmF0aW9uLXNwb3QtaW5zdGFuY2VzXG4gICAqXG4gICAqIEBkZWZhdWx0IFJlcXVlc3RlZCBzcG90IGluc3RhbmNlcyBkbyBub3QgaGF2ZSBhIHByZS1kZWZpbmVkIGR1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYmxvY2tEdXJhdGlvbj86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgYmVoYXZpb3Igd2hlbiBhIFNwb3QgSW5zdGFuY2UgaXMgaW50ZXJydXB0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IFNwb3QgaW5zdGFuY2VzIHdpbGwgdGVybWluYXRlIHdoZW4gaW50ZXJydXB0ZWQuXG4gICAqL1xuICByZWFkb25seSBpbnRlcnJ1cHRpb25CZWhhdmlvcj86IFNwb3RJbnN0YW5jZUludGVycnVwdGlvbjtcblxuICAvKipcbiAgICogTWF4aW11bSBob3VybHkgcHJpY2UgeW91J3JlIHdpbGxpbmcgdG8gcGF5IGZvciBlYWNoIFNwb3QgaW5zdGFuY2UuIFRoZSB2YWx1ZSBpcyBnaXZlblxuICAgKiBpbiBkb2xsYXJzLiBleDogMC4wMSBmb3IgMSBjZW50IHBlciBob3VyLCBvciAwLjAwMSBmb3Igb25lLXRlbnRoIG9mIGEgY2VudCBwZXIgaG91ci5cbiAgICpcbiAgICogQGRlZmF1bHQgTWF4aW11bSBob3VybHkgcHJpY2Ugd2lsbCBkZWZhdWx0IHRvIHRoZSBvbi1kZW1hbmQgcHJpY2UgZm9yIHRoZSBpbnN0YW5jZSB0eXBlLlxuICAgKi9cbiAgcmVhZG9ubHkgbWF4UHJpY2U/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBTcG90IEluc3RhbmNlIHJlcXVlc3QgdHlwZS5cbiAgICpcbiAgICogSWYgeW91IGFyZSB1c2luZyBTcG90IEluc3RhbmNlcyB3aXRoIGFuIEF1dG8gU2NhbGluZyBncm91cCwgdXNlIG9uZS10aW1lIHJlcXVlc3RzLCBhcyB0aGVcbiAgICogQW1hem9uIEVDMiBBdXRvIFNjYWxpbmcgc2VydmljZSBoYW5kbGVzIHJlcXVlc3RpbmcgbmV3IFNwb3QgSW5zdGFuY2VzIHdoZW5ldmVyIHRoZSBncm91cCBpc1xuICAgKiBiZWxvdyBpdHMgZGVzaXJlZCBjYXBhY2l0eS5cbiAgICpcbiAgICogQGRlZmF1bHQgT25lLXRpbWUgc3BvdCByZXF1ZXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdFR5cGU/OiBTcG90UmVxdWVzdFR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBlbmQgZGF0ZSBvZiB0aGUgcmVxdWVzdC4gRm9yIGEgb25lLXRpbWUgcmVxdWVzdCwgdGhlIHJlcXVlc3QgcmVtYWlucyBhY3RpdmUgdW50aWwgYWxsIGluc3RhbmNlc1xuICAgKiBsYXVuY2gsIHRoZSByZXF1ZXN0IGlzIGNhbmNlbGVkLCBvciB0aGlzIGRhdGUgaXMgcmVhY2hlZC4gSWYgdGhlIHJlcXVlc3QgaXMgcGVyc2lzdGVudCwgaXQgcmVtYWluc1xuICAgKiBhY3RpdmUgdW50aWwgaXQgaXMgY2FuY2VsZWQgb3IgdGhpcyBkYXRlIGFuZCB0aW1lIGlzIHJlYWNoZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IFRoZSBkZWZhdWx0IGVuZCBkYXRlIGlzIDcgZGF5cyBmcm9tIHRoZSBjdXJyZW50IGRhdGUuXG4gICAqL1xuICByZWFkb25seSB2YWxpZFVudGlsPzogRXhwaXJhdGlvbjtcbn07XG5cbi8qKlxuICogVGhlIHN0YXRlIG9mIHRva2VuIHVzYWdlIGZvciB5b3VyIGluc3RhbmNlIG1ldGFkYXRhIHJlcXVlc3RzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMuaHRtbCNjZm4tZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMtaHR0cHRva2Vuc1xuICovXG5leHBvcnQgZW51bSBMYXVuY2hUZW1wbGF0ZUh0dHBUb2tlbnMge1xuICAvKipcbiAgICogSWYgdGhlIHN0YXRlIGlzIG9wdGlvbmFsLCB5b3UgY2FuIGNob29zZSB0byByZXRyaWV2ZSBpbnN0YW5jZSBtZXRhZGF0YSB3aXRoIG9yIHdpdGhvdXQgYSBzaWduZWQgdG9rZW4gaGVhZGVyIG9uIHlvdXIgcmVxdWVzdC5cbiAgICovXG4gIE9QVElPTkFMID0gJ29wdGlvbmFsJyxcbiAgLyoqXG4gICAqIElmIHRoZSBzdGF0ZSBpcyByZXF1aXJlZCwgeW91IG11c3Qgc2VuZCBhIHNpZ25lZCB0b2tlbiBoZWFkZXIgd2l0aCBhbnkgaW5zdGFuY2UgbWV0YWRhdGEgcmV0cmlldmFsIHJlcXVlc3RzLiBJbiB0aGlzIHN0YXRlLFxuICAgKiByZXRyaWV2aW5nIHRoZSBJQU0gcm9sZSBjcmVkZW50aWFscyBhbHdheXMgcmV0dXJucyB0aGUgdmVyc2lvbiAyLjAgY3JlZGVudGlhbHM7IHRoZSB2ZXJzaW9uIDEuMCBjcmVkZW50aWFscyBhcmUgbm90IGF2YWlsYWJsZS5cbiAgICovXG4gIFJFUVVJUkVEID0gJ3JlcXVpcmVkJyxcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG9mIGEgTGF1bmNoVGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF1bmNoVGVtcGxhdGVQcm9wcyB7XG4gIC8qKlxuICAgKiBOYW1lIGZvciB0aGlzIGxhdW5jaCB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgQXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgbGF1bmNoVGVtcGxhdGVOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGluc3RhbmNlIHRvIGxhdW5jaC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGlzIExhdW5jaCBUZW1wbGF0ZSBkb2VzIG5vdCBzcGVjaWZ5IGEgZGVmYXVsdCBJbnN0YW5jZSBUeXBlLlxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VUeXBlPzogSW5zdGFuY2VUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgQU1JIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IGluc3RhbmNlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGlzIExhdW5jaCBUZW1wbGF0ZSBkb2VzIG5vdCBzcGVjaWZ5IGEgZGVmYXVsdCBBTUkuXG4gICAqL1xuICByZWFkb25seSBtYWNoaW5lSW1hZ2U/OiBJTWFjaGluZUltYWdlO1xuXG4gIC8qKlxuICAgKiBUaGUgQU1JIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IGluc3RhbmNlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGlzIExhdW5jaCBUZW1wbGF0ZSBjcmVhdGVzIGEgVXNlckRhdGEgYmFzZWQgb24gdGhlIHR5cGUgb2YgcHJvdmlkZWRcbiAgICogbWFjaGluZUltYWdlOyBubyBVc2VyRGF0YSBpcyBjcmVhdGVkIGlmIGEgbWFjaGluZUltYWdlIGlzIG5vdCBwcm92aWRlZFxuICAgKi9cbiAgcmVhZG9ubHkgdXNlckRhdGE/OiBVc2VyRGF0YTtcblxuICAvKipcbiAgICogQW4gSUFNIHJvbGUgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGluc3RhbmNlIHByb2ZpbGUgdGhhdCBpcyB1c2VkIGJ5IGluc3RhbmNlcy5cbiAgICpcbiAgICogVGhlIHJvbGUgbXVzdCBiZSBhc3N1bWFibGUgYnkgdGhlIHNlcnZpY2UgcHJpbmNpcGFsIGBlYzIuYW1hem9uYXdzLmNvbWA6XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ015Um9sZScsIHtcbiAgICogICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKVxuICAgKiB9KTtcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBuZXcgcm9sZSBpcyBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGhvdyBibG9jayBkZXZpY2VzIGFyZSBleHBvc2VkIHRvIHRoZSBpbnN0YW5jZS4gWW91IGNhbiBzcGVjaWZ5IHZpcnR1YWwgZGV2aWNlcyBhbmQgRUJTIHZvbHVtZXMuXG4gICAqXG4gICAqIEVhY2ggaW5zdGFuY2UgdGhhdCBpcyBsYXVuY2hlZCBoYXMgYW4gYXNzb2NpYXRlZCByb290IGRldmljZSB2b2x1bWUsXG4gICAqIGVpdGhlciBhbiBBbWF6b24gRUJTIHZvbHVtZSBvciBhbiBpbnN0YW5jZSBzdG9yZSB2b2x1bWUuXG4gICAqIFlvdSBjYW4gdXNlIGJsb2NrIGRldmljZSBtYXBwaW5ncyB0byBzcGVjaWZ5IGFkZGl0aW9uYWwgRUJTIHZvbHVtZXMgb3JcbiAgICogaW5zdGFuY2Ugc3RvcmUgdm9sdW1lcyB0byBhdHRhY2ggdG8gYW4gaW5zdGFuY2Ugd2hlbiBpdCBpcyBsYXVuY2hlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvYmxvY2stZGV2aWNlLW1hcHBpbmctY29uY2VwdHMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFVzZXMgdGhlIGJsb2NrIGRldmljZSBtYXBwaW5nIG9mIHRoZSBBTUlcbiAgICovXG4gIHJlYWRvbmx5IGJsb2NrRGV2aWNlcz86IEJsb2NrRGV2aWNlW107XG5cbiAgLyoqXG4gICAqIENQVSBjcmVkaXQgdHlwZSBmb3IgYnVyc3RhYmxlIEVDMiBpbnN0YW5jZSB0eXBlcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvYnVyc3RhYmxlLXBlcmZvcm1hbmNlLWluc3RhbmNlcy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY3JlZGl0IHR5cGUgaXMgc3BlY2lmaWVkIGluIHRoZSBMYXVuY2ggVGVtcGxhdGUuXG4gICAqL1xuICByZWFkb25seSBjcHVDcmVkaXRzPzogQ3B1Q3JlZGl0cztcblxuICAvKipcbiAgICogSWYgeW91IHNldCB0aGlzIHBhcmFtZXRlciB0byB0cnVlLCB5b3UgY2Fubm90IHRlcm1pbmF0ZSB0aGUgaW5zdGFuY2VzIGxhdW5jaGVkIHdpdGggdGhpcyBsYXVuY2ggdGVtcGxhdGVcbiAgICogdXNpbmcgdGhlIEFtYXpvbiBFQzIgY29uc29sZSwgQ0xJLCBvciBBUEk7IG90aGVyd2lzZSwgeW91IGNhbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgQVBJIHRlcm1pbmF0aW9uIHNldHRpbmcgaXMgbm90IHNwZWNpZmllZCBpbiB0aGUgTGF1bmNoIFRlbXBsYXRlLlxuICAgKi9cbiAgcmVhZG9ubHkgZGlzYWJsZUFwaVRlcm1pbmF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGluc3RhbmNlcyBhcmUgb3B0aW1pemVkIGZvciBBbWF6b24gRUJTIEkvTy4gVGhpcyBvcHRpbWl6YXRpb24gcHJvdmlkZXMgZGVkaWNhdGVkIHRocm91Z2hwdXRcbiAgICogdG8gQW1hem9uIEVCUyBhbmQgYW4gb3B0aW1pemVkIGNvbmZpZ3VyYXRpb24gc3RhY2sgdG8gcHJvdmlkZSBvcHRpbWFsIEFtYXpvbiBFQlMgSS9PIHBlcmZvcm1hbmNlLiBUaGlzIG9wdGltaXphdGlvblxuICAgKiBpc24ndCBhdmFpbGFibGUgd2l0aCBhbGwgaW5zdGFuY2UgdHlwZXMuIEFkZGl0aW9uYWwgdXNhZ2UgY2hhcmdlcyBhcHBseSB3aGVuIHVzaW5nIGFuIEVCUy1vcHRpbWl6ZWQgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRUJTIG9wdGltaXphdGlvbiBpcyBub3Qgc3BlY2lmaWVkIGluIHRoZSBsYXVuY2ggdGVtcGxhdGUuXG4gICAqL1xuICByZWFkb25seSBlYnNPcHRpbWl6ZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiB0aGlzIHBhcmFtZXRlciBpcyBzZXQgdG8gdHJ1ZSwgdGhlIGluc3RhbmNlIGlzIGVuYWJsZWQgZm9yIEFXUyBOaXRybyBFbmNsYXZlczsgb3RoZXJ3aXNlLCBpdCBpcyBub3QgZW5hYmxlZCBmb3IgQVdTIE5pdHJvIEVuY2xhdmVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEVuYWJsZW1lbnQgb2YgTml0cm8gZW5jbGF2ZXMgaXMgbm90IHNwZWNpZmllZCBpbiB0aGUgbGF1bmNoIHRlbXBsYXRlOyBkZWZhdWx0aW5nIHRvIGZhbHNlLlxuICAgKi9cbiAgcmVhZG9ubHkgbml0cm9FbmNsYXZlRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHlvdSBzZXQgdGhpcyBwYXJhbWV0ZXIgdG8gdHJ1ZSwgdGhlIGluc3RhbmNlIGlzIGVuYWJsZWQgZm9yIGhpYmVybmF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEhpYmVybmF0aW9uIGNvbmZpZ3VyYXRpb24gaXMgbm90IHNwZWNpZmllZCBpbiB0aGUgbGF1bmNoIHRlbXBsYXRlOyBkZWZhdWx0aW5nIHRvIGZhbHNlLlxuICAgKi9cbiAgcmVhZG9ubHkgaGliZXJuYXRpb25Db25maWd1cmVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgYW4gaW5zdGFuY2Ugc3RvcHMgb3IgdGVybWluYXRlcyB3aGVuIHlvdSBpbml0aWF0ZSBzaHV0ZG93biBmcm9tIHRoZSBpbnN0YW5jZSAodXNpbmcgdGhlIG9wZXJhdGluZyBzeXN0ZW0gY29tbWFuZCBmb3Igc3lzdGVtIHNodXRkb3duKS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvdGVybWluYXRpbmctaW5zdGFuY2VzLmh0bWwjVXNpbmdfQ2hhbmdpbmdJbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3JcbiAgICpcbiAgICogQGRlZmF1bHQgLSBTaHV0ZG93biBiZWhhdmlvciBpcyBub3Qgc3BlY2lmaWVkIGluIHRoZSBsYXVuY2ggdGVtcGxhdGU7IGRlZmF1bHRzIHRvIFNUT1AuXG4gICAqL1xuICByZWFkb25seSBpbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3I/OiBJbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3I7XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgcHJvcGVydHkgaXMgZGVmaW5lZCwgdGhlbiB0aGUgTGF1bmNoIFRlbXBsYXRlJ3MgSW5zdGFuY2VNYXJrZXRPcHRpb25zIHdpbGwgYmVcbiAgICogc2V0IHRvIHVzZSBTcG90IGluc3RhbmNlcywgYW5kIHRoZSBvcHRpb25zIGZvciB0aGUgU3BvdCBpbnN0YW5jZXMgd2lsbCBiZSBhcyBkZWZpbmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEluc3RhbmNlIGxhdW5jaGVkIHdpdGggdGhpcyB0ZW1wbGF0ZSB3aWxsIG5vdCBiZSBzcG90IGluc3RhbmNlcy5cbiAgICovXG4gIHJlYWRvbmx5IHNwb3RPcHRpb25zPzogTGF1bmNoVGVtcGxhdGVTcG90T3B0aW9ucztcblxuICAvKipcbiAgICogTmFtZSBvZiBTU0gga2V5cGFpciB0byBncmFudCBhY2Nlc3MgdG8gaW5zdGFuY2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBTU0ggYWNjZXNzIHdpbGwgYmUgcG9zc2libGUuXG4gICAqL1xuICByZWFkb25seSBrZXlOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiBzZXQgdG8gdHJ1ZSwgdGhlbiBkZXRhaWxlZCBtb25pdG9yaW5nIHdpbGwgYmUgZW5hYmxlZCBvbiBpbnN0YW5jZXMgY3JlYXRlZCB3aXRoIHRoaXNcbiAgICogbGF1bmNoIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS91c2luZy1jbG91ZHdhdGNoLW5ldy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IEZhbHNlIC0gRGV0YWlsZWQgbW9uaXRvcmluZyBpcyBkaXNhYmxlZC5cbiAgICovXG4gIHJlYWRvbmx5IGRldGFpbGVkTW9uaXRvcmluZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNlY3VyaXR5IGdyb3VwIHRvIGFzc2lnbiB0byBpbnN0YW5jZXMgY3JlYXRlZCB3aXRoIHRoZSBsYXVuY2ggdGVtcGxhdGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHNlY3VyaXR5IGdyb3VwIGlzIGFzc2lnbmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cD86IElTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIElNRFN2MiBzaG91bGQgYmUgcmVxdWlyZWQgb24gbGF1bmNoZWQgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSByZXF1aXJlSW1kc3YyPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRW5hYmxlcyBvciBkaXNhYmxlcyB0aGUgSFRUUCBtZXRhZGF0YSBlbmRwb2ludCBvbiB5b3VyIGluc3RhbmNlcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy1odHRwZW5kcG9pbnRcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cEVuZHBvaW50PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRW5hYmxlcyBvciBkaXNhYmxlcyB0aGUgSVB2NiBlbmRwb2ludCBmb3IgdGhlIGluc3RhbmNlIG1ldGFkYXRhIHNlcnZpY2UuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMuaHRtbCNjZm4tZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMtaHR0cHByb3RvY29saXB2NlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBodHRwUHJvdG9jb2xJcHY2PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGRlc2lyZWQgSFRUUCBQVVQgcmVzcG9uc2UgaG9wIGxpbWl0IGZvciBpbnN0YW5jZSBtZXRhZGF0YSByZXF1ZXN0cy4gVGhlIGxhcmdlciB0aGUgbnVtYmVyLCB0aGUgZnVydGhlciBpbnN0YW5jZSBtZXRhZGF0YSByZXF1ZXN0cyBjYW4gdHJhdmVsLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLmh0bWwjY2ZuLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLWh0dHBwdXRyZXNwb25zZWhvcGxpbWl0XG4gICAqXG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IGh0dHBQdXRSZXNwb25zZUhvcExpbWl0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhdGUgb2YgdG9rZW4gdXNhZ2UgZm9yIHlvdXIgaW5zdGFuY2UgbWV0YWRhdGEgcmVxdWVzdHMuICBUaGUgZGVmYXVsdCBzdGF0ZSBpcyBgb3B0aW9uYWxgIGlmIG5vdCBzcGVjaWZpZWQuIEhvd2V2ZXIsXG4gICAqIGlmIHJlcXVpcmVJbWRzdjIgaXMgdHJ1ZSwgdGhlIHN0YXRlIG11c3QgYmUgYHJlcXVpcmVkYC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy1odHRwdG9rZW5zXG4gICAqXG4gICAqIEBkZWZhdWx0IExhdW5jaFRlbXBsYXRlSHR0cFRva2Vucy5PUFRJT05BTFxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cFRva2Vucz86IExhdW5jaFRlbXBsYXRlSHR0cFRva2VucztcblxuICAvKipcbiAgICogU2V0IHRvIGVuYWJsZWQgdG8gYWxsb3cgYWNjZXNzIHRvIGluc3RhbmNlIHRhZ3MgZnJvbSB0aGUgaW5zdGFuY2UgbWV0YWRhdGEuIFNldCB0byBkaXNhYmxlZCB0byB0dXJuIG9mZiBhY2Nlc3MgdG8gaW5zdGFuY2UgdGFncyBmcm9tIHRoZSBpbnN0YW5jZSBtZXRhZGF0YS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLW1ldGFkYXRhb3B0aW9ucy1pbnN0YW5jZW1ldGFkYXRhdGFnc1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VNZXRhZGF0YVRhZ3M/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgY2xhc3MgdGhhdCBwcm92aWRlcyBjb252ZW5pZW50IGFjY2VzcyB0byBzcGVjaWFsIHZlcnNpb24gdG9rZW5zIGZvciBMYXVuY2hUZW1wbGF0ZVxuICogdmVyc2lvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXVuY2hUZW1wbGF0ZVNwZWNpYWxWZXJzaW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgc3BlY2lhbCB2YWx1ZSB0aGF0IGRlbm90ZXMgdGhhdCB1c2VycyBvZiBhIExhdW5jaCBUZW1wbGF0ZSBzaG91bGRcbiAgICogcmVmZXJlbmNlIHRoZSBMQVRFU1QgdmVyc2lvbiBvZiB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExBVEVTVF9WRVJTSU9OOiBzdHJpbmcgPSAnJExhdGVzdCc7XG5cbiAgLyoqXG4gICAqIFRoZSBzcGVjaWFsIHZhbHVlIHRoYXQgZGVub3RlcyB0aGF0IHVzZXJzIG9mIGEgTGF1bmNoIFRlbXBsYXRlIHNob3VsZFxuICAgKiByZWZlcmVuY2UgdGhlIERFRkFVTFQgdmVyc2lvbiBvZiB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfVkVSU0lPTjogc3RyaW5nID0gJyREZWZhdWx0Jztcbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIGZvciBhbiBpbXBvcnRlZCBMYXVuY2hUZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYXVuY2hUZW1wbGF0ZUF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIHZlcnNpb24gbnVtYmVyIG9mIHRoaXMgbGF1bmNoIHRlbXBsYXRlIHRvIHVzZVxuICAgKlxuICAgKiBAZGVmYXVsdCBWZXJzaW9uOiBcIiREZWZhdWx0XCJcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25OdW1iZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBMYXVuY2ggVGVtcGxhdGVcbiAgICpcbiAgICogRXhhY3RseSBvbmUgb2YgYGxhdW5jaFRlbXBsYXRlSWRgIGFuZCBgbGF1bmNoVGVtcGxhdGVOYW1lYCBtYXkgYmUgc2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBOb25lXG4gICAqL1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZUlkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgTGF1bmNoIFRlbXBsYXRlXG4gICAqXG4gICAqIEV4YWN0bHkgb25lIG9mIGBsYXVuY2hUZW1wbGF0ZUlkYCBhbmQgYGxhdW5jaFRlbXBsYXRlTmFtZWAgbWF5IGJlIHNldC5cbiAgICpcbiAgICogQGRlZmF1bHQgTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgbGF1bmNoVGVtcGxhdGVOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoaXMgcmVwcmVzZW50cyBhbiBFQzIgTGF1bmNoVGVtcGxhdGUuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvZWMyLWxhdW5jaC10ZW1wbGF0ZXMuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgTGF1bmNoVGVtcGxhdGUgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElMYXVuY2hUZW1wbGF0ZSwgaWFtLklHcmFudGFibGUsIElDb25uZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgTGF1bmNoVGVtcGxhdGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21MYXVuY2hUZW1wbGF0ZUF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IExhdW5jaFRlbXBsYXRlQXR0cmlidXRlcyk6IElMYXVuY2hUZW1wbGF0ZSB7XG4gICAgY29uc3QgaGF2ZUlkID0gQm9vbGVhbihhdHRycy5sYXVuY2hUZW1wbGF0ZUlkKTtcbiAgICBjb25zdCBoYXZlTmFtZSA9IEJvb2xlYW4oYXR0cnMubGF1bmNoVGVtcGxhdGVOYW1lKTtcbiAgICBpZiAoaGF2ZUlkID09IGhhdmVOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xhdW5jaFRlbXBsYXRlLmZyb21MYXVuY2hUZW1wbGF0ZUF0dHJpYnV0ZXMoKSByZXF1aXJlcyBleGFjdGx5IG9uZSBvZiBsYXVuY2hUZW1wbGF0ZUlkIG9yIGxhdW5jaFRlbXBsYXRlTmFtZSBiZSBwcm92aWRlZC4nKTtcbiAgICB9XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElMYXVuY2hUZW1wbGF0ZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbk51bWJlciA9IGF0dHJzLnZlcnNpb25OdW1iZXIgPz8gTGF1bmNoVGVtcGxhdGVTcGVjaWFsVmVyc2lvbnMuREVGQVVMVF9WRVJTSU9OO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlSWQ/ID0gYXR0cnMubGF1bmNoVGVtcGxhdGVJZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBsYXVuY2hUZW1wbGF0ZU5hbWU/ID0gYXR0cnMubGF1bmNoVGVtcGxhdGVOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gICBNZW1iZXJzIGZvciBJTGF1bmNoVGVtcGxhdGUgaW50ZXJmYWNlXG5cbiAgcHVibGljIHJlYWRvbmx5IHZlcnNpb25OdW1iZXI6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlSWQ/OiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBsYXVuY2hUZW1wbGF0ZU5hbWU/OiBzdHJpbmc7XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vICAgRGF0YSBtZW1iZXJzXG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHZlcnNpb24gZm9yIHRoZSBsYXVuY2ggdGVtcGxhdGUuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0VmVyc2lvbk51bWJlcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbGF0ZXN0IHZlcnNpb24gb2YgdGhlIGxhdW5jaCB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxhdGVzdFZlcnNpb25OdW1iZXI6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgT1MgdGhlIGluc3RhbmNlIGlzIHJ1bm5pbmcuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBvc1R5cGU/OiBPcGVyYXRpbmdTeXN0ZW1UeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgQU1JIElEIG9mIHRoZSBpbWFnZSB0byB1c2VcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGltYWdlSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElBTSBSb2xlIGFzc3VtZWQgYnkgaW5zdGFuY2VzIHRoYXQgYXJlIGxhdW5jaGVkIGZyb20gdGhpcyB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFVzZXJEYXRhIGV4ZWN1dGVkIGJ5IGluc3RhbmNlcyB0aGF0IGFyZSBsYXVuY2hlZCBmcm9tIHRoaXMgdGVtcGxhdGUuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGluc3RhbmNlIHRvIGxhdW5jaC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGluc3RhbmNlVHlwZT86IEluc3RhbmNlVHlwZTtcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gICBQcml2YXRlL3Byb3RlY3RlZCBkYXRhIG1lbWJlcnNcblxuICAvKipcbiAgICogUHJpbmNpcGFsIHRvIGdyYW50IHBlcm1pc3Npb25zIHRvLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZ3JhbnRQcmluY2lwYWw/OiBpYW0uSVByaW5jaXBhbDtcblxuICAvKipcbiAgICogQWxsb3dzIHNwZWNpZnlpbmcgc2VjdXJpdHkgZ3JvdXAgY29ubmVjdGlvbnMgZm9yIHRoZSBpbnN0YW5jZS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX2Nvbm5lY3Rpb25zPzogQ29ubmVjdGlvbnM7XG5cbiAgLyoqXG4gICAqIFRhZ01hbmFnZXIgZm9yIHRhZ2dpbmcgc3VwcG9ydC5cbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSB0YWdzOiBUYWdNYW5hZ2VyO1xuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBMYXVuY2hUZW1wbGF0ZVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gQmFzaWMgdmFsaWRhdGlvbiBvZiB0aGUgcHJvdmlkZWQgc3BvdCBibG9jayBkdXJhdGlvblxuICAgIGNvbnN0IHNwb3REdXJhdGlvbiA9IHByb3BzPy5zcG90T3B0aW9ucz8uYmxvY2tEdXJhdGlvbj8udG9Ib3Vycyh7IGludGVncmFsOiB0cnVlIH0pO1xuICAgIGlmIChzcG90RHVyYXRpb24gIT09IHVuZGVmaW5lZCAmJiAoc3BvdER1cmF0aW9uIDwgMSB8fCBzcG90RHVyYXRpb24gPiA2KSkge1xuICAgICAgLy8gU2VlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvc3BvdC1yZXF1ZXN0cy5odG1sI2ZpeGVkLWR1cmF0aW9uLXNwb3QtaW5zdGFuY2VzXG4gICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRFcnJvcignU3BvdCBibG9jayBkdXJhdGlvbiBtdXN0IGJlIGV4YWN0bHkgMSwgMiwgMywgNCwgNSwgb3IgNiBob3Vycy4nKTtcbiAgICB9XG5cbiAgICAvLyBCYXNpYyB2YWxpZGF0aW9uIG9mIHRoZSBwcm92aWRlZCBodHRwUHV0UmVzcG9uc2VIb3BMaW1pdFxuICAgIGlmIChwcm9wcy5odHRwUHV0UmVzcG9uc2VIb3BMaW1pdCAhPT0gdW5kZWZpbmVkICYmIChwcm9wcy5odHRwUHV0UmVzcG9uc2VIb3BMaW1pdCA8IDEgfHwgcHJvcHMuaHR0cFB1dFJlc3BvbnNlSG9wTGltaXQgPiA2NCkpIHtcbiAgICAgIC8vIFNlZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMuaHRtbCNjZm4tZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMtaHR0cHB1dHJlc3BvbnNlaG9wbGltaXRcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZEVycm9yKCdIdHRwUHV0UmVzcG9uc2VIb3BMaW1pdCBtdXN0IGJldHdlZW4gMSBhbmQgNjQnKTtcbiAgICB9XG5cbiAgICB0aGlzLnJvbGUgPSBwcm9wcy5yb2xlO1xuICAgIHRoaXMuX2dyYW50UHJpbmNpcGFsID0gdGhpcy5yb2xlO1xuICAgIGNvbnN0IGlhbVByb2ZpbGU6IGlhbS5DZm5JbnN0YW5jZVByb2ZpbGUgfCB1bmRlZmluZWQgPSB0aGlzLnJvbGUgPyBuZXcgaWFtLkNmbkluc3RhbmNlUHJvZmlsZSh0aGlzLCAnUHJvZmlsZScsIHtcbiAgICAgIHJvbGVzOiBbdGhpcy5yb2xlIS5yb2xlTmFtZV0sXG4gICAgfSkgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cCkge1xuICAgICAgdGhpcy5fY29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbnMoeyBzZWN1cml0eUdyb3VwczogW3Byb3BzLnNlY3VyaXR5R3JvdXBdIH0pO1xuICAgIH1cbiAgICBjb25zdCBzZWN1cml0eUdyb3Vwc1Rva2VuID0gTGF6eS5saXN0KHtcbiAgICAgIHByb2R1Y2U6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25zICYmIHRoaXMuX2Nvbm5lY3Rpb25zLnNlY3VyaXR5R3JvdXBzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMubWFwKHNnID0+IHNnLnNlY3VyaXR5R3JvdXBJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbWFnZUNvbmZpZzogTWFjaGluZUltYWdlQ29uZmlnIHwgdW5kZWZpbmVkID0gcHJvcHMubWFjaGluZUltYWdlPy5nZXRJbWFnZSh0aGlzKTtcbiAgICBpZiAoaW1hZ2VDb25maWcpIHtcbiAgICAgIHRoaXMub3NUeXBlID0gaW1hZ2VDb25maWcub3NUeXBlO1xuICAgICAgdGhpcy5pbWFnZUlkID0gaW1hZ2VDb25maWcuaW1hZ2VJZDtcbiAgICB9XG5cbiAgICBpZiAoRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5FQzJfTEFVTkNIX1RFTVBMQVRFX0RFRkFVTFRfVVNFUl9EQVRBKSkge1xuICAgICAgLy8gcHJpb3JpdHk6IHByb3AudXNlckRhdGEgLT4gdXNlckRhdGEgZnJvbSBtYWNoaW5lSW1hZ2UgLT4gdW5kZWZpbmVkXG4gICAgICB0aGlzLnVzZXJEYXRhID0gcHJvcHMudXNlckRhdGEgPz8gaW1hZ2VDb25maWc/LnVzZXJEYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJvcHMudXNlckRhdGEpIHtcbiAgICAgICAgdGhpcy51c2VyRGF0YSA9IHByb3BzLnVzZXJEYXRhO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB1c2VyRGF0YVRva2VuID0gTGF6eS5zdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy51c2VyRGF0YSkge1xuICAgICAgICAgIHJldHVybiBGbi5iYXNlNjQodGhpcy51c2VyRGF0YS5yZW5kZXIoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmluc3RhbmNlVHlwZSA9IHByb3BzLmluc3RhbmNlVHlwZTtcblxuICAgIGxldCBtYXJrZXRPcHRpb25zOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHByb3BzPy5zcG90T3B0aW9ucykge1xuICAgICAgbWFya2V0T3B0aW9ucyA9IHtcbiAgICAgICAgbWFya2V0VHlwZTogJ3Nwb3QnLFxuICAgICAgICBzcG90T3B0aW9uczoge1xuICAgICAgICAgIGJsb2NrRHVyYXRpb25NaW51dGVzOiBzcG90RHVyYXRpb24gIT09IHVuZGVmaW5lZCA/IHNwb3REdXJhdGlvbiAqIDYwIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGluc3RhbmNlSW50ZXJydXB0aW9uQmVoYXZpb3I6IHByb3BzLnNwb3RPcHRpb25zLmludGVycnVwdGlvbkJlaGF2aW9yLFxuICAgICAgICAgIG1heFByaWNlOiBwcm9wcy5zcG90T3B0aW9ucy5tYXhQcmljZT8udG9TdHJpbmcoKSxcbiAgICAgICAgICBzcG90SW5zdGFuY2VUeXBlOiBwcm9wcy5zcG90T3B0aW9ucy5yZXF1ZXN0VHlwZSxcbiAgICAgICAgICB2YWxpZFVudGlsOiBwcm9wcy5zcG90T3B0aW9ucy52YWxpZFVudGlsPy5kYXRlLnRvVVRDU3RyaW5nKCksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgLy8gUmVtb3ZlIFNwb3RPcHRpb25zIGlmIHRoZXJlIGFyZSBub25lLlxuICAgICAgaWYgKE9iamVjdC5rZXlzKG1hcmtldE9wdGlvbnMuc3BvdE9wdGlvbnMpLmZpbHRlcihrID0+IG1hcmtldE9wdGlvbnMuc3BvdE9wdGlvbnNba10pLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIG1hcmtldE9wdGlvbnMuc3BvdE9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50YWdzID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5LRVlfVkFMVUUsICdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnKTtcblxuICAgIGNvbnN0IHRhZ3NUb2tlbiA9IExhenkuYW55KHtcbiAgICAgIHByb2R1Y2U6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMudGFncy5oYXNUYWdzKCkpIHtcbiAgICAgICAgICBjb25zdCByZW5kZXJlZFRhZ3MgPSB0aGlzLnRhZ3MucmVuZGVyVGFncygpO1xuICAgICAgICAgIGNvbnN0IGxvd2VyQ2FzZVJlbmRlcmVkVGFncyA9IHJlbmRlcmVkVGFncy5tYXAoICh0YWc6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAga2V5OiB0YWcuS2V5LFxuICAgICAgICAgICAgICB2YWx1ZTogdGFnLlZhbHVlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByZXNvdXJjZVR5cGU6ICdpbnN0YW5jZScsXG4gICAgICAgICAgICAgIHRhZ3M6IGxvd2VyQ2FzZVJlbmRlcmVkVGFncyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJlc291cmNlVHlwZTogJ3ZvbHVtZScsXG4gICAgICAgICAgICAgIHRhZ3M6IGxvd2VyQ2FzZVJlbmRlcmVkVGFncyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGx0VGFnc1Rva2VuID0gTGF6eS5hbnkoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy50YWdzLmhhc1RhZ3MoKSkge1xuICAgICAgICAgIGNvbnN0IHJlbmRlcmVkVGFncyA9IHRoaXMudGFncy5yZW5kZXJUYWdzKCk7XG4gICAgICAgICAgY29uc3QgbG93ZXJDYXNlUmVuZGVyZWRUYWdzID0gcmVuZGVyZWRUYWdzLm1hcCggKHRhZzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmd9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBrZXk6IHRhZy5LZXksXG4gICAgICAgICAgICAgIHZhbHVlOiB0YWcuVmFsdWUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJlc291cmNlVHlwZTogJ2xhdW5jaC10ZW1wbGF0ZScsXG4gICAgICAgICAgICAgIHRhZ3M6IGxvd2VyQ2FzZVJlbmRlcmVkVGFncyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkxhdW5jaFRlbXBsYXRlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlTmFtZTogcHJvcHM/LmxhdW5jaFRlbXBsYXRlTmFtZSxcbiAgICAgIGxhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBibG9ja0RldmljZU1hcHBpbmdzOiBwcm9wcz8uYmxvY2tEZXZpY2VzICE9PSB1bmRlZmluZWQgPyBsYXVuY2hUZW1wbGF0ZUJsb2NrRGV2aWNlTWFwcGluZ3ModGhpcywgcHJvcHMuYmxvY2tEZXZpY2VzKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3JlZGl0U3BlY2lmaWNhdGlvbjogcHJvcHM/LmNwdUNyZWRpdHMgIT09IHVuZGVmaW5lZCA/IHtcbiAgICAgICAgICBjcHVDcmVkaXRzOiBwcm9wcy5jcHVDcmVkaXRzLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgICBkaXNhYmxlQXBpVGVybWluYXRpb246IHByb3BzPy5kaXNhYmxlQXBpVGVybWluYXRpb24sXG4gICAgICAgIGVic09wdGltaXplZDogcHJvcHM/LmVic09wdGltaXplZCxcbiAgICAgICAgZW5jbGF2ZU9wdGlvbnM6IHByb3BzPy5uaXRyb0VuY2xhdmVFbmFibGVkICE9PSB1bmRlZmluZWQgPyB7XG4gICAgICAgICAgZW5hYmxlZDogcHJvcHMubml0cm9FbmNsYXZlRW5hYmxlZCxcbiAgICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgaGliZXJuYXRpb25PcHRpb25zOiBwcm9wcz8uaGliZXJuYXRpb25Db25maWd1cmVkICE9PSB1bmRlZmluZWQgPyB7XG4gICAgICAgICAgY29uZmlndXJlZDogcHJvcHMuaGliZXJuYXRpb25Db25maWd1cmVkLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgICBpYW1JbnN0YW5jZVByb2ZpbGU6IGlhbVByb2ZpbGUgIT09IHVuZGVmaW5lZCA/IHtcbiAgICAgICAgICBhcm46IGlhbVByb2ZpbGUuZ2V0QXR0KCdBcm4nKS50b1N0cmluZygpLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgICBpbWFnZUlkOiBpbWFnZUNvbmZpZz8uaW1hZ2VJZCxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBwcm9wcz8uaW5zdGFuY2VUeXBlPy50b1N0cmluZygpLFxuICAgICAgICBpbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3I6IHByb3BzPy5pbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3IsXG4gICAgICAgIGluc3RhbmNlTWFya2V0T3B0aW9uczogbWFya2V0T3B0aW9ucyxcbiAgICAgICAga2V5TmFtZTogcHJvcHM/LmtleU5hbWUsXG4gICAgICAgIG1vbml0b3Jpbmc6IHByb3BzPy5kZXRhaWxlZE1vbml0b3JpbmcgIT09IHVuZGVmaW5lZCA/IHtcbiAgICAgICAgICBlbmFibGVkOiBwcm9wcy5kZXRhaWxlZE1vbml0b3JpbmcsXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IHNlY3VyaXR5R3JvdXBzVG9rZW4sXG4gICAgICAgIHRhZ1NwZWNpZmljYXRpb25zOiB0YWdzVG9rZW4sXG4gICAgICAgIHVzZXJEYXRhOiB1c2VyRGF0YVRva2VuLFxuICAgICAgICBtZXRhZGF0YU9wdGlvbnM6IHRoaXMucmVuZGVyTWV0YWRhdGFPcHRpb25zKHByb3BzKSxcblxuICAgICAgICAvLyBGaWVsZHMgbm90IHlldCBpbXBsZW1lbnRlZDpcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1jYXBhY2l0eXJlc2VydmF0aW9uc3BlY2lmaWNhdGlvbi5odG1sXG4gICAgICAgIC8vIFdpbGwgcmVxdWlyZSBjcmVhdGluZyBhbiBMMiBmb3IgQVdTOjpFQzI6OkNhcGFjaXR5UmVzZXJ2YXRpb25cbiAgICAgICAgLy8gY2FwYWNpdHlSZXNlcnZhdGlvblNwZWNpZmljYXRpb246IHVuZGVmaW5lZCxcblxuICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLWNwdW9wdGlvbnMuaHRtbFxuICAgICAgICAvLyBjcHVPcHRpb25zOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWVsYXN0aWNncHVzcGVjaWZpY2F0aW9uLmh0bWxcbiAgICAgICAgLy8gZWxhc3RpY0dwdVNwZWNpZmljYXRpb25zOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS5odG1sI2Nmbi1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLWVsYXN0aWNpbmZlcmVuY2VhY2NlbGVyYXRvcnNcbiAgICAgICAgLy8gZWxhc3RpY0luZmVyZW5jZUFjY2VsZXJhdG9yczogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEuaHRtbCNjZm4tZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1rZXJuZWxpZFxuICAgICAgICAvLyBrZXJuZWxJZDogdW5kZWZpbmVkLFxuICAgICAgICAvLyByYW1EaXNrSWQ6IHVuZGVmaW5lZCxcblxuICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItbGF1bmNodGVtcGxhdGUtbGF1bmNodGVtcGxhdGVkYXRhLmh0bWwjY2ZuLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbGljZW5zZXNwZWNpZmljYXRpb25zXG4gICAgICAgIC8vIEFsc28gbm90IGltcGxlbWVudGVkIGluIEluc3RhbmNlIEwyXG4gICAgICAgIC8vIGxpY2Vuc2VTcGVjaWZpY2F0aW9uczogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEuaHRtbCNjZm4tZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS10YWdzcGVjaWZpY2F0aW9uc1xuICAgICAgICAvLyBTaG91bGQgYmUgaW1wbGVtZW50ZWQgdmlhIHRoZSBUYWdnaW5nIGFzcGVjdCBpbiBDREsgY29yZS4gQ29tcGxpY2F0aW9uIHdpbGwgYmUgdGhhdCB0aGlzIHRhZ2dpbmcgaW50ZXJmYWNlIGlzIHZlcnkgdW5pcXVlIHRvIExhdW5jaFRlbXBsYXRlcy5cbiAgICAgICAgLy8gdGFnU3BlY2lmaWNhdGlvbjogdW5kZWZpbmVkXG5cbiAgICAgICAgLy8gQ0RLIGhhcyBubyBhYnN0cmFjdGlvbiBmb3IgTmV0d29yayBJbnRlcmZhY2VzIHlldC5cbiAgICAgICAgLy8gbmV0d29ya0ludGVyZmFjZXM6IHVuZGVmaW5lZCxcblxuICAgICAgICAvLyBDREsgaGFzIG5vIGFic3RyYWN0aW9uIGZvciBQbGFjZW1lbnQgeWV0LlxuICAgICAgICAvLyBwbGFjZW1lbnQ6IHVuZGVmaW5lZCxcblxuICAgICAgfSxcbiAgICAgIHRhZ1NwZWNpZmljYXRpb25zOiBsdFRhZ3NUb2tlbixcbiAgICB9KTtcblxuICAgIFRhZ3Mub2YodGhpcykuYWRkKE5BTUVfVEFHLCB0aGlzLm5vZGUucGF0aCk7XG5cbiAgICB0aGlzLmRlZmF1bHRWZXJzaW9uTnVtYmVyID0gcmVzb3VyY2UuYXR0ckRlZmF1bHRWZXJzaW9uTnVtYmVyO1xuICAgIHRoaXMubGF0ZXN0VmVyc2lvbk51bWJlciA9IHJlc291cmNlLmF0dHJMYXRlc3RWZXJzaW9uTnVtYmVyO1xuICAgIHRoaXMubGF1bmNoVGVtcGxhdGVJZCA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLnZlcnNpb25OdW1iZXIgPSBUb2tlbi5hc1N0cmluZyhyZXNvdXJjZS5nZXRBdHQoJ0xhdGVzdFZlcnNpb25OdW1iZXInKSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlck1ldGFkYXRhT3B0aW9ucyhwcm9wczogTGF1bmNoVGVtcGxhdGVQcm9wcykge1xuICAgIGxldCByZXF1aXJlTWV0YWRhdGFPcHRpb25zID0gZmFsc2U7XG4gICAgLy8gaWYgcmVxdWlyZUltZHN2MiBpcyB0cnVlLCBodHRwVG9rZW5zIG11c3QgYmUgcmVxdWlyZWQuXG4gICAgaWYgKHByb3BzLnJlcXVpcmVJbWRzdjIgPT09IHRydWUgJiYgcHJvcHMuaHR0cFRva2VucyA9PT0gTGF1bmNoVGVtcGxhdGVIdHRwVG9rZW5zLk9QVElPTkFMKSB7XG4gICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRFcnJvcignaHR0cFRva2VucyBtdXN0IGJlIHJlcXVpcmVkIHdoZW4gcmVxdWlyZUltZHN2MiBpcyB0cnVlJyk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5odHRwRW5kcG9pbnQgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy5odHRwUHJvdG9jb2xJcHY2ICE9PSB1bmRlZmluZWQgfHwgcHJvcHMuaHR0cFB1dFJlc3BvbnNlSG9wTGltaXQgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgcHJvcHMuaHR0cFRva2VucyAhPT0gdW5kZWZpbmVkIHx8IHByb3BzLmluc3RhbmNlTWV0YWRhdGFUYWdzICE9PSB1bmRlZmluZWQgfHwgcHJvcHMucmVxdWlyZUltZHN2MiA9PT0gdHJ1ZSkge1xuICAgICAgcmVxdWlyZU1ldGFkYXRhT3B0aW9ucyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChyZXF1aXJlTWV0YWRhdGFPcHRpb25zKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBodHRwRW5kcG9pbnQ6IHByb3BzLmh0dHBFbmRwb2ludCA9PT0gdHJ1ZSA/ICdlbmFibGVkJyA6XG4gICAgICAgICAgcHJvcHMuaHR0cEVuZHBvaW50ID09PSBmYWxzZSA/ICdkaXNhYmxlZCcgOiB1bmRlZmluZWQsXG4gICAgICAgIGh0dHBQcm90b2NvbElwdjY6IHByb3BzLmh0dHBQcm90b2NvbElwdjYgPT09IHRydWUgPyAnZW5hYmxlZCcgOlxuICAgICAgICAgIHByb3BzLmh0dHBQcm90b2NvbElwdjYgPT09IGZhbHNlID8gJ2Rpc2FibGVkJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgaHR0cFB1dFJlc3BvbnNlSG9wTGltaXQ6IHByb3BzLmh0dHBQdXRSZXNwb25zZUhvcExpbWl0LFxuICAgICAgICBodHRwVG9rZW5zOiBwcm9wcy5yZXF1aXJlSW1kc3YyID09PSB0cnVlID8gTGF1bmNoVGVtcGxhdGVIdHRwVG9rZW5zLlJFUVVJUkVEIDogcHJvcHMuaHR0cFRva2VucyxcbiAgICAgICAgaW5zdGFuY2VNZXRhZGF0YVRhZ3M6IHByb3BzLmluc3RhbmNlTWV0YWRhdGFUYWdzID09PSB0cnVlID8gJ2VuYWJsZWQnIDpcbiAgICAgICAgICBwcm9wcy5pbnN0YW5jZU1ldGFkYXRhVGFncyA9PT0gZmFsc2UgPyAnZGlzYWJsZWQnIDogdW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIHNwZWNpZnlpbmcgc2VjdXJpdHkgZ3JvdXAgY29ubmVjdGlvbnMgZm9yIHRoZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQG5vdGUgT25seSBhdmFpbGFibGUgaWYgeW91IHByb3ZpZGUgYSBzZWN1cml0eUdyb3VwIHdoZW4gY29uc3RydWN0aW5nIHRoZSBMYXVuY2hUZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgY29ubmVjdGlvbnMoKTogQ29ubmVjdGlvbnMge1xuICAgIGlmICghdGhpcy5fY29ubmVjdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGF1bmNoVGVtcGxhdGUgY2FuIG9ubHkgYmUgdXNlZCBhcyBJQ29ubmVjdGFibGUgaWYgYSBzZWN1cml0eUdyb3VwIGlzIHByb3ZpZGVkIHdoZW4gY29uc3RydWN0aW5nIGl0LicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogUHJpbmNpcGFsIHRvIGdyYW50IHBlcm1pc3Npb25zIHRvLlxuICAgKlxuICAgKiBAbm90ZSBPbmx5IGF2YWlsYWJsZSBpZiB5b3UgcHJvdmlkZSBhIHJvbGUgd2hlbiBjb25zdHJ1Y3RpbmcgdGhlIExhdW5jaFRlbXBsYXRlLlxuICAgKi9cbiAgcHVibGljIGdldCBncmFudFByaW5jaXBhbCgpOiBpYW0uSVByaW5jaXBhbCB7XG4gICAgaWYgKCF0aGlzLl9ncmFudFByaW5jaXBhbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXVuY2hUZW1wbGF0ZSBjYW4gb25seSBiZSB1c2VkIGFzIElHcmFudGFibGUgaWYgYSByb2xlIGlzIHByb3ZpZGVkIHdoZW4gY29uc3RydWN0aW5nIGl0LicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZ3JhbnRQcmluY2lwYWw7XG4gIH1cbn1cbiJdfQ==